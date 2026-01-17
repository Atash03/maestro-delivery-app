/**
 * useMenuScrollSync Hook
 *
 * Manages synchronization between menu category tabs and menu sections:
 * - Tracks which category section is currently visible during scroll
 * - Auto-updates active category as user scrolls
 * - Provides programmatic scrolling to category sections
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import type { MenuItem } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface MenuSection {
  category: string;
  data: MenuItem[];
}

export interface CategoryLayout {
  categoryId: string;
  y: number;
  height: number;
}

export interface UseMenuScrollSyncOptions {
  /** Offset from top of scroll view to consider a section "active" */
  activationOffset?: number;
  /** Menu items grouped by category */
  menuItems: MenuItem[];
  /** Initial active category */
  initialCategory?: string;
}

export interface UseMenuScrollSyncReturn {
  /** Currently active category ID */
  activeCategory: string;
  /** Set the active category (without scrolling) */
  setActiveCategory: (categoryId: string) => void;
  /** Scroll to a specific category section */
  scrollToCategory: (categoryId: string) => void;
  /** Handler for scroll events - updates active category based on scroll position */
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Register a category section's layout */
  registerCategoryLayout: (categoryId: string, y: number, height: number) => void;
  /** Menu sections grouped by category */
  sections: MenuSection[];
  /** List of category IDs in order */
  categoryIds: string[];
  /** Current scroll Y position */
  scrollY: number;
  /** Ref setter for the scroll view/section list */
  setScrollRef: (
    ref: {
      scrollToLocation?: (params: {
        sectionIndex: number;
        itemIndex: number;
        animated?: boolean;
        viewOffset?: number;
      }) => void;
    } | null
  ) => void;
  /** Whether programmatic scroll is in progress (to prevent feedback loops) */
  isProgrammaticScroll: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_ACTIVATION_OFFSET = 100;

// ============================================================================
// Hook Implementation
// ============================================================================

export function useMenuScrollSync({
  activationOffset = DEFAULT_ACTIVATION_OFFSET,
  menuItems,
  initialCategory,
}: UseMenuScrollSyncOptions): UseMenuScrollSyncReturn {
  // Group menu items by category
  const sections = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    const categoryOrder: string[] = [];

    for (const item of menuItems) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
        categoryOrder.push(item.category);
      }
      grouped[item.category].push(item);
    }

    return categoryOrder.map((category) => ({
      category,
      data: grouped[category],
    }));
  }, [menuItems]);

  // Extract category IDs in order
  const categoryIds = useMemo(() => sections.map((s) => s.category), [sections]);

  // State for active category
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory || categoryIds[0] || ''
  );

  // State for scroll position
  const [scrollY, setScrollY] = useState(0);

  // Ref for storing category layouts
  const categoryLayouts = useRef<Map<string, CategoryLayout>>(new Map());

  // Ref for the scroll view
  const scrollRef = useRef<{
    scrollToLocation?: (params: {
      sectionIndex: number;
      itemIndex: number;
      animated?: boolean;
      viewOffset?: number;
    }) => void;
  } | null>(null);

  // Ref to track programmatic scrolling
  const isProgrammaticScrollRef = useRef(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

  // Register a category section's layout
  const registerCategoryLayout = useCallback((categoryId: string, y: number, height: number) => {
    categoryLayouts.current.set(categoryId, { categoryId, y, height });
  }, []);

  // Set scroll ref
  const setScrollRef = useCallback(
    (
      ref: {
        scrollToLocation?: (params: {
          sectionIndex: number;
          itemIndex: number;
          animated?: boolean;
          viewOffset?: number;
        }) => void;
      } | null
    ) => {
      scrollRef.current = ref;
    },
    []
  );

  // Find which category is active based on scroll position
  const findActiveCategoryFromScroll = useCallback(
    (scrollPosition: number): string | null => {
      const layouts = Array.from(categoryLayouts.current.values()).sort((a, b) => a.y - b.y);

      if (layouts.length === 0) {
        return categoryIds[0] || null;
      }

      // Find the category whose section is at or above the activation point
      for (let i = layouts.length - 1; i >= 0; i--) {
        const layout = layouts[i];
        if (scrollPosition >= layout.y - activationOffset) {
          return layout.categoryId;
        }
      }

      // Default to first category
      return layouts[0]?.categoryId || categoryIds[0] || null;
    },
    [activationOffset, categoryIds]
  );

  // Handle scroll events
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setScrollY(offsetY);

      // Don't update active category during programmatic scroll
      if (isProgrammaticScrollRef.current) {
        return;
      }

      const newActiveCategory = findActiveCategoryFromScroll(offsetY);
      if (newActiveCategory && newActiveCategory !== activeCategory) {
        setActiveCategory(newActiveCategory);
      }
    },
    [activeCategory, findActiveCategoryFromScroll]
  );

  // Scroll to a specific category section
  const scrollToCategory = useCallback(
    (categoryId: string) => {
      const sectionIndex = sections.findIndex((s) => s.category === categoryId);

      if (sectionIndex === -1) {
        return;
      }

      // Set programmatic scroll flag
      isProgrammaticScrollRef.current = true;
      setIsProgrammaticScroll(true);

      // Update active category immediately
      setActiveCategory(categoryId);

      // Scroll to the section
      if (scrollRef.current?.scrollToLocation) {
        scrollRef.current.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
          animated: true,
          viewOffset: activationOffset,
        });
      }

      // Reset programmatic scroll flag after animation
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        setIsProgrammaticScroll(false);
      }, 500);
    },
    [sections, activationOffset]
  );

  return {
    activeCategory,
    setActiveCategory,
    scrollToCategory,
    handleScroll,
    registerCategoryLayout,
    sections,
    categoryIds,
    scrollY,
    setScrollRef,
    isProgrammaticScroll,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get unique categories from menu items in the order they appear
 */
export function getCategoriesFromMenuItems(menuItems: MenuItem[]): string[] {
  const seen = new Set<string>();
  const categories: string[] = [];

  for (const item of menuItems) {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      categories.push(item.category);
    }
  }

  return categories;
}

/**
 * Convert category strings to MenuCategory objects
 */
export function categoriesToMenuCategories(
  categories: string[],
  menuItems: MenuItem[]
): { id: string; name: string; itemCount: number }[] {
  return categories.map((category) => ({
    id: category,
    name: category,
    itemCount: menuItems.filter((item) => item.category === category).length,
  }));
}
