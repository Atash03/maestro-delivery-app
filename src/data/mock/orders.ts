/**
 * Mock order data for Maestro Food Delivery App
 */

import type { CartItem, Order } from '@/types';
import { OrderStatus } from '@/types';
import { mockMenuItems } from './menu-items';
import { mockRestaurants } from './restaurants';
import { mockDrivers, mockPaymentMethods, mockUsers } from './users';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a cart item from a menu item
 */
function createCartItem(
  menuItemId: string,
  quantity: number,
  specialInstructions?: string
): CartItem | null {
  const menuItem = mockMenuItems.find((item) => item.id === menuItemId);
  if (!menuItem) return null;

  return {
    id: `cart-${menuItemId}-${Date.now()}`,
    menuItem,
    quantity,
    selectedCustomizations: [],
    specialInstructions,
    totalPrice: menuItem.price * quantity,
  };
}

/**
 * Calculate order totals
 */
function calculateOrderTotals(
  items: CartItem[],
  deliveryFee: number
): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + tax + deliveryFee;
  return { subtotal, tax, total };
}

// ============================================================================
// Mock Orders
// ============================================================================

const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

// Get references
const user = mockUsers[0];
const defaultAddress = user.addresses[0];
const defaultPayment = mockPaymentMethods[0];

// Create cart items for orders
const bellaItaliaItems: CartItem[] = [
  createCartItem('menu-001-01', 1),
  createCartItem('menu-001-02', 1),
  createCartItem('menu-001-05', 2),
].filter((item): item is CartItem => item !== null);

const tokyoRamenItems: CartItem[] = [
  createCartItem('menu-002-01', 2),
  createCartItem('menu-002-04', 1),
].filter((item): item is CartItem => item !== null);

const burgerBarnItems: CartItem[] = [
  createCartItem('menu-003-01', 2),
  createCartItem('menu-003-05', 1),
  createCartItem('menu-003-07', 2),
].filter((item): item is CartItem => item !== null);

const tacoLocoItems: CartItem[] = [
  createCartItem('menu-006-01', 3),
  createCartItem('menu-006-02', 1),
].filter((item): item is CartItem => item !== null);

const sushiMasterItems: CartItem[] = [
  createCartItem('menu-005-01', 1),
  createCartItem('menu-005-02', 1),
  createCartItem('menu-005-06', 1),
].filter((item): item is CartItem => item !== null);

const spiceGardenItems: CartItem[] = [
  createCartItem('menu-004-01', 1),
  createCartItem('menu-004-05', 2),
  createCartItem('menu-004-06', 2),
].filter((item): item is CartItem => item !== null);

export const mockOrders: Order[] = [
  // Active Orders
  {
    id: 'order-001',
    userId: user.id,
    restaurant: mockRestaurants[0], // Bella Italia
    items: bellaItaliaItems,
    status: OrderStatus.ON_THE_WAY,
    createdAt: oneHourAgo,
    updatedAt: new Date(now.getTime() - 10 * 60 * 1000),
    estimatedDelivery: new Date(now.getTime() + 15 * 60 * 1000),
    address: defaultAddress,
    paymentMethod: defaultPayment,
    ...calculateOrderTotals(bellaItaliaItems, 2.99),
    deliveryFee: 2.99,
    driver: mockDrivers[0],
    specialInstructions: 'Please ring doorbell',
  },
  {
    id: 'order-002',
    userId: user.id,
    restaurant: mockRestaurants[1], // Tokyo Ramen House
    items: tokyoRamenItems,
    status: OrderStatus.PREPARING,
    createdAt: new Date(now.getTime() - 25 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 15 * 60 * 1000),
    estimatedDelivery: new Date(now.getTime() + 25 * 60 * 1000),
    address: defaultAddress,
    paymentMethod: defaultPayment,
    ...calculateOrderTotals(tokyoRamenItems, 1.99),
    deliveryFee: 1.99,
  },
  {
    id: 'order-003',
    userId: user.id,
    restaurant: mockRestaurants[2], // Burger Barn
    items: burgerBarnItems,
    status: OrderStatus.CONFIRMED,
    createdAt: new Date(now.getTime() - 5 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 3 * 60 * 1000),
    estimatedDelivery: new Date(now.getTime() + 35 * 60 * 1000),
    address: user.addresses[1], // Work address
    paymentMethod: defaultPayment,
    ...calculateOrderTotals(burgerBarnItems, 0.99),
    deliveryFee: 0.99,
  },

  // Past Orders - Delivered
  {
    id: 'order-004',
    userId: user.id,
    restaurant: mockRestaurants[5], // Taco Loco
    items: tacoLocoItems,
    status: OrderStatus.DELIVERED,
    createdAt: oneDayAgo,
    updatedAt: new Date(oneDayAgo.getTime() + 45 * 60 * 1000),
    estimatedDelivery: new Date(oneDayAgo.getTime() + 40 * 60 * 1000),
    actualDelivery: new Date(oneDayAgo.getTime() + 38 * 60 * 1000),
    address: defaultAddress,
    paymentMethod: defaultPayment,
    ...calculateOrderTotals(tacoLocoItems, 1.49),
    deliveryFee: 1.49,
    driver: mockDrivers[1],
    tip: 5.0,
  },
  {
    id: 'order-005',
    userId: user.id,
    restaurant: mockRestaurants[4], // Sushi Master
    items: sushiMasterItems,
    status: OrderStatus.DELIVERED,
    createdAt: twoDaysAgo,
    updatedAt: new Date(twoDaysAgo.getTime() + 55 * 60 * 1000),
    estimatedDelivery: new Date(twoDaysAgo.getTime() + 50 * 60 * 1000),
    actualDelivery: new Date(twoDaysAgo.getTime() + 52 * 60 * 1000),
    address: defaultAddress,
    paymentMethod: mockPaymentMethods[1],
    ...calculateOrderTotals(sushiMasterItems, 3.99),
    deliveryFee: 3.99,
    driver: mockDrivers[2],
    tip: 8.0,
  },
  {
    id: 'order-006',
    userId: user.id,
    restaurant: mockRestaurants[3], // Spice Garden
    items: spiceGardenItems,
    status: OrderStatus.DELIVERED,
    createdAt: oneWeekAgo,
    updatedAt: new Date(oneWeekAgo.getTime() + 50 * 60 * 1000),
    estimatedDelivery: new Date(oneWeekAgo.getTime() + 45 * 60 * 1000),
    actualDelivery: new Date(oneWeekAgo.getTime() + 48 * 60 * 1000),
    address: defaultAddress,
    paymentMethod: defaultPayment,
    ...calculateOrderTotals(spiceGardenItems, 2.49),
    deliveryFee: 2.49,
    driver: mockDrivers[3],
    tip: 4.0,
    promoCode: 'SPICY20',
    discount: 5.0,
  },
  {
    id: 'order-007',
    userId: user.id,
    restaurant: mockRestaurants[0], // Bella Italia (repeat order)
    items: [createCartItem('menu-001-01', 2)].filter((item): item is CartItem => item !== null),
    status: OrderStatus.DELIVERED,
    createdAt: twoWeeksAgo,
    updatedAt: new Date(twoWeeksAgo.getTime() + 35 * 60 * 1000),
    estimatedDelivery: new Date(twoWeeksAgo.getTime() + 35 * 60 * 1000),
    actualDelivery: new Date(twoWeeksAgo.getTime() + 33 * 60 * 1000),
    address: defaultAddress,
    paymentMethod: defaultPayment,
    ...calculateOrderTotals(
      [createCartItem('menu-001-01', 2)].filter((item): item is CartItem => item !== null),
      2.99
    ),
    deliveryFee: 2.99,
    driver: mockDrivers[4],
  },

  // Cancelled Order
  {
    id: 'order-008',
    userId: user.id,
    restaurant: mockRestaurants[6], // Dragon Palace
    items: [createCartItem('menu-007-01', 1), createCartItem('menu-007-03', 1)].filter(
      (item): item is CartItem => item !== null
    ),
    status: OrderStatus.CANCELLED,
    createdAt: new Date(oneWeekAgo.getTime() + 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(oneWeekAgo.getTime() + 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
    estimatedDelivery: new Date(oneWeekAgo.getTime() + 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    address: defaultAddress,
    paymentMethod: defaultPayment,
    ...calculateOrderTotals(
      [createCartItem('menu-007-01', 1), createCartItem('menu-007-03', 1)].filter(
        (item): item is CartItem => item !== null
      ),
      1.99
    ),
    deliveryFee: 1.99,
  },
];

// ============================================================================
// Order Data Access Functions
// ============================================================================

/**
 * Get all orders for a user
 */
export function getOrdersByUser(userId: string): Order[] {
  return mockOrders.filter((order) => order.userId === userId);
}

/**
 * Get an order by ID
 */
export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((order) => order.id === id);
}

/**
 * Get active orders (not delivered or cancelled)
 */
export function getActiveOrders(userId: string): Order[] {
  return mockOrders.filter(
    (order) =>
      order.userId === userId &&
      order.status !== OrderStatus.DELIVERED &&
      order.status !== OrderStatus.CANCELLED
  );
}

/**
 * Get past orders (delivered or cancelled)
 */
export function getPastOrders(userId: string): Order[] {
  return mockOrders.filter(
    (order) =>
      order.userId === userId &&
      (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED)
  );
}

/**
 * Get orders by status
 */
export function getOrdersByStatus(userId: string, status: OrderStatus): Order[] {
  return mockOrders.filter((order) => order.userId === userId && order.status === status);
}

/**
 * Simulates fetching orders with network delay
 */
export async function fetchOrders(userId: string, delayMs: number = 500): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getOrdersByUser(userId)), delayMs);
  });
}

/**
 * Simulates fetching a single order with network delay
 */
export async function fetchOrderById(
  id: string,
  delayMs: number = 300
): Promise<Order | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getOrderById(id)), delayMs);
  });
}

// ============================================================================
// Order Status Simulation
// ============================================================================

/**
 * Order status progression sequence
 */
export const orderStatusSequence: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.PICKED_UP,
  OrderStatus.ON_THE_WAY,
  OrderStatus.DELIVERED,
];

/**
 * Get next order status
 */
export function getNextOrderStatus(currentStatus: OrderStatus): OrderStatus | null {
  const currentIndex = orderStatusSequence.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === orderStatusSequence.length - 1) {
    return null;
  }
  return orderStatusSequence[currentIndex + 1];
}

/**
 * Get status display text
 */
export function getOrderStatusText(status: OrderStatus): string {
  const statusTexts: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Order Placed',
    [OrderStatus.CONFIRMED]: 'Restaurant Confirmed',
    [OrderStatus.PREPARING]: 'Preparing Your Order',
    [OrderStatus.READY]: 'Ready for Pickup',
    [OrderStatus.PICKED_UP]: 'Driver Picked Up',
    [OrderStatus.ON_THE_WAY]: 'On The Way',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled',
  };
  return statusTexts[status];
}

/**
 * Get estimated time remaining based on status
 */
export function getEstimatedTimeRemaining(order: Order): number {
  const now = new Date();
  const estimatedDelivery = new Date(order.estimatedDelivery);
  const diffMs = estimatedDelivery.getTime() - now.getTime();
  return Math.max(0, Math.round(diffMs / (60 * 1000))); // minutes
}

/**
 * Simulate order status updates (for testing real-time tracking)
 */
export function simulateOrderStatusUpdate(order: Order, intervalMs: number = 5000): () => void {
  let currentOrder = { ...order };

  const intervalId = setInterval(() => {
    const nextStatus = getNextOrderStatus(currentOrder.status);
    if (nextStatus) {
      currentOrder = {
        ...currentOrder,
        status: nextStatus,
        updatedAt: new Date(),
      };
      // Could dispatch event or callback here
    } else {
      clearInterval(intervalId);
    }
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(intervalId);
}
