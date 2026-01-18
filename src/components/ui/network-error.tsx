/**
 * NetworkError component
 *
 * Displays a full-screen error state when network requests fail.
 * Includes an animated illustration, error message, and retry button.
 */

import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { Button } from './button';

export interface NetworkErrorProps {
  /** Main error title */
  title?: string;
  /** Error description message */
  message?: string;
  /** Callback when retry button is pressed */
  onRetry?: () => void;
  /** Whether retry is in progress */
  retrying?: boolean;
  /** Custom style overrides for the container */
  style?: StyleProp<ViewStyle>;
  /** Whether to show the retry button */
  showRetry?: boolean;
}

/**
 * NetworkError - Full-screen network error state with retry option
 *
 * @example
 * <NetworkError
 *   title="Connection Lost"
 *   message="Please check your internet connection"
 *   onRetry={() => refetch()}
 *   retrying={isRefetching}
 * />
 */
export function NetworkError({
  title = 'Something went wrong',
  message = "We couldn't load the content. Please check your internet connection and try again.",
  onRetry,
  retrying = false,
  style,
  showRetry = true,
}: NetworkErrorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Animation for the wifi icon
  const iconRotation = useSharedValue(0);
  const iconOpacity = useSharedValue(1);

  useEffect(() => {
    // Subtle pulse animation
    iconOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: AnimationDurations.slow, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: AnimationDurations.slow, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Gentle shake animation
    iconRotation.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(3, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [iconRotation, iconOpacity]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
    opacity: iconOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <View style={styles.content}>
        {/* Animated Icon */}
        <Animated.View
          style={[styles.iconContainer, { backgroundColor: colors.errorLight }, animatedIconStyle]}
        >
          <Ionicons name="cloud-offline-outline" size={48} color={colors.error} />
        </Animated.View>

        {/* Error Text */}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <Button
            onPress={onRetry}
            loading={retrying}
            disabled={retrying}
            leftIcon="refresh"
            style={styles.retryButton}
          >
            {retrying ? 'Retrying...' : 'Try Again'}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[6],
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  title: {
    ...Typography['2xl'],
    fontWeight: FontWeights.bold as '700',
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  message: {
    ...Typography.base,
    textAlign: 'center',
    marginBottom: Spacing[6],
  },
  retryButton: {
    minWidth: 140,
  },
});
