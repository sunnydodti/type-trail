import { useState } from 'react';
import styles from './CustomWordsDialog.module.css';

interface CustomWordsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (words: string[]) => void;
  initialWords?: string[];
  multiWordMode?: boolean;
}

export default function CustomWordsDialog({ isOpen, onClose, onSave, initialWords = [], multiWordMode = true }: CustomWordsDialogProps) {
  const [words, setWords] = useState(initialWords.join(','));

  if (!isOpen) return null;
  const handleSave = () => {
    if (multiWordMode) {
      const wordList = words.split(',').map(w => w.trim()).filter(Boolean);
      onSave(wordList);
    } else {
      const singleWord = words.trim();
      onSave(singleWord ? [singleWord] : []);
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>      <div className={styles.dialog}>
        <h2>{multiWordMode ? 'Set Custom Word List' : 'Set Custom Word'}</h2>
        <p>
          {multiWordMode 
            ? 'Enter words separated by commas (e.g., hello,world,example).'
            : 'Enter a single word to practice.'}
        </p>
        <textarea
          value={words}
          onChange={(e) => setWords(e.target.value)}
          className={styles.textarea}
          rows={multiWordMode ? 4 : 2}
          placeholder={multiWordMode ? 'e.g., quick,brown,fox' : 'e.g., practice'}
          autoFocus
        />
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button onClick={handleSave} className={styles.saveButton}>Save</button>
        </div>
      </div>
    </div>
  );
}
