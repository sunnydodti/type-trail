export type KeyBinding = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
};

export type WordModeSettings = {
  multiWordDefault: boolean;
  caseSensitive: boolean;
  showStats: boolean;
  customWordLists: {
    [name: string]: string[];
  };
  keyBindings: {
    toggleMultiWord: KeyBinding;
    openCustomWords: KeyBinding;
    resetStats: KeyBinding;
    skipWord: KeyBinding;
  };
};

export type SentenceModeSettings = {
  punctuationRequired: boolean;
  caseSensitive: boolean;
  showStats: boolean;
  customSentences: string[];
  keyBindings: {
    skipSentence: KeyBinding;
    togglePunctuation: KeyBinding;
    resetStats: KeyBinding;
  };
};

export type StoryModeSettings = {
  visibleLines: number;
  caseSensitive: boolean;
  showFileName: boolean;
  autoScroll: boolean;
  showStats: boolean;
  keyBindings: {
    nextFile: KeyBinding;
    prevFile: KeyBinding;
    openFile: KeyBinding;
    pasteText: KeyBinding;
  };
};

export type GlobalSettings = {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  soundVolume: number;
  showWPM: boolean;
  saveStats: boolean;
  keyBindings: {
    toggleTheme: KeyBinding;
    openSettings: KeyBinding;
    toggleSound: KeyBinding;
  };
};

export type AppSettings = {
  version: number;
  global: GlobalSettings;
  wordMode: WordModeSettings;
  sentenceMode: SentenceModeSettings;
  storyMode: StoryModeSettings;
};
