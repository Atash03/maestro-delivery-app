/**
 * useSearch Hook
 *
 * Custom hook for searching restaurants and menu items with debounce.
 * Features:
 * - Debounced search to reduce API calls
 * - Combined restaurant and menu item search
 * - Loading and error states
 * - Simulated network delay for realistic UX
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  getRestaurantById,
  mockMenuItems,
  mockRestaurants,
  NETWORK_DELAYS,
  simulateNetworkDelay,
} from '@/data/mock';
import type { MenuItem, Restaurant } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface SearchResult {
  /** Restaurants matching the search query */
  restaurants: Restaurant[];
  /** Menu items matching the search query */
  menuItems: MenuItemWithRestaurant[];
}

export interface MenuItemWithRestaurant extends MenuItem {
  /** The restaurant this menu item belongs to */
  restaurantName: string;
}

export interface UseSearchOptions {
  /** Debounce delay in milliseconds (default: 300ms) */
  debounceMs?: number;
  /** Minimum query length to trigger search (default: 2) */
  minQueryLength?: number;
}

export interface UseSearchReturn {
  /** Current search query */
  query: string;
  /** Set the search query */
  setQuery: (query: string) => void;
  /** Search results */
  results: SearchResult;
  /** Whether a search is in progress */
  isLoading: boolean;
  /** Whether the search has been performed at least once */
  hasSearched: boolean;
  /** Clear the search and reset state */
  clearSearch: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_MIN_QUERY_LENGTH = 2;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Search restaurants by name, cuisine, or description
 */
function searchRestaurants(query: string): Restaurant[] {
  const lowerQuery = query.toLowerCase();
  return mockRestaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(lowerQuery) ||
      restaurant.cuisine.some((c) => c.toLowerCase().includes(lowerQuery)) ||
      restaurant.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Search menu items by name, description, or category
 */
function searchMenuItems(query: string): MenuItemWithRestaurant[] {
  const lowerQuery = query.toLowerCase();
  return mockMenuItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    )
    .map((item) => {
      const restaurant = getRestaurantById(item.restaurantId);
      return {
        ...item,
        restaurantName: restaurant?.name ?? 'Unknown Restaurant',
      };
    });
}

/**
 * Perform a combined search on restaurants and menu items
 */
async function performSearch(query: string): Promise<SearchResult> {
  // Simulate network delay for realistic UX
  await simulateNetworkDelay(NETWORK_DELAYS.FAST);

  const restaurants = searchRestaurants(query);
  const menuItems = searchMenuItems(query);

  return { restaurants, menuItems };
}

// ============================================================================
// Hook
// ============================================================================

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = DEFAULT_DEBOUNCE_MS, minQueryLength = DEFAULT_MIN_QUERY_LENGTH } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ restaurants: [], menuItems: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Ref to store timeout ID for cleanup
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref to track the latest search request to prevent race conditions
  const latestSearchRef = useRef<string>('');

  // Clear debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Perform search when query changes (with debounce)
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const trimmedQuery = query.trim();

    // If query is too short, clear results
    if (trimmedQuery.length < minQueryLength) {
      setResults({ restaurants: [], menuItems: [] });
      setIsLoading(false);
      if (trimmedQuery.length === 0) {
        setHasSearched(false);
      }
      return;
    }

    // Set loading state
    setIsLoading(true);

    // Debounce the search
    debounceTimeoutRef.current = setTimeout(async () => {
      latestSearchRef.current = trimmedQuery;

      try {
        const searchResults = await performSearch(trimmedQuery);

        // Only update if this is still the latest search
        if (latestSearchRef.current === trimmedQuery) {
          setResults(searchResults);
          setHasSearched(true);
        }
      } finally {
        // Only clear loading if this is still the latest search
        if (latestSearchRef.current === trimmedQuery) {
          setIsLoading(false);
        }
      }
    }, debounceMs);
  }, [query, debounceMs, minQueryLength]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults({ restaurants: [], menuItems: [] });
    setHasSearched(false);
    setIsLoading(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  // Memoize return value
  return useMemo(
    () => ({
      query,
      setQuery,
      results,
      isLoading,
      hasSearched,
      clearSearch,
    }),
    [query, results, isLoading, hasSearched, clearSearch]
  );
}

export default useSearch;
