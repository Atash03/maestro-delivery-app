/**
 * SlideUp animation component
 *
 * Wraps children with a slide-up animation on mount using react-native-reanimated's
 * entering/exiting props. Slides from below with optional fade effect.
 */

import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
} from 'react-native-reanimated';

import { AnimationDurations } from '@/constants/theme';

export type SlideDirection = 'up' | 'down';

export interface SlideUpProps extends PropsWithChildren {
  /** Direction to slide from on enter */
  direction?: SlideDirection;
  /** Duration of the slide animation in milliseconds */
  duration?: number;
  /** Delay before the animation starts in milliseconds */
  delay?: number;
  /** Whether to animate out when unmounting */
  animateOut?: boolean;
  /** Duration of the exit animation in milliseconds */
  exitDuration?: number;
  /** Distance to slide in pixels (default: 50) */
  distance?: number;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

/**
 * SlideUp - Animates children with a slide effect on mount
 *
 * @example
 * // Basic usage - slides up from below
 * <SlideUp>
 *   <Text>I will slide up!</Text>
 * </SlideUp>
 *
 * @example
 * // Slide from above
 * <SlideUp direction="down">
 *   <Card>...</Card>
 * </SlideUp>
 *
 * @example
 * // With delay and animate out
 * <SlideUp duration={400} delay={100} animateOut>
 *   <Modal>...</Modal>
 * </SlideUp>
 */
export function SlideUp({
  children,
  direction = 'up',
  duration = AnimationDurations.normal,
  delay = 0,
  animateOut = false,
  exitDuration = AnimationDurations.fast,
  style,
}: SlideUpProps) {
  // Choose entering animation based on direction
  // 'up' means the content enters from below (slides up into view)
  // 'down' means the content enters from above (slides down into view)
  const getEntering = () => {
    const baseEntering = direction === 'up' ? SlideInDown : SlideInUp;
    return baseEntering.duration(duration).delay(delay).springify().damping(20).stiffness(200);
  };

  const getExiting = () => {
    if (!animateOut) return undefined;
    const baseExiting = direction === 'up' ? SlideOutDown : SlideOutUp;
    return baseExiting.duration(exitDuration).springify().damping(20).stiffness(200);
  };

  return (
    <Animated.View entering={getEntering()} exiting={getExiting()} style={style}>
      {children}
    </Animated.View>
  );
}
