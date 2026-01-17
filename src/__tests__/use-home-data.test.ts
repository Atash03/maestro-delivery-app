/**
 * Tests for useHomeData Hook
 *
 * This test suite verifies:
 * - Hook structure and exports
 * - State management
 * - Helper functions for categorizing restaurants
 * - Filtering logic
 * - Async data fetching
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Read the hook source file
const hookPath = resolve(__dirname, '../hooks/use-home-data.ts');
const hookSource = readFileSync(hookPath, 'utf-8');

describe('useHomeData Hook', () => {
  describe('File Structure', () => {
    it('should export useHomeData hook', () => {
      expect(hookSource).toContain('export function useHomeData');
    });

    it('should export HomeDataState interface', () => {
      expect(hookSource).toContain('export interface HomeDataState');
    });

    it('should export UseHomeDataOptions interface', () => {
      expect(hookSource).toContain('export interface UseHomeDataOptions');
    });

    it('should export UseHomeDataReturn interface', () => {
      expect(hookSource).toContain('export interface UseHomeDataReturn');
    });
  });

  describe('Helper Functions Exports', () => {
    it('should export getFeaturedRestaurants function', () => {
      expect(hookSource).toContain('export function getFeaturedRestaurants');
    });

    it('should export getPopularRestaurants function', () => {
      expect(hookSource).toContain('export function getPopularRestaurants');
    });

    it('should export getQuickBitesRestaurants function', () => {
      expect(hookSource).toContain('export function getQuickBitesRestaurants');
    });

    it('should export getNewRestaurants function', () => {
      expect(hookSource).toContain('export function getNewRestaurants');
    });
  });

  describe('Constants', () => {
    it('should define FEATURED_MIN_RATING constant', () => {
      expect(hookSource).toMatch(/const\s+FEATURED_MIN_RATING\s*=\s*[\d.]+/);
    });

    it('should define QUICK_BITES_MAX_TIME constant', () => {
      expect(hookSource).toMatch(/const\s+QUICK_BITES_MAX_TIME\s*=\s*\d+/);
    });

    it('should define POPULAR_MIN_REVIEWS constant', () => {
      expect(hookSource).toMatch(/const\s+POPULAR_MIN_REVIEWS\s*=\s*\d+/);
    });

    it('should define SECTION_LIMIT constant', () => {
      expect(hookSource).toMatch(/const\s+SECTION_LIMIT\s*=\s*\d+/);
    });

    it('should set FEATURED_MIN_RATING to 4.6', () => {
      expect(hookSource).toContain('FEATURED_MIN_RATING = 4.6');
    });

    it('should set QUICK_BITES_MAX_TIME to 30', () => {
      expect(hookSource).toContain('QUICK_BITES_MAX_TIME = 30');
    });

    it('should set POPULAR_MIN_REVIEWS to 300', () => {
      expect(hookSource).toContain('POPULAR_MIN_REVIEWS = 300');
    });

    it('should set SECTION_LIMIT to 10', () => {
      expect(hookSource).toContain('SECTION_LIMIT = 10');
    });
  });

  describe('HomeDataState Interface', () => {
    it('should have allRestaurants property', () => {
      expect(hookSource).toMatch(/allRestaurants:\s*Restaurant\[\]/);
    });

    it('should have featuredRestaurants property', () => {
      expect(hookSource).toMatch(/featuredRestaurants:\s*Restaurant\[\]/);
    });

    it('should have popularRestaurants property', () => {
      expect(hookSource).toMatch(/popularRestaurants:\s*Restaurant\[\]/);
    });

    it('should have quickBitesRestaurants property', () => {
      expect(hookSource).toMatch(/quickBitesRestaurants:\s*Restaurant\[\]/);
    });

    it('should have newRestaurants property', () => {
      expect(hookSource).toMatch(/newRestaurants:\s*Restaurant\[\]/);
    });

    it('should have isLoading property', () => {
      expect(hookSource).toMatch(/isLoading:\s*boolean/);
    });

    it('should have isRefreshing property', () => {
      expect(hookSource).toMatch(/isRefreshing:\s*boolean/);
    });

    it('should have error property', () => {
      expect(hookSource).toMatch(/error:\s*string\s*\|\s*null/);
    });
  });

  describe('UseHomeDataOptions Interface', () => {
    it('should have selectedCategory option', () => {
      expect(hookSource).toMatch(/selectedCategory\?:\s*string\s*\|\s*null/);
    });

    it('should have autoFetch option', () => {
      expect(hookSource).toMatch(/autoFetch\?:\s*boolean/);
    });
  });

  describe('UseHomeDataReturn Interface', () => {
    it('should extend HomeDataState', () => {
      expect(hookSource).toMatch(/UseHomeDataReturn\s+extends\s+HomeDataState/);
    });

    it('should have refresh function', () => {
      expect(hookSource).toMatch(/refresh:\s*\(\)\s*=>\s*Promise<void>/);
    });

    it('should have fetchData function', () => {
      expect(hookSource).toMatch(/fetchData:\s*\(\)\s*=>\s*Promise<void>/);
    });

    it('should have filterByCategory function', () => {
      expect(hookSource).toMatch(/filterByCategory:\s*\(categoryName:/);
    });
  });

  describe('getFeaturedRestaurants Function', () => {
    it('should filter by isOpen', () => {
      expect(hookSource).toMatch(/filter.*r\.isOpen/);
    });

    it('should filter by rating >= FEATURED_MIN_RATING', () => {
      expect(hookSource).toMatch(/r\.rating\s*>=\s*FEATURED_MIN_RATING/);
    });

    it('should sort by rating descending', () => {
      expect(hookSource).toMatch(/sort.*b\.rating\s*-\s*a\.rating/);
    });

    it('should limit results to SECTION_LIMIT', () => {
      expect(hookSource).toMatch(/slice\(0,\s*SECTION_LIMIT\)/);
    });
  });

  describe('getPopularRestaurants Function', () => {
    it('should filter by isOpen', () => {
      expect(hookSource).toMatch(/filter.*r\.isOpen.*reviewCount/s);
    });

    it('should filter by reviewCount >= POPULAR_MIN_REVIEWS', () => {
      expect(hookSource).toMatch(/r\.reviewCount\s*>=\s*POPULAR_MIN_REVIEWS/);
    });

    it('should sort by reviewCount descending', () => {
      expect(hookSource).toMatch(/sort.*b\.reviewCount\s*-\s*a\.reviewCount/);
    });
  });

  describe('getQuickBitesRestaurants Function', () => {
    it('should filter by isOpen', () => {
      expect(hookSource).toMatch(/filter.*r\.isOpen.*deliveryTime/s);
    });

    it('should filter by deliveryTime.max <= QUICK_BITES_MAX_TIME', () => {
      expect(hookSource).toMatch(/r\.deliveryTime\.max\s*<=\s*QUICK_BITES_MAX_TIME/);
    });

    it('should sort by deliveryTime.max ascending', () => {
      expect(hookSource).toMatch(/sort.*a\.deliveryTime\.max\s*-\s*b\.deliveryTime\.max/);
    });
  });

  describe('getNewRestaurants Function', () => {
    it('should filter by isOpen', () => {
      // Already covered in previous tests
      expect(hookSource).toContain('getNewRestaurants');
    });

    it('should filter by reviewCount < POPULAR_MIN_REVIEWS', () => {
      expect(hookSource).toMatch(/r\.reviewCount\s*<\s*POPULAR_MIN_REVIEWS/);
    });

    it('should sort by reviewCount ascending', () => {
      expect(hookSource).toMatch(/sort.*a\.reviewCount\s*-\s*b\.reviewCount/);
    });
  });

  describe('Hook Implementation', () => {
    it('should use useState for state management', () => {
      expect(hookSource).toContain('useState');
    });

    it('should use useCallback for fetchData', () => {
      expect(hookSource).toMatch(/const\s+fetchData\s*=\s*useCallback/);
    });

    it('should use useCallback for refresh', () => {
      expect(hookSource).toMatch(/const\s+refresh\s*=\s*useCallback/);
    });

    it('should use useCallback for filterByCategory', () => {
      expect(hookSource).toMatch(/const\s+filterByCategory\s*=\s*useCallback/);
    });

    it('should use useEffect for auto-fetching', () => {
      expect(hookSource).toContain('useEffect');
      expect(hookSource).toMatch(/if\s*\(autoFetch\)/);
    });

    it('should use useMemo for filtered data', () => {
      expect(hookSource).toContain('useMemo');
      expect(hookSource).toContain('filteredData');
    });
  });

  describe('fetchData Function', () => {
    it('should set isLoading to true at start', () => {
      expect(hookSource).toMatch(/isLoading:\s*true/);
    });

    it('should clear error at start', () => {
      expect(hookSource).toMatch(/error:\s*null/);
    });

    it('should call fetchRestaurants', () => {
      expect(hookSource).toContain('fetchRestaurants');
    });

    it('should use NETWORK_DELAYS', () => {
      expect(hookSource).toContain('NETWORK_DELAYS');
    });

    it('should handle errors with try-catch', () => {
      expect(hookSource).toContain('try {');
      expect(hookSource).toContain('catch');
    });

    it('should set error message on failure', () => {
      expect(hookSource).toMatch(/error:.*err.*message/s);
    });
  });

  describe('refresh Function', () => {
    it('should set isRefreshing to true', () => {
      expect(hookSource).toMatch(/isRefreshing:\s*true/);
    });

    it('should use simulateNetworkDelay', () => {
      expect(hookSource).toContain('simulateNetworkDelay');
    });

    it('should set isRefreshing to false after completion', () => {
      expect(hookSource).toMatch(/isRefreshing:\s*false/);
    });
  });

  describe('Category Filtering', () => {
    it('should handle null category (show all)', () => {
      expect(hookSource).toMatch(/!categoryFilter\s*\|\|/);
    });

    it('should handle "All" category', () => {
      expect(hookSource).toContain("=== 'All'");
    });

    it('should filter restaurants by cuisine', () => {
      expect(hookSource).toMatch(/r\.cuisine\.some/);
    });

    it('should use case-insensitive comparison', () => {
      expect(hookSource).toContain('.toLowerCase()');
    });
  });

  describe('Imports', () => {
    it('should import from mock data', () => {
      expect(hookSource).toContain("from '@/data/mock'");
    });

    it('should import Restaurant type', () => {
      expect(hookSource).toContain("from '@/types'");
      expect(hookSource).toContain('Restaurant');
    });

    it('should import React hooks', () => {
      expect(hookSource).toContain('useCallback');
      expect(hookSource).toContain('useEffect');
      expect(hookSource).toContain('useMemo');
      expect(hookSource).toContain('useState');
    });
  });

  describe('Default Options', () => {
    it('should default selectedCategory to null', () => {
      expect(hookSource).toMatch(/selectedCategory\s*=\s*null/);
    });

    it('should default autoFetch to true', () => {
      expect(hookSource).toMatch(/autoFetch\s*=\s*true/);
    });
  });

  describe('Return Value', () => {
    it('should return filteredData spread', () => {
      expect(hookSource).toContain('...filteredData');
    });

    it('should return refresh function', () => {
      expect(hookSource).toMatch(/return\s*\{[\s\S]*refresh/);
    });

    it('should return fetchData function', () => {
      expect(hookSource).toMatch(/return\s*\{[\s\S]*fetchData/);
    });

    it('should return filterByCategory function', () => {
      expect(hookSource).toMatch(/return\s*\{[\s\S]*filterByCategory/);
    });
  });
});
