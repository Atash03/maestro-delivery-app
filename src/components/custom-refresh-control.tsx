/**
 * CustomRefreshControl Component
 *
 * A custom pull-to-refresh control with animated feedback.
 * Uses react-native-reanimated for smooth animations.
 *
 * Features:
 * - Animated rotation during refresh
 * - Theme-aware colors
 * - Customizable colors and size
 */

import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { RefreshControl, type RefreshControlProps, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// Note: useAnimatedStyle is used in RefreshIndicator component

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
}

export function RefreshIndicator({ isRefreshing, size = 24, color }: RefreshIndicatorProps) {
  const refreshColor = color ?? PrimaryColors[500];

  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isRefreshing) {
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
  }, [isRefreshing, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
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
// Styles
// ============================================================================

const styles = StyleSheet.create({
  indicatorContainer: {
    padding: Spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
