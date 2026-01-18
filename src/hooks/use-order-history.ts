/**
 * useOrderHistory hook
 *
 * Manages order history data including active and past orders.
 * Loads mock data and integrates with the order store.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { mockOrders } from '@/data/mock/orders';
import { useAuthStore, useOrderStore } from '@/stores';
import type { Order, OrderStatus } from '@/types';

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

export interface UseOrderHistoryResult {
  /** All orders */
  orders: Order[];
  /** Active orders (in-progress) */
  activeOrders: Order[];
  /** Past orders (delivered or cancelled) */
  pastOrders: Order[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Refresh the order list */
  refresh: () => Promise<void>;
  /** Check if user has any orders */
  hasOrders: boolean;
  /** Check if user has active orders */
  hasActiveOrders: boolean;
  /** Check if user has past orders */
  hasPastOrders: boolean;
}

export function useOrderHistory(): UseOrderHistoryResult {
  const { user } = useAuthStore();
  const { orderHistory, fetchOrderHistory, isLoading: storeLoading } = useOrderStore();
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use store orders if available, otherwise use mock data
        if (orderHistory.length > 0) {
          setLocalOrders(orderHistory);
        } else {
          // Filter mock orders for current user
          const userOrders = user
            ? mockOrders.filter((order) => order.userId === user.id)
            : mockOrders;
          setLocalOrders(userOrders);
        }
      } catch {
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user, orderHistory]);

  // Refresh handler
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchOrderHistory();

      // Simulate refresh delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local orders with store orders or mock data
      if (orderHistory.length > 0) {
        setLocalOrders(orderHistory);
      } else {
        const userOrders = user
          ? mockOrders.filter((order) => order.userId === user.id)
          : mockOrders;
        setLocalOrders(userOrders);
      }
    } catch {
      setError('Failed to refresh orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrderHistory, orderHistory, user]);

  // Filter active orders
  const activeOrders = useMemo(() => {
    return localOrders
      .filter((order) => ACTIVE_STATUSES.includes(order.status as OrderStatus))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [localOrders]);

  // Filter past orders
  const pastOrders = useMemo(() => {
    return localOrders
      .filter((order) => COMPLETED_STATUSES.includes(order.status as OrderStatus))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [localOrders]);

  // Compute derived states
  const hasOrders = localOrders.length > 0;
  const hasActiveOrders = activeOrders.length > 0;
  const hasPastOrders = pastOrders.length > 0;

  return {
    orders: localOrders,
    activeOrders,
    pastOrders,
    isLoading: isLoading || storeLoading,
    error,
    refresh,
    hasOrders,
    hasActiveOrders,
    hasPastOrders,
  };
}
