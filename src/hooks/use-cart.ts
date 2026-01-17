/**
 * useCart Hook
 *
 * A custom hook that provides cart functionality with convenience methods.
 * Wraps the cart store and provides additional utilities for:
 * - Getting formatted totals
 * - Checking restaurant compatibility
 * - Managing cart state
 */

import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { useCartStore } from '@/stores';
import type { CartItem, MenuItem, Restaurant, SelectedCustomization } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface UseCartReturn {
  // State
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  restaurant: Restaurant | null;
  restaurantId: string | null;
  isEmpty: boolean;

  // Formatted values
  formattedSubtotal: string;
  formattedItemCount: string;

  // Actions
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    selectedCustomizations: SelectedCustomization[],
    specialInstructions?: string,
    restaurant?: Restaurant
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateItem: (
    cartItemId: string,
    updates: {
      quantity?: number;
      selectedCustomizations?: SelectedCustomization[];
      specialInstructions?: string;
    }
  ) => void;
  clearCart: () => void;

  // Utility functions
  canAddFromRestaurant: (restaurantId: string) => boolean;
  addItemWithValidation: (
    menuItem: MenuItem,
    quantity: number,
    selectedCustomizations: SelectedCustomization[],
    specialInstructions?: string,
    restaurant?: Restaurant
  ) => boolean;
  getItemQuantity: (menuItemId: string) => number;
  getCartItemByMenuItemId: (menuItemId: string) => CartItem | undefined;
  getCartItemsByMenuItemId: (menuItemId: string) => CartItem[];
  findCartItem: (cartItemId: string) => CartItem | undefined;
}

// ============================================================================
// Constants
// ============================================================================

export const TAX_RATE = 0.0875; // 8.75% tax rate

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats a price as currency string
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculates tax amount
 */
export function calculateTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

/**
 * Formats item count with pluralization
 */
export function formatItemCount(count: number): string {
  if (count === 0) return 'Empty';
  if (count === 1) return '1 item';
  return `${count} items`;
}

// ============================================================================
// Hook
// ============================================================================

export function useCart(): UseCartReturn {
  // Get state and actions from store
  const items = useCartStore((state) => state.items);
  const restaurant = useCartStore((state) => state.restaurant);
  const restaurantId = useCartStore((state) => state.restaurantId);
  const storeAddItem = useCartStore((state) => state.addItem);
  const storeRemoveItem = useCartStore((state) => state.removeItem);
  const storeUpdateQuantity = useCartStore((state) => state.updateQuantity);
  const storeUpdateItem = useCartStore((state) => state.updateItem);
  const storeClearCart = useCartStore((state) => state.clearCart);
  const storeCanAddFromRestaurant = useCartStore((state) => state.canAddFromRestaurant);
  const storeGetSubtotal = useCartStore((state) => state.getSubtotal);
  const storeGetItemCount = useCartStore((state) => state.getItemCount);

  // Computed values
  const isEmpty = useMemo(() => items.length === 0, [items.length]);
  const subtotal = storeGetSubtotal();
  const itemCount = storeGetItemCount();
  const formattedSubtotal = formatPrice(subtotal);
  const formattedItemCount = formatItemCount(itemCount);

  // Get quantity of a specific menu item in cart
  const getItemQuantity = useCallback(
    (menuItemId: string): number => {
      return items
        .filter((cartItem) => cartItem.menuItem.id === menuItemId)
        .reduce((total, cartItem) => total + cartItem.quantity, 0);
    },
    [items]
  );

  // Get first cart item by menu item id (for simple items without customizations)
  const getCartItemByMenuItemId = useCallback(
    (menuItemId: string): CartItem | undefined => {
      return items.find(
        (cartItem) =>
          cartItem.menuItem.id === menuItemId && cartItem.selectedCustomizations.length === 0
      );
    },
    [items]
  );

  // Get all cart items for a menu item
  const getCartItemsByMenuItemId = useCallback(
    (menuItemId: string): CartItem[] => {
      return items.filter((cartItem) => cartItem.menuItem.id === menuItemId);
    },
    [items]
  );

  // Find a specific cart item by its ID
  const findCartItem = useCallback(
    (cartItemId: string): CartItem | undefined => {
      return items.find((item) => item.id === cartItemId);
    },
    [items]
  );

  // Add item with restaurant validation (shows alert if needed)
  const addItemWithValidation = useCallback(
    (
      menuItem: MenuItem,
      quantity: number,
      selectedCustomizations: SelectedCustomization[],
      specialInstructions?: string,
      restaurantData?: Restaurant
    ): boolean => {
      if (!restaurantData) return false;

      // Check if we can add from this restaurant
      if (!storeCanAddFromRestaurant(restaurantData.id)) {
        Alert.alert(
          'Clear Cart?',
          'You have items from another restaurant in your cart. Would you like to clear it and add this item?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear & Add',
              style: 'destructive',
              onPress: () => {
                storeClearCart();
                storeAddItem(
                  menuItem,
                  quantity,
                  selectedCustomizations,
                  specialInstructions,
                  restaurantData
                );
              },
            },
          ]
        );
        return false;
      }

      storeAddItem(menuItem, quantity, selectedCustomizations, specialInstructions, restaurantData);
      return true;
    },
    [storeCanAddFromRestaurant, storeClearCart, storeAddItem]
  );

  return {
    // State
    items,
    itemCount,
    subtotal,
    restaurant,
    restaurantId,
    isEmpty,

    // Formatted values
    formattedSubtotal,
    formattedItemCount,

    // Actions
    addItem: storeAddItem,
    removeItem: storeRemoveItem,
    updateQuantity: storeUpdateQuantity,
    updateItem: storeUpdateItem,
    clearCart: storeClearCart,

    // Utility functions
    canAddFromRestaurant: storeCanAddFromRestaurant,
    addItemWithValidation,
    getItemQuantity,
    getCartItemByMenuItemId,
    getCartItemsByMenuItemId,
    findCartItem,
  };
}

// ============================================================================
// Export Types
// ============================================================================

export type { CartItem, MenuItem, Restaurant, SelectedCustomization };
