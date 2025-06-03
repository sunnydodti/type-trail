import React, { useState, useEffect } from 'react'
import { db } from '../db'
import styles from './WordMode.module.css' // import CSS module

const defaultWords = ['apple', 'banana', 'cherry', 'dragonfruit']

function getRandomWord(words: string[]) {
	return words[Math.floor(Math.random() * words.length)]
}

export default function WordMode() {
	const [word, setWord] = useState<string>(getRandomWord(defaultWords))
	const [input, setInput] = useState<string>('')
	const [count, setCount] = useState<number>(0)
	const [correct, setCorrect] = useState<number>(0)
	const [wrong, setWrong] = useState<number>(0)
	const [streak, setStreak] = useState<number>(0)
	const [maxStreak, setMaxStreak] = useState<number>(0)

	useEffect(() => {
		if (input === word) {
			setCorrect(correct + 1)
			setStreak(streak + 1)
			setMaxStreak(Math.max(maxStreak, streak + 1))
			setCount(count + 1)
			setInput('')
			setWord(getRandomWord(defaultWords))
		} else if (input.length >= word.length) {
			setWrong(wrong + 1)
			setStreak(0)
			setInput('')
		}
	}, [input])

	useEffect(() => {
		db.stats.add({
			mode: 'word',
			date: new Date(),
			correct,
			wrong,
			streak,
		})
	}, [correct, wrong, streak])

	return (
		<div className={styles.container}>
			<h2>Word Mode</h2>
			<p>Type the word:</p>
			<h1 className={styles.word}>{word}</h1>
			<input
				className={styles.input}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				autoFocus
				spellCheck={false}
			/>
			<div className={styles.stats}>
				<p>Correct: {correct}</p>
				<p>Wrong: {wrong}</p>
				<p>Current Streak: {streak}</p>
				<p>Max Streak: {maxStreak}</p>
			</div>
		</div>
	)
}
