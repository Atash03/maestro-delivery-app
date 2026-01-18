/**
 * Theme Context - Provides theme colors throughout the app
 *
 * This context combines:
 * - System color scheme detection
 * - User theme preferences from the theme store
 * - Easy access to current theme colors
 */

import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { Colors, type ColorToken } from '@/constants/theme';
import { getEffectiveTheme, type ThemeMode, useThemeStore } from '@/stores';

export type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

export interface ThemeContextValue {
  /** The effective color scheme being used ('light' or 'dark') */
  colorScheme: 'light' | 'dark';
  /** The user's theme preference ('system', 'light', or 'dark') */
  themeMode: ThemeMode;
  /** The theme colors object for the current color scheme */
  colors: ThemeColors;
  /** Whether dark mode is active */
  isDark: boolean;
  /** Set the theme mode */
  setThemeMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark mode */
  toggleTheme: () => void;
  /** Reset to system default */
  resetToSystem: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const { themeMode, setThemeMode, toggleTheme, resetToSystem } = useThemeStore();

  const colorScheme = useMemo(
    () => getEffectiveTheme(themeMode, systemColorScheme),
    [themeMode, systemColorScheme]
  );

  const colors = useMemo(() => Colors[colorScheme], [colorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      themeMode,
      colors,
      isDark: colorScheme === 'dark',
      setThemeMode,
      toggleTheme: () => toggleTheme(systemColorScheme ?? 'light'),
      resetToSystem,
    }),
    [colorScheme, themeMode, colors, setThemeMode, toggleTheme, resetToSystem, systemColorScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access the current theme
 *
 * @returns The theme context value with colors and theme controls
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get a specific theme color
 *
 * @param colorName - The name of the color token
 * @param overrides - Optional light/dark overrides
 * @returns The color value for the current theme
 */
export function useThemeColor(
  colorName: ColorToken,
  overrides?: { light?: string; dark?: string }
): string {
  const { colorScheme, colors } = useTheme();

  if (overrides?.[colorScheme]) {
    return overrides[colorScheme] as string;
  }

  return colors[colorName];
}

/**
 * Optional version of useTheme that returns undefined if not in provider
 * Useful for components that may be rendered before provider is mounted
 */
export function useThemeOptional(): ThemeContextValue | undefined {
  return useContext(ThemeContext);
}
