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
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  type TextStyle,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  ErrorColors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  SuccessColors,
  Typography,
} from '@/constants/theme';
import {
  calculateDiscount,
  formatPromoCodeDescription,
  type PromoValidationResult,
  validatePromoCodeAsync,
} from '@/data/mock';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  formatCardExpiry,
  formatCardNumber,
  getCardBrandDisplayName,
  useAuthStore,
  useCartStore,
  usePaymentStore,
} from '@/stores';
import type { Address, AddressLabel, CardBrand, PaymentMethod, PromoCode } from '@/types';

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

export const MAX_DELIVERY_INSTRUCTIONS_LENGTH = 200;

// ============================================================================
// Validation Schema for Address
// ============================================================================

export const addressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other'] as const),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  instructions: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;

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
  unitPrice: number;
  customizations?: string;
  specialInstructions?: string;
  colors: (typeof Colors)['light'];
  index?: number;
  image?: string;
}

/**
 * Order item row in summary with image, customizations, and special instructions
 */
export function OrderItemRow({
  name,
  quantity,
  price,
  unitPrice,
  customizations,
  specialInstructions,
  colors,
  index = 0,
  image,
}: OrderItemRowProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(index * 50)}
      style={styles.orderItemRow}
      testID={`order-item-row-${index}`}
    >
      {/* Item Image */}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.orderItemImage}
          contentFit="cover"
          transition={200}
          testID={`order-item-image-${index}`}
        />
      )}

      {/* Item Details */}
      <View style={styles.orderItemDetails}>
        <View style={styles.orderItemHeader}>
          <View style={[styles.orderItemQuantityBadge, { backgroundColor: PrimaryColors[500] }]}>
            <Text style={[styles.orderItemQuantityText, { color: NeutralColors[0] }]}>
              {quantity}x
            </Text>
          </View>
          <Text style={[styles.orderItemName, { color: colors.text }]} numberOfLines={1}>
            {name}
          </Text>
        </View>

        {/* Customizations */}
        {customizations && (
          <View style={styles.orderItemCustomizationsContainer}>
            <Ionicons name="options-outline" size={12} color={colors.textTertiary} />
            <Text
              style={[styles.orderItemCustomizations, { color: colors.textTertiary }]}
              numberOfLines={2}
            >
              {customizations}
            </Text>
          </View>
        )}

        {/* Special Instructions */}
        {specialInstructions && (
          <View style={styles.orderItemInstructionsContainer}>
            <Ionicons name="chatbubble-outline" size={12} color={colors.textTertiary} />
            <Text
              style={[styles.orderItemInstructions, { color: colors.textTertiary }]}
              numberOfLines={1}
            >
              {specialInstructions}
            </Text>
          </View>
        )}

        {/* Unit Price (shown if quantity > 1) */}
        {quantity > 1 && (
          <Text style={[styles.orderItemUnitPrice, { color: colors.textTertiary }]}>
            {formatPrice(unitPrice)} each
          </Text>
        )}
      </View>

      {/* Total Price */}
      <Text style={[styles.orderItemPrice, { color: colors.text }]}>{formatPrice(price)}</Text>
    </Animated.View>
  );
}

/**
 * Cost breakdown row in order summary
 */
interface CostRowProps {
  label: string;
  value: string;
  colors: (typeof Colors)['light'];
  isHighlighted?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  isFree?: boolean;
}

export function CostRow({ label, value, colors, isHighlighted, icon, isFree }: CostRowProps) {
  return (
    <View style={styles.costRow} testID={`cost-row-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <View style={styles.costLabelContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={14}
            color={isHighlighted ? PrimaryColors[500] : colors.textSecondary}
            style={styles.costIcon}
          />
        )}
        <Text
          style={[
            styles.costLabel,
            { color: isHighlighted ? colors.text : colors.textSecondary },
            isHighlighted && styles.costLabelHighlighted,
          ]}
        >
          {label}
        </Text>
      </View>
      <Text
        style={[
          styles.costValue,
          { color: isFree ? SuccessColors[600] : colors.text },
          isHighlighted && styles.costValueHighlighted,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/**
 * Total row with prominent styling
 */
interface TotalRowProps {
  total: number;
  colors: (typeof Colors)['light'];
  savings?: number;
}

export function TotalRow({ total, colors, savings }: TotalRowProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal).delay(100)}
      style={styles.totalRowContainer}
    >
      {savings && savings > 0 && (
        <View style={[styles.savingsBadge, { backgroundColor: SuccessColors[50] }]}>
          <Ionicons name="pricetag" size={14} color={SuccessColors[600]} />
          <Text style={[styles.savingsText, { color: SuccessColors[700] }]}>
            You save {formatPrice(savings)}
          </Text>
        </View>
      )}
      <View style={styles.totalRow} testID="order-summary-total-row">
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: PrimaryColors[500] }]}>{formatPrice(total)}</Text>
      </View>
    </Animated.View>
  );
}

/**
 * Order Summary Section Content with full breakdown
 */
interface OrderSummarySectionProps {
  items: ReturnType<typeof useCartStore.getState>['items'];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  discount?: number;
  colors: (typeof Colors)['light'];
  formatCustomizations: (
    item: ReturnType<typeof useCartStore.getState>['items'][0]
  ) => string | undefined;
}

export function OrderSummarySection({
  items,
  subtotal,
  deliveryFee,
  tax,
  total,
  discount,
  colors,
  formatCustomizations,
}: OrderSummarySectionProps) {
  return (
    <View style={styles.orderSummaryContent} testID="order-summary-content">
      {/* Items Header */}
      <View style={styles.orderSummaryItemsHeader}>
        <Ionicons name="fast-food-outline" size={16} color={colors.textSecondary} />
        <Text style={[styles.orderSummaryItemsTitle, { color: colors.textSecondary }]}>
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </Text>
      </View>

      {/* Items */}
      <View style={styles.orderItemsList}>
        {items.map((item, index) => (
          <OrderItemRow
            key={item.id}
            name={item.menuItem.name}
            quantity={item.quantity}
            price={item.totalPrice}
            unitPrice={item.menuItem.price}
            customizations={formatCustomizations(item)}
            specialInstructions={item.specialInstructions}
            colors={colors}
            index={index}
            image={item.menuItem.image}
          />
        ))}
      </View>

      {/* Divider */}
      <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />

      {/* Cost breakdown */}
      <View style={styles.costBreakdown}>
        <CostRow
          label="Subtotal"
          value={formatPrice(subtotal)}
          colors={colors}
          icon="cart-outline"
        />
        <CostRow
          label="Delivery Fee"
          value={deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
          colors={colors}
          icon="bicycle-outline"
          isFree={deliveryFee === 0}
        />
        <CostRow
          label={`Tax (${(TAX_RATE * 100).toFixed(2)}%)`}
          value={formatPrice(tax)}
          colors={colors}
          icon="document-text-outline"
        />
        {discount && discount > 0 && (
          <CostRow
            label="Discount"
            value={`-${formatPrice(discount)}`}
            colors={colors}
            icon="pricetag-outline"
            isHighlighted
          />
        )}
      </View>

      {/* Total */}
      <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
      <TotalRow total={total} colors={colors} savings={discount} />
    </View>
  );
}

// ============================================================================
// Payment Method Components
// ============================================================================

/**
 * Card brand color mapping for visual differentiation
 */
export const CARD_BRAND_COLORS: Record<CardBrand, string> = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#006FCF',
  discover: '#FF6000',
};

interface SavedCardOptionProps {
  card: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
  colors: (typeof Colors)['light'];
  index?: number;
}

/**
 * Saved card payment option with card brand icon and details
 */
export function SavedCardOption({
  card,
  isSelected,
  onSelect,
  colors,
  index = 0,
}: SavedCardOptionProps) {
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

  const brandColor = card.brand ? CARD_BRAND_COLORS[card.brand] : colors.textSecondary;
  const brandName = getCardBrandDisplayName(card.brand);
  const cardNumber = formatCardNumber(card.last4);
  const expiry = formatCardExpiry(card.expiryMonth, card.expiryYear);

  return (
    <Animated.View entering={FadeInDown.duration(AnimationDurations.normal).delay(index * 50)}>
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
        accessibilityLabel={`${brandName} ending in ${card.last4 ?? 'unknown'}. Expires ${expiry}. ${card.isDefault ? 'Default card.' : ''} ${isSelected ? 'Selected' : 'Tap to select'}`}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        testID={`saved-card-${card.id}`}
      >
        <View style={styles.paymentOptionLeft}>
          {/* Card Brand Icon */}
          <View
            style={[
              styles.cardBrandIconContainer,
              { backgroundColor: isSelected ? PrimaryColors[100] : colors.backgroundTertiary },
            ]}
          >
            <CardBrandIcon brand={card.brand} size={24} color={brandColor} />
          </View>
          <View style={styles.paymentDetails}>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.paymentLabel, { color: colors.text }]}>{brandName}</Text>
              {card.isDefault && (
                <View style={[styles.defaultCardBadge, { backgroundColor: SuccessColors[100] }]}>
                  <Text style={[styles.defaultCardBadgeText, { color: SuccessColors[700] }]}>
                    Default
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.cardDetailsRow}>
              <Text style={[styles.cardNumber, { color: colors.textSecondary }]}>{cardNumber}</Text>
              <Text style={[styles.cardExpiry, { color: colors.textTertiary }]}>
                Expires {expiry}
              </Text>
            </View>
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
    </Animated.View>
  );
}

interface CardBrandIconProps {
  brand?: CardBrand;
  size?: number;
  color?: string;
}

/**
 * Card brand icon component displaying brand-specific icons
 */
export function CardBrandIcon({ brand, size = 24, color }: CardBrandIconProps) {
  // Use text-based brand display for now since Ionicons doesn't have specific card brand icons
  // In production, you'd use actual brand logos/images
  switch (brand) {
    case 'visa':
      return (
        <View style={[styles.cardBrandTextContainer, { width: size, height: size }]}>
          <Text style={[styles.cardBrandText, { fontSize: size * 0.4, color }]}>VISA</Text>
        </View>
      );
    case 'mastercard':
      return (
        <View style={[styles.cardBrandTextContainer, { width: size, height: size }]}>
          <View style={styles.mastercardCircles}>
            <View style={[styles.mastercardCircle, { backgroundColor: '#EB001B' }]} />
            <View style={[styles.mastercardCircle, { backgroundColor: '#F79E1B' }]} />
          </View>
        </View>
      );
    case 'amex':
      return (
        <View style={[styles.cardBrandTextContainer, { width: size, height: size }]}>
          <Text style={[styles.cardBrandText, { fontSize: size * 0.35, color }]}>AMEX</Text>
        </View>
      );
    case 'discover':
      return (
        <View style={[styles.cardBrandTextContainer, { width: size, height: size }]}>
          <Text style={[styles.cardBrandText, { fontSize: size * 0.3, color }]}>DISC</Text>
        </View>
      );
    default:
      return <Ionicons name="card-outline" size={size} color={color} />;
  }
}

interface CashOnDeliveryOptionProps {
  isSelected: boolean;
  onSelect: () => void;
  colors: (typeof Colors)['light'];
  index?: number;
}

/**
 * Cash on delivery payment option
 */
export function CashOnDeliveryOption({
  isSelected,
  onSelect,
  colors,
  index = 0,
}: CashOnDeliveryOptionProps) {
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
    <Animated.View entering={FadeInDown.duration(AnimationDurations.normal).delay(index * 50)}>
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
        accessibilityLabel={`Cash on Delivery. Pay when your order arrives. ${isSelected ? 'Selected' : 'Tap to select'}`}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        testID="payment-option-cash"
      >
        <View style={styles.paymentOptionLeft}>
          <View
            style={[
              styles.paymentIconContainer,
              { backgroundColor: isSelected ? PrimaryColors[100] : colors.backgroundTertiary },
            ]}
          >
            <Ionicons
              name="cash-outline"
              size={20}
              color={isSelected ? PrimaryColors[500] : colors.icon}
            />
          </View>
          <View style={styles.paymentDetails}>
            <Text style={[styles.paymentLabel, { color: colors.text }]}>Cash on Delivery</Text>
            <Text style={[styles.paymentDescription, { color: colors.textSecondary }]}>
              Pay when your order arrives
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
    </Animated.View>
  );
}

interface AddNewCardButtonProps {
  onPress: () => void;
  colors: (typeof Colors)['light'];
  index?: number;
}

/**
 * Add new card button that navigates to add card screen
 */
export function AddNewCardButton({ onPress, index = 0 }: AddNewCardButtonProps) {
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
    <Animated.View entering={FadeInDown.duration(AnimationDurations.normal).delay(index * 50)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.addNewCardButton, { borderColor: PrimaryColors[500] }, animatedStyle]}
        accessibilityLabel="Add a new card"
        accessibilityRole="button"
        testID="add-new-card-button"
      >
        <Ionicons name="add-circle-outline" size={20} color={PrimaryColors[500]} />
        <Text style={[styles.addNewCardText, { color: PrimaryColors[500] }]}>Add New Card</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

interface PaymentMethodSectionContentProps {
  savedCards: PaymentMethod[];
  selectedPaymentId: string | null;
  onSelectPayment: (id: string | null) => void;
  onAddNewCard: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Complete payment method section content with saved cards, cash option, and add card
 */
export function PaymentMethodSectionContent({
  savedCards,
  selectedPaymentId,
  onSelectPayment,
  onAddNewCard,
  colors,
}: PaymentMethodSectionContentProps) {
  const isCashSelected = selectedPaymentId === 'cash';

  return (
    <View style={styles.paymentOptions} testID="payment-method-section">
      {/* Saved Cards Header */}
      {savedCards.length > 0 && (
        <Animated.View entering={FadeIn.duration(AnimationDurations.normal)}>
          <View style={styles.paymentSubsectionHeader}>
            <Ionicons name="card" size={16} color={colors.textSecondary} />
            <Text style={[styles.paymentSubsectionTitle, { color: colors.textSecondary }]}>
              Saved Cards
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Saved Cards List */}
      {savedCards.map((card, index) => (
        <SavedCardOption
          key={card.id}
          card={card}
          isSelected={selectedPaymentId === card.id}
          onSelect={() => onSelectPayment(card.id)}
          colors={colors}
          index={index}
        />
      ))}

      {/* Add New Card Button */}
      <AddNewCardButton onPress={onAddNewCard} colors={colors} index={savedCards.length} />

      {/* Divider */}
      <View style={[styles.paymentDivider, { backgroundColor: colors.divider }]} />

      {/* Other Payment Methods Header */}
      <Animated.View entering={FadeIn.duration(AnimationDurations.normal).delay(100)}>
        <View style={styles.paymentSubsectionHeader}>
          <Ionicons name="wallet-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.paymentSubsectionTitle, { color: colors.textSecondary }]}>
            Other Payment Methods
          </Text>
        </View>
      </Animated.View>

      {/* Cash on Delivery */}
      <CashOnDeliveryOption
        isSelected={isCashSelected}
        onSelect={() => onSelectPayment('cash')}
        colors={colors}
        index={savedCards.length + 2}
      />
    </View>
  );
}

// ============================================================================
// Address Label Selector Component
// ============================================================================

interface AddressLabelSelectorProps {
  value: AddressLabel;
  onChange: (label: AddressLabel) => void;
  colors: (typeof Colors)['light'];
}

/**
 * Selector for address label (Home, Work, Other)
 */
export function AddressLabelSelector({ value, onChange, colors }: AddressLabelSelectorProps) {
  const labels: { label: AddressLabel; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Home', icon: 'home-outline' },
    { label: 'Work', icon: 'briefcase-outline' },
    { label: 'Other', icon: 'location-outline' },
  ];

  return (
    <View style={styles.labelSelectorContainer}>
      <Text style={[styles.labelSelectorTitle, { color: colors.text }]}>Address Label</Text>
      <View style={styles.labelOptions}>
        {labels.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => onChange(item.label)}
            style={[
              styles.labelOption,
              {
                backgroundColor:
                  value === item.label ? PrimaryColors[500] : colors.backgroundSecondary,
                borderColor: value === item.label ? PrimaryColors[500] : colors.border,
              },
            ]}
            accessibilityLabel={`${item.label} address label`}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === item.label }}
            testID={`address-label-${item.label.toLowerCase()}`}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={value === item.label ? NeutralColors[0] : colors.textSecondary}
            />
            <Text
              style={[
                styles.labelOptionText,
                { color: value === item.label ? NeutralColors[0] : colors.text },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ============================================================================
// Add/Edit Address Modal
// ============================================================================

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: AddressFormData) => void;
  initialData?: Address;
  isEditing?: boolean;
}

/**
 * Modal for adding or editing an address
 */
export function AddressModal({
  visible,
  onClose,
  onSave,
  initialData,
  isEditing,
}: AddressModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData
      ? {
          label: initialData.label,
          street: initialData.street,
          city: initialData.city,
          zipCode: initialData.zipCode,
          instructions: initialData.instructions || '',
          isDefault: initialData.isDefault,
        }
      : {
          label: 'Home',
          street: '',
          city: '',
          zipCode: '',
          instructions: '',
          isDefault: false,
        },
    mode: 'onChange',
  });

  const handleSave = useCallback(
    (data: AddressFormData) => {
      onSave(data);
      form.reset();
      onClose();
    },
    [onSave, onClose, form]
  );

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.modalContent, { paddingTop: insets.top || Spacing[4] }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.divider }]}>
              <Pressable
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Close modal"
                accessibilityRole="button"
                testID="address-modal-close"
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {isEditing ? 'Edit Address' : 'Add New Address'}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Address Label Selector */}
              <Controller
                control={form.control}
                name="label"
                render={({ field: { onChange, value } }) => (
                  <AddressLabelSelector value={value} onChange={onChange} colors={colors} />
                )}
              />

              {/* Street Address */}
              <Controller
                control={form.control}
                name="street"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Street Address</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          borderColor: error ? ErrorColors[500] : colors.border,
                          backgroundColor: colors.backgroundSecondary,
                        },
                      ]}
                    >
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color={colors.textSecondary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="123 Main Street, Apt 4B"
                        placeholderTextColor={colors.textTertiary}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        testID="address-street-input"
                      />
                    </View>
                    {error && (
                      <Text style={[styles.inputError, { color: ErrorColors[500] }]}>
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* City */}
              <Controller
                control={form.control}
                name="city"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>City</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          borderColor: error ? ErrorColors[500] : colors.border,
                          backgroundColor: colors.backgroundSecondary,
                        },
                      ]}
                    >
                      <TextInput
                        style={[styles.input, styles.inputNoPadding, { color: colors.text }]}
                        placeholder="New York"
                        placeholderTextColor={colors.textTertiary}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        testID="address-city-input"
                      />
                    </View>
                    {error && (
                      <Text style={[styles.inputError, { color: ErrorColors[500] }]}>
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* ZIP Code */}
              <Controller
                control={form.control}
                name="zipCode"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>ZIP Code</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          borderColor: error ? ErrorColors[500] : colors.border,
                          backgroundColor: colors.backgroundSecondary,
                        },
                      ]}
                    >
                      <TextInput
                        style={[styles.input, styles.inputNoPadding, { color: colors.text }]}
                        placeholder="10001"
                        placeholderTextColor={colors.textTertiary}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="number-pad"
                        testID="address-zipcode-input"
                      />
                    </View>
                    {error && (
                      <Text style={[styles.inputError, { color: ErrorColors[500] }]}>
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Delivery Instructions */}
              <Controller
                control={form.control}
                name="instructions"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                      Delivery Instructions (Optional)
                    </Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        styles.inputWrapperMultiline,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.backgroundSecondary,
                        },
                      ]}
                    >
                      <TextInput
                        style={[
                          styles.input,
                          styles.inputNoPadding,
                          styles.inputMultiline,
                          { color: colors.text },
                        ]}
                        placeholder="Buzz apartment 4B, leave at door, etc."
                        placeholderTextColor={colors.textTertiary}
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                        numberOfLines={3}
                        maxLength={MAX_DELIVERY_INSTRUCTIONS_LENGTH}
                        testID="address-instructions-input"
                      />
                    </View>
                    <Text style={[styles.characterCount, { color: colors.textTertiary }]}>
                      {(value || '').length}/{MAX_DELIVERY_INSTRUCTIONS_LENGTH}
                    </Text>
                  </View>
                )}
              />

              {/* Set as Default Toggle */}
              <Controller
                control={form.control}
                name="isDefault"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.defaultToggleContainer}>
                    <View style={styles.defaultToggleTextContainer}>
                      <Text style={[styles.defaultToggleLabel, { color: colors.text }]}>
                        Set as default address
                      </Text>
                      <Text
                        style={[styles.defaultToggleDescription, { color: colors.textSecondary }]}
                      >
                        This address will be selected by default for deliveries
                      </Text>
                    </View>
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{ false: colors.border, true: PrimaryColors[500] }}
                      thumbColor={NeutralColors[0]}
                      testID="address-default-toggle"
                    />
                  </View>
                )}
              />
            </ScrollView>

            {/* Save Button */}
            <View
              style={[
                styles.modalFooter,
                { paddingBottom: insets.bottom || Spacing[4], borderTopColor: colors.divider },
              ]}
            >
              <Pressable
                onPress={form.handleSubmit(handleSave)}
                style={[styles.modalSaveButton, { backgroundColor: PrimaryColors[500] }]}
                accessibilityLabel={isEditing ? 'Save changes' : 'Add address'}
                accessibilityRole="button"
                testID="address-modal-save"
              >
                <Text style={[styles.modalSaveButtonText, { color: NeutralColors[0] }]}>
                  {isEditing ? 'Save Changes' : 'Add Address'}
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ============================================================================
// Enhanced Delivery Address Section Components
// ============================================================================

interface SelectedAddressDisplayProps {
  address: Address;
  onEdit: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Displays the currently selected address with edit button
 */
function SelectedAddressDisplay({ address, onEdit, colors }: SelectedAddressDisplayProps) {
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
    <Animated.View entering={FadeIn.duration(AnimationDurations.normal)} style={animatedStyle}>
      <View
        style={[
          styles.selectedAddressContainer,
          { backgroundColor: PrimaryColors[50], borderColor: PrimaryColors[200] },
        ]}
        testID="selected-address-display"
      >
        <View style={styles.selectedAddressMain}>
          <View style={styles.selectedAddressHeader}>
            <View
              style={[styles.selectedAddressIconContainer, { backgroundColor: PrimaryColors[100] }]}
            >
              <Ionicons name={getAddressIcon(address.label)} size={20} color={PrimaryColors[500]} />
            </View>
            <View style={styles.selectedAddressInfo}>
              <View style={styles.selectedAddressLabelRow}>
                <Text style={[styles.selectedAddressLabel, { color: colors.text }]}>
                  {address.label}
                </Text>
                {address.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: SuccessColors[100] }]}>
                    <Text style={[styles.defaultBadgeText, { color: SuccessColors[700] }]}>
                      Default
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[styles.selectedAddressStreet, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {address.street}
              </Text>
              <Text style={[styles.selectedAddressCity, { color: colors.textTertiary }]}>
                {address.city}, {address.zipCode}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onEdit}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.editAddressButton, { backgroundColor: colors.background }]}
            accessibilityLabel="Edit selected address"
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID="edit-selected-address-button"
          >
            <Ionicons name="pencil-outline" size={18} color={PrimaryColors[500]} />
          </Pressable>
        </View>
        {address.instructions && (
          <View style={[styles.instructionsPreview, { borderTopColor: PrimaryColors[100] }]}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.textTertiary} />
            <Text
              style={[styles.instructionsPreviewText, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {address.instructions}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

interface DeliveryInstructionsInputProps {
  value: string;
  onChange: (text: string) => void;
  colors: (typeof Colors)['light'];
}

/**
 * Input field for delivery instructions
 */
function DeliveryInstructionsInput({ value, onChange, colors }: DeliveryInstructionsInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Animated.View entering={FadeInDown.duration(AnimationDurations.normal).delay(100)}>
      <View style={styles.deliveryInstructionsContainer}>
        <Text style={[styles.deliveryInstructionsLabel, { color: colors.text }]}>
          Delivery Instructions
        </Text>
        <View
          style={[
            styles.deliveryInstructionsInputWrapper,
            {
              borderColor: isFocused ? PrimaryColors[500] : colors.border,
              backgroundColor: colors.backgroundSecondary,
            },
          ]}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color={isFocused ? PrimaryColors[500] : colors.textTertiary}
            style={styles.deliveryInstructionsIcon}
          />
          <TextInput
            style={[styles.deliveryInstructionsInput, { color: colors.text }]}
            placeholder="e.g., Ring doorbell, leave at front door..."
            placeholderTextColor={colors.textTertiary}
            value={value}
            onChangeText={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline
            numberOfLines={2}
            maxLength={MAX_DELIVERY_INSTRUCTIONS_LENGTH}
            accessibilityLabel="Delivery instructions"
            testID="delivery-instructions-input"
          />
        </View>
        <View style={styles.deliveryInstructionsFooter}>
          <Text style={[styles.deliveryInstructionsHint, { color: colors.textTertiary }]}>
            Special instructions for the driver
          </Text>
          <Text style={[styles.deliveryInstructionsCount, { color: colors.textTertiary }]}>
            {value.length}/{MAX_DELIVERY_INSTRUCTIONS_LENGTH}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

interface EstimatedDeliveryDisplayProps {
  estimatedTime: string;
  colors: (typeof Colors)['light'];
}

/**
 * Displays estimated delivery time prominently
 */
function EstimatedDeliveryDisplay({ estimatedTime, colors }: EstimatedDeliveryDisplayProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(150)}
      style={[styles.estimatedDeliveryContainer, { backgroundColor: colors.backgroundSecondary }]}
    >
      <View style={[styles.estimatedDeliveryIcon, { backgroundColor: PrimaryColors[100] }]}>
        <Ionicons name="time-outline" size={20} color={PrimaryColors[500]} />
      </View>
      <View style={styles.estimatedDeliveryInfo}>
        <Text style={[styles.estimatedDeliveryLabel, { color: colors.textSecondary }]}>
          Estimated Delivery
        </Text>
        <Text style={[styles.estimatedDeliveryTime, { color: colors.text }]}>{estimatedTime}</Text>
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Promo Code Section
// ============================================================================

interface PromoCodeSectionProps {
  promoCode: string;
  onChangePromoCode: (text: string) => void;
  onApply: () => void;
  onRemove: () => void;
  isValidating: boolean;
  appliedPromo: PromoCode | null;
  validationError: string | null;
  discount: number;
  colors: (typeof Colors)['light'];
}

/**
 * Promo code input section with validation feedback
 */
export function PromoCodeSection({
  promoCode,
  onChangePromoCode,
  onApply,
  onRemove,
  isValidating,
  appliedPromo,
  validationError,
  discount,
  colors,
}: PromoCodeSectionProps) {
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  // Shake animation on error
  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // If promo is already applied, show the applied state
  if (appliedPromo) {
    return (
      <View style={styles.promoAppliedContainer} testID="promo-applied">
        <View style={styles.promoAppliedContent}>
          <View style={[styles.promoAppliedIconContainer, { backgroundColor: SuccessColors[100] }]}>
            <Ionicons name="pricetag" size={20} color={SuccessColors[600]} />
          </View>
          <View style={styles.promoAppliedDetails}>
            <Text style={[styles.promoAppliedCode, { color: colors.text }]}>
              {appliedPromo.code}
            </Text>
            <Text style={[styles.promoAppliedDescription, { color: SuccessColors[600] }]}>
              {formatPromoCodeDescription(appliedPromo)} • Saving {formatPrice(discount)}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onRemove}
          style={[styles.promoRemoveButton, { backgroundColor: colors.backgroundSecondary }]}
          accessibilityLabel="Remove promo code"
          accessibilityRole="button"
          testID="promo-remove-button"
        >
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.promoInputContainer} testID="promo-input-section">
      <Animated.View style={[styles.promoInputWrapper, inputAnimatedStyle]}>
        <View
          style={[
            styles.promoInputRow,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: validationError ? ErrorColors[500] : colors.border,
            },
          ]}
        >
          <Ionicons
            name="pricetag-outline"
            size={20}
            color={validationError ? ErrorColors[500] : colors.textTertiary}
            style={styles.promoInputIcon}
          />
          <TextInput
            style={[
              styles.promoInput,
              { color: colors.text },
              validationError && { color: ErrorColors[600] },
            ]}
            placeholder="Enter promo code"
            placeholderTextColor={colors.textTertiary}
            value={promoCode}
            onChangeText={onChangePromoCode}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!isValidating}
            testID="promo-input"
            accessibilityLabel="Promo code input"
          />
          <AnimatedPressable
            onPress={onApply}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!promoCode.trim() || isValidating}
            style={[
              styles.promoApplyButton,
              {
                backgroundColor:
                  promoCode.trim() && !isValidating ? PrimaryColors[500] : NeutralColors[300],
              },
              buttonStyle,
            ]}
            accessibilityLabel="Apply promo code"
            accessibilityRole="button"
            accessibilityState={{ disabled: !promoCode.trim() || isValidating }}
            testID="promo-apply-button"
          >
            {isValidating ? (
              <Text style={[styles.promoApplyText, { color: NeutralColors[0] }]}>...</Text>
            ) : (
              <Text style={[styles.promoApplyText, { color: NeutralColors[0] }]}>Apply</Text>
            )}
          </AnimatedPressable>
        </View>
      </Animated.View>

      {/* Error Message */}
      {validationError && (
        <Animated.View
          entering={FadeIn.duration(AnimationDurations.fast)}
          style={styles.promoErrorContainer}
        >
          <Ionicons name="alert-circle" size={14} color={ErrorColors[500]} />
          <Text style={[styles.promoErrorText, { color: ErrorColors[500] }]} testID="promo-error">
            {validationError}
          </Text>
        </Animated.View>
      )}

      {/* Hint text */}
      <Text style={[styles.promoHintText, { color: colors.textTertiary }]}>
        Try: WELCOME10, SAVE5, or FREEDELIVERY
      </Text>
    </View>
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
  const addAddress = useAuthStore((state) => state.addAddress);
  const updateAddress = useAuthStore((state) => state.updateAddress);
  const items = useCartStore((state) => state.items);
  const restaurant = useCartStore((state) => state.restaurant);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  // Payment store state
  const paymentMethods = usePaymentStore((state) => state.paymentMethods);
  const selectedPaymentMethodId = usePaymentStore((state) => state.selectedPaymentMethodId);
  const selectPaymentMethod = usePaymentStore((state) => state.selectPaymentMethod);
  const getSavedCards = usePaymentStore((state) => state.getSavedCards);
  const getSelectedPaymentMethod = usePaymentStore((state) => state.getSelectedPaymentMethod);

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
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    user?.addresses.find((a) => a.id === selectedAddressId)?.instructions ?? ''
  );
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const [promoValidationError, setPromoValidationError] = useState<string | null>(null);

  // Computed values
  const subtotal = getSubtotal();
  const deliveryFee = useMemo(
    () => getDeliveryFee(restaurant?.deliveryFee),
    [restaurant?.deliveryFee]
  );
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const discount = useMemo(
    () => (appliedPromoCode ? calculateDiscount(appliedPromoCode, subtotal) : 0),
    [appliedPromoCode, subtotal]
  );
  const total = useMemo(
    () => calculateTotal(subtotal, deliveryFee, tax, discount),
    [subtotal, deliveryFee, tax, discount]
  );
  const selectedAddress = useMemo(
    () => user?.addresses.find((a) => a.id === selectedAddressId),
    [user?.addresses, selectedAddressId]
  );
  const estimatedDelivery = useMemo(() => {
    if (!restaurant?.deliveryTime) return '30-45 min';
    return formatEstimatedDelivery(restaurant.deliveryTime.min, restaurant.deliveryTime.max);
  }, [restaurant?.deliveryTime]);

  // Payment method computed values
  const savedCards = useMemo(() => getSavedCards(), [getSavedCards, paymentMethods]);
  const selectedPayment = useMemo(
    () => getSelectedPaymentMethod(),
    [getSelectedPaymentMethod, selectedPaymentMethodId, paymentMethods]
  );
  const paymentMethodDisplay = useMemo(() => {
    if (selectedPaymentMethodId === 'cash') return 'Cash';
    if (selectedPayment?.type === 'card' && selectedPayment.brand) {
      return `${getCardBrandDisplayName(selectedPayment.brand)} ••••${selectedPayment.last4}`;
    }
    if (savedCards.length > 0) return 'Card';
    return 'Select payment';
  }, [selectedPaymentMethodId, selectedPayment, savedCards.length]);

  // Validation
  const hasPaymentMethod =
    selectedPaymentMethodId === 'cash' || (selectedPaymentMethodId && selectedPayment);
  const canPlaceOrder = selectedAddress !== undefined && items.length > 0 && hasPaymentMethod;

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

  const handleSelectPaymentMethod = useCallback(
    (methodId: string | null) => {
      selectPaymentMethod(methodId);
    },
    [selectPaymentMethod]
  );

  const handleAddNewCard = useCallback(() => {
    // Navigate to add card screen (to be implemented in Task 4.5)
    router.push('/order/add-card' as never);
  }, [router]);

  const handleDeliveryInstructionsChange = useCallback((text: string) => {
    setDeliveryInstructions(text);
  }, []);

  const handleOpenAddAddressModal = useCallback(() => {
    setEditingAddress(null);
    setAddressModalVisible(true);
  }, []);

  const handleOpenEditAddressModal = useCallback(() => {
    if (selectedAddress) {
      setEditingAddress(selectedAddress);
      setAddressModalVisible(true);
    }
  }, [selectedAddress]);

  const handleCloseAddressModal = useCallback(() => {
    setAddressModalVisible(false);
    setEditingAddress(null);
  }, []);

  // Promo code handlers
  const handlePromoCodeChange = useCallback(
    (text: string) => {
      setPromoCodeInput(text.toUpperCase());
      // Clear error when user starts typing
      if (promoValidationError) {
        setPromoValidationError(null);
      }
    },
    [promoValidationError]
  );

  const handleApplyPromoCode = useCallback(async () => {
    if (!promoCodeInput.trim()) return;

    setIsValidatingPromo(true);
    setPromoValidationError(null);

    const result: PromoValidationResult = await validatePromoCodeAsync(
      promoCodeInput.trim(),
      subtotal
    );

    setIsValidatingPromo(false);

    if (result.isValid && result.promoCode) {
      setAppliedPromoCode(result.promoCode);
      setPromoCodeInput('');
      setPromoValidationError(null);
    } else {
      setPromoValidationError(result.error ?? 'Invalid promo code');
    }
  }, [promoCodeInput, subtotal]);

  const handleRemovePromoCode = useCallback(() => {
    setAppliedPromoCode(null);
    setPromoCodeInput('');
    setPromoValidationError(null);
  }, []);

  const handleSaveAddress = useCallback(
    (data: AddressFormData) => {
      if (editingAddress) {
        // Update existing address
        updateAddress(editingAddress.id, {
          label: data.label,
          street: data.street,
          city: data.city,
          zipCode: data.zipCode,
          instructions: data.instructions,
          isDefault: data.isDefault,
        });
        // If we updated the delivery instructions, also update local state
        if (data.instructions) {
          setDeliveryInstructions(data.instructions);
        }
      } else {
        // Add new address
        const newAddress: Address = {
          id: `addr-${Date.now()}`,
          label: data.label,
          street: data.street,
          city: data.city,
          zipCode: data.zipCode,
          instructions: data.instructions,
          isDefault: data.isDefault,
          coordinates: { latitude: 0, longitude: 0 }, // Would be set by geocoding in real app
        };
        addAddress(newAddress);
        // Select the new address
        setSelectedAddressId(newAddress.id);
        if (data.instructions) {
          setDeliveryInstructions(data.instructions);
        }
      }
      setAddressModalVisible(false);
      setEditingAddress(null);
    },
    [editingAddress, updateAddress, addAddress]
  );

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
              <View style={styles.addressSectionContent}>
                {/* Selected Address Display */}
                {selectedAddress ? (
                  <SelectedAddressDisplay
                    address={selectedAddress}
                    onEdit={handleOpenEditAddressModal}
                    colors={colors}
                  />
                ) : (
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
                )}

                {/* Change Address Link - shown when address is selected */}
                {selectedAddress && user.addresses.length > 1 && (
                  <Animated.View
                    entering={FadeInDown.duration(AnimationDurations.normal).delay(50)}
                  >
                    <Pressable
                      onPress={() => {
                        setSelectedAddressId(null);
                      }}
                      style={styles.changeAddressLink}
                      accessibilityLabel="Change delivery address"
                      accessibilityRole="button"
                      testID="change-address-link"
                    >
                      <Text style={[styles.changeAddressText, { color: PrimaryColors[500] }]}>
                        Change address
                      </Text>
                    </Pressable>
                  </Animated.View>
                )}

                {/* Address Selection List - shown when no address is selected */}
                {!selectedAddress && (
                  <Animated.View
                    entering={FadeIn.duration(AnimationDurations.normal)}
                    exiting={FadeOut.duration(AnimationDurations.fast)}
                  >
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
                  </Animated.View>
                )}

                {/* Delivery Instructions Input */}
                <DeliveryInstructionsInput
                  value={deliveryInstructions}
                  onChange={handleDeliveryInstructionsChange}
                  colors={colors}
                />

                {/* Estimated Delivery Time */}
                <EstimatedDeliveryDisplay estimatedTime={estimatedDelivery} colors={colors} />

                {/* Add New Address Button */}
                <Animated.View entering={FadeInDown.duration(AnimationDurations.normal).delay(200)}>
                  <Pressable
                    onPress={handleOpenAddAddressModal}
                    style={[styles.addNewAddressButton, { borderColor: colors.border }]}
                    accessibilityLabel="Add new address"
                    accessibilityRole="button"
                    testID="add-new-address-button"
                  >
                    <Ionicons name="add-circle-outline" size={20} color={PrimaryColors[500]} />
                    <Text style={[styles.addNewAddressText, { color: PrimaryColors[500] }]}>
                      Add New Address
                    </Text>
                  </Pressable>
                </Animated.View>
              </View>
            ) : (
              <View style={styles.noAddressContainer}>
                <Ionicons name="location-outline" size={32} color={colors.textTertiary} />
                <Text style={[styles.noAddressText, { color: colors.textSecondary }]}>
                  No saved addresses
                </Text>
                <Pressable
                  onPress={handleOpenAddAddressModal}
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
              <View style={styles.orderSummaryBadge}>
                <Text style={[styles.sectionSummary, { color: colors.textSecondary }]}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </Text>
                <Text style={[styles.sectionSummaryTotal, { color: PrimaryColors[500] }]}>
                  {formatPrice(total)}
                </Text>
              </View>
            }
          >
            <OrderSummarySection
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              discount={discount}
              colors={colors}
              formatCustomizations={formatCustomizations}
            />
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
                {paymentMethodDisplay}
              </Text>
            }
          >
            <PaymentMethodSectionContent
              savedCards={savedCards}
              selectedPaymentId={selectedPaymentMethodId}
              onSelectPayment={handleSelectPaymentMethod}
              onAddNewCard={handleAddNewCard}
              colors={colors}
            />
          </CollapsibleSection>

          {/* Promo Code Section */}
          <CollapsibleSection
            title="Promo Code"
            icon="pricetag-outline"
            isExpanded={expandedSections.promo}
            onToggle={() => toggleSection('promo')}
            colors={colors}
            delay={400}
            rightContent={
              appliedPromoCode ? (
                <Text style={[styles.promoAppliedBadge, { color: SuccessColors[600] }]}>
                  {appliedPromoCode.code}
                </Text>
              ) : null
            }
          >
            <PromoCodeSection
              promoCode={promoCodeInput}
              onChangePromoCode={handlePromoCodeChange}
              onApply={handleApplyPromoCode}
              onRemove={handleRemovePromoCode}
              isValidating={isValidatingPromo}
              appliedPromo={appliedPromoCode}
              validationError={promoValidationError}
              discount={discount}
              colors={colors}
            />
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

        {/* Address Modal */}
        <AddressModal
          visible={addressModalVisible}
          onClose={handleCloseAddressModal}
          onSave={handleSaveAddress}
          initialData={editingAddress || undefined}
          isEditing={!!editingAddress}
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
    gap: Spacing[3],
  },
  orderSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  sectionSummaryTotal: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  orderSummaryItemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    marginBottom: Spacing[1],
  },
  orderSummaryItemsTitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  orderItemsList: {
    gap: Spacing[3],
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  orderItemImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    marginRight: Spacing[3],
  },
  orderItemDetails: {
    flex: 1,
    marginRight: Spacing[3],
  },
  orderItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[0.5],
  },
  orderItemQuantityBadge: {
    paddingHorizontal: Spacing[1.5] ?? 6,
    paddingVertical: Spacing[0.5],
    borderRadius: BorderRadius.sm,
    minWidth: 28,
    alignItems: 'center',
  },
  orderItemQuantityText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  orderItemName: {
    flex: 1,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  orderItemCustomizationsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[1],
    marginTop: Spacing[0.5],
  },
  orderItemCustomizations: {
    flex: 1,
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  orderItemInstructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    marginTop: Spacing[0.5],
  },
  orderItemInstructions: {
    flex: 1,
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontStyle: 'italic',
  },
  orderItemUnitPrice: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[0.5],
  },
  orderItemPrice: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  summaryDivider: {
    height: 1,
    marginVertical: Spacing[3],
  },
  costBreakdown: {
    gap: Spacing[2],
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costIcon: {
    marginRight: Spacing[2],
  },
  costLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  costLabelHighlighted: {
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  costValue: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  costValueHighlighted: {
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  totalRowContainer: {
    gap: Spacing[2],
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.md,
    gap: Spacing[1],
  },
  savingsText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
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
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
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
  // Promo Code Section Styles
  promoInputContainer: {
    gap: Spacing[2],
  },
  promoInputWrapper: {
    // For animation
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingLeft: Spacing[3],
    paddingRight: Spacing[1],
    minHeight: 52,
  },
  promoInputIcon: {
    marginRight: Spacing[2],
  },
  promoInput: {
    flex: 1,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    paddingVertical: Spacing[3],
  },
  promoApplyButton: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.md,
    marginLeft: Spacing[1],
  },
  promoApplyText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  promoErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[1],
  },
  promoErrorText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  promoHintText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    textAlign: 'center',
    marginTop: Spacing[1],
  },
  promoAppliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: SuccessColors[200],
    backgroundColor: SuccessColors[50],
  },
  promoAppliedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing[3],
  },
  promoAppliedIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoAppliedDetails: {
    flex: 1,
  },
  promoAppliedCode: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  promoAppliedDescription: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginTop: Spacing[0.5],
  },
  promoRemoveButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoAppliedBadge: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
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

  // Address Section Content
  addressSectionContent: {
    gap: Spacing[3],
  },

  // Selected Address Display
  selectedAddressContainer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  selectedAddressMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing[3],
  },
  selectedAddressHeader: {
    flexDirection: 'row',
    flex: 1,
  },
  selectedAddressIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAddressInfo: {
    flex: 1,
    marginLeft: Spacing[3],
  },
  selectedAddressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[0.5],
  },
  selectedAddressLabel: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  selectedAddressStreet: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  selectedAddressCity: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[0.5],
  },
  editAddressButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  instructionsPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing[3],
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    gap: Spacing[2],
  },
  instructionsPreviewText: {
    flex: 1,
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontStyle: 'italic',
  },
  defaultBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: BorderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  changeAddressLink: {
    alignItems: 'center',
    paddingVertical: Spacing[1],
  },
  changeAddressText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },

  // Delivery Instructions Input
  deliveryInstructionsContainer: {
    gap: Spacing[1],
  },
  deliveryInstructionsLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  deliveryInstructionsInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2.5] ?? 10,
    minHeight: 72,
  },
  deliveryInstructionsIcon: {
    marginTop: Spacing[1],
    marginRight: Spacing[2],
  },
  deliveryInstructionsInput: {
    flex: 1,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  deliveryInstructionsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryInstructionsHint: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  deliveryInstructionsCount: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },

  // Estimated Delivery Display
  estimatedDeliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.md,
    gap: Spacing[3],
  },
  estimatedDeliveryIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimatedDeliveryInfo: {
    flex: 1,
  },
  estimatedDeliveryLabel: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  estimatedDeliveryTime: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },

  // Add New Address Button
  addNewAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: Spacing[2],
  },
  addNewAddressText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },

  // Address Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
  },
  modalFooter: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
  },
  modalSaveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.lg,
  },
  modalSaveButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },

  // Address Form Styles
  labelSelectorContainer: {
    marginBottom: Spacing[4],
  },
  labelSelectorTitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    marginBottom: Spacing[2],
  },
  labelOptions: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  labelOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2.5] ?? 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing[1],
  },
  labelOptionText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  inputContainer: {
    marginBottom: Spacing[4],
  },
  inputLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    marginBottom: Spacing[1],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing[3],
    minHeight: 48,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    minHeight: 88,
    paddingVertical: Spacing[3],
  },
  inputIcon: {
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    paddingVertical: Spacing[3],
  },
  inputNoPadding: {
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  inputError: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[1],
  },
  characterCount: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[1],
    textAlign: 'right',
  },
  defaultToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
    marginTop: Spacing[2],
  },
  defaultToggleTextContainer: {
    flex: 1,
    marginRight: Spacing[3],
  },
  defaultToggleLabel: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  defaultToggleDescription: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },

  // Payment Method Section Styles
  cardBrandIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBrandTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBrandText: {
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  },
  mastercardCircles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mastercardCircle: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    marginHorizontal: -2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  cardDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginTop: Spacing[0.5],
  },
  cardNumber: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cardExpiry: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  defaultCardBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: BorderRadius.sm,
  },
  defaultCardBadgeText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  addNewCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: Spacing[2],
    marginTop: Spacing[1],
  },
  addNewCardText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  paymentDivider: {
    height: 1,
    marginVertical: Spacing[3],
  },
  paymentSubsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  paymentSubsectionTitle: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
