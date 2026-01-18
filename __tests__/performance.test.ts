/**
 * Performance Utilities Tests
 *
 * Tests for performance optimization utilities.
 */

import {
  createGetItemLayout,
  createIdKeyExtractor,
  createIndexKeyExtractor,
  createPropsComparator,
  debounce,
  FLASH_LIST_CONFIG,
  getFlashListProps,
  getOptimizedImageUrl,
  shallowEqual,
  throttle,
} from '@/utils/performance';

describe('Performance Utilities', () => {
  // ============================================================================
  // FlashList Configuration Tests
  // ============================================================================

  describe('FLASH_LIST_CONFIG', () => {
    it('should have correct default values', () => {
      expect(FLASH_LIST_CONFIG.estimatedItemSizeVertical).toBe(100);
      expect(FLASH_LIST_CONFIG.estimatedItemSizeHorizontalCard).toBe(280);
      expect(FLASH_LIST_CONFIG.estimatedItemSizeHorizontalChip).toBe(120);
      expect(FLASH_LIST_CONFIG.drawDistance).toBe(250);
    });
  });

  describe('getFlashListProps', () => {
    it('should return correct props for cards type', () => {
      const props = getFlashListProps('cards');
      expect(props.estimatedItemSize).toBe(280);
      expect(props.drawDistance).toBe(250);
      expect(props.estimatedFirstItemOffset).toBe(0);
    });

    it('should return correct props for chips type', () => {
      const props = getFlashListProps('chips');
      expect(props.estimatedItemSize).toBe(120);
      expect(props.drawDistance).toBe(250);
    });

    it('should return correct props for items type', () => {
      const props = getFlashListProps('items');
      expect(props.estimatedItemSize).toBe(100);
      expect(props.drawDistance).toBe(250);
    });
  });

  // ============================================================================
  // Debounce Tests
  // ============================================================================

  describe('debounce', () => {
    it('should delay function execution', async () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 10);

      debouncedFunc();
      expect(func).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 15));
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', async () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 20);

      debouncedFunc();
      await new Promise((resolve) => setTimeout(resolve, 10));
      debouncedFunc();
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(func).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 15));
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', async () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 10);

      debouncedFunc('arg1', 'arg2');
      await new Promise((resolve) => setTimeout(resolve, 15));

      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  // ============================================================================
  // Throttle Tests
  // ============================================================================

  describe('throttle', () => {
    it('should execute immediately on first call', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc();
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should throttle subsequent calls within the wait period', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc();
      throttledFunc();
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should execute after wait period', async () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 20);

      throttledFunc();
      expect(func).toHaveBeenCalledTimes(1);

      await new Promise((resolve) => setTimeout(resolve, 25));
      throttledFunc();
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to the throttled function', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc('arg1', 'arg2');
      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  // ============================================================================
  // Shallow Equal Tests
  // ============================================================================

  describe('shallowEqual', () => {
    it('should return true for equal primitive props', () => {
      const prev = { a: 1, b: 'test', c: true };
      const next = { a: 1, b: 'test', c: true };
      expect(shallowEqual(prev, next)).toBe(true);
    });

    it('should return false for different primitive values', () => {
      const prev = { a: 1, b: 'test' };
      const next = { a: 2, b: 'test' };
      expect(shallowEqual(prev, next)).toBe(false);
    });

    it('should return false for different number of keys', () => {
      const prev = { a: 1 };
      const next = { a: 1, b: 2 };
      expect(shallowEqual(prev, next)).toBe(false);
    });

    it('should compare object references', () => {
      const obj = { nested: true };
      const prev = { a: obj };
      const next = { a: obj };
      expect(shallowEqual(prev, next)).toBe(true);

      const next2 = { a: { nested: true } };
      expect(shallowEqual(prev, next2)).toBe(false);
    });
  });

  // ============================================================================
  // Props Comparator Tests
  // ============================================================================

  describe('createPropsComparator', () => {
    it('should ignore excluded props in comparison', () => {
      const compare = createPropsComparator<{ a: number; b: number; callback: () => void }>([
        'callback',
      ]);

      const prev = { a: 1, b: 2, callback: () => {} };
      const next = { a: 1, b: 2, callback: () => {} };

      expect(compare(prev, next)).toBe(true);
    });

    it('should still compare non-excluded props', () => {
      const compare = createPropsComparator<{ a: number; b: number; callback: () => void }>([
        'callback',
      ]);

      const prev = { a: 1, b: 2, callback: () => {} };
      const next = { a: 2, b: 2, callback: () => {} };

      expect(compare(prev, next)).toBe(false);
    });
  });

  // ============================================================================
  // Key Extractor Tests
  // ============================================================================

  describe('createIdKeyExtractor', () => {
    it('should extract id from item', () => {
      const item = { id: 'test-id', name: 'Test' };
      expect(createIdKeyExtractor(item)).toBe('test-id');
    });
  });

  describe('createIndexKeyExtractor', () => {
    it('should return index as string', () => {
      const item = { name: 'Test' };
      expect(createIndexKeyExtractor(item, 5)).toBe('5');
    });
  });

  // ============================================================================
  // Get Item Layout Tests
  // ============================================================================

  describe('createGetItemLayout', () => {
    it('should calculate correct layout for items', () => {
      const getItemLayout = createGetItemLayout(100);

      expect(getItemLayout(null, 0)).toEqual({ length: 100, offset: 0, index: 0 });
      expect(getItemLayout(null, 1)).toEqual({ length: 100, offset: 100, index: 1 });
      expect(getItemLayout(null, 5)).toEqual({ length: 100, offset: 500, index: 5 });
    });

    it('should account for separator height', () => {
      const getItemLayout = createGetItemLayout(100, 10);

      expect(getItemLayout(null, 0)).toEqual({ length: 100, offset: 0, index: 0 });
      expect(getItemLayout(null, 1)).toEqual({ length: 100, offset: 110, index: 1 });
      expect(getItemLayout(null, 5)).toEqual({ length: 100, offset: 550, index: 5 });
    });
  });

  // ============================================================================
  // Image Optimization Tests
  // ============================================================================

  describe('getOptimizedImageUrl', () => {
    it('should optimize picsum URLs with new dimensions', () => {
      const url = 'https://picsum.photos/400/300';
      const optimized = getOptimizedImageUrl(url, 200, 150);
      expect(optimized).toBe('https://picsum.photos/200/150');
    });

    it('should handle picsum URLs with seed', () => {
      const url = 'https://picsum.photos/seed/bella/400/300';
      const optimized = getOptimizedImageUrl(url, 200, 150);
      expect(optimized).toBe('https://picsum.photos/seed/bella/200/150');
    });

    it('should return original URL for non-picsum sources', () => {
      const url = 'https://example.com/image.jpg';
      const optimized = getOptimizedImageUrl(url, 200, 150);
      expect(optimized).toBe(url);
    });
  });
});
