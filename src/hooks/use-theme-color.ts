/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getEffectiveTheme, useThemeStore } from '@/stores';

/**
 * Hook to get a themed color value based on user preference and system settings
 *
 * @param props - Optional light/dark color overrides
 * @param colorName - The name of the color token from the theme
 * @returns The color value for the current effective theme
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const systemColorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  const effectiveTheme = getEffectiveTheme(themeMode, systemColorScheme);

  const colorFromProps = props[effectiveTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[effectiveTheme][colorName];
  }
}

/**
 * Hook to get the current effective color scheme
 *
 * @returns The effective color scheme ('light' or 'dark') based on user preference
 */
export function useEffectiveColorScheme(): 'light' | 'dark' {
  const systemColorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  return getEffectiveTheme(themeMode, systemColorScheme);
}
