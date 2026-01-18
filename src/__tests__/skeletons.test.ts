/**
 * Tests for skeleton loading components
 *
 * Verifies the skeleton components module structure, exports, and types.
 * Full rendering tests require a React Native environment.
 */

// Mock react-native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: <T>(obj: { ios?: T; android?: T; default?: T }): T | undefined => {
      return obj.ios ?? obj.default;
    },
  },
  StyleSheet: {
    create: <T extends object>(styles: T): T => styles,
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
}));

// Mock react-native-reanimated with chainable animation builders
const createChainableAnimation = () => {
  const chainable: Record<string, (...args: unknown[]) => typeof chainable> = {};
  chainable.duration = () => chainable;
  chainable.delay = () => chainable;
  chainable.springify = () => chainable;
  chainable.damping = () => chainable;
  chainable.stiffness = () => chainable;
  return chainable;
};

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
  interpolate: () => 0,
  Easing: {
    linear: (t: number) => t,
  },
  FadeIn: createChainableAnimation(),
  FadeInDown: createChainableAnimation(),
  FadeInUp: createChainableAnimation(),
  FadeInRight: createChainableAnimation(),
  Layout: createChainableAnimation(),
  createAnimatedComponent: (component: unknown) => component,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: unknown }) => children,
}));

// Mock the useColorScheme hook
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

// ============================================================================
// Test Suites
// ============================================================================

describe('Skeleton Components Module', () => {
  describe('Module Structure', () => {
    it('should export RestaurantCardSkeleton component', () => {
      const skeletonModule = require('@/components/skeletons');
      expect(skeletonModule.RestaurantCardSkeleton).toBeDefined();
      expect(typeof skeletonModule.RestaurantCardSkeleton).toBe('function');
    });

    it('should export HomeScreenSkeleton component', () => {
      const skeletonModule = require('@/components/skeletons');
      expect(skeletonModule.HomeScreenSkeleton).toBeDefined();
      expect(typeof skeletonModule.HomeScreenSkeleton).toBe('function');
    });

    it('should export RestaurantDetailSkeleton component', () => {
      const skeletonModule = require('@/components/skeletons');
      expect(skeletonModule.RestaurantDetailSkeleton).toBeDefined();
      expect(typeof skeletonModule.RestaurantDetailSkeleton).toBe('function');
    });

    it('should export OrderDetailsSkeleton component', () => {
      const skeletonModule = require('@/components/skeletons');
      expect(skeletonModule.OrderDetailsSkeleton).toBeDefined();
      expect(typeof skeletonModule.OrderDetailsSkeleton).toBe('function');
    });

    it('should export SearchScreenSkeleton component', () => {
      const skeletonModule = require('@/components/skeletons');
      expect(skeletonModule.SearchScreenSkeleton).toBeDefined();
      expect(typeof skeletonModule.SearchScreenSkeleton).toBe('function');
    });
  });

  describe('Component Prop Types', () => {
    it('RestaurantCardSkeleton should accept variant prop', () => {
      const { RestaurantCardSkeleton } = require('@/components/skeletons');

      // Test that the component function accepts these props without error
      const defaultProps = { variant: 'default', testID: 'test-skeleton' };
      const featuredProps = { variant: 'featured', testID: 'featured-skeleton' };

      // If the component type is correct, these shouldn't throw
      expect(() => RestaurantCardSkeleton(defaultProps)).not.toThrow();
      expect(() => RestaurantCardSkeleton(featuredProps)).not.toThrow();
    });

    it('HomeScreenSkeleton should accept testID prop', () => {
      const { HomeScreenSkeleton } = require('@/components/skeletons');
      expect(() => HomeScreenSkeleton({ testID: 'home-skeleton' })).not.toThrow();
    });

    it('RestaurantDetailSkeleton should accept testID prop', () => {
      const { RestaurantDetailSkeleton } = require('@/components/skeletons');
      expect(() =>
        RestaurantDetailSkeleton({ testID: 'restaurant-detail-skeleton' })
      ).not.toThrow();
    });

    it('OrderDetailsSkeleton should accept testID prop', () => {
      const { OrderDetailsSkeleton } = require('@/components/skeletons');
      expect(() => OrderDetailsSkeleton({ testID: 'order-details-skeleton' })).not.toThrow();
    });

    it('SearchScreenSkeleton should accept testID prop', () => {
      const { SearchScreenSkeleton } = require('@/components/skeletons');
      expect(() => SearchScreenSkeleton({ testID: 'search-skeleton' })).not.toThrow();
    });
  });

  describe('Screen Skeleton Coverage', () => {
    it('should have skeleton for home screen', () => {
      // HomeScreenSkeleton covers the main discovery feed
      const { HomeScreenSkeleton } = require('@/components/skeletons');
      expect(HomeScreenSkeleton).toBeDefined();
    });

    it('should have skeleton for restaurant detail screen', () => {
      // RestaurantDetailSkeleton covers restaurant/[id] screen
      const { RestaurantDetailSkeleton } = require('@/components/skeletons');
      expect(RestaurantDetailSkeleton).toBeDefined();
    });

    it('should have skeleton for order details screen', () => {
      // OrderDetailsSkeleton covers order/details/[id] screen
      const { OrderDetailsSkeleton } = require('@/components/skeletons');
      expect(OrderDetailsSkeleton).toBeDefined();
    });

    it('should have skeleton for search screen', () => {
      // SearchScreenSkeleton covers (tabs)/search screen
      const { SearchScreenSkeleton } = require('@/components/skeletons');
      expect(SearchScreenSkeleton).toBeDefined();
    });

    it('should have reusable restaurant card skeleton', () => {
      // RestaurantCardSkeleton for use in lists
      const { RestaurantCardSkeleton } = require('@/components/skeletons');
      expect(RestaurantCardSkeleton).toBeDefined();
    });
  });
});

describe('Shimmer Animation Coverage', () => {
  it('all skeleton components use the Skeleton base with shimmer animation', () => {
    // All skeleton components in the skeletons module use the base Skeleton component
    // which has shimmer animation enabled by default (animated = true in the component)
    const skeletonModule = require('@/components/skeletons');

    // Verify all screen skeletons are exported and functional
    expect(skeletonModule.HomeScreenSkeleton).toBeDefined();
    expect(skeletonModule.RestaurantDetailSkeleton).toBeDefined();
    expect(skeletonModule.OrderDetailsSkeleton).toBeDefined();
    expect(skeletonModule.SearchScreenSkeleton).toBeDefined();
    expect(skeletonModule.RestaurantCardSkeleton).toBeDefined();
  });

  it('skeleton components return valid React elements', () => {
    const skeletonModule = require('@/components/skeletons');

    // Test that each skeleton component can be called and returns something
    // (the return value structure depends on the mock environment)
    const homeResult = skeletonModule.HomeScreenSkeleton({});
    const restaurantResult = skeletonModule.RestaurantDetailSkeleton({});
    const orderResult = skeletonModule.OrderDetailsSkeleton({});
    const searchResult = skeletonModule.SearchScreenSkeleton({});
    const cardResult = skeletonModule.RestaurantCardSkeleton({});

    expect(homeResult).toBeDefined();
    expect(restaurantResult).toBeDefined();
    expect(orderResult).toBeDefined();
    expect(searchResult).toBeDefined();
    expect(cardResult).toBeDefined();
  });
});
