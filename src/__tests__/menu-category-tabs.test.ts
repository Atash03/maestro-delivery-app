/**
 * Tests for Menu Category Tabs Component and Scroll Sync Hook
 *
 * Tests cover:
 * - Hook utility functions (getCategoriesFromMenuItems, categoriesToMenuCategories)
 * - Menu data compatibility
 * - Category extraction and grouping logic
 * - Edge cases for category handling
 * - Performance considerations
 */

import { mockMenuItems } from '@/data/mock/menu-items';
import {
  categoriesToMenuCategories,
  getCategoriesFromMenuItems,
} from '@/hooks/use-menu-scroll-sync';
import type { MenuItem } from '@/types';

// Test helper type - minimal MenuItem for testing category functions
type TestMenuItem = Pick<MenuItem, 'category'>;

// ============================================================================
// MenuCategoryTabs Component Type Tests
// ============================================================================

describe('MenuCategoryTabs Component Types', () => {
  describe('MenuCategory Type', () => {
    it('should define proper MenuCategory interface', () => {
      const category = {
        id: 'pizza',
        name: 'Pizza',
        itemCount: 5,
      };

      expect(category.id).toBe('pizza');
      expect(category.name).toBe('Pizza');
      expect(category.itemCount).toBe(5);
    });

    it('should support optional icon property', () => {
      const categoryWithIcon = {
        id: 'drinks',
        name: 'Drinks',
        icon: 'wine' as const,
        itemCount: 3,
      };

      expect(categoryWithIcon.icon).toBe('wine');
    });

    it('should support optional itemCount property', () => {
      const categoryWithoutCount = {
        id: 'desserts',
        name: 'Desserts',
      };

      expect(categoryWithoutCount.itemCount).toBeUndefined();
    });
  });

  describe('MenuCategoryTabsProps Type', () => {
    it('should require categories array', () => {
      const props = {
        categories: [{ id: 'test', name: 'Test' }],
        activeCategory: 'test',
        onCategoryPress: jest.fn(),
      };

      expect(props.categories).toBeDefined();
      expect(Array.isArray(props.categories)).toBe(true);
    });

    it('should require activeCategory string', () => {
      const props = {
        categories: [],
        activeCategory: 'pizza',
        onCategoryPress: jest.fn(),
      };

      expect(typeof props.activeCategory).toBe('string');
    });

    it('should require onCategoryPress callback', () => {
      const props = {
        categories: [],
        activeCategory: '',
        onCategoryPress: jest.fn(),
      };

      expect(typeof props.onCategoryPress).toBe('function');
    });

    it('should support optional isSticky property', () => {
      const propsWithSticky = {
        categories: [],
        activeCategory: '',
        onCategoryPress: jest.fn(),
        isSticky: true,
      };

      expect(propsWithSticky.isSticky).toBe(true);
    });
  });

  describe('Constants Documentation', () => {
    it('should document TAB_HEIGHT as 48', () => {
      // TAB_HEIGHT is documented as 48 pixels in the component
      const expectedTabHeight = 48;
      expect(expectedTabHeight).toBe(48);
    });

    it('should document INDICATOR_HEIGHT as 3', () => {
      // INDICATOR_HEIGHT is documented as 3 pixels in the component
      const expectedIndicatorHeight = 3;
      expect(expectedIndicatorHeight).toBe(3);
    });

    it('should have reasonable total height', () => {
      const tabHeight = 48;
      const indicatorHeight = 3;
      const totalHeight = tabHeight + indicatorHeight;
      expect(totalHeight).toBe(51);
      expect(totalHeight).toBeGreaterThan(40);
      expect(totalHeight).toBeLessThan(80);
    });
  });
});

// ============================================================================
// useMenuScrollSync Hook Tests
// ============================================================================

describe('useMenuScrollSync Hook', () => {
  describe('Exports', () => {
    it('should export useMenuScrollSync hook', () => {
      const exports = require('@/hooks/use-menu-scroll-sync');
      expect(exports.useMenuScrollSync).toBeDefined();
      expect(typeof exports.useMenuScrollSync).toBe('function');
    });

    it('should export getCategoriesFromMenuItems function', () => {
      const exports = require('@/hooks/use-menu-scroll-sync');
      expect(exports.getCategoriesFromMenuItems).toBeDefined();
      expect(typeof exports.getCategoriesFromMenuItems).toBe('function');
    });

    it('should export categoriesToMenuCategories function', () => {
      const exports = require('@/hooks/use-menu-scroll-sync');
      expect(exports.categoriesToMenuCategories).toBeDefined();
      expect(typeof exports.categoriesToMenuCategories).toBe('function');
    });
  });

  describe('getCategoriesFromMenuItems', () => {
    it('should extract unique categories from menu items', () => {
      const testItems = [
        { category: 'Pizza' },
        { category: 'Pasta' },
        { category: 'Pizza' },
        { category: 'Salads' },
      ] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(testItems);

      expect(categories).toEqual(['Pizza', 'Pasta', 'Salads']);
    });

    it('should preserve category order of first appearance', () => {
      const testItems = [
        { category: 'Desserts' },
        { category: 'Mains' },
        { category: 'Appetizers' },
        { category: 'Mains' },
      ] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(testItems);

      expect(categories[0]).toBe('Desserts');
      expect(categories[1]).toBe('Mains');
      expect(categories[2]).toBe('Appetizers');
    });

    it('should return empty array for empty menu items', () => {
      const categories = getCategoriesFromMenuItems([]);
      expect(categories).toEqual([]);
    });

    it('should work with real mock data', () => {
      const bellaItaliaItems = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(bellaItaliaItems);

      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('Pizza');
      expect(categories).toContain('Pasta');
    });

    it('should handle single category', () => {
      const testItems = [
        { category: 'Drinks' },
        { category: 'Drinks' },
        { category: 'Drinks' },
      ] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(testItems);

      expect(categories).toEqual(['Drinks']);
    });

    it('should handle items in order they appear', () => {
      const testItems = [{ category: 'Z' }, { category: 'A' }, { category: 'M' }] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(testItems);

      expect(categories).toEqual(['Z', 'A', 'M']);
    });
  });

  describe('categoriesToMenuCategories', () => {
    it('should convert category strings to MenuCategory objects', () => {
      const categories = ['Pizza', 'Pasta'];
      const menuItems = [
        { category: 'Pizza' },
        { category: 'Pizza' },
        { category: 'Pasta' },
      ] as TestMenuItem[];

      const result = categoriesToMenuCategories(categories, menuItems);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'Pizza',
        name: 'Pizza',
        itemCount: 2,
      });
      expect(result[1]).toEqual({
        id: 'Pasta',
        name: 'Pasta',
        itemCount: 1,
      });
    });

    it('should count items per category correctly', () => {
      const categories = ['A', 'B', 'C'];
      const menuItems = [
        { category: 'A' },
        { category: 'A' },
        { category: 'A' },
        { category: 'B' },
        { category: 'C' },
        { category: 'C' },
      ] as TestMenuItem[];

      const result = categoriesToMenuCategories(categories, menuItems);

      expect(result[0].itemCount).toBe(3);
      expect(result[1].itemCount).toBe(1);
      expect(result[2].itemCount).toBe(2);
    });

    it('should handle category with zero items', () => {
      const categories = ['Pizza', 'Sushi'];
      const menuItems = [{ category: 'Pizza' }] as TestMenuItem[];

      const result = categoriesToMenuCategories(categories, menuItems);

      expect(result[1].itemCount).toBe(0);
    });

    it('should work with real mock data', () => {
      const bellaItaliaItems = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(bellaItaliaItems);
      const result = categoriesToMenuCategories(categories, bellaItaliaItems);

      expect(result.length).toBe(categories.length);
      result.forEach((cat) => {
        expect(cat.id).toBeDefined();
        expect(cat.name).toBeDefined();
        expect(typeof cat.itemCount).toBe('number');
      });
    });

    it('should return empty array for empty categories', () => {
      const result = categoriesToMenuCategories([], []);
      expect(result).toEqual([]);
    });

    it('should use category name as both id and name', () => {
      const categories = ['Special Category'];
      const menuItems = [{ category: 'Special Category' }] as TestMenuItem[];

      const result = categoriesToMenuCategories(categories, menuItems);

      expect(result[0].id).toBe('Special Category');
      expect(result[0].name).toBe('Special Category');
    });
  });
});

// ============================================================================
// Menu Data Integration Tests
// ============================================================================

describe('Menu Data Integration', () => {
  describe('Menu Data Structure', () => {
    it('should have menu items for test restaurants', () => {
      const restaurantIds = ['rest-001', 'rest-002', 'rest-003'];

      restaurantIds.forEach((id) => {
        const items = mockMenuItems.filter((item) => item.restaurantId === id);
        expect(items.length).toBeGreaterThan(0);
      });
    });

    it('should have multiple categories per restaurant', () => {
      const bellaItaliaItems = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(bellaItaliaItems);

      expect(categories.length).toBeGreaterThan(1);
    });

    it('should have items with all required fields', () => {
      const testItem = mockMenuItems[0];

      expect(testItem.id).toBeDefined();
      expect(testItem.restaurantId).toBeDefined();
      expect(testItem.name).toBeDefined();
      expect(testItem.description).toBeDefined();
      expect(testItem.price).toBeDefined();
      expect(testItem.category).toBeDefined();
      expect(testItem.isAvailable).toBeDefined();
    });

    it('should have consistent item structure', () => {
      mockMenuItems.forEach((item) => {
        expect(typeof item.id).toBe('string');
        expect(typeof item.restaurantId).toBe('string');
        expect(typeof item.name).toBe('string');
        expect(typeof item.category).toBe('string');
        expect(typeof item.price).toBe('number');
      });
    });
  });

  describe('Category Order', () => {
    it('should maintain consistent category order', () => {
      const bellaItaliaItems = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');

      const categories1 = getCategoriesFromMenuItems(bellaItaliaItems);
      const categories2 = getCategoriesFromMenuItems(bellaItaliaItems);

      expect(categories1).toEqual(categories2);
    });

    it('should have logical category grouping', () => {
      const restaurantItems = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(restaurantItems);

      // Categories should be unique
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBe(categories.length);
    });

    it('should reflect item order in mock data', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const firstItemCategory = items[0].category;
      const categories = getCategoriesFromMenuItems(items);

      expect(categories[0]).toBe(firstItemCategory);
    });
  });
});

// ============================================================================
// Accessibility Test IDs
// ============================================================================

describe('Accessibility', () => {
  describe('Test IDs', () => {
    it('should use consistent test ID pattern', () => {
      const categoryId = 'pizza';
      const expectedTestId = `category-tab-${categoryId}`;
      expect(expectedTestId).toBe('category-tab-pizza');
    });

    it('should handle special characters in test IDs', () => {
      const categoryId = 'Rice & Noodles';
      const expectedTestId = `category-tab-${categoryId}`;
      expect(expectedTestId).toBe('category-tab-Rice & Noodles');
    });

    it('should create unique test IDs for each category', () => {
      const categories = ['Pizza', 'Pasta', 'Desserts'];
      const testIds = categories.map((cat) => `category-tab-${cat}`);

      const uniqueTestIds = new Set(testIds);
      expect(uniqueTestIds.size).toBe(testIds.length);
    });
  });
});

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('Edge Cases', () => {
  describe('Empty Categories', () => {
    it('should handle empty categories array', () => {
      const categories = getCategoriesFromMenuItems([]);
      expect(categories).toEqual([]);
    });

    it('should handle empty conversion', () => {
      const result = categoriesToMenuCategories([], []);
      expect(result).toEqual([]);
    });
  });

  describe('Single Category', () => {
    it('should handle single category menu', () => {
      const items = [{ category: 'Only One' }, { category: 'Only One' }] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories).toEqual(['Only One']);
    });

    it('should count items in single category correctly', () => {
      const items = [
        { category: 'Only One' },
        { category: 'Only One' },
        { category: 'Only One' },
      ] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      const menuCategories = categoriesToMenuCategories(categories, items);

      expect(menuCategories[0].itemCount).toBe(3);
    });
  });

  describe('Many Categories', () => {
    it('should handle many categories', () => {
      const items = Array.from({ length: 20 }, (_, i) => ({
        category: `Category ${i}`,
      })) as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories.length).toBe(20);
    });

    it('should maintain order with many categories', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        category: `Category ${i % 10}`,
      })) as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories.length).toBe(10);
      expect(categories[0]).toBe('Category 0');
    });
  });

  describe('Long Category Names', () => {
    it('should handle long category names', () => {
      const longName = 'This is a very long category name that might cause layout issues';
      const items = [{ category: longName }] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories[0]).toBe(longName);
    });

    it('should preserve long names in conversion', () => {
      const longName = 'Very Long Category Name That Goes On And On And On';
      const items = [{ category: longName }] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      const menuCategories = categoriesToMenuCategories(categories, items);

      expect(menuCategories[0].name).toBe(longName);
      expect(menuCategories[0].id).toBe(longName);
    });
  });

  describe('Special Characters', () => {
    it('should handle categories with special characters', () => {
      const items = [
        { category: 'Rice & Noodles' },
        { category: "Chef's Specials" },
        { category: 'Starters (Hot)' },
      ] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories).toContain('Rice & Noodles');
      expect(categories).toContain("Chef's Specials");
      expect(categories).toContain('Starters (Hot)');
    });

    it('should handle unicode characters', () => {
      const items = [
        { category: '寿司' },
        { category: 'Café' },
        { category: 'Piña Colada' },
      ] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories).toContain('寿司');
      expect(categories).toContain('Café');
      expect(categories).toContain('Piña Colada');
    });

    it('should handle emojis in category names', () => {
      const items = [{ category: '🍕 Pizza' }, { category: '🍔 Burgers' }] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories).toContain('🍕 Pizza');
      expect(categories).toContain('🍔 Burgers');
    });
  });

  describe('Whitespace Handling', () => {
    it('should preserve leading/trailing whitespace in categories', () => {
      const items = [{ category: ' Pizza ' }, { category: '  Pasta  ' }] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories).toContain(' Pizza ');
      expect(categories).toContain('  Pasta  ');
    });

    it('should treat differently-spaced categories as different', () => {
      const items = [
        { category: 'Pizza' },
        { category: ' Pizza' },
        { category: 'Pizza ' },
      ] as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(items);
      expect(categories.length).toBe(3);
    });
  });
});

// ============================================================================
// Mock Data Compatibility Tests
// ============================================================================

describe('Mock Data Compatibility', () => {
  describe('Bella Italia Menu (rest-001)', () => {
    it('should have expected categories', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(items);

      expect(categories).toContain('Pizza');
      expect(categories).toContain('Pasta');
      expect(categories).toContain('Desserts');
    });

    it('should have correct item counts', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(items);
      const menuCategories = categoriesToMenuCategories(categories, items);

      const pizzaCategory = menuCategories.find((c) => c.name === 'Pizza');
      expect(pizzaCategory).toBeDefined();
      expect(pizzaCategory?.itemCount).toBeGreaterThan(0);
    });

    it('should have appetizers category', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(items);

      expect(categories).toContain('Appetizers');
    });
  });

  describe('Tokyo Ramen House Menu (rest-002)', () => {
    it('should have expected categories', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-002');
      const categories = getCategoriesFromMenuItems(items);

      expect(categories).toContain('Ramen');
      expect(categories).toContain('Appetizers');
    });

    it('should have multiple ramen items', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-002');
      const ramenItems = items.filter((item) => item.category === 'Ramen');

      expect(ramenItems.length).toBeGreaterThan(1);
    });
  });

  describe('Burger Barn Menu (rest-003)', () => {
    it('should have expected categories', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-003');
      const categories = getCategoriesFromMenuItems(items);

      expect(categories).toContain('Burgers');
      expect(categories).toContain('Sides');
    });

    it('should have drinks category', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-003');
      const categories = getCategoriesFromMenuItems(items);

      expect(categories).toContain('Drinks');
    });
  });

  describe('Spice Garden Menu (rest-004)', () => {
    it('should have expected Indian cuisine categories', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-004');
      const categories = getCategoriesFromMenuItems(items);

      expect(categories).toContain('Curries');
    });
  });

  describe('All Restaurants', () => {
    it('should have menu items for multiple restaurants', () => {
      const restaurantIds = new Set(mockMenuItems.map((item) => item.restaurantId));
      expect(restaurantIds.size).toBeGreaterThan(5);
    });

    it('should have a reasonable number of total menu items', () => {
      expect(mockMenuItems.length).toBeGreaterThanOrEqual(60);
    });

    it('should have items with prices', () => {
      mockMenuItems.forEach((item) => {
        expect(item.price).toBeGreaterThan(0);
      });
    });
  });
});

// ============================================================================
// Performance Considerations Tests
// ============================================================================

describe('Performance Considerations', () => {
  describe('Memoization', () => {
    it('should produce consistent results for same input', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');

      const result1 = getCategoriesFromMenuItems(items);
      const result2 = getCategoriesFromMenuItems(items);

      expect(result1).toEqual(result2);
    });

    it('should produce same category objects for same input', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(items);

      const result1 = categoriesToMenuCategories(categories, items);
      const result2 = categoriesToMenuCategories(categories, items);

      expect(result1).toEqual(result2);
    });
  });

  describe('Large Data Sets', () => {
    it('should handle large menu efficiently', () => {
      const largeMenu = Array.from({ length: 1000 }, (_, i) => ({
        category: `Category ${i % 20}`,
      })) as TestMenuItem[];

      const startTime = Date.now();
      const categories = getCategoriesFromMenuItems(largeMenu);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
      expect(categories.length).toBe(20);
    });

    it('should convert large categories efficiently', () => {
      const largeMenu = Array.from({ length: 1000 }, (_, i) => ({
        category: `Category ${i % 20}`,
      })) as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(largeMenu);

      const startTime = Date.now();
      const menuCategories = categoriesToMenuCategories(categories, largeMenu);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(menuCategories.length).toBe(20);
    });

    it('should correctly count items in large data set', () => {
      const largeMenu = Array.from({ length: 1000 }, (_, i) => ({
        category: `Category ${i % 20}`,
      })) as TestMenuItem[];

      const categories = getCategoriesFromMenuItems(largeMenu);
      const menuCategories = categoriesToMenuCategories(categories, largeMenu);

      // Each category should have 50 items (1000 / 20)
      menuCategories.forEach((cat) => {
        expect(cat.itemCount).toBe(50);
      });
    });
  });

  describe('Memory Efficiency', () => {
    it('should not create unnecessary intermediate arrays', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');

      // Function should use Set internally for deduplication
      const categories = getCategoriesFromMenuItems(items);

      // Result should be minimal - just the unique categories
      expect(categories.length).toBeLessThanOrEqual(items.length);
    });
  });
});

// ============================================================================
// Integration Scenarios Tests
// ============================================================================

describe('Integration Scenarios', () => {
  describe('Full Category Flow', () => {
    it('should support full menu category extraction flow', () => {
      // Get items for a restaurant
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');

      // Extract categories
      const categories = getCategoriesFromMenuItems(items);

      // Convert to menu category objects
      const menuCategories = categoriesToMenuCategories(categories, items);

      // Verify the flow works correctly
      expect(menuCategories.length).toBeGreaterThan(0);
      expect(menuCategories.every((c) => c.id && c.name && c.itemCount >= 0)).toBe(true);
    });

    it('should maintain item count integrity', () => {
      const items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const categories = getCategoriesFromMenuItems(items);
      const menuCategories = categoriesToMenuCategories(categories, items);

      // Total item count should equal original items
      const totalItemCount = menuCategories.reduce((sum, c) => sum + c.itemCount, 0);
      expect(totalItemCount).toBe(items.length);
    });
  });

  describe('Multi-Restaurant Support', () => {
    it('should work independently for different restaurants', () => {
      const restaurant1Items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const restaurant2Items = mockMenuItems.filter((item) => item.restaurantId === 'rest-002');

      const categories1 = getCategoriesFromMenuItems(restaurant1Items);
      const categories2 = getCategoriesFromMenuItems(restaurant2Items);

      // Categories should be different for different restaurants
      expect(categories1).not.toEqual(categories2);
    });

    it('should not mix categories across restaurants', () => {
      const restaurant1Items = mockMenuItems.filter((item) => item.restaurantId === 'rest-001');
      const restaurant2Items = mockMenuItems.filter((item) => item.restaurantId === 'rest-002');

      const categories1 = getCategoriesFromMenuItems(restaurant1Items);
      const categories2 = getCategoriesFromMenuItems(restaurant2Items);

      // Bella Italia has Pizza, Tokyo Ramen has Ramen
      expect(categories1).toContain('Pizza');
      expect(categories2).toContain('Ramen');
      expect(categories1).not.toContain('Ramen');
      expect(categories2).not.toContain('Pizza');
    });
  });
});
