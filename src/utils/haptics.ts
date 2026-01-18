/**
 * Haptic feedback utilities
 *
 * Provides a centralized API for haptic feedback throughout the app.
 * Wraps expo-haptics with convenient methods for common feedback patterns.
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptic feedback types for different interactions
 */
export const HapticFeedbackType = {
  /** Light tap feedback - for subtle interactions like selections */
  light: 'light',
  /** Medium tap feedback - for standard button presses */
  medium: 'medium',
  /** Heavy tap feedback - for important actions */
  heavy: 'heavy',
  /** Soft feedback - for gentle interactions */
  soft: 'soft',
  /** Rigid feedback - for decisive actions */
  rigid: 'rigid',
  /** Selection feedback - for UI element selection */
  selection: 'selection',
  /** Success notification - for successful operations */
  success: 'success',
  /** Error notification - for errors and failures */
  error: 'error',
  /** Warning notification - for warnings */
  warning: 'warning',
} as const;

export type HapticFeedbackType = (typeof HapticFeedbackType)[keyof typeof HapticFeedbackType];

/**
 * Check if haptics are supported on the current platform
 */
export function isHapticsSupported(): boolean {
  // Haptics are only supported on iOS and Android (not web)
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Trigger haptic feedback based on type
 *
 * @param type - The type of haptic feedback to trigger
 *
 * @example
 * // Light tap for selection
 * triggerHaptic('light');
 *
 * // Success notification
 * triggerHaptic('success');
 *
 * // Error feedback
 * triggerHaptic('error');
 */
export async function triggerHaptic(type: HapticFeedbackType): Promise<void> {
  if (!isHapticsSupported()) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'soft':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        break;
      case 'rigid':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      default:
        // Default to light impact
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // Silently fail if haptics not available
    // This can happen in some environments (e.g., emulators without haptic support)
  }
}

/**
 * Convenience methods for common haptic patterns
 */
export const haptics = {
  /** Light tap feedback for button presses */
  buttonPress: () => triggerHaptic('light'),

  /** Selection feedback for tab switches */
  tabSwitch: () => triggerHaptic('selection'),

  /** Medium impact for adding items to cart */
  addToCart: () => triggerHaptic('medium'),

  /** Success notification for form submissions */
  formSubmit: () => triggerHaptic('success'),

  /** Error notification for validation errors or failures */
  error: () => triggerHaptic('error'),

  /** Warning notification for alerts */
  warning: () => triggerHaptic('warning'),

  /** Heavy impact for important actions like checkout */
  importantAction: () => triggerHaptic('heavy'),

  /** Soft feedback for toggles and switches */
  toggle: () => triggerHaptic('soft'),

  /** Selection feedback for picking items */
  select: () => triggerHaptic('selection'),

  /** Rigid feedback for confirmations */
  confirm: () => triggerHaptic('rigid'),
} as const;

export default haptics;
