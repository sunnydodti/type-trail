import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppSettings } from '../types/settings';
import { settingsService } from '../services/settingsService';

interface SettingsContextType {
  settings: AppSettings;
  updateGlobalSettings: typeof settingsService.updateGlobalSettings;
  updateWordModeSettings: typeof settingsService.updateWordModeSettings;
  updateSentenceModeSettings: typeof settingsService.updateSentenceModeSettings;
  resetToDefaults: typeof settingsService.resetToDefaults;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(settingsService.getSettings());

  useEffect(() => {
    settingsService.subscribe(setSettings);
  }, []);

  const value: SettingsContextType = {
    settings,
    updateGlobalSettings: settingsService.updateGlobalSettings.bind(settingsService),
    updateWordModeSettings: settingsService.updateWordModeSettings.bind(settingsService),
    updateSentenceModeSettings: settingsService.updateSentenceModeSettings.bind(settingsService),
    resetToDefaults: settingsService.resetToDefaults.bind(settingsService),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
