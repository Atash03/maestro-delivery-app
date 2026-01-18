/**
 * Tests for haptics utility
 *
 * Tests the haptic feedback utility functions
 */

import { HapticFeedbackType, haptics, isHapticsSupported, triggerHaptic } from '@/utils/haptics';

// The haptics utility is mocked in jest.setup.js
// These tests verify the module structure and behavior

describe('haptics utility', () => {
  describe('HapticFeedbackType', () => {
    it('should define all feedback types', () => {
      expect(HapticFeedbackType.light).toBe('light');
      expect(HapticFeedbackType.medium).toBe('medium');
      expect(HapticFeedbackType.heavy).toBe('heavy');
      expect(HapticFeedbackType.soft).toBe('soft');
      expect(HapticFeedbackType.rigid).toBe('rigid');
      expect(HapticFeedbackType.selection).toBe('selection');
      expect(HapticFeedbackType.success).toBe('success');
      expect(HapticFeedbackType.error).toBe('error');
      expect(HapticFeedbackType.warning).toBe('warning');
    });
  });

  describe('isHapticsSupported', () => {
    it('should be a function', () => {
      expect(typeof isHapticsSupported).toBe('function');
    });

    it('should return a boolean', () => {
      const result = isHapticsSupported();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('triggerHaptic', () => {
    it('should be a function', () => {
      expect(typeof triggerHaptic).toBe('function');
    });

    it('should return a promise', () => {
      const result = triggerHaptic('light');
      expect(result).toBeInstanceOf(Promise);
    });

    it('should not throw for valid types', async () => {
      await expect(triggerHaptic('light')).resolves.not.toThrow();
      await expect(triggerHaptic('medium')).resolves.not.toThrow();
      await expect(triggerHaptic('heavy')).resolves.not.toThrow();
      await expect(triggerHaptic('soft')).resolves.not.toThrow();
      await expect(triggerHaptic('rigid')).resolves.not.toThrow();
      await expect(triggerHaptic('selection')).resolves.not.toThrow();
      await expect(triggerHaptic('success')).resolves.not.toThrow();
      await expect(triggerHaptic('error')).resolves.not.toThrow();
      await expect(triggerHaptic('warning')).resolves.not.toThrow();
    });
  });

  describe('haptics convenience methods', () => {
    it('should have buttonPress method', () => {
      expect(typeof haptics.buttonPress).toBe('function');
    });

    it('should have tabSwitch method', () => {
      expect(typeof haptics.tabSwitch).toBe('function');
    });

    it('should have addToCart method', () => {
      expect(typeof haptics.addToCart).toBe('function');
    });

    it('should have formSubmit method', () => {
      expect(typeof haptics.formSubmit).toBe('function');
    });

    it('should have error method', () => {
      expect(typeof haptics.error).toBe('function');
    });

    it('should have warning method', () => {
      expect(typeof haptics.warning).toBe('function');
    });

    it('should have importantAction method', () => {
      expect(typeof haptics.importantAction).toBe('function');
    });

    it('should have toggle method', () => {
      expect(typeof haptics.toggle).toBe('function');
    });

    it('should have select method', () => {
      expect(typeof haptics.select).toBe('function');
    });

    it('should have confirm method', () => {
      expect(typeof haptics.confirm).toBe('function');
    });

    it('should return promises from all methods', async () => {
      // All convenience methods return promises
      await expect(haptics.buttonPress()).resolves.toBeUndefined();
      await expect(haptics.tabSwitch()).resolves.toBeUndefined();
      await expect(haptics.addToCart()).resolves.toBeUndefined();
      await expect(haptics.formSubmit()).resolves.toBeUndefined();
      await expect(haptics.error()).resolves.toBeUndefined();
      await expect(haptics.warning()).resolves.toBeUndefined();
      await expect(haptics.importantAction()).resolves.toBeUndefined();
      await expect(haptics.toggle()).resolves.toBeUndefined();
      await expect(haptics.select()).resolves.toBeUndefined();
      await expect(haptics.confirm()).resolves.toBeUndefined();
    });
  });
});
