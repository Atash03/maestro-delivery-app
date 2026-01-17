/**
 * Cart Preview Component
 *
 * A floating cart preview that appears at the bottom of the restaurant screen
 * when items are added to the cart. Features:
 * - Fixed position at bottom of screen
 * - Shows item count and total price
 * - Animated appearance when items are added
 * - Bounce animation on item add
 * - Taps to open cart modal
 *
 * Uses react-native-reanimated for smooth animations
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import {
  AnimationDurations,
  BorderRadius,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
  ZIndex,
} from '@/constants/theme';
import { useCartStore } from '@/stores';

// ============================================================================
// Constants
// ============================================================================

export const CART_PREVIEW_HEIGHT = 64;
const HORIZONTAL_MARGIN = Spacing[4];
const BOTTOM_MARGIN = Spacing[2];

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

const BOUNCE_SPRING_CONFIG = {
  damping: 12,
  stiffness: 400,
  mass: 0.3,
};

// ============================================================================
// Types
// ============================================================================

export interface CartPreviewProps {
  /** Restaurant ID to verify cart belongs to current restaurant */
  restaurantId?: string;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats the price for display
 */
export function formatCartTotal(total: number): string {
  return `$${total.toFixed(2)}`;
}

/**
 * Formats item count with "item" or "items"
 */
export function formatItemCount(count: number): string {
  if (count === 1) {
    return '1 item';
  }
  return `${count} items`;
}

// ============================================================================
// Component
// ============================================================================

export function CartPreview({ restaurantId, testID = 'cart-preview' }: CartPreviewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Cart state
  const items = useCartStore((state) => state.items);
  const cartRestaurantId = useCartStore((state) => state.restaurantId);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const prevItemCountRef = useRef(itemCount);

  // Animation values
  const scale = useSharedValue(1);
  const bounceScale = useSharedValue(1);
  const badgeScale = useSharedValue(1);

  // Only show if cart belongs to current restaurant or no restaurant filter
  const shouldShow = items.length > 0 && (!restaurantId || cartRestaurantId === restaurantId);

  // Bounce animation when item count changes
  useEffect(() => {
    if (itemCount > prevItemCountRef.current && shouldShow) {
      // Item was added - trigger bounce animations
      bounceScale.value = withSequence(
        withSpring(1.05, BOUNCE_SPRING_CONFIG),
        withSpring(1, BOUNCE_SPRING_CONFIG)
      );

      badgeScale.value = withSequence(
        withSpring(1.3, BOUNCE_SPRING_CONFIG),
        withSpring(1, BOUNCE_SPRING_CONFIG)
      );
    }
    prevItemCountRef.current = itemCount;
  }, [itemCount, shouldShow, bounceScale, badgeScale]);

  // Press animation handlers
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  // Navigate to cart modal
  const handlePress = useCallback(() => {
    router.push('/(modals)/cart');
  }, [router]);

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * bounceScale.value }],
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  // Don't render if cart is empty or belongs to different restaurant
  if (!shouldShow) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(AnimationDurations.normal).springify().damping(15)}
      exiting={FadeOutDown.duration(AnimationDurations.fast)}
      style={[
        styles.wrapper,
        {
          bottom: insets.bottom + BOTTOM_MARGIN,
          paddingHorizontal: HORIZONTAL_MARGIN,
        },
      ]}
      testID={testID}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityLabel={`View cart, ${formatItemCount(itemCount)}, ${formatCartTotal(subtotal)}`}
        accessibilityRole="button"
        accessibilityHint="Opens the cart to review and checkout"
      >
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: PrimaryColors[500] },
            containerAnimatedStyle,
          ]}
        >
          {/* Left: Item count badge */}
          <View style={styles.leftSection}>
            <Animated.View
              style={[styles.badge, { backgroundColor: NeutralColors[0] }, badgeAnimatedStyle]}
            >
              <ThemedText style={[styles.badgeText, { color: PrimaryColors[500] }]}>
                {itemCount}
              </ThemedText>
            </Animated.View>
          </View>

          {/* Center: View Cart text */}
          <View style={styles.centerSection}>
            <ThemedText style={[styles.viewCartText, { color: NeutralColors[0] }]}>
              View Cart
            </ThemedText>
          </View>

          {/* Right: Total price */}
          <View style={styles.rightSection}>
            <ThemedText style={[styles.totalText, { color: NeutralColors[0] }]}>
              {formatCartTotal(subtotal)}
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={NeutralColors[0]}
              style={styles.chevron}
            />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: ZIndex.fixed,
  },
  container: {
    height: CART_PREVIEW_HEIGHT,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    ...Shadows.lg,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
  },
  badgeText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '700',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCartText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: Spacing[1],
  },
});
