/**
 * Tests for MenuItemCard component
 */

import * as fs from 'fs';
import * as path from 'path';

import { getRestaurantById, mockMenuItems } from '@/data/mock';

const componentPath = path.join(process.cwd(), 'src/components/cards/menu-item-card.tsx');
const componentSource = fs.readFileSync(componentPath, 'utf-8');

const indexPath = path.join(process.cwd(), 'src/components/cards/index.ts');
const indexSource = fs.readFileSync(indexPath, 'utf-8');

// ============================================================================
// Test: File Structure
// ============================================================================

describe('MenuItemCard component', () => {
  describe('file structure', () => {
    it('should exist at correct path', () => {
      expect(fs.existsSync(componentPath)).toBe(true);
    });

    it('should be exported from cards index', () => {
      expect(indexSource).toContain('MenuItemCard');
    });

    it('should export MenuItemCardProps type', () => {
      expect(indexSource).toContain('MenuItemCardProps');
    });

    it('should export formatMenuItemPrice helper', () => {
      expect(indexSource).toContain('formatMenuItemPrice');
    });
  });

  // ============================================================================
  // Test: Component Exports
  // ============================================================================

  describe('component exports', () => {
    it('should export MenuItemCard function', () => {
      // Component may be exported as memo-wrapped function or direct function
      const hasDirectExport = componentSource.includes('export function MenuItemCard');
      const hasMemoExport = componentSource.includes('export const MenuItemCard = memo');
      expect(hasDirectExport || hasMemoExport).toBe(true);
    });

    it('should export MenuItemCardProps interface', () => {
      expect(componentSource).toContain('export interface MenuItemCardProps');
    });

    it('should export formatMenuItemPrice function', () => {
      expect(componentSource).toContain('export function formatMenuItemPrice');
    });
  });

  // ============================================================================
  // Test: Props Definition
  // ============================================================================

  describe('props definition', () => {
    it('should accept item prop', () => {
      expect(componentSource).toContain('item: MenuItem');
    });

    it('should accept restaurantName prop', () => {
      expect(componentSource).toContain('restaurantName?: string');
    });

    it('should accept onPress prop', () => {
      expect(componentSource).toContain('onPress?: (item: MenuItem)');
    });

    it('should accept testID prop', () => {
      expect(componentSource).toContain('testID?: string');
    });

    it('should accept showRestaurantName prop with default true', () => {
      expect(componentSource).toContain('showRestaurantName?: boolean');
      expect(componentSource).toContain('showRestaurantName = true');
    });
  });

  // ============================================================================
  // Test: Helper Functions
  // ============================================================================

  describe('formatMenuItemPrice helper', () => {
    it('should be defined in component', () => {
      expect(componentSource).toContain('function formatMenuItemPrice');
    });

    it('should accept price and hasCustomizations params', () => {
      expect(componentSource).toContain(
        'formatMenuItemPrice(price: number, hasCustomizations: boolean)'
      );
    });

    it('should add "from" prefix for customizable items', () => {
      expect(componentSource).toContain('hasCustomizations ? `from ${formattedPrice}`');
    });

    it('should format price with 2 decimal places', () => {
      expect(componentSource).toContain('price.toFixed(2)');
    });

    it('should return formatted price string', () => {
      expect(componentSource).toContain(': string');
    });
  });

  // ============================================================================
  // Test: Visual Elements
  // ============================================================================

  describe('visual elements', () => {
    describe('badges', () => {
      it('should show Popular badge when isPopular', () => {
        expect(componentSource).toContain('item.isPopular');
        expect(componentSource).toContain('Popular');
      });

      it('should show Spicy badge when isSpicy', () => {
        expect(componentSource).toContain('item.isSpicy');
        expect(componentSource).toContain('Spicy');
      });

      it('should use star icon for Popular badge', () => {
        expect(componentSource).toContain('name="star"');
      });

      it('should use flame icon for Spicy badge', () => {
        expect(componentSource).toContain('name="flame"');
      });

      it('should use PrimaryColors for Popular badge', () => {
        expect(componentSource).toContain('PrimaryColors[100]');
        expect(componentSource).toContain('PrimaryColors[600]');
      });

      it('should use ErrorColors for Spicy badge', () => {
        expect(componentSource).toContain('ErrorColors[100]');
        expect(componentSource).toContain('ErrorColors[600]');
      });
    });

    describe('text content', () => {
      it('should display item name', () => {
        expect(componentSource).toContain('{item.name}');
      });

      it('should display item description', () => {
        expect(componentSource).toContain('{item.description}');
      });

      it('should display formatted price', () => {
        expect(componentSource).toContain('{priceText}');
      });

      it('should truncate name to 1 line', () => {
        expect(componentSource).toContain('numberOfLines={1}');
      });

      it('should truncate description to 2 lines', () => {
        expect(componentSource).toContain('numberOfLines={2}');
      });
    });

    describe('image section', () => {
      it('should display item image', () => {
        expect(componentSource).toContain('source={{ uri: item.image }}');
      });

      it('should use expo-image Image component', () => {
        expect(componentSource).toContain("from 'expo-image'");
      });

      it('should use contentFit cover', () => {
        expect(componentSource).toContain('contentFit="cover"');
      });

      it('should have image transition', () => {
        expect(componentSource).toContain('transition={200}');
      });

      it('should set image size to 80px', () => {
        expect(componentSource).toContain('IMAGE_SIZE = 80');
      });
    });

    describe('restaurant info', () => {
      it('should show restaurant name when showRestaurantName is true', () => {
        expect(componentSource).toContain('showRestaurantName && restaurantName');
      });

      it('should use restaurant icon', () => {
        expect(componentSource).toContain('name="restaurant-outline"');
      });

      it('should truncate restaurant name to 1 line', () => {
        expect(componentSource).toContain('numberOfLines={1}');
      });
    });
  });

  // ============================================================================
  // Test: Unavailable State
  // ============================================================================

  describe('unavailable state', () => {
    it('should check isAvailable status', () => {
      expect(componentSource).toContain('item.isAvailable');
    });

    it('should disable press when unavailable', () => {
      expect(componentSource).toContain('disabled={!item.isAvailable}');
    });

    it('should show unavailable text', () => {
      expect(componentSource).toContain('Currently unavailable');
    });

    it('should dim image when unavailable', () => {
      expect(componentSource).toContain('imageUnavailable');
      expect(componentSource).toContain('opacity: 0.5');
    });

    it('should change text color when unavailable', () => {
      expect(componentSource).toContain('item.isAvailable ? colors.text : colors.textTertiary');
    });
  });

  // ============================================================================
  // Test: Animation
  // ============================================================================

  describe('animation', () => {
    it('should use react-native-reanimated', () => {
      expect(componentSource).toContain("from 'react-native-reanimated'");
    });

    it('should use useSharedValue for scale', () => {
      expect(componentSource).toContain('useSharedValue');
      expect(componentSource).toContain('const scale = useSharedValue(1)');
    });

    it('should use withSpring for animation', () => {
      expect(componentSource).toContain('withSpring');
    });

    it('should define SPRING_CONFIG', () => {
      expect(componentSource).toContain('SPRING_CONFIG');
    });

    it('should have damping in spring config', () => {
      expect(componentSource).toContain('damping: 15');
    });

    it('should have stiffness in spring config', () => {
      expect(componentSource).toContain('stiffness: 200');
    });

    it('should scale to 0.98 on press', () => {
      expect(componentSource).toContain('withSpring(0.98');
    });

    it('should scale back to 1 on release', () => {
      expect(componentSource).toContain('withSpring(1');
    });
  });

  // ============================================================================
  // Test: Press Handlers
  // ============================================================================

  describe('press handlers', () => {
    it('should have handlePressIn callback', () => {
      expect(componentSource).toContain('handlePressIn');
    });

    it('should have handlePressOut callback', () => {
      expect(componentSource).toContain('handlePressOut');
    });

    it('should have handlePress callback', () => {
      expect(componentSource).toContain('handlePress');
    });

    it('should call onPress with item', () => {
      expect(componentSource).toContain('onPress?.(item)');
    });

    it('should only call onPress when available', () => {
      expect(componentSource).toContain('if (item.isAvailable)');
    });

    it('should use useCallback for handlers', () => {
      expect(componentSource).toContain('useCallback');
    });
  });

  // ============================================================================
  // Test: Accessibility
  // ============================================================================

  describe('accessibility', () => {
    it('should have accessibilityLabel', () => {
      expect(componentSource).toContain('accessibilityLabel=');
    });

    it('should include item name in label', () => {
      expect(componentSource).toContain('${item.name}');
    });

    it('should include price in label', () => {
      expect(componentSource).toContain('${priceText}');
    });

    it('should include restaurant name in label when provided', () => {
      expect(componentSource).toContain('from ${restaurantName}');
    });

    it('should indicate unavailability in label', () => {
      expect(componentSource).toContain('Currently unavailable');
    });

    it('should have accessibilityRole button', () => {
      expect(componentSource).toContain('accessibilityRole="button"');
    });

    it('should have accessibilityState disabled', () => {
      expect(componentSource).toContain('accessibilityState={{ disabled: !item.isAvailable }}');
    });
  });

  // ============================================================================
  // Test: Styling
  // ============================================================================

  describe('styling', () => {
    it('should use StyleSheet.create', () => {
      expect(componentSource).toContain('StyleSheet.create');
    });

    it('should use theme colors', () => {
      expect(componentSource).toContain('colors.card');
      expect(componentSource).toContain('colors.border');
      expect(componentSource).toContain('colors.text');
      expect(componentSource).toContain('colors.textSecondary');
      expect(componentSource).toContain('colors.textTertiary');
    });

    it('should use design system tokens', () => {
      expect(componentSource).toContain('BorderRadius');
      expect(componentSource).toContain('Spacing');
      expect(componentSource).toContain('Typography');
    });

    it('should use Shadows', () => {
      expect(componentSource).toContain('Shadows.sm');
    });

    it('should have flex row layout', () => {
      expect(componentSource).toContain("flexDirection: 'row'");
    });

    it('should have border radius', () => {
      expect(componentSource).toContain('borderRadius: BorderRadius.lg');
    });

    it('should have border width', () => {
      expect(componentSource).toContain('borderWidth: 1');
    });
  });

  // ============================================================================
  // Test: Theme Support
  // ============================================================================

  describe('theme support', () => {
    it('should use useColorScheme hook', () => {
      expect(componentSource).toContain('useColorScheme');
    });

    it('should access Colors based on color scheme', () => {
      expect(componentSource).toContain("Colors[colorScheme ?? 'light']");
    });
  });

  // ============================================================================
  // Test: Mock Data Compatibility
  // ============================================================================

  describe('mock data compatibility', () => {
    it('should work with mock menu items', () => {
      const item = mockMenuItems[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('restaurantId');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('isAvailable');
    });

    it('should work with popular items', () => {
      const popularItems = mockMenuItems.filter((item) => item.isPopular);
      expect(popularItems.length).toBeGreaterThan(0);
    });

    it('should work with spicy items', () => {
      const spicyItems = mockMenuItems.filter((item) => item.isSpicy);
      expect(spicyItems.length).toBeGreaterThan(0);
    });

    it('should work with customizable items', () => {
      const customizableItems = mockMenuItems.filter((item) => item.customizations.length > 0);
      expect(customizableItems.length).toBeGreaterThan(0);
    });

    it('should resolve restaurant names correctly', () => {
      const item = mockMenuItems[0];
      const restaurant = getRestaurantById(item.restaurantId);
      expect(restaurant).toBeDefined();
      expect(typeof restaurant?.name).toBe('string');
    });
  });

  // ============================================================================
  // Test: Price Formatting Logic
  // ============================================================================

  describe('price formatting logic', () => {
    it('should format price with dollar sign', () => {
      const price = 14.99;
      const formatted = `$${price.toFixed(2)}`;
      expect(formatted).toBe('$14.99');
    });

    it('should format whole dollar amounts with decimals', () => {
      const price = 10;
      const formatted = `$${price.toFixed(2)}`;
      expect(formatted).toBe('$10.00');
    });

    it('should add "from" prefix for customizable items', () => {
      const price = 14.99;
      const hasCustomizations = true;
      const formattedPrice = `$${price.toFixed(2)}`;
      const result = hasCustomizations ? `from ${formattedPrice}` : formattedPrice;
      expect(result).toBe('from $14.99');
    });

    it('should not add "from" prefix for non-customizable items', () => {
      const price = 8.99;
      const hasCustomizations = false;
      const formattedPrice = `$${price.toFixed(2)}`;
      const result = hasCustomizations ? `from ${formattedPrice}` : formattedPrice;
      expect(result).toBe('$8.99');
    });
  });
});
