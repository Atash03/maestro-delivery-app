/**
 * OrderCard Component
 *
 * A card component for displaying order information in the order history.
 * Features:
 * - Restaurant image and name
 * - Order date and total amount
 * - Status badge with appropriate color
 * - Item count display
 * - Press animation using react-native-reanimated
 * - Theme support (light/dark mode)
 */

import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRatingStore } from '@/stores';
import type { Order, OrderStatus } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface OrderCardProps {
  /** The order data to display */
  order: Order;
  /** Callback when card is pressed */
  onPress?: (order: Order) => void;
  /** Callback when rate button is pressed */
  onRatePress?: (order: Order) => void;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

const IMAGE_SIZE = 72;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the badge variant based on order status
 */
export function getStatusBadgeVariant(status: OrderStatus): BadgeVariant {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    case 'ON_THE_WAY':
    case 'PICKED_UP':
      return 'primary';
    case 'PREPARING':
    case 'READY':
      return 'warning';
    default:
      return 'default';
  }
}

/**
 * Get user-friendly status text
 */
export function getStatusText(status: OrderStatus): string {
  const statusTexts: Record<OrderStatus, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY: 'Ready',
    PICKED_UP: 'Picked Up',
    ON_THE_WAY: 'On the Way',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };
  return statusTexts[status] || status;
}

/**
 * Format order date for display
 */
export function formatOrderDate(date: Date): string {
  const orderDate = new Date(date);

  if (isToday(orderDate)) {
    return `Today at ${format(orderDate, 'h:mm a')}`;
  }

  if (isYesterday(orderDate)) {
    return `Yesterday at ${format(orderDate, 'h:mm a')}`;
  }

  return format(orderDate, 'MMM d, yyyy');
}

/**
 * Get total item count from order
 */
export function getItemCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Format item count text
 */
export function formatItemCount(count: number): string {
  return count === 1 ? '1 item' : `${count} items`;
}

// ============================================================================
// Component
// ============================================================================

export const OrderCard = memo(function OrderCard({
  order,
  onPress,
  onRatePress,
  testID,
}: OrderCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Check if order can be rated
  const hasRating = useRatingStore((state) => state.hasRating);
  const isDelivered = order.status === 'DELIVERED';
  const isRated = hasRating(order.id);
  const showRateButton = isDelivered && !isRated && onRatePress;

  // Animation values
  const scale = useSharedValue(1);

  // Handle press in
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_CONFIG);
  }, [scale]);

  // Handle press out
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  // Handle press
  const handlePress = useCallback(() => {
    onPress?.(order);
  }, [order, onPress]);

  // Handle rate press
  const handleRatePress = useCallback(() => {
    onRatePress?.(order);
  }, [order, onRatePress]);

  // Animated container style
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Format display values
  const itemCount = getItemCount(order);
  const itemCountText = formatItemCount(itemCount);
  const dateText = formatOrderDate(order.createdAt);
  const statusVariant = getStatusBadgeVariant(order.status as OrderStatus);
  const statusText = getStatusText(order.status as OrderStatus);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      testID={testID}
      accessibilityLabel={`Order from ${order.restaurant.name}, ${statusText}, ${itemCountText}, ${dateText}`}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          Shadows.sm,
          animatedContainerStyle,
        ]}
      >
        {/* Restaurant Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: order.restaurant.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Order Info */}
        <View style={styles.infoContainer}>
          {/* Header Row: Restaurant Name and Status */}
          <View style={styles.headerRow}>
            <ThemedText
              style={[styles.restaurantName, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {order.restaurant.name}
            </ThemedText>
            <Badge variant={statusVariant} size="sm">
              {statusText}
            </Badge>
          </View>

          {/* Date and Items Row */}
          <View style={styles.detailsRow}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.dateText, { color: colors.textSecondary }]}>
                {dateText}
              </ThemedText>
            </View>
            <ThemedText style={[styles.dot, { color: colors.textTertiary }]}>•</ThemedText>
            <ThemedText style={[styles.itemCount, { color: colors.textSecondary }]}>
              {itemCountText}
            </ThemedText>
          </View>

          {/* Total Row */}
          <View style={styles.totalRow}>
            <ThemedText style={[styles.totalLabel, { color: colors.textSecondary }]}>
              Total
            </ThemedText>
            <ThemedText style={[styles.totalAmount, { color: colors.text }]}>
              ${order.total.toFixed(2)}
            </ThemedText>
          </View>

          {/* Rate Button (for delivered, unrated orders) */}
          {showRateButton && (
            <Pressable
              onPress={handleRatePress}
              style={[styles.rateButton, { backgroundColor: colors.backgroundSecondary }]}
              accessibilityLabel="Rate this order"
              accessibilityRole="button"
              testID={`${testID}-rate-button`}
            >
              <Ionicons name="star-outline" size={14} color={colors.primary} />
              <ThemedText style={[styles.rateButtonText, { color: colors.primary }]}>
                Rate Order
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Chevron Icon */}
        <View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </View>
      </Animated.View>
    </Pressable>
  );
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: Spacing[3],
    marginRight: Spacing[2],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[1],
  },
  restaurantName: {
    flex: 1,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
    marginRight: Spacing[2],
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[1.5],
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginLeft: Spacing[1],
  },
  dot: {
    fontSize: Typography.xs.fontSize,
    marginHorizontal: Spacing[1.5],
  },
  itemCount: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginRight: Spacing[1],
  },
  totalAmount: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.md,
    marginTop: Spacing[2],
    gap: Spacing[1],
  },
  rateButtonText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: '600',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
