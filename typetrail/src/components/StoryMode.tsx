import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { StoryFile, StoryProgress } from '../types/story';
import { useSettings } from '../hooks/useSettings';
import { parseContent } from '../utils/contentParser';
import { Button } from './Button';
import { TagSelector } from './TagSelector';
import styles from './StoryMode.module.css';

const CHARS_PER_LINE = 50;
const VISIBLE_LINES = 3;

// Track typed characters and their correctness
interface TypedChar {
  char: string;
  correct: boolean;
}

export default function StoryMode() {
  // State
  const [files, setFiles] = useState<StoryFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [typedChars, setTypedChars] = useState<TypedChar[]>([]);
  const [progress, setProgress] = useState<StoryProgress>({
    currentFile: '',
    currentPosition: 0,
    correctChars: 0,
    totalChars: 0,
    errors: 0,
    startTime: undefined
  });

  // Settings
  const { settings } = useSettings();
  const { keyBindings, showFileName } = settings.storyMode;

  // Helpers
  const resetProgress = useCallback((fileName: string) => {
    setProgress({
      currentFile: fileName,
      currentPosition: 0,
      correctChars: 0,
      totalChars: 0,
      errors: 0,
      startTime: undefined
    });
    setTypedChars([]);
  }, []);

  const moveToFile = useCallback((direction: number) => {
    const newIndex = currentFileIndex + direction;
    if (newIndex >= 0 && newIndex < files.length) {
      setCurrentFileIndex(newIndex);
      setTypedChars([]);
      resetProgress(files[newIndex].name);
    }  }, [currentFileIndex, files, resetProgress]);

  const compareChars = (typed: string, expected: string): boolean => {
    return typed === expected;
  };

  // Process content into lines of exactly CHARS_PER_LINE characters
  const normalizeContent = useCallback((content: string): string[] => {
    // Split content into lines first
    const textLines = content.split('\n');
    const result: string[] = [];
    
    // Process each line separately to maintain line breaks
    for (const line of textLines) {
      if (!line.trim()) continue; // Skip empty lines
      
      const words = line.trim().split(' ').filter(w => w.length > 0);
      let currentLine = '';
      
      for (const word of words) {
        const newLength = currentLine.length + word.length + (currentLine.length > 0 ? 1 : 0);
        
        if (newLength > CHARS_PER_LINE) {
          result.push(currentLine.padEnd(CHARS_PER_LINE));
          currentLine = word;
        } else {
          currentLine += (currentLine.length > 0 ? ' ' : '') + word;
        }
      }
      
      if (currentLine.length > 0) {
        result.push(currentLine.padEnd(CHARS_PER_LINE));
      }
    }
    
    return result;
  }, []);

  // Current file and content
  const currentFile = files[currentFileIndex];
  const parsedContent = currentFile ? parseContent(currentFile.content, currentFile.type) : '';
  const normalizedLines = normalizeContent(parsedContent);

  // Calculate cursor position relative to current line
  const getCursorPosition = useCallback(() => {
    const charWidth = 0.6; // em units, matching the cursor width in CSS
    const pos = progress.currentPosition % CHARS_PER_LINE;
    return `${pos * charWidth}em`;
  }, [progress.currentPosition]);

  // Render visible text with highlighting
  const renderLines = useCallback(() => {
    if (!parsedContent) return null;

    const currentLineIndex = Math.floor(progress.currentPosition / CHARS_PER_LINE);
    let startLine = Math.max(0, currentLineIndex - 1);

    // Adjust for beginning and end
    if (currentLineIndex === 0) {
      startLine = 0;
    } else if (currentLineIndex >= normalizedLines.length - 1) {
      startLine = Math.max(0, normalizedLines.length - VISIBLE_LINES);
    }

    const visibleLines = normalizedLines.slice(startLine, startLine + VISIBLE_LINES);

    return visibleLines.map((line, i) => {
      const lineStartPos = (startLine + i) * CHARS_PER_LINE;
      const lineEndPos = lineStartPos + CHARS_PER_LINE;
      const isCurrentLine = progress.currentPosition >= lineStartPos && progress.currentPosition < lineEndPos;      // Split line into typed and untyped parts
      const linePos = progress.currentPosition - lineStartPos;
      const relativePos = linePos >= 0 && linePos < CHARS_PER_LINE ? linePos : -1;

      return (
        <div key={startLine + i} className={styles.storyLine}>
          <span className={styles.textLine}>
            {[...line].map((char, charIndex) => {
              const isTyped = charIndex < relativePos;
              const isCurrent = charIndex === relativePos;
              const typedCharInfo = typedChars[lineStartPos + charIndex];
                // Special handling for spaces
              const isSpace = char === ' ';
              return (
                <span 
                  key={lineStartPos + charIndex}
                  className={`
                    ${isTyped ? styles.typed : styles.untyped}
                    ${isTyped && typedCharInfo?.correct ? styles.correct : ''}
                    ${isTyped && !typedCharInfo?.correct ? styles.incorrect : ''}
                    ${isCurrent ? styles.currentChar : ''}
                    ${isSpace ? styles.space : ''}
                  `}
                >
                  {isSpace ? ' ' : char}
                </span>
              );
            })}
            {isCurrentLine && (
              <span 
                className={styles.cursor}
                style={{ transform: `translateX(${getCursorPosition()})` }}
              />
            )}
          </span>
        </div>
      );
    });
  }, [parsedContent, progress.currentPosition, normalizedLines, typedChars, getCursorPosition]);

  // Handle keyboard events
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!currentFile || !normalizedLines.length) return;

    // Calculate current line and position within that line
    const lineIndex = Math.floor(progress.currentPosition / CHARS_PER_LINE);
    const linePosition = progress.currentPosition % CHARS_PER_LINE;
    const currentLine = normalizedLines[lineIndex];
    
    if (!currentLine) return;
    const expectedChar = currentLine[linePosition];
    if (!expectedChar) return;

    // Debug output
    console.log(`Line ${lineIndex}, Pos ${linePosition}, Expected: '${expectedChar}', Typed: '${e.key}'`);
    console.log(`Current line: "${currentLine}"`);

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        setTypedChars(prev => prev.slice(0, -1));
        setProgress(prev => ({
          ...prev,
          currentPosition: prev.currentPosition - 1,
          totalChars: prev.totalChars - 1,
          correctChars: prev.correctChars - (
            prev.currentPosition > 0 && typedChars[typedChars.length - 1].correct ? 1 : 0
          )
        }));
      }
      return;
    }

    // Only handle printable characters and space
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === ' ') e.preventDefault(); // Prevent page scrolling on space

    const isCorrect = e.key === expectedChar;
    
    if (!progress.startTime) {
      setProgress(prev => ({ ...prev, startTime: Date.now() }));
    }

    setTypedChars(prev => [...prev, { char: e.key, correct: isCorrect }]);
    setProgress(prev => ({
      ...prev,
      currentPosition: prev.currentPosition + 1,
      correctChars: prev.correctChars + (isCorrect ? 1 : 0),
      totalChars: prev.totalChars + 1,
      errors: prev.errors + (isCorrect ? 0 : 1)
    }));
  }, [currentFile, normalizedLines, progress.currentPosition, progress.startTime, typedChars]);

  // Set up keyboard event listeners
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey && keyBindings.nextFile && e.key === keyBindings.nextFile.key) {
        e.preventDefault();
        moveToFile(1);
      } else if (e.ctrlKey && keyBindings.prevFile && e.key === keyBindings.prevFile.key) {
        e.preventDefault();
        moveToFile(-1);
      } else {
        // Handle typing
        handleKeyPress(e);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleKeyPress, keyBindings, moveToFile]);

  // Handle file drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.items);
    const filePromises = items
      .filter(item => item.kind === 'file')
      .map(item => item.getAsFile())
      .filter((file): file is File => file !== null)
      .map(file => new Promise<StoryFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            path: file.name, // Using file name as path since we're handling drag & drop
            content: reader.result as string,
            type: file.name.endsWith('.html') ? 'html' :
              file.name.endsWith('.json') ? 'json' : 'txt'
          });
        };
        reader.onerror = reject;
        reader.readAsText(file);
      }));

    Promise.all(filePromises).then(newFiles => {
      setFiles(newFiles);
      setCurrentFileIndex(0);
      resetProgress(newFiles[0].name);
    });
  }, [resetProgress]);

  // File selection handler
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const fileContents: StoryFile[] = await Promise.all(
      selectedFiles.map(async (file) => ({
        name: file.name,
        content: await file.text(),
        type: file.name.endsWith('.html') ? 'html' : 'txt'
      }))
    );
    setFiles(fileContents);
    if (fileContents.length > 0) {
      resetProgress(fileContents[0].name);
    }
  }, [resetProgress]);

  // Paste text handler
  const handlePasteText = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const pastedFile: StoryFile = {
        name: 'Pasted Text',
        content: text,
        type: 'txt'
      };
      setFiles([pastedFile]);
      resetProgress(pastedFile.name);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  }, [resetProgress]);

  // Calculate stats
  const wpm = useMemo(() => {
    if (!progress.startTime || !progress.totalChars) return 0;
    const minutes = (Date.now() - progress.startTime) / 60000;
    return Math.round((progress.correctChars / 5) / minutes);
  }, [progress.startTime, progress.totalChars, progress.correctChars]);

  const accuracy = useMemo(() => {
    if (!progress.totalChars) return 0;
    return Math.round((progress.correctChars / progress.totalChars) * 100);
  }, [progress.totalChars, progress.correctChars]);

  return (
    <div className={styles.storyContainer}>
      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total:</span>
          <span className={styles.statValue}>{progress.totalChars}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Acc:</span>
          <span className={styles.statValue}>{accuracy}%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>✓:</span>
          <span className={styles.statValue}>{progress.correctChars}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>✗:</span>
          <span className={styles.statValue}>{progress.errors}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>WPM:</span>
          <span className={styles.statValue}>{wpm}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      {files.length > 0 && (
        <div className={styles.controlsContainer}>
          <Button
            onClick={() => moveToFile(-1)}
            disabled={currentFileIndex <= 0}
          >
            Previous File
          </Button>
          <Button
            onClick={() => moveToFile(1)}
            disabled={currentFileIndex >= files.length - 1}
          >
            Next File
          </Button>
          <TagSelector />
        </div>
      )}

      {/* Story Viewport */}
      <div className={styles.storyViewport}>
        {files.length === 0 ? (
          <div className={styles.dropZone}>
            <input
              type="file"
              multiple
              accept=".txt,.html"
              onChange={handleFileSelect}
              className={styles.fileInput}
              id="file-input"
            />
            <label htmlFor="file-input" className={styles.fileInputLabel}>
              Select Files
            </label>
            <Button onClick={handlePasteText}>
              Paste Text
            </Button>
            <div className={styles.dropText}>
              or drop text files here to start typing
            </div>
          </div>
        ) : (
          <>
            {currentFile && showFileName && (
              <div className={styles.fileName}>
                {currentFile.name}
              </div>
            )}
            
            <div className={styles.storyText}>
              {parsedContent ? renderLines() : (
                <div className={styles.placeholder}>
                  Drop a text file here to start typing
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
