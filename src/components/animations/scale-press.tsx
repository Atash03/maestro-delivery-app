/**
 * ScalePress animation component
 *
 * Wraps children with a pressable container that scales down on press
 * for tactile feedback. Uses react-native-reanimated for smooth animations
 * and includes haptic feedback support.
 */

import type { PropsWithChildren } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AnimationDurations } from '@/constants/theme';
import { haptics } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ScalePressProps extends PropsWithChildren, Omit<PressableProps, 'style'> {
  /** Scale value when pressed (0-1, default: 0.97) */
  pressedScale?: number;
  /** Opacity value when pressed (0-1, default: 0.9) */
  pressedOpacity?: number;
  /** Whether to use spring animation (default: true) */
  springy?: boolean;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Enable haptic feedback on press (default: true) */
  hapticFeedback?: boolean;
}

/**
 * ScalePress - Wraps children with press animation feedback
 *
 * @example
 * // Basic usage
 * <ScalePress onPress={handlePress}>
 *   <Card>Tap me!</Card>
 * </ScalePress>
 *
 * @example
 * // Custom scale and opacity
 * <ScalePress pressedScale={0.95} pressedOpacity={0.8} onPress={handlePress}>
 *   <View>...</View>
 * </ScalePress>
 *
 * @example
 * // Non-springy animation
 * <ScalePress springy={false} onPress={handlePress}>
 *   <Button>Submit</Button>
 * </ScalePress>
 */
export function ScalePress({
  children,
  pressedScale = 0.97,
  pressedOpacity = 0.9,
  springy = true,
  style,
  hapticFeedback = true,
  onPressIn,
  onPressOut,
  disabled,
  ...pressableProps
}: ScalePressProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn: PressableProps['onPressIn'] = (event) => {
    if (springy) {
      scale.value = withSpring(pressedScale, { damping: 15, stiffness: 400 });
    } else {
      scale.value = withTiming(pressedScale, { duration: AnimationDurations.instant });
    }
    opacity.value = withTiming(pressedOpacity, { duration: AnimationDurations.instant });
    // Trigger haptic feedback on press
    if (hapticFeedback && !disabled) {
      haptics.buttonPress();
    }
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps['onPressOut'] = (event) => {
    if (springy) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    } else {
      scale.value = withTiming(1, { duration: AnimationDurations.instant });
    }
    opacity.value = withTiming(1, { duration: AnimationDurations.instant });
    onPressOut?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.container, animatedStyle, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...pressableProps}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // Ensure the pressable doesn't interfere with child layout
  },
});
