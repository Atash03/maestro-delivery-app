/**
 * useHomeData Hook
 *
 * Custom hook for fetching and managing home screen restaurant data.
 * Provides categorized restaurant lists for different sections.
 *
 * Features:
 * - Fetches all restaurant data with simulated network delay
 * - Categorizes restaurants into featured, popular, quick bites, and new
 * - Supports filtering by cuisine category
 * - Provides loading and refreshing states
 * - Error handling
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  fetchRestaurants,
  mockRestaurants,
  NETWORK_DELAYS,
  simulateNetworkDelay,
} from '@/data/mock';
import type { Restaurant } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface HomeDataState {
  /** All restaurants */
  allRestaurants: Restaurant[];
  /** Featured restaurants (high rating, premium) */
  featuredRestaurants: Restaurant[];
  /** Popular restaurants (high review count) */
  popularRestaurants: Restaurant[];
  /** Quick bites (fast delivery) */
  quickBitesRestaurants: Restaurant[];
  /** New on Maestro (simulated as random selection) */
  newRestaurants: Restaurant[];
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether data is refreshing */
  isRefreshing: boolean;
  /** Error message if any */
  error: string | null;
}

export interface UseHomeDataOptions {
  /** Selected cuisine category filter */
  selectedCategory?: string | null;
  /** Whether to auto-fetch on mount */
  autoFetch?: boolean;
}

export interface UseHomeDataReturn extends HomeDataState {
  /** Refresh data */
  refresh: () => Promise<void>;
  /** Fetch data (for initial load or manual trigger) */
  fetchData: () => Promise<void>;
  /** Filter restaurants by category */
  filterByCategory: (categoryName: string | null) => void;
}

// ============================================================================
// Constants
// ============================================================================

/** Minimum rating for featured restaurants */
const FEATURED_MIN_RATING = 4.6;

/** Maximum delivery time for quick bites (max minutes) */
const QUICK_BITES_MAX_TIME = 30;

/** Minimum review count for popular restaurants */
const POPULAR_MIN_REVIEWS = 300;

/** Number of restaurants to show in each section */
const SECTION_LIMIT = 10;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get featured restaurants (high rating, premium feel)
 */
export function getFeaturedRestaurants(restaurants: Restaurant[]): Restaurant[] {
  return restaurants
    .filter((r) => r.isOpen && r.rating >= FEATURED_MIN_RATING)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, SECTION_LIMIT);
}

/**
 * Get popular restaurants (high review count)
 */
export function getPopularRestaurants(restaurants: Restaurant[]): Restaurant[] {
  return restaurants
    .filter((r) => r.isOpen && r.reviewCount >= POPULAR_MIN_REVIEWS)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, SECTION_LIMIT);
}

/**
 * Get quick bites restaurants (fast delivery)
 */
export function getQuickBitesRestaurants(restaurants: Restaurant[]): Restaurant[] {
  return restaurants
    .filter((r) => r.isOpen && r.deliveryTime.max <= QUICK_BITES_MAX_TIME)
    .sort((a, b) => a.deliveryTime.max - b.deliveryTime.max)
    .slice(0, SECTION_LIMIT);
}

/**
 * Get new restaurants (simulated as restaurants with specific characteristics)
 * In a real app, this would be based on creation date
 */
export function getNewRestaurants(restaurants: Restaurant[]): Restaurant[] {
  // For mock purposes, we'll consider restaurants with lower review counts as "newer"
  return restaurants
    .filter((r) => r.isOpen && r.reviewCount < POPULAR_MIN_REVIEWS)
    .sort((a, b) => a.reviewCount - b.reviewCount)
    .slice(0, SECTION_LIMIT);
}

// ============================================================================
// Hook
// ============================================================================

export function useHomeData(options: UseHomeDataOptions = {}): UseHomeDataReturn {
  const { selectedCategory = null, autoFetch = true } = options;

  const [state, setState] = useState<HomeDataState>({
    allRestaurants: [],
    featuredRestaurants: [],
    popularRestaurants: [],
    quickBitesRestaurants: [],
    newRestaurants: [],
    isLoading: autoFetch,
    isRefreshing: false,
    error: null,
  });

  const [categoryFilter, setCategoryFilter] = useState<string | null>(selectedCategory);

  // Fetch data function
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const restaurants = await fetchRestaurants(NETWORK_DELAYS.NORMAL.max);

      setState({
        allRestaurants: restaurants,
        featuredRestaurants: getFeaturedRestaurants(restaurants),
        popularRestaurants: getPopularRestaurants(restaurants),
        quickBitesRestaurants: getQuickBitesRestaurants(restaurants),
        newRestaurants: getNewRestaurants(restaurants),
        isLoading: false,
        isRefreshing: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: err instanceof Error ? err.message : 'Failed to load restaurants',
      }));
    }
  }, []);

  // Refresh data function
  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isRefreshing: true }));

    try {
      await simulateNetworkDelay(NETWORK_DELAYS.FAST);
      const restaurants = mockRestaurants;

      setState((prev) => ({
        ...prev,
        allRestaurants: restaurants,
        featuredRestaurants: getFeaturedRestaurants(restaurants),
        popularRestaurants: getPopularRestaurants(restaurants),
        quickBitesRestaurants: getQuickBitesRestaurants(restaurants),
        newRestaurants: getNewRestaurants(restaurants),
        isRefreshing: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isRefreshing: false,
        error: err instanceof Error ? err.message : 'Failed to refresh restaurants',
      }));
    }
  }, []);

  // Filter by category
  const filterByCategory = useCallback((categoryName: string | null) => {
    setCategoryFilter(categoryName);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Apply category filter to restaurants
  const filteredData = useMemo(() => {
    if (!categoryFilter || categoryFilter === 'All') {
      return state;
    }

    const filteredRestaurants = state.allRestaurants.filter((r) =>
      r.cuisine.some((c) => c.toLowerCase() === categoryFilter.toLowerCase())
    );

    return {
      ...state,
      featuredRestaurants: getFeaturedRestaurants(filteredRestaurants),
      popularRestaurants: getPopularRestaurants(filteredRestaurants),
      quickBitesRestaurants: getQuickBitesRestaurants(filteredRestaurants),
      newRestaurants: getNewRestaurants(filteredRestaurants),
    };
  }, [state, categoryFilter]);

  return {
    ...filteredData,
    refresh,
    fetchData,
    filterByCategory,
  };
}
