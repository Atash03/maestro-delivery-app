/**
 * ModalTransition Component
 *
 * Provides smooth spring-based modal presentation animations.
 * Features:
 * - Slide-up animation with spring physics
 * - Backdrop fade animation
 * - Gesture-friendly dismissal support
 * - Configurable animation timing
 */

import type React from 'react';
import { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AnimationDurations } from '@/constants/theme';

// ============================================================================
// Types
// ============================================================================

export interface ModalTransitionProps {
  children: React.ReactNode;
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when the modal requests to be closed */
  onClose?: () => void;
  /** Whether to show a backdrop */
  showBackdrop?: boolean;
  /** Backdrop color */
  backdropColor?: string;
  /** Backdrop opacity when fully visible */
  backdropOpacity?: number;
  /** Whether tapping the backdrop closes the modal */
  closeOnBackdropPress?: boolean;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Additional content styles */
  contentStyle?: ViewStyle;
  /** Callback when entry animation completes */
  onEnterComplete?: () => void;
  /** Callback when exit animation completes */
  onExitComplete?: () => void;
  /** Test ID */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
  mass: 0.8,
};

const EXIT_SPRING_CONFIG = {
  damping: 25,
  stiffness: 400,
  mass: 0.6,
};

// ============================================================================
// Component
// ============================================================================

export function ModalTransition({
  children,
  visible,
  onClose,
  showBackdrop = true,
  backdropColor = '#000000',
  backdropOpacity = 0.5,
  closeOnBackdropPress = true,
  duration: _duration = AnimationDurations.normal,
  contentStyle,
  onEnterComplete,
  onExitComplete,
  testID,
}: ModalTransitionProps) {
  // Animation progress: 0 = hidden, 1 = visible
  const progress = useSharedValue(0);

  const handleEnterComplete = useCallback(() => {
    onEnterComplete?.();
  }, [onEnterComplete]);

  const handleExitComplete = useCallback(() => {
    onExitComplete?.();
  }, [onExitComplete]);

  useEffect(() => {
    if (visible) {
      progress.value = withSpring(1, SPRING_CONFIG, (finished) => {
        if (finished) {
          runOnJS(handleEnterComplete)();
        }
      });
    } else {
      progress.value = withSpring(0, EXIT_SPRING_CONFIG, (finished) => {
        if (finished) {
          runOnJS(handleExitComplete)();
        }
      });
    }
  }, [visible, progress, handleEnterComplete, handleExitComplete]);

  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdropPress && onClose) {
      onClose();
    }
  }, [closeOnBackdropPress, onClose]);

  // Backdrop animated style
  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, backdropOpacity]),
    pointerEvents: progress.value > 0.1 ? 'auto' : 'none',
  }));

  // Content animated style - slide up with scale
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [600, 0]) },
      { scale: interpolate(progress.value, [0, 0.5, 1], [0.9, 0.95, 1]) },
    ],
    opacity: interpolate(progress.value, [0, 0.3, 1], [0, 1, 1]),
  }));

  return (
    <>
      {/* Backdrop */}
      {showBackdrop && (
        <Animated.View
          style={[styles.backdrop, { backgroundColor: backdropColor }, backdropAnimatedStyle]}
          testID={testID ? `${testID}-backdrop` : undefined}
        >
          <Pressable
            style={styles.backdropPressable}
            onPress={handleBackdropPress}
            accessibilityLabel="Close modal"
            accessibilityRole="button"
          />
        </Animated.View>
      )}

      {/* Content */}
      <Animated.View
        style={[styles.content, contentStyle, contentAnimatedStyle]}
        testID={testID}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        {children}
      </Animated.View>
    </>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  backdropPressable: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});

// ============================================================================
// Exports
// ============================================================================

export default ModalTransition;
