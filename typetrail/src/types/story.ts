import type { KeyBinding } from './settings';

export type StorySource = 'file' | 'folder' | 'paste';

export interface StoryFile {
  name: string;
  path: string;
  content: string;
  type: 'txt' | 'html' | 'json';
}

export interface StoryModeSettings {
  visibleLines: number;
  autoScroll: boolean;
  caseSensitive: boolean;
  showFileName: boolean;
  keyBindings: {
    nextFile: KeyBinding;
    prevFile: KeyBinding;
    openFile: KeyBinding;
    pasteStory: KeyBinding;
    changeVisibleLines: KeyBinding;
  };
}

export interface StoryProgress {
  currentFile: string;
  currentPosition: number;
  correctChars: number;
  totalChars: number;
  startTime?: number;
  errors: number;
}
