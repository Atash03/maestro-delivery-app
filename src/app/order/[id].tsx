/**
 * Order Tracking Screen
 *
 * Shows order confirmation with success animation after placing an order.
 * Full real-time tracking will be implemented in Phase 5.
 *
 * Features:
 * - Animated success checkmark with confetti-like effect
 * - Order ID and estimated delivery time display
 * - Restaurant and order summary
 * - Navigation to home or order details
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, type TextStyle, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  SuccessColors,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOrderStore } from '@/stores';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats a date to a readable time string
 */
export function formatDeliveryTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats a price with dollar sign
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculates minutes from now to a future date
 */
export function getMinutesUntil(futureDate: Date): number {
  const now = new Date();
  const diff = futureDate.getTime() - now.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60)));
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Animated success checkmark with pulse and scale effects
 */
function SuccessAnimation() {
  const scale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    // Animate the outer circle
    scale.value = withDelay(100, withSpring(1, { damping: 10, stiffness: 100 }));

    // Animate the checkmark with a slight delay
    checkScale.value = withDelay(
      400,
      withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      )
    );

    // Create pulsing effect
    pulseScale.value = withDelay(
      500,
      withSequence(withTiming(1.3, { duration: 400 }), withTiming(1, { duration: 400 }))
    );
    pulseOpacity.value = withDelay(
      500,
      withSequence(withTiming(0.4, { duration: 400 }), withTiming(0, { duration: 400 }))
    );
  }, [scale, checkScale, pulseScale, pulseOpacity]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.successContainer}>
      {/* Pulse ring */}
      <Animated.View
        style={[styles.pulseRing, { backgroundColor: SuccessColors[200] }, pulseStyle]}
      />

      {/* Outer circle */}
      <Animated.View
        style={[styles.successCircle, { backgroundColor: SuccessColors[100] }, circleStyle]}
      >
        {/* Inner circle with checkmark */}
        <Animated.View
          style={[styles.successIconCircle, { backgroundColor: SuccessColors[500] }, checkStyle]}
        >
          <Ionicons name="checkmark" size={48} color={NeutralColors[0]} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

interface OrderInfoCardProps {
  order: ReturnType<typeof useOrderStore.getState>['currentOrder'];
  colors: (typeof Colors)['light'];
}

/**
 * Order information card showing restaurant and items
 */
function OrderInfoCard({ order, colors }: OrderInfoCardProps) {
  if (!order) return null;

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedMinutes = getMinutesUntil(new Date(order.estimatedDelivery));

  return (
    <Animated.View
      entering={FadeInUp.duration(AnimationDurations.normal).delay(600)}
      style={[styles.orderCard, { backgroundColor: colors.card, ...Shadows.md }]}
    >
      {/* Restaurant Info */}
      <View style={styles.restaurantRow}>
        <Image
          source={{ uri: order.restaurant.image }}
          style={styles.restaurantImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.restaurantDetails}>
          <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
            {order.restaurant.name}
          </Text>
          <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} • {formatPrice(order.total)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Estimated Delivery */}
      <View style={styles.deliveryRow}>
        <View style={[styles.deliveryIconContainer, { backgroundColor: PrimaryColors[100] }]}>
          <Ionicons name="time-outline" size={20} color={PrimaryColors[500]} />
        </View>
        <View style={styles.deliveryDetails}>
          <Text style={[styles.deliveryLabel, { color: colors.textSecondary }]}>
            Estimated Delivery
          </Text>
          <Text style={[styles.deliveryTime, { color: colors.text }]}>
            {estimatedMinutes > 0
              ? `${estimatedMinutes} min (${formatDeliveryTime(new Date(order.estimatedDelivery))})`
              : 'Any moment now!'}
          </Text>
        </View>
      </View>

      {/* Delivery Address */}
      <View style={styles.addressRow}>
        <View
          style={[styles.deliveryIconContainer, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
        </View>
        <View style={styles.deliveryDetails}>
          <Text style={[styles.deliveryLabel, { color: colors.textSecondary }]}>
            Delivery Address
          </Text>
          <Text style={[styles.addressText, { color: colors.text }]} numberOfLines={2}>
            {order.address.street}, {order.address.city}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

interface ActionButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant: 'primary' | 'secondary';
  colors: (typeof Colors)['light'];
  delay?: number;
}

/**
 * Action button with icon
 */
function ActionButton({ label, icon, onPress, variant, colors, delay = 0 }: ActionButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPrimary = variant === 'primary';

  return (
    <Animated.View entering={FadeInUp.duration(AnimationDurations.normal).delay(delay)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.actionButton,
          {
            backgroundColor: isPrimary ? PrimaryColors[500] : colors.backgroundSecondary,
            borderColor: isPrimary ? PrimaryColors[500] : colors.border,
          },
          buttonStyle,
        ]}
        accessibilityLabel={label}
        accessibilityRole="button"
        testID={`action-button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Ionicons name={icon} size={20} color={isPrimary ? NeutralColors[0] : colors.text} />
        <Text
          style={[styles.actionButtonText, { color: isPrimary ? NeutralColors[0] : colors.text }]}
        >
          {label}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Get order from store
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const currentOrder = useOrderStore((state) => state.currentOrder);

  // Get the order - either by ID or use current order
  const order = useMemo(() => {
    if (id) {
      return getOrderById(id);
    }
    return currentOrder;
  }, [id, getOrderById, currentOrder]);

  // Handlers
  const handleBackToHome = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      testID="order-tracking-screen"
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation */}
        <SuccessAnimation />

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.duration(AnimationDurations.normal).delay(400)}
          style={[styles.title, { color: colors.text }]}
        >
          Order Placed!
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInUp.duration(AnimationDurations.normal).delay(500)}
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          Your order has been confirmed and is being prepared.
        </Animated.Text>

        {/* Order ID */}
        {id && (
          <Animated.View
            entering={FadeInUp.duration(AnimationDurations.normal).delay(550)}
            style={[styles.orderIdContainer, { backgroundColor: colors.backgroundSecondary }]}
          >
            <Text style={[styles.orderIdLabel, { color: colors.textSecondary }]}>Order ID</Text>
            <Text style={[styles.orderId, { color: colors.text }]}>{id}</Text>
          </Animated.View>
        )}

        {/* Order Info Card */}
        {order && <OrderInfoCard order={order} colors={colors} />}

        {/* Placeholder for Phase 5 */}
        <Animated.View
          entering={FadeInDown.duration(AnimationDurations.normal).delay(700)}
          style={[styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name="construct-outline" size={24} color={colors.textTertiary} />
          <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
            Real-time order tracking with map and driver updates coming in Phase 5
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { backgroundColor: colors.background }]}>
        <ActionButton
          label="Back to Home"
          icon="home-outline"
          onPress={handleBackToHome}
          variant="primary"
          colors={colors}
          delay={800}
        />
      </View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    padding: Spacing[6],
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
    height: 160,
    width: 160,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography['3xl'].fontSize,
    lineHeight: Typography['3xl'].lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    marginBottom: Spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
    marginBottom: Spacing[4],
    paddingHorizontal: Spacing[4],
  },
  orderIdContainer: {
    alignItems: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[6],
  },
  orderIdLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  orderId: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    marginTop: Spacing[1],
  },
  orderCard: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  restaurantImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[1],
  },
  itemCount: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  divider: {
    height: 1,
    marginBottom: Spacing[4],
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  deliveryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginBottom: Spacing[0],
  },
  deliveryTime: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  addressText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    width: '100%',
  },
  placeholderText: {
    flex: 1,
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
});
