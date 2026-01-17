/**
 * SwipeableCartItem Component
 *
 * A swipeable cart item that reveals a delete button when swiped left.
 * Uses react-native-gesture-handler and react-native-reanimated for
 * smooth gesture animations.
 *
 * Features:
 * - Swipe left to reveal delete button
 * - Animated removal on delete
 * - Quantity controls
 * - Special instructions display
 * - Customizations display
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, type TextStyle, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  ErrorColors,
  FontWeights,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { CartItem } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const DELETE_BUTTON_WIDTH = 80;
const SWIPE_THRESHOLD = DELETE_BUTTON_WIDTH / 2;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats price with currency symbol
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Formats customizations for display
 */
export function formatCustomizations(item: CartItem): string {
  if (item.selectedCustomizations.length === 0) return '';

  return item.selectedCustomizations
    .map((c) => c.selectedOptions.map((o) => o.optionName).join(', '))
    .join(' • ');
}

// ============================================================================
// Sub-Components
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface QuantityControlsProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

/**
 * QuantityControls - Inline quantity controls for cart items
 */
function QuantityControls({ quantity, onIncrement, onDecrement }: QuantityControlsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const decrementScale = useSharedValue(1);
  const incrementScale = useSharedValue(1);

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

  const decrementStyle = useAnimatedStyle(() => ({
    transform: [{ scale: decrementScale.value }],
  }));

  const incrementStyle = useAnimatedStyle(() => ({
    transform: [{ scale: incrementScale.value }],
  }));

  const isTrash = quantity === 1;

  return (
    <View style={styles.quantityControls}>
      <AnimatedPressable
        onPress={onDecrement}
        onPressIn={handleDecrementPressIn}
        onPressOut={handleDecrementPressOut}
        style={[
          styles.quantityButton,
          { backgroundColor: colors.backgroundSecondary },
          decrementStyle,
        ]}
        accessibilityLabel={isTrash ? 'Remove item' : 'Decrease quantity'}
        accessibilityRole="button"
        testID="cart-item-decrement"
      >
        <Ionicons
          name={isTrash ? 'trash-outline' : 'remove'}
          size={18}
          color={isTrash ? ErrorColors[500] : colors.text}
        />
      </AnimatedPressable>

      <View style={styles.quantityDisplay}>
        <Text style={[styles.quantityText, { color: colors.text }]}>{quantity}</Text>
      </View>

      <AnimatedPressable
        onPress={onIncrement}
        onPressIn={handleIncrementPressIn}
        onPressOut={handleIncrementPressOut}
        style={[
          styles.quantityButton,
          { backgroundColor: colors.backgroundSecondary },
          incrementStyle,
        ]}
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
        testID="cart-item-increment"
      >
        <Ionicons name="add" size={18} color={colors.text} />
      </AnimatedPressable>
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export interface SwipeableCartItemProps {
  item: CartItem;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  onPress?: (item: CartItem) => void;
  testID?: string;
}

export function SwipeableCartItem({
  item,
  onQuantityChange,
  onRemove,
  onPress,
  testID,
}: SwipeableCartItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Animation values
  const translateX = useSharedValue(0);
  const isOpen = useRef(false);

  // Reset swipe position
  const resetPosition = useCallback(() => {
    translateX.value = withSpring(0, SPRING_CONFIG);
    isOpen.current = false;
  }, [translateX]);

  // Handle delete with confirmation
  const handleDelete = useCallback(() => {
    Alert.alert('Remove Item', `Remove ${item.menuItem.name} from your cart?`, [
      { text: 'Cancel', style: 'cancel', onPress: resetPosition },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          onRemove(item.id);
        },
      },
    ]);
  }, [item, onRemove, resetPosition]);

  // Pan gesture for swipe
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onUpdate((event) => {
      // Only allow left swipe (negative translationX)
      const newTranslateX = Math.min(0, Math.max(-DELETE_BUTTON_WIDTH, event.translationX));
      translateX.value = newTranslateX;
    })
    .onEnd((event) => {
      // If swiped more than threshold, snap open
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-DELETE_BUTTON_WIDTH, SPRING_CONFIG);
        isOpen.current = true;
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
        isOpen.current = false;
      }
    });

  // Tap gesture for closing when open or pressing item
  const tapGesture = Gesture.Tap().onEnd(() => {
    if (isOpen.current) {
      runOnJS(resetPosition)();
    } else if (onPress) {
      runOnJS(onPress)(item);
    }
  });

  // Combine gestures - pan takes priority
  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.abs(translateX.value) / DELETE_BUTTON_WIDTH),
  }));

  // Handlers
  const handleIncrement = useCallback(() => {
    onQuantityChange(item.id, item.quantity + 1);
    resetPosition();
  }, [item.id, item.quantity, onQuantityChange, resetPosition]);

  const handleDecrement = useCallback(() => {
    if (item.quantity === 1) {
      handleDelete();
    } else {
      onQuantityChange(item.id, item.quantity - 1);
      resetPosition();
    }
  }, [item.id, item.quantity, onQuantityChange, handleDelete, resetPosition]);

  const customizationsText = formatCustomizations(item);

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal)}
      exiting={FadeOut.duration(AnimationDurations.fast)}
      layout={Layout.springify().damping(20).stiffness(200)}
      style={styles.container}
      testID={testID}
    >
      {/* Delete Button (behind the card) */}
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          { backgroundColor: ErrorColors[500] },
          deleteButtonStyle,
        ]}
      >
        <Pressable
          onPress={handleDelete}
          style={styles.deleteButton}
          accessibilityLabel="Delete item"
          accessibilityRole="button"
          testID="cart-item-delete"
        >
          <Ionicons name="trash" size={24} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      {/* Swipeable Card */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            styles.cardContainer,
            { backgroundColor: colors.card, ...Shadows.sm },
            containerStyle,
          ]}
        >
          {/* Item Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.menuItem.image || 'https://picsum.photos/seed/food/100/100' }}
              style={styles.itemImage}
              contentFit="cover"
              transition={200}
            />
          </View>

          {/* Item Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.headerRow}>
              <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                {item.menuItem.name}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.text }]}>
                {formatPrice(item.totalPrice)}
              </Text>
            </View>

            {/* Customizations */}
            {customizationsText.length > 0 && (
              <Text
                style={[styles.customizations, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {customizationsText}
              </Text>
            )}

            {/* Special Instructions */}
            {item.specialInstructions && (
              <View style={styles.instructionsRow}>
                <Ionicons name="chatbubble-outline" size={12} color={colors.textTertiary} />
                <Text
                  style={[styles.instructions, { color: colors.textTertiary }]}
                  numberOfLines={1}
                >
                  {item.specialInstructions}
                </Text>
              </View>
            )}

            {/* Quantity Controls */}
            <View style={styles.bottomRow}>
              <QuantityControls
                quantity={item.quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
              <Text style={[styles.unitPrice, { color: colors.textSecondary }]}>
                {formatPrice(item.totalPrice / item.quantity)} each
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

// ============================================================================
// Exports
// ============================================================================

export { QuantityControls, DELETE_BUTTON_WIDTH, SWIPE_THRESHOLD };

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: Spacing[3],
  },
  deleteButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: DELETE_BUTTON_WIDTH,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  imageContainer: {
    marginRight: Spacing[3],
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[1],
  },
  itemName: {
    flex: 1,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginRight: Spacing[2],
  },
  itemPrice: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  customizations: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginBottom: Spacing[1],
  },
  instructionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    marginBottom: Spacing[2],
  },
  instructions: {
    flex: 1,
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontStyle: 'italic',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    minWidth: 24,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  unitPrice: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
});
