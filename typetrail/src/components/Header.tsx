import styles from './Header.module.css'
import { useTheme } from '../context/theme'

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>TypeTrail</h1>
      </div>
      <nav className={styles.nav}>        <ul>          <li><button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'practice' }))}>Practice</button></li>
          <li><button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'stats' }))}>Statistics</button></li>
          <li><button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'settings' }))}>Settings</button></li>
          <li>
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
