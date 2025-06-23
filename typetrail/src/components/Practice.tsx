import { useState } from 'react';
import WordMode from './WordMode';
import StoryMode from './StoryMode';
import styles from './Practice.module.css';

type PracticeMode = 'word' | 'sentence' | 'story';

export default function Practice() {
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(() => {
    const saved = localStorage.getItem('practiceMode');
    return saved ? saved as PracticeMode : 'word';
  });

  const handleModeChange = (mode: PracticeMode) => {
    setPracticeMode(mode);
    localStorage.setItem('practiceMode', mode);
  };

  return (
    <div className={styles.practiceContainer}>
      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${practiceMode === 'word' ? styles.active : ''}`}
          onClick={() => handleModeChange('word')}
        >
          Word Mode
        </button>
        <button
          className={`${styles.button} ${practiceMode === 'story' ? styles.active : ''}`}
          onClick={() => handleModeChange('story')}
        >
          Story Mode
        </button>
        <button
          className={`${styles.button} ${practiceMode === 'sentence' ? styles.active : ''}`}
          onClick={() => handleModeChange('sentence')}
          disabled
        >
          Sentence Mode (coming soon...)
        </button>
      </div>

      <div className={styles.modeContent}>
        {practiceMode === 'word' && <WordMode />}
        {practiceMode === 'story' && <StoryMode />}
        {practiceMode === 'sentence' && <p>Sentence mode is under development.</p>}
      </div>
    </div>
  );
}
