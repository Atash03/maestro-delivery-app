import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Coordinates, Driver, Order, OrderStatus } from '@/types';

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  isLoading: boolean;
}

interface OrderActions {
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDriver: (orderId: string, driver: Driver) => void;
  updateDriverLocation: (orderId: string, location: Coordinates) => void;
  updateEstimatedDelivery: (orderId: string, estimatedDelivery: Date) => void;
  completeOrder: (orderId: string, actualDelivery?: Date) => void;
  cancelOrder: (orderId: string) => void;
  fetchOrderHistory: () => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getActiveOrders: () => Order[];
  getPastOrders: () => Order[];
  clearCurrentOrder: () => void;
  setLoading: (isLoading: boolean) => void;
}

type OrderStore = OrderState & OrderActions;

const initialState: OrderState = {
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
};

// Order statuses that indicate an active (in-progress) order
const ACTIVE_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'PICKED_UP',
  'ON_THE_WAY',
];

// Order statuses that indicate a completed order
const COMPLETED_STATUSES: OrderStatus[] = ['DELIVERED', 'CANCELLED'];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      createOrder: (order: Order) => {
        set((state) => ({
          currentOrder: order,
          orderHistory: [order, ...state.orderHistory],
          isLoading: false,
        }));
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => {
          const updatedAt = new Date();

          // Update current order if it matches
          let currentOrder = state.currentOrder;
          if (currentOrder?.id === orderId) {
            currentOrder = { ...currentOrder, status, updatedAt };
          }

          // Update order in history
          const orderHistory = state.orderHistory.map((order) => {
            if (order.id === orderId) {
              return { ...order, status, updatedAt };
            }
            return order;
          });

          return { currentOrder, orderHistory };
        });
      },

      assignDriver: (orderId: string, driver: Driver) => {
        set((state) => {
          const updatedAt = new Date();

          let currentOrder = state.currentOrder;
          if (currentOrder?.id === orderId) {
            currentOrder = { ...currentOrder, driver, updatedAt };
          }

          const orderHistory = state.orderHistory.map((order) => {
            if (order.id === orderId) {
              return { ...order, driver, updatedAt };
            }
            return order;
          });

          return { currentOrder, orderHistory };
        });
      },

      updateDriverLocation: (orderId: string, location: Coordinates) => {
        set((state) => {
          let currentOrder = state.currentOrder;
          if (currentOrder?.id === orderId && currentOrder.driver) {
            currentOrder = {
              ...currentOrder,
              driver: { ...currentOrder.driver, currentLocation: location },
            };
          }

          const orderHistory = state.orderHistory.map((order) => {
            if (order.id === orderId && order.driver) {
              return {
                ...order,
                driver: { ...order.driver, currentLocation: location },
              };
            }
            return order;
          });

          return { currentOrder, orderHistory };
        });
      },

      updateEstimatedDelivery: (orderId: string, estimatedDelivery: Date) => {
        set((state) => {
          const updatedAt = new Date();

          let currentOrder = state.currentOrder;
          if (currentOrder?.id === orderId) {
            currentOrder = { ...currentOrder, estimatedDelivery, updatedAt };
          }

          const orderHistory = state.orderHistory.map((order) => {
            if (order.id === orderId) {
              return { ...order, estimatedDelivery, updatedAt };
            }
            return order;
          });

          return { currentOrder, orderHistory };
        });
      },

      completeOrder: (orderId: string, actualDelivery?: Date) => {
        const deliveryTime = actualDelivery || new Date();

        set((state) => {
          const updatedAt = new Date();

          let currentOrder = state.currentOrder;
          if (currentOrder?.id === orderId) {
            currentOrder = {
              ...currentOrder,
              status: 'DELIVERED' as OrderStatus,
              actualDelivery: deliveryTime,
              updatedAt,
            };
          }

          const orderHistory = state.orderHistory.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                status: 'DELIVERED' as OrderStatus,
                actualDelivery: deliveryTime,
                updatedAt,
              };
            }
            return order;
          });

          return { currentOrder, orderHistory };
        });
      },

      cancelOrder: (orderId: string) => {
        set((state) => {
          const updatedAt = new Date();

          let currentOrder = state.currentOrder;
          if (currentOrder?.id === orderId) {
            currentOrder = {
              ...currentOrder,
              status: 'CANCELLED' as OrderStatus,
              updatedAt,
            };
          }

          const orderHistory = state.orderHistory.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                status: 'CANCELLED' as OrderStatus,
                updatedAt,
              };
            }
            return order;
          });

          return { currentOrder, orderHistory };
        });
      },

      fetchOrderHistory: async () => {
        set({ isLoading: true });

        // Mock API call - in production this would fetch from backend
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For now, we just use what's already in state (persisted)
        set({ isLoading: false });
      },

      getOrderById: (orderId: string) => {
        const { currentOrder, orderHistory } = get();

        if (currentOrder?.id === orderId) {
          return currentOrder;
        }

        return orderHistory.find((order) => order.id === orderId);
      },

      getActiveOrders: () => {
        const { orderHistory } = get();
        return orderHistory.filter((order) =>
          ACTIVE_STATUSES.includes(order.status as OrderStatus)
        );
      },

      getPastOrders: () => {
        const { orderHistory } = get();
        return orderHistory.filter((order) =>
          COMPLETED_STATUSES.includes(order.status as OrderStatus)
        );
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: 'maestro-order-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentOrder: state.currentOrder,
        orderHistory: state.orderHistory,
      }),
    }
  )
);
