/**
 * Tests for App Icons and Splash Screen Assets
 *
 * These tests verify that all required app icon assets exist and are properly configured.
 */

import * as fs from 'fs';
import * as path from 'path';

// Path to the assets directory
const ASSETS_DIR = path.join(__dirname, '../assets/images');

// Path to app.json
const APP_JSON_PATH = path.join(__dirname, '../../app.json');

describe('App Icons and Assets', () => {
  describe('Asset Files Existence', () => {
    it('should have main app icon (icon.png)', () => {
      const iconPath = path.join(ASSETS_DIR, 'icon.png');
      expect(fs.existsSync(iconPath)).toBe(true);
    });

    it('should have Android adaptive icon foreground', () => {
      const foregroundPath = path.join(ASSETS_DIR, 'android-icon-foreground.png');
      expect(fs.existsSync(foregroundPath)).toBe(true);
    });

    it('should have Android adaptive icon background', () => {
      const backgroundPath = path.join(ASSETS_DIR, 'android-icon-background.png');
      expect(fs.existsSync(backgroundPath)).toBe(true);
    });

    it('should have Android monochrome icon for themed icons', () => {
      const monochromePath = path.join(ASSETS_DIR, 'android-icon-monochrome.png');
      expect(fs.existsSync(monochromePath)).toBe(true);
    });

    it('should have splash screen icon', () => {
      const splashPath = path.join(ASSETS_DIR, 'splash-icon.png');
      expect(fs.existsSync(splashPath)).toBe(true);
    });

    it('should have web favicon', () => {
      const faviconPath = path.join(ASSETS_DIR, 'favicon.png');
      expect(fs.existsSync(faviconPath)).toBe(true);
    });
  });

  describe('Asset File Sizes', () => {
    it('main icon should be at least 1KB (not empty)', () => {
      const iconPath = path.join(ASSETS_DIR, 'icon.png');
      const stats = fs.statSync(iconPath);
      expect(stats.size).toBeGreaterThan(1024);
    });

    it('Android foreground icon should be at least 1KB', () => {
      const foregroundPath = path.join(ASSETS_DIR, 'android-icon-foreground.png');
      const stats = fs.statSync(foregroundPath);
      expect(stats.size).toBeGreaterThan(1024);
    });

    it('Android background icon should be at least 1KB', () => {
      const backgroundPath = path.join(ASSETS_DIR, 'android-icon-background.png');
      const stats = fs.statSync(backgroundPath);
      expect(stats.size).toBeGreaterThan(1024);
    });

    it('Android monochrome icon should be at least 1KB', () => {
      const monochromePath = path.join(ASSETS_DIR, 'android-icon-monochrome.png');
      const stats = fs.statSync(monochromePath);
      expect(stats.size).toBeGreaterThan(1024);
    });

    it('splash icon should be at least 1KB', () => {
      const splashPath = path.join(ASSETS_DIR, 'splash-icon.png');
      const stats = fs.statSync(splashPath);
      expect(stats.size).toBeGreaterThan(1024);
    });

    it('favicon should be at least 100 bytes', () => {
      const faviconPath = path.join(ASSETS_DIR, 'favicon.png');
      const stats = fs.statSync(faviconPath);
      expect(stats.size).toBeGreaterThan(100);
    });
  });

  describe('app.json Configuration', () => {
    let appConfig: {
      expo: {
        name: string;
        icon: string;
        android: {
          adaptiveIcon: {
            foregroundImage: string;
            backgroundImage: string;
            monochromeImage: string;
            backgroundColor: string;
          };
        };
        web: {
          favicon: string;
        };
        plugins: Array<string | [string, Record<string, unknown>]>;
      };
    };

    beforeAll(() => {
      const appJsonContent = fs.readFileSync(APP_JSON_PATH, 'utf-8');
      appConfig = JSON.parse(appJsonContent);
    });

    it('should have expo config', () => {
      expect(appConfig.expo).toBeDefined();
    });

    it('should have icon configured', () => {
      expect(appConfig.expo.icon).toBe('./src/assets/images/icon.png');
    });

    it('should have Android adaptive icon configured', () => {
      const adaptiveIcon = appConfig.expo.android?.adaptiveIcon;
      expect(adaptiveIcon).toBeDefined();
      expect(adaptiveIcon?.foregroundImage).toBe('./src/assets/images/android-icon-foreground.png');
      expect(adaptiveIcon?.backgroundImage).toBe('./src/assets/images/android-icon-background.png');
      expect(adaptiveIcon?.monochromeImage).toBe('./src/assets/images/android-icon-monochrome.png');
    });

    it('should have Android adaptive icon background color', () => {
      const backgroundColor = appConfig.expo.android?.adaptiveIcon?.backgroundColor;
      expect(backgroundColor).toBe('#FF6B35');
    });

    it('should have web favicon configured', () => {
      expect(appConfig.expo.web?.favicon).toBe('./src/assets/images/favicon.png');
    });

    it('should have splash screen plugin configured', () => {
      const splashPlugin = appConfig.expo.plugins?.find(
        (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
      );
      expect(splashPlugin).toBeDefined();
    });

    it('should have splash screen image configured', () => {
      const splashPlugin = appConfig.expo.plugins?.find(
        (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
      ) as [string, Record<string, unknown>] | undefined;

      expect(splashPlugin).toBeDefined();
      const config = splashPlugin?.[1];
      expect(config?.image).toBe('./src/assets/images/splash-icon.png');
    });

    it('should have splash screen background colors for light and dark modes', () => {
      const splashPlugin = appConfig.expo.plugins?.find(
        (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
      ) as [string, Record<string, unknown>] | undefined;

      expect(splashPlugin).toBeDefined();
      const config = splashPlugin?.[1];

      // Light mode background
      expect(config?.backgroundColor).toBe('#FFF5F0');

      // Dark mode configuration
      const darkConfig = config?.dark as Record<string, unknown> | undefined;
      expect(darkConfig).toBeDefined();
      expect(darkConfig?.backgroundColor).toBe('#0A0A0A');
    });
  });

  describe('Icon Generation Script', () => {
    it('should have icon generation script', () => {
      const scriptPath = path.join(__dirname, '../../scripts/generate-icons.ts');
      expect(fs.existsSync(scriptPath)).toBe(true);
    });

    it('script should use correct brand colors', () => {
      const scriptPath = path.join(__dirname, '../../scripts/generate-icons.ts');
      const scriptContent = fs.readFileSync(scriptPath, 'utf-8');

      // Check for brand colors
      expect(scriptContent).toContain('#FF6B35'); // Primary orange
      expect(scriptContent).toContain('#C44A22'); // Dark orange
      expect(scriptContent).toContain('#FFF5F0'); // Light background
    });

    it('script should generate all required icon variants', () => {
      const scriptPath = path.join(__dirname, '../../scripts/generate-icons.ts');
      const scriptContent = fs.readFileSync(scriptPath, 'utf-8');

      // Check for icon generation calls
      expect(scriptContent).toContain('icon.png');
      expect(scriptContent).toContain('android-icon-foreground.png');
      expect(scriptContent).toContain('android-icon-background.png');
      expect(scriptContent).toContain('android-icon-monochrome.png');
      expect(scriptContent).toContain('splash-icon.png');
      expect(scriptContent).toContain('favicon.png');
    });
  });

  describe('PNG File Validation', () => {
    const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    function isPNG(filePath: string): boolean {
      const buffer = Buffer.alloc(8);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 8, 0);
      fs.closeSync(fd);
      return buffer.equals(PNG_SIGNATURE);
    }

    it('icon.png should be a valid PNG file', () => {
      const iconPath = path.join(ASSETS_DIR, 'icon.png');
      expect(isPNG(iconPath)).toBe(true);
    });

    it('android-icon-foreground.png should be a valid PNG file', () => {
      const foregroundPath = path.join(ASSETS_DIR, 'android-icon-foreground.png');
      expect(isPNG(foregroundPath)).toBe(true);
    });

    it('android-icon-background.png should be a valid PNG file', () => {
      const backgroundPath = path.join(ASSETS_DIR, 'android-icon-background.png');
      expect(isPNG(backgroundPath)).toBe(true);
    });

    it('android-icon-monochrome.png should be a valid PNG file', () => {
      const monochromePath = path.join(ASSETS_DIR, 'android-icon-monochrome.png');
      expect(isPNG(monochromePath)).toBe(true);
    });

    it('splash-icon.png should be a valid PNG file', () => {
      const splashPath = path.join(ASSETS_DIR, 'splash-icon.png');
      expect(isPNG(splashPath)).toBe(true);
    });

    it('favicon.png should be a valid PNG file', () => {
      const faviconPath = path.join(ASSETS_DIR, 'favicon.png');
      expect(isPNG(faviconPath)).toBe(true);
    });
  });
});

describe('Brand Consistency', () => {
  it('app.json should use Maestro brand color for Android icon', () => {
    const appJsonContent = fs.readFileSync(APP_JSON_PATH, 'utf-8');
    const appConfig = JSON.parse(appJsonContent);

    // Primary brand color from theme.ts
    const MAESTRO_PRIMARY = '#FF6B35';
    expect(appConfig.expo.android.adaptiveIcon.backgroundColor).toBe(MAESTRO_PRIMARY);
  });

  it('splash screen should use brand light color', () => {
    const appJsonContent = fs.readFileSync(APP_JSON_PATH, 'utf-8');
    const appConfig = JSON.parse(appJsonContent);

    const splashPlugin = appConfig.expo.plugins?.find(
      (plugin: string | [string, Record<string, unknown>]) =>
        Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
    ) as [string, Record<string, unknown>];

    // Light background from theme.ts PrimaryColors[50]
    expect(splashPlugin[1].backgroundColor).toBe('#FFF5F0');
  });

  it('dark mode splash should use dark background', () => {
    const appJsonContent = fs.readFileSync(APP_JSON_PATH, 'utf-8');
    const appConfig = JSON.parse(appJsonContent);

    const splashPlugin = appConfig.expo.plugins?.find(
      (plugin: string | [string, Record<string, unknown>]) =>
        Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
    ) as [string, Record<string, unknown>];

    const darkConfig = splashPlugin[1].dark as Record<string, unknown>;
    // Dark background from theme.ts NeutralColors[950]
    expect(darkConfig.backgroundColor).toBe('#0A0A0A');
  });
});
