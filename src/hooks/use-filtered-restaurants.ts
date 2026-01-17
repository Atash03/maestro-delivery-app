/**
 * useFilteredRestaurants Hook
 *
 * Custom hook for filtering and sorting restaurants based on user-selected filters.
 * Integrates with the filter store for persistence.
 *
 * Features:
 * - Applies all filter criteria to restaurant list
 * - Sorts restaurants based on selected sort option
 * - Provides active filter count
 * - Integrates with filter store for persistence
 * - Supports category filtering (from home screen)
 */

import { useMemo } from 'react';

import { type FilterState, useFilterStore } from '@/stores';
import type { DietaryOption, Restaurant, SortOption } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface UseFilteredRestaurantsOptions {
  /** The source list of restaurants to filter */
  restaurants: Restaurant[];
  /** Optional category filter (e.g., from cuisine selection) */
  categoryFilter?: string | null;
  /** Override filters instead of using store (useful for local filter state) */
  localFilters?: FilterState;
}

export interface UseFilteredRestaurantsReturn {
  /** Filtered and sorted restaurants */
  filteredRestaurants: Restaurant[];
  /** Number of active filters */
  activeFilterCount: number;
  /** Whether any filters are active */
  hasActiveFilters: boolean;
  /** Current filter state */
  filters: FilterState;
}

// ============================================================================
// Filter Functions
// ============================================================================

/**
 * Check if a restaurant matches the price range filter
 */
export function matchesPriceRange(restaurant: Restaurant, priceRange: number[]): boolean {
  if (priceRange.length === 0) return true;
  return priceRange.includes(restaurant.priceLevel);
}

/**
 * Check if a restaurant meets the minimum rating filter
 */
export function matchesMinRating(restaurant: Restaurant, minRating: number | null): boolean {
  if (minRating === null) return true;
  return restaurant.rating >= minRating;
}

/**
 * Check if a restaurant meets the maximum delivery time filter
 */
export function matchesDeliveryTime(
  restaurant: Restaurant,
  maxDeliveryTime: number | null
): boolean {
  if (maxDeliveryTime === null) return true;
  return restaurant.deliveryTime.max <= maxDeliveryTime;
}

/**
 * Check if a restaurant matches the dietary filters
 * Note: Since restaurants don't have dietary tags directly, we simulate this
 * based on cuisine types. In a real app, this would check actual dietary data.
 */
export function matchesDietary(restaurant: Restaurant, dietary: DietaryOption[]): boolean {
  if (dietary.length === 0) return true;

  // Map cuisine types to dietary options for simulation
  const cuisineToDietary: Record<string, DietaryOption[]> = {
    Vegetarian: ['vegetarian'],
    Vegan: ['vegan', 'vegetarian'],
    Healthy: ['vegetarian'],
    Salads: ['vegetarian', 'vegan'],
    Indian: ['vegetarian', 'halal'],
    Mediterranean: ['halal'],
    Thai: ['gluten_free'],
    Mexican: ['gluten_free'],
  };

  // Check if any of the restaurant's cuisines match any selected dietary option
  for (const cuisine of restaurant.cuisine) {
    const dietaryOptions = cuisineToDietary[cuisine] || [];
    for (const selectedDietary of dietary) {
      if (dietaryOptions.includes(selectedDietary)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if a restaurant matches the category filter
 */
export function matchesCategory(restaurant: Restaurant, category: string | null): boolean {
  if (!category || category === 'All') return true;
  return restaurant.cuisine.some((c) => c.toLowerCase() === category.toLowerCase());
}

/**
 * Apply all filters to a restaurant
 */
export function applyFilters(
  restaurant: Restaurant,
  filters: FilterState,
  categoryFilter?: string | null
): boolean {
  // Restaurant must be open
  if (!restaurant.isOpen) return false;

  // Apply all filter conditions
  return (
    matchesPriceRange(restaurant, filters.priceRange) &&
    matchesMinRating(restaurant, filters.minRating) &&
    matchesDeliveryTime(restaurant, filters.maxDeliveryTime) &&
    matchesDietary(restaurant, filters.dietary) &&
    matchesCategory(restaurant, categoryFilter ?? null)
  );
}

// ============================================================================
// Sort Functions
// ============================================================================

/**
 * Sort restaurants based on selected sort option
 */
export function sortRestaurants(restaurants: Restaurant[], sortBy: SortOption): Restaurant[] {
  const sorted = [...restaurants];

  switch (sortBy) {
    case 'recommended':
      // Default sorting: combination of rating and popularity
      return sorted.sort((a, b) => {
        const scoreA = a.rating * 0.6 + Math.log10(a.reviewCount + 1) * 0.4;
        const scoreB = b.rating * 0.6 + Math.log10(b.reviewCount + 1) * 0.4;
        return scoreB - scoreA;
      });

    case 'fastest_delivery':
      // Sort by fastest delivery time (minimum time)
      return sorted.sort((a, b) => a.deliveryTime.min - b.deliveryTime.min);

    case 'rating':
      // Sort by highest rating first
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'distance':
      // For mock data, we'll sort by delivery fee as a proxy for distance
      // In a real app, this would use actual distance calculation
      return sorted.sort((a, b) => a.deliveryFee - b.deliveryFee);

    case 'price_low_to_high':
      return sorted.sort((a, b) => a.priceLevel - b.priceLevel);

    case 'price_high_to_low':
      return sorted.sort((a, b) => b.priceLevel - a.priceLevel);

    default:
      return sorted;
  }
}

/**
 * Calculate active filter count
 */
export function calculateActiveFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.sortBy !== 'recommended') count++;
  count += filters.priceRange.length;
  if (filters.minRating !== null) count++;
  if (filters.maxDeliveryTime !== null) count++;
  count += filters.dietary.length;
  return count;
}

// ============================================================================
// Hook
// ============================================================================

export function useFilteredRestaurants(
  options: UseFilteredRestaurantsOptions
): UseFilteredRestaurantsReturn {
  const { restaurants, categoryFilter = null, localFilters } = options;

  // Get filters from store or use local filters
  const storeFilters = useFilterStore((state) => ({
    sortBy: state.sortBy,
    priceRange: state.priceRange,
    minRating: state.minRating,
    maxDeliveryTime: state.maxDeliveryTime,
    dietary: state.dietary,
  }));

  const filters = localFilters ?? storeFilters;

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    // First, filter restaurants
    const filtered = restaurants.filter((restaurant) =>
      applyFilters(restaurant, filters, categoryFilter)
    );

    // Then, sort the filtered results
    return sortRestaurants(filtered, filters.sortBy);
  }, [restaurants, filters, categoryFilter]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => calculateActiveFilterCount(filters), [filters]);

  return {
    filteredRestaurants,
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
    filters,
  };
}
