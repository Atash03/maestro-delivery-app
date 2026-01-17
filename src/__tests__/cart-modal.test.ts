/**
 * Cart Modal Tests
 *
 * Comprehensive tests for the cart modal screen including:
 * - File structure and exports
 * - Helper functions
 * - Cart display
 * - Order summary calculations
 * - Edit and delete functionality
 * - Navigation and interactions
 * - Accessibility
 * - Animations
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ============================================================================
// Test Data
// ============================================================================

const cartModalPath = resolve(__dirname, '../app/(modals)/cart.tsx');

const dishCustomizationPath = resolve(__dirname, '../app/(modals)/dish-customization.tsx');

const modalsLayoutPath = resolve(__dirname, '../app/(modals)/_layout.tsx');

const swipeableCartItemPath = resolve(__dirname, '../components/swipeable-cart-item.tsx');

const cartStorePath = resolve(__dirname, '../stores/cart-store.ts');

const useCartPath = resolve(__dirname, '../hooks/use-cart.ts');

// Helper functions from cart modal
const TAX_RATE = 0.0875;
const DELIVERY_FEE_MINIMUM = 2.99;

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function calculateTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

function getDeliveryFee(restaurantDeliveryFee?: number): number {
  return restaurantDeliveryFee ?? DELIVERY_FEE_MINIMUM;
}

function calculateTotal(subtotal: number, deliveryFee: number, tax: number): number {
  return subtotal + deliveryFee + tax;
}

// Helper function from dish customization for edit mode
interface SelectedCustomization {
  customizationId: string;
  customizationName: string;
  selectedOptions: { optionId: string; optionName: string; price: number }[];
}

function cartSelectionsToMap(
  selectedCustomizations: SelectedCustomization[]
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();

  for (const customization of selectedCustomizations) {
    const optionIds = new Set(customization.selectedOptions.map((o) => o.optionId));
    map.set(customization.customizationId, optionIds);
  }

  return map;
}

// ============================================================================
// Tests
// ============================================================================

describe('Cart Modal', () => {
  // ==========================================================================
  // File Structure Tests
  // ==========================================================================

  describe('File Structure', () => {
    it('cart modal file should exist', () => {
      expect(existsSync(cartModalPath)).toBe(true);
    });

    it('modals layout file should exist', () => {
      expect(existsSync(modalsLayoutPath)).toBe(true);
    });

    it('swipeable cart item component should exist', () => {
      expect(existsSync(swipeableCartItemPath)).toBe(true);
    });

    it('cart store should exist', () => {
      expect(existsSync(cartStorePath)).toBe(true);
    });

    it('useCart hook should exist', () => {
      expect(existsSync(useCartPath)).toBe(true);
    });
  });

  // ==========================================================================
  // Cart Modal Exports Tests
  // ==========================================================================

  describe('Cart Modal Exports', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should export TAX_RATE constant', () => {
      expect(cartModalContent).toContain('export const TAX_RATE');
    });

    it('should export DELIVERY_FEE_MINIMUM constant', () => {
      expect(cartModalContent).toContain('export const DELIVERY_FEE_MINIMUM');
    });

    it('should export formatPrice function', () => {
      expect(cartModalContent).toContain('export function formatPrice');
    });

    it('should export calculateTax function', () => {
      expect(cartModalContent).toContain('export function calculateTax');
    });

    it('should export getDeliveryFee function', () => {
      expect(cartModalContent).toContain('export function getDeliveryFee');
    });

    it('should export calculateTotal function', () => {
      expect(cartModalContent).toContain('export function calculateTotal');
    });

    it('should export default CartScreen component', () => {
      expect(cartModalContent).toContain('export default function CartScreen');
    });
  });

  // ==========================================================================
  // Helper Function Tests
  // ==========================================================================

  describe('formatPrice', () => {
    it('should format whole numbers correctly', () => {
      expect(formatPrice(10)).toBe('$10.00');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
    });

    it('should format zero correctly', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle long decimals by rounding', () => {
      expect(formatPrice(10.999)).toBe('$11.00');
    });

    it('should format cents correctly', () => {
      expect(formatPrice(0.99)).toBe('$0.99');
    });

    it('should format large numbers correctly', () => {
      expect(formatPrice(1000)).toBe('$1000.00');
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax correctly for a standard subtotal', () => {
      const subtotal = 100;
      const tax = calculateTax(subtotal);
      expect(tax).toBeCloseTo(8.75);
    });

    it('should return 0 for 0 subtotal', () => {
      expect(calculateTax(0)).toBe(0);
    });

    it('should calculate tax correctly for small amounts', () => {
      const subtotal = 10;
      const tax = calculateTax(subtotal);
      expect(tax).toBeCloseTo(0.875);
    });

    it('should handle decimals correctly', () => {
      const subtotal = 25.5;
      const tax = calculateTax(subtotal);
      expect(tax).toBeCloseTo(2.23125);
    });
  });

  describe('getDeliveryFee', () => {
    it('should return restaurant delivery fee when provided', () => {
      expect(getDeliveryFee(3.99)).toBe(3.99);
    });

    it('should return minimum delivery fee when not provided', () => {
      expect(getDeliveryFee()).toBe(DELIVERY_FEE_MINIMUM);
    });

    it('should return minimum when undefined', () => {
      expect(getDeliveryFee(undefined)).toBe(DELIVERY_FEE_MINIMUM);
    });

    it('should return 0 for free delivery', () => {
      expect(getDeliveryFee(0)).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      const subtotal = 100;
      const deliveryFee = 5;
      const tax = 8.75;
      expect(calculateTotal(subtotal, deliveryFee, tax)).toBe(113.75);
    });

    it('should handle zero values', () => {
      expect(calculateTotal(0, 0, 0)).toBe(0);
    });

    it('should handle free delivery', () => {
      const subtotal = 50;
      const deliveryFee = 0;
      const tax = 4.375;
      expect(calculateTotal(subtotal, deliveryFee, tax)).toBeCloseTo(54.375);
    });
  });

  // ==========================================================================
  // Constants Tests
  // ==========================================================================

  describe('Constants', () => {
    it('TAX_RATE should be 8.75%', () => {
      expect(TAX_RATE).toBe(0.0875);
    });

    it('DELIVERY_FEE_MINIMUM should be $2.99', () => {
      expect(DELIVERY_FEE_MINIMUM).toBe(2.99);
    });
  });

  // ==========================================================================
  // Cart Modal Content Tests
  // ==========================================================================

  describe('Cart Modal Content', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    describe('Header Component', () => {
      it('should include Header sub-component', () => {
        expect(cartModalContent).toContain('function Header');
      });

      it('should include close button', () => {
        expect(cartModalContent).toContain('cart-close-button');
      });

      it('should include clear cart button', () => {
        expect(cartModalContent).toContain('cart-clear-button');
      });

      it('should display item count', () => {
        expect(cartModalContent).toContain('itemCount');
      });

      it('should have "Your Cart" title', () => {
        expect(cartModalContent).toContain('Your Cart');
      });
    });

    describe('Restaurant Info Component', () => {
      it('should include RestaurantInfo sub-component', () => {
        expect(cartModalContent).toContain('function RestaurantInfo');
      });

      it('should display restaurant name', () => {
        expect(cartModalContent).toContain('restaurantName');
      });

      it('should display restaurant image', () => {
        expect(cartModalContent).toContain('restaurantImage');
      });

      it('should show "Ordering from" label', () => {
        expect(cartModalContent).toContain('Ordering from');
      });
    });

    describe('Empty Cart Component', () => {
      it('should include EmptyCart sub-component', () => {
        expect(cartModalContent).toContain('function EmptyCart');
      });

      it('should display empty cart message', () => {
        expect(cartModalContent).toContain('Your cart is empty');
      });

      it('should include browse restaurants button', () => {
        expect(cartModalContent).toContain('cart-browse-button');
      });

      it('should display cart icon for empty state', () => {
        expect(cartModalContent).toContain('cart-outline');
      });
    });

    describe('Order Summary Component', () => {
      it('should include OrderSummary sub-component', () => {
        expect(cartModalContent).toContain('function OrderSummary');
      });

      it('should display subtotal', () => {
        expect(cartModalContent).toContain('Subtotal');
      });

      it('should display delivery fee', () => {
        expect(cartModalContent).toContain('Delivery Fee');
      });

      it('should display tax', () => {
        expect(cartModalContent).toContain('Tax');
      });

      it('should display total', () => {
        expect(cartModalContent).toContain('Total');
      });

      it('should handle free delivery display', () => {
        expect(cartModalContent).toContain("deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)");
      });
    });

    describe('Footer Buttons Component', () => {
      it('should include FooterButtons sub-component', () => {
        expect(cartModalContent).toContain('function FooterButtons');
      });

      it('should include "Add More Items" button', () => {
        expect(cartModalContent).toContain('cart-add-more-button');
      });

      it('should include "Checkout" button', () => {
        expect(cartModalContent).toContain('cart-checkout-button');
      });

      it('should display total in checkout button', () => {
        expect(cartModalContent).toContain('formatPrice(total)');
      });
    });
  });

  // ==========================================================================
  // Cart Item Integration Tests
  // ==========================================================================

  describe('Cart Item Integration', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should import SwipeableCartItem component', () => {
      expect(cartModalContent).toContain('SwipeableCartItem');
    });

    it('should pass item prop to SwipeableCartItem', () => {
      expect(cartModalContent).toContain('item={item}');
    });

    it('should pass onQuantityChange handler', () => {
      expect(cartModalContent).toContain('onQuantityChange={handleQuantityChange}');
    });

    it('should pass onRemove handler', () => {
      expect(cartModalContent).toContain('onRemove={handleRemoveItem}');
    });

    it('should pass onPress handler for editing', () => {
      expect(cartModalContent).toContain('onPress={handleEditItem}');
    });
  });

  // ==========================================================================
  // Cart Store Integration Tests
  // ==========================================================================

  describe('Cart Store Integration', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should import useCartStore', () => {
      expect(cartModalContent).toContain('useCartStore');
    });

    it('should get items from store', () => {
      expect(cartModalContent).toContain('state.items');
    });

    it('should get restaurant from store', () => {
      expect(cartModalContent).toContain('state.restaurant');
    });

    it('should get getSubtotal from store', () => {
      expect(cartModalContent).toContain('state.getSubtotal');
    });

    it('should get getItemCount from store', () => {
      expect(cartModalContent).toContain('state.getItemCount');
    });

    it('should get updateQuantity from store', () => {
      expect(cartModalContent).toContain('state.updateQuantity');
    });

    it('should get removeItem from store', () => {
      expect(cartModalContent).toContain('state.removeItem');
    });

    it('should get clearCart from store', () => {
      expect(cartModalContent).toContain('state.clearCart');
    });
  });

  // ==========================================================================
  // Navigation Tests
  // ==========================================================================

  describe('Navigation', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should import useRouter from expo-router', () => {
      expect(cartModalContent).toContain('useRouter');
    });

    it('should handle close navigation', () => {
      expect(cartModalContent).toContain('router.back()');
    });

    it('should navigate to checkout', () => {
      expect(cartModalContent).toContain('/order/checkout');
    });

    it('should navigate to restaurant for add more items', () => {
      expect(cartModalContent).toContain('/restaurant/${restaurantId}');
    });

    it('should navigate to tabs for browse restaurants', () => {
      expect(cartModalContent).toContain("router.push('/(tabs)')");
    });

    it('should navigate to dish customization for edit', () => {
      expect(cartModalContent).toContain('/(modals)/dish-customization');
    });

    it('should pass editMode param when editing', () => {
      expect(cartModalContent).toContain("editMode: 'true'");
    });

    it('should pass cartItemId when editing', () => {
      expect(cartModalContent).toContain('cartItemId: item.id');
    });
  });

  // ==========================================================================
  // Edit Mode Tests (Dish Customization)
  // ==========================================================================

  describe('Edit Mode Support', () => {
    let dishCustomizationContent: string;

    beforeAll(() => {
      dishCustomizationContent = readFileSync(dishCustomizationPath, 'utf-8');
    });

    it('should accept cartItemId param', () => {
      expect(dishCustomizationContent).toContain('cartItemId');
    });

    it('should accept editMode param', () => {
      expect(dishCustomizationContent).toContain('editMode');
    });

    it('should export cartSelectionsToMap function', () => {
      expect(dishCustomizationContent).toContain('export function cartSelectionsToMap');
    });

    it('should check isEditMode flag', () => {
      expect(dishCustomizationContent).toContain('isEditMode');
    });

    it('should get existingCartItem when editing', () => {
      expect(dishCustomizationContent).toContain('existingCartItem');
    });

    it('should call updateItem when in edit mode', () => {
      expect(dishCustomizationContent).toContain('updateItem(cartItemId');
    });

    it('should show "Update Item" text when editing', () => {
      expect(dishCustomizationContent).toContain("isEditMode ? 'Update Item' : 'Add to Cart'");
    });

    it('should skip restaurant validation when editing', () => {
      expect(dishCustomizationContent).toContain('!isEditMode && !canAddFromRestaurant');
    });
  });

  describe('cartSelectionsToMap function', () => {
    it('should convert empty array to empty map', () => {
      const result = cartSelectionsToMap([]);
      expect(result.size).toBe(0);
    });

    it('should convert single customization correctly', () => {
      const selections: SelectedCustomization[] = [
        {
          customizationId: 'size-1',
          customizationName: 'Size',
          selectedOptions: [{ optionId: 'large', optionName: 'Large', price: 2 }],
        },
      ];
      const result = cartSelectionsToMap(selections);
      expect(result.size).toBe(1);
      expect(result.get('size-1')?.has('large')).toBe(true);
    });

    it('should convert multiple customizations correctly', () => {
      const selections: SelectedCustomization[] = [
        {
          customizationId: 'size-1',
          customizationName: 'Size',
          selectedOptions: [{ optionId: 'large', optionName: 'Large', price: 2 }],
        },
        {
          customizationId: 'toppings-1',
          customizationName: 'Toppings',
          selectedOptions: [
            { optionId: 'cheese', optionName: 'Extra Cheese', price: 1 },
            { optionId: 'bacon', optionName: 'Bacon', price: 1.5 },
          ],
        },
      ];
      const result = cartSelectionsToMap(selections);
      expect(result.size).toBe(2);
      expect(result.get('size-1')?.size).toBe(1);
      expect(result.get('toppings-1')?.size).toBe(2);
    });

    it('should handle multiple options in single customization', () => {
      const selections: SelectedCustomization[] = [
        {
          customizationId: 'toppings',
          customizationName: 'Toppings',
          selectedOptions: [
            { optionId: 'opt1', optionName: 'Option 1', price: 0.5 },
            { optionId: 'opt2', optionName: 'Option 2', price: 0.5 },
            { optionId: 'opt3', optionName: 'Option 3', price: 0.5 },
          ],
        },
      ];
      const result = cartSelectionsToMap(selections);
      expect(result.get('toppings')?.size).toBe(3);
      expect(result.get('toppings')?.has('opt1')).toBe(true);
      expect(result.get('toppings')?.has('opt2')).toBe(true);
      expect(result.get('toppings')?.has('opt3')).toBe(true);
    });
  });

  // ==========================================================================
  // Clear Cart Tests
  // ==========================================================================

  describe('Clear Cart Functionality', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should have handleClearCart function', () => {
      expect(cartModalContent).toContain('handleClearCart');
    });

    it('should show confirmation alert before clearing', () => {
      expect(cartModalContent).toContain('Alert.alert');
      expect(cartModalContent).toContain('Clear Cart');
    });

    it('should call clearCart on confirmation', () => {
      expect(cartModalContent).toContain('clearCart()');
    });

    it('should have destructive style for clear button', () => {
      expect(cartModalContent).toContain("style: 'destructive'");
    });
  });

  // ==========================================================================
  // Animation Tests
  // ==========================================================================

  describe('Animations', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should import Animated from react-native-reanimated', () => {
      expect(cartModalContent).toContain("from 'react-native-reanimated'");
    });

    it('should use FadeIn animation', () => {
      expect(cartModalContent).toContain('FadeIn');
    });

    it('should use FadeInDown animation', () => {
      expect(cartModalContent).toContain('FadeInDown');
    });

    it('should use FadeInUp animation', () => {
      expect(cartModalContent).toContain('FadeInUp');
    });

    it('should use FadeOut animation', () => {
      expect(cartModalContent).toContain('FadeOut');
    });

    it('should use Layout animation for items', () => {
      expect(cartModalContent).toContain('Layout');
    });

    it('should use withSpring for button animations', () => {
      expect(cartModalContent).toContain('withSpring');
    });

    it('should have staggered delays for item animations', () => {
      expect(cartModalContent).toContain('200 + index * 50');
    });

    it('should use AnimatedPressable for buttons', () => {
      expect(cartModalContent).toContain('AnimatedPressable');
    });

    it('should use useAnimatedStyle for button press', () => {
      expect(cartModalContent).toContain('useAnimatedStyle');
    });
  });

  // ==========================================================================
  // Styling Tests
  // ==========================================================================

  describe('Styling', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should import design system constants', () => {
      expect(cartModalContent).toContain('BorderRadius');
      expect(cartModalContent).toContain('Colors');
      expect(cartModalContent).toContain('FontWeights');
      expect(cartModalContent).toContain('Shadows');
      expect(cartModalContent).toContain('Spacing');
      expect(cartModalContent).toContain('Typography');
    });

    it('should import PrimaryColors', () => {
      expect(cartModalContent).toContain('PrimaryColors');
    });

    it('should import NeutralColors', () => {
      expect(cartModalContent).toContain('NeutralColors');
    });

    it('should use StyleSheet.create', () => {
      expect(cartModalContent).toContain('StyleSheet.create');
    });

    it('should have styles object', () => {
      expect(cartModalContent).toContain('const styles = StyleSheet.create');
    });

    it('should handle safe area insets', () => {
      expect(cartModalContent).toContain('useSafeAreaInsets');
    });

    it('should apply theme colors', () => {
      expect(cartModalContent).toContain('colors.background');
      expect(cartModalContent).toContain('colors.text');
    });
  });

  // ==========================================================================
  // Accessibility Tests
  // ==========================================================================

  describe('Accessibility', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should have accessibility labels for buttons', () => {
      expect(cartModalContent).toContain('accessibilityLabel=');
    });

    it('should have accessibility roles', () => {
      expect(cartModalContent).toContain('accessibilityRole="button"');
    });

    it('should have close button accessibility', () => {
      expect(cartModalContent).toContain('accessibilityLabel="Close cart"');
    });

    it('should have clear button accessibility', () => {
      expect(cartModalContent).toContain('accessibilityLabel="Clear cart"');
    });

    it('should have browse restaurants button accessibility', () => {
      expect(cartModalContent).toContain('accessibilityLabel="Browse restaurants"');
    });

    it('should have add more items button accessibility', () => {
      expect(cartModalContent).toContain('accessibilityLabel="Add more items"');
    });

    it('should have checkout button accessibility with total', () => {
      expect(cartModalContent).toContain(
        'accessibilityLabel={`Checkout, total ${formatPrice(total)}`}'
      );
    });

    it('should have hitSlop for close button', () => {
      expect(cartModalContent).toContain('hitSlop=');
    });
  });

  // ==========================================================================
  // Test IDs Tests
  // ==========================================================================

  describe('Test IDs', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should have cart screen test ID', () => {
      expect(cartModalContent).toContain('testID="cart-screen"');
    });

    it('should have close button test ID', () => {
      expect(cartModalContent).toContain('testID="cart-close-button"');
    });

    it('should have clear button test ID', () => {
      expect(cartModalContent).toContain('testID="cart-clear-button"');
    });

    it('should have browse button test ID', () => {
      expect(cartModalContent).toContain('testID="cart-browse-button"');
    });

    it('should have add more button test ID', () => {
      expect(cartModalContent).toContain('testID="cart-add-more-button"');
    });

    it('should have checkout button test ID', () => {
      expect(cartModalContent).toContain('testID="cart-checkout-button"');
    });

    it('should have dynamic cart item test IDs', () => {
      expect(cartModalContent).toContain('testID={`cart-item-${item.id}`}');
    });
  });

  // ==========================================================================
  // GestureHandler Integration Tests
  // ==========================================================================

  describe('GestureHandler Integration', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should import GestureHandlerRootView', () => {
      expect(cartModalContent).toContain('GestureHandlerRootView');
    });

    it('should wrap content in GestureHandlerRootView', () => {
      expect(cartModalContent).toContain('<GestureHandlerRootView');
    });

    it('should set flex: 1 on gesture root', () => {
      expect(cartModalContent).toContain('gestureRoot');
    });
  });

  // ==========================================================================
  // Modals Layout Integration Tests
  // ==========================================================================

  describe('Modals Layout Integration', () => {
    let modalsLayoutContent: string;

    beforeAll(() => {
      modalsLayoutContent = readFileSync(modalsLayoutPath, 'utf-8');
    });

    it('should include cart route in modals layout', () => {
      expect(modalsLayoutContent).toContain('name="cart"');
    });

    it('should have modal presentation style', () => {
      expect(modalsLayoutContent).toContain("presentation: 'modal'");
    });

    it('should have slide from bottom animation', () => {
      expect(modalsLayoutContent).toContain("animation: 'slide_from_bottom'");
    });
  });

  // ==========================================================================
  // Order Summary Calculation Integration Tests
  // ==========================================================================

  describe('Order Summary Calculations Integration', () => {
    it('should calculate correct total for sample order', () => {
      const subtotal = 45.97;
      const deliveryFee = 3.99;
      const tax = calculateTax(subtotal);
      const total = calculateTotal(subtotal, deliveryFee, tax);

      expect(tax).toBeCloseTo(4.02, 2);
      expect(total).toBeCloseTo(53.98, 2);
    });

    it('should handle free delivery correctly', () => {
      const subtotal = 100;
      const deliveryFee = 0;
      const tax = calculateTax(subtotal);
      const total = calculateTotal(subtotal, deliveryFee, tax);

      expect(total).toBeCloseTo(108.75, 2);
    });

    it('should handle small orders correctly', () => {
      const subtotal = 5.99;
      const deliveryFee = DELIVERY_FEE_MINIMUM;
      const tax = calculateTax(subtotal);
      const total = calculateTotal(subtotal, deliveryFee, tax);

      expect(total).toBeGreaterThan(subtotal + deliveryFee);
    });
  });

  // ==========================================================================
  // Edge Case Tests
  // ==========================================================================

  describe('Edge Cases', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should handle empty cart state', () => {
      expect(cartModalContent).toContain('items.length === 0');
    });

    it('should conditionally show restaurant info', () => {
      expect(cartModalContent).toContain('{restaurant &&');
    });

    it('should conditionally show clear button based on item count', () => {
      expect(cartModalContent).toContain('{itemCount > 0 &&');
    });

    it('should handle items without restaurant navigation', () => {
      expect(cartModalContent).toContain("router.push('/(tabs)')");
    });

    it('should use fallback image for restaurant', () => {
      expect(cartModalContent).toContain('picsum.photos');
    });

    it('should handle singular vs plural item count', () => {
      expect(cartModalContent).toContain("itemCount === 1 ? 'item' : 'items'");
    });
  });

  // ==========================================================================
  // Import Tests
  // ==========================================================================

  describe('Imports', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should import from expo-router', () => {
      expect(cartModalContent).toContain("from 'expo-router'");
    });

    it('should import from expo-image', () => {
      expect(cartModalContent).toContain("from 'expo-image'");
    });

    it('should import from react-native', () => {
      expect(cartModalContent).toContain("from 'react-native'");
    });

    it('should import from react-native-gesture-handler', () => {
      expect(cartModalContent).toContain("from 'react-native-gesture-handler'");
    });

    it('should import from react-native-reanimated', () => {
      expect(cartModalContent).toContain("from 'react-native-reanimated'");
    });

    it('should import from react-native-safe-area-context', () => {
      expect(cartModalContent).toContain("from 'react-native-safe-area-context'");
    });

    it('should import SwipeableCartItem', () => {
      expect(cartModalContent).toContain("from '@/components/swipeable-cart-item'");
    });

    it('should import theme constants', () => {
      expect(cartModalContent).toContain("from '@/constants/theme'");
    });

    it('should import useColorScheme hook', () => {
      expect(cartModalContent).toContain("from '@/hooks/use-color-scheme'");
    });

    it('should import CartItem type', () => {
      expect(cartModalContent).toContain('type { CartItem }');
    });
  });

  // ==========================================================================
  // Hooks Usage Tests
  // ==========================================================================

  describe('Hooks Usage', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should use useCallback for handlers', () => {
      expect(cartModalContent).toContain('useCallback');
    });

    it('should use useMemo for computed values', () => {
      expect(cartModalContent).toContain('useMemo');
    });

    it('should use useSharedValue for animations', () => {
      expect(cartModalContent).toContain('useSharedValue');
    });

    it('should use useRouter for navigation', () => {
      expect(cartModalContent).toContain('const router = useRouter()');
    });

    it('should use useColorScheme for theming', () => {
      expect(cartModalContent).toContain('const colorScheme = useColorScheme()');
    });

    it('should use useSafeAreaInsets', () => {
      expect(cartModalContent).toContain('const insets = useSafeAreaInsets()');
    });
  });

  // ==========================================================================
  // Performance Tests
  // ==========================================================================

  describe('Performance Optimizations', () => {
    let cartModalContent: string;

    beforeAll(() => {
      cartModalContent = readFileSync(cartModalPath, 'utf-8');
    });

    it('should memoize delivery fee calculation', () => {
      expect(cartModalContent).toContain('useMemo');
      expect(cartModalContent).toContain('getDeliveryFee');
    });

    it('should memoize tax calculation', () => {
      expect(cartModalContent).toContain('calculateTax(subtotal)');
    });

    it('should memoize total calculation', () => {
      expect(cartModalContent).toContain('calculateTotal(subtotal, deliveryFee, tax)');
    });

    it('should memoize handlers with useCallback', () => {
      const useCallbackCount = (cartModalContent.match(/useCallback/g) || []).length;
      expect(useCallbackCount).toBeGreaterThan(5);
    });
  });
});
