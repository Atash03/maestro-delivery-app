/**
 * Filter Store
 *
 * Zustand store for managing restaurant filter state with persistence.
 * Stores user-selected filters and provides filter count calculations.
 *
 * Filter options:
 * - Sort by: Recommended, Fastest Delivery, Rating, Distance
 * - Price Range: $, $$, $$$, $$$$ (multi-select)
 * - Rating: 4.5+, 4.0+, 3.5+ (single select)
 * - Delivery Time: Under 30 min, Under 45 min, Under 60 min (single select)
 * - Dietary: Vegetarian, Vegan, Gluten-Free, Halal, Kosher (multi-select)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { DietaryOption, PriceLevel, SortOption } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface FilterState {
  sortBy: SortOption;
  priceRange: PriceLevel[];
  minRating: number | null;
  maxDeliveryTime: number | null;
  dietary: DietaryOption[];
}

interface FilterActions {
  /** Set sort option */
  setSortBy: (sortBy: SortOption) => void;
  /** Toggle a price level in the selection */
  togglePriceLevel: (priceLevel: PriceLevel) => void;
  /** Set minimum rating filter (null to clear) */
  setMinRating: (rating: number | null) => void;
  /** Set maximum delivery time filter (null to clear) */
  setMaxDeliveryTime: (time: number | null) => void;
  /** Toggle a dietary option in the selection */
  toggleDietary: (dietary: DietaryOption) => void;
  /** Reset all filters to default */
  clearFilters: () => void;
  /** Apply a complete filter state (e.g., from modal) */
  applyFilters: (filters: FilterState) => void;
  /** Get the count of active filters */
  getActiveFilterCount: () => number;
  /** Check if any filters are active (excluding default sort) */
  hasActiveFilters: () => boolean;
}

type FilterStore = FilterState & FilterActions;

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_FILTER_STATE: FilterState = {
  sortBy: 'recommended',
  priceRange: [],
  minRating: null,
  maxDeliveryTime: null,
  dietary: [],
};

// ============================================================================
// Store
// ============================================================================

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_FILTER_STATE,

      setSortBy: (sortBy: SortOption) => {
        set({ sortBy });
      },

      togglePriceLevel: (priceLevel: PriceLevel) => {
        set((state) => ({
          priceRange: state.priceRange.includes(priceLevel)
            ? state.priceRange.filter((p) => p !== priceLevel)
            : [...state.priceRange, priceLevel],
        }));
      },

      setMinRating: (rating: number | null) => {
        set({ minRating: rating });
      },

      setMaxDeliveryTime: (time: number | null) => {
        set({ maxDeliveryTime: time });
      },

      toggleDietary: (dietary: DietaryOption) => {
        set((state) => ({
          dietary: state.dietary.includes(dietary)
            ? state.dietary.filter((d) => d !== dietary)
            : [...state.dietary, dietary],
        }));
      },

      clearFilters: () => {
        set(DEFAULT_FILTER_STATE);
      },

      applyFilters: (filters: FilterState) => {
        set(filters);
      },

      getActiveFilterCount: () => {
        const { sortBy, priceRange, minRating, maxDeliveryTime, dietary } = get();
        let count = 0;
        if (sortBy !== 'recommended') count++;
        count += priceRange.length;
        if (minRating !== null) count++;
        if (maxDeliveryTime !== null) count++;
        count += dietary.length;
        return count;
      },

      hasActiveFilters: () => {
        return get().getActiveFilterCount() > 0;
      },
    }),
    {
      name: 'maestro-filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
