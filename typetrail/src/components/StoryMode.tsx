import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { StoryFile, StoryProgress } from '../types/story';
import { parseContent } from '../utils/contentParser';
import { Button } from './Button';
import styles from './StoryMode.module.css';

// Track typed characters and their correctness
interface TypedChar {
  char: string;
  correct: boolean;
}



export default function StoryMode() {
  const [files, setFiles] = useState<StoryFile[]>([]);
  const [typedChars, setTypedChars] = useState<TypedChar[]>([]);
  const [progress, setProgress] = useState<StoryProgress>({
    fileIndex: 0,
    charIndex: 0,
    correctChars: 0,
    errors: 0
  });



  // Handle file input
  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: StoryFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const text = await file.text();
      const fileType = file.name.split('.').pop() as 'txt' | 'html' | 'json';
      const content = await parseContent(text, fileType);
      if (content) {
        newFiles.push({
          name: file.name,
          content,
          type: fileType
        });
      }
    }

    if (newFiles.length > 0) {
      setFiles(newFiles);
      setProgress({
        fileIndex: 0,
        charIndex: 0,
        correctChars: 0,
        errors: 0,
        startTime: Date.now()
      });
      setTypedChars([]);
    }
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Compare characters for typing accuracy
  const compareChars = (typed: string, expected: string): boolean => {
    return typed === expected;
  };

  // Process content into lines based on word boundaries and newlines
  const normalizeContent = useCallback((content: string): string[] => {
    const textLines = content.split('\n');
    const result: string[] = [];

    for (const line of textLines) {
      if (!line.trim()) continue; // Skip empty lines

      // Split into words and break at word boundaries
      const words = line.trim().split(' ').filter(w => w.length > 0);
      let currentLine = '';

      for (const word of words) {
        const newLine = currentLine + (currentLine ? ' ' : '') + word;
        if (newLine.length > 120) { // Use a reasonable max length
          result.push(currentLine);
          currentLine = word;
        } else {
          currentLine = newLine;
        }
      }

      if (currentLine) {
        result.push(currentLine);
      }
    }

    return result;
  }, []);

  // Get current content lines
  const currentContent = useMemo(() => {
    if (!files[progress.fileIndex]?.content) return [];
    return normalizeContent(files[progress.fileIndex].content);
  }, [files, progress.fileIndex, normalizeContent]);

  // Get visible lines based on current position
  const visibleLines = useMemo(() => {
    if (currentContent.length === 0) return [];

    let currentLineIndex = 0;
    let totalChars = 0;
    
    while (currentLineIndex < currentContent.length && totalChars + currentContent[currentLineIndex].length <= progress.charIndex) {
      totalChars += currentContent[currentLineIndex].length;
      currentLineIndex++;
    }

    const middleLine = currentLineIndex;
    const startLine = Math.max(0, middleLine - 1);
    const endLine = Math.min(currentContent.length - 1, middleLine + 1);

    return currentContent.slice(startLine, endLine + 1);
  }, [currentContent, progress.charIndex]);

  // Handle typing
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const content = currentContent.join('\n').trim();
    if (!content) return;

    if (event.key === 'Backspace') {
      if (progress.charIndex > 0) {
        setProgress(prev => ({
          ...prev,
          charIndex: prev.charIndex - 1
        }));
        setTypedChars(prev => prev.slice(0, -1));
      }
      return;
    }

    if (event.key.length === 1) {
      const expectedChar = content[progress.charIndex];
      if (!expectedChar) return;

      const isCorrect = compareChars(event.key, expectedChar);
      setTypedChars(prev => [...prev, { char: event.key, correct: isCorrect }]);
      
      setProgress(prev => ({
        ...prev,
        charIndex: prev.charIndex + 1,
        correctChars: prev.correctChars + (isCorrect ? 1 : 0),
        errors: prev.errors + (isCorrect ? 0 : 1)
      }));
    }
  }, [currentContent, progress.charIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Restart current file
  const handleRestart = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      charIndex: 0,
      correctChars: 0,
      errors: 0
    }));
    setTypedChars([]);
  }, []);

  // Move between files
  const moveToFile = useCallback((direction: number) => {
    const newIndex = progress.fileIndex + direction;
    if (newIndex >= 0 && newIndex < files.length) {
      setProgress({
        fileIndex: newIndex,
        charIndex: 0,
        correctChars: 0,
        errors: 0
      });
      setTypedChars([]);
    }
  }, [files.length, progress.fileIndex]);

  // Calculate total characters before current line for indexing
  const getGlobalIndex = useCallback((lineIndex: number, charIndex: number) => {
    return visibleLines
      .slice(0, lineIndex)
      .reduce((sum, line) => sum + line.length, 0) + charIndex;
  }, [visibleLines]);

  // Render visible lines with typing indicators
  const renderVisibleLines = () => {
    return visibleLines.map((line, i) => {
      const chars = line.split('').map((char, charIndex) => {
        const globalIndex = getGlobalIndex(i, charIndex);
        const isTyped = globalIndex < progress.charIndex;
        const isCurrentChar = globalIndex === progress.charIndex;
        const typedChar = typedChars[globalIndex];

        const charClasses = [styles.char];
        if (isTyped && typedChar) {
          charClasses.push(typedChar.correct ? styles.correct : styles.incorrect);
        }
        if (isCurrentChar) {
          charClasses.push(styles.current);
        }

        return (
          <span key={charIndex} className={charClasses.join(' ')}>
            {char === ' ' ? '␣' : char}
            {isCurrentChar && <span className={styles.cursor} />}
          </span>
        );
    });

      return (
        <div key={i} className={styles.line}>
          {chars}
        </div>
      );
    });
  };

  return (
    <div 
      className={styles.container}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {!files.length ? (
        // Drop zone when no files are loaded
        <div className={styles.dropZone}>
          <div className={styles.dropText}>
            Drop text files here to start typing
          </div>
          <div className={styles.dropControls}>
            <input
              type="file"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              accept=".txt,.html"
              className={styles.fileInput}
              id="file-input"
            />
            <label htmlFor="file-input" className={styles.fileInputLabel}>
              Select Files
            </label>
          </div>
        </div>
      ) : (
        // Story display when files are loaded
        <>
          <div className={styles.textContainer}>
            <div className={styles.storyArea}>
              {renderVisibleLines()}
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.fileControls}>
              <input
                type="file"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                accept=".txt,.html"
                className={styles.fileInput}
                id="new-file-input"
              />
              <label htmlFor="new-file-input" className={styles.fileInputLabel}>
                Select New Files
              </label>
            </div>
            <Button onClick={() => moveToFile(-1)} disabled={progress.fileIndex === 0}>
              Previous File
            </Button>
            <Button onClick={handleRestart}>
              Restart
            </Button>
            <Button
              onClick={() => moveToFile(1)}
              disabled={progress.fileIndex === files.length - 1}
            >
              Next File
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
