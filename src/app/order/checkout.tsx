/**
 * Checkout Screen
 *
 * Smooth checkout flow with collapsible sections for address, order summary,
 * payment method, and promo code.
 *
 * Features:
 * - Collapsible sections with animated expand/collapse
 * - Delivery address selection and editing
 * - Order summary with itemized breakdown
 * - Payment method selection
 * - Promo code input
 * - Sticky "Place Order" button at bottom
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
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
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore, useCartStore } from '@/stores';
import type { Address } from '@/types';

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
export function calculateTotal(
  subtotal: number,
  deliveryFee: number,
  tax: number,
  discount?: number
): number {
  return subtotal + deliveryFee + tax - (discount ?? 0);
}

/**
 * Formats estimated delivery time
 */
export function formatEstimatedDelivery(minMinutes: number, maxMinutes: number): string {
  return `${minMinutes}-${maxMinutes} min`;
}

/**
 * Gets the appropriate icon for an address label
 */
export function getAddressIcon(label: string): keyof typeof Ionicons.glyphMap {
  switch (label.toLowerCase()) {
    case 'home':
      return 'home-outline';
    case 'work':
      return 'briefcase-outline';
    default:
      return 'location-outline';
  }
}

// ============================================================================
// Sub-Components
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SectionHeaderProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isExpanded: boolean;
  onPress: () => void;
  colors: (typeof Colors)['light'];
  rightContent?: React.ReactNode;
}

/**
 * Collapsible section header with animated chevron
 */
function SectionHeader({
  title,
  icon,
  isExpanded,
  onPress,
  colors,
  rightContent,
}: SectionHeaderProps) {
  const rotation = useSharedValue(isExpanded ? 1 : 0);

  // Update rotation when isExpanded changes
  rotation.value = withSpring(isExpanded ? 1 : 0, SPRING_CONFIG);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={[styles.sectionHeader, { borderBottomColor: colors.divider }]}
      accessibilityLabel={`${title} section, ${isExpanded ? 'expanded' : 'collapsed'}. Tap to ${isExpanded ? 'collapse' : 'expand'}`}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      testID={`section-header-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <View style={styles.sectionHeaderLeft}>
        <Ionicons name={icon} size={20} color={PrimaryColors[500]} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.sectionHeaderRight}>
        {rightContent}
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

interface CollapsibleSectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isExpanded: boolean;
  onToggle: () => void;
  colors: (typeof Colors)['light'];
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  delay?: number;
}

/**
 * Collapsible section with animated content
 */
function CollapsibleSection({
  title,
  icon,
  isExpanded,
  onToggle,
  colors,
  children,
  rightContent,
  delay = 0,
}: CollapsibleSectionProps) {
  const height = useSharedValue(isExpanded ? 1 : 0);

  // Update height when isExpanded changes
  height.value = withTiming(isExpanded ? 1 : 0, { duration: AnimationDurations.normal });

  const contentStyle = useAnimatedStyle(() => ({
    opacity: height.value,
    maxHeight: interpolate(height.value, [0, 1], [0, 1000]),
    overflow: 'hidden' as const,
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(delay)}
      style={[styles.section, { backgroundColor: colors.card, ...Shadows.md }]}
    >
      <SectionHeader
        title={title}
        icon={icon}
        isExpanded={isExpanded}
        onPress={onToggle}
        colors={colors}
        rightContent={rightContent}
      />
      <Animated.View style={[styles.sectionContent, contentStyle]}>{children}</Animated.View>
    </Animated.View>
  );
}

interface HeaderProps {
  onBack: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Screen header with back button and title
 */
function Header({ onBack, colors }: HeaderProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(100)}
      style={[styles.header, { borderBottomColor: colors.divider }]}
    >
      <Pressable
        onPress={onBack}
        style={styles.backButton}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        testID="checkout-back-button"
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
      <View style={styles.headerSpacer} />
    </Animated.View>
  );
}

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Selectable address card
 */
function AddressCard({ address, isSelected, onSelect, colors }: AddressCardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.addressCard,
        {
          backgroundColor: isSelected ? PrimaryColors[50] : colors.backgroundSecondary,
          borderColor: isSelected ? PrimaryColors[500] : colors.border,
        },
        animatedStyle,
      ]}
      accessibilityLabel={`${address.label} address: ${address.street}, ${address.city}. ${isSelected ? 'Selected' : 'Tap to select'}`}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      testID={`address-card-${address.id}`}
    >
      <View style={styles.addressCardLeft}>
        <View
          style={[
            styles.addressIconContainer,
            { backgroundColor: isSelected ? PrimaryColors[100] : colors.backgroundTertiary },
          ]}
        >
          <Ionicons
            name={getAddressIcon(address.label)}
            size={20}
            color={isSelected ? PrimaryColors[500] : colors.icon}
          />
        </View>
        <View style={styles.addressDetails}>
          <Text style={[styles.addressLabel, { color: colors.text }]}>{address.label}</Text>
          <Text style={[styles.addressStreet, { color: colors.textSecondary }]} numberOfLines={1}>
            {address.street}
          </Text>
          <Text style={[styles.addressCity, { color: colors.textTertiary }]}>
            {address.city}, {address.zipCode}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.radioButton,
          {
            borderColor: isSelected ? PrimaryColors[500] : colors.border,
            backgroundColor: isSelected ? PrimaryColors[500] : 'transparent',
          },
        ]}
      >
        {isSelected && <Ionicons name="checkmark" size={14} color={NeutralColors[0]} />}
      </View>
    </AnimatedPressable>
  );
}

interface OrderItemRowProps {
  name: string;
  quantity: number;
  price: number;
  customizations?: string;
  colors: (typeof Colors)['light'];
}

/**
 * Order item row in summary
 */
function OrderItemRow({ name, quantity, price, customizations, colors }: OrderItemRowProps) {
  return (
    <View style={styles.orderItemRow}>
      <View style={styles.orderItemDetails}>
        <Text style={[styles.orderItemName, { color: colors.text }]}>
          {quantity}x {name}
        </Text>
        {customizations && (
          <Text style={[styles.orderItemCustomizations, { color: colors.textTertiary }]}>
            {customizations}
          </Text>
        )}
      </View>
      <Text style={[styles.orderItemPrice, { color: colors.text }]}>{formatPrice(price)}</Text>
    </View>
  );
}

interface PaymentOptionProps {
  type: 'card' | 'cash';
  label: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  colors: (typeof Colors)['light'];
  icon: keyof typeof Ionicons.glyphMap;
}

/**
 * Payment method option
 */
function PaymentOption({
  type,
  label,
  description,
  isSelected,
  onSelect,
  colors,
  icon,
}: PaymentOptionProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.paymentOption,
        {
          backgroundColor: isSelected ? PrimaryColors[50] : colors.backgroundSecondary,
          borderColor: isSelected ? PrimaryColors[500] : colors.border,
        },
        animatedStyle,
      ]}
      accessibilityLabel={`${label}. ${description}. ${isSelected ? 'Selected' : 'Tap to select'}`}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      testID={`payment-option-${type}`}
    >
      <View style={styles.paymentOptionLeft}>
        <View
          style={[
            styles.paymentIconContainer,
            { backgroundColor: isSelected ? PrimaryColors[100] : colors.backgroundTertiary },
          ]}
        >
          <Ionicons name={icon} size={20} color={isSelected ? PrimaryColors[500] : colors.icon} />
        </View>
        <View style={styles.paymentDetails}>
          <Text style={[styles.paymentLabel, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.paymentDescription, { color: colors.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.radioButton,
          {
            borderColor: isSelected ? PrimaryColors[500] : colors.border,
            backgroundColor: isSelected ? PrimaryColors[500] : 'transparent',
          },
        ]}
      >
        {isSelected && <Ionicons name="checkmark" size={14} color={NeutralColors[0]} />}
      </View>
    </AnimatedPressable>
  );
}

interface PlaceOrderButtonProps {
  total: number;
  onPress: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  colors: (typeof Colors)['light'];
}

/**
 * Sticky place order button at bottom
 */
function PlaceOrderButton({
  total,
  onPress,
  isLoading,
  isDisabled,
  colors,
}: PlaceOrderButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!isDisabled && !isLoading) {
      scale.value = withSpring(0.97, SPRING_CONFIG);
    }
  }, [scale, isDisabled, isLoading]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.duration(AnimationDurations.normal).delay(300)}
      style={[
        styles.placeOrderContainer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.divider,
        },
      ]}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled || isLoading}
        style={[
          styles.placeOrderButton,
          {
            backgroundColor: isDisabled ? NeutralColors[300] : PrimaryColors[500],
          },
          buttonStyle,
        ]}
        accessibilityLabel={`Place order for ${formatPrice(total)}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled || isLoading }}
        testID="place-order-button"
      >
        {isLoading ? (
          <Text style={[styles.placeOrderText, { color: NeutralColors[0] }]}>Processing...</Text>
        ) : (
          <>
            <Text style={[styles.placeOrderText, { color: NeutralColors[0] }]}>Place Order</Text>
            <View style={styles.placeOrderPriceBadge}>
              <Text style={[styles.placeOrderPrice, { color: NeutralColors[0] }]}>
                {formatPrice(total)}
              </Text>
            </View>
          </>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Store state
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const restaurant = useCartStore((state) => state.restaurant);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  // Local state
  const [expandedSections, setExpandedSections] = useState({
    address: true,
    orderSummary: false,
    payment: false,
    promo: false,
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    user?.addresses.find((a) => a.isDefault)?.id ?? user?.addresses[0]?.id ?? null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'cash'>('card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Computed values
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
  const selectedAddress = useMemo(
    () => user?.addresses.find((a) => a.id === selectedAddressId),
    [user?.addresses, selectedAddressId]
  );
  const estimatedDelivery = useMemo(() => {
    if (!restaurant?.deliveryTime) return '30-45 min';
    return formatEstimatedDelivery(restaurant.deliveryTime.min, restaurant.deliveryTime.max);
  }, [restaurant?.deliveryTime]);

  // Validation
  const canPlaceOrder = selectedAddress !== undefined && items.length > 0;

  // Handlers
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleSelectAddress = useCallback((addressId: string) => {
    setSelectedAddressId(addressId);
  }, []);

  const handleSelectPayment = useCallback((method: 'card' | 'cash') => {
    setSelectedPaymentMethod(method);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (!canPlaceOrder) {
      Alert.alert('Missing Information', 'Please select a delivery address to continue.');
      return;
    }

    setIsPlacingOrder(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Clear cart and navigate to order confirmation
    clearCart();
    setIsPlacingOrder(false);

    // Navigate to order tracking (to be implemented in Phase 5)
    router.replace('/order/[id]' as never);
  }, [canPlaceOrder, clearCart, router]);

  // Format customizations for display
  const formatCustomizations = useCallback((item: (typeof items)[0]) => {
    if (item.selectedCustomizations.length === 0) return undefined;
    return item.selectedCustomizations
      .map((c) => c.selectedOptions.map((o) => o.optionName).join(', '))
      .join(' • ');
  }, []);

  // Empty cart check
  if (items.length === 0) {
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
        <Header onBack={handleBack} colors={colors} />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Add items to continue to checkout
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top,
          },
        ]}
        testID="checkout-screen"
      >
        {/* Header */}
        <Header onBack={handleBack} colors={colors} />

        {/* Restaurant Info */}
        {restaurant && (
          <Animated.View
            entering={FadeIn.duration(AnimationDurations.normal).delay(150)}
            style={[styles.restaurantBanner, { backgroundColor: colors.backgroundSecondary }]}
          >
            <Image
              source={{ uri: restaurant.image }}
              style={styles.restaurantImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.restaurantInfo}>
              <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
                {restaurant.name}
              </Text>
              <View style={styles.deliveryInfo}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.deliveryTime, { color: colors.textSecondary }]}>
                  {estimatedDelivery}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Delivery Address Section */}
          <CollapsibleSection
            title="Delivery Address"
            icon="location-outline"
            isExpanded={expandedSections.address}
            onToggle={() => toggleSection('address')}
            colors={colors}
            delay={100}
            rightContent={
              selectedAddress ? (
                <Text style={[styles.sectionSummary, { color: colors.textSecondary }]}>
                  {selectedAddress.label}
                </Text>
              ) : null
            }
          >
            {user?.addresses && user.addresses.length > 0 ? (
              <View style={styles.addressList}>
                {user.addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isSelected={address.id === selectedAddressId}
                    onSelect={() => handleSelectAddress(address.id)}
                    colors={colors}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.noAddressContainer}>
                <Ionicons name="location-outline" size={32} color={colors.textTertiary} />
                <Text style={[styles.noAddressText, { color: colors.textSecondary }]}>
                  No saved addresses
                </Text>
                <Pressable
                  style={[styles.addAddressButton, { borderColor: PrimaryColors[500] }]}
                  accessibilityLabel="Add new address"
                  accessibilityRole="button"
                  testID="add-address-button"
                >
                  <Ionicons name="add" size={16} color={PrimaryColors[500]} />
                  <Text style={[styles.addAddressText, { color: PrimaryColors[500] }]}>
                    Add Address
                  </Text>
                </Pressable>
              </View>
            )}
          </CollapsibleSection>

          {/* Order Summary Section */}
          <CollapsibleSection
            title="Order Summary"
            icon="receipt-outline"
            isExpanded={expandedSections.orderSummary}
            onToggle={() => toggleSection('orderSummary')}
            colors={colors}
            delay={200}
            rightContent={
              <Text style={[styles.sectionSummary, { color: colors.textSecondary }]}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Text>
            }
          >
            <View style={styles.orderSummaryContent}>
              {/* Items */}
              {items.map((item) => (
                <OrderItemRow
                  key={item.id}
                  name={item.menuItem.name}
                  quantity={item.quantity}
                  price={item.totalPrice}
                  customizations={formatCustomizations(item)}
                  colors={colors}
                />
              ))}

              {/* Divider */}
              <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />

              {/* Cost breakdown */}
              <View style={styles.costRow}>
                <Text style={[styles.costLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                <Text style={[styles.costValue, { color: colors.text }]}>
                  {formatPrice(subtotal)}
                </Text>
              </View>
              <View style={styles.costRow}>
                <Text style={[styles.costLabel, { color: colors.textSecondary }]}>
                  Delivery Fee
                </Text>
                <Text style={[styles.costValue, { color: colors.text }]}>
                  {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                </Text>
              </View>
              <View style={styles.costRow}>
                <Text style={[styles.costLabel, { color: colors.textSecondary }]}>Tax</Text>
                <Text style={[styles.costValue, { color: colors.text }]}>{formatPrice(tax)}</Text>
              </View>

              {/* Total */}
              <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.totalValue, { color: colors.text }]}>
                  {formatPrice(total)}
                </Text>
              </View>
            </View>
          </CollapsibleSection>

          {/* Payment Method Section */}
          <CollapsibleSection
            title="Payment Method"
            icon="card-outline"
            isExpanded={expandedSections.payment}
            onToggle={() => toggleSection('payment')}
            colors={colors}
            delay={300}
            rightContent={
              <Text style={[styles.sectionSummary, { color: colors.textSecondary }]}>
                {selectedPaymentMethod === 'card' ? 'Card' : 'Cash'}
              </Text>
            }
          >
            <View style={styles.paymentOptions}>
              <PaymentOption
                type="card"
                label="Credit/Debit Card"
                description="Pay securely with your card"
                icon="card-outline"
                isSelected={selectedPaymentMethod === 'card'}
                onSelect={() => handleSelectPayment('card')}
                colors={colors}
              />
              <PaymentOption
                type="cash"
                label="Cash on Delivery"
                description="Pay when your order arrives"
                icon="cash-outline"
                isSelected={selectedPaymentMethod === 'cash'}
                onSelect={() => handleSelectPayment('cash')}
                colors={colors}
              />
            </View>
          </CollapsibleSection>

          {/* Promo Code Section */}
          <CollapsibleSection
            title="Promo Code"
            icon="pricetag-outline"
            isExpanded={expandedSections.promo}
            onToggle={() => toggleSection('promo')}
            colors={colors}
            delay={400}
          >
            <View style={styles.promoContent}>
              <Text style={[styles.promoPlaceholder, { color: colors.textTertiary }]}>
                Promo code input will be implemented in Task 4.6
              </Text>
            </View>
          </CollapsibleSection>
        </ScrollView>

        {/* Place Order Button */}
        <PlaceOrderButton
          total={total}
          onPress={handlePlaceOrder}
          isLoading={isPlacingOrder}
          isDisabled={!canPlaceOrder}
          colors={colors}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  keyboardAvoid: {
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
  backButton: {
    padding: Spacing[1],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  headerSpacer: {
    width: 32,
  },
  restaurantBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    marginHorizontal: Spacing[4],
    marginTop: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: Spacing[3],
  },
  restaurantName: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[0.5],
    gap: Spacing[1],
  },
  deliveryTime: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  section: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[4],
    borderBottomWidth: 0,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  sectionTitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  sectionSummary: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  sectionContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
  },
  addressList: {
    gap: Spacing[2],
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[3],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  addressCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressDetails: {
    marginLeft: Spacing[3],
    flex: 1,
  },
  addressLabel: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  addressStreet: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginTop: Spacing[0.5],
  },
  addressCity: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAddressContainer: {
    alignItems: 'center',
    paddingVertical: Spacing[4],
    gap: Spacing[2],
  },
  noAddressText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing[1],
  },
  addAddressText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  orderSummaryContent: {
    gap: Spacing[2],
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderItemDetails: {
    flex: 1,
    marginRight: Spacing[3],
  },
  orderItemName: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  orderItemCustomizations: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[0.5],
  },
  orderItemPrice: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
  },
  summaryDivider: {
    height: 1,
    marginVertical: Spacing[2],
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  costValue: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  paymentOptions: {
    gap: Spacing[2],
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[3],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDetails: {
    marginLeft: Spacing[3],
    flex: 1,
  },
  paymentLabel: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  paymentDescription: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[0.5],
  },
  promoContent: {
    paddingVertical: Spacing[4],
    alignItems: 'center',
  },
  promoPlaceholder: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontStyle: 'italic',
  },
  placeOrderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing[4],
    borderTopWidth: 1,
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    gap: Spacing[3],
  },
  placeOrderText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  placeOrderPriceBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.md,
  },
  placeOrderPrice: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
    gap: Spacing[2],
  },
  emptyTitle: {
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  emptySubtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
  },
});
