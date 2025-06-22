import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.stats}>
        <h3>Quick Stats</h3>
        <ul>
          <li>
            <span>Today's Practice:</span>
            <span>0 words</span>
          </li>
          <li>
            <span>Best Streak:</span>
            <span>0</span>
          </li>
          <li>
            <span>Accuracy:</span>
            <span>0%</span>
          </li>
        </ul>
      </div>
        <div className={styles.quickSettings}>
        <h3>Quick Settings</h3>
        <div className={styles.settingItem}>
          <label>Word List</label>
          <select>
            <option value="default">Default</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
    </aside>
  )
}
