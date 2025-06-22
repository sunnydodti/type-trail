import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import WordMode from './components/WordMode'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Settings from './components/Settings'
import styles from './App.module.css'
import { SettingsProvider } from './context/SettingsContext'

type Page = 'practice' | 'stats' | 'settings';
type PracticeMode = 'word' | 'sentence';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('practice');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('word');

  useEffect(() => {
    document.documentElement.style.backgroundColor = 'var(--bg-secondary)';
    document.documentElement.style.color = 'var(--text-primary)';

    const handleNavigation = (event: CustomEvent<Page>) => {
      setCurrentPage(event.detail);
    };

    window.addEventListener('navigate', handleNavigation as EventListener);
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
    };
  }, []);

  return (
    <SettingsProvider>
      <ThemeProvider>
        <Header />
        <div className={styles.wrapper}>
          <Sidebar />
          <div className={styles.mainContainer}>
            <main className={styles.mainContent}>
              {currentPage === 'practice' && (
                <>
                  <div className={styles.buttons}>
                    <button
                      className={`${styles.button} ${practiceMode === 'word' ? styles.active : ''}`}
                      onClick={() => setPracticeMode('word')}
                    >
                      Word Mode
                    </button>
                    <button
                      className={`${styles.button} ${practiceMode === 'sentence' ? styles.active : ''}`}
                      onClick={() => setPracticeMode('sentence')}
                      disabled
                    >
                      Sentence Mode (coming soon...)
                    </button>
                  </div>

                  <div>
                    {practiceMode === 'word' && <WordMode />}
                    {practiceMode === 'sentence' && <p>Sentence mode is under development.</p>}
                  </div>
                </>
              )}

              {currentPage === 'stats' && (
                <div>Statistics page coming soon...</div>
              )}

              {currentPage === 'settings' && <Settings />}

            </main>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </SettingsProvider>
  )
}
