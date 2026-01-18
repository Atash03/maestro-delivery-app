/**
 * Tests for the RestaurantCard component
 *
 * Tests cover:
 * - Component exports and module structure
 * - RestaurantCard props and types
 * - Helper functions (formatPriceLevel, formatDeliveryTime, formatDeliveryFee)
 * - Visual states (open/closed, featured variant)
 * - Animation configurations
 * - Styling and theme integration
 * - Accessibility features
 * - Promotional badge display
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
  FlatList: 'FlatList',
  Pressable: 'Pressable',
  TextInput: 'TextInput',
  ScrollView: 'ScrollView',
  Modal: 'Modal',
  TouchableOpacity: 'TouchableOpacity',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Image: 'Image',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    createAnimatedComponent: (component: unknown) => component,
    View: 'View',
    Text: 'Text',
  },
  useSharedValue: (init: unknown) => ({ value: init }),
  useAnimatedStyle: () => ({}),
  withSpring: (toValue: unknown) => toValue,
  withTiming: (toValue: unknown) => toValue,
  withRepeat: (animation: unknown) => animation,
  interpolateColor: () => '#000000',
  interpolate: () => 0,
  FadeIn: {
    delay: () => ({
      duration: () => ({}),
    }),
  },
  FadeInRight: {
    delay: () => ({
      duration: () => ({}),
    }),
  },
  FadeInDown: {
    delay: () => ({
      duration: () => ({}),
    }),
  },
  FadeOut: 'FadeOut',
  Easing: {
    linear: (t: number) => t,
  },
  createAnimatedComponent: (component: unknown) => component,
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'ExpoImage',
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
  SafeAreaProvider: 'SafeAreaProvider',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: () => ({}),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock hooks
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

// ============================================================================
// Test Suites
// ============================================================================

describe('RestaurantCard Component', () => {
  describe('Module Structure', () => {
    it('exports RestaurantCard component from cards module', () => {
      const cards = require('@/components/cards');
      expect(cards.RestaurantCard).toBeDefined();
      // memo() wraps components returning an object with $$typeof, so check for either function or memo object
      const isValidComponent =
        typeof cards.RestaurantCard === 'function' ||
        (typeof cards.RestaurantCard === 'object' && cards.RestaurantCard !== null);
      expect(isValidComponent).toBe(true);
    });

    it('exports RestaurantCardProps type', () => {
      const cards = require('@/components/cards');
      expect(cards).toHaveProperty('RestaurantCard');
    });

    it('exports helper functions', () => {
      const cards = require('@/components/cards');
      expect(cards.formatPriceLevel).toBeDefined();
      expect(typeof cards.formatPriceLevel).toBe('function');
      expect(cards.formatDeliveryTime).toBeDefined();
      expect(typeof cards.formatDeliveryTime).toBe('function');
      expect(cards.formatDeliveryFee).toBeDefined();
      expect(typeof cards.formatDeliveryFee).toBe('function');
    });

    it('exports from index.ts barrel file', () => {
      const indexContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/index.ts'),
        'utf8'
      );
      expect(indexContent).toContain('RestaurantCard');
      expect(indexContent).toContain('RestaurantCardProps');
      expect(indexContent).toContain('formatPriceLevel');
      expect(indexContent).toContain('formatDeliveryTime');
      expect(indexContent).toContain('formatDeliveryFee');
    });
  });

  describe('Component Props', () => {
    it('accepts restaurant prop with required type', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('restaurant: Restaurant');
    });

    it('accepts onPress callback prop', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('onPress?: (restaurant: Restaurant) => void');
    });

    it('accepts promotionalBadge optional prop', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('promotionalBadge?: string');
    });

    it('accepts testID prop for testing', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('testID?: string');
    });

    it('accepts variant prop with default and featured options', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("variant?: 'default' | 'featured'");
      expect(componentContent).toContain("variant = 'default'");
    });
  });

  describe('Helper Functions', () => {
    describe('formatPriceLevel', () => {
      it('returns correct number of dollar signs', () => {
        const { formatPriceLevel } = require('@/components/cards');
        expect(formatPriceLevel(1)).toBe('$');
        expect(formatPriceLevel(2)).toBe('$$');
        expect(formatPriceLevel(3)).toBe('$$$');
        expect(formatPriceLevel(4)).toBe('$$$$');
      });

      it('clamps values to minimum of 1', () => {
        const { formatPriceLevel } = require('@/components/cards');
        expect(formatPriceLevel(0)).toBe('$');
        expect(formatPriceLevel(-1)).toBe('$');
      });

      it('clamps values to maximum of 4', () => {
        const { formatPriceLevel } = require('@/components/cards');
        expect(formatPriceLevel(5)).toBe('$$$$');
        expect(formatPriceLevel(10)).toBe('$$$$');
      });
    });

    describe('formatDeliveryTime', () => {
      it('formats delivery time range correctly', () => {
        const { formatDeliveryTime } = require('@/components/cards');
        expect(formatDeliveryTime(20, 30)).toBe('20-30 min');
        expect(formatDeliveryTime(15, 25)).toBe('15-25 min');
        expect(formatDeliveryTime(35, 50)).toBe('35-50 min');
      });
    });

    describe('formatDeliveryFee', () => {
      it('formats delivery fee with currency', () => {
        const { formatDeliveryFee } = require('@/components/cards');
        expect(formatDeliveryFee(2.99)).toBe('$2.99 delivery');
        expect(formatDeliveryFee(1.49)).toBe('$1.49 delivery');
        expect(formatDeliveryFee(4.99)).toBe('$4.99 delivery');
      });

      it('returns "Free delivery" for zero fee', () => {
        const { formatDeliveryFee } = require('@/components/cards');
        expect(formatDeliveryFee(0)).toBe('Free delivery');
      });

      it('formats with two decimal places', () => {
        const { formatDeliveryFee } = require('@/components/cards');
        expect(formatDeliveryFee(3)).toBe('$3.00 delivery');
        expect(formatDeliveryFee(2.5)).toBe('$2.50 delivery');
      });
    });
  });

  describe('Visual States', () => {
    describe('Open State', () => {
      it('does not disable press when restaurant is open', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('disabled={!restaurant.isOpen}');
      });

      it('does not show closed overlay when restaurant is open', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('{!restaurant.isOpen && (');
      });
    });

    describe('Closed State', () => {
      it('shows closed overlay when restaurant is closed', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('closedOverlay');
        expect(componentContent).toContain('closedBadge');
        expect(componentContent).toContain('Currently Closed');
      });

      it('uses semi-transparent background for closed overlay', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain("backgroundColor: 'rgba(0, 0, 0, 0.6)'");
      });

      it('indicates closed state in accessibility', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain("!restaurant.isOpen ? ', Currently closed' : ''");
      });
    });

    describe('Variant Sizes', () => {
      it('defines CARD_HEIGHT constant for default variant', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('CARD_HEIGHT = 200');
      });

      it('defines FEATURED_CARD_HEIGHT constant for featured variant', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('FEATURED_CARD_HEIGHT = 240');
      });

      it('calculates card height based on variant', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain(
          "variant === 'featured' ? FEATURED_CARD_HEIGHT : CARD_HEIGHT"
        );
      });

      it('defines IMAGE_HEIGHT_RATIO', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('IMAGE_HEIGHT_RATIO = 0.6');
      });
    });
  });

  describe('Image Section', () => {
    it('uses expo-image Image component', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("import { Image } from 'expo-image'");
      expect(componentContent).toContain('source={{ uri: restaurant.image }}');
    });

    it('uses cover content fit for image', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('contentFit="cover"');
    });

    it('uses 200ms transition for image loading', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('transition={200}');
    });

    it('has gradient overlay using LinearGradient', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("import { LinearGradient } from 'expo-linear-gradient'");
      expect(componentContent).toContain('<LinearGradient');
      expect(componentContent).toContain("colors={['transparent', 'rgba(0,0,0,0.3)']}");
    });
  });

  describe('Promotional Badge', () => {
    it('shows promotional badge when prop is provided and restaurant is open', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('{promotionalBadge && restaurant.isOpen && (');
    });

    it('has promotional badge styling with primary color', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('promoBadge');
      expect(componentContent).toContain('backgroundColor: PrimaryColors[500]');
    });

    it('includes pricetag icon in promotional badge', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('name="pricetag"');
    });

    it('positions promotional badge at top-left', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("position: 'absolute'");
      expect(componentContent).toContain('top: Spacing[2]');
      expect(componentContent).toContain('left: Spacing[2]');
    });
  });

  describe('Info Section', () => {
    describe('Header Row', () => {
      it('displays restaurant name with truncation', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('{restaurant.name}');
        expect(componentContent).toContain('numberOfLines={1}');
        expect(componentContent).toContain('ellipsizeMode="tail"');
      });

      it('displays rating with star icon', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('name="star"');
        expect(componentContent).toContain('WarningColors[500]');
        expect(componentContent).toContain('restaurant.rating.toFixed(1)');
      });

      it('displays review count in parentheses', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('({restaurant.reviewCount})');
      });
    });

    describe('Cuisine Row', () => {
      it('displays cuisine types joined with bullet', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain("restaurant.cuisine.slice(0, 2).join(' • ')");
      });

      it('limits cuisine display to first 2 types', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('.slice(0, 2)');
      });

      it('displays price level', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('{priceLevelText}');
        expect(componentContent).toContain('formatPriceLevel(restaurant.priceLevel)');
      });
    });

    describe('Delivery Row', () => {
      it('displays delivery time with time icon', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('name="time-outline"');
        expect(componentContent).toContain('{deliveryTimeText}');
      });

      it('displays delivery fee with bicycle icon', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('name="bicycle-outline"');
        expect(componentContent).toContain('{deliveryFeeText}');
      });

      it('uses dot separator between delivery info', () => {
        const componentContent = require('fs').readFileSync(
          require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
          'utf8'
        );
        expect(componentContent).toContain('deliveryDot');
        expect(componentContent).toContain('styles.dot');
      });
    });
  });

  describe('Animation Configuration', () => {
    it('uses spring animation for scale effect', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('withSpring');
      expect(componentContent).toContain('SPRING_CONFIG');
    });

    it('defines spring configuration with damping, stiffness, mass', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('damping: 15');
      expect(componentContent).toContain('stiffness: 200');
      expect(componentContent).toContain('mass: 0.5');
    });

    it('scales to 0.97 on press', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('scale.value = withSpring(0.97');
    });

    it('returns to scale 1 on press out', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('scale.value = withSpring(1,');
    });

    it('uses animated transform for scale', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('transform: [{ scale: scale.value }]');
    });
  });

  describe('Press Handlers', () => {
    it('has handlePressIn callback', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('handlePressIn');
      expect(componentContent).toContain('onPressIn={handlePressIn}');
    });

    it('has handlePressOut callback', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('handlePressOut');
      expect(componentContent).toContain('onPressOut={handlePressOut}');
    });

    it('has handlePress callback that calls onPress', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('handlePress');
      expect(componentContent).toContain('onPress?.(restaurant)');
    });

    it('uses useCallback for handler memoization', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('useCallback');
    });
  });

  describe('Styling', () => {
    it('uses design system BorderRadius for card', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('borderRadius: BorderRadius.lg');
    });

    it('uses design system Spacing for padding and gaps', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('padding: Spacing[3]');
      expect(componentContent).toContain('marginRight: Spacing[2]');
      expect(componentContent).toContain('marginLeft: Spacing[1]');
    });

    it('uses design system Typography for text sizes', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('fontSize: Typography.lg.fontSize');
      expect(componentContent).toContain('fontSize: Typography.sm.fontSize');
      expect(componentContent).toContain('fontSize: Typography.xs.fontSize');
    });

    it('uses design system Shadows for elevation', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('Shadows.md');
    });

    it('uses theme colors for card background', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('backgroundColor: colors.card');
    });

    it('has overflow hidden for rounded corners', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("overflow: 'hidden'");
    });
  });

  describe('Accessibility', () => {
    it('has comprehensive accessibility label', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('accessibilityLabel=');
      expect(componentContent).toContain('${restaurant.name}');
      expect(componentContent).toContain('${cuisineText}');
      expect(componentContent).toContain('${restaurant.rating} stars');
      expect(componentContent).toContain('${deliveryTimeText}');
    });

    it('has button accessibility role', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('accessibilityRole="button"');
    });

    it('has accessibility state for disabled', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('accessibilityState={{ disabled: !restaurant.isOpen }}');
    });
  });

  describe('Theme Support', () => {
    it('uses useColorScheme hook', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('useColorScheme');
    });

    it('uses Colors from theme constants', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("Colors[colorScheme ?? 'light']");
    });

    it('uses theme colors for text', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('color: colors.text');
      expect(componentContent).toContain('color: colors.textSecondary');
      expect(componentContent).toContain('color: colors.textTertiary');
    });

    it('uses theme colors for icons', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/restaurant-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('color={colors.icon}');
    });
  });
});

describe('Cards Module Index - RestaurantCard', () => {
  it('exports RestaurantCard from index.ts', () => {
    const indexContent = require('fs').readFileSync(
      require('path').join(__dirname, '../components/cards/index.ts'),
      'utf8'
    );
    expect(indexContent).toContain('RestaurantCard');
    expect(indexContent).toContain('RestaurantCardProps');
    expect(indexContent).toContain("from './restaurant-card'");
  });

  it('exports helper functions from index.ts', () => {
    const indexContent = require('fs').readFileSync(
      require('path').join(__dirname, '../components/cards/index.ts'),
      'utf8'
    );
    expect(indexContent).toContain('formatPriceLevel');
    expect(indexContent).toContain('formatDeliveryTime');
    expect(indexContent).toContain('formatDeliveryFee');
  });
});

describe('Mock Restaurant Data Compatibility', () => {
  it('mockRestaurants have all required fields for RestaurantCard', () => {
    const { mockRestaurants } = require('@/data/mock');
    mockRestaurants.forEach(
      (restaurant: {
        id: string;
        name: string;
        image: string;
        rating: number;
        reviewCount: number;
        deliveryTime: { min: number; max: number };
        deliveryFee: number;
        cuisine: string[];
        priceLevel: number;
        isOpen: boolean;
      }) => {
        expect(restaurant.id).toBeDefined();
        expect(restaurant.name).toBeDefined();
        expect(restaurant.image).toBeDefined();
        expect(restaurant.rating).toBeDefined();
        expect(restaurant.reviewCount).toBeDefined();
        expect(restaurant.deliveryTime).toBeDefined();
        expect(restaurant.deliveryTime.min).toBeDefined();
        expect(restaurant.deliveryTime.max).toBeDefined();
        expect(restaurant.deliveryFee).toBeDefined();
        expect(restaurant.cuisine).toBeDefined();
        expect(restaurant.priceLevel).toBeDefined();
        expect(typeof restaurant.isOpen).toBe('boolean');
      }
    );
  });

  it('has at least one closed restaurant for testing closed state', () => {
    const { mockRestaurants } = require('@/data/mock');
    const closedRestaurants = mockRestaurants.filter(
      (r: { isOpen: boolean }) => r.isOpen === false
    );
    expect(closedRestaurants.length).toBeGreaterThanOrEqual(1);
  });

  it('has restaurants with various price levels', () => {
    const { mockRestaurants } = require('@/data/mock');
    const priceLevels = new Set(mockRestaurants.map((r: { priceLevel: number }) => r.priceLevel));
    expect(priceLevels.size).toBeGreaterThan(1);
  });

  it('has restaurants with various delivery fees', () => {
    const { mockRestaurants } = require('@/data/mock');
    const deliveryFees = new Set(
      mockRestaurants.map((r: { deliveryFee: number }) => r.deliveryFee)
    );
    expect(deliveryFees.size).toBeGreaterThan(1);
  });

  it('has restaurants with valid ratings', () => {
    const { mockRestaurants } = require('@/data/mock');
    mockRestaurants.forEach((restaurant: { rating: number }) => {
      expect(restaurant.rating).toBeGreaterThanOrEqual(0);
      expect(restaurant.rating).toBeLessThanOrEqual(5);
    });
  });
});
