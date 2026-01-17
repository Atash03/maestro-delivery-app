/**
 * Cart Modal
 *
 * Full cart view with item list, editing, deletion, and checkout functionality.
 *
 * Features:
 * - Full item list with customizations shown
 * - Edit item (re-open customization modal)
 * - Quantity +/- controls
 * - Swipe to delete with animated removal
 * - Subtotal, fees breakdown preview
 * - "Add more items" button (returns to restaurant)
 * - "Checkout" button
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, type TextStyle, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SwipeableCartItem } from '@/components/swipeable-cart-item';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCartStore } from '@/stores';
import type { CartItem } from '@/types';

// ============================================================================
// Constants
// ============================================================================

export const TAX_RATE = 0.0875; // 8.75% tax rate
export const DELIVERY_FEE_MINIMUM = 2.99;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats a price with dollar sign and 2 decimal places
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculates tax amount based on subtotal
 */
export function calculateTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

/**
 * Gets delivery fee (from restaurant or default)
 */
export function getDeliveryFee(restaurantDeliveryFee?: number): number {
  return restaurantDeliveryFee ?? DELIVERY_FEE_MINIMUM;
}

/**
 * Calculates total order amount
 */
export function calculateTotal(subtotal: number, deliveryFee: number, tax: number): number {
  return subtotal + deliveryFee + tax;
}

// ============================================================================
// Sub-Components
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeaderProps {
  itemCount: number;
  onClose: () => void;
  onClearCart: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Modal header with title, close button, and clear cart option
 */
function Header({ itemCount, onClose, onClearCart, colors }: HeaderProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(100)}
      style={[styles.header, { borderBottomColor: colors.divider }]}
    >
      <Pressable
        onPress={onClose}
        style={styles.closeButton}
        accessibilityLabel="Close cart"
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        testID="cart-close-button"
      >
        <Ionicons name="close" size={24} color={colors.text} />
      </Pressable>

      <View style={styles.headerTitleContainer}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your Cart</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {itemCount > 0 && (
        <Pressable
          onPress={onClearCart}
          style={styles.clearButton}
          accessibilityLabel="Clear cart"
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID="cart-clear-button"
        >
          <Text style={[styles.clearButtonText, { color: colors.error }]}>Clear</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

interface RestaurantInfoProps {
  restaurantName: string;
  restaurantImage?: string;
  colors: (typeof Colors)['light'];
}

/**
 * Restaurant info banner at top of cart
 */
function RestaurantInfo({ restaurantName, restaurantImage, colors }: RestaurantInfoProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal).delay(150)}
      style={[styles.restaurantInfo, { backgroundColor: colors.backgroundSecondary }]}
    >
      <Image
        source={{ uri: restaurantImage || 'https://picsum.photos/seed/restaurant/80/80' }}
        style={styles.restaurantImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.restaurantDetails}>
        <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
          {restaurantName}
        </Text>
        <Text style={[styles.restaurantLabel, { color: colors.textSecondary }]}>Ordering from</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </Animated.View>
  );
}

interface EmptyCartProps {
  onAddItems: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Empty cart state with illustration
 */
function EmptyCart({ onAddItems, colors }: EmptyCartProps) {
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
      entering={FadeIn.duration(AnimationDurations.normal)}
      style={styles.emptyContainer}
    >
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="cart-outline" size={64} color={colors.textTertiary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Add items from a restaurant to get started
      </Text>
      <AnimatedPressable
        onPress={onAddItems}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.browseButton, { backgroundColor: PrimaryColors[500] }, buttonStyle]}
        accessibilityLabel="Browse restaurants"
        accessibilityRole="button"
        testID="cart-browse-button"
      >
        <Text style={[styles.browseButtonText, { color: NeutralColors[0] }]}>
          Browse Restaurants
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  colors: (typeof Colors)['light'];
}

/**
 * Order summary section with cost breakdown
 */
function OrderSummary({ subtotal, deliveryFee, tax, total, colors }: OrderSummaryProps) {
  return (
    <Animated.View
      entering={FadeInUp.duration(AnimationDurations.normal).delay(200)}
      style={[styles.summaryContainer, { backgroundColor: colors.card, ...Shadows.md }]}
    >
      <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(subtotal)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tax</Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(tax)}</Text>
      </View>

      <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />

      <View style={styles.summaryRow}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>{formatPrice(total)}</Text>
      </View>
    </Animated.View>
  );
}

interface FooterButtonsProps {
  onAddMoreItems: () => void;
  onCheckout: () => void;
  total: number;
  colors: (typeof Colors)['light'];
}

/**
 * Footer with Add More Items and Checkout buttons
 */
function FooterButtons({ onAddMoreItems, onCheckout, total, colors }: FooterButtonsProps) {
  const addMoreScale = useSharedValue(1);
  const checkoutScale = useSharedValue(1);

  const handleAddMorePressIn = useCallback(() => {
    addMoreScale.value = withSpring(0.97, SPRING_CONFIG);
  }, [addMoreScale]);

  const handleAddMorePressOut = useCallback(() => {
    addMoreScale.value = withSpring(1, SPRING_CONFIG);
  }, [addMoreScale]);

  const handleCheckoutPressIn = useCallback(() => {
    checkoutScale.value = withSpring(0.97, SPRING_CONFIG);
  }, [checkoutScale]);

  const handleCheckoutPressOut = useCallback(() => {
    checkoutScale.value = withSpring(1, SPRING_CONFIG);
  }, [checkoutScale]);

  const addMoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addMoreScale.value }],
  }));

  const checkoutStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkoutScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.duration(AnimationDurations.normal).delay(300)}
      style={styles.footerContainer}
    >
      <AnimatedPressable
        onPress={onAddMoreItems}
        onPressIn={handleAddMorePressIn}
        onPressOut={handleAddMorePressOut}
        style={[styles.addMoreButton, { borderColor: colors.border }, addMoreStyle]}
        accessibilityLabel="Add more items"
        accessibilityRole="button"
        testID="cart-add-more-button"
      >
        <Ionicons name="add-circle-outline" size={20} color={PrimaryColors[500]} />
        <Text style={[styles.addMoreText, { color: PrimaryColors[500] }]}>Add More Items</Text>
      </AnimatedPressable>

      <AnimatedPressable
        onPress={onCheckout}
        onPressIn={handleCheckoutPressIn}
        onPressOut={handleCheckoutPressOut}
        style={[styles.checkoutButton, { backgroundColor: PrimaryColors[500] }, checkoutStyle]}
        accessibilityLabel={`Checkout, total ${formatPrice(total)}`}
        accessibilityRole="button"
        testID="cart-checkout-button"
      >
        <Text style={[styles.checkoutText, { color: NeutralColors[0] }]}>Checkout</Text>
        <View style={[styles.checkoutPriceBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={[styles.checkoutPrice, { color: NeutralColors[0] }]}>
            {formatPrice(total)}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Cart state
  const items = useCartStore((state) => state.items);
  const restaurant = useCartStore((state) => state.restaurant);
  const restaurantId = useCartStore((state) => state.restaurantId);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getItemCount = useCartStore((state) => state.getItemCount);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // Computed values
  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const deliveryFee = useMemo(
    () => getDeliveryFee(restaurant?.deliveryFee),
    [restaurant?.deliveryFee]
  );
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const total = useMemo(
    () => calculateTotal(subtotal, deliveryFee, tax),
    [subtotal, deliveryFee, tax]
  );

  // Handlers
  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleClearCart = useCallback(() => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearCart();
        },
      },
    ]);
  }, [clearCart]);

  const handleQuantityChange = useCallback(
    (cartItemId: string, quantity: number) => {
      updateQuantity(cartItemId, quantity);
    },
    [updateQuantity]
  );

  const handleRemoveItem = useCallback(
    (cartItemId: string) => {
      removeItem(cartItemId);
    },
    [removeItem]
  );

  const handleEditItem = useCallback(
    (item: CartItem) => {
      // Navigate to dish customization modal with item data
      router.push({
        pathname: '/(modals)/dish-customization',
        params: {
          itemId: item.menuItem.id,
          restaurantId: item.menuItem.restaurantId,
          cartItemId: item.id,
          editMode: 'true',
        },
      });
    },
    [router]
  );

  const handleAddMoreItems = useCallback(() => {
    if (restaurantId) {
      router.push(`/restaurant/${restaurantId}`);
    } else {
      router.push('/(tabs)');
    }
  }, [router, restaurantId]);

  const handleBrowseRestaurants = useCallback(() => {
    router.push('/(tabs)');
  }, [router]);

  const handleCheckout = useCallback(() => {
    // Navigate to checkout (to be implemented in Phase 4)
    router.push('/order/checkout');
  }, [router]);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top,
          },
        ]}
        testID="cart-screen"
      >
        {/* Header */}
        <Header
          itemCount={itemCount}
          onClose={handleClose}
          onClearCart={handleClearCart}
          colors={colors}
        />

        {/* Content */}
        {items.length === 0 ? (
          <EmptyCart onAddItems={handleBrowseRestaurants} colors={colors} />
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 180 }]}
              showsVerticalScrollIndicator={false}
            >
              {/* Restaurant Info */}
              {restaurant && (
                <RestaurantInfo
                  restaurantName={restaurant.name}
                  restaurantImage={restaurant.image}
                  colors={colors}
                />
              )}

              {/* Cart Items */}
              <View style={styles.itemsContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>
                {items.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeIn.duration(AnimationDurations.normal).delay(200 + index * 50)}
                    exiting={FadeOut.duration(AnimationDurations.fast)}
                    layout={Layout.springify().damping(20).stiffness(200)}
                  >
                    <SwipeableCartItem
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      onPress={handleEditItem}
                      testID={`cart-item-${item.id}`}
                    />
                  </Animated.View>
                ))}
              </View>

              {/* Order Summary */}
              <OrderSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                tax={tax}
                total={total}
                colors={colors}
              />
            </ScrollView>

            {/* Footer Buttons */}
            <View
              style={[
                styles.footerWrapper,
                {
                  backgroundColor: colors.background,
                  paddingBottom: insets.bottom + Spacing[4],
                  borderTopColor: colors.divider,
                },
              ]}
            >
              <FooterButtons
                onAddMoreItems={handleAddMoreItems}
                onCheckout={handleCheckout}
                total={total}
                colors={colors}
              />
            </View>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: Spacing[1],
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  headerSubtitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  clearButton: {
    padding: Spacing[1],
  },
  clearButtonText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing[4],
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[4],
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    marginRight: Spacing[3],
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  restaurantLabel: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  itemsContainer: {
    marginBottom: Spacing[4],
  },
  sectionTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[3],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  emptyTitle: {
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    marginBottom: Spacing[2],
  },
  emptySubtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
    marginBottom: Spacing[6],
  },
  browseButton: {
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  browseButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  summaryContainer: {
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[4],
  },
  summaryTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[3],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  summaryLabel: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
  },
  summaryValue: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  summaryDivider: {
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
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  footerContainer: {
    gap: Spacing[3],
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing[2],
  },
  addMoreText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    gap: Spacing[3],
  },
  checkoutText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  checkoutPriceBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.md,
  },
  checkoutPrice: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
});
