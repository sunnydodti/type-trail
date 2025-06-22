import { useState, useCallback, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import CustomWordsDialog from './CustomWordsDialog';
import styles from './Settings.module.css';

type SettingsTab = 'global' | 'wordMode' | 'sentenceMode' | 'keyBindings';

export default function Settings() {  const [activeTab, setActiveTab] = useState<SettingsTab>('global');
  const [isCustomWordsOpen, setIsCustomWordsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    global: { soundEnabled: false, soundVolume: 0.5, showWPM: false, saveStats: false },
    wordMode: { multiWordDefault: false, caseSensitive: false },
    sentenceMode: { punctuationRequired: false, caseSensitive: false }
  });
  const { settings, updateGlobalSettings, updateWordModeSettings, updateSentenceModeSettings, resetToDefaults } = useSettings();

  // Initialize local settings from context
  useEffect(() => {
    setLocalSettings({
      global: { ...settings.global },
      wordMode: { ...settings.wordMode },
      sentenceMode: { ...settings.sentenceMode }
    });
  }, [settings]);

  const handleGlobalBoolChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof typeof settings.global;
    setLocalSettings(prev => ({
      ...prev,
      global: { ...prev.global, [key]: e.target.checked }
    }));
    updateGlobalSettings({ [key]: e.target.checked });
  }, [updateGlobalSettings]);

  const handleGlobalRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof typeof settings.global;
    const value = Number(e.target.value);
    setLocalSettings(prev => ({
      ...prev,
      global: { ...prev.global, [key]: value }
    }));
    updateGlobalSettings({ [key]: value });
  }, [updateGlobalSettings]);

  const handleWordModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof typeof settings.wordMode;
    setLocalSettings(prev => ({
      ...prev,
      wordMode: { ...prev.wordMode, [key]: e.target.checked }
    }));
    updateWordModeSettings({ [key]: e.target.checked });
  }, [updateWordModeSettings]);

  const handleSentenceModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof typeof settings.sentenceMode;
    setLocalSettings(prev => ({
      ...prev,
      sentenceMode: { ...prev.sentenceMode, [key]: e.target.checked }
    }));
    updateSentenceModeSettings({ [key]: e.target.checked });
  }, [updateSentenceModeSettings]);

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsTabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'global' ? styles.active : ''}`}
          onClick={() => setActiveTab('global')}
        >
          Global Settings
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'wordMode' ? styles.active : ''}`}
          onClick={() => setActiveTab('wordMode')}
        >
          Word Mode
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'sentenceMode' ? styles.active : ''}`}
          onClick={() => setActiveTab('sentenceMode')}
        >
          Sentence Mode
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'keyBindings' ? styles.active : ''}`}
          onClick={() => setActiveTab('keyBindings')}
        >
          Key Bindings
        </button>
      </div>

      <div className={styles.settingsContent}>
        {activeTab === 'global' && (
          <div className={styles.settingsSection}>
            <h2>Global Settings</h2>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  name="soundEnabled"
                  checked={localSettings.global.soundEnabled}
                  onChange={handleGlobalBoolChange}
                />
                Enable Sound Effects
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                Sound Volume
                <input
                  type="range"
                  name="soundVolume"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localSettings.global.soundVolume}
                  onChange={handleGlobalRangeChange}
                />
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  name="showWPM"
                  checked={localSettings.global.showWPM}
                  onChange={handleGlobalBoolChange}
                />
                Show WPM
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  name="saveStats"
                  checked={localSettings.global.saveStats}
                  onChange={handleGlobalBoolChange}
                />
                Save Statistics
              </label>
            </div>
          </div>
        )}

        {activeTab === 'wordMode' && (
          <div className={styles.settingsSection}>
            <h2>Word Mode Settings</h2>            <div className={styles.settingItem}>
              <label>                <input
                type="checkbox"
                name="multiWordDefault"
                checked={localSettings.wordMode.multiWordDefault}
                onChange={handleWordModeChange}
              />
                Multi-word Mode Default
              </label>
            </div>
            <div className={styles.settingItem}>
              <button 
                className={styles.dialogButton}
                onClick={() => setIsCustomWordsOpen(true)}
              >
                Set Custom Words
              </button>
            </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  name="caseSensitive"
                  checked={localSettings.wordMode.caseSensitive}
                  onChange={handleWordModeChange}
                />
                Case Sensitive
              </label>
            </div>
          </div>
        )}

        {activeTab === 'sentenceMode' && (
          <div className={styles.settingsSection}>
            <h2>Sentence Mode Settings</h2>
            <div className={styles.settingItem}>
              <label>                <input
                type="checkbox"
                name="punctuationRequired"
                checked={localSettings.sentenceMode.punctuationRequired}
                onChange={handleSentenceModeChange}
              />
                Require Punctuation
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  name="caseSensitive"
                  checked={localSettings.sentenceMode.caseSensitive}
                  onChange={handleSentenceModeChange}
                />
                Case Sensitive
              </label>
            </div>
          </div>
        )}

        {activeTab === 'keyBindings' && (
          <div className={styles.settingsSection}>
            <h2>Key Bindings</h2>
            <div className={styles.keyBindingsGrid}>
              <h3>Global</h3>
              {Object.entries(settings.global.keyBindings).map(([key, binding]) => (
                <div key={key} className={styles.keyBinding}>
                  <span>{binding.description}</span>
                  <code>
                    {[
                      binding.ctrl && 'Ctrl',
                      binding.alt && 'Alt',
                      binding.shift && 'Shift',
                      binding.key,
                    ]
                      .filter(Boolean)
                      .join('+')}
                  </code>
                </div>
              ))}

              <h3>Word Mode</h3>
              {Object.entries(settings.wordMode.keyBindings).map(([key, binding]) => (
                <div key={key} className={styles.keyBinding}>
                  <span>{binding.description}</span>
                  <code>
                    {[
                      binding.ctrl && 'Ctrl',
                      binding.alt && 'Alt',
                      binding.shift && 'Shift',
                      binding.key,
                    ]
                      .filter(Boolean)
                      .join('+')}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.settingsActions}>          <button
          className={styles.resetButton}
          onClick={resetToDefaults}
        >
          Reset to Defaults
        </button>        </div>
      </div>

      <CustomWordsDialog
        isOpen={isCustomWordsOpen}
        onClose={() => setIsCustomWordsOpen(false)}
        onSave={(words) => {
          // Here you'll need to implement the word list saving logic
          console.log('Saving words:', words);
          setIsCustomWordsOpen(false);
        }}
        initialWords={Object.values(settings.wordMode.customWordLists).flat() || []}
      />
    </div>
  );
}
