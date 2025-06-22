import { useState } from 'react';
import WordMode from './WordMode';
import styles from './Practice.module.css';

type PracticeMode = 'word' | 'sentence';

export default function Practice() {
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('word');

  return (
    <div className={styles.practiceContainer}>
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

      <div className={styles.modeContent}>
        {practiceMode === 'word' && <WordMode />}
        {practiceMode === 'sentence' && <p>Sentence mode is under development.</p>}
      </div>
    </div>
  );
}
