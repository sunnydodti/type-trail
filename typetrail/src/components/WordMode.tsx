import React, { useState, useEffect } from 'react'
import { db } from '../db'
import styles from './WordMode.module.css'

const defaultWords = ['apple', 'banana', 'cherry', 'dragonfruit']

/**
 * Gets a random word from the list, optionally excluding a specific word.
 * @param allWords The list of words to choose from.
 * @param excludeWord An optional word to exclude from the selection.
 * @returns A random word, or an empty string if no suitable word can be found.
 */
function getRandomWord(allWords: string[], excludeWord?: string): string {
    if (!allWords || allWords.length === 0) {
        return '';
    }

    let possibleWords = allWords;
    if (excludeWord) {
        // Filter out the word to be excluded
        possibleWords = allWords.filter(w => w !== excludeWord);
    }

    if (possibleWords.length === 0) {
        // This means either the original list was empty,
        // or all words in the list were the 'excludeWord'.
        // If the original list (allWords) is not empty, but possibleWords is,
        // it implies all original words were the one to be excluded.
        // In this case, we cannot pick a *different* word.
        return '';
    }

    // Return a random word from the filtered list
    return possibleWords[Math.floor(Math.random() * possibleWords.length)];
}


export default function WordMode() {
    const [words, setWords] = useState<string[]>(defaultWords) // This could be dynamic later
    const [multiWordMode, setMultiWordMode] = useState(false)
    const [word, setWord] = useState<string>('') // Initialize with empty, useEffect will set it
    const [input, setInput] = useState<string>('')

    const [correctCount, setCorrectCount] = useState(0)
    const [wrongCount, setWrongCount] = useState(0)
    const [streak, setStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)

    const totalAttempts = correctCount + wrongCount
    const accuracy = totalAttempts === 0 ? 0 : Math.round((correctCount / totalAttempts) * 100)

    const resetStats = () => {
        setCorrectCount(0);
        setWrongCount(0);
        setStreak(0);
        setMaxStreak(0); // Reset max streak per mode session
        setInput('');
    };

    // Effect to handle mode changes (single/multi-word) and word list changes
    useEffect(() => {
        resetStats();
        if (multiWordMode) {
            setWord(getRandomWord(words, word)); // Get a new random word, try to exclude current
        } else {
            // For single word mode, or if words list is empty, use the first word or a default.
            setWord(words[0] || defaultWords[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multiWordMode, words]); // Rerun if mode or the base word list changes. `word` is intentionally omitted here as per logic.

    useEffect(() => {
        if (!word) return; // Do nothing if there's no current word

        if (input === word) {
            setCorrectCount((c) => c + 1)
            const newStreak = streak + 1;
            setStreak(newStreak);
            setMaxStreak((m) => Math.max(m, newStreak));
            setInput('')
            if (multiWordMode) {
                setWord(getRandomWord(words, word)); // Get a new word, exclude current one
            }
            // In single word mode, the word remains the same for repeated practice.
        } else if (input.length >= word.length && input !== word) {
            setWrongCount((w) => w + 1)
            setStreak(0)
            setInput('')
            // Word does not change on wrong attempt in either mode, user retries.
        }
    }, [input, word, multiWordMode, words, streak]);

    useEffect(() => {
        // Initialize word on mount based on initial mode
        if (multiWordMode) {
            setWord(getRandomWord(words));
        } else {
            setWord(words[0] || defaultWords[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    useEffect(() => {
        if (totalAttempts > 0) {
            db.stats.add({
                mode: multiWordMode ? 'word-multi' : 'word-single',
                date: new Date(),
                correct: correctCount,
                wrong: wrongCount,
                streak,
            }).catch(error => {
                console.error("Failed to save stats:", error);
            });
        }
    }, [correctCount, wrongCount, streak, multiWordMode, totalAttempts]);

    function renderWordOverlay() {
        if (!word) return <div className={styles.wordOverlay}>Loading word...</div>;
        return (
            <div className={styles.wordOverlay}>
                {word.split('').map((char, i) => {
                    const isCorrect = input[i] === char
                    const isTyped = i < input.length
                    return (
                        <span
                            key={i}
                            className={`${styles.letter} ${isTyped ? (isCorrect ? styles.correct : styles.incorrect) : ''}`}
                        >
                            {char}
                        </span>
                    )
                })}
            </div>
        )
    }

    return (
        <div className={styles.wordModeRoot}>
            <div className={styles.statsDisplay}>
                <span>Total: {totalAttempts}</span>
                <span>Acc: {accuracy}%</span>
                <span>✔: {correctCount}</span>
                <span>✘: {wrongCount}</span>
                <span>Streak: {streak}</span>
                <span>Max: {maxStreak}</span>
            </div>

            {/* The h2 title "Word Mode" and p "Type the word:" are removed for compactness */}
            
            {renderWordOverlay()}
            
            <input
                className={styles.inputField}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                spellCheck={false}
                disabled={!word}
                placeholder={word ? "Type here..." : "No word selected"}
            />

            <div className={styles.modeToggleContainer}>
                <button
                    className={styles.toggleButton}
                    onClick={() => setMultiWordMode((m) => !m)}
                >
                    {multiWordMode ? 'Practice Single Word' : 'Practice Multiple Words'}
                </button>
            </div>
        </div>
    )
}
