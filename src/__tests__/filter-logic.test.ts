/**
 * Tests for Filter Logic
 *
 * Comprehensive tests for:
 * - Filter store (filter-store.ts)
 * - useFilteredRestaurants hook (use-filtered-restaurants.ts)
 * - Filter integration with home screen
 */

import {
  applyFilters,
  calculateActiveFilterCount,
  matchesCategory,
  matchesDeliveryTime,
  matchesDietary,
  matchesMinRating,
  matchesPriceRange,
  sortRestaurants,
} from '@/hooks/use-filtered-restaurants';
import { DEFAULT_FILTER_STATE, type FilterState, useFilterStore } from '@/stores/filter-store';
import type { DietaryOption, PriceLevel, Restaurant } from '@/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  let storage: Record<string, string> = {};

  return {
    __esModule: true,
    default: {
      setItem: jest.fn((key: string, value: string) => {
        storage[key] = value;
        return Promise.resolve();
      }),
      getItem: jest.fn((key: string) => {
        return Promise.resolve(storage[key] || null);
      }),
      removeItem: jest.fn((key: string) => {
        delete storage[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        storage = {};
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => {
        return Promise.resolve(Object.keys(storage));
      }),
      multiGet: jest.fn((keys: string[]) => {
        return Promise.resolve(keys.map((key) => [key, storage[key] || null]));
      }),
      multiSet: jest.fn((keyValuePairs: [string, string][]) => {
        keyValuePairs.forEach(([key, value]) => {
          storage[key] = value;
        });
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys: string[]) => {
        keys.forEach((key) => {
          delete storage[key];
        });
        return Promise.resolve();
      }),
    },
  };
});

// Helper to reset filter store
function resetFilterStore() {
  useFilterStore.setState(DEFAULT_FILTER_STATE);
}

// ============================================================================
// Test Data Fixtures
// ============================================================================

const createMockRestaurant = (overrides?: Partial<Restaurant>): Restaurant => ({
  id: 'rest-1',
  name: 'Test Restaurant',
  image: 'https://example.com/image.jpg',
  rating: 4.5,
  reviewCount: 200,
  deliveryTime: { min: 20, max: 30 },
  deliveryFee: 2.99,
  cuisine: ['Italian', 'Pizza'],
  priceLevel: 2 as PriceLevel,
  isOpen: true,
  address: '123 Test St',
  ...overrides,
});

const mockRestaurants: Restaurant[] = [
  createMockRestaurant({
    id: 'rest-1',
    name: 'Bella Italia',
    rating: 4.7,
    reviewCount: 324,
    deliveryTime: { min: 25, max: 35 },
    deliveryFee: 2.99,
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    priceLevel: 2,
    isOpen: true,
  }),
  createMockRestaurant({
    id: 'rest-2',
    name: 'Tokyo Ramen',
    rating: 4.8,
    reviewCount: 512,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 1.99,
    cuisine: ['Japanese', 'Ramen', 'Asian'],
    priceLevel: 2,
    isOpen: true,
  }),
  createMockRestaurant({
    id: 'rest-3',
    name: 'Burger Barn',
    rating: 4.5,
    reviewCount: 876,
    deliveryTime: { min: 15, max: 25 },
    deliveryFee: 0.99,
    cuisine: ['American', 'Burgers', 'Fast Food'],
    priceLevel: 1,
    isOpen: true,
  }),
  createMockRestaurant({
    id: 'rest-4',
    name: 'Spice Garden',
    rating: 4.6,
    reviewCount: 289,
    deliveryTime: { min: 30, max: 45 },
    deliveryFee: 2.49,
    cuisine: ['Indian', 'Curry', 'Vegetarian'],
    priceLevel: 2,
    isOpen: true,
  }),
  createMockRestaurant({
    id: 'rest-5',
    name: 'Le Petit Bistro',
    rating: 4.8,
    reviewCount: 189,
    deliveryTime: { min: 35, max: 50 },
    deliveryFee: 4.99,
    cuisine: ['French', 'European', 'Fine Dining'],
    priceLevel: 4,
    isOpen: true,
  }),
  createMockRestaurant({
    id: 'rest-6',
    name: 'Closed Restaurant',
    rating: 4.9,
    reviewCount: 500,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 1.99,
    cuisine: ['Italian'],
    priceLevel: 2,
    isOpen: false,
  }),
  createMockRestaurant({
    id: 'rest-7',
    name: 'Green Bowl',
    rating: 4.6,
    reviewCount: 234,
    deliveryTime: { min: 15, max: 25 },
    deliveryFee: 2.49,
    cuisine: ['Healthy', 'Salads', 'Vegan'],
    priceLevel: 2,
    isOpen: true,
  }),
  createMockRestaurant({
    id: 'rest-8',
    name: 'Budget Eats',
    rating: 3.8,
    reviewCount: 150,
    deliveryTime: { min: 10, max: 20 },
    deliveryFee: 0.49,
    cuisine: ['American', 'Fast Food'],
    priceLevel: 1,
    isOpen: true,
  }),
];

// ============================================================================
// Filter Store Tests
// ============================================================================

describe('Filter Store', () => {
  beforeEach(() => {
    resetFilterStore();
  });

  describe('Initial State', () => {
    it('should have correct default filter state', () => {
      const state = useFilterStore.getState();
      expect(state.sortBy).toBe('recommended');
      expect(state.priceRange).toEqual([]);
      expect(state.minRating).toBeNull();
      expect(state.maxDeliveryTime).toBeNull();
      expect(state.dietary).toEqual([]);
    });

    it('should export DEFAULT_FILTER_STATE constant', () => {
      expect(DEFAULT_FILTER_STATE).toEqual({
        sortBy: 'recommended',
        priceRange: [],
        minRating: null,
        maxDeliveryTime: null,
        dietary: [],
      });
    });
  });

  describe('setSortBy', () => {
    it('should update sort option', () => {
      useFilterStore.getState().setSortBy('rating');
      expect(useFilterStore.getState().sortBy).toBe('rating');
    });

    it('should update to fastest_delivery', () => {
      useFilterStore.getState().setSortBy('fastest_delivery');
      expect(useFilterStore.getState().sortBy).toBe('fastest_delivery');
    });

    it('should update to distance', () => {
      useFilterStore.getState().setSortBy('distance');
      expect(useFilterStore.getState().sortBy).toBe('distance');
    });
  });

  describe('togglePriceLevel', () => {
    it('should add price level when not selected', () => {
      useFilterStore.getState().togglePriceLevel(2);
      expect(useFilterStore.getState().priceRange).toContain(2);
    });

    it('should remove price level when already selected', () => {
      useFilterStore.getState().togglePriceLevel(2);
      useFilterStore.getState().togglePriceLevel(2);
      expect(useFilterStore.getState().priceRange).not.toContain(2);
    });

    it('should allow multiple price levels', () => {
      useFilterStore.getState().togglePriceLevel(1);
      useFilterStore.getState().togglePriceLevel(2);
      useFilterStore.getState().togglePriceLevel(3);
      expect(useFilterStore.getState().priceRange).toEqual([1, 2, 3]);
    });

    it('should handle all four price levels', () => {
      useFilterStore.getState().togglePriceLevel(1);
      useFilterStore.getState().togglePriceLevel(2);
      useFilterStore.getState().togglePriceLevel(3);
      useFilterStore.getState().togglePriceLevel(4);
      expect(useFilterStore.getState().priceRange).toHaveLength(4);
    });
  });

  describe('setMinRating', () => {
    it('should set minimum rating', () => {
      useFilterStore.getState().setMinRating(4.5);
      expect(useFilterStore.getState().minRating).toBe(4.5);
    });

    it('should clear rating with null', () => {
      useFilterStore.getState().setMinRating(4.5);
      useFilterStore.getState().setMinRating(null);
      expect(useFilterStore.getState().minRating).toBeNull();
    });

    it('should set 4.0 rating', () => {
      useFilterStore.getState().setMinRating(4.0);
      expect(useFilterStore.getState().minRating).toBe(4.0);
    });

    it('should set 3.5 rating', () => {
      useFilterStore.getState().setMinRating(3.5);
      expect(useFilterStore.getState().minRating).toBe(3.5);
    });
  });

  describe('setMaxDeliveryTime', () => {
    it('should set maximum delivery time', () => {
      useFilterStore.getState().setMaxDeliveryTime(30);
      expect(useFilterStore.getState().maxDeliveryTime).toBe(30);
    });

    it('should clear delivery time with null', () => {
      useFilterStore.getState().setMaxDeliveryTime(30);
      useFilterStore.getState().setMaxDeliveryTime(null);
      expect(useFilterStore.getState().maxDeliveryTime).toBeNull();
    });

    it('should set 45 minute delivery time', () => {
      useFilterStore.getState().setMaxDeliveryTime(45);
      expect(useFilterStore.getState().maxDeliveryTime).toBe(45);
    });

    it('should set 60 minute delivery time', () => {
      useFilterStore.getState().setMaxDeliveryTime(60);
      expect(useFilterStore.getState().maxDeliveryTime).toBe(60);
    });
  });

  describe('toggleDietary', () => {
    it('should add dietary option when not selected', () => {
      useFilterStore.getState().toggleDietary('vegetarian');
      expect(useFilterStore.getState().dietary).toContain('vegetarian');
    });

    it('should remove dietary option when already selected', () => {
      useFilterStore.getState().toggleDietary('vegetarian');
      useFilterStore.getState().toggleDietary('vegetarian');
      expect(useFilterStore.getState().dietary).not.toContain('vegetarian');
    });

    it('should allow multiple dietary options', () => {
      useFilterStore.getState().toggleDietary('vegetarian');
      useFilterStore.getState().toggleDietary('vegan');
      useFilterStore.getState().toggleDietary('gluten_free');
      expect(useFilterStore.getState().dietary).toEqual(['vegetarian', 'vegan', 'gluten_free']);
    });

    it('should handle all dietary options', () => {
      const options: DietaryOption[] = ['vegetarian', 'vegan', 'gluten_free', 'halal', 'kosher'];
      for (const opt of options) {
        useFilterStore.getState().toggleDietary(opt);
      }
      expect(useFilterStore.getState().dietary).toHaveLength(5);
    });
  });

  describe('clearFilters', () => {
    it('should reset all filters to default', () => {
      // Set various filters
      useFilterStore.getState().setSortBy('rating');
      useFilterStore.getState().togglePriceLevel(1);
      useFilterStore.getState().togglePriceLevel(2);
      useFilterStore.getState().setMinRating(4.5);
      useFilterStore.getState().setMaxDeliveryTime(30);
      useFilterStore.getState().toggleDietary('vegetarian');

      // Clear all
      useFilterStore.getState().clearFilters();

      const state = useFilterStore.getState();
      expect(state.sortBy).toBe('recommended');
      expect(state.priceRange).toEqual([]);
      expect(state.minRating).toBeNull();
      expect(state.maxDeliveryTime).toBeNull();
      expect(state.dietary).toEqual([]);
    });
  });

  describe('applyFilters', () => {
    it('should apply complete filter state', () => {
      const newFilters: FilterState = {
        sortBy: 'fastest_delivery',
        priceRange: [1, 2],
        minRating: 4.0,
        maxDeliveryTime: 30,
        dietary: ['vegetarian', 'vegan'],
      };

      useFilterStore.getState().applyFilters(newFilters);

      const state = useFilterStore.getState();
      expect(state.sortBy).toBe('fastest_delivery');
      expect(state.priceRange).toEqual([1, 2]);
      expect(state.minRating).toBe(4.0);
      expect(state.maxDeliveryTime).toBe(30);
      expect(state.dietary).toEqual(['vegetarian', 'vegan']);
    });
  });

  describe('getActiveFilterCount', () => {
    it('should return 0 for default state', () => {
      expect(useFilterStore.getState().getActiveFilterCount()).toBe(0);
    });

    it('should count non-default sort as 1', () => {
      useFilterStore.getState().setSortBy('rating');
      expect(useFilterStore.getState().getActiveFilterCount()).toBe(1);
    });

    it('should count each price level', () => {
      useFilterStore.getState().togglePriceLevel(1);
      useFilterStore.getState().togglePriceLevel(2);
      expect(useFilterStore.getState().getActiveFilterCount()).toBe(2);
    });

    it('should count min rating as 1', () => {
      useFilterStore.getState().setMinRating(4.5);
      expect(useFilterStore.getState().getActiveFilterCount()).toBe(1);
    });

    it('should count delivery time as 1', () => {
      useFilterStore.getState().setMaxDeliveryTime(30);
      expect(useFilterStore.getState().getActiveFilterCount()).toBe(1);
    });

    it('should count each dietary option', () => {
      useFilterStore.getState().toggleDietary('vegetarian');
      useFilterStore.getState().toggleDietary('vegan');
      useFilterStore.getState().toggleDietary('halal');
      expect(useFilterStore.getState().getActiveFilterCount()).toBe(3);
    });

    it('should sum all active filters correctly', () => {
      useFilterStore.getState().setSortBy('rating'); // 1
      useFilterStore.getState().togglePriceLevel(1); // 1
      useFilterStore.getState().togglePriceLevel(2); // 1
      useFilterStore.getState().setMinRating(4.0); // 1
      useFilterStore.getState().setMaxDeliveryTime(30); // 1
      useFilterStore.getState().toggleDietary('vegetarian'); // 1
      useFilterStore.getState().toggleDietary('vegan'); // 1
      expect(useFilterStore.getState().getActiveFilterCount()).toBe(7);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false for default state', () => {
      expect(useFilterStore.getState().hasActiveFilters()).toBe(false);
    });

    it('should return true when any filter is active', () => {
      useFilterStore.getState().setSortBy('rating');
      expect(useFilterStore.getState().hasActiveFilters()).toBe(true);
    });
  });
});

// ============================================================================
// Filter Function Tests
// ============================================================================

describe('Filter Functions', () => {
  describe('matchesPriceRange', () => {
    it('should return true when no price filter is set', () => {
      const restaurant = createMockRestaurant({ priceLevel: 3 });
      expect(matchesPriceRange(restaurant, [])).toBe(true);
    });

    it('should return true when restaurant price matches filter', () => {
      const restaurant = createMockRestaurant({ priceLevel: 2 });
      expect(matchesPriceRange(restaurant, [2])).toBe(true);
    });

    it('should return false when restaurant price does not match filter', () => {
      const restaurant = createMockRestaurant({ priceLevel: 3 });
      expect(matchesPriceRange(restaurant, [1, 2])).toBe(false);
    });

    it('should work with multiple price levels', () => {
      const restaurant = createMockRestaurant({ priceLevel: 2 });
      expect(matchesPriceRange(restaurant, [1, 2, 3])).toBe(true);
    });
  });

  describe('matchesMinRating', () => {
    it('should return true when no rating filter is set', () => {
      const restaurant = createMockRestaurant({ rating: 3.5 });
      expect(matchesMinRating(restaurant, null)).toBe(true);
    });

    it('should return true when restaurant rating meets minimum', () => {
      const restaurant = createMockRestaurant({ rating: 4.7 });
      expect(matchesMinRating(restaurant, 4.5)).toBe(true);
    });

    it('should return true when restaurant rating equals minimum', () => {
      const restaurant = createMockRestaurant({ rating: 4.5 });
      expect(matchesMinRating(restaurant, 4.5)).toBe(true);
    });

    it('should return false when restaurant rating is below minimum', () => {
      const restaurant = createMockRestaurant({ rating: 4.3 });
      expect(matchesMinRating(restaurant, 4.5)).toBe(false);
    });
  });

  describe('matchesDeliveryTime', () => {
    it('should return true when no delivery time filter is set', () => {
      const restaurant = createMockRestaurant({ deliveryTime: { min: 40, max: 60 } });
      expect(matchesDeliveryTime(restaurant, null)).toBe(true);
    });

    it('should return true when restaurant max delivery time is within limit', () => {
      const restaurant = createMockRestaurant({ deliveryTime: { min: 15, max: 25 } });
      expect(matchesDeliveryTime(restaurant, 30)).toBe(true);
    });

    it('should return true when restaurant max delivery time equals limit', () => {
      const restaurant = createMockRestaurant({ deliveryTime: { min: 20, max: 30 } });
      expect(matchesDeliveryTime(restaurant, 30)).toBe(true);
    });

    it('should return false when restaurant max delivery time exceeds limit', () => {
      const restaurant = createMockRestaurant({ deliveryTime: { min: 30, max: 45 } });
      expect(matchesDeliveryTime(restaurant, 30)).toBe(false);
    });
  });

  describe('matchesDietary', () => {
    it('should return true when no dietary filter is set', () => {
      const restaurant = createMockRestaurant({ cuisine: ['American'] });
      expect(matchesDietary(restaurant, [])).toBe(true);
    });

    it('should return true for vegetarian cuisine with vegetarian filter', () => {
      const restaurant = createMockRestaurant({ cuisine: ['Vegetarian'] });
      expect(matchesDietary(restaurant, ['vegetarian'])).toBe(true);
    });

    it('should return true for vegan cuisine with vegan filter', () => {
      const restaurant = createMockRestaurant({ cuisine: ['Healthy', 'Salads', 'Vegan'] });
      expect(matchesDietary(restaurant, ['vegan'])).toBe(true);
    });

    it('should return true for Indian cuisine with halal filter', () => {
      const restaurant = createMockRestaurant({ cuisine: ['Indian', 'Curry'] });
      expect(matchesDietary(restaurant, ['halal'])).toBe(true);
    });

    it('should return false for non-matching dietary options', () => {
      const restaurant = createMockRestaurant({ cuisine: ['American', 'Burgers'] });
      expect(matchesDietary(restaurant, ['vegetarian'])).toBe(false);
    });
  });

  describe('matchesCategory', () => {
    it('should return true when no category filter is set', () => {
      const restaurant = createMockRestaurant({ cuisine: ['Italian'] });
      expect(matchesCategory(restaurant, null)).toBe(true);
    });

    it('should return true for "All" category', () => {
      const restaurant = createMockRestaurant({ cuisine: ['Italian'] });
      expect(matchesCategory(restaurant, 'All')).toBe(true);
    });

    it('should return true when restaurant has matching cuisine', () => {
      const restaurant = createMockRestaurant({ cuisine: ['Italian', 'Pizza'] });
      expect(matchesCategory(restaurant, 'Italian')).toBe(true);
    });

    it('should be case insensitive', () => {
      const restaurant = createMockRestaurant({ cuisine: ['Italian', 'Pizza'] });
      expect(matchesCategory(restaurant, 'italian')).toBe(true);
      expect(matchesCategory(restaurant, 'ITALIAN')).toBe(true);
    });

    it('should return false when restaurant does not have matching cuisine', () => {
      const restaurant = createMockRestaurant({ cuisine: ['Japanese', 'Sushi'] });
      expect(matchesCategory(restaurant, 'Italian')).toBe(false);
    });
  });

  describe('applyFilters', () => {
    it('should filter out closed restaurants', () => {
      const restaurant = createMockRestaurant({ isOpen: false });
      const filters = DEFAULT_FILTER_STATE;
      expect(applyFilters(restaurant, filters)).toBe(false);
    });

    it('should pass restaurant with default filters', () => {
      const restaurant = createMockRestaurant({ isOpen: true });
      const filters = DEFAULT_FILTER_STATE;
      expect(applyFilters(restaurant, filters)).toBe(true);
    });

    it('should apply multiple filters together', () => {
      const restaurant = createMockRestaurant({
        isOpen: true,
        priceLevel: 2,
        rating: 4.5,
        deliveryTime: { min: 20, max: 30 },
        cuisine: ['Indian', 'Vegetarian'],
      });
      const filters: FilterState = {
        sortBy: 'recommended',
        priceRange: [2],
        minRating: 4.0,
        maxDeliveryTime: 30,
        dietary: ['vegetarian'],
      };
      expect(applyFilters(restaurant, filters)).toBe(true);
    });

    it('should fail if any filter does not match', () => {
      const restaurant = createMockRestaurant({
        isOpen: true,
        priceLevel: 3, // Does not match
        rating: 4.5,
        deliveryTime: { min: 20, max: 30 },
      });
      const filters: FilterState = {
        sortBy: 'recommended',
        priceRange: [1, 2],
        minRating: null,
        maxDeliveryTime: null,
        dietary: [],
      };
      expect(applyFilters(restaurant, filters)).toBe(false);
    });

    it('should apply category filter when provided', () => {
      const restaurant = createMockRestaurant({
        isOpen: true,
        cuisine: ['Italian', 'Pizza'],
      });
      const filters = DEFAULT_FILTER_STATE;
      expect(applyFilters(restaurant, filters, 'Italian')).toBe(true);
      expect(applyFilters(restaurant, filters, 'Japanese')).toBe(false);
    });
  });
});

// ============================================================================
// Sort Function Tests
// ============================================================================

describe('Sort Functions', () => {
  describe('sortRestaurants', () => {
    it('should sort by recommended (combination of rating and reviews)', () => {
      const sorted = sortRestaurants(mockRestaurants, 'recommended');
      // Higher combined score should come first
      expect(sorted[0].rating).toBeGreaterThanOrEqual(4.5);
    });

    it('should sort by fastest_delivery (lowest min time first)', () => {
      const sorted = sortRestaurants(mockRestaurants, 'fastest_delivery');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].deliveryTime.min).toBeGreaterThanOrEqual(sorted[i - 1].deliveryTime.min);
      }
    });

    it('should sort by rating (highest first)', () => {
      const sorted = sortRestaurants(mockRestaurants, 'rating');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].rating).toBeLessThanOrEqual(sorted[i - 1].rating);
      }
    });

    it('should sort by distance (using delivery fee as proxy)', () => {
      const sorted = sortRestaurants(mockRestaurants, 'distance');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].deliveryFee).toBeGreaterThanOrEqual(sorted[i - 1].deliveryFee);
      }
    });

    it('should sort by price_low_to_high', () => {
      const sorted = sortRestaurants(mockRestaurants, 'price_low_to_high');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].priceLevel).toBeGreaterThanOrEqual(sorted[i - 1].priceLevel);
      }
    });

    it('should sort by price_high_to_low', () => {
      const sorted = sortRestaurants(mockRestaurants, 'price_high_to_low');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].priceLevel).toBeLessThanOrEqual(sorted[i - 1].priceLevel);
      }
    });

    it('should not mutate original array', () => {
      const original = [...mockRestaurants];
      sortRestaurants(mockRestaurants, 'rating');
      expect(mockRestaurants).toEqual(original);
    });
  });
});

// ============================================================================
// Active Filter Count Tests
// ============================================================================

describe('calculateActiveFilterCount', () => {
  it('should return 0 for default state', () => {
    expect(calculateActiveFilterCount(DEFAULT_FILTER_STATE)).toBe(0);
  });

  it('should count non-default sort as 1', () => {
    const filters: FilterState = { ...DEFAULT_FILTER_STATE, sortBy: 'rating' };
    expect(calculateActiveFilterCount(filters)).toBe(1);
  });

  it('should count each price level individually', () => {
    const filters: FilterState = { ...DEFAULT_FILTER_STATE, priceRange: [1, 2, 3] };
    expect(calculateActiveFilterCount(filters)).toBe(3);
  });

  it('should count min rating as 1 when set', () => {
    const filters: FilterState = { ...DEFAULT_FILTER_STATE, minRating: 4.5 };
    expect(calculateActiveFilterCount(filters)).toBe(1);
  });

  it('should count max delivery time as 1 when set', () => {
    const filters: FilterState = { ...DEFAULT_FILTER_STATE, maxDeliveryTime: 30 };
    expect(calculateActiveFilterCount(filters)).toBe(1);
  });

  it('should count each dietary option individually', () => {
    const filters: FilterState = { ...DEFAULT_FILTER_STATE, dietary: ['vegetarian', 'vegan'] };
    expect(calculateActiveFilterCount(filters)).toBe(2);
  });

  it('should sum all counts correctly', () => {
    const filters: FilterState = {
      sortBy: 'rating', // 1
      priceRange: [1, 2], // 2
      minRating: 4.0, // 1
      maxDeliveryTime: 30, // 1
      dietary: ['vegetarian', 'vegan', 'halal'], // 3
    };
    expect(calculateActiveFilterCount(filters)).toBe(8);
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Filter Integration', () => {
  beforeEach(() => {
    resetFilterStore();
  });

  describe('Full Filter Flow', () => {
    it('should filter restaurants with combined criteria', () => {
      const filters: FilterState = {
        sortBy: 'rating',
        priceRange: [1, 2],
        minRating: 4.5,
        maxDeliveryTime: 30,
        dietary: [],
      };

      const filtered = mockRestaurants.filter((r) => applyFilters(r, filters));

      // Should filter out closed restaurants
      expect(filtered.every((r) => r.isOpen)).toBe(true);

      // Should filter by price
      expect(filtered.every((r) => filters.priceRange.includes(r.priceLevel))).toBe(true);

      // Should filter by rating
      expect(filtered.every((r) => r.rating >= 4.5)).toBe(true);

      // Should filter by delivery time
      expect(filtered.every((r) => r.deliveryTime.max <= 30)).toBe(true);
    });

    it('should apply filters and sort together', () => {
      const filters: FilterState = {
        sortBy: 'fastest_delivery',
        priceRange: [],
        minRating: 4.0,
        maxDeliveryTime: null,
        dietary: [],
      };

      const filtered = mockRestaurants.filter((r) => applyFilters(r, filters));
      const sorted = sortRestaurants(filtered, filters.sortBy);

      // All should meet rating requirement
      expect(sorted.every((r) => r.rating >= 4.0)).toBe(true);

      // Should be sorted by delivery time
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].deliveryTime.min).toBeGreaterThanOrEqual(sorted[i - 1].deliveryTime.min);
      }
    });
  });

  describe('Store Persistence', () => {
    it('should maintain filter state across multiple operations', () => {
      useFilterStore.getState().setSortBy('rating');
      useFilterStore.getState().togglePriceLevel(1);
      useFilterStore.getState().setMinRating(4.0);

      const state = useFilterStore.getState();
      expect(state.sortBy).toBe('rating');
      expect(state.priceRange).toContain(1);
      expect(state.minRating).toBe(4.0);
    });

    it('should reset correctly after clear', () => {
      useFilterStore.getState().setSortBy('rating');
      useFilterStore.getState().togglePriceLevel(1);
      useFilterStore.getState().clearFilters();

      expect(useFilterStore.getState().sortBy).toBe('recommended');
      expect(useFilterStore.getState().priceRange).toEqual([]);
    });
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Edge Cases', () => {
  it('should handle empty restaurant list', () => {
    const filtered: Restaurant[] = [];
    const sorted = sortRestaurants(filtered, 'rating');
    expect(sorted).toEqual([]);
  });

  it('should handle single restaurant', () => {
    const single = [mockRestaurants[0]];
    const sorted = sortRestaurants(single, 'rating');
    expect(sorted).toHaveLength(1);
  });

  it('should handle restaurants with same ratings', () => {
    const sameRating = [
      createMockRestaurant({ id: '1', rating: 4.5 }),
      createMockRestaurant({ id: '2', rating: 4.5 }),
      createMockRestaurant({ id: '3', rating: 4.5 }),
    ];
    const sorted = sortRestaurants(sameRating, 'rating');
    expect(sorted).toHaveLength(3);
    expect(sorted.every((r) => r.rating === 4.5)).toBe(true);
  });

  it('should handle all restaurants being closed', () => {
    const allClosed = mockRestaurants.map((r) => ({ ...r, isOpen: false }));
    const filtered = allClosed.filter((r) => applyFilters(r, DEFAULT_FILTER_STATE));
    expect(filtered).toHaveLength(0);
  });

  it('should handle extreme price filter (all levels)', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      priceRange: [1, 2, 3, 4],
    };
    const filtered = mockRestaurants.filter((r) => applyFilters(r, filters));
    // Should include all open restaurants
    expect(filtered.length).toBe(mockRestaurants.filter((r) => r.isOpen).length);
  });

  it('should handle very high rating filter', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      minRating: 5.0,
    };
    const filtered = mockRestaurants.filter((r) => applyFilters(r, filters));
    expect(filtered).toHaveLength(0);
  });

  it('should handle very low delivery time filter', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      maxDeliveryTime: 5,
    };
    const filtered = mockRestaurants.filter((r) => applyFilters(r, filters));
    expect(filtered).toHaveLength(0);
  });
});
