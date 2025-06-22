import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import styles from './Settings.module.css';

type SettingsTab = 'global' | 'wordMode' | 'sentenceMode' | 'keyBindings';

export default function Settings() {
  const { settings, updateGlobalSettings, updateWordModeSettings, updateSentenceModeSettings, resetToDefaults } = useSettings();
  const [activeTab, setActiveTab] = useState<SettingsTab>('global');

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
                  checked={settings.global.soundEnabled}
                  onChange={(e) => updateGlobalSettings({ soundEnabled: e.target.checked })}
                />
                Enable Sound Effects
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                Sound Volume
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.global.soundVolume}
                  onChange={(e) => updateGlobalSettings({ soundVolume: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.global.showWPM}
                  onChange={(e) => updateGlobalSettings({ showWPM: e.target.checked })}
                />
                Show WPM
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.global.saveStats}
                  onChange={(e) => updateGlobalSettings({ saveStats: e.target.checked })}
                />
                Save Statistics
              </label>
            </div>
          </div>
        )}

        {activeTab === 'wordMode' && (
          <div className={styles.settingsSection}>
            <h2>Word Mode Settings</h2>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.wordMode.multiWordDefault}
                  onChange={(e) => updateWordModeSettings({ multiWordDefault: e.target.checked })}
                />
                Multi-word Mode Default
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.wordMode.caseSensitive}
                  onChange={(e) => updateWordModeSettings({ caseSensitive: e.target.checked })}
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
              <label>
                <input
                  type="checkbox"
                  checked={settings.sentenceMode.punctuationRequired}
                  onChange={(e) => updateSentenceModeSettings({ punctuationRequired: e.target.checked })}
                />
                Require Punctuation
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.sentenceMode.caseSensitive}
                  onChange={(e) => updateSentenceModeSettings({ caseSensitive: e.target.checked })}
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

        <div className={styles.settingsActions}>
          <button 
            className={styles.resetButton}
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
