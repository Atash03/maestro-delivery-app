/**
 * Mock data exports for Maestro Food Delivery App
 *
 * This module provides comprehensive mock data for development and testing.
 * All mock data includes helper functions for common operations and
 * async functions that simulate network delays for realistic UX testing.
 */

export type { DietaryFilter, FeaturedCollection, SortOption } from './categories';
// ============================================================================
// Categories & Filters
// ============================================================================
export {
  fetchCategories,
  fetchFeaturedCollections,
  getCategoryById,
  getCategoryByName,
  getDietaryFilterById,
  getFeaturedCollectionById,
  getPopularCategories,
  getSortOptionById,
  mockCategories,
  mockDietaryFilters,
  mockFeaturedCollections,
  mockSortOptions,
  searchCategories,
} from './categories';
// ============================================================================
// Menu Items
// ============================================================================
export {
  fetchMenuItems,
  getMenuByCategory,
  getMenuItemById,
  getMenuItemsByRestaurant,
  getPopularItems,
  mockMenuItems,
  searchMenuItems,
} from './menu-items';
// ============================================================================
// Orders
// ============================================================================
export {
  fetchOrderById,
  fetchOrders,
  getActiveOrders,
  getEstimatedTimeRemaining,
  getNextOrderStatus,
  getOrderById,
  getOrderStatusText,
  getOrdersByStatus,
  getOrdersByUser,
  getPastOrders,
  mockOrders,
  orderStatusSequence,
  simulateOrderStatusUpdate,
} from './orders';
// ============================================================================
// Promo Codes
// ============================================================================
export type { PromoValidationResult } from './promo-codes';
export {
  calculateDiscount,
  formatPromoCodeDescription,
  getPromoCodeByCode,
  getValidPromoCodes,
  mockPromoCodes,
  validatePromoCode,
  validatePromoCodeAsync,
} from './promo-codes';
// ============================================================================
// Restaurants
// ============================================================================
export {
  fetchRestaurantById,
  fetchRestaurants,
  getOpenRestaurants,
  getRestaurantById,
  getRestaurantsByCuisine,
  mockRestaurants,
  searchRestaurantsByName,
} from './restaurants';
// ============================================================================
// Reviews
// ============================================================================
export {
  fetchRecentReviews,
  fetchReviewsByRestaurantId,
  formatReviewDate,
  getAverageRating,
  getRatingDistribution,
  getRecentReviews,
  getReviewById,
  getReviewsByRestaurantId,
  getReviewsByUserId,
  mockReviews,
} from './reviews';
// ============================================================================
// Users, Drivers & Payment Methods
// ============================================================================
export {
  authenticateUser,
  defaultUser,
  fetchUser,
  getDefaultPaymentMethod,
  getDriverById,
  getPaymentMethodById,
  getRandomDriver,
  getUserByEmail,
  getUserById,
  mockAddresses,
  mockDrivers,
  mockPaymentMethods,
  mockUsers,
  simulateDriverMovement,
} from './users';

// ============================================================================
// Network Delay Utilities
// ============================================================================

/**
 * Default delay ranges for simulating network latency
 */
export const NETWORK_DELAYS = {
  /** Fast operations (200-400ms) */
  FAST: { min: 200, max: 400 },
  /** Normal operations (300-800ms) */
  NORMAL: { min: 300, max: 800 },
  /** Slow operations (500-1500ms) */
  SLOW: { min: 500, max: 1500 },
} as const;

/**
 * Get a random delay within a range
 */
export function getRandomDelay(
  range: { min: number; max: number } = NETWORK_DELAYS.NORMAL
): number {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Simulate a network delay
 */
export async function simulateNetworkDelay(
  range: { min: number; max: number } = NETWORK_DELAYS.NORMAL
): Promise<void> {
  const delay = getRandomDelay(range);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Wrap a function with simulated network delay
 */
export async function withNetworkDelay<T>(
  fn: () => T,
  range: { min: number; max: number } = NETWORK_DELAYS.NORMAL
): Promise<T> {
  await simulateNetworkDelay(range);
  return fn();
}
