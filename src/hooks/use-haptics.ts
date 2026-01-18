/**
 * useHaptics hook
 *
 * Provides haptic feedback methods for use in React components.
 * Includes a setting to enable/disable haptics at the user level.
 */

import { useCallback, useMemo } from 'react';

import {
  type HapticFeedbackType,
  haptics,
  isHapticsSupported,
  triggerHaptic,
} from '@/utils/haptics';

export interface UseHapticsOptions {
  /** Whether haptics are enabled (defaults to true) */
  enabled?: boolean;
}

export interface UseHapticsReturn {
  /** Whether haptics are supported on the current platform */
  isSupported: boolean;
  /** Trigger a specific haptic feedback type */
  trigger: (type: HapticFeedbackType) => void;
  /** Light tap feedback for button presses */
  buttonPress: () => void;
  /** Selection feedback for tab switches */
  tabSwitch: () => void;
  /** Medium impact for adding items to cart */
  addToCart: () => void;
  /** Success notification for form submissions */
  formSubmit: () => void;
  /** Error notification for validation errors or failures */
  error: () => void;
  /** Warning notification for alerts */
  warning: () => void;
  /** Heavy impact for important actions like checkout */
  importantAction: () => void;
  /** Soft feedback for toggles and switches */
  toggle: () => void;
  /** Selection feedback for picking items */
  select: () => void;
  /** Rigid feedback for confirmations */
  confirm: () => void;
}

/**
 * Hook for haptic feedback in components
 *
 * @param options - Configuration options
 * @returns Haptic feedback methods
 *
 * @example
 * const { buttonPress, addToCart, error } = useHaptics();
 *
 * const handlePress = () => {
 *   buttonPress();
 *   // ... rest of handler
 * };
 *
 * const handleAddToCart = () => {
 *   addToCart();
 *   // ... add item logic
 * };
 *
 * const handleError = () => {
 *   error();
 *   // ... show error message
 * };
 */
export function useHaptics(options: UseHapticsOptions = {}): UseHapticsReturn {
  const { enabled = true } = options;

  const isSupported = isHapticsSupported();
  const isActive = isSupported && enabled;

  const trigger = useCallback(
    (type: HapticFeedbackType) => {
      if (isActive) {
        triggerHaptic(type);
      }
    },
    [isActive]
  );

  const buttonPress = useCallback(() => {
    if (isActive) haptics.buttonPress();
  }, [isActive]);

  const tabSwitch = useCallback(() => {
    if (isActive) haptics.tabSwitch();
  }, [isActive]);

  const addToCart = useCallback(() => {
    if (isActive) haptics.addToCart();
  }, [isActive]);

  const formSubmit = useCallback(() => {
    if (isActive) haptics.formSubmit();
  }, [isActive]);

  const error = useCallback(() => {
    if (isActive) haptics.error();
  }, [isActive]);

  const warning = useCallback(() => {
    if (isActive) haptics.warning();
  }, [isActive]);

  const importantAction = useCallback(() => {
    if (isActive) haptics.importantAction();
  }, [isActive]);

  const toggle = useCallback(() => {
    if (isActive) haptics.toggle();
  }, [isActive]);

  const select = useCallback(() => {
    if (isActive) haptics.select();
  }, [isActive]);

  const confirm = useCallback(() => {
    if (isActive) haptics.confirm();
  }, [isActive]);

  return useMemo(
    () => ({
      isSupported,
      trigger,
      buttonPress,
      tabSwitch,
      addToCart,
      formSubmit,
      error,
      warning,
      importantAction,
      toggle,
      select,
      confirm,
    }),
    [
      isSupported,
      trigger,
      buttonPress,
      tabSwitch,
      addToCart,
      formSubmit,
      error,
      warning,
      importantAction,
      toggle,
      select,
      confirm,
    ]
  );
}

export default useHaptics;
