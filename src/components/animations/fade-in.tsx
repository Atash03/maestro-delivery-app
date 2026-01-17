/**
 * FadeIn animation component
 *
 * Wraps children with a fade-in animation on mount using react-native-reanimated's
 * entering/exiting props for smooth layout animations.
 */

import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeOut, FadeIn as ReanimatedFadeIn } from 'react-native-reanimated';

import { AnimationDurations } from '@/constants/theme';

export interface FadeInProps extends PropsWithChildren {
  /** Duration of the fade animation in milliseconds */
  duration?: number;
  /** Delay before the animation starts in milliseconds */
  delay?: number;
  /** Whether to animate out when unmounting */
  animateOut?: boolean;
  /** Duration of the fade out animation in milliseconds */
  exitDuration?: number;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

/**
 * FadeIn - Animates children with a fade effect on mount
 *
 * @example
 * // Basic usage
 * <FadeIn>
 *   <Text>I will fade in!</Text>
 * </FadeIn>
 *
 * @example
 * // With delay and custom duration
 * <FadeIn duration={500} delay={200}>
 *   <Card>...</Card>
 * </FadeIn>
 */
export function FadeIn({
  children,
  duration = AnimationDurations.normal,
  delay = 0,
  animateOut = false,
  exitDuration = AnimationDurations.fast,
  style,
}: FadeInProps) {
  const entering = ReanimatedFadeIn.duration(duration).delay(delay);
  const exiting = animateOut ? FadeOut.duration(exitDuration) : undefined;

  return (
    <Animated.View entering={entering} exiting={exiting} style={style}>
      {children}
    </Animated.View>
  );
}
