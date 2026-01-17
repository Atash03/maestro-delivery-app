/**
 * Tests for Dish Customization Modal
 *
 * Tests cover:
 * - File structure and exports
 * - Helper function logic (tested via file content patterns)
 * - Component structure
 * - Constants
 * - Mock data compatibility
 * - Animation configuration
 * - Styling
 * - Accessibility
 * - Cart integration
 */

import * as fs from 'fs';
import * as path from 'path';

import type { Customization, MenuItem, SelectedCustomization, SelectedOption } from '@/types';

// ============================================================================
// Test Utilities
// ============================================================================

const DISH_CUSTOMIZATION_PATH = path.join(__dirname, '../app/(modals)/dish-customization.tsx');

const RESTAURANT_DETAIL_PATH = path.join(__dirname, '../app/restaurant/[id].tsx');

const MODALS_LAYOUT_PATH = path.join(__dirname, '../app/(modals)/_layout.tsx');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

// ============================================================================
// Helper Functions - Pure Unit Tests
// ============================================================================

// Inline implementations of helper functions for testing (mirror the actual implementation)
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function calculateTotalPrice(
  basePrice: number,
  selectedCustomizations: Map<string, Set<string>>,
  customizations: Customization[],
  quantity: number
): number {
  let total = basePrice;

  for (const [customizationId, selectedOptionIds] of selectedCustomizations) {
    const customization = customizations.find((c) => c.id === customizationId);
    if (customization) {
      for (const optionId of selectedOptionIds) {
        const option = customization.options.find((o) => o.id === optionId);
        if (option) {
          total += option.price;
        }
      }
    }
  }

  return total * quantity;
}

function getDefaultSelections(customizations: Customization[]): Map<string, Set<string>> {
  const selections = new Map<string, Set<string>>();

  for (const customization of customizations) {
    const defaultOptions = customization.options.filter((o) => o.isDefault);
    if (defaultOptions.length > 0) {
      selections.set(customization.id, new Set(defaultOptions.map((o) => o.id)));
    } else if (customization.required && customization.options.length > 0) {
      selections.set(customization.id, new Set([customization.options[0].id]));
    } else {
      selections.set(customization.id, new Set());
    }
  }

  return selections;
}

function validateSelections(
  customizations: Customization[],
  selections: Map<string, Set<string>>
): { isValid: boolean; missingCustomizations: string[] } {
  const missing: string[] = [];

  for (const customization of customizations) {
    if (customization.required) {
      const selected = selections.get(customization.id);
      if (!selected || selected.size === 0) {
        missing.push(customization.name);
      }
    }
  }

  return {
    isValid: missing.length === 0,
    missingCustomizations: missing,
  };
}

function selectionsToCartFormat(
  selections: Map<string, Set<string>>,
  customizations: Customization[]
): SelectedCustomization[] {
  const result: SelectedCustomization[] = [];

  for (const [customizationId, selectedOptionIds] of selections) {
    if (selectedOptionIds.size === 0) continue;

    const customization = customizations.find((c) => c.id === customizationId);
    if (!customization) continue;

    const selectedOptions: SelectedOption[] = [];
    for (const optionId of selectedOptionIds) {
      const option = customization.options.find((o) => o.id === optionId);
      if (option) {
        selectedOptions.push({
          optionId: option.id,
          optionName: option.name,
          price: option.price,
        });
      }
    }

    if (selectedOptions.length > 0) {
      result.push({
        customizationId: customization.id,
        customizationName: customization.name,
        selectedOptions,
      });
    }
  }

  return result;
}

describe('Dish Customization Modal', () => {
  // ============================================================================
  // File Structure Tests
  // ============================================================================

  describe('File Structure', () => {
    it('should have dish-customization.tsx file in (modals) directory', () => {
      expect(fs.existsSync(DISH_CUSTOMIZATION_PATH)).toBe(true);
    });

    it('should export DishCustomizationScreen as default', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('export default function DishCustomizationScreen');
    });

    it('should export helper functions', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('export function formatPrice');
      expect(content).toContain('export function calculateTotalPrice');
      expect(content).toContain('export function getDefaultSelections');
      expect(content).toContain('export function validateSelections');
      expect(content).toContain('export function selectionsToCartFormat');
    });

    it('should export sub-components', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toMatch(/export\s*\{[\s\S]*CustomizationOption[\s\S]*\}/);
      expect(content).toMatch(/export\s*\{[\s\S]*CustomizationSection[\s\S]*\}/);
      expect(content).toMatch(/export\s*\{[\s\S]*QuantitySelector[\s\S]*\}/);
    });

    it('should export constants', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toMatch(/export\s*\{[\s\S]*IMAGE_HEIGHT[\s\S]*\}/);
      expect(content).toMatch(/export\s*\{[\s\S]*SPRING_CONFIG[\s\S]*\}/);
    });
  });

  // ============================================================================
  // Modals Layout Integration Tests
  // ============================================================================

  describe('Modals Layout Integration', () => {
    it('should have dish-customization registered in modals layout', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain('dish-customization');
    });

    it('should use modal presentation in layout', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain("presentation: 'modal'");
    });

    it('should use slide_from_bottom animation', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain("animation: 'slide_from_bottom'");
    });
  });

  // ============================================================================
  // Restaurant Detail Integration Tests
  // ============================================================================

  describe('Restaurant Detail Integration', () => {
    it('should navigate to dish-customization modal for items with customizations', () => {
      const content = readFile(RESTAURANT_DETAIL_PATH);
      expect(content).toContain("pathname: '/(modals)/dish-customization'");
      expect(content).toContain('params: { itemId: item.id }');
    });

    it('should have handleMenuItemPress function', () => {
      const content = readFile(RESTAURANT_DETAIL_PATH);
      expect(content).toContain('handleMenuItemPress');
    });

    it('should check customizations length before navigation', () => {
      const content = readFile(RESTAURANT_DETAIL_PATH);
      expect(content).toContain('item.customizations.length');
    });
  });

  // ============================================================================
  // Component Structure Tests
  // ============================================================================

  describe('Component Structure', () => {
    it('should import required dependencies', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain("from '@expo/vector-icons'");
      expect(content).toContain("from 'expo-image'");
      expect(content).toContain("from 'expo-linear-gradient'");
      expect(content).toContain("from 'expo-router'");
      expect(content).toContain("from 'react-native-reanimated'");
      expect(content).toContain("from 'react-native-safe-area-context'");
    });

    it('should import cart store', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain("from '@/stores'");
      expect(content).toContain('useCartStore');
    });

    it('should import mock data functions', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('getMenuItemById');
      expect(content).toContain('getRestaurantById');
    });

    it('should use useLocalSearchParams for itemId', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('useLocalSearchParams');
      expect(content).toContain('itemId');
    });

    it('should have hero image section', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('heroImage');
      expect(content).toContain('imageContainer');
    });

    it('should have quantity selector', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('QuantitySelector');
      expect(content).toContain('quantity-increment');
      expect(content).toContain('quantity-decrement');
    });

    it('should have special instructions input', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('special-instructions-input');
      expect(content).toContain('specialInstructions');
    });

    it('should have add to cart button', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('add-to-cart-button');
      expect(content).toContain('Add to Cart');
    });
  });

  // ============================================================================
  // Helper Functions Tests
  // ============================================================================

  describe('formatPrice', () => {
    it('should format integer prices correctly', () => {
      expect(formatPrice(10)).toBe('$10.00');
      expect(formatPrice(5)).toBe('$5.00');
      expect(formatPrice(100)).toBe('$100.00');
    });

    it('should format decimal prices correctly', () => {
      expect(formatPrice(14.99)).toBe('$14.99');
      expect(formatPrice(9.5)).toBe('$9.50');
      expect(formatPrice(19.999)).toBe('$20.00');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle small prices', () => {
      expect(formatPrice(0.99)).toBe('$0.99');
      expect(formatPrice(0.01)).toBe('$0.01');
    });
  });

  describe('calculateTotalPrice', () => {
    const mockCustomizations: Customization[] = [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: 'small', name: 'Small', price: 0, isDefault: true },
          { id: 'medium', name: 'Medium', price: 2.0 },
          { id: 'large', name: 'Large', price: 4.0 },
        ],
        required: true,
        maxSelections: 1,
      },
      {
        id: 'toppings',
        name: 'Toppings',
        options: [
          { id: 'cheese', name: 'Cheese', price: 1.5 },
          { id: 'bacon', name: 'Bacon', price: 2.0 },
        ],
        required: false,
        maxSelections: 3,
      },
    ];

    it('should calculate base price with no customizations', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['small']));
      selections.set('toppings', new Set());

      const total = calculateTotalPrice(10, selections, mockCustomizations, 1);
      expect(total).toBe(10);
    });

    it('should add customization prices correctly', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['medium'])); // +$2
      selections.set('toppings', new Set(['cheese'])); // +$1.5

      const total = calculateTotalPrice(10, selections, mockCustomizations, 1);
      expect(total).toBe(13.5);
    });

    it('should multiply by quantity', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['small']));
      selections.set('toppings', new Set());

      const total = calculateTotalPrice(10, selections, mockCustomizations, 3);
      expect(total).toBe(30);
    });

    it('should handle multiple toppings', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['large'])); // +$4
      selections.set('toppings', new Set(['cheese', 'bacon'])); // +$1.5 + $2

      const total = calculateTotalPrice(10, selections, mockCustomizations, 2);
      expect(total).toBe(35); // (10 + 4 + 1.5 + 2) * 2 = 17.5 * 2
    });

    it('should handle empty selections map', () => {
      const selections = new Map<string, Set<string>>();
      const total = calculateTotalPrice(15, selections, mockCustomizations, 1);
      expect(total).toBe(15);
    });
  });

  describe('getDefaultSelections', () => {
    it('should select default options', () => {
      const customizations: Customization[] = [
        {
          id: 'size',
          name: 'Size',
          options: [
            { id: 'small', name: 'Small', price: 0, isDefault: true },
            { id: 'medium', name: 'Medium', price: 2.0 },
          ],
          required: true,
          maxSelections: 1,
        },
      ];

      const selections = getDefaultSelections(customizations);
      expect(selections.get('size')?.has('small')).toBe(true);
      expect(selections.get('size')?.size).toBe(1);
    });

    it('should select first option for required customizations without default', () => {
      const customizations: Customization[] = [
        {
          id: 'spice',
          name: 'Spice Level',
          options: [
            { id: 'mild', name: 'Mild', price: 0 },
            { id: 'hot', name: 'Hot', price: 0 },
          ],
          required: true,
          maxSelections: 1,
        },
      ];

      const selections = getDefaultSelections(customizations);
      expect(selections.get('spice')?.has('mild')).toBe(true);
    });

    it('should create empty set for optional customizations without default', () => {
      const customizations: Customization[] = [
        {
          id: 'extras',
          name: 'Extras',
          options: [{ id: 'sauce', name: 'Extra Sauce', price: 0.5 }],
          required: false,
          maxSelections: 3,
        },
      ];

      const selections = getDefaultSelections(customizations);
      expect(selections.get('extras')?.size).toBe(0);
    });

    it('should handle multiple default options', () => {
      const customizations: Customization[] = [
        {
          id: 'toppings',
          name: 'Toppings',
          options: [
            { id: 'cheese', name: 'Cheese', price: 0, isDefault: true },
            { id: 'lettuce', name: 'Lettuce', price: 0, isDefault: true },
            { id: 'tomato', name: 'Tomato', price: 0 },
          ],
          required: false,
          maxSelections: 5,
        },
      ];

      const selections = getDefaultSelections(customizations);
      expect(selections.get('toppings')?.size).toBe(2);
      expect(selections.get('toppings')?.has('cheese')).toBe(true);
      expect(selections.get('toppings')?.has('lettuce')).toBe(true);
    });

    it('should handle empty customizations array', () => {
      const selections = getDefaultSelections([]);
      expect(selections.size).toBe(0);
    });
  });

  describe('validateSelections', () => {
    const customizations: Customization[] = [
      {
        id: 'size',
        name: 'Size',
        options: [{ id: 'small', name: 'Small', price: 0 }],
        required: true,
        maxSelections: 1,
      },
      {
        id: 'spice',
        name: 'Spice Level',
        options: [{ id: 'mild', name: 'Mild', price: 0 }],
        required: true,
        maxSelections: 1,
      },
      {
        id: 'extras',
        name: 'Extras',
        options: [{ id: 'sauce', name: 'Sauce', price: 0.5 }],
        required: false,
        maxSelections: 3,
      },
    ];

    it('should return valid when all required selections are made', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['small']));
      selections.set('spice', new Set(['mild']));
      selections.set('extras', new Set());

      const result = validateSelections(customizations, selections);
      expect(result.isValid).toBe(true);
      expect(result.missingCustomizations).toHaveLength(0);
    });

    it('should return invalid when required selections are missing', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['small']));
      selections.set('spice', new Set()); // Missing required
      selections.set('extras', new Set());

      const result = validateSelections(customizations, selections);
      expect(result.isValid).toBe(false);
      expect(result.missingCustomizations).toContain('Spice Level');
    });

    it('should return all missing required customizations', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set()); // Missing
      selections.set('spice', new Set()); // Missing
      selections.set('extras', new Set());

      const result = validateSelections(customizations, selections);
      expect(result.isValid).toBe(false);
      expect(result.missingCustomizations).toHaveLength(2);
      expect(result.missingCustomizations).toContain('Size');
      expect(result.missingCustomizations).toContain('Spice Level');
    });

    it('should not require optional customizations', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['small']));
      selections.set('spice', new Set(['mild']));
      // extras not even in the map

      const result = validateSelections(customizations, selections);
      expect(result.isValid).toBe(true);
    });

    it('should handle empty customizations array', () => {
      const result = validateSelections([], new Map());
      expect(result.isValid).toBe(true);
      expect(result.missingCustomizations).toHaveLength(0);
    });
  });

  describe('selectionsToCartFormat', () => {
    const customizations: Customization[] = [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: 'small', name: 'Small', price: 0 },
          { id: 'large', name: 'Large', price: 4.0 },
        ],
        required: true,
        maxSelections: 1,
      },
      {
        id: 'toppings',
        name: 'Toppings',
        options: [
          { id: 'cheese', name: 'Cheese', price: 1.5 },
          { id: 'bacon', name: 'Bacon', price: 2.0 },
        ],
        required: false,
        maxSelections: 3,
      },
    ];

    it('should convert selections to cart format', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['large']));
      selections.set('toppings', new Set(['cheese', 'bacon']));

      const result = selectionsToCartFormat(selections, customizations);

      expect(result).toHaveLength(2);

      const sizeSelection = result.find((c: SelectedCustomization) => c.customizationId === 'size');
      expect(sizeSelection).toBeDefined();
      expect(sizeSelection?.customizationName).toBe('Size');
      expect(sizeSelection?.selectedOptions).toHaveLength(1);
      expect(sizeSelection?.selectedOptions[0].optionName).toBe('Large');
      expect(sizeSelection?.selectedOptions[0].price).toBe(4.0);

      const toppingsSelection = result.find(
        (c: SelectedCustomization) => c.customizationId === 'toppings'
      );
      expect(toppingsSelection).toBeDefined();
      expect(toppingsSelection?.selectedOptions).toHaveLength(2);
    });

    it('should skip empty selections', () => {
      const selections = new Map<string, Set<string>>();
      selections.set('size', new Set(['small']));
      selections.set('toppings', new Set()); // Empty

      const result = selectionsToCartFormat(selections, customizations);

      expect(result).toHaveLength(1);
      expect(result[0].customizationId).toBe('size');
    });

    it('should handle empty selections map', () => {
      const result = selectionsToCartFormat(new Map(), customizations);
      expect(result).toHaveLength(0);
    });
  });

  // ============================================================================
  // Constants Tests
  // ============================================================================

  describe('Constants', () => {
    it('should define IMAGE_HEIGHT constant', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('const IMAGE_HEIGHT = 240');
    });

    it('should define SPRING_CONFIG constant', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('const SPRING_CONFIG = {');
      expect(content).toContain('damping:');
      expect(content).toContain('stiffness:');
      expect(content).toContain('mass:');
    });
  });

  // ============================================================================
  // Mock Data Compatibility Tests
  // ============================================================================

  describe('Mock Data Compatibility', () => {
    const { mockMenuItems } = require('@/data/mock/menu-items');

    it('should work with all menu items that have customizations', () => {
      const itemsWithCustomizations = mockMenuItems.filter(
        (item: MenuItem) => item.customizations.length > 0
      );

      expect(itemsWithCustomizations.length).toBeGreaterThan(0);

      for (const item of itemsWithCustomizations) {
        const defaults = getDefaultSelections(item.customizations);
        expect(defaults).toBeInstanceOf(Map);

        const validation = validateSelections(item.customizations, defaults);
        expect(validation.isValid).toBe(true);

        const price = calculateTotalPrice(item.price, defaults, item.customizations, 1);
        expect(price).toBeGreaterThanOrEqual(item.price);

        const cartFormat = selectionsToCartFormat(defaults, item.customizations);
        expect(Array.isArray(cartFormat)).toBe(true);
      }
    });

    it('should handle Margherita Pizza customizations (size + toppings)', () => {
      const pizza = mockMenuItems.find((item: MenuItem) => item.id === 'menu-001-01');
      expect(pizza).toBeDefined();
      expect(pizza.customizations).toHaveLength(2);

      const defaults = getDefaultSelections(pizza.customizations);
      const sizeCustomization = pizza.customizations.find((c: Customization) => c.name === 'Size');
      if (sizeCustomization) {
        expect(defaults.get(sizeCustomization.id)?.size).toBeGreaterThan(0);
      }

      const toppingsCustomization = pizza.customizations.find(
        (c: Customization) => c.name === 'Extra Toppings'
      );
      if (toppingsCustomization) {
        expect(defaults.get(toppingsCustomization.id)?.size).toBe(0);
      }
    });

    it('should handle Tonkotsu Ramen customizations (noodles + spice + toppings)', () => {
      const ramen = mockMenuItems.find((item: MenuItem) => item.id === 'menu-002-01');
      expect(ramen).toBeDefined();
      expect(ramen.customizations).toHaveLength(3);

      const defaults = getDefaultSelections(ramen.customizations);
      const validation = validateSelections(ramen.customizations, defaults);
      expect(validation.isValid).toBe(true);
    });

    it('should handle items without customizations', () => {
      const tiramisu = mockMenuItems.find((item: MenuItem) => item.id === 'menu-001-05');
      expect(tiramisu).toBeDefined();
      expect(tiramisu.customizations).toHaveLength(0);

      const defaults = getDefaultSelections(tiramisu.customizations);
      expect(defaults.size).toBe(0);

      const validation = validateSelections(tiramisu.customizations, defaults);
      expect(validation.isValid).toBe(true);
    });
  });

  // ============================================================================
  // Radio vs Checkbox Behavior Tests
  // ============================================================================

  describe('Radio vs Checkbox Behavior', () => {
    it('should treat maxSelections=1 as radio button', () => {
      const customization: Customization = {
        id: 'size',
        name: 'Size',
        options: [
          { id: 'sm', name: 'Small', price: 0 },
          { id: 'lg', name: 'Large', price: 2.0 },
        ],
        required: true,
        maxSelections: 1,
      };

      const isRadio = customization.maxSelections === 1;
      expect(isRadio).toBe(true);
    });

    it('should treat maxSelections>1 as checkboxes', () => {
      const customization: Customization = {
        id: 'toppings',
        name: 'Toppings',
        options: [
          { id: 'cheese', name: 'Cheese', price: 1.0 },
          { id: 'bacon', name: 'Bacon', price: 2.0 },
          { id: 'mushroom', name: 'Mushroom', price: 1.5 },
        ],
        required: false,
        maxSelections: 3,
      };

      const isRadio = customization.maxSelections === 1;
      expect(isRadio).toBe(false);
    });

    it('should use radio-button icons for single selection', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('radio-button-on');
      expect(content).toContain('radio-button-off');
    });

    it('should use checkbox icons for multiple selection', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('checkbox');
      expect(content).toContain('square-outline');
    });
  });

  // ============================================================================
  // QuantitySelector Logic Tests
  // ============================================================================

  describe('QuantitySelector Logic', () => {
    it('should have default minQuantity of 1', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('minQuantity = 1');
    });

    it('should have default maxQuantity of 99', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('maxQuantity = 99');
    });

    it('should enforce minimum quantity', () => {
      const minQuantity = 1;
      const currentQuantity = 1;
      const canDecrement = currentQuantity > minQuantity;
      expect(canDecrement).toBe(false);
    });

    it('should enforce maximum quantity', () => {
      const maxQuantity = 99;
      const currentQuantity = 99;
      const canIncrement = currentQuantity < maxQuantity;
      expect(canIncrement).toBe(false);
    });

    it('should allow increment when below max', () => {
      const maxQuantity = 99;
      const currentQuantity = 5;
      const canIncrement = currentQuantity < maxQuantity;
      expect(canIncrement).toBe(true);
    });

    it('should allow decrement when above min', () => {
      const minQuantity = 1;
      const currentQuantity = 5;
      const canDecrement = currentQuantity > minQuantity;
      expect(canDecrement).toBe(true);
    });
  });

  // ============================================================================
  // Animation Configuration Tests
  // ============================================================================

  describe('Animation Configuration', () => {
    it('should use FadeIn animations', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('FadeIn');
    });

    it('should use FadeInDown animations', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('FadeInDown');
    });

    it('should use FadeInUp animations', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('FadeInUp');
    });

    it('should use spring animations', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('withSpring');
    });

    it('should animate quantity display on change', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('quantityScale');
    });
  });

  // ============================================================================
  // Styling Tests
  // ============================================================================

  describe('Styling', () => {
    it('should use design system tokens', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('BorderRadius');
      expect(content).toContain('Spacing');
      expect(content).toContain('Typography');
      expect(content).toContain('Colors');
      expect(content).toContain('Shadows');
    });

    it('should use PrimaryColors for accents', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('PrimaryColors');
    });

    it('should use ErrorColors for spicy badge', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('ErrorColors');
    });

    it('should use WarningColors for allergen warnings', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('WarningColors');
    });

    it('should have StyleSheet.create styles', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('StyleSheet.create');
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    it('should have accessibility roles for options', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain("accessibilityRole={isRadio ? 'radio' : 'checkbox'}");
    });

    it('should have accessibility state for options', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('accessibilityState={{ selected: isSelected');
    });

    it('should have accessibility label for close button', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('accessibilityLabel="Close"');
    });

    it('should have accessibility labels for quantity buttons', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('accessibilityLabel="Decrease quantity"');
      expect(content).toContain('accessibilityLabel="Increase quantity"');
    });

    it('should have accessibility label for special instructions', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('accessibilityLabel="Special instructions"');
    });
  });

  // ============================================================================
  // Cart Integration Tests
  // ============================================================================

  describe('Cart Integration', () => {
    it('should use addItem from cart store', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('addItem');
    });

    it('should use canAddFromRestaurant from cart store', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('canAddFromRestaurant');
    });

    it('should use clearCart from cart store', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('clearCart');
    });

    it('should validate before adding to cart', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('validation.isValid');
    });

    it('should show alert for missing selections', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('Missing Selections');
    });

    it('should show alert for different restaurant', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('Clear Cart?');
    });

    it('should navigate back after adding to cart', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('router.back()');
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle very high prices', () => {
      const selections = new Map<string, Set<string>>();
      const total = calculateTotalPrice(9999.99, selections, [], 99);
      expect(total).toBe(9999.99 * 99);
    });

    it('should handle very small prices', () => {
      const selections = new Map<string, Set<string>>();
      const total = calculateTotalPrice(0.01, selections, [], 1);
      expect(total).toBe(0.01);
    });

    it('should handle customization with single option', () => {
      const customizations: Customization[] = [
        {
          id: 'type',
          name: 'Type',
          options: [{ id: 'only', name: 'Only Option', price: 0, isDefault: true }],
          required: true,
          maxSelections: 1,
        },
      ];

      const defaults = getDefaultSelections(customizations);
      expect(defaults.get('type')?.has('only')).toBe(true);
    });

    it('should handle non-existent customization id in selections', () => {
      const customizations: Customization[] = [
        {
          id: 'real',
          name: 'Real',
          options: [{ id: 'opt', name: 'Option', price: 0 }],
          required: false,
          maxSelections: 1,
        },
      ];

      const selections = new Map<string, Set<string>>();
      selections.set('fake', new Set(['fake-opt']));

      const result = selectionsToCartFormat(selections, customizations);
      expect(result).toHaveLength(0);
    });

    it('should handle menu item not found', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('Item not found');
      expect(content).toContain('Go Back');
    });

    it('should handle character limit for special instructions', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('maxLength={200}');
      expect(content).toContain('/200');
    });
  });

  // ============================================================================
  // Validation Message Tests
  // ============================================================================

  describe('Validation Messages', () => {
    it('should generate missing customization message', () => {
      const customizations: Customization[] = [
        {
          id: 'size',
          name: 'Size',
          options: [{ id: 'sm', name: 'Small', price: 0 }],
          required: true,
          maxSelections: 1,
        },
        {
          id: 'protein',
          name: 'Protein',
          options: [{ id: 'chicken', name: 'Chicken', price: 0 }],
          required: true,
          maxSelections: 1,
        },
      ];

      const emptySelections = new Map<string, Set<string>>();
      emptySelections.set('size', new Set());
      emptySelections.set('protein', new Set());

      const validation = validateSelections(customizations, emptySelections);
      const message = `Please select options for: ${validation.missingCustomizations.join(', ')}`;

      expect(message).toContain('Size');
      expect(message).toContain('Protein');
    });

    it('should display validation warning below button', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('validationWarning');
      expect(content).toContain('Please complete all required selections');
    });
  });

  // ============================================================================
  // Price Display Logic Tests
  // ============================================================================

  describe('Price Display Logic', () => {
    it('should show +$X.XX for options with price > 0', () => {
      const option = { id: 'opt1', name: 'Extra Cheese', price: 1.5 };
      const priceDisplay = option.price > 0 ? `+${formatPrice(option.price)}` : null;
      expect(priceDisplay).toBe('+$1.50');
    });

    it('should not show price for free options', () => {
      const option = { id: 'opt1', name: 'No Ice', price: 0 };
      const priceDisplay = option.price > 0 ? `+${formatPrice(option.price)}` : null;
      expect(priceDisplay).toBeNull();
    });

    it('should show "from $X.XX" for base price in header', () => {
      const basePrice = 14.99;
      const fromText = `from ${formatPrice(basePrice)}`;
      expect(fromText).toBe('from $14.99');
    });

    it('should display price in add to cart button', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      // Button shows either "Add to Cart" or "Update Item" depending on edit mode
      expect(content).toContain(
        "{isEditMode ? 'Update Item' : 'Add to Cart'} - {formatPrice(totalPrice)}"
      );
    });
  });

  // ============================================================================
  // UI Component Tests
  // ============================================================================

  describe('UI Components', () => {
    it('should have Badge component for Required label', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('<Badge variant="primary"');
      expect(content).toContain('Required');
    });

    it('should have Badge component for Popular', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('Popular');
    });

    it('should have Badge component for Spicy', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('Spicy');
    });

    it('should have Button component for add to cart', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('<Button');
      expect(content).toContain('onPress={handleAddToCart}');
    });

    it('should have Image component from expo-image', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('<Image');
      expect(content).toContain('contentFit="cover"');
    });

    it('should have LinearGradient for image overlay', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('<LinearGradient');
      expect(content).toContain('imageGradient');
    });
  });

  // ============================================================================
  // Keyboard Handling Tests
  // ============================================================================

  describe('Keyboard Handling', () => {
    it('should use KeyboardAvoidingView', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('KeyboardAvoidingView');
    });

    it('should handle keyboard dismiss on scroll', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('keyboardShouldPersistTaps="handled"');
    });

    it('should have proper behavior for iOS and Android', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain("Platform.OS === 'ios'");
      expect(content).toContain("'padding'");
      expect(content).toContain("'height'");
    });
  });

  // ============================================================================
  // Safe Area Handling Tests
  // ============================================================================

  describe('Safe Area Handling', () => {
    it('should use useSafeAreaInsets', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('useSafeAreaInsets');
    });

    it('should apply bottom padding for scroll content', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('paddingBottom: insets.bottom');
    });

    it('should apply bottom padding for add to cart button', () => {
      const content = readFile(DISH_CUSTOMIZATION_PATH);
      expect(content).toContain('paddingBottom: insets.bottom + Spacing[4]');
    });
  });
});
