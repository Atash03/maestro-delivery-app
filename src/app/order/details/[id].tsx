/**
 * Order Details Screen
 *
 * Displays complete order details including:
 * - Order summary with all items and customizations
 * - Order status and timeline
 * - Delivery address used
 * - Payment method used
 * - Receipt/invoice view with cost breakdown
 * - Reorder and Get Help buttons
 *
 * Features:
 * - Animated section entries
 * - Collapsible sections for better navigation
 * - Theme support (light/dark mode)
 * - Pull-to-refresh for status updates
 */

import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getStatusBadgeVariant, getStatusText } from '@/components/cards';
import { OrderStatusTracker } from '@/components/order-status-tracker';
import { Badge } from '@/components/ui/badge';
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
import { useCartStore, useOrderStore } from '@/stores';
import type { CardBrand, CartItem, Order, OrderStatus, PaymentMethod } from '@/types';

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
 * Format price with dollar sign
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Format order date to full readable format
 */
export function formatFullDate(date: Date): string {
  const orderDate = new Date(date);
  return format(orderDate, 'EEEE, MMMM d, yyyy');
}

/**
 * Format order time
 */
export function formatTime(date: Date): string {
  const orderDate = new Date(date);
  return format(orderDate, 'h:mm a');
}

/**
 * Get card brand display name
 */
export function getCardBrandName(brand?: CardBrand): string {
  const brandNames: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
  };
  return brand ? brandNames[brand] : 'Card';
}

/**
 * Get card brand icon name
 */
export function getCardBrandIcon(_brand?: CardBrand): keyof typeof Ionicons.glyphMap {
  // Using a generic card icon since Ionicons doesn't have brand-specific ones
  return 'card-outline';
}

/**
 * Format payment method for display
 */
export function formatPaymentMethod(paymentMethod: PaymentMethod): string {
  if (paymentMethod.type === 'cash') {
    return 'Cash on Delivery';
  }
  return `${getCardBrandName(paymentMethod.brand)} ****${paymentMethod.last4}`;
}

// ============================================================================
// Sub-Components
// ============================================================================

interface SectionHeaderProps {
  title: string;
  colors: (typeof Colors)['light'];
  delay?: number;
}

/**
 * Section header with title
 */
function SectionHeader({ title, colors, delay = 0 }: SectionHeaderProps) {
  return (
    <Animated.Text
      entering={FadeIn.duration(AnimationDurations.normal).delay(delay)}
      style={[styles.sectionHeader, { color: colors.text }]}
    >
      {title}
    </Animated.Text>
  );
}

interface OrderHeaderProps {
  order: Order;
  colors: (typeof Colors)['light'];
}

/**
 * Order header with restaurant info and status
 */
function OrderHeader({ order, colors }: OrderHeaderProps) {
  const statusVariant = getStatusBadgeVariant(order.status as OrderStatus);
  const statusText = getStatusText(order.status as OrderStatus);

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal)}
      style={[styles.headerCard, { backgroundColor: colors.card, ...Shadows.md }]}
    >
      {/* Restaurant Info */}
      <View style={styles.restaurantRow}>
        <Image
          source={{ uri: order.restaurant.image }}
          style={styles.restaurantImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.restaurantInfo}>
          <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
            {order.restaurant.name}
          </Text>
          <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
            {formatFullDate(order.createdAt)} at {formatTime(order.createdAt)}
          </Text>
        </View>
      </View>

      {/* Order ID and Status */}
      <View style={[styles.orderIdRow, { borderTopColor: colors.divider }]}>
        <View>
          <Text style={[styles.orderIdLabel, { color: colors.textSecondary }]}>Order ID</Text>
          <Text style={[styles.orderId, { color: colors.text }]}>#{order.id}</Text>
        </View>
        <Badge variant={statusVariant} size="md">
          {statusText}
        </Badge>
      </View>
    </Animated.View>
  );
}

interface OrderItemRowProps {
  item: CartItem;
  colors: (typeof Colors)['light'];
  index: number;
}

/**
 * Single order item row
 */
function OrderItemRow({ item, colors, index }: OrderItemRowProps) {
  const customizationsText = item.selectedCustomizations
    .map((c) => c.selectedOptions.map((o) => o.optionName).join(', '))
    .filter(Boolean)
    .join(' | ');

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal).delay(index * 30)}
      style={styles.orderItemRow}
    >
      <View style={styles.orderItemQuantityContainer}>
        <Text style={[styles.orderItemQuantity, { color: colors.text }]}>{item.quantity}x</Text>
      </View>
      <View style={styles.orderItemDetails}>
        <Text style={[styles.orderItemName, { color: colors.text }]} numberOfLines={2}>
          {item.menuItem.name}
        </Text>
        {customizationsText && (
          <Text style={[styles.orderItemCustomizations, { color: colors.textSecondary }]}>
            {customizationsText}
          </Text>
        )}
        {item.specialInstructions && (
          <Text
            style={[styles.orderItemInstructions, { color: colors.textTertiary }]}
            numberOfLines={2}
          >
            Note: {item.specialInstructions}
          </Text>
        )}
      </View>
      <Text style={[styles.orderItemPrice, { color: colors.text }]}>
        {formatPrice(item.totalPrice)}
      </Text>
    </Animated.View>
  );
}

interface OrderItemsProps {
  items: CartItem[];
  colors: (typeof Colors)['light'];
}

/**
 * Order items list
 */
function OrderItemsSection({ items, colors }: OrderItemsProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(100)}
      style={[styles.sectionCard, { backgroundColor: colors.card, ...Shadows.sm }]}
    >
      <SectionHeader title="Order Items" colors={colors} delay={100} />
      <View style={[styles.itemsDivider, { backgroundColor: colors.divider }]} />
      {items.map((item, index) => (
        <View key={item.id}>
          <OrderItemRow item={item} colors={colors} index={index} />
          {index < items.length - 1 && (
            <View style={[styles.itemDivider, { backgroundColor: colors.divider }]} />
          )}
        </View>
      ))}
    </Animated.View>
  );
}

interface ReceiptSectionProps {
  order: Order;
  colors: (typeof Colors)['light'];
}

/**
 * Receipt with cost breakdown
 */
function ReceiptSection({ order, colors }: ReceiptSectionProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(200)}
      style={[styles.sectionCard, { backgroundColor: colors.card, ...Shadows.sm }]}
    >
      <SectionHeader title="Receipt" colors={colors} delay={200} />
      <View style={[styles.itemsDivider, { backgroundColor: colors.divider }]} />

      {/* Subtotal */}
      <View style={styles.receiptRow}>
        <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Subtotal</Text>
        <Text style={[styles.receiptValue, { color: colors.text }]}>
          {formatPrice(order.subtotal)}
        </Text>
      </View>

      {/* Delivery Fee */}
      <View style={styles.receiptRow}>
        <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
        <Text style={[styles.receiptValue, { color: colors.text }]}>
          {order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}
        </Text>
      </View>

      {/* Tax */}
      <View style={styles.receiptRow}>
        <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Tax</Text>
        <Text style={[styles.receiptValue, { color: colors.text }]}>{formatPrice(order.tax)}</Text>
      </View>

      {/* Tip */}
      {order.tip !== undefined && order.tip > 0 && (
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Tip</Text>
          <Text style={[styles.receiptValue, { color: colors.text }]}>
            {formatPrice(order.tip)}
          </Text>
        </View>
      )}

      {/* Discount */}
      {order.discount !== undefined && order.discount > 0 && (
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: SuccessColors[600] }]}>Discount</Text>
          <Text style={[styles.receiptValue, { color: SuccessColors[600] }]}>
            -{formatPrice(order.discount)}
          </Text>
        </View>
      )}

      {/* Promo Code */}
      {order.promoCode && (
        <View style={styles.receiptRow}>
          <View style={styles.promoCodeContainer}>
            <Ionicons name="pricetag-outline" size={14} color={SuccessColors[600]} />
            <Text style={[styles.promoCodeText, { color: SuccessColors[600] }]}>
              {order.promoCode}
            </Text>
          </View>
        </View>
      )}

      {/* Total Divider */}
      <View style={[styles.totalDivider, { backgroundColor: colors.divider }]} />

      {/* Total */}
      <View style={styles.receiptRow}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>{formatPrice(order.total)}</Text>
      </View>
    </Animated.View>
  );
}

interface DeliveryAddressSectionProps {
  order: Order;
  colors: (typeof Colors)['light'];
}

/**
 * Delivery address section
 */
function DeliveryAddressSection({ order, colors }: DeliveryAddressSectionProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(300)}
      style={[styles.sectionCard, { backgroundColor: colors.card, ...Shadows.sm }]}
    >
      <SectionHeader title="Delivery Address" colors={colors} delay={300} />
      <View style={[styles.itemsDivider, { backgroundColor: colors.divider }]} />

      <View style={styles.addressContent}>
        <View
          style={[styles.addressIconContainer, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name="location-outline" size={20} color={PrimaryColors[500]} />
        </View>
        <View style={styles.addressDetails}>
          <Text style={[styles.addressLabel, { color: colors.text }]}>{order.address.label}</Text>
          <Text style={[styles.addressStreet, { color: colors.textSecondary }]}>
            {order.address.street}
          </Text>
          <Text style={[styles.addressCity, { color: colors.textSecondary }]}>
            {order.address.city}, {order.address.zipCode}
          </Text>
          {order.address.instructions && (
            <Text style={[styles.addressInstructions, { color: colors.textTertiary }]}>
              Instructions: {order.address.instructions}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

interface PaymentMethodSectionProps {
  order: Order;
  colors: (typeof Colors)['light'];
}

/**
 * Payment method section
 */
function PaymentMethodSection({ order, colors }: PaymentMethodSectionProps) {
  const isCash = order.paymentMethod.type === 'cash';

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(400)}
      style={[styles.sectionCard, { backgroundColor: colors.card, ...Shadows.sm }]}
    >
      <SectionHeader title="Payment Method" colors={colors} delay={400} />
      <View style={[styles.itemsDivider, { backgroundColor: colors.divider }]} />

      <View style={styles.paymentContent}>
        <View
          style={[styles.paymentIconContainer, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons
            name={isCash ? 'cash-outline' : getCardBrandIcon(order.paymentMethod.brand)}
            size={20}
            color={PrimaryColors[500]}
          />
        </View>
        <View style={styles.paymentDetails}>
          <Text style={[styles.paymentMethod, { color: colors.text }]}>
            {formatPaymentMethod(order.paymentMethod)}
          </Text>
          {!isCash && order.paymentMethod.expiryMonth && order.paymentMethod.expiryYear && (
            <Text style={[styles.paymentExpiry, { color: colors.textSecondary }]}>
              Expires {order.paymentMethod.expiryMonth}/{order.paymentMethod.expiryYear}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

interface OrderStatusSectionProps {
  order: Order;
  colors: (typeof Colors)['light'];
}

/**
 * Order status timeline section
 */
function OrderStatusSection({ order, colors }: OrderStatusSectionProps) {
  // Build status timestamps from order dates
  const statusTimestamps = useMemo(() => {
    const timestamps: Partial<Record<OrderStatus, Date>> = {};

    // Add createdAt as the first timestamp (order placed)
    timestamps.PENDING = new Date(order.createdAt);

    // If order is beyond PENDING, add more timestamps
    const statusOrder: OrderStatus[] = [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY',
      'PICKED_UP',
      'ON_THE_WAY',
      'DELIVERED',
    ];

    const currentIndex = statusOrder.indexOf(order.status as OrderStatus);

    // Add timestamps for completed steps (simulate with createdAt + increments)
    const baseTime = new Date(order.createdAt).getTime();
    for (let i = 1; i <= currentIndex && i < statusOrder.length; i++) {
      timestamps[statusOrder[i]] = new Date(baseTime + i * 5 * 60 * 1000); // 5 min increments
    }

    // Handle delivered with actual delivery time
    if (order.status === 'DELIVERED' && order.actualDelivery) {
      timestamps.DELIVERED = new Date(order.actualDelivery);
    }

    // Handle cancelled
    if (order.status === 'CANCELLED') {
      timestamps.CANCELLED = new Date(order.updatedAt);
    }

    return timestamps;
  }, [order]);

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(500)}
      style={[styles.sectionCard, { backgroundColor: colors.card, ...Shadows.sm }]}
    >
      <SectionHeader title="Order Status" colors={colors} delay={500} />
      <View style={[styles.itemsDivider, { backgroundColor: colors.divider }]} />

      <OrderStatusTracker
        currentStatus={order.status as OrderStatus}
        statusTimestamps={statusTimestamps}
        testID="order-details-status-tracker"
      />
    </Animated.View>
  );
}

interface ActionButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant: 'primary' | 'secondary';
  colors: (typeof Colors)['light'];
}

/**
 * Action button
 */
function ActionButton({ label, icon, onPress, variant, colors }: ActionButtonProps) {
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
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.actionButton,
        {
          backgroundColor: isPrimary ? PrimaryColors[500] : 'transparent',
          borderColor: isPrimary ? PrimaryColors[500] : colors.border,
        },
        buttonStyle,
      ]}
      accessibilityLabel={label}
      accessibilityRole="button"
      testID={`action-button-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Ionicons name={icon} size={18} color={isPrimary ? NeutralColors[0] : colors.text} />
      <Text
        style={[styles.actionButtonText, { color: isPrimary ? NeutralColors[0] : colors.text }]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Get order from store
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const order = useMemo(() => (id ? getOrderById(id) : undefined), [id, getOrderById]);

  // Cart store for reorder
  const { addItem, clearCart, setRestaurant, canAddFromRestaurant } = useCartStore();

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
  }, []);

  // Handle reorder
  const handleReorder = useCallback(() => {
    if (!order) return;

    // Check if cart has items from a different restaurant
    if (!canAddFromRestaurant(order.restaurant.id)) {
      Alert.alert(
        'Replace Cart?',
        'Your cart has items from another restaurant. Do you want to clear it and add items from this order?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace',
            style: 'destructive',
            onPress: () => {
              clearCart();
              setRestaurant(order.restaurant);
              addOrderItemsToCart();
            },
          },
        ]
      );
    } else {
      if (!useCartStore.getState().restaurant) {
        setRestaurant(order.restaurant);
      }
      addOrderItemsToCart();
    }

    function addOrderItemsToCart() {
      if (!order) return;

      // Add each item to cart
      order.items.forEach((item) => {
        addItem(
          item.menuItem,
          item.quantity,
          item.selectedCustomizations,
          item.specialInstructions
        );
      });

      // Navigate to cart
      router.push('/(modals)/cart');
    }
  }, [order, canAddFromRestaurant, clearCart, setRestaurant, addItem, router]);

  // Handle get help
  const handleGetHelp = useCallback(() => {
    if (!order) return;
    router.push(`/support/issue/${order.id}`);
  }, [order, router]);

  // If no order found
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
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Order Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Not found state */}
        <View style={styles.notFoundContainer}>
          <View
            style={[styles.notFoundIconContainer, { backgroundColor: colors.backgroundSecondary }]}
          >
            <Ionicons name="receipt-outline" size={48} color={colors.textTertiary} />
          </View>
          <Text style={[styles.notFoundTitle, { color: colors.text }]}>Order Not Found</Text>
          <Text style={[styles.notFoundDescription, { color: colors.textSecondary }]}>
            We couldn't find this order. It may have been deleted or the link is invalid.
          </Text>
          <Pressable
            onPress={handleBack}
            style={[styles.notFoundButton, { backgroundColor: PrimaryColors[500] }]}
            accessibilityRole="button"
          >
            <Text style={styles.notFoundButtonText}>Go Back</Text>
          </Pressable>
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
      testID="order-details-screen"
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          testID="back-button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Order Header */}
        <OrderHeader order={order} colors={colors} />

        {/* Order Status */}
        <OrderStatusSection order={order} colors={colors} />

        {/* Order Items */}
        <OrderItemsSection items={order.items} colors={colors} />

        {/* Receipt */}
        <ReceiptSection order={order} colors={colors} />

        {/* Delivery Address */}
        <DeliveryAddressSection order={order} colors={colors} />

        {/* Payment Method */}
        <PaymentMethodSection order={order} colors={colors} />
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.divider,
            paddingBottom: insets.bottom + Spacing[4],
          },
        ]}
      >
        <ActionButton
          label="Reorder"
          icon="refresh-outline"
          onPress={handleReorder}
          variant="primary"
          colors={colors}
        />
        <ActionButton
          label="Get Help"
          icon="help-circle-outline"
          onPress={handleGetHelp}
          variant="secondary"
          colors={colors}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing[2],
  },
  headerTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
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
  headerCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  orderDate: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
  },
  orderIdLabel: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginBottom: Spacing[0.5],
  },
  orderId: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  sectionCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
  },
  sectionHeader: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  itemsDivider: {
    height: 1,
    marginVertical: Spacing[3],
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
  },
  orderItemQuantityContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderItemQuantity: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  orderItemCustomizations: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginBottom: Spacing[0.5],
  },
  orderItemInstructions: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontStyle: 'italic',
  },
  orderItemPrice: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  itemDivider: {
    height: 1,
    marginLeft: 32 + Spacing[3],
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[2],
  },
  receiptLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  receiptValue: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  promoCodeText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  totalDivider: {
    height: 1,
    marginVertical: Spacing[3],
  },
  totalLabel: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  totalValue: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressDetails: {
    flex: 1,
  },
  addressLabel: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  addressStreet: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  addressCity: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  addressInstructions: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[1],
    fontStyle: 'italic',
  },
  paymentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  paymentExpiry: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginTop: Spacing[0.5],
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    padding: Spacing[4],
    gap: Spacing[3],
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
  actionButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[6],
  },
  notFoundIconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  notFoundTitle: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[2],
    textAlign: 'center',
  },
  notFoundDescription: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: Spacing[6],
  },
  notFoundButton: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
  },
  notFoundButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    color: '#FFFFFF',
  },
});
