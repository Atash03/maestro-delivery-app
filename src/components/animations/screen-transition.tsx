/**
 * ScreenTransition Component
 *
 * Provides smooth screen transition animations for navigation.
 * Features:
 * - Fade and slide animations for screen entry/exit
 * - Configurable animation direction and timing
 * - Integration with shared transition context
 */

import type React from 'react';
import { useCallback, useEffect } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AnimationDurations } from '@/constants/theme';
import { useSharedTransitionOptional } from '@/context';

// ============================================================================
// Types
// ============================================================================

export interface ScreenTransitionProps {
  children: React.ReactNode;
  /** Animation type */
  type?: 'fade' | 'slide' | 'scale' | 'fadeSlide';
  /** Animation direction for slide animations */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Animation duration in milliseconds */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Use spring animation instead of timing */
  useSpring?: boolean;
  /** Whether the screen is active (for exit animations) */
  isActive?: boolean;
  /** Callback when entry animation completes */
  onEnterComplete?: () => void;
  /** Callback when exit animation completes */
  onExitComplete?: () => void;
  /** Additional styles */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

const SLIDE_DISTANCE = 50;

// ============================================================================
// Component
// ============================================================================

export function ScreenTransition({
  children,
  type = 'fadeSlide',
  direction = 'up',
  duration = AnimationDurations.normal,
  delay = 0,
  useSpring: useSpringAnimation = false,
  isActive = true,
  onEnterComplete,
  onExitComplete,
  style,
  testID,
}: ScreenTransitionProps) {
  const sharedTransition = useSharedTransitionOptional();

  // Animation progress: 0 = hidden, 1 = visible
  const progress = useSharedValue(0);

  // Handle entry animation
  const runEnterAnimation = useCallback(() => {
    const animate = useSpringAnimation
      ? () => withSpring(1, SPRING_CONFIG)
      : () => withTiming(1, { duration });

    setTimeout(() => {
      progress.value = animate();
    }, delay);
  }, [progress, duration, delay, useSpringAnimation]);

  // Handle exit animation
  const handleExitComplete = useCallback(() => {
    onExitComplete?.();
    sharedTransition?.endTransition();
  }, [onExitComplete, sharedTransition]);

  const runExitAnimation = useCallback(() => {
    const animate = useSpringAnimation
      ? () => withSpring(0, SPRING_CONFIG)
      : () =>
          withTiming(0, { duration: duration * 0.8 }, (finished) => {
            if (finished) {
              runOnJS(handleExitComplete)();
            }
          });

    progress.value = animate();
  }, [progress, duration, useSpringAnimation, handleExitComplete]);

  useEffect(() => {
    if (isActive) {
      runEnterAnimation();
      sharedTransition?.startTransition();
    } else {
      runExitAnimation();
    }
  }, [isActive, runEnterAnimation, runExitAnimation, sharedTransition]);

  // Handle entry complete
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onEnterComplete?.();
        sharedTransition?.endTransition();
      }, duration + delay);
      return () => clearTimeout(timer);
    }
  }, [isActive, duration, delay, onEnterComplete, sharedTransition]);

  // Calculate slide offset based on direction
  const getSlideOffset = useCallback(
    (progress: number): { translateX: number; translateY: number } => {
      const distance = SLIDE_DISTANCE;

      switch (direction) {
        case 'left':
          return {
            translateX: interpolate(progress, [0, 1], [-distance, 0]),
            translateY: 0,
          };
        case 'right':
          return {
            translateX: interpolate(progress, [0, 1], [distance, 0]),
            translateY: 0,
          };
        case 'up':
          return {
            translateX: 0,
            translateY: interpolate(progress, [0, 1], [distance, 0]),
          };
        case 'down':
          return {
            translateX: 0,
            translateY: interpolate(progress, [0, 1], [-distance, 0]),
          };
        default:
          return { translateX: 0, translateY: 0 };
      }
    },
    [direction]
  );

  // Animated style based on animation type
  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;

    switch (type) {
      case 'fade':
        return {
          opacity: p,
        };

      case 'slide': {
        const offset = getSlideOffset(p);
        return {
          transform: [{ translateX: offset.translateX }, { translateY: offset.translateY }],
        };
      }

      case 'scale':
        return {
          opacity: p,
          transform: [{ scale: interpolate(p, [0, 1], [0.95, 1]) }],
        };

      default: {
        // fadeSlide (default)
        const offset = getSlideOffset(p);
        return {
          opacity: p,
          transform: [{ translateX: offset.translateX }, { translateY: offset.translateY }],
        };
      }
    }
  });

  return (
    <Animated.View style={[styles.container, style, animatedStyle]} testID={testID}>
      {children}
    </Animated.View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// ============================================================================
// Exports
// ============================================================================

export default ScreenTransition;
