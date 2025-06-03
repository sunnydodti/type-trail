import React, { useState, useEffect } from 'react'
import { db } from '../db'
import styles from './WordMode.module.css'

const defaultWords = ['apple', 'banana', 'cherry', 'dragonfruit']

function getRandomWord(allWords: string[], excludeWord?: string): string {
    if (!allWords || allWords.length === 0) {
        return '';
    }

    let possibleWords = allWords;
    if (excludeWord) {
        possibleWords = allWords.filter(w => w !== excludeWord);
    }

    if (possibleWords.length === 0) {
        if (allWords.length > 0 && allWords.every(w => w === excludeWord)) {
            return allWords[0];
        }
        return '';
    }

    return possibleWords[Math.floor(Math.random() * possibleWords.length)];
}


export default function WordMode() {
    const [words, setWords] = useState<string[]>(defaultWords)
    const [multiWordMode, setMultiWordMode] = useState(false)
    const [word, setWord] = useState<string>('')
    const [input, setInput] = useState<string>('')
    
    const [isCustomWordModalOpen, setIsCustomWordModalOpen] = useState(false);
    const [customWordInputValue, setCustomWordInputValue] = useState('');


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
        setMaxStreak(0);
        setInput('');
    };

    useEffect(() => {
        resetStats();
        if (multiWordMode) {
            if (words.length > 0) {
                setWord(getRandomWord(words, word));
            } else {
                setWord(defaultWords.length > 0 ? getRandomWord(defaultWords) : '');
            }
        } else {
            if (words.length > 0) {
                setWord(words[0]);
            } else {
                setWord(defaultWords.length > 0 ? defaultWords[0] : '');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multiWordMode, words]);
    
    useEffect(() => {
        if (!word) return;

        if (input === word) {
            setCorrectCount((c) => c + 1)
            const newStreak = streak + 1;
            setStreak(newStreak);
            setMaxStreak((m) => Math.max(m, newStreak));
            setInput('')
            if (multiWordMode) {
                setWord(getRandomWord(words, word));
            }
        } else if (input.length >= word.length && input !== word) {
            setWrongCount((w) => w + 1)
            setStreak(0)
            setInput('')
        }
    }, [input, word, multiWordMode, words, streak]);

    useEffect(() => {
        if (multiWordMode) {
            setWord(words.length > 0 ? getRandomWord(words) : (defaultWords.length > 0 ? getRandomWord(defaultWords) : ''));
        } else {
            setWord(words[0] || (defaultWords.length > 0 ? defaultWords[0] : ''));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.shiftKey && (event.key === 'S' || event.key === 's')) {
                event.preventDefault();
                setIsCustomWordModalOpen(prev => !prev);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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

    const openCustomWordModal = () => {
        const isUsingDefaultWords = words.length === defaultWords.length && words.every((val, index) => val === defaultWords[index]);

        if (multiWordMode) {
            setCustomWordInputValue(isUsingDefaultWords ? '' : words.join(', '));
        } else {
            setCustomWordInputValue(isUsingDefaultWords ? '' : (words[0] || ''));
        }
        setIsCustomWordModalOpen(true);
    };

    const closeCustomWordModal = () => {
        setIsCustomWordModalOpen(false);
    };

    const handleSaveCustomWords = () => {
        const trimmedInput = customWordInputValue.trim();
        let newPracticeWords: string[] = [];

        if (trimmedInput === '') {
            newPracticeWords = defaultWords;
        } else {
            if (multiWordMode) {
                newPracticeWords = trimmedInput.split(',').map(w => w.trim()).filter(w => w.length > 0);
            } else {
                const singleWord = trimmedInput.split(',')[0].trim();
                if (singleWord.length > 0) newPracticeWords = [singleWord];
            }
        }
        if (newPracticeWords.length === 0) {
            newPracticeWords = defaultWords;
        }
        setWords(newPracticeWords);
        closeCustomWordModal();
    };

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

            <button onClick={openCustomWordModal} className={styles.setCustomWordButton}>
                Set Custom Word(s) (Shift+S)
            </button>

            <div className={styles.modeToggleContainer}>
                <button
                    className={styles.toggleButton}
                    onClick={() => setMultiWordMode((m) => !m)}
                >
                    {multiWordMode ? 'Practice Single Word' : 'Practice Multiple Words'}
                </button>
            </div>

            {isCustomWordModalOpen && (
                <div className={styles.modalOverlay} onClick={closeCustomWordModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>{multiWordMode ? "Set Custom Word List" : "Set Custom Word"}</h3>
                        <p className={styles.modalInstructions}>
                            {multiWordMode
                                ? "Enter words separated by commas (e.g., hello,world,example)."
                                : "Enter a single word to practice."}
                        </p>
                        <textarea
                            className={styles.customWordTextarea}
                            value={customWordInputValue}
                            onChange={(e) => setCustomWordInputValue(e.target.value)}
                            rows={multiWordMode ? 4 : 2}
                            placeholder={multiWordMode ? "e.g., quick,brown,fox" : "e.g., practice"}
                            autoFocus
                        />
                        <div className={styles.modalActions}>
                            <button onClick={handleSaveCustomWords} className={`${styles.modalButton} ${styles.modalButtonSave}`}>Save</button>
                            <button onClick={closeCustomWordModal} className={`${styles.modalButton} ${styles.modalButtonCancel}`}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
