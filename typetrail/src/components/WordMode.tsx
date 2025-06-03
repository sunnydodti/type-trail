import React, { useState, useEffect } from 'react'
import { db } from '../db'
import styles from './WordMode.module.css'

const defaultWords = ['apple', 'banana', 'cherry', 'dragonfruit']

function getRandomWord(words: string[], exclude: string): string {
    let word
    do {
        word = words[Math.floor(Math.random() * words.length)]
    } while (word === exclude && words.length > 1)
    return word
}

export default function WordMode() {
    const [words, setWords] = useState<string[]>(defaultWords)
    const [multiWordMode, setMultiWordMode] = useState(false)
    const [word, setWord] = useState<string>(defaultWords[0])
    const [input, setInput] = useState<string>('')

    const [correctCount, setCorrectCount] = useState(0)
    const [wrongCount, setWrongCount] = useState(0)
    const [streak, setStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)

    const totalAttempts = correctCount + wrongCount
    const accuracy = totalAttempts === 0 ? 0 : Math.round((correctCount / totalAttempts) * 100)

    useEffect(() => {
        if (input === word) {
            setCorrectCount((c) => c + 1)
            setStreak((s) => s + 1)
            setMaxStreak((m) => Math.max(m, streak + 1))
            setInput('')
            if (multiWordMode) setWord(getRandomWord(words, word))
        } else if (input.length >= word.length) {
            setWrongCount((w) => w + 1)
            setStreak(0)
            setInput('')
        }
    }, [input])

    useEffect(() => {
        if (totalAttempts > 0) {
            db.stats.add({
                mode: 'word',
                date: new Date(),
                correct: correctCount,
                wrong: wrongCount,
                streak,
            })
        }
    }, [correctCount, wrongCount, streak])

    function renderWordOverlay() {
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
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Word Mode</h2>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={() => setMultiWordMode((m) => !m)}>
                    {multiWordMode ? 'Single Word Mode' : 'Multi Word Mode'}
                </button>
            </div>

            <div className={styles.container}>
                <p>Type the word:</p>
                {renderWordOverlay()}
                <input
                    className={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                    spellCheck={false}
                />
                <div className={styles.stats}>
                    <span>Total: {totalAttempts}</span>
                    <span>Acc: {accuracy}%</span>
                    <span>✔: {correctCount}</span>
                    <span>✘: {wrongCount}</span>
                    <span>Streak: {streak}</span>
                    <span>Max: {maxStreak}</span>
                </div>
            </div>
        </div>
    )
}
