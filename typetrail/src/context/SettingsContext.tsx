import { useState, useEffect, type ReactNode } from 'react';
import { settingsService, DEFAULT_SETTINGS } from '../services/settingsService';
import type { SettingsContextType } from './SettingsContext.types';
import type { AppSettings } from '../types/settings';
import { SettingsContext } from './SettingsContext.context';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Wait for settings to be loaded from db
        await settingsService.waitForReady();
        if (!mounted) return;

        // Subscribe to settings changes
        const unsubscribe = settingsService.subscribe((newSettings) => {
          if (mounted) {
            setSettings(newSettings);
          }
        });

        setIsLoading(false);

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize settings:', error);
        if (mounted) {
          setIsLoading(false); // Show UI with defaults on error
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner
  }
  const value: SettingsContextType = {
    settings,
    updateGlobalSettings: settingsService.updateGlobalSettings.bind(settingsService),    updateWordModeSettings: settingsService.updateWordModeSettings.bind(settingsService),    updateSentenceModeSettings: settingsService.updateSentenceModeSettings.bind(settingsService),
    resetToDefaults: async () => {      // Update state immediately
      setSettings(DEFAULT_SETTINGS);
      // Persist in background
      await settingsService.resetToDefaults();
    },
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}


