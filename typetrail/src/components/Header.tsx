import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>TypeTrail</h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="#practice">Practice</a></li>
          <li><a href="#stats">Statistics</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      </nav>
    </header>
  )
}
