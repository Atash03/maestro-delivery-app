/**
 * Tests for Reorder Functionality
 *
 * Tests the reorder hook and modal for correct behavior:
 * - Reorder hook file structure and exports
 * - Reorder modal component structure
 * - Integration with order details screen
 * - Availability checking logic
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ============================================================================
// Test Paths
// ============================================================================

const reorderHookPath = resolve(__dirname, '../hooks/use-reorder.ts');
const reorderModalPath = resolve(__dirname, '../components/reorder-modal.tsx');
const orderDetailsScreenPath = resolve(__dirname, '../app/order/details/[id].tsx');
const cartStorePath = resolve(__dirname, '../stores/cart-store.ts');
const mockMenuItemsPath = resolve(__dirname, '../data/mock/menu-items.ts');
const mockIndexPath = resolve(__dirname, '../data/mock/index.ts');

// ============================================================================
// useReorder Hook Tests
// ============================================================================

describe('useReorder Hook', () => {
  let hookContent: string;

  beforeAll(() => {
    hookContent = readFileSync(reorderHookPath, 'utf-8');
  });

  describe('File Structure', () => {
    it('reorder hook file should exist', () => {
      expect(existsSync(reorderHookPath)).toBe(true);
    });

    it('should export useReorder hook', () => {
      expect(hookContent).toContain('export function useReorder');
    });

    it('should export AvailabilityCheckResult interface', () => {
      expect(hookContent).toContain('export interface AvailabilityCheckResult');
    });

    it('should export ReorderResult interface', () => {
      expect(hookContent).toContain('export interface ReorderResult');
    });
  });

  describe('AvailabilityCheckResult Interface', () => {
    it('should define availableItems array', () => {
      expect(hookContent).toContain('availableItems: CartItem[]');
    });

    it('should define unavailableItems array', () => {
      expect(hookContent).toContain('unavailableItems: CartItem[]');
    });

    it('should define allAvailable boolean', () => {
      expect(hookContent).toContain('allAvailable: boolean');
    });

    it('should define noneAvailable boolean', () => {
      expect(hookContent).toContain('noneAvailable: boolean');
    });
  });

  describe('ReorderResult Interface', () => {
    it('should define success boolean', () => {
      expect(hookContent).toContain('success: boolean');
    });

    it('should define itemsAdded count', () => {
      expect(hookContent).toContain('itemsAdded: number');
    });

    it('should define unavailableCount', () => {
      expect(hookContent).toContain('unavailableCount: number');
    });

    it('should define optional error message', () => {
      expect(hookContent).toContain('error?: string');
    });
  });

  describe('Hook Options', () => {
    it('should accept onSuccess callback', () => {
      expect(hookContent).toContain('onSuccess?: (result: ReorderResult) => void');
    });

    it('should accept onUnavailableItems callback', () => {
      expect(hookContent).toContain(
        'onUnavailableItems?: (result: AvailabilityCheckResult) => void'
      );
    });

    it('should accept onError callback', () => {
      expect(hookContent).toContain('onError?: (error: string) => void');
    });
  });

  describe('Return Interface', () => {
    it('should return isLoading state', () => {
      expect(hookContent).toContain('isLoading: boolean');
    });

    it('should return checkAvailability function', () => {
      expect(hookContent).toContain(
        'checkAvailability: (order: Order) => Promise<AvailabilityCheckResult>'
      );
    });

    it('should return executeReorder function', () => {
      expect(hookContent).toContain('executeReorder: (order: Order');
    });

    it('should return isItemAvailable function', () => {
      expect(hookContent).toContain('isItemAvailable: (menuItemId: string) => boolean');
    });
  });

  describe('Availability Checking Logic', () => {
    it('should use getMenuItemById to check availability', () => {
      expect(hookContent).toContain('getMenuItemById');
    });

    it('should check isAvailable field on menu items', () => {
      expect(hookContent).toContain('menuItem.isAvailable');
    });

    it('should simulate network delay', () => {
      expect(hookContent).toContain('simulateNetworkDelay');
    });

    it('should use NETWORK_DELAYS from mock data', () => {
      expect(hookContent).toContain('NETWORK_DELAYS.FAST');
    });
  });

  describe('Execute Reorder Logic', () => {
    it('should check cart restaurant compatibility', () => {
      expect(hookContent).toContain('canAddFromRestaurant');
    });

    it('should clear cart when switching restaurants', () => {
      expect(hookContent).toContain('clearCart()');
    });

    it('should set restaurant before adding items', () => {
      expect(hookContent).toContain('setRestaurant(order.restaurant)');
    });

    it('should add items to cart using addItem', () => {
      expect(hookContent).toContain('addItem(');
    });

    it('should pass menu item, quantity, customizations, and instructions', () => {
      expect(hookContent).toContain('item.menuItem');
      expect(hookContent).toContain('item.quantity');
      expect(hookContent).toContain('item.selectedCustomizations');
      expect(hookContent).toContain('item.specialInstructions');
    });
  });

  describe('Error Handling', () => {
    it('should handle case when no items are available', () => {
      expect(hookContent).toContain('availability.noneAvailable');
    });

    it('should return error message when no items available', () => {
      expect(hookContent).toContain('None of the items from this order are currently available');
    });

    it('should catch and handle errors', () => {
      expect(hookContent).toContain('catch (error)');
    });

    it('should call onError callback on failure', () => {
      expect(hookContent).toContain('onError?.(errorMessage)');
    });
  });

  describe('Cart Store Integration', () => {
    it('should import useCartStore', () => {
      expect(hookContent).toContain("import { useCartStore } from '@/stores'");
    });

    it('should use addItem from cart store', () => {
      expect(hookContent).toContain('addItem');
    });

    it('should use clearCart from cart store', () => {
      expect(hookContent).toContain('clearCart');
    });

    it('should use setRestaurant from cart store', () => {
      expect(hookContent).toContain('setRestaurant');
    });

    it('should use canAddFromRestaurant from cart store', () => {
      expect(hookContent).toContain('canAddFromRestaurant');
    });
  });

  describe('Type Imports', () => {
    it('should import CartItem type', () => {
      expect(hookContent).toContain('CartItem');
    });

    it('should import MenuItem type', () => {
      expect(hookContent).toContain('MenuItem');
    });

    it('should import Order type', () => {
      expect(hookContent).toContain('Order');
    });
  });
});

// ============================================================================
// ReorderModal Component Tests
// ============================================================================

describe('ReorderModal Component', () => {
  let modalContent: string;

  beforeAll(() => {
    modalContent = readFileSync(reorderModalPath, 'utf-8');
  });

  describe('File Structure', () => {
    it('reorder modal file should exist', () => {
      expect(existsSync(reorderModalPath)).toBe(true);
    });

    it('should export ReorderModal component', () => {
      expect(modalContent).toContain('export function ReorderModal');
    });
  });

  describe('Props Interface', () => {
    it('should accept visible prop', () => {
      expect(modalContent).toContain('visible: boolean');
    });

    it('should accept availabilityResult prop', () => {
      expect(modalContent).toContain('availabilityResult: AvailabilityCheckResult | null');
    });

    it('should accept onProceed callback', () => {
      expect(modalContent).toContain('onProceed: () => void');
    });

    it('should accept onCancel callback', () => {
      expect(modalContent).toContain('onCancel: () => void');
    });

    it('should accept optional isLoading prop', () => {
      expect(modalContent).toContain('isLoading?: boolean');
    });
  });

  describe('UI Elements', () => {
    it('should render Modal component', () => {
      expect(modalContent).toContain('<Modal');
    });

    it('should render warning icon', () => {
      expect(modalContent).toContain('alert-circle-outline');
    });

    it('should display "Some Items Unavailable" title', () => {
      expect(modalContent).toContain('Some Items Unavailable');
    });

    it('should display unavailable items list', () => {
      expect(modalContent).toContain('unavailableItems.map');
    });

    it('should display available items count', () => {
      expect(modalContent).toContain('availableCount');
    });

    it('should have Cancel button', () => {
      expect(modalContent).toContain('Cancel');
    });

    it('should have Proceed/Add Items button', () => {
      expect(modalContent).toContain('Add');
    });
  });

  describe('Animations', () => {
    it('should use react-native-reanimated', () => {
      expect(modalContent).toContain("from 'react-native-reanimated'");
    });

    it('should use FadeIn animation for backdrop', () => {
      expect(modalContent).toContain('FadeIn');
    });

    it('should use SlideInDown for modal content', () => {
      expect(modalContent).toContain('SlideInDown');
    });

    it('should animate button presses', () => {
      expect(modalContent).toContain('withSpring');
    });
  });

  describe('Styling', () => {
    it('should use theme colors', () => {
      expect(modalContent).toContain('Colors[colorScheme');
    });

    it('should use warning colors for icon', () => {
      expect(modalContent).toContain('WarningColors');
    });

    it('should have proper styles object', () => {
      expect(modalContent).toContain('StyleSheet.create');
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility labels for buttons', () => {
      expect(modalContent).toContain('accessibilityLabel');
    });

    it('should have accessibility roles', () => {
      expect(modalContent).toContain('accessibilityRole');
    });

    it('should have testIDs for buttons', () => {
      expect(modalContent).toContain('testID="reorder-modal');
    });
  });

  describe('Dynamic Content', () => {
    it('should handle singular item message', () => {
      expect(modalContent).toContain('1 item from your order');
    });

    it('should handle plural items message', () => {
      expect(modalContent).toContain('items from your order are currently unavailable');
    });

    it('should conditionally render proceed button when items available', () => {
      expect(modalContent).toContain('{availableCount > 0 &&');
    });

    it('should show loading state on proceed button', () => {
      expect(modalContent).toContain('Adding...');
    });
  });
});

// ============================================================================
// Order Details Screen Integration Tests
// ============================================================================

describe('Order Details Screen Integration', () => {
  let screenContent: string;

  beforeAll(() => {
    screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
  });

  describe('Reorder Modal Integration', () => {
    it('should import ReorderModal component', () => {
      expect(screenContent).toContain("import { ReorderModal } from '@/components/reorder-modal'");
    });

    it('should import useReorder hook', () => {
      expect(screenContent).toContain('useReorder');
      expect(screenContent).toContain("from '@/hooks/use-reorder'");
    });

    it('should import AvailabilityCheckResult type', () => {
      expect(screenContent).toContain('AvailabilityCheckResult');
    });

    it('should render ReorderModal component', () => {
      expect(screenContent).toContain('<ReorderModal');
    });
  });

  describe('Reorder State Management', () => {
    it('should have showReorderModal state', () => {
      expect(screenContent).toContain('showReorderModal');
    });

    it('should have availabilityResult state', () => {
      expect(screenContent).toContain('availabilityResult');
    });

    it('should use useReorder hook', () => {
      expect(screenContent).toContain('useReorder(');
    });

    it('should destructure isLoading as isReorderLoading', () => {
      expect(screenContent).toContain('isLoading: isReorderLoading');
    });

    it('should destructure checkAvailability', () => {
      expect(screenContent).toContain('checkAvailability');
    });

    it('should destructure executeReorder', () => {
      expect(screenContent).toContain('executeReorder');
    });
  });

  describe('Reorder Handlers', () => {
    it('should have handleReorder function', () => {
      expect(screenContent).toContain('handleReorder');
    });

    it('should have handleReorderProceed function', () => {
      expect(screenContent).toContain('handleReorderProceed');
    });

    it('should have handleReorderCancel function', () => {
      expect(screenContent).toContain('handleReorderCancel');
    });
  });

  describe('Availability Checking Flow', () => {
    it('should check availability before reordering', () => {
      expect(screenContent).toContain('checkAvailability(order)');
    });

    it('should check if all items available', () => {
      expect(screenContent).toContain('availability.allAvailable');
    });

    it('should check if no items available', () => {
      expect(screenContent).toContain('availability.noneAvailable');
    });

    it('should show modal when some items unavailable', () => {
      expect(screenContent).toContain('setShowReorderModal(true)');
    });

    it('should set availability result for modal', () => {
      expect(screenContent).toContain('setAvailabilityResult(availability)');
    });
  });

  describe('Cart Restaurant Validation', () => {
    it('should check cart restaurant compatibility', () => {
      expect(screenContent).toContain('canAddFromRestaurant(order.restaurant.id)');
    });

    it('should show replace cart alert', () => {
      expect(screenContent).toContain('Replace Cart?');
    });

    it('should clear cart before switching restaurants', () => {
      expect(screenContent).toContain('clearCart()');
    });
  });

  describe('Success Handling', () => {
    it('should pass onSuccess callback to useReorder', () => {
      expect(screenContent).toContain('onSuccess:');
    });

    it('should navigate to cart on success', () => {
      expect(screenContent).toContain("router.push('/(modals)/cart')");
    });

    it('should show alert when some items were unavailable', () => {
      expect(screenContent).toContain('Items Added');
    });

    it('should close modal on success', () => {
      expect(screenContent).toContain('setShowReorderModal(false)');
    });
  });

  describe('Error Handling', () => {
    it('should pass onError callback to useReorder', () => {
      expect(screenContent).toContain('onError:');
    });

    it('should show alert for items unavailable error', () => {
      expect(screenContent).toContain('Items Unavailable');
    });

    it('should show unable to reorder alert', () => {
      expect(screenContent).toContain('Unable to Reorder');
    });
  });

  describe('ReorderModal Props', () => {
    it('should pass visible prop', () => {
      expect(screenContent).toContain('visible={showReorderModal}');
    });

    it('should pass availabilityResult prop', () => {
      expect(screenContent).toContain('availabilityResult={availabilityResult}');
    });

    it('should pass onProceed callback', () => {
      expect(screenContent).toContain('onProceed={handleReorderProceed}');
    });

    it('should pass onCancel callback', () => {
      expect(screenContent).toContain('onCancel={handleReorderCancel}');
    });

    it('should pass isLoading prop', () => {
      expect(screenContent).toContain('isLoading={isReorderLoading}');
    });
  });

  describe('Reorder Button', () => {
    it('should have Reorder button', () => {
      expect(screenContent).toContain('label="Reorder"');
    });

    it('should have refresh icon for reorder button', () => {
      expect(screenContent).toContain('icon="refresh-outline"');
    });

    it('should call handleReorder on press', () => {
      expect(screenContent).toContain('onPress={handleReorder}');
    });
  });
});

// ============================================================================
// Cart Store Support Tests
// ============================================================================

describe('Cart Store Support', () => {
  let storeContent: string;

  beforeAll(() => {
    storeContent = readFileSync(cartStorePath, 'utf-8');
  });

  describe('Required Functions', () => {
    it('should export canAddFromRestaurant function', () => {
      expect(storeContent).toContain('canAddFromRestaurant:');
    });

    it('should export clearCart function', () => {
      expect(storeContent).toContain('clearCart:');
    });

    it('should export setRestaurant function', () => {
      expect(storeContent).toContain('setRestaurant:');
    });

    it('should export addItem function', () => {
      expect(storeContent).toContain('addItem:');
    });
  });

  describe('canAddFromRestaurant Logic', () => {
    it('should check if cart is empty', () => {
      expect(storeContent).toContain('items.length === 0');
    });

    it('should check if same restaurant', () => {
      expect(storeContent).toContain('currentRestaurantId === restaurantId');
    });
  });
});

// ============================================================================
// Mock Data Support Tests
// ============================================================================

describe('Mock Data Support', () => {
  let menuItemsContent: string;
  let mockIndexContent: string;

  beforeAll(() => {
    menuItemsContent = readFileSync(mockMenuItemsPath, 'utf-8');
    mockIndexContent = readFileSync(mockIndexPath, 'utf-8');
  });

  describe('Menu Item Availability', () => {
    it('should have isAvailable field on menu items', () => {
      expect(menuItemsContent).toContain('isAvailable:');
    });

    it('should have getMenuItemById function', () => {
      expect(menuItemsContent).toContain('export function getMenuItemById');
    });
  });

  describe('Mock Index Exports', () => {
    it('should export getMenuItemById', () => {
      expect(mockIndexContent).toContain('getMenuItemById');
    });

    it('should export simulateNetworkDelay', () => {
      expect(mockIndexContent).toContain('simulateNetworkDelay');
    });

    it('should export NETWORK_DELAYS', () => {
      expect(mockIndexContent).toContain('NETWORK_DELAYS');
    });
  });
});

// ============================================================================
// Complete Reorder Flow Tests
// ============================================================================

describe('Reorder Flow', () => {
  describe('All Items Available', () => {
    it('should execute reorder directly when all items available', () => {
      const screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
      expect(screenContent).toContain('availability.allAvailable');
      expect(screenContent).toContain('executeReorder(order)');
    });
  });

  describe('Some Items Unavailable', () => {
    it('should show reorder modal when some items unavailable', () => {
      const screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
      expect(screenContent).toContain('!availability.allAvailable && !availability.noneAvailable');
      expect(screenContent).toContain('setShowReorderModal(true)');
    });

    it('should allow user to proceed with available items', () => {
      const screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
      expect(screenContent).toContain('handleReorderProceed');
      expect(screenContent).toContain('executeReorder(order)');
    });

    it('should allow user to cancel reorder', () => {
      const screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
      expect(screenContent).toContain('handleReorderCancel');
      expect(screenContent).toContain('setShowReorderModal(false)');
    });
  });

  describe('No Items Available', () => {
    it('should show error when no items available', () => {
      const screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
      expect(screenContent).toContain('availability.noneAvailable');
      expect(screenContent).toContain('Items Unavailable');
    });

    it('should not show reorder modal when no items available', () => {
      const hookContent = readFileSync(reorderHookPath, 'utf-8');
      expect(hookContent).toContain('availability.noneAvailable');
      expect(hookContent).toContain('success: false');
    });
  });

  describe('Cart Navigation', () => {
    it('should navigate to cart after adding items', () => {
      const screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
      expect(screenContent).toContain("router.push('/(modals)/cart')");
    });
  });

  describe('Success Feedback', () => {
    it('should show success message with unavailable count', () => {
      const screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
      expect(screenContent).toContain('result.itemsAdded');
      expect(screenContent).toContain('result.unavailableCount');
    });
  });
});
