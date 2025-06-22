import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Settings from './components/Settings'
import Practice from './components/Practice'
import styles from './App.module.css'
import { SettingsProvider } from './context/SettingsContext'

type Page = 'practice' | 'stats' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('practice');

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
              {currentPage === 'practice' && <Practice />}
              {currentPage === 'stats' && <div>Statistics page coming soon...</div>}
              {currentPage === 'settings' && <Settings />}
            </main>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </SettingsProvider>
  )
}
