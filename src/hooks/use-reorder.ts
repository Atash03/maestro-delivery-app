/**
 * useReorder Hook
 *
 * Handles the reorder functionality for past orders.
 * Features:
 * - Checks item availability (mock) before reordering
 * - Shows unavailable items warning
 * - Adds only available items to cart
 * - Handles cart restaurant validation
 * - Navigates to cart for checkout
 */

import { useCallback, useState } from 'react';

import { getMenuItemById, NETWORK_DELAYS, simulateNetworkDelay } from '@/data/mock';
import { useCartStore } from '@/stores';
import type { CartItem, MenuItem, Order } from '@/types';

/**
 * Result of checking item availability
 */
export interface AvailabilityCheckResult {
  /** Items that are available and can be reordered */
  availableItems: CartItem[];
  /** Items that are no longer available */
  unavailableItems: CartItem[];
  /** Whether all items are available */
  allAvailable: boolean;
  /** Whether no items are available */
  noneAvailable: boolean;
}

/**
 * Reorder result
 */
export interface ReorderResult {
  /** Whether the reorder was successful */
  success: boolean;
  /** Number of items added to cart */
  itemsAdded: number;
  /** Number of items that were unavailable */
  unavailableCount: number;
  /** Error message if reorder failed */
  error?: string;
}

interface UseReorderOptions {
  /** Callback when items are added to cart */
  onSuccess?: (result: ReorderResult) => void;
  /** Callback when there are unavailable items */
  onUnavailableItems?: (result: AvailabilityCheckResult) => void;
  /** Callback for errors */
  onError?: (error: string) => void;
}

interface UseReorderReturn {
  /** Whether an availability check or reorder is in progress */
  isLoading: boolean;
  /** Check availability of order items */
  checkAvailability: (order: Order) => Promise<AvailabilityCheckResult>;
  /** Execute the reorder (add items to cart) */
  executeReorder: (order: Order, includeUnavailable?: boolean) => Promise<ReorderResult>;
  /** Check item availability by menu item ID */
  isItemAvailable: (menuItemId: string) => boolean;
}

/**
 * Mock function to check if a menu item is currently available
 * In a real app, this would call the backend API
 */
function checkMenuItemAvailability(menuItemId: string): boolean {
  const menuItem = getMenuItemById(menuItemId);
  if (!menuItem) {
    return false;
  }

  // Use the isAvailable field from the menu item
  // In mock data, we can also simulate random unavailability for testing
  return menuItem.isAvailable;
}

/**
 * Mock function to get the latest version of a menu item
 * This simulates fetching updated item data (price changes, etc.)
 */
function getLatestMenuItem(menuItemId: string): MenuItem | undefined {
  return getMenuItemById(menuItemId);
}

/**
 * Hook for handling reorder functionality
 */
export function useReorder(options: UseReorderOptions = {}): UseReorderReturn {
  const { onSuccess, onUnavailableItems, onError } = options;

  const [isLoading, setIsLoading] = useState(false);

  const { addItem, clearCart, setRestaurant, canAddFromRestaurant, restaurant } = useCartStore();

  /**
   * Check if a specific menu item is available
   */
  const isItemAvailable = useCallback((menuItemId: string): boolean => {
    return checkMenuItemAvailability(menuItemId);
  }, []);

  /**
   * Check availability of all items in an order
   */
  const checkAvailability = useCallback(
    async (order: Order): Promise<AvailabilityCheckResult> => {
      setIsLoading(true);

      try {
        // Simulate network delay for checking availability
        await simulateNetworkDelay(NETWORK_DELAYS.FAST);

        const availableItems: CartItem[] = [];
        const unavailableItems: CartItem[] = [];

        for (const item of order.items) {
          // Check if the menu item is still available
          const latestMenuItem = getLatestMenuItem(item.menuItem.id);

          if (latestMenuItem?.isAvailable) {
            // Item is available - use the latest menu item data in case prices changed
            availableItems.push({
              ...item,
              menuItem: latestMenuItem,
            });
          } else {
            // Item is unavailable
            unavailableItems.push(item);
          }
        }

        const result: AvailabilityCheckResult = {
          availableItems,
          unavailableItems,
          allAvailable: unavailableItems.length === 0,
          noneAvailable: availableItems.length === 0,
        };

        // Notify about unavailable items
        if (unavailableItems.length > 0 && onUnavailableItems) {
          onUnavailableItems(result);
        }

        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [onUnavailableItems]
  );

  /**
   * Execute the reorder - add available items to cart
   */
  const executeReorder = useCallback(
    async (order: Order, includeUnavailable: boolean = false): Promise<ReorderResult> => {
      setIsLoading(true);

      try {
        // First check availability
        const availability = await checkAvailability(order);

        // If no items are available, return error
        if (availability.noneAvailable) {
          const error = 'None of the items from this order are currently available.';
          onError?.(error);
          return {
            success: false,
            itemsAdded: 0,
            unavailableCount: availability.unavailableItems.length,
            error,
          };
        }

        // Determine which items to add
        const itemsToAdd = includeUnavailable
          ? order.items.filter((item) => {
              const latest = getLatestMenuItem(item.menuItem.id);
              return latest?.isAvailable;
            })
          : availability.availableItems;

        // Check if cart has items from a different restaurant
        // The calling component should handle the restaurant switch confirmation
        if (!canAddFromRestaurant(order.restaurant.id)) {
          // Clear existing cart if switching restaurants
          clearCart();
        }

        // Set the restaurant if not already set
        if (!restaurant || restaurant.id !== order.restaurant.id) {
          setRestaurant(order.restaurant);
        }

        // Add each available item to the cart
        for (const item of itemsToAdd) {
          addItem(
            item.menuItem,
            item.quantity,
            item.selectedCustomizations,
            item.specialInstructions
          );
        }

        const result: ReorderResult = {
          success: true,
          itemsAdded: itemsToAdd.length,
          unavailableCount: availability.unavailableItems.length,
        };

        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to reorder';
        onError?.(errorMessage);
        return {
          success: false,
          itemsAdded: 0,
          unavailableCount: 0,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [
      checkAvailability,
      canAddFromRestaurant,
      clearCart,
      setRestaurant,
      restaurant,
      addItem,
      onSuccess,
      onError,
    ]
  );

  return {
    isLoading,
    checkAvailability,
    executeReorder,
    isItemAvailable,
  };
}
