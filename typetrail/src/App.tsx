import { useState } from 'react'
import WordMode from './components/WordMode'
import styles from './App.module.css'

export default function App() {
  const [mode, setMode] = useState<'word' | 'sentence'>('word')

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>TypeTrail</h1>

      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => setMode('word')}>
          Word Mode
        </button>
        <button className={styles.button} onClick={() => setMode('sentence')} disabled>
          Sentence Mode (coming soon)
        </button>
      </div>

      <div>
        {mode === 'word' && <WordMode />}
        {mode === 'sentence' && <p>Sentence mode is under development.</p>}
      </div>
    </div>
  )
}
