/**
 * EmptyState component
 *
 * A flexible empty state component used throughout the app for various scenarios:
 * - No restaurants found
 * - No search results
 * - No orders yet
 * - Empty cart
 * - And more...
 */

import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

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

export type EmptyStateVariant =
  | 'no-restaurants'
  | 'no-search-results'
  | 'no-orders'
  | 'empty-cart'
  | 'no-favorites'
  | 'no-addresses'
  | 'no-reviews'
  | 'no-issues'
  | 'custom';

export interface EmptyStateProps {
  /** Predefined variant for common empty states */
  variant?: EmptyStateVariant;
  /** Custom icon name (overrides variant default) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Main title text (overrides variant default) */
  title?: string;
  /** Description message (overrides variant default) */
  message?: string;
  /** Action button text */
  actionLabel?: string;
  /** Callback when action button is pressed */
  onAction?: () => void;
  /** Custom content to render below the message */
  children?: ReactNode;
  /** Custom style overrides for the container */
  style?: StyleProp<ViewStyle>;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to animate the component on mount */
  animated?: boolean;
}

interface EmptyStateConfig {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

const EMPTY_STATE_CONFIGS: Record<Exclude<EmptyStateVariant, 'custom'>, EmptyStateConfig> = {
  'no-restaurants': {
    icon: 'restaurant-outline',
    title: 'No restaurants found',
    message:
      "We couldn't find any restaurants matching your criteria. Try adjusting your filters or search.",
  },
  'no-search-results': {
    icon: 'search-outline',
    title: 'No results found',
    message:
      "We couldn't find anything matching your search. Try different keywords or browse our categories.",
  },
  'no-orders': {
    icon: 'receipt-outline',
    title: 'No orders yet',
    message:
      "You haven't placed any orders yet. Start exploring restaurants to find your next meal!",
  },
  'empty-cart': {
    icon: 'cart-outline',
    title: 'Your cart is empty',
    message:
      "Looks like you haven't added anything to your cart yet. Browse menus and add items to get started.",
  },
  'no-favorites': {
    icon: 'heart-outline',
    title: 'No favorites yet',
    message:
      "You haven't saved any favorites yet. Tap the heart icon on restaurants to save them here.",
  },
  'no-addresses': {
    icon: 'location-outline',
    title: 'No saved addresses',
    message: 'Add your delivery addresses to make ordering faster and easier.',
  },
  'no-reviews': {
    icon: 'chatbubble-outline',
    title: 'No reviews yet',
    message: 'Be the first to review! Share your experience to help others.',
  },
  'no-issues': {
    icon: 'checkmark-circle-outline',
    title: 'No issues reported',
    message: 'Great! You have no open issues. If you need help, feel free to contact support.',
  },
};

/**
 * EmptyState - Flexible empty state component for various scenarios
 *
 * @example
 * // Using a predefined variant
 * <EmptyState
 *   variant="no-restaurants"
 *   actionLabel="Clear Filters"
 *   onAction={() => clearFilters()}
 * />
 *
 * @example
 * // Custom empty state
 * <EmptyState
 *   variant="custom"
 *   icon="notifications-off-outline"
 *   title="All caught up!"
 *   message="You have no new notifications"
 * />
 */
export function EmptyState({
  variant = 'custom',
  icon,
  title,
  message,
  actionLabel,
  onAction,
  children,
  style,
  size = 'md',
  animated = true,
}: EmptyStateProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Get config from variant or use custom values
  const config = variant !== 'custom' ? EMPTY_STATE_CONFIGS[variant] : null;
  const displayIcon = icon ?? config?.icon ?? 'help-circle-outline';
  const displayTitle = title ?? config?.title ?? 'Nothing here';
  const displayMessage = message ?? config?.message ?? '';

  // Size-based styles
  const sizeStyles = {
    sm: {
      iconSize: 40,
      iconContainerSize: 72,
      titleStyle: Typography.lg,
      messageStyle: Typography.sm,
      padding: Spacing[4],
    },
    md: {
      iconSize: 48,
      iconContainerSize: 96,
      titleStyle: Typography['2xl'],
      messageStyle: Typography.base,
      padding: Spacing[6],
    },
    lg: {
      iconSize: 64,
      iconContainerSize: 120,
      titleStyle: Typography['3xl'],
      messageStyle: Typography.lg,
      padding: Spacing[8],
    },
  };

  const currentSize = sizeStyles[size];

  const content = (
    <>
      {/* Icon */}
      <Animated.View
        entering={animated ? FadeIn.delay(100).duration(AnimationDurations.normal) : undefined}
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.backgroundTertiary,
            width: currentSize.iconContainerSize,
            height: currentSize.iconContainerSize,
          },
        ]}
      >
        <Ionicons name={displayIcon} size={currentSize.iconSize} color={colors.textTertiary} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={animated ? FadeInDown.delay(200).duration(AnimationDurations.normal) : undefined}
        style={[styles.title, currentSize.titleStyle, { color: colors.text }]}
      >
        {displayTitle}
      </Animated.Text>

      {/* Message */}
      {displayMessage && (
        <Animated.Text
          entering={
            animated ? FadeInDown.delay(300).duration(AnimationDurations.normal) : undefined
          }
          style={[styles.message, currentSize.messageStyle, { color: colors.textSecondary }]}
        >
          {displayMessage}
        </Animated.Text>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <Animated.View
          entering={
            animated ? FadeInDown.delay(400).duration(AnimationDurations.normal) : undefined
          }
          style={styles.actionContainer}
        >
          <Button onPress={onAction} variant="primary">
            {actionLabel}
          </Button>
        </Animated.View>
      )}

      {/* Custom Children */}
      {children && (
        <Animated.View
          entering={
            animated ? FadeInDown.delay(500).duration(AnimationDurations.normal) : undefined
          }
          style={styles.childrenContainer}
        >
          {children}
        </Animated.View>
      )}
    </>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, padding: currentSize.padding },
        style,
      ]}
    >
      <View style={styles.content}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  title: {
    fontWeight: FontWeights.bold as '700',
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  message: {
    textAlign: 'center',
    marginBottom: Spacing[4],
  },
  actionContainer: {
    marginTop: Spacing[2],
  },
  childrenContainer: {
    marginTop: Spacing[4],
    width: '100%',
    alignItems: 'center',
  },
});
