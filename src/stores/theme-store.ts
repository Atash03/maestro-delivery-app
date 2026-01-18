/**
 * Theme Store - Manages user theme preferences
 *
 * Features:
 * - Persists user theme preference to AsyncStorage
 * - Supports 'system', 'light', and 'dark' modes
 * - Integrates with system color scheme detection
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeState {
  /** User's theme preference */
  themeMode: ThemeMode;
}

export interface ThemeActions {
  /** Set the theme mode */
  setThemeMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark (if on system, goes to opposite of current) */
  toggleTheme: (currentSystemTheme: 'light' | 'dark') => void;
  /** Reset to system default */
  resetToSystem: () => void;
}

const STORAGE_KEY = 'maestro-theme-preferences';

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      themeMode: 'system',

      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
      },

      toggleTheme: (currentSystemTheme: 'light' | 'dark') => {
        const { themeMode } = get();
        let currentEffective: 'light' | 'dark';

        if (themeMode === 'system') {
          currentEffective = currentSystemTheme;
        } else {
          currentEffective = themeMode;
        }

        // Toggle to the opposite
        set({ themeMode: currentEffective === 'light' ? 'dark' : 'light' });
      },

      resetToSystem: () => {
        set({ themeMode: 'system' });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    }
  )
);

/**
 * Helper function to get the effective theme based on user preference and system setting
 */
export function getEffectiveTheme(
  themeMode: ThemeMode,
  systemColorScheme: 'light' | 'dark' | null | undefined
): 'light' | 'dark' {
  if (themeMode === 'system') {
    return systemColorScheme ?? 'light';
  }
  return themeMode;
}
