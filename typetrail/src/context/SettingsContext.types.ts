import type { AppSettings } from '../types/settings';
import type { settingsService } from '../services/settingsService';

export interface SettingsContextType {
  settings: AppSettings;
  updateGlobalSettings: typeof settingsService.updateGlobalSettings;
  updateWordModeSettings: typeof settingsService.updateWordModeSettings;
  updateSentenceModeSettings: typeof settingsService.updateSentenceModeSettings;
  resetToDefaults: typeof settingsService.resetToDefaults;
}
