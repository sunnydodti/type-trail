import { db } from '../db';
import type { AppSettings, GlobalSettings, WordModeSettings, SentenceModeSettings } from '../types/settings';

const DEFAULT_SETTINGS: AppSettings = {
  version: 1,
  global: {
    theme: 'dark',
    soundEnabled: true,
    soundVolume: 0.5,
    showWPM: true,
    saveStats: true,
    keyBindings: {
      toggleTheme: {
        key: 't',
        shift: true,
        description: 'Toggle dark/light theme',
      },
      openSettings: {
        key: 's',
        shift: true,
        description: 'Open settings panel',
      },
      toggleSound: {
        key: 'm',
        shift: true,
        description: 'Toggle sound',
      },
    },
  },
  wordMode: {
    multiWordDefault: false,
    caseSensitive: false,
    showStats: true,
    customWordLists: {},
    keyBindings: {
      toggleMultiWord: {
        key: 'w',
        shift: true,
        description: 'Toggle multi-word mode',
      },
      openCustomWords: {
        key: 's',
        shift: true,
        description: 'Open custom words panel',
      },
      resetStats: {
        key: 'r',
        shift: true,
        description: 'Reset current stats',
      },
      skipWord: {
        key: 'Tab',
        description: 'Skip current word',
      },
    },
  },
  sentenceMode: {
    punctuationRequired: true,
    caseSensitive: true,
    showStats: true,
    customSentences: [],
    keyBindings: {
      skipSentence: {
        key: 'Tab',
        description: 'Skip current sentence',
      },
      togglePunctuation: {
        key: 'p',
        shift: true,
        description: 'Toggle punctuation requirement',
      },
      resetStats: {
        key: 'r',
        shift: true,
        description: 'Reset current stats',
      },
    },
  },
};

class SettingsService {
  private settings: AppSettings = DEFAULT_SETTINGS;
  private listeners: Set<(settings: AppSettings) => void> = new Set();

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    try {
      const savedSettings = await db.settings.get('appSettings');
      if (savedSettings) {
        // Merge saved settings with defaults to ensure new settings are included
        this.settings = this.mergeWithDefaults(savedSettings.value as AppSettings);
      }
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  private mergeWithDefaults(saved: AppSettings): AppSettings {
    // Deep merge that keeps saved values but ensures all new fields from defaults exist
    return {
      version: DEFAULT_SETTINGS.version,
      global: { ...DEFAULT_SETTINGS.global, ...saved.global },
      wordMode: { ...DEFAULT_SETTINGS.wordMode, ...saved.wordMode },
      sentenceMode: { ...DEFAULT_SETTINGS.sentenceMode, ...saved.sentenceMode },
    };
  }

  private async saveSettings() {
    try {
      await db.settings.put({
        key: 'appSettings',
        value: this.settings,
      });
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.settings));
  }

  // Subscribe to settings changes
  subscribe(listener: (settings: AppSettings) => void) {
    this.listeners.add(listener);
    listener(this.settings); // Initial call with current settings
    return () => this.listeners.delete(listener);
  }

  // Update specific sections of settings
  updateGlobalSettings(settings: Partial<GlobalSettings>) {
    this.settings.global = { ...this.settings.global, ...settings };
    this.saveSettings();
  }

  updateWordModeSettings(settings: Partial<WordModeSettings>) {
    this.settings.wordMode = { ...this.settings.wordMode, ...settings };
    this.saveSettings();
  }

  updateSentenceModeSettings(settings: Partial<SentenceModeSettings>) {
    this.settings.sentenceMode = { ...this.settings.sentenceMode, ...settings };
    this.saveSettings();
  }

  // Reset settings to defaults
  resetToDefaults() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }

  // Get current settings
  getSettings(): AppSettings {
    return this.settings;
  }
}

// Create a singleton instance
export const settingsService = new SettingsService();
