/**
 * Tests for useHaptics hook
 *
 * Tests the haptic feedback hook functionality
 */

import { useHaptics } from '@/hooks/use-haptics';
import { haptics as hapticsUtil } from '@/utils/haptics';

// Mock react-native Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

// Mock the haptics utility
jest.mock('@/utils/haptics', () => ({
  isHapticsSupported: jest.fn(() => true),
  triggerHaptic: jest.fn().mockResolvedValue(undefined),
  haptics: {
    buttonPress: jest.fn().mockResolvedValue(undefined),
    tabSwitch: jest.fn().mockResolvedValue(undefined),
    addToCart: jest.fn().mockResolvedValue(undefined),
    formSubmit: jest.fn().mockResolvedValue(undefined),
    error: jest.fn().mockResolvedValue(undefined),
    warning: jest.fn().mockResolvedValue(undefined),
    importantAction: jest.fn().mockResolvedValue(undefined),
    toggle: jest.fn().mockResolvedValue(undefined),
    select: jest.fn().mockResolvedValue(undefined),
    confirm: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (fn: (...args: unknown[]) => unknown) => fn,
  useMemo: (fn: () => unknown) => fn(),
}));

describe('useHaptics hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should return all haptic methods', () => {
      const result = useHaptics();

      expect(result.isSupported).toBe(true);
      expect(typeof result.trigger).toBe('function');
      expect(typeof result.buttonPress).toBe('function');
      expect(typeof result.tabSwitch).toBe('function');
      expect(typeof result.addToCart).toBe('function');
      expect(typeof result.formSubmit).toBe('function');
      expect(typeof result.error).toBe('function');
      expect(typeof result.warning).toBe('function');
      expect(typeof result.importantAction).toBe('function');
      expect(typeof result.toggle).toBe('function');
      expect(typeof result.select).toBe('function');
      expect(typeof result.confirm).toBe('function');
    });

    it('should respect the enabled option', () => {
      const enabledResult = useHaptics({ enabled: true });
      const disabledResult = useHaptics({ enabled: false });

      // Both should return the same structure
      expect(enabledResult.isSupported).toBe(true);
      expect(disabledResult.isSupported).toBe(true);
    });
  });

  describe('haptic methods when enabled', () => {
    it('should call buttonPress', () => {
      const result = useHaptics();
      result.buttonPress();
      expect(hapticsUtil.buttonPress).toHaveBeenCalled();
    });

    it('should call tabSwitch', () => {
      const result = useHaptics();
      result.tabSwitch();
      expect(hapticsUtil.tabSwitch).toHaveBeenCalled();
    });

    it('should call addToCart', () => {
      const result = useHaptics();
      result.addToCart();
      expect(hapticsUtil.addToCart).toHaveBeenCalled();
    });

    it('should call formSubmit', () => {
      const result = useHaptics();
      result.formSubmit();
      expect(hapticsUtil.formSubmit).toHaveBeenCalled();
    });

    it('should call error', () => {
      const result = useHaptics();
      result.error();
      expect(hapticsUtil.error).toHaveBeenCalled();
    });

    it('should call warning', () => {
      const result = useHaptics();
      result.warning();
      expect(hapticsUtil.warning).toHaveBeenCalled();
    });

    it('should call importantAction', () => {
      const result = useHaptics();
      result.importantAction();
      expect(hapticsUtil.importantAction).toHaveBeenCalled();
    });

    it('should call toggle', () => {
      const result = useHaptics();
      result.toggle();
      expect(hapticsUtil.toggle).toHaveBeenCalled();
    });

    it('should call select', () => {
      const result = useHaptics();
      result.select();
      expect(hapticsUtil.select).toHaveBeenCalled();
    });

    it('should call confirm', () => {
      const result = useHaptics();
      result.confirm();
      expect(hapticsUtil.confirm).toHaveBeenCalled();
    });
  });

  describe('haptic methods when disabled', () => {
    it('should not call buttonPress when disabled', () => {
      const result = useHaptics({ enabled: false });
      result.buttonPress();
      expect(hapticsUtil.buttonPress).not.toHaveBeenCalled();
    });

    it('should not call tabSwitch when disabled', () => {
      const result = useHaptics({ enabled: false });
      result.tabSwitch();
      expect(hapticsUtil.tabSwitch).not.toHaveBeenCalled();
    });

    it('should not call addToCart when disabled', () => {
      const result = useHaptics({ enabled: false });
      result.addToCart();
      expect(hapticsUtil.addToCart).not.toHaveBeenCalled();
    });

    it('should not call formSubmit when disabled', () => {
      const result = useHaptics({ enabled: false });
      result.formSubmit();
      expect(hapticsUtil.formSubmit).not.toHaveBeenCalled();
    });

    it('should not call error when disabled', () => {
      const result = useHaptics({ enabled: false });
      result.error();
      expect(hapticsUtil.error).not.toHaveBeenCalled();
    });
  });
});
