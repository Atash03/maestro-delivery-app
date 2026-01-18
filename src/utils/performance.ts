/**
 * Performance Utilities
 *
 * Helper functions for optimizing React Native app performance.
 * Includes utilities for:
 * - List rendering optimizations
 * - Memoization helpers
 * - Debouncing and throttling
 * - FlashList configuration
 */

// ============================================================================
// FlashList Configuration Helpers
// ============================================================================

/**
 * Recommended FlashList configuration for optimal performance
 */
export const FLASH_LIST_CONFIG = {
  /** Default estimated item size for vertical lists */
  estimatedItemSizeVertical: 100,
  /** Default estimated item size for horizontal cards */
  estimatedItemSizeHorizontalCard: 280,
  /** Default estimated item size for horizontal chips */
  estimatedItemSizeHorizontalChip: 120,
  /** Overscan count for off-screen items */
  drawDistance: 250,
} as const;

/**
 * Get FlashList props optimized for different content types
 */
export function getFlashListProps(type: 'cards' | 'chips' | 'items') {
  const baseProps = {
    drawDistance: FLASH_LIST_CONFIG.drawDistance,
    estimatedFirstItemOffset: 0,
  };

  switch (type) {
    case 'cards':
      return {
        ...baseProps,
        estimatedItemSize: FLASH_LIST_CONFIG.estimatedItemSizeHorizontalCard,
      };
    case 'chips':
      return {
        ...baseProps,
        estimatedItemSize: FLASH_LIST_CONFIG.estimatedItemSizeHorizontalChip,
      };
    default:
      return {
        ...baseProps,
        estimatedItemSize: FLASH_LIST_CONFIG.estimatedItemSizeVertical,
      };
  }
}

// ============================================================================
// Debounce and Throttle
// ============================================================================

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      func(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        func(...args);
      }, remaining);
    }
  };
}

// ============================================================================
// Memoization Helpers
// ============================================================================

/**
 * Shallow comparison function for React.memo
 * Compares primitive props and reference equality for objects
 */
export function shallowEqual<T extends Record<string, unknown>>(
  prevProps: T,
  nextProps: T
): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Creates a comparison function that excludes specified props from comparison
 * Useful for memo when certain props should be ignored (like callbacks that change reference)
 */
export function createPropsComparator<T extends Record<string, unknown>>(
  excludeProps: (keyof T)[]
): (prevProps: T, nextProps: T) => boolean {
  return (prevProps: T, nextProps: T) => {
    const prevFiltered = { ...prevProps };
    const nextFiltered = { ...nextProps };

    for (const prop of excludeProps) {
      delete prevFiltered[prop];
      delete nextFiltered[prop];
    }

    return shallowEqual(prevFiltered, nextFiltered);
  };
}

// ============================================================================
// Key Extractors
// ============================================================================

/**
 * Type-safe key extractor for items with an id property
 */
export function createIdKeyExtractor<T extends { id: string }>(item: T): string {
  return item.id;
}

/**
 * Type-safe key extractor for items with a numeric index
 */
export function createIndexKeyExtractor<T>(_item: T, index: number): string {
  return String(index);
}

// ============================================================================
// Layout Calculation Helpers
// ============================================================================

/**
 * Creates a getItemLayout function for FlashList/FlatList with fixed height items
 * This enables optimization by skipping measurement
 */
export function createGetItemLayout(
  itemHeight: number,
  separatorHeight = 0
): (
  data: unknown[] | null | undefined,
  index: number
) => { length: number; offset: number; index: number } {
  return (_data, index) => ({
    length: itemHeight,
    offset: (itemHeight + separatorHeight) * index,
    index,
  });
}

// ============================================================================
// Image Optimization
// ============================================================================

/**
 * Generates an optimized image URL with size parameters
 * Works with services like picsum, cloudinary, imgix, etc.
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  height?: number,
  _quality = 80
): string {
  // Handle picsum URLs
  if (url.includes('picsum.photos')) {
    const parts = url.split('/');
    const sizeIndex = parts.findIndex((p) => /^\d+$/.test(p));
    if (sizeIndex !== -1) {
      parts[sizeIndex] = String(Math.round(width));
      if (height && parts[sizeIndex + 1]?.match(/^\d+$/)) {
        parts[sizeIndex + 1] = String(Math.round(height));
      }
    }
    return parts.join('/');
  }

  // Return original URL for other services
  // Could be extended to handle cloudinary, imgix, etc.
  return url;
}

// ============================================================================
// Batch Update Helper
// ============================================================================

/**
 * Batches multiple state updates together using requestAnimationFrame
 * Helps prevent excessive re-renders when updating multiple states
 */
export function batchUpdates(callback: () => void): void {
  requestAnimationFrame(callback);
}

// ============================================================================
// Export Types
// ============================================================================

export type FlashListType = 'cards' | 'chips' | 'items';
