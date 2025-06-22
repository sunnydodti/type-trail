import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (<aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>      <button
    className={styles.collapseButton}
    onClick={() => setIsCollapsed((prev: boolean) => !prev)}
    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
  >
    {isCollapsed ? '❯' : '❮'}
  </button>

    <div className={styles.sidebarContent}>
      <div className={styles.stats}>
        <h3>Quick Stats</h3>
        <ul>
          <li>
            <span className={styles.label}>Today's Practice:</span>
            <span className={styles.value}>0 words</span>
          </li>
          <li>
            <span className={styles.label}>Best Streak:</span>
            <span className={styles.value}>0</span>
          </li>
          <li>
            <span className={styles.label}>Accuracy:</span>
            <span className={styles.value}>0%</span>
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
    </div>
  </aside>
  )
}
