import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CartItem, MenuItem, Restaurant, SelectedCustomization } from '@/types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurant: Restaurant | null;
}

interface CartActions {
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
  getSubtotal: () => number;
  getItemCount: () => number;
  canAddFromRestaurant: (restaurantId: string) => boolean;
  setRestaurant: (restaurant: Restaurant) => void;
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
  items: [],
  restaurantId: null,
  restaurant: null,
};

/**
 * Calculate the total price for a cart item including customizations
 */
function calculateItemTotal(
  menuItem: MenuItem,
  quantity: number,
  selectedCustomizations: SelectedCustomization[]
): number {
  let basePrice = menuItem.price;

  // Add customization prices
  for (const customization of selectedCustomizations) {
    for (const option of customization.selectedOptions) {
      basePrice += option.price;
    }
  }

  return basePrice * quantity;
}

/**
 * Generate a unique ID for a cart item
 */
function generateCartItemId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (
        menuItem: MenuItem,
        quantity: number,
        selectedCustomizations: SelectedCustomization[],
        specialInstructions?: string,
        restaurant?: Restaurant
      ) => {
        const { restaurantId } = get();

        // If adding from a different restaurant, we need to clear the cart first
        // The UI should handle the confirmation dialog before calling this
        if (restaurantId && restaurantId !== menuItem.restaurantId) {
          // Clear existing items since we're switching restaurants
          set({
            items: [],
            restaurantId: menuItem.restaurantId,
            restaurant: restaurant || null,
          });
        }

        const totalPrice = calculateItemTotal(menuItem, quantity, selectedCustomizations);

        const newItem: CartItem = {
          id: generateCartItemId(),
          menuItem,
          quantity,
          selectedCustomizations,
          specialInstructions,
          totalPrice,
        };

        set((state) => ({
          items: [...state.items, newItem],
          restaurantId: menuItem.restaurantId,
          restaurant: restaurant || state.restaurant,
        }));
      },

      removeItem: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== cartItemId);

          // Clear restaurant info if cart is empty
          if (newItems.length === 0) {
            return {
              items: [],
              restaurantId: null,
              restaurant: null,
            };
          }

          return { items: newItems };
        });
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === cartItemId) {
              const totalPrice = calculateItemTotal(
                item.menuItem,
                quantity,
                item.selectedCustomizations
              );
              return { ...item, quantity, totalPrice };
            }
            return item;
          }),
        }));
      },

      updateItem: (cartItemId, updates) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === cartItemId) {
              const newQuantity = updates.quantity ?? item.quantity;
              const newCustomizations =
                updates.selectedCustomizations ?? item.selectedCustomizations;
              const totalPrice = calculateItemTotal(item.menuItem, newQuantity, newCustomizations);

              return {
                ...item,
                quantity: newQuantity,
                selectedCustomizations: newCustomizations,
                specialInstructions: updates.specialInstructions ?? item.specialInstructions,
                totalPrice,
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set(initialState);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.totalPrice, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      canAddFromRestaurant: (restaurantId: string) => {
        const { restaurantId: currentRestaurantId, items } = get();
        // Can add if cart is empty or same restaurant
        return items.length === 0 || currentRestaurantId === restaurantId;
      },

      setRestaurant: (restaurant: Restaurant) => {
        set({ restaurant, restaurantId: restaurant.id });
      },
    }),
    {
      name: 'maestro-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
