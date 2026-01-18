/**
 * Dark Mode Support Tests
 *
 * Tests for verifying dark mode functionality including:
 * - Theme store implementation
 * - Theme context implementation
 * - Effective theme calculation logic
 * - Theme colors verification
 * - All screens support dark mode (file-based checks)
 */

import { describe, expect, it } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// ============================================================================
// Test Helpers
// ============================================================================

const projectRoot = join(__dirname, '../..');

function readFile(relativePath: string): string {
  return readFileSync(join(projectRoot, relativePath), 'utf-8');
}

// ============================================================================
// Theme Store Tests
// ============================================================================

describe('Theme Store', () => {
  const storeContent = readFile('src/stores/theme-store.ts');

  describe('Implementation', () => {
    it('should define ThemeMode type with system, light, and dark options', () => {
      expect(storeContent).toContain("export type ThemeMode = 'system' | 'light' | 'dark'");
    });

    it('should have themeMode state', () => {
      expect(storeContent).toContain('themeMode: ThemeMode');
    });

    it('should have setThemeMode action', () => {
      expect(storeContent).toContain('setThemeMode: (mode: ThemeMode) => void');
    });

    it('should have toggleTheme action', () => {
      expect(storeContent).toContain('toggleTheme:');
    });

    it('should have resetToSystem action', () => {
      expect(storeContent).toContain('resetToSystem:');
    });

    it('should use zustand persist middleware for AsyncStorage', () => {
      expect(storeContent).toContain('persist');
      expect(storeContent).toContain('AsyncStorage');
    });

    it('should export getEffectiveTheme helper function', () => {
      expect(storeContent).toContain('export function getEffectiveTheme');
    });
  });

  describe('getEffectiveTheme Logic', () => {
    it('should have logic to handle system mode', () => {
      expect(storeContent).toContain("if (themeMode === 'system')");
    });

    it('should fallback to light when system scheme is undefined', () => {
      expect(storeContent).toContain("return systemColorScheme ?? 'light'");
    });
  });
});

// ============================================================================
// Theme Context Tests
// ============================================================================

describe('Theme Context', () => {
  const contextContent = readFile('src/context/theme-context.tsx');

  describe('Implementation', () => {
    it('should create ThemeContext', () => {
      expect(contextContent).toContain('const ThemeContext = createContext');
    });

    it('should export ThemeProvider component', () => {
      expect(contextContent).toContain('export function ThemeProvider');
    });

    it('should export useTheme hook', () => {
      expect(contextContent).toContain('export function useTheme');
    });

    it('should expose colorScheme in context value', () => {
      expect(contextContent).toContain('colorScheme');
    });

    it('should expose isDark boolean in context value', () => {
      expect(contextContent).toContain('isDark:');
    });

    it('should expose colors object in context value', () => {
      expect(contextContent).toContain('colors');
    });

    it('should expose theme control actions', () => {
      expect(contextContent).toContain('setThemeMode');
      expect(contextContent).toContain('toggleTheme');
      expect(contextContent).toContain('resetToSystem');
    });
  });

  describe('System Color Scheme Integration', () => {
    it('should use system color scheme from React Native', () => {
      expect(contextContent).toContain('useColorScheme as useSystemColorScheme');
    });

    it('should integrate with theme store', () => {
      expect(contextContent).toContain('useThemeStore');
    });
  });
});

// ============================================================================
// Root Layout Tests
// ============================================================================

describe('Root Layout Integration', () => {
  const layoutContent = readFile('src/app/_layout.tsx');

  describe('Theme Provider Setup', () => {
    it('should import ThemeProvider from context', () => {
      expect(layoutContent).toContain('ThemeProvider');
    });

    it('should wrap app content with ThemeProvider', () => {
      expect(layoutContent).toContain('<ThemeProvider>');
    });

    it('should use useTheme hook for theme values', () => {
      expect(layoutContent).toContain('useTheme');
    });
  });

  describe('StatusBar Integration', () => {
    it('should have StatusBar component', () => {
      expect(layoutContent).toContain('<StatusBar');
    });

    it('should set StatusBar style based on theme', () => {
      expect(layoutContent).toContain("isDark ? 'light' : 'dark'");
    });
  });

  describe('Navigation Theme', () => {
    it('should use MaestroLightTheme for light mode', () => {
      expect(layoutContent).toContain('MaestroLightTheme');
    });

    it('should use MaestroDarkTheme for dark mode', () => {
      expect(layoutContent).toContain('MaestroDarkTheme');
    });
  });
});

// ============================================================================
// Profile Screen Theme Toggle Tests
// ============================================================================

describe('Profile Screen Theme Toggle', () => {
  const profileContent = readFile('src/app/(tabs)/profile.tsx');

  describe('Theme Selector Modal', () => {
    it('should have ThemeSelectorModal component', () => {
      expect(profileContent).toContain('function ThemeSelectorModal');
    });

    it('should display System, Light, and Dark options', () => {
      expect(profileContent).toContain("label: 'System'");
      expect(profileContent).toContain("label: 'Light'");
      expect(profileContent).toContain("label: 'Dark'");
    });

    it('should use appropriate icons for each theme option', () => {
      expect(profileContent).toContain('phone-portrait-outline');
      expect(profileContent).toContain('sunny-outline');
      expect(profileContent).toContain('moon-outline');
    });
  });

  describe('Theme Toggle in Preferences', () => {
    it('should have Appearance menu item', () => {
      expect(profileContent).toContain('label="Appearance"');
    });

    it('should display current theme label', () => {
      expect(profileContent).toContain('getThemeLabel');
    });

    it('should open theme modal on Appearance press', () => {
      expect(profileContent).toContain('setThemeModalVisible(true)');
    });
  });

  describe('Theme Store Integration', () => {
    it('should import useThemeStore', () => {
      expect(profileContent).toContain('useThemeStore');
    });

    it('should have themeModalVisible state', () => {
      expect(profileContent).toContain('themeModalVisible');
    });
  });
});

// ============================================================================
// Theme Colors Tests
// ============================================================================

describe('Theme Colors', () => {
  const themeContent = readFile('src/constants/theme.ts');

  describe('Light Theme Colors', () => {
    it('should define light theme colors', () => {
      expect(themeContent).toContain('light: {');
    });

    it('should have light background color', () => {
      expect(themeContent).toContain('background: NeutralColors[0]');
    });

    it('should have light text color', () => {
      expect(themeContent).toContain('text: NeutralColors[900]');
    });
  });

  describe('Dark Theme Colors', () => {
    it('should define dark theme colors', () => {
      expect(themeContent).toContain('dark: {');
    });

    it('should have dark background color', () => {
      expect(themeContent).toContain('background: NeutralColors[950]');
    });

    it('should have dark text color', () => {
      expect(themeContent).toContain('text: NeutralColors[50]');
    });
  });
});

// ============================================================================
// Screen Dark Mode Support Tests
// ============================================================================

describe('Screens Dark Mode Support', () => {
  // Check key screens for color scheme usage
  const keyScreens = [
    'src/app/(tabs)/index.tsx',
    'src/app/(tabs)/search.tsx',
    'src/app/(tabs)/orders.tsx',
    'src/app/(tabs)/profile.tsx',
    'src/app/(auth)/onboarding.tsx',
    'src/app/(auth)/sign-in.tsx',
    'src/app/(auth)/sign-up.tsx',
    'src/app/restaurant/[id].tsx',
    'src/app/order/checkout.tsx',
  ];

  describe('Key screens use themed colors', () => {
    keyScreens.forEach((screenPath) => {
      const fullPath = join(projectRoot, screenPath);
      if (existsSync(fullPath)) {
        it(`${screenPath} should use color scheme for theming`, () => {
          const content = readFile(screenPath);
          // Check for color scheme usage (either hook or Colors object)
          const hasColorScheme =
            content.includes('useColorScheme') || content.includes('Colors[colorScheme');
          expect(hasColorScheme).toBe(true);
        });
      }
    });
  });
});

// ============================================================================
// Store Exports Tests
// ============================================================================

describe('Store Exports', () => {
  const storeIndexContent = readFile('src/stores/index.ts');

  it('should export useThemeStore', () => {
    expect(storeIndexContent).toContain('useThemeStore');
  });

  it('should export ThemeMode type', () => {
    expect(storeIndexContent).toContain('type ThemeMode');
  });

  it('should export getEffectiveTheme function', () => {
    expect(storeIndexContent).toContain('getEffectiveTheme');
  });
});

// ============================================================================
// Context Exports Tests
// ============================================================================

describe('Context Exports', () => {
  const contextIndexContent = readFile('src/context/index.ts');

  it('should export ThemeProvider', () => {
    expect(contextIndexContent).toContain('ThemeProvider');
  });

  it('should export useTheme hook', () => {
    expect(contextIndexContent).toContain('useTheme');
  });

  it('should export ThemeContextValue type', () => {
    expect(contextIndexContent).toContain('type ThemeContextValue');
  });
});

// ============================================================================
// Hooks Tests
// ============================================================================

describe('Theme Hooks', () => {
  const hookContent = readFile('src/hooks/use-theme-color.ts');

  describe('useThemeColor hook', () => {
    it('should export useThemeColor function', () => {
      expect(hookContent).toContain('export function useThemeColor');
    });

    it('should integrate with theme store', () => {
      expect(hookContent).toContain('useThemeStore');
    });

    it('should use getEffectiveTheme', () => {
      expect(hookContent).toContain('getEffectiveTheme');
    });
  });

  describe('useEffectiveColorScheme hook', () => {
    it('should export useEffectiveColorScheme function', () => {
      expect(hookContent).toContain('export function useEffectiveColorScheme');
    });
  });
});
