import { useState } from 'react'
import WordMode from './components/WordMode'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import styles from './App.module.css'

export default function App() {
  const [mode, setMode] = useState<'word' | 'sentence'>('word')

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => setMode('word')}>
              Word Mode
            </button>
            <button className={styles.button} onClick={() => setMode('sentence')} disabled>
              Sentence Mode (coming soon...)
            </button>
          </div>

          <div>
            {mode === 'word' && <WordMode />}
            {mode === 'sentence' && <p>Sentence mode is under development.</p>}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
