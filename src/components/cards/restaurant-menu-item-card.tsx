/**
 * RestaurantMenuItemCard Component
 *
 * A card component for displaying menu items on the restaurant detail page.
 * Features:
 * - Menu item image (square, right-aligned)
 * - Name and description (truncated)
 * - Price with "from" prefix if customizable
 * - "Popular" or "Spicy" badges
 * - Add button that transforms to quantity selector
 * - Press animation using react-native-reanimated
 * - Theme support (light/dark mode)
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  ErrorColors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MenuItem, Restaurant } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface RestaurantMenuItemCardProps {
  /** The menu item data to display */
  item: MenuItem;
  /** The restaurant this item belongs to */
  restaurant?: Restaurant;
  /** Current quantity in cart (0 if not in cart) */
  quantity?: number;
  /** Callback when item is pressed (to open customization modal) */
  onPress?: (item: MenuItem) => void;
  /** Callback when add button is pressed (for items without customizations) */
  onAdd?: (item: MenuItem) => void;
  /** Callback when quantity is increased */
  onIncrement?: (item: MenuItem) => void;
  /** Callback when quantity is decreased */
  onDecrement?: (item: MenuItem) => void;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

const IMAGE_SIZE = 80;
const ADD_BUTTON_SIZE = 36;
const QUANTITY_CONTROL_WIDTH = 100;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats the price, adding "from" prefix if item has customizations
 */
export function formatMenuItemPrice(price: number, hasCustomizations: boolean): string {
  const formattedPrice = `$${price.toFixed(2)}`;
  return hasCustomizations ? `from ${formattedPrice}` : formattedPrice;
}

// ============================================================================
// Sub-Components
// ============================================================================

interface AddButtonProps {
  onPress: () => void;
  disabled: boolean;
  testID?: string;
}

/**
 * AddButton - The initial add button shown when item is not in cart
 */
function AddButton({ onPress, disabled, testID }: AddButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel="Add to cart"
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          styles.addButton,
          {
            backgroundColor: disabled ? colors.backgroundSecondary : PrimaryColors[500],
          },
          animatedStyle,
        ]}
      >
        <Ionicons name="add" size={24} color={disabled ? colors.textTertiary : '#FFFFFF'} />
      </Animated.View>
    </Pressable>
  );
}

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled: boolean;
  testID?: string;
}

/**
 * QuantitySelector - Shows when item is in cart, allows +/- quantity
 */
function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  disabled,
  testID,
}: QuantitySelectorProps) {
  const decrementScale = useSharedValue(1);
  const incrementScale = useSharedValue(1);
  const quantityScale = useSharedValue(1);

  // Bounce animation when quantity changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: quantity triggers the animation effect
  useEffect(() => {
    quantityScale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 400 }),
      withSpring(1, SPRING_CONFIG)
    );
  }, [quantity, quantityScale]);

  const handleDecrementPressIn = useCallback(() => {
    decrementScale.value = withSpring(0.85, SPRING_CONFIG);
  }, [decrementScale]);

  const handleDecrementPressOut = useCallback(() => {
    decrementScale.value = withSpring(1, SPRING_CONFIG);
  }, [decrementScale]);

  const handleIncrementPressIn = useCallback(() => {
    incrementScale.value = withSpring(0.85, SPRING_CONFIG);
  }, [incrementScale]);

  const handleIncrementPressOut = useCallback(() => {
    incrementScale.value = withSpring(1, SPRING_CONFIG);
  }, [incrementScale]);

  const decrementAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: decrementScale.value }],
  }));

  const incrementAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: incrementScale.value }],
  }));

  const quantityAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: quantityScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.fast)}
      style={[styles.quantitySelector, { backgroundColor: PrimaryColors[500] }]}
      testID={testID}
    >
      {/* Decrement Button */}
      <Pressable
        onPressIn={handleDecrementPressIn}
        onPressOut={handleDecrementPressOut}
        onPress={onDecrement}
        disabled={disabled}
        testID={testID ? `${testID}-decrement` : undefined}
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button"
        style={styles.quantityButton}
      >
        <Animated.View style={decrementAnimatedStyle}>
          <Ionicons name={quantity === 1 ? 'trash-outline' : 'remove'} size={20} color="#FFFFFF" />
        </Animated.View>
      </Pressable>

      {/* Quantity Display */}
      <Animated.View style={[styles.quantityDisplay, quantityAnimatedStyle]}>
        <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
      </Animated.View>

      {/* Increment Button */}
      <Pressable
        onPressIn={handleIncrementPressIn}
        onPressOut={handleIncrementPressOut}
        onPress={onIncrement}
        disabled={disabled}
        testID={testID ? `${testID}-increment` : undefined}
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
        style={styles.quantityButton}
      >
        <Animated.View style={incrementAnimatedStyle}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export const RestaurantMenuItemCard = memo(function RestaurantMenuItemCard({
  item,
  restaurant: _restaurant,
  quantity = 0,
  onPress,
  onAdd,
  onIncrement,
  onDecrement,
  testID,
}: RestaurantMenuItemCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Animation values
  const cardScale = useSharedValue(1);

  // Determine if item has customizations that require modal
  const hasCustomizations = item.customizations.length > 0;

  // Check if item is in cart
  const isInCart = quantity > 0;

  // Handle card press
  const handleCardPress = useCallback(() => {
    if (item.isAvailable) {
      onPress?.(item);
    }
  }, [item, onPress]);

  // Handle add button press
  const handleAddPress = useCallback(() => {
    if (!item.isAvailable) return;

    if (hasCustomizations) {
      // If item has customizations, open the customization modal
      onPress?.(item);
    } else {
      // Otherwise, directly add to cart
      onAdd?.(item);
    }
  }, [item, hasCustomizations, onPress, onAdd]);

  // Handle increment
  const handleIncrement = useCallback(() => {
    if (!item.isAvailable) return;

    if (hasCustomizations) {
      // For items with customizations, open modal to add another
      onPress?.(item);
    } else {
      onIncrement?.(item);
    }
  }, [item, hasCustomizations, onPress, onIncrement]);

  // Handle decrement
  const handleDecrement = useCallback(() => {
    onDecrement?.(item);
  }, [item, onDecrement]);

  // Card press in animation
  const handlePressIn = useCallback(() => {
    cardScale.value = withSpring(0.98, SPRING_CONFIG);
  }, [cardScale]);

  // Card press out animation
  const handlePressOut = useCallback(() => {
    cardScale.value = withSpring(1, SPRING_CONFIG);
  }, [cardScale]);

  // Animated card style
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  // Format price
  const priceText = useMemo(
    () => formatMenuItemPrice(item.price, hasCustomizations),
    [item.price, hasCustomizations]
  );

  // Accessibility label
  const accessibilityLabel = useMemo(() => {
    const parts = [item.name, priceText];
    if (item.isPopular) parts.push('Popular item');
    if (item.isSpicy) parts.push('Spicy');
    if (!item.isAvailable) parts.push('Currently unavailable');
    if (isInCart) parts.push(`${quantity} in cart`);
    return parts.join(', ');
  }, [item, priceText, isInCart, quantity]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleCardPress}
      disabled={!item.isAvailable}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: !item.isAvailable }}
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
          animatedCardStyle,
        ]}
      >
        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Badges Row */}
          <View style={styles.badgesRow}>
            {item.isPopular && (
              <View style={[styles.badge, { backgroundColor: PrimaryColors[100] }]}>
                <Ionicons name="star" size={10} color={PrimaryColors[600]} />
                <ThemedText style={[styles.badgeText, { color: PrimaryColors[600] }]}>
                  Popular
                </ThemedText>
              </View>
            )}
            {item.isSpicy && (
              <View style={[styles.badge, { backgroundColor: ErrorColors[100] }]}>
                <Ionicons name="flame" size={10} color={ErrorColors[600]} />
                <ThemedText style={[styles.badgeText, { color: ErrorColors[600] }]}>
                  Spicy
                </ThemedText>
              </View>
            )}
          </View>

          {/* Name */}
          <ThemedText
            style={[styles.name, { color: item.isAvailable ? colors.text : colors.textTertiary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </ThemedText>

          {/* Description */}
          <ThemedText
            style={[
              styles.description,
              { color: item.isAvailable ? colors.textSecondary : colors.textTertiary },
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.description}
          </ThemedText>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <ThemedText
              style={[
                styles.price,
                { color: item.isAvailable ? colors.text : colors.textTertiary },
              ]}
            >
              {priceText}
            </ThemedText>

            {/* Add Button / Quantity Selector */}
            <View style={styles.addControlContainer}>
              {!item.isAvailable ? (
                <ThemedText style={[styles.unavailableText, { color: colors.textTertiary }]}>
                  Unavailable
                </ThemedText>
              ) : isInCart ? (
                <QuantitySelector
                  quantity={quantity}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  disabled={!item.isAvailable}
                  testID={testID ? `${testID}-quantity` : undefined}
                />
              ) : (
                <AddButton
                  onPress={handleAddPress}
                  disabled={!item.isAvailable}
                  testID={testID ? `${testID}-add` : undefined}
                />
              )}
            </View>
          </View>
        </View>

        {/* Image Section */}
        {item.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image }}
              style={[styles.image, !item.isAvailable && styles.imageUnavailable]}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}

        {/* Unavailable Overlay */}
        {!item.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <View style={[styles.unavailableBadge, { backgroundColor: colors.background }]}>
              <ThemedText style={[styles.unavailableBadgeText, { color: colors.textSecondary }]}>
                Currently unavailable
              </ThemedText>
            </View>
          </View>
        )}
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
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    minHeight: 120,
  },
  contentContainer: {
    flex: 1,
    marginRight: Spacing[3],
    justifyContent: 'space-between',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    marginBottom: Spacing[1],
    minHeight: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: '600',
    marginLeft: Spacing[1],
  },
  name: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
  },
  description: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight * 1.4,
    marginTop: Spacing[1],
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  price: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
  },
  addControlContainer: {
    minWidth: QUANTITY_CONTROL_WIDTH,
    alignItems: 'flex-end',
  },
  addButton: {
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    height: ADD_BUTTON_SIZE,
    paddingHorizontal: Spacing[1],
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
    color: '#FFFFFF',
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
  imageUnavailable: {
    opacity: 0.5,
  },
  unavailableText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontStyle: 'italic',
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  unavailableBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.md,
  },
  unavailableBadgeText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '500',
  },
});
