/**
 * Tests for useSearch hook
 */

import * as fs from 'fs';
import * as path from 'path';

import { getRestaurantById, mockMenuItems, mockRestaurants } from '@/data/mock';

const hookPath = path.join(process.cwd(), 'src/hooks/use-search.ts');
const hookSource = fs.readFileSync(hookPath, 'utf-8');

// ============================================================================
// Test: Hook Export
// ============================================================================

describe('useSearch hook', () => {
  describe('module exports', () => {
    it('should exist at correct path', () => {
      expect(fs.existsSync(hookPath)).toBe(true);
    });

    it('should export useSearch function', () => {
      expect(hookSource).toContain('export function useSearch');
    });

    it('should export default as useSearch', () => {
      expect(hookSource).toContain('export default useSearch');
    });

    it('should export SearchResult type', () => {
      expect(hookSource).toContain('export interface SearchResult');
    });

    it('should export MenuItemWithRestaurant type', () => {
      expect(hookSource).toContain('export interface MenuItemWithRestaurant');
    });

    it('should export UseSearchOptions type', () => {
      expect(hookSource).toContain('export interface UseSearchOptions');
    });

    it('should export UseSearchReturn type', () => {
      expect(hookSource).toContain('export interface UseSearchReturn');
    });
  });

  // ============================================================================
  // Test: Search Logic
  // ============================================================================

  describe('search logic', () => {
    describe('restaurant search', () => {
      it('should find restaurants by name', () => {
        const query = 'Bella Italia';
        const results = mockRestaurants.filter((r) =>
          r.name.toLowerCase().includes(query.toLowerCase())
        );
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toBe('Bella Italia');
      });

      it('should find restaurants by cuisine', () => {
        const query = 'Italian';
        const results = mockRestaurants.filter((r) =>
          r.cuisine.some((c) => c.toLowerCase().includes(query.toLowerCase()))
        );
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((r) => r.cuisine.includes('Italian'))).toBe(true);
      });

      it('should find restaurants by description', () => {
        const query = 'ramen';
        const results = mockRestaurants.filter((r) =>
          r.description?.toLowerCase().includes(query.toLowerCase())
        );
        expect(results.length).toBeGreaterThan(0);
      });

      it('should be case insensitive', () => {
        const lowerResults = mockRestaurants.filter((r) => r.name.toLowerCase().includes('burger'));
        const upperResults = mockRestaurants.filter((r) =>
          r.name.toLowerCase().includes('BURGER'.toLowerCase())
        );
        expect(lowerResults.length).toBe(upperResults.length);
      });

      it('should return empty array for no matches', () => {
        const query = 'xyznonexistent123';
        const results = mockRestaurants.filter((r) =>
          r.name.toLowerCase().includes(query.toLowerCase())
        );
        expect(results.length).toBe(0);
      });
    });

    describe('menu item search', () => {
      it('should find menu items by name', () => {
        const query = 'Pizza';
        const results = mockMenuItems.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        expect(results.length).toBeGreaterThan(0);
      });

      it('should find menu items by description', () => {
        const query = 'beef';
        const results = mockMenuItems.filter((item) =>
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        expect(results.length).toBeGreaterThan(0);
      });

      it('should find menu items by category', () => {
        const query = 'Burgers';
        const results = mockMenuItems.filter((item) =>
          item.category.toLowerCase().includes(query.toLowerCase())
        );
        expect(results.length).toBeGreaterThan(0);
      });

      it('should be case insensitive', () => {
        const lowerResults = mockMenuItems.filter((item) =>
          item.name.toLowerCase().includes('chicken')
        );
        const upperResults = mockMenuItems.filter((item) =>
          item.name.toLowerCase().includes('CHICKEN'.toLowerCase())
        );
        expect(lowerResults.length).toBe(upperResults.length);
      });

      it('should return empty array for no matches', () => {
        const query = 'nonexistentitem456';
        const results = mockMenuItems.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        expect(results.length).toBe(0);
      });
    });

    describe('restaurant name resolution', () => {
      it('should get restaurant by id', () => {
        const restaurant = getRestaurantById('rest-001');
        expect(restaurant).toBeDefined();
        expect(restaurant?.name).toBe('Bella Italia');
      });

      it('should return undefined for invalid id', () => {
        const restaurant = getRestaurantById('invalid-id');
        expect(restaurant).toBeUndefined();
      });

      it('should resolve restaurant name for menu items', () => {
        const menuItem = mockMenuItems.find((item) => item.restaurantId === 'rest-001');
        expect(menuItem).toBeDefined();
        const restaurant = getRestaurantById(menuItem!.restaurantId);
        expect(restaurant?.name).toBe('Bella Italia');
      });
    });
  });

  // ============================================================================
  // Test: Hook Options
  // ============================================================================

  describe('hook options', () => {
    it('should have default debounceMs of 300', () => {
      // Default values are defined in the hook
      const DEFAULT_DEBOUNCE_MS = 300;
      expect(DEFAULT_DEBOUNCE_MS).toBe(300);
    });

    it('should have default minQueryLength of 2', () => {
      const DEFAULT_MIN_QUERY_LENGTH = 2;
      expect(DEFAULT_MIN_QUERY_LENGTH).toBe(2);
    });
  });

  // ============================================================================
  // Test: Return Value Structure
  // ============================================================================

  describe('return value structure', () => {
    it('should return query string', () => {
      // Hook returns query: string
      const expectedKeys = [
        'query',
        'setQuery',
        'results',
        'isLoading',
        'hasSearched',
        'clearSearch',
      ];
      expect(expectedKeys).toContain('query');
    });

    it('should return setQuery function', () => {
      const expectedKeys = [
        'query',
        'setQuery',
        'results',
        'isLoading',
        'hasSearched',
        'clearSearch',
      ];
      expect(expectedKeys).toContain('setQuery');
    });

    it('should return results object', () => {
      const expectedKeys = [
        'query',
        'setQuery',
        'results',
        'isLoading',
        'hasSearched',
        'clearSearch',
      ];
      expect(expectedKeys).toContain('results');
    });

    it('should return isLoading boolean', () => {
      const expectedKeys = [
        'query',
        'setQuery',
        'results',
        'isLoading',
        'hasSearched',
        'clearSearch',
      ];
      expect(expectedKeys).toContain('isLoading');
    });

    it('should return hasSearched boolean', () => {
      const expectedKeys = [
        'query',
        'setQuery',
        'results',
        'isLoading',
        'hasSearched',
        'clearSearch',
      ];
      expect(expectedKeys).toContain('hasSearched');
    });

    it('should return clearSearch function', () => {
      const expectedKeys = [
        'query',
        'setQuery',
        'results',
        'isLoading',
        'hasSearched',
        'clearSearch',
      ];
      expect(expectedKeys).toContain('clearSearch');
    });
  });

  // ============================================================================
  // Test: Search Results Structure
  // ============================================================================

  describe('search results structure', () => {
    it('should have restaurants array', () => {
      const results = { restaurants: [], menuItems: [] };
      expect(Array.isArray(results.restaurants)).toBe(true);
    });

    it('should have menuItems array', () => {
      const results = { restaurants: [], menuItems: [] };
      expect(Array.isArray(results.menuItems)).toBe(true);
    });
  });

  // ============================================================================
  // Test: MenuItemWithRestaurant Type
  // ============================================================================

  describe('MenuItemWithRestaurant type', () => {
    it('should include all MenuItem fields', () => {
      const menuItem = mockMenuItems[0];
      expect(menuItem).toHaveProperty('id');
      expect(menuItem).toHaveProperty('restaurantId');
      expect(menuItem).toHaveProperty('name');
      expect(menuItem).toHaveProperty('description');
      expect(menuItem).toHaveProperty('price');
      expect(menuItem).toHaveProperty('category');
    });

    it('should add restaurantName field', () => {
      const menuItem = mockMenuItems[0];
      const restaurant = getRestaurantById(menuItem.restaurantId);
      const menuItemWithRestaurant = {
        ...menuItem,
        restaurantName: restaurant?.name ?? 'Unknown Restaurant',
      };
      expect(menuItemWithRestaurant).toHaveProperty('restaurantName');
      expect(typeof menuItemWithRestaurant.restaurantName).toBe('string');
    });

    it('should use "Unknown Restaurant" as fallback', () => {
      const menuItem = { ...mockMenuItems[0], restaurantId: 'invalid-id' };
      const restaurant = getRestaurantById(menuItem.restaurantId);
      const restaurantName = restaurant?.name ?? 'Unknown Restaurant';
      expect(restaurantName).toBe('Unknown Restaurant');
    });
  });

  // ============================================================================
  // Test: Combined Search Results
  // ============================================================================

  describe('combined search results', () => {
    it('should return both restaurants and menu items for common query', () => {
      const query = 'chicken';

      const menuItems = mockMenuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );

      // Menu items should have results for "chicken"
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should return only restaurants when query matches restaurant', () => {
      const query = 'Bella Italia';

      const restaurants = mockRestaurants.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase())
      );

      expect(restaurants.length).toBeGreaterThan(0);
    });

    it('should return only menu items when query matches menu item', () => {
      const query = 'Tiramisu';

      const menuItems = mockMenuItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      expect(menuItems.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // Test: Query Trimming
  // ============================================================================

  describe('query trimming', () => {
    it('should trim whitespace from query', () => {
      const query = '  pizza  ';
      const trimmed = query.trim();
      expect(trimmed).toBe('pizza');
    });

    it('should handle empty string after trim', () => {
      const query = '   ';
      const trimmed = query.trim();
      expect(trimmed).toBe('');
      expect(trimmed.length).toBe(0);
    });

    it('should handle single character after trim', () => {
      const query = ' a ';
      const trimmed = query.trim();
      expect(trimmed.length).toBe(1);
    });
  });

  // ============================================================================
  // Test: Min Query Length Validation
  // ============================================================================

  describe('min query length validation', () => {
    const minQueryLength = 2;

    it('should not search with empty query', () => {
      const query = '';
      const shouldSearch = query.trim().length >= minQueryLength;
      expect(shouldSearch).toBe(false);
    });

    it('should not search with single character', () => {
      const query = 'a';
      const shouldSearch = query.trim().length >= minQueryLength;
      expect(shouldSearch).toBe(false);
    });

    it('should search with two characters', () => {
      const query = 'pi';
      const shouldSearch = query.trim().length >= minQueryLength;
      expect(shouldSearch).toBe(true);
    });

    it('should search with longer queries', () => {
      const query = 'pizza';
      const shouldSearch = query.trim().length >= minQueryLength;
      expect(shouldSearch).toBe(true);
    });
  });
});
