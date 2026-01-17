/**
 * Tests for the splash screen configuration
 * Tests app.json configuration, brand colors, and animation setup
 *
 * Note: Full rendering tests require a React Native environment with Expo.
 * These tests validate the configuration and module structure.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// Mock Platform before any imports
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: <T>(obj: { ios?: T; android?: T; default?: T }): T | undefined => {
      return obj.ios ?? obj.default;
    },
    Version: 14,
  },
  StyleSheet: {
    create: <T extends object>(styles: T): T => styles,
    absoluteFillObject: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  },
  View: 'View',
  Text: 'Text',
}));

describe('Splash Screen Configuration', () => {
  let appConfig: { expo: Record<string, unknown> };

  beforeAll(() => {
    const appJsonPath = path.join(__dirname, '..', '..', 'app.json');
    const appJsonContent = fs.readFileSync(appJsonPath, 'utf-8');
    appConfig = JSON.parse(appJsonContent);
  });

  describe('app.json Configuration', () => {
    it('has expo configuration', () => {
      expect(appConfig.expo).toBeDefined();
    });

    it('has app name set to Maestro', () => {
      expect(appConfig.expo.name).toBe('Maestro');
    });

    it('has plugins array', () => {
      expect(appConfig.expo.plugins).toBeDefined();
      expect(Array.isArray(appConfig.expo.plugins)).toBe(true);
    });

    it('includes expo-splash-screen plugin', () => {
      const plugins = appConfig.expo.plugins as Array<string | [string, Record<string, unknown>]>;
      const splashPlugin = plugins.find((p) =>
        Array.isArray(p) ? p[0] === 'expo-splash-screen' : p === 'expo-splash-screen'
      );
      expect(splashPlugin).toBeDefined();
    });
  });

  describe('Splash Screen Plugin Configuration', () => {
    let splashConfig: Record<string, unknown>;

    beforeAll(() => {
      const plugins = appConfig.expo.plugins as Array<string | [string, Record<string, unknown>]>;
      const splashPlugin = plugins.find((p) =>
        Array.isArray(p) ? p[0] === 'expo-splash-screen' : false
      );
      if (Array.isArray(splashPlugin)) {
        splashConfig = splashPlugin[1];
      }
    });

    it('has splash screen configuration object', () => {
      expect(splashConfig).toBeDefined();
    });

    it('has image path configured', () => {
      expect(splashConfig.image).toBeDefined();
      expect(typeof splashConfig.image).toBe('string');
    });

    it('has imageWidth configured', () => {
      expect(splashConfig.imageWidth).toBeDefined();
      expect(splashConfig.imageWidth).toBe(200);
    });

    it('has resizeMode set to contain', () => {
      expect(splashConfig.resizeMode).toBe('contain');
    });

    it('has backgroundColor configured for light mode', () => {
      expect(splashConfig.backgroundColor).toBeDefined();
      expect(typeof splashConfig.backgroundColor).toBe('string');
    });

    it('uses brand color for light mode background', () => {
      // Using PrimaryColors[50] (#FFF5F0) for light mode
      expect(splashConfig.backgroundColor).toBe('#FFF5F0');
    });

    it('has dark mode configuration', () => {
      expect(splashConfig.dark).toBeDefined();
    });

    it('dark mode has backgroundColor', () => {
      const darkConfig = splashConfig.dark as Record<string, unknown>;
      expect(darkConfig.backgroundColor).toBeDefined();
    });

    it('dark mode uses NeutralColors[950] for background', () => {
      const darkConfig = splashConfig.dark as Record<string, unknown>;
      // Using NeutralColors[950] (#0A0A0A) for dark mode
      expect(darkConfig.backgroundColor).toBe('#0A0A0A');
    });

    it('dark mode has image path configured', () => {
      const darkConfig = splashConfig.dark as Record<string, unknown>;
      expect(darkConfig.image).toBeDefined();
    });
  });

  describe('Brand Colors Alignment', () => {
    it('splash background matches PrimaryColors[50]', () => {
      const { PrimaryColors } = require('@/constants/theme');
      const plugins = appConfig.expo.plugins as Array<string | [string, Record<string, unknown>]>;
      const splashPlugin = plugins.find((p) =>
        Array.isArray(p) ? p[0] === 'expo-splash-screen' : false
      ) as [string, Record<string, unknown>];
      const splashConfig = splashPlugin[1];

      expect(splashConfig.backgroundColor).toBe(PrimaryColors[50]);
    });

    it('dark splash background matches NeutralColors[950]', () => {
      const { NeutralColors } = require('@/constants/theme');
      const plugins = appConfig.expo.plugins as Array<string | [string, Record<string, unknown>]>;
      const splashPlugin = plugins.find((p) =>
        Array.isArray(p) ? p[0] === 'expo-splash-screen' : false
      ) as [string, Record<string, unknown>];
      const darkConfig = splashPlugin[1].dark as Record<string, unknown>;

      expect(darkConfig.backgroundColor).toBe(NeutralColors[950]);
    });

    it('android adaptive icon uses primary brand color', () => {
      const android = appConfig.expo.android as Record<string, unknown>;
      const adaptiveIcon = android.adaptiveIcon as Record<string, unknown>;

      const { PrimaryColors } = require('@/constants/theme');
      expect(adaptiveIcon.backgroundColor).toBe(PrimaryColors[500]);
    });
  });

  describe('Splash Assets', () => {
    it('splash icon file exists', () => {
      const plugins = appConfig.expo.plugins as Array<string | [string, Record<string, unknown>]>;
      const splashPlugin = plugins.find((p) =>
        Array.isArray(p) ? p[0] === 'expo-splash-screen' : false
      ) as [string, Record<string, unknown>];
      const imagePath = splashPlugin[1].image as string;

      // Convert relative path to absolute
      const absolutePath = path.join(__dirname, '..', '..', imagePath);
      expect(fs.existsSync(absolutePath)).toBe(true);
    });
  });
});

describe('Root Layout Splash Integration', () => {
  describe('File Structure', () => {
    it('root layout exists', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      expect(fs.existsSync(layoutPath)).toBe(true);
    });

    it('root layout contains splash screen imports', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain("import * as SplashScreen from 'expo-splash-screen'");
    });

    it('root layout calls preventAutoHideAsync', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('SplashScreen.preventAutoHideAsync()');
    });

    it('root layout sets splash screen options', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('SplashScreen.setOptions');
    });

    it('root layout calls hideAsync', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('SplashScreen.hideAsync()');
    });
  });

  describe('Animated Logo Component', () => {
    it('root layout contains AnimatedLogo function', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('function AnimatedLogo');
    });

    it('AnimatedLogo uses reanimated animations', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('useSharedValue');
      expect(layoutContent).toContain('useAnimatedStyle');
    });

    it('AnimatedLogo uses spring animation', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('withSpring');
    });

    it('AnimatedLogo has scale animation', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('scale');
      expect(layoutContent).toContain('transform: [{ scale:');
    });

    it('AnimatedLogo has opacity animation', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('opacity');
    });

    it('AnimatedLogo has onAnimationComplete callback', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('onAnimationComplete');
    });
  });

  describe('Splash to App Transition', () => {
    it('uses FadeIn animation for app content', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('FadeIn');
    });

    it('uses FadeOut animation for splash exit', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('FadeOut');
    });

    it('has appIsReady state', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('appIsReady');
      expect(layoutContent).toContain('setAppIsReady');
    });

    it('has showAnimatedLogo state', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('showAnimatedLogo');
      expect(layoutContent).toContain('setShowAnimatedLogo');
    });
  });

  describe('Animation Configuration', () => {
    it('uses AnimationDurations from theme', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('AnimationDurations');
    });

    it('uses withSequence for logo animation', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('withSequence');
    });

    it('uses withDelay for staggered text animation', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('withDelay');
    });

    it('uses withTiming for smooth transitions', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('withTiming');
    });
  });

  describe('Branding Elements', () => {
    it('displays Maestro brand name', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('Maestro');
    });

    it('displays tagline', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('Delicious food, delivered');
    });

    it('uses PrimaryColors for logo styling', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('PrimaryColors[500]');
    });

    it('uses Typography for text styling', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('Typography');
    });
  });

  describe('Dark Mode Support', () => {
    it('uses useColorScheme hook', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('useColorScheme');
    });

    it('applies different background for dark mode', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain("colorScheme === 'dark'");
      expect(layoutContent).toContain('Colors.dark.background');
    });
  });
});

describe('Animation Timing Values', () => {
  it('AnimationDurations has all expected presets', () => {
    const { AnimationDurations } = require('@/constants/theme');

    expect(AnimationDurations.instant).toBeDefined();
    expect(AnimationDurations.fast).toBeDefined();
    expect(AnimationDurations.normal).toBeDefined();
    expect(AnimationDurations.slow).toBeDefined();
    expect(AnimationDurations.slower).toBeDefined();
  });

  it('fast animation is under 200ms', () => {
    const { AnimationDurations } = require('@/constants/theme');
    expect(AnimationDurations.fast).toBeLessThan(200);
  });

  it('normal animation is between 200-300ms', () => {
    const { AnimationDurations } = require('@/constants/theme');
    expect(AnimationDurations.normal).toBeGreaterThanOrEqual(200);
    expect(AnimationDurations.normal).toBeLessThanOrEqual(300);
  });

  it('slow animation is between 300-400ms', () => {
    const { AnimationDurations } = require('@/constants/theme');
    expect(AnimationDurations.slow).toBeGreaterThanOrEqual(300);
    expect(AnimationDurations.slow).toBeLessThanOrEqual(400);
  });
});

describe('Splash Screen Lifecycle', () => {
  describe('Initialization Flow', () => {
    it('preventAutoHideAsync is called at module level', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      // Should be called before the component definition
      const preventIndex = layoutContent.indexOf('SplashScreen.preventAutoHideAsync()');
      const componentIndex = layoutContent.indexOf('export default function RootLayout');

      expect(preventIndex).toBeLessThan(componentIndex);
    });

    it('setOptions is called at module level', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      const setOptionsIndex = layoutContent.indexOf('SplashScreen.setOptions');
      const componentIndex = layoutContent.indexOf('export default function RootLayout');

      expect(setOptionsIndex).toBeLessThan(componentIndex);
    });
  });

  describe('Ready State Handling', () => {
    it('returns null when app is not ready', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('if (!appIsReady)');
      expect(layoutContent).toContain('return null');
    });

    it('uses onLayout to trigger hideAsync', () => {
      const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      expect(layoutContent).toContain('onLayout={onLayoutRootView}');
      expect(layoutContent).toContain('onLayoutRootView');
    });
  });
});
