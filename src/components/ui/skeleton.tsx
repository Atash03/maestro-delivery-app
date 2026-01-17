/**
 * Skeleton component for loading states
 * Features a shimmer animation effect
 */

import { useEffect } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps {
  /** Width of the skeleton (number or string like '100%') */
  width?: number | string;
  /** Height of the skeleton */
  height?: number;
  /** Variant shape of the skeleton */
  variant?: SkeletonVariant;
  /** Border radius (only for 'rounded' variant) */
  radius?: number;
  /** Whether to animate the shimmer effect */
  animated?: boolean;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = '100%',
  height = 16,
  variant = 'text',
  radius,
  animated = true,
  style,
}: SkeletonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      shimmerProgress.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }
  }, [animated, shimmerProgress]);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'circular':
        return {
          borderRadius: typeof height === 'number' ? height / 2 : BorderRadius.full,
        };
      case 'rectangular':
        return {
          borderRadius: 0,
        };
      case 'rounded':
        return {
          borderRadius: radius ?? BorderRadius.md,
        };
      default:
        return {
          borderRadius: BorderRadius.sm,
        };
    }
  };

  const backgroundColor = isDark ? colors.backgroundTertiary : colors.backgroundTertiary;
  const shimmerColor = isDark ? colors.backgroundSecondary : colors.backgroundSecondary;

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerProgress.value, [0, 1], [-100, 100]);

    return {
      transform: [{ translateX: `${translateX}%` as unknown as number }],
    };
  });

  return (
    <View style={[styles.container, { width, height, backgroundColor }, getVariantStyles(), style]}>
      {animated && (
        <Animated.View
          style={[
            styles.shimmer,
            {
              backgroundColor: shimmerColor,
            },
            animatedStyle,
          ]}
        />
      )}
    </View>
  );
}

/**
 * Pre-composed skeleton for text lines
 */
export interface SkeletonTextProps {
  /** Number of lines to render */
  lines?: number;
  /** Spacing between lines */
  spacing?: number;
  /** Width of the last line (percentage) */
  lastLineWidth?: number | string;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

export function SkeletonText({
  lines = 3,
  spacing = Spacing[2],
  lastLineWidth = '60%',
  style,
}: SkeletonTextProps) {
  const lineKeys = Array.from({ length: lines }, (_, i) => `line-${i}`);

  return (
    <View style={style}>
      {lineKeys.map((key, index) => (
        <Skeleton
          key={key}
          height={14}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          style={index > 0 ? { marginTop: spacing } : undefined}
        />
      ))}
    </View>
  );
}

/**
 * Pre-composed skeleton for cards
 */
export interface SkeletonCardProps {
  /** Show image placeholder */
  showImage?: boolean;
  /** Height of the image */
  imageHeight?: number;
  /** Number of text lines */
  lines?: number;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

export function SkeletonCard({
  showImage = true,
  imageHeight = 120,
  lines = 2,
  style,
}: SkeletonCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {showImage && (
        <Skeleton height={imageHeight} variant="rectangular" style={styles.cardImage} />
      )}
      <View style={styles.cardContent}>
        <Skeleton height={18} width="70%" style={styles.cardTitle} />
        <SkeletonText lines={lines} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardImage: {
    borderRadius: 0,
  },
  cardContent: {
    padding: Spacing[3],
  },
  cardTitle: {
    marginBottom: Spacing[2],
  },
});
