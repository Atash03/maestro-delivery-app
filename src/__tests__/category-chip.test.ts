/**
 * Tests for the CategoryChip component and category horizontal scroll
 *
 * Tests cover:
 * - Component exports and module structure
 * - CategoryChip props and types
 * - Selected/unselected states
 * - Animation configurations
 * - Home screen category integration
 * - Styling and theme integration
 * - Accessibility features
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

// Mock @shopify/flash-list
jest.mock('@shopify/flash-list', () => ({
  FlashList: 'FlashList',
}));

// Mock useHomeData hook
jest.mock('@/hooks/use-home-data', () => ({
  useHomeData: () => ({
    featuredRestaurants: [],
    popularRestaurants: [],
    quickBitesRestaurants: [],
    newRestaurants: [],
    isLoading: false,
    isRefreshing: false,
    refresh: jest.fn(),
    filterByCategory: jest.fn(),
  }),
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

// Mock stores
jest.mock('@/stores', () => ({
  useAuthStore: () => ({
    user: {
      id: 'user-1',
      name: 'John Doe',
      addresses: [
        {
          id: 'addr-1',
          label: 'Home',
          street: '123 Main St',
          city: 'San Francisco',
          zipCode: '94102',
          isDefault: true,
        },
      ],
    },
    isAuthenticated: true,
    isGuest: false,
  }),
}));

// ============================================================================
// Test Suites
// ============================================================================

describe('CategoryChip Component', () => {
  describe('Module Structure', () => {
    it('exports CategoryChip component from cards module', () => {
      const cards = require('@/components/cards');
      expect(cards.CategoryChip).toBeDefined();
      expect(typeof cards.CategoryChip).toBe('function');
    });

    it('exports CategoryChipProps type', () => {
      const cards = require('@/components/cards');
      // Types are compile-time only, but we can check the export exists
      expect(cards).toHaveProperty('CategoryChip');
    });

    it('exports from index.ts barrel file', () => {
      const indexContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/index.ts'),
        'utf8'
      );
      expect(indexContent).toContain('CategoryChip');
      expect(indexContent).toContain('CategoryChipProps');
    });
  });

  describe('Component Props', () => {
    it('accepts category prop with required fields', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('category: Category');
      expect(componentContent).toContain('category.name');
      expect(componentContent).toContain('category.icon');
    });

    it('accepts isSelected prop with default false', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('isSelected?: boolean');
      expect(componentContent).toContain('isSelected = false');
    });

    it('accepts onPress callback prop', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('onPress?: (category: Category) => void');
    });

    it('accepts testID prop for testing', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('testID?: string');
    });
  });

  describe('Visual States', () => {
    it('applies different background color when selected', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain(
        'backgroundColor: isSelected ? colors.primary : colors.backgroundSecondary'
      );
    });

    it('applies different border color when selected', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain(
        'borderColor: isSelected ? colors.primary : colors.border'
      );
    });

    it('applies white text color when selected', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("color: isSelected ? '#FFFFFF' : colors.text");
    });

    it('applies white icon color when selected', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("color={isSelected ? '#FFFFFF' : colors.icon}");
    });

    it('has different icon container background when selected', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("'rgba(255, 255, 255, 0.2)'");
      expect(componentContent).toContain('colors.backgroundTertiary');
    });
  });

  describe('Animation Configuration', () => {
    it('uses spring animation for scale effect', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('withSpring');
      expect(componentContent).toContain('SPRING_CONFIG');
    });

    it('defines spring configuration with damping and stiffness', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('damping: 15');
      expect(componentContent).toContain('stiffness: 200');
      expect(componentContent).toContain('mass: 0.5');
    });

    it('scales to 0.95 on press', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('scale.value = withSpring(0.95');
    });

    it('returns to scale 1 on press out', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('scale.value = withSpring(1,');
    });

    it('uses animated transform for scale', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('transform: [{ scale: scale.value }]');
    });

    it('has pressed overlay with animated opacity', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('pressedOverlay');
      expect(componentContent).toContain('animatedBackgroundStyle');
    });
  });

  describe('Press Handlers', () => {
    it('has handlePressIn callback', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('handlePressIn');
      expect(componentContent).toContain('onPressIn={handlePressIn}');
    });

    it('has handlePressOut callback', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('handlePressOut');
      expect(componentContent).toContain('onPressOut={handlePressOut}');
    });

    it('has handlePress callback that calls onPress', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('handlePress');
      expect(componentContent).toContain('onPress?.(category)');
    });

    it('uses useCallback for handler memoization', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('useCallback');
    });
  });

  describe('Styling', () => {
    it('uses design system BorderRadius for chip', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('borderRadius: BorderRadius.full');
    });

    it('uses design system Spacing for padding', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('paddingHorizontal: Spacing[3]');
      expect(componentContent).toContain('gap: Spacing[2]');
    });

    it('uses design system Typography for label', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('fontSize: Typography.sm.fontSize');
      expect(componentContent).toContain('lineHeight: Typography.sm.lineHeight');
    });

    it('defines fixed chip height', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('CHIP_HEIGHT = 40');
      expect(componentContent).toContain('height: CHIP_HEIGHT');
    });

    it('defines icon size', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('ICON_SIZE = 18');
    });

    it('has circular icon container', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('iconContainer');
      expect(componentContent).toContain('width: 28');
      expect(componentContent).toContain('height: 28');
    });

    it('uses border width for chip outline', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('borderWidth: 1');
    });
  });

  describe('Accessibility', () => {
    it('has accessibility label with category name', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('accessibilityLabel=');
      expect(componentContent).toContain('${category.name} category');
    });

    it('indicates selected state in accessibility label', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain("isSelected ? ', selected' : ''");
    });

    it('has button accessibility role', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('accessibilityRole="button"');
    });

    it('has accessibility state for selected', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('accessibilityState={{ selected: isSelected }}');
    });
  });

  describe('Icon Handling', () => {
    it('uses Ionicons for category icon', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('Ionicons');
      expect(componentContent).toContain('<Ionicons');
    });

    it('casts icon name to Ionicons glyph type', () => {
      const componentContent = require('fs').readFileSync(
        require('path').join(__dirname, '../components/cards/category-chip.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('as keyof typeof Ionicons.glyphMap');
    });
  });
});

describe('Home Screen Category Integration', () => {
  describe('Category List Setup', () => {
    it('imports CategoryChip from cards module', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain("import { CategoryChip } from '@/components/cards'");
    });

    it('imports mockCategories from mock data', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain("import { mockCategories } from '@/data/mock'");
    });

    it('uses FlatList for horizontal scroll', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('FlatList');
      expect(homeScreenContent).toContain('horizontal');
    });

    it('hides horizontal scroll indicator', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('showsHorizontalScrollIndicator={false}');
    });

    it('has testID for category list', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('testID="category-list"');
    });
  });

  describe('Category State Management', () => {
    it('uses useState for selected category', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('useState');
      expect(homeScreenContent).toContain('selectedCategory');
      expect(homeScreenContent).toContain('setSelectedCategory');
    });

    it('defaults to "cat-all" as selected category', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain("useState<string>('cat-all')");
    });

    it('has handleCategoryPress callback', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('handleCategoryPress');
      expect(homeScreenContent).toContain('setSelectedCategory(category.id)');
    });
  });

  describe('Category Item Rendering', () => {
    it('defines renderCategoryItem function', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('renderCategoryItem');
    });

    it('passes category to CategoryChip', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('category={item}');
    });

    it('passes isSelected based on selectedCategory state', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('isSelected={selectedCategory === item.id}');
    });

    it('passes onPress handler to CategoryChip', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('onPress={handleCategoryPress}');
    });

    it('passes testID with category id', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('testID={`category-chip-${item.id}`}');
    });

    it('uses keyExtractor with category id', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('categoryKeyExtractor');
      expect(homeScreenContent).toContain('item.id');
    });
  });

  describe('Category List Animation', () => {
    it('wraps each item in Animated.View', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('<Animated.View');
    });

    it('uses FadeInRight animation with delay based on index', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('FadeInRight.delay(index * 50)');
    });

    it('uses 300ms duration for animation', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('.duration(300)');
    });

    it('wraps category section in FadeIn animation', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('entering={FadeIn.delay(200).duration(300)}');
    });
  });

  describe('Category List Styling', () => {
    it('has categorySection style', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('categorySection');
      expect(homeScreenContent).toContain('marginTop: Spacing[3]');
    });

    it('has categoryList contentContainerStyle', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('categoryList');
      expect(homeScreenContent).toContain('paddingHorizontal: Spacing[4]');
    });

    it('uses ItemSeparatorComponent for gap', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('ItemSeparatorComponent');
      expect(homeScreenContent).toContain('CATEGORY_ITEM_GAP');
    });

    it('defines CATEGORY_ITEM_GAP constant', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('CATEGORY_ITEM_GAP = Spacing[2]');
    });
  });

  describe('Filter Display', () => {
    it('shows filter text when category other than All is selected', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain("selectedCategory !== 'cat-all'");
      expect(homeScreenContent).toContain('Showing:');
    });

    it('displays selected category name in filter text', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain(
        'mockCategories.find((c) => c.id === selectedCategory)?.name'
      );
    });

    it('uses primary color for filter text', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('color: colors.primary');
    });

    it('animates filter text appearance', () => {
      const homeScreenContent = require('fs').readFileSync(
        require('path').join(__dirname, '../app/(tabs)/index.tsx'),
        'utf8'
      );
      expect(homeScreenContent).toContain('entering={FadeIn.duration(200)}');
    });
  });
});

describe('Mock Categories Data', () => {
  it('has at least 10 categories for horizontal scroll', () => {
    const { mockCategories } = require('@/data/mock');
    expect(mockCategories.length).toBeGreaterThanOrEqual(10);
  });

  it('first category is "All"', () => {
    const { mockCategories } = require('@/data/mock');
    expect(mockCategories[0].id).toBe('cat-all');
    expect(mockCategories[0].name).toBe('All');
  });

  it('includes Pizza category', () => {
    const { mockCategories } = require('@/data/mock');
    const pizza = mockCategories.find((c: { name: string }) => c.name === 'Pizza');
    expect(pizza).toBeDefined();
    expect(pizza.id).toBe('cat-pizza');
    expect(pizza.icon).toBe('pizza');
  });

  it('includes Burgers category', () => {
    const { mockCategories } = require('@/data/mock');
    const burgers = mockCategories.find((c: { name: string }) => c.name === 'Burgers');
    expect(burgers).toBeDefined();
    expect(burgers.id).toBe('cat-burgers');
  });

  it('includes Sushi category', () => {
    const { mockCategories } = require('@/data/mock');
    const sushi = mockCategories.find((c: { name: string }) => c.name === 'Sushi');
    expect(sushi).toBeDefined();
    expect(sushi.id).toBe('cat-sushi');
  });

  it('includes Chinese category', () => {
    const { mockCategories } = require('@/data/mock');
    const chinese = mockCategories.find((c: { name: string }) => c.name === 'Chinese');
    expect(chinese).toBeDefined();
  });

  it('includes Indian category', () => {
    const { mockCategories } = require('@/data/mock');
    const indian = mockCategories.find((c: { name: string }) => c.name === 'Indian');
    expect(indian).toBeDefined();
  });

  it('includes Mexican category', () => {
    const { mockCategories } = require('@/data/mock');
    const mexican = mockCategories.find((c: { name: string }) => c.name === 'Mexican');
    expect(mexican).toBeDefined();
  });

  it('includes Thai category', () => {
    const { mockCategories } = require('@/data/mock');
    const thai = mockCategories.find((c: { name: string }) => c.name === 'Thai');
    expect(thai).toBeDefined();
  });

  it('includes Italian category', () => {
    const { mockCategories } = require('@/data/mock');
    const italian = mockCategories.find((c: { name: string }) => c.name === 'Italian');
    expect(italian).toBeDefined();
  });

  it('includes Healthy category', () => {
    const { mockCategories } = require('@/data/mock');
    const healthy = mockCategories.find((c: { name: string }) => c.name === 'Healthy');
    expect(healthy).toBeDefined();
  });

  it('includes Desserts category', () => {
    const { mockCategories } = require('@/data/mock');
    const desserts = mockCategories.find((c: { name: string }) => c.name === 'Desserts');
    expect(desserts).toBeDefined();
  });

  it('all categories have required fields', () => {
    const { mockCategories } = require('@/data/mock');
    mockCategories.forEach((category: { id: string; name: string; icon: string }) => {
      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
      expect(category.icon).toBeDefined();
      expect(typeof category.id).toBe('string');
      expect(typeof category.name).toBe('string');
      expect(typeof category.icon).toBe('string');
    });
  });

  it('all categories have valid Ionicons icon names', () => {
    const { mockCategories } = require('@/data/mock');
    const validIcons = [
      'restaurant',
      'pizza',
      'fast-food',
      'fish',
      'flame',
      'cafe',
      'leaf',
      'wine',
      'american-football',
      'sunny',
      'heart',
      'ice-cream',
    ];
    mockCategories.forEach((category: { icon: string }) => {
      expect(validIcons).toContain(category.icon);
    });
  });
});

describe('Cards Module Index', () => {
  it('exports CategoryChip from index.ts', () => {
    const indexContent = require('fs').readFileSync(
      require('path').join(__dirname, '../components/cards/index.ts'),
      'utf8'
    );
    expect(indexContent).toContain('export { CategoryChip');
    expect(indexContent).toContain('type CategoryChipProps');
    expect(indexContent).toContain("from './category-chip'");
  });

  it('has proper JSDoc comment', () => {
    const indexContent = require('fs').readFileSync(
      require('path').join(__dirname, '../components/cards/index.ts'),
      'utf8'
    );
    expect(indexContent).toContain('Card Components Library');
    expect(indexContent).toContain('Re-exports all card components');
  });
});
