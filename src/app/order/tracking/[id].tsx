/**
 * Order Tracking Screen
 *
 * Displays real-time order tracking with an interactive map and status tracker.
 * Shows the driver location, restaurant, and delivery address on the map.
 *
 * Features:
 * - Interactive map with driver, restaurant, and delivery markers
 * - Route polyline connecting all points
 * - Real-time driver location updates (mock)
 * - Order status tracker with progress steps
 * - ETA display
 * - Re-center button to focus on driver
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, type TextStyle, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderStatusTracker } from '@/components/order-status-tracker';
import { OrderTrackingMap } from '@/components/order-tracking-map';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOrderStore } from '@/stores';
import { OrderStatus } from '@/types';

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
function formatDeliveryTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Calculates minutes from now to a future date
 */
function getMinutesUntil(futureDate: Date): number {
  const now = new Date();
  const diff = futureDate.getTime() - now.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60)));
}

/**
 * Get status message based on order status
 */
function getStatusMessage(status: OrderStatus): { title: string; subtitle: string } {
  switch (status) {
    case OrderStatus.PENDING:
      return {
        title: 'Order Received',
        subtitle: 'Waiting for restaurant confirmation',
      };
    case OrderStatus.CONFIRMED:
      return {
        title: 'Order Confirmed',
        subtitle: 'The restaurant has accepted your order',
      };
    case OrderStatus.PREPARING:
      return {
        title: 'Preparing Your Order',
        subtitle: 'The restaurant is making your food',
      };
    case OrderStatus.READY:
      return {
        title: 'Ready for Pickup',
        subtitle: 'Waiting for driver to pick up',
      };
    case OrderStatus.PICKED_UP:
      return {
        title: 'Order Picked Up',
        subtitle: 'Driver is heading to the restaurant',
      };
    case OrderStatus.ON_THE_WAY:
      return {
        title: 'On The Way',
        subtitle: 'Driver is heading to your location',
      };
    case OrderStatus.DELIVERED:
      return {
        title: 'Delivered',
        subtitle: 'Enjoy your meal!',
      };
    case OrderStatus.CANCELLED:
      return {
        title: 'Order Cancelled',
        subtitle: 'This order has been cancelled',
      };
    default:
      return {
        title: 'Order Status',
        subtitle: 'Tracking your order',
      };
  }
}

// ============================================================================
// Sub-Components
// ============================================================================

interface HeaderProps {
  onBack: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Screen header with back button
 */
function Header({ onBack, colors }: HeaderProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <AnimatedPressable
        onPress={onBack}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.backButton, { backgroundColor: colors.backgroundSecondary }, buttonStyle]}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        testID="back-button"
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </AnimatedPressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Track Order</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

interface ETACardProps {
  estimatedDelivery: Date;
  status: OrderStatus;
  colors: (typeof Colors)['light'];
}

/**
 * ETA display card
 */
function ETACard({ estimatedDelivery, status, colors }: ETACardProps) {
  const estimatedMinutes = getMinutesUntil(new Date(estimatedDelivery));
  const statusMessage = getStatusMessage(status);

  const isDelivered = status === OrderStatus.DELIVERED;
  const isCancelled = status === OrderStatus.CANCELLED;

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(200)}
      style={[styles.etaCard, { backgroundColor: colors.card, ...Shadows.md }]}
      testID="eta-card"
    >
      <View style={styles.etaRow}>
        <View style={[styles.etaIconContainer, { backgroundColor: PrimaryColors[100] }]}>
          <Ionicons
            name={isDelivered ? 'checkmark-circle' : isCancelled ? 'close-circle' : 'time-outline'}
            size={24}
            color={PrimaryColors[500]}
          />
        </View>
        <View style={styles.etaContent}>
          <Text style={[styles.etaLabel, { color: colors.textSecondary }]}>
            {isDelivered
              ? 'Delivered'
              : isCancelled
                ? 'Cancelled'
                : estimatedMinutes > 0
                  ? 'Estimated arrival'
                  : 'Arriving now'}
          </Text>
          <Text style={[styles.etaTime, { color: colors.text }]}>
            {isDelivered || isCancelled
              ? statusMessage.title
              : estimatedMinutes > 0
                ? `${estimatedMinutes} min`
                : 'Any moment now!'}
          </Text>
          {!isDelivered && !isCancelled && estimatedMinutes > 0 && (
            <Text style={[styles.etaSubtext, { color: colors.textSecondary }]}>
              by {formatDeliveryTime(new Date(estimatedDelivery))}
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.statusRow, { borderTopColor: colors.divider }]}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                status === OrderStatus.CANCELLED
                  ? colors.error
                  : status === OrderStatus.DELIVERED
                    ? colors.success
                    : PrimaryColors[500],
            },
          ]}
        />
        <View style={styles.statusTextContainer}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>{statusMessage.title}</Text>
          <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
            {statusMessage.subtitle}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

interface MapSectionProps {
  restaurantLocation: { latitude: number; longitude: number };
  restaurantName: string;
  deliveryLocation: { latitude: number; longitude: number };
  deliveryAddress: string;
  driver?: NonNullable<ReturnType<typeof useOrderStore.getState>['currentOrder']>['driver'];
  isPickedUp: boolean;
  colors: (typeof Colors)['light'];
}

/**
 * Map section with the order tracking map
 */
function MapSection({
  restaurantLocation,
  restaurantName,
  deliveryLocation,
  deliveryAddress,
  driver,
  isPickedUp,
}: MapSectionProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal).delay(100)}
      style={styles.mapContainer}
      testID="map-section"
    >
      <OrderTrackingMap
        restaurantLocation={restaurantLocation}
        restaurantName={restaurantName}
        deliveryLocation={deliveryLocation}
        deliveryAddress={deliveryAddress}
        driver={driver}
        isPickedUp={isPickedUp}
        testID="order-map"
      />
    </Animated.View>
  );
}

interface StatusTrackerSectionProps {
  status: OrderStatus;
  colors: (typeof Colors)['light'];
}

/**
 * Status tracker section
 */
function StatusTrackerSection({ status, colors }: StatusTrackerSectionProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(300)}
      style={[styles.trackerContainer, { backgroundColor: colors.card, ...Shadows.sm }]}
      testID="status-tracker-section"
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Progress</Text>
      <OrderStatusTracker currentStatus={status} />
    </Animated.View>
  );
}

interface HelpButtonProps {
  onPress: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Help button for contacting support
 */
function HelpButton({ onPress, colors }: HelpButtonProps) {
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

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(400)}
      style={styles.helpButtonContainer}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.helpButton, { backgroundColor: colors.backgroundSecondary }, buttonStyle]}
        accessibilityLabel="Get help with your order"
        accessibilityRole="button"
        testID="help-button"
      >
        <Ionicons name="help-circle-outline" size={20} color={colors.text} />
        <Text style={[styles.helpButtonText, { color: colors.text }]}>Need help?</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function OrderTrackingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // State for map collapse
  const [isMapExpanded, setIsMapExpanded] = useState(true);

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

  // Determine if order has been picked up
  const isPickedUp = useMemo(() => {
    if (!order) return false;
    const pickedUpStatuses = [OrderStatus.PICKED_UP, OrderStatus.ON_THE_WAY, OrderStatus.DELIVERED];
    return pickedUpStatuses.includes(order.status);
  }, [order]);

  // Get restaurant coordinates (use default if not available)
  const restaurantLocation = useMemo(() => {
    if (order?.restaurant.coordinates) {
      return order.restaurant.coordinates;
    }
    // Default NYC coordinates
    return { latitude: 40.7128, longitude: -74.006 };
  }, [order?.restaurant.coordinates]);

  // Get delivery location coordinates
  const deliveryLocation = useMemo(() => {
    if (order?.address.coordinates) {
      return order.address.coordinates;
    }
    // Default NYC coordinates (slightly different)
    return { latitude: 40.72, longitude: -73.99 };
  }, [order?.address.coordinates]);

  // Handlers
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleHelp = useCallback(() => {
    // Navigate to help/support screen (placeholder for future implementation)
    // router.push('/support');
  }, []);

  const handleToggleMap = useCallback(() => {
    setIsMapExpanded((prev) => !prev);
  }, []);

  // If no order found, show error state
  if (!order) {
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
        testID="order-tracking-detail-screen"
      >
        <Header onBack={handleBack} colors={colors} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Order Not Found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            We couldn&apos;t find this order. Please try again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
      testID="order-tracking-detail-screen"
    >
      <Header onBack={handleBack} colors={colors} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing[4] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Toggle Button (for small screens) */}
        <Pressable
          onPress={handleToggleMap}
          style={[styles.mapToggle, { backgroundColor: colors.backgroundSecondary }]}
          testID="map-toggle"
        >
          <Ionicons
            name={isMapExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
          />
          <Text style={[styles.mapToggleText, { color: colors.textSecondary }]}>
            {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </Text>
        </Pressable>

        {/* Map Section */}
        {isMapExpanded && (
          <MapSection
            restaurantLocation={restaurantLocation}
            restaurantName={order.restaurant.name}
            deliveryLocation={deliveryLocation}
            deliveryAddress={`${order.address.street}, ${order.address.city}`}
            driver={order.driver}
            isPickedUp={isPickedUp}
            colors={colors}
          />
        )}

        {/* ETA Card */}
        <ETACard
          estimatedDelivery={order.estimatedDelivery}
          status={order.status}
          colors={colors}
        />

        {/* Status Tracker */}
        <StatusTrackerSection status={order.status} colors={colors} />

        {/* Help Button */}
        <HelpButton onPress={handleHelp} colors={colors} />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing[4],
    gap: Spacing[4],
  },
  mapToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    padding: Spacing[2],
    borderRadius: BorderRadius.md,
  },
  mapToggleText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  mapContainer: {
    height: 280,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  etaCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  etaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaContent: {
    flex: 1,
  },
  etaLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  etaTime: {
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  etaSubtext: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  statusSubtitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  trackerContainer: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
  },
  sectionTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[4],
  },
  helpButtonContainer: {
    alignItems: 'center',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.full,
  },
  helpButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
    gap: Spacing[3],
  },
  errorTitle: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
  },
});
