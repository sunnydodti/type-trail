import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext.context';
import type { SettingsContextType } from '../context/SettingsContext.types';

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
