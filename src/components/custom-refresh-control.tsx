/**
 * CustomRefreshControl Component
 *
 * A custom pull-to-refresh control with animated feedback.
 * Uses react-native-reanimated for smooth animations.
 *
 * Features:
 * - Animated rotation during refresh
 * - Food-themed bouncing icon animation
 * - Pulsating scale effect
 * - Theme-aware colors
 * - Customizable colors and size
 */

import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { RefreshControl, type RefreshControlProps, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Colors, PrimaryColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================================================
// Types
// ============================================================================

export interface CustomRefreshControlProps
  extends Omit<RefreshControlProps, 'colors' | 'tintColor'> {
  /** Custom tint color for the refresh indicator */
  tintColor?: string;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Component
// ============================================================================

export function CustomRefreshControl({
  refreshing,
  onRefresh,
  tintColor,
  testID,
  ...props
}: CustomRefreshControlProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const rotation = useSharedValue(0);

  useEffect(() => {
    if (refreshing) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [refreshing, rotation]);

  const refreshColor = tintColor ?? PrimaryColors[500];

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={refreshColor}
      colors={[refreshColor]}
      progressBackgroundColor={colors.card}
      testID={testID}
      {...props}
    />
  );
}

// ============================================================================
// Animated Refresh Indicator (for custom implementations)
// ============================================================================

export interface RefreshIndicatorProps {
  /** Whether the refresh is in progress */
  isRefreshing: boolean;
  /** Size of the indicator */
  size?: number;
  /** Color of the indicator */
  color?: string;
  /** Variant of the animation */
  variant?: 'spin' | 'bounce' | 'pulse';
}

export function RefreshIndicator({
  isRefreshing,
  size = 24,
  color,
  variant = 'spin',
}: RefreshIndicatorProps) {
  const refreshColor = color ?? PrimaryColors[500];

  const rotation = useSharedValue(0);
  const bounce = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRefreshing) {
      // Rotation animation
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
        false
      );

      // Bounce animation
      if (variant === 'bounce') {
        bounce.value = withRepeat(
          withSequence(
            withSpring(-8, { damping: 6, stiffness: 200 }),
            withSpring(0, { damping: 6, stiffness: 200 })
          ),
          -1,
          false
        );
      }

      // Pulse animation
      if (variant === 'pulse') {
        scale.value = withRepeat(
          withSequence(
            withTiming(1.2, { duration: 300, easing: Easing.out(Easing.ease) }),
            withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) })
          ),
          -1,
          false
        );
      }
    } else {
      cancelAnimation(rotation);
      cancelAnimation(bounce);
      cancelAnimation(scale);
      rotation.value = 0;
      bounce.value = 0;
      scale.value = 1;
    }
  }, [isRefreshing, rotation, bounce, scale, variant]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { translateY: bounce.value },
      { scale: scale.value },
    ],
  }));

  if (!isRefreshing) return null;

  return (
    <View style={styles.indicatorContainer}>
      <Animated.View style={animatedStyle}>
        <Ionicons name="refresh" size={size} color={refreshColor} />
      </Animated.View>
    </View>
  );
}

// ============================================================================
// Food-themed Refresh Indicator
// ============================================================================

export interface FoodRefreshIndicatorProps {
  /** Whether the refresh is in progress */
  isRefreshing: boolean;
  /** Size of the indicator */
  size?: number;
  /** Color of the indicator */
  color?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * A delightful food-themed refresh indicator with bouncing animation.
 * Shows a restaurant/food icon that bounces and pulses during refresh.
 */
export function FoodRefreshIndicator({
  isRefreshing,
  size = 32,
  color,
  testID,
}: FoodRefreshIndicatorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const refreshColor = color ?? PrimaryColors[500];

  const bounce = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isRefreshing) {
      // Fade in
      opacity.value = withTiming(1, { duration: 200 });

      // Bouncing animation - like a chef juggling
      bounce.value = withRepeat(
        withSequence(
          withDelay(0, withSpring(-12, { damping: 4, stiffness: 300, mass: 0.5 })),
          withSpring(0, { damping: 4, stiffness: 300, mass: 0.5 })
        ),
        -1,
        false
      );

      // Subtle pulsating scale
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 350, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 350, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      // Fade out
      opacity.value = withTiming(0, { duration: 150 });
      cancelAnimation(bounce);
      cancelAnimation(scale);
      bounce.value = withSpring(0);
      scale.value = withSpring(1);
    }
  }, [isRefreshing, bounce, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: bounce.value }, { scale: scale.value }],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0, 1], [0, 0.2]),
    transform: [
      { scaleX: interpolate(scale.value, [1, 1.15], [1, 1.2]) },
      { scaleY: interpolate(bounce.value, [-12, 0], [0.5, 1]) },
    ],
  }));

  return (
    <View style={styles.foodIndicatorContainer} testID={testID}>
      {/* Shadow/reflection effect */}
      <Animated.View
        style={[styles.foodIndicatorShadow, { backgroundColor: colors.textTertiary }, shadowStyle]}
      />
      {/* Main icon */}
      <Animated.View style={[styles.foodIndicatorIcon, animatedStyle]}>
        <Ionicons name="restaurant" size={size} color={refreshColor} />
      </Animated.View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  indicatorContainer: {
    padding: Spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodIndicatorContainer: {
    padding: Spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  foodIndicatorIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodIndicatorShadow: {
    position: 'absolute',
    bottom: Spacing[2],
    width: 24,
    height: 6,
    borderRadius: 12,
  },
});
