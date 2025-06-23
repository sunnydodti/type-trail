import { db } from '../db';
import type { AppSettings, GlobalSettings, WordModeSettings, SentenceModeSettings } from '../types/settings';

export const DEFAULT_SETTINGS: AppSettings = {
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
  storyMode: {
    visibleLines: 3,
    caseSensitive: false,
    showFileName: true,
    autoScroll: true,
    showStats: true,
    keyBindings: {
      nextFile: {
        key: 'ArrowRight',
        alt: true,
        description: 'Next file',
      },
      prevFile: {
        key: 'ArrowLeft',
        alt: true,
        description: 'Previous file',
      },
      openFile: {
        key: 'o',
        shift: true,
        description: 'Open file',
      },
      pasteText: {
        key: 'v',
        shift: true,
        description: 'Paste text',
      },
    },
  },
};

class SettingsService {
  private settings: AppSettings = DEFAULT_SETTINGS;
  private listeners: Set<(settings: AppSettings) => void> = new Set();
  private ready: Promise<void>;

  constructor() {
    this.ready = this.loadSettings();
  }

  async waitForReady() {
    await this.ready;
    return this.settings;
  }

  private async loadSettings() {
    try {
      const savedSettings = await db.settings.get('appSettings');
      if (savedSettings) {
        // Merge saved settings with defaults to ensure new settings are included
        this.settings = this.mergeWithDefaults(savedSettings.value as AppSettings);
      }
      await this.persistSettings();
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  private async persistSettings() {
    try {
      await db.settings.put({ key: 'appSettings', value: this.settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error; // Re-throw to allow caller to handle
    }
  }

  private mergeWithDefaults(saved: AppSettings): AppSettings {
    // Deep merge that keeps saved values but ensures all new fields from defaults exist
    return {
      version: DEFAULT_SETTINGS.version,
      global: { ...DEFAULT_SETTINGS.global, ...saved.global },
      wordMode: { ...DEFAULT_SETTINGS.wordMode, ...saved.wordMode },
      sentenceMode: { ...DEFAULT_SETTINGS.sentenceMode, ...saved.sentenceMode },
      storyMode: { ...DEFAULT_SETTINGS.storyMode, ...saved.storyMode },
    };
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
  async updateGlobalSettings(settings: Partial<GlobalSettings>) {
    this.settings.global = { ...this.settings.global, ...settings };
    this.notifyListeners(); // Notify immediately for real-time UI updates
    await this.persistSettings();
  }

  async updateWordModeSettings(settings: Partial<WordModeSettings>) {
    this.settings.wordMode = { ...this.settings.wordMode, ...settings };
    this.notifyListeners(); // Notify immediately for real-time UI updates
    await this.persistSettings();
  }

  async updateSentenceModeSettings(settings: Partial<SentenceModeSettings>) {
    this.settings.sentenceMode = { ...this.settings.sentenceMode, ...settings };
    this.notifyListeners(); // Notify immediately for real-time UI updates
    await this.persistSettings();
  }

  // Reset settings to defaults
  async resetToDefaults() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.notifyListeners(); // Notify immediately for real-time UI updates
    await this.persistSettings();
  }

  // Get current settings
  getSettings(): AppSettings {
    return this.settings;
  }
}

// Create a singleton instance
export const settingsService = new SettingsService();
