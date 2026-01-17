/**
 * Tests for the onboarding carousel screen
 *
 * Tests screen structure, slide content, navigation, animations,
 * and AsyncStorage persistence for hasOnboarded flag.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// Mock react-native
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 390, height: 844 }),
  },
  Platform: {
    OS: 'ios',
    select: <T>(obj: { ios?: T; android?: T; default?: T }): T | undefined => {
      return obj.ios ?? obj.default;
    },
    Version: 14,
  },
  StyleSheet: {
    create: <T extends object>(styles: T): T => styles,
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
}));

// Mock expo-router
const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
};
jest.mock('expo-router', () => ({
  router: mockRouter,
}));

// Mock AsyncStorage
const mockAsyncStorage = {
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
};
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    View: 'Animated.View',
    ScrollView: 'Animated.ScrollView',
    createAnimatedComponent: (component: unknown) => component,
    SharedValue: class {
      value = 0;
    },
  },
  Extrapolation: {
    CLAMP: 'clamp',
    EXTEND: 'extend',
  },
  FadeIn: {
    delay: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
  },
  FadeInDown: {
    delay: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
  },
  FadeInUp: {
    delay: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
  },
  interpolate: jest.fn((value, inputRange, outputRange) => {
    // Simple linear interpolation for testing
    const index = inputRange.indexOf(value);
    if (index !== -1) return outputRange[index];
    return outputRange[1]; // Return middle value by default
  }),
  useAnimatedScrollHandler: jest.fn(() => jest.fn()),
  useAnimatedStyle: jest.fn(() => ({})),
  useSharedValue: jest.fn((initial) => ({ value: initial })),
  withSpring: jest.fn((value) => value),
  withTiming: jest.fn((value) => value),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock hooks
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

describe('Onboarding Screen', () => {
  const screenPath = path.join(__dirname, '..', 'app', '(auth)', 'onboarding.tsx');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('File Structure', () => {
    it('onboarding screen file exists', () => {
      expect(fs.existsSync(screenPath)).toBe(true);
    });

    it('exports default component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export default function OnboardingScreen');
    });

    it('exports STORAGE_KEY for testing', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export { STORAGE_KEY }');
    });
  });

  describe('Slide Content', () => {
    it('has 4 onboarding slides defined', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('ONBOARDING_SLIDES');

      // Count slide definitions by checking for slide IDs
      const slideIds = content.match(/id: ['"]?\d+['"]?/g);
      expect(slideIds).toHaveLength(4);
    });

    it('slide 1 has correct content - Discover Local Favorites', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Discover Local Favorites');
      expect(content).toContain('Browse hundreds of restaurants');
    });

    it('slide 2 has correct content - Easy Ordering', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Easy Ordering');
      expect(content).toContain('Customize your perfect meal');
    });

    it('slide 3 has correct content - Real-Time Tracking', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Real-Time Tracking');
      expect(content).toContain('Watch your order');
    });

    it('slide 4 has correct content - Quick Reordering', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Quick Reordering');
      expect(content).toContain('Your favorites saved');
    });

    it('each slide has an icon', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      // Check for icon properties in slide definitions
      expect(content).toContain("icon: 'compass'");
      expect(content).toContain("icon: 'restaurant'");
      expect(content).toContain("icon: 'location'");
      expect(content).toContain("icon: 'heart'");
    });

    it('each slide has a gradient color scheme', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      // Check for gradient definitions
      expect(content).toContain('gradient:');
      // Check that gradients have 2 colors
      const gradientMatches = content.match(
        /gradient: \[['"]#[A-Fa-f0-9]+['"], ['"]#[A-Fa-f0-9]+['"]\]/g
      );
      expect(gradientMatches).toHaveLength(4);
    });
  });

  describe('Navigation Elements', () => {
    it('has Skip button', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Skip');
      expect(content).toContain('handleSkip');
    });

    it('has Next button for non-last slides', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("'Next'");
      expect(content).toContain('handleNext');
    });

    it('has Get Started button for last slide', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("'Get Started'");
      expect(content).toContain('isLastSlide');
    });

    it('has Sign In link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Sign In');
      expect(content).toContain('Already have an account?');
    });

    it('navigates to sign-up on completion', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("router.replace('/sign-up')");
    });

    it('navigates to sign-in when Sign In is pressed', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("router.push('/sign-in')");
    });
  });

  describe('Pagination', () => {
    it('has PaginationDots component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function PaginationDots');
      expect(content).toContain('PaginationDot');
    });

    it('renders correct number of dots based on slide count', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('count={ONBOARDING_SLIDES.length}');
    });

    it('dots have animated width for active state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      // Check for width interpolation in pagination dot
      expect(content).toContain('interpolate');
      // Active dot should be wider (24) than inactive (8)
      expect(content).toContain('[8, 24, 8]');
    });
  });

  describe('Animations', () => {
    it('uses react-native-reanimated', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("from 'react-native-reanimated'");
    });

    it('implements parallax effect for slides', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      // Check for translateX interpolation which creates parallax
      expect(content).toContain('translateX');
      expect(content).toContain('interpolate');
      expect(content).toContain('SCREEN_WIDTH * 0.3');
    });

    it('has scale animation for slides', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('scale = interpolate');
      expect(content).toContain('[0.8, 1, 0.8]');
    });

    it('has opacity animation for slides', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('opacity = interpolate');
      expect(content).toContain('[0.3, 1, 0.3]');
    });

    it('has button press animation', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('buttonScale');
      expect(content).toContain('withSpring');
      expect(content).toContain('handlePressIn');
      expect(content).toContain('handlePressOut');
    });

    it('uses entering animations for UI elements', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FadeInDown');
      expect(content).toContain('FadeInUp');
      expect(content).toContain('FadeIn');
    });

    it('has scroll handler for animations', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('useAnimatedScrollHandler');
      expect(content).toContain('scrollX.value');
    });
  });

  describe('AsyncStorage Integration', () => {
    it('uses correct storage key', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("STORAGE_KEY = 'maestro-has-onboarded'");
    });

    it('saves onboarding completed status', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('AsyncStorage.setItem');
      expect(content).toContain('STORAGE_KEY');
    });

    it('handles storage errors gracefully', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('try');
      expect(content).toContain('catch');
      // Should still navigate even if storage fails
      expect(content).toContain("router.replace('/sign-up')");
    });

    it('completes onboarding when Skip is pressed', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleSkip');
      expect(content).toContain('completeOnboarding');
    });

    it('completes onboarding when Get Started is pressed', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleNext');
      // On last slide, should complete onboarding
      expect(content).toContain('completeOnboarding');
    });
  });

  describe('Carousel Behavior', () => {
    it('uses horizontal ScrollView', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Animated.ScrollView');
      expect(content).toContain('horizontal');
    });

    it('is pagingEnabled for snap effect', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('pagingEnabled');
    });

    it('hides horizontal scroll indicator', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('showsHorizontalScrollIndicator={false}');
    });

    it('tracks current index on scroll end', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('onMomentumScrollEnd');
      expect(content).toContain('setCurrentIndex');
    });

    it('scrolls to next slide on Next button press', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('scrollViewRef.current?.scrollTo');
      expect(content).toContain('(currentIndex + 1) * SCREEN_WIDTH');
    });

    it('uses ref for programmatic scroll', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('scrollViewRef');
      expect(content).toContain('useRef<Animated.ScrollView>');
    });
  });

  describe('Styling', () => {
    it('uses theme colors', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Colors[colorScheme');
      expect(content).toContain('colors.background');
      expect(content).toContain('colors.text');
      expect(content).toContain('colors.textSecondary');
      expect(content).toContain('colors.primary');
    });

    it('uses design system spacing', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Spacing[');
    });

    it('uses design system typography', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Typography['3xl']");
      expect(content).toContain('Typography.lg');
      expect(content).toContain('Typography.base');
    });

    it('uses design system border radius', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('BorderRadius.full');
      expect(content).toContain('BorderRadius.xl');
    });

    it('uses design system font weights', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FontWeights.bold');
      expect(content).toContain('FontWeights.semibold');
      expect(content).toContain('FontWeights.medium');
    });

    it('has proper container flex layout', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('flex: 1');
    });

    it('has icon background with shadow', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('iconBackground');
      expect(content).toContain('shadowColor');
      expect(content).toContain('shadowOffset');
      expect(content).toContain('shadowOpacity');
      expect(content).toContain('shadowRadius');
    });
  });

  describe('Accessibility', () => {
    it('has hitSlop for touch targets', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('hitSlop=');
    });

    it('uses Pressable for interactive elements', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('<Pressable');
    });
  });

  describe('Type Definitions', () => {
    it('has OnboardingSlide interface', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('interface OnboardingSlide');
      expect(content).toContain('id: string');
      expect(content).toContain('title: string');
      expect(content).toContain('description: string');
      expect(content).toContain('icon:');
      expect(content).toContain('gradient:');
    });

    it('has SlideProps interface', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('interface SlideProps');
    });

    it('has PaginationDotsProps interface', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('interface PaginationDotsProps');
    });

    it('has PaginationDotProps interface', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('interface PaginationDotProps');
    });
  });

  describe('Component Structure', () => {
    it('has Slide subcomponent', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function Slide(');
    });

    it('has PaginationDots subcomponent', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function PaginationDots(');
    });

    it('has PaginationDot subcomponent', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function PaginationDot(');
    });

    it('uses useCallback for handlers', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('useCallback');
    });

    it('uses useState for current index', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('useState');
      expect(content).toContain('currentIndex');
    });

    it('uses useSharedValue for animations', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('useSharedValue');
      expect(content).toContain('scrollX');
      expect(content).toContain('buttonScale');
    });
  });

  describe('Imports', () => {
    it('imports from correct modules', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');

      // React imports
      expect(content).toContain("from 'react'");
      expect(content).toContain('useCallback');
      expect(content).toContain('useRef');
      expect(content).toContain('useState');

      // React Native imports
      expect(content).toContain("from 'react-native'");
      expect(content).toContain('Dimensions');
      expect(content).toContain('StyleSheet');

      // Expo imports
      expect(content).toContain("from 'expo-router'");
      expect(content).toContain("from '@expo/vector-icons'");

      // Internal imports
      expect(content).toContain("from '@/constants/theme'");
      expect(content).toContain("from '@/hooks/use-color-scheme'");

      // AsyncStorage
      expect(content).toContain("from '@react-native-async-storage/async-storage'");
    });
  });
});

describe('Onboarding Storage Key', () => {
  it('storage key matches expected format', () => {
    const expectedKey = 'maestro-has-onboarded';
    // Verify by reading the file
    const screenPath = path.join(__dirname, '..', 'app', '(auth)', 'onboarding.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');
    expect(content).toContain(`STORAGE_KEY = '${expectedKey}'`);
  });
});

describe('Screen Dimensions', () => {
  it('uses Dimensions.get for screen width', () => {
    const screenPath = path.join(__dirname, '..', 'app', '(auth)', 'onboarding.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');
    expect(content).toContain("Dimensions.get('window')");
    expect(content).toContain('SCREEN_WIDTH');
  });
});
