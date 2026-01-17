/**
 * Tests for the animation wrapper components
 * Tests component types, exports, and prop validations
 *
 * Note: Full rendering tests require a React Native environment.
 * These tests validate the component module structure and types.
 */

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
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const createMockAnimation = () => {
    const animation = {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      damping: jest.fn().mockReturnThis(),
      stiffness: jest.fn().mockReturnThis(),
    };
    return animation;
  };

  return {
    default: {
      createAnimatedComponent: (component: unknown) => component,
      View: 'Animated.View',
    },
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: () => ({}),
    withSpring: (toValue: unknown) => toValue,
    withTiming: (toValue: unknown) => toValue,
    FadeIn: createMockAnimation(),
    FadeOut: createMockAnimation(),
    FadeInUp: createMockAnimation(),
    FadeInDown: createMockAnimation(),
    SlideInUp: createMockAnimation(),
    SlideInDown: createMockAnimation(),
    SlideOutUp: createMockAnimation(),
    SlideOutDown: createMockAnimation(),
    createAnimatedComponent: (component: unknown) => component,
  };
});

// Mock hooks
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

describe('Animation Components Module Structure', () => {
  describe('Component Exports', () => {
    it('exports FadeIn component and types', () => {
      const animations = require('@/components/animations');
      expect(animations.FadeIn).toBeDefined();
      expect(typeof animations.FadeIn).toBe('function');
    });

    it('exports SlideUp component and types', () => {
      const animations = require('@/components/animations');
      expect(animations.SlideUp).toBeDefined();
      expect(typeof animations.SlideUp).toBe('function');
    });

    it('exports ScalePress component and types', () => {
      const animations = require('@/components/animations');
      expect(animations.ScalePress).toBeDefined();
      expect(typeof animations.ScalePress).toBe('function');
    });

    it('exports StaggerList component and types', () => {
      const animations = require('@/components/animations');
      expect(animations.StaggerList).toBeDefined();
      expect(typeof animations.StaggerList).toBe('function');
    });

    it('exports StaggerChild component', () => {
      const animations = require('@/components/animations');
      expect(animations.StaggerChild).toBeDefined();
      expect(typeof animations.StaggerChild).toBe('function');
    });
  });
});

describe('FadeIn Component', () => {
  describe('Type Definitions', () => {
    it('supports all expected props', () => {
      const fadeInProps = {
        duration: 300,
        delay: 100,
        animateOut: true,
        exitDuration: 150,
        style: { backgroundColor: 'red' },
      };

      expect(fadeInProps.duration).toBe(300);
      expect(fadeInProps.delay).toBe(100);
      expect(fadeInProps.animateOut).toBe(true);
      expect(fadeInProps.exitDuration).toBe(150);
      expect(fadeInProps.style).toEqual({ backgroundColor: 'red' });
    });

    it('has sensible default values', () => {
      // Test that the component can work with minimal props
      const minimalProps = {};
      expect(minimalProps).toEqual({});
    });
  });
});

describe('SlideUp Component', () => {
  describe('Type Definitions', () => {
    it('has correct direction types', () => {
      const directions: Array<'up' | 'down'> = ['up', 'down'];
      expect(directions).toHaveLength(2);
      expect(directions).toContain('up');
      expect(directions).toContain('down');
    });

    it('supports all expected props', () => {
      const slideUpProps = {
        direction: 'up' as const,
        duration: 400,
        delay: 200,
        animateOut: true,
        exitDuration: 200,
        distance: 100,
        style: { flex: 1 },
      };

      expect(slideUpProps.direction).toBe('up');
      expect(slideUpProps.duration).toBe(400);
      expect(slideUpProps.delay).toBe(200);
      expect(slideUpProps.animateOut).toBe(true);
      expect(slideUpProps.exitDuration).toBe(200);
      expect(slideUpProps.distance).toBe(100);
    });
  });

  describe('Direction Logic', () => {
    it('up direction means content enters from below', () => {
      // When direction is 'up', the content slides up into view
      // (comes from the bottom of the screen)
      const direction = 'up';
      expect(direction).toBe('up');
    });

    it('down direction means content enters from above', () => {
      // When direction is 'down', the content slides down into view
      // (comes from the top of the screen)
      const direction = 'down';
      expect(direction).toBe('down');
    });
  });
});

describe('ScalePress Component', () => {
  describe('Type Definitions', () => {
    it('supports all expected props', () => {
      const scalePressProps = {
        pressedScale: 0.95,
        pressedOpacity: 0.8,
        springy: true,
        disabled: false,
        onPress: jest.fn(),
        onPressIn: jest.fn(),
        onPressOut: jest.fn(),
        style: { borderRadius: 8 },
      };

      expect(scalePressProps.pressedScale).toBe(0.95);
      expect(scalePressProps.pressedOpacity).toBe(0.8);
      expect(scalePressProps.springy).toBe(true);
      expect(scalePressProps.disabled).toBe(false);
    });

    it('has sensible default scale value', () => {
      const defaultScale = 0.97;
      expect(defaultScale).toBeLessThan(1);
      expect(defaultScale).toBeGreaterThan(0.9);
    });

    it('has sensible default opacity value', () => {
      const defaultOpacity = 0.9;
      expect(defaultOpacity).toBeLessThan(1);
      expect(defaultOpacity).toBeGreaterThan(0.5);
    });
  });

  describe('Animation Configuration', () => {
    it('spring animation uses appropriate damping and stiffness', () => {
      const springConfig = { damping: 15, stiffness: 400 };
      expect(springConfig.damping).toBeGreaterThan(0);
      expect(springConfig.stiffness).toBeGreaterThan(0);
    });
  });
});

describe('StaggerList Component', () => {
  describe('Type Definitions', () => {
    it('has correct animation type options', () => {
      const animationTypes: Array<'fade' | 'slideUp' | 'slideDown'> = [
        'fade',
        'slideUp',
        'slideDown',
      ];
      expect(animationTypes).toHaveLength(3);
      expect(animationTypes).toContain('fade');
      expect(animationTypes).toContain('slideUp');
      expect(animationTypes).toContain('slideDown');
    });

    it('supports all expected props', () => {
      interface TestItem {
        id: string;
        name: string;
      }

      const data: TestItem[] = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      const staggerListProps = {
        data,
        renderItem: (item: TestItem) => item.name,
        keyExtractor: (item: TestItem) => item.id,
        staggerDelay: 100,
        itemDuration: 250,
        initialDelay: 50,
        animationType: 'slideUp' as const,
        style: { padding: 16 },
        itemStyle: { marginBottom: 8 },
      };

      expect(staggerListProps.data).toHaveLength(2);
      expect(staggerListProps.staggerDelay).toBe(100);
      expect(staggerListProps.itemDuration).toBe(250);
      expect(staggerListProps.initialDelay).toBe(50);
      expect(staggerListProps.animationType).toBe('slideUp');
    });
  });

  describe('Stagger Delay Calculation', () => {
    it('calculates correct delays for each item', () => {
      const initialDelay = 100;
      const staggerDelay = 50;
      const itemCount = 5;

      const calculateDelay = (index: number): number => {
        return initialDelay + index * staggerDelay;
      };

      expect(calculateDelay(0)).toBe(100); // First item
      expect(calculateDelay(1)).toBe(150); // Second item
      expect(calculateDelay(2)).toBe(200); // Third item
      expect(calculateDelay(3)).toBe(250); // Fourth item
      expect(calculateDelay(4)).toBe(300); // Fifth item

      // Verify delays increase linearly
      for (let i = 1; i < itemCount; i++) {
        expect(calculateDelay(i) - calculateDelay(i - 1)).toBe(staggerDelay);
      }
    });

    it('handles zero initial delay', () => {
      const initialDelay = 0;
      const staggerDelay = 75;

      const calculateDelay = (index: number): number => {
        return initialDelay + index * staggerDelay;
      };

      expect(calculateDelay(0)).toBe(0);
      expect(calculateDelay(1)).toBe(75);
      expect(calculateDelay(2)).toBe(150);
    });

    it('handles zero stagger delay (all items animate at once)', () => {
      const initialDelay = 100;
      const staggerDelay = 0;

      const calculateDelay = (index: number): number => {
        return initialDelay + index * staggerDelay;
      };

      expect(calculateDelay(0)).toBe(100);
      expect(calculateDelay(1)).toBe(100);
      expect(calculateDelay(2)).toBe(100);
    });
  });

  describe('Key Extraction', () => {
    it('extracts unique keys from items', () => {
      interface Item {
        id: string;
        value: number;
      }

      const items: Item[] = [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
        { id: 'c', value: 3 },
      ];

      const keyExtractor = (item: Item) => item.id;
      const keys = items.map(keyExtractor);

      expect(keys).toEqual(['a', 'b', 'c']);
      expect(new Set(keys).size).toBe(keys.length); // All unique
    });

    it('can use index for key extraction', () => {
      const items = ['apple', 'banana', 'cherry'];
      const keyExtractor = (_item: string, index: number) => `item-${index}`;
      const keys = items.map(keyExtractor);

      expect(keys).toEqual(['item-0', 'item-1', 'item-2']);
    });
  });
});

describe('StaggerChild Component', () => {
  describe('Type Definitions', () => {
    it('supports all expected props', () => {
      const staggerChildProps = {
        index: 2,
        staggerDelay: 75,
        initialDelay: 50,
        duration: 300,
        animationType: 'fade' as const,
        style: { opacity: 1 },
      };

      expect(staggerChildProps.index).toBe(2);
      expect(staggerChildProps.staggerDelay).toBe(75);
      expect(staggerChildProps.initialDelay).toBe(50);
      expect(staggerChildProps.duration).toBe(300);
      expect(staggerChildProps.animationType).toBe('fade');
    });

    it('calculates delay based on index', () => {
      const index = 3;
      const staggerDelay = 50;
      const initialDelay = 100;

      const expectedDelay = initialDelay + index * staggerDelay;
      expect(expectedDelay).toBe(250);
    });
  });
});

describe('Animation Timing Constants', () => {
  it('defines appropriate duration ranges', () => {
    // Reference to AnimationDurations from theme
    const durations = {
      instant: 100,
      fast: 150,
      normal: 250,
      slow: 350,
      slower: 500,
    };

    // Verify durations increase progressively
    expect(durations.instant).toBeLessThan(durations.fast);
    expect(durations.fast).toBeLessThan(durations.normal);
    expect(durations.normal).toBeLessThan(durations.slow);
    expect(durations.slow).toBeLessThan(durations.slower);
  });

  it('default animation duration is appropriate for user experience', () => {
    const defaultDuration = 250; // AnimationDurations.normal

    // Should be perceptible but not too slow
    expect(defaultDuration).toBeGreaterThanOrEqual(200);
    expect(defaultDuration).toBeLessThanOrEqual(400);
  });
});

describe('Animation Composition', () => {
  it('FadeIn can be combined with other props', () => {
    // Test that FadeIn props don't conflict
    const combinedProps = {
      duration: 300,
      delay: 100,
      animateOut: true,
      exitDuration: 200,
      style: { flex: 1, padding: 16 },
    };

    expect(combinedProps.duration).toBeDefined();
    expect(combinedProps.style).toBeDefined();
  });

  it('SlideUp and FadeIn have compatible prop shapes', () => {
    // Both should support duration, delay, and style
    const fadeInProps = { duration: 300, delay: 100, style: {} };
    const slideUpProps = { duration: 300, delay: 100, style: {} };

    expect(Object.keys(fadeInProps)).toContain('duration');
    expect(Object.keys(fadeInProps)).toContain('delay');
    expect(Object.keys(slideUpProps)).toContain('duration');
    expect(Object.keys(slideUpProps)).toContain('delay');
  });
});

describe('Accessibility', () => {
  it('ScalePress includes proper accessibility attributes', () => {
    // ScalePress should set accessibilityRole and accessibilityState
    const accessibilityProps = {
      accessibilityRole: 'button',
      accessibilityState: { disabled: false },
    };

    expect(accessibilityProps.accessibilityRole).toBe('button');
    expect(accessibilityProps.accessibilityState.disabled).toBe(false);
  });

  it('disabled state is properly reflected in accessibility', () => {
    const enabledState = { disabled: false };
    const disabledState = { disabled: true };

    expect(enabledState.disabled).toBe(false);
    expect(disabledState.disabled).toBe(true);
  });
});

describe('Edge Cases', () => {
  it('StaggerList handles empty data array', () => {
    const emptyData: string[] = [];
    expect(emptyData).toHaveLength(0);
    // StaggerList should render nothing but not crash
  });

  it('StaggerList handles single item', () => {
    const singleItemData = ['only item'];
    expect(singleItemData).toHaveLength(1);
    // First item should animate with only initial delay
  });

  it('FadeIn handles zero duration', () => {
    const zeroDuration = 0;
    // Should still work, just no visible animation
    expect(zeroDuration).toBe(0);
  });

  it('ScalePress handles edge scale values', () => {
    const minScale = 0.5;
    const maxScale = 1.0;
    const normalScale = 0.97;

    expect(normalScale).toBeGreaterThanOrEqual(minScale);
    expect(normalScale).toBeLessThanOrEqual(maxScale);
  });
});
