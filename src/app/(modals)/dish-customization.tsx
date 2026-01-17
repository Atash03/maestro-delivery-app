/**
 * Dish Customization Modal
 *
 * Modal for customizing a menu item before adding to cart.
 * Features:
 * - Large dish image at top with gradient overlay
 * - Full description with calories and allergens
 * - Required choices (radio buttons for single selection)
 * - Optional add-ons (checkboxes for multiple selection)
 * - Quantity selector with animated buttons
 * - Special instructions text input
 * - Running total with "Add to Cart" button
 * - Animated section expansions
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge, Button } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  ErrorColors,
  FontWeights,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { getMenuItemById } from '@/data/mock/menu-items';
import { getRestaurantById } from '@/data/mock/restaurants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCartStore } from '@/stores';
import type { Customization, SelectedCustomization, SelectedOption } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const IMAGE_HEIGHT = 240;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats a price with currency symbol
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculates the total price based on base price, customizations, and quantity
 */
export function calculateTotalPrice(
  basePrice: number,
  selectedCustomizations: Map<string, Set<string>>,
  customizations: Customization[],
  quantity: number
): number {
  let total = basePrice;

  // Add customization prices
  for (const [customizationId, selectedOptionIds] of selectedCustomizations) {
    const customization = customizations.find((c) => c.id === customizationId);
    if (customization) {
      for (const optionId of selectedOptionIds) {
        const option = customization.options.find((o) => o.id === optionId);
        if (option) {
          total += option.price;
        }
      }
    }
  }

  return total * quantity;
}

/**
 * Gets the default selections for customizations
 */
export function getDefaultSelections(customizations: Customization[]): Map<string, Set<string>> {
  const selections = new Map<string, Set<string>>();

  for (const customization of customizations) {
    const defaultOptions = customization.options.filter((o) => o.isDefault);
    if (defaultOptions.length > 0) {
      selections.set(customization.id, new Set(defaultOptions.map((o) => o.id)));
    } else if (customization.required && customization.options.length > 0) {
      // If required but no default, select first option
      selections.set(customization.id, new Set([customization.options[0].id]));
    } else {
      selections.set(customization.id, new Set());
    }
  }

  return selections;
}

/**
 * Validates that all required customizations have selections
 */
export function validateSelections(
  customizations: Customization[],
  selections: Map<string, Set<string>>
): { isValid: boolean; missingCustomizations: string[] } {
  const missing: string[] = [];

  for (const customization of customizations) {
    if (customization.required) {
      const selected = selections.get(customization.id);
      if (!selected || selected.size === 0) {
        missing.push(customization.name);
      }
    }
  }

  return {
    isValid: missing.length === 0,
    missingCustomizations: missing,
  };
}

/**
 * Converts selections map to SelectedCustomization array for cart
 */
export function selectionsToCartFormat(
  selections: Map<string, Set<string>>,
  customizations: Customization[]
): SelectedCustomization[] {
  const result: SelectedCustomization[] = [];

  for (const [customizationId, selectedOptionIds] of selections) {
    if (selectedOptionIds.size === 0) continue;

    const customization = customizations.find((c) => c.id === customizationId);
    if (!customization) continue;

    const selectedOptions: SelectedOption[] = [];
    for (const optionId of selectedOptionIds) {
      const option = customization.options.find((o) => o.id === optionId);
      if (option) {
        selectedOptions.push({
          optionId: option.id,
          optionName: option.name,
          price: option.price,
        });
      }
    }

    if (selectedOptions.length > 0) {
      result.push({
        customizationId: customization.id,
        customizationName: customization.name,
        selectedOptions,
      });
    }
  }

  return result;
}

// ============================================================================
// Sub-Components
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CustomizationOptionProps {
  option: { id: string; name: string; price: number; isDefault?: boolean };
  isSelected: boolean;
  isRadio: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

/**
 * CustomizationOption - Radio button or checkbox for option selection
 */
function CustomizationOption({
  option,
  isSelected,
  isRadio,
  onPress,
  disabled = false,
  testID,
}: CustomizationOptionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(0.97, SPRING_CONFIG);
    }
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconName = isRadio
    ? isSelected
      ? 'radio-button-on'
      : 'radio-button-off'
    : isSelected
      ? 'checkbox'
      : 'square-outline';

  const iconColor = isSelected ? PrimaryColors[500] : colors.icon;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.optionRow,
        {
          backgroundColor: isSelected ? PrimaryColors[50] : 'transparent',
          borderColor: isSelected ? PrimaryColors[500] : colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
      ]}
      accessibilityRole={isRadio ? 'radio' : 'checkbox'}
      accessibilityState={{ selected: isSelected, disabled }}
      accessibilityLabel={`${option.name}${option.price > 0 ? `, add ${formatPrice(option.price)}` : ''}`}
      testID={testID}
    >
      <View style={styles.optionLeft}>
        <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={24} color={iconColor} />
        <Text style={[styles.optionName, { color: colors.text }]}>{option.name}</Text>
      </View>
      {option.price > 0 && (
        <Text style={[styles.optionPrice, { color: colors.textSecondary }]}>
          +{formatPrice(option.price)}
        </Text>
      )}
    </AnimatedPressable>
  );
}

interface CustomizationSectionProps {
  customization: Customization;
  selectedOptions: Set<string>;
  onOptionToggle: (customizationId: string, optionId: string) => void;
  delay?: number;
}

/**
 * CustomizationSection - Section for a single customization group
 */
function CustomizationSection({
  customization,
  selectedOptions,
  onOptionToggle,
  delay = 0,
}: CustomizationSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const isRadio = customization.maxSelections === 1;
  const hasSelection = selectedOptions.size > 0;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(300)}
      style={styles.customizationSection}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{customization.name}</Text>
          {customization.required && (
            <Badge variant="primary" size="sm">
              Required
            </Badge>
          )}
        </View>
        {!isRadio && customization.maxSelections > 1 && (
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select up to {customization.maxSelections}
          </Text>
        )}
        {customization.required && !hasSelection && (
          <Text style={[styles.requiredHint, { color: ErrorColors[500] }]}>
            Please make a selection
          </Text>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {customization.options.map((option) => {
          const isSelected = selectedOptions.has(option.id);
          const isDisabled =
            !isRadio && !isSelected && selectedOptions.size >= customization.maxSelections;

          return (
            <CustomizationOption
              key={option.id}
              option={option}
              isSelected={isSelected}
              isRadio={isRadio}
              onPress={() => onOptionToggle(customization.id, option.id)}
              disabled={isDisabled}
              testID={`option-${customization.id}-${option.id}`}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

/**
 * QuantitySelector - Quantity control with increment/decrement buttons
 */
function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  minQuantity = 1,
  maxQuantity = 99,
}: QuantitySelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const decrementScale = useSharedValue(1);
  const incrementScale = useSharedValue(1);
  const quantityScale = useSharedValue(1);

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

  // Animate quantity text when it changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: quantity triggers animation
  useEffect(() => {
    quantityScale.value = withSpring(1.2, SPRING_CONFIG);
    setTimeout(() => {
      quantityScale.value = withSpring(1, SPRING_CONFIG);
    }, 100);
  }, [quantity, quantityScale]);

  const decrementAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: decrementScale.value }],
  }));

  const incrementAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: incrementScale.value }],
  }));

  const quantityAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: quantityScale.value }],
  }));

  const canDecrement = quantity > minQuantity;
  const canIncrement = quantity < maxQuantity;

  return (
    <View style={styles.quantityContainer}>
      <AnimatedPressable
        onPress={onDecrement}
        onPressIn={handleDecrementPressIn}
        onPressOut={handleDecrementPressOut}
        disabled={!canDecrement}
        style={[
          styles.quantityButton,
          {
            backgroundColor: canDecrement ? colors.backgroundSecondary : colors.backgroundTertiary,
            opacity: canDecrement ? 1 : 0.5,
          },
          decrementAnimatedStyle,
        ]}
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button"
        testID="quantity-decrement"
      >
        <Ionicons
          name="remove"
          size={24}
          color={canDecrement ? colors.text : colors.textTertiary}
        />
      </AnimatedPressable>

      <Animated.View style={[styles.quantityDisplay, quantityAnimatedStyle]}>
        <Text style={[styles.quantityText, { color: colors.text }]}>{quantity}</Text>
      </Animated.View>

      <AnimatedPressable
        onPress={onIncrement}
        onPressIn={handleIncrementPressIn}
        onPressOut={handleIncrementPressOut}
        disabled={!canIncrement}
        style={[
          styles.quantityButton,
          {
            backgroundColor: canIncrement ? colors.backgroundSecondary : colors.backgroundTertiary,
            opacity: canIncrement ? 1 : 0.5,
          },
          incrementAnimatedStyle,
        ]}
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
        testID="quantity-increment"
      >
        <Ionicons name="add" size={24} color={canIncrement ? colors.text : colors.textTertiary} />
      </AnimatedPressable>
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Converts SelectedCustomization array from cart to Map format for editing
 */
export function cartSelectionsToMap(
  selectedCustomizations: SelectedCustomization[]
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();

  for (const customization of selectedCustomizations) {
    const optionIds = new Set(customization.selectedOptions.map((o) => o.optionId));
    map.set(customization.customizationId, optionIds);
  }

  return map;
}

export default function DishCustomizationScreen() {
  const { itemId, cartItemId, editMode } = useLocalSearchParams<{
    itemId: string;
    cartItemId?: string;
    editMode?: string;
  }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const isEditMode = editMode === 'true' && !!cartItemId;

  // Cart store
  const addItem = useCartStore((state) => state.addItem);
  const updateItem = useCartStore((state) => state.updateItem);
  const items = useCartStore((state) => state.items);
  const canAddFromRestaurant = useCartStore((state) => state.canAddFromRestaurant);
  const clearCart = useCartStore((state) => state.clearCart);

  // Get cart item if editing
  const existingCartItem = useMemo(
    () => (isEditMode ? items.find((item) => item.id === cartItemId) : undefined),
    [isEditMode, items, cartItemId]
  );

  // Get menu item and restaurant
  const menuItem = useMemo(() => getMenuItemById(itemId), [itemId]);
  const restaurant = useMemo(
    () => (menuItem ? getRestaurantById(menuItem.restaurantId) : undefined),
    [menuItem]
  );

  // State - initialize from existing cart item if editing
  const [quantity, setQuantity] = useState(existingCartItem?.quantity ?? 1);
  const [specialInstructions, setSpecialInstructions] = useState(
    existingCartItem?.specialInstructions ?? ''
  );
  const [selections, setSelections] = useState<Map<string, Set<string>>>(new Map());

  // Initialize selections when menu item loads or when editing
  useEffect(() => {
    if (menuItem?.customizations) {
      if (existingCartItem) {
        // When editing, use existing cart item selections
        const existingSelections = cartSelectionsToMap(existingCartItem.selectedCustomizations);
        // Fill in any missing customizations with defaults
        const fullSelections = getDefaultSelections(menuItem.customizations);
        for (const [key, value] of existingSelections) {
          fullSelections.set(key, value);
        }
        setSelections(fullSelections);
      } else {
        setSelections(getDefaultSelections(menuItem.customizations));
      }
    }
  }, [menuItem, existingCartItem]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!menuItem) return 0;
    return calculateTotalPrice(menuItem.price, selections, menuItem.customizations, quantity);
  }, [menuItem, selections, quantity]);

  // Validation
  const validation = useMemo(() => {
    if (!menuItem) return { isValid: false, missingCustomizations: [] };
    return validateSelections(menuItem.customizations, selections);
  }, [menuItem, selections]);

  // Handlers
  const handleClose = useCallback(() => {
    router.back();
  }, []);

  const handleOptionToggle = useCallback(
    (customizationId: string, optionId: string) => {
      if (!menuItem) return;

      const customization = menuItem.customizations.find((c) => c.id === customizationId);
      if (!customization) return;

      setSelections((prev) => {
        const newSelections = new Map(prev);
        const currentSelected = new Set(prev.get(customizationId) || []);

        if (customization.maxSelections === 1) {
          // Radio button behavior: replace selection
          newSelections.set(customizationId, new Set([optionId]));
        } else {
          // Checkbox behavior: toggle selection
          if (currentSelected.has(optionId)) {
            currentSelected.delete(optionId);
          } else if (currentSelected.size < customization.maxSelections) {
            currentSelected.add(optionId);
          }
          newSelections.set(customizationId, currentSelected);
        }

        return newSelections;
      });
    },
    [menuItem]
  );

  const handleQuantityIncrement = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  }, []);

  const handleQuantityDecrement = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }, []);

  const addItemToCart = useCallback(() => {
    if (!menuItem || !restaurant) return;

    const selectedCustomizations = selectionsToCartFormat(selections, menuItem.customizations);

    if (isEditMode && cartItemId) {
      // Update existing cart item
      updateItem(cartItemId, {
        quantity,
        selectedCustomizations,
        specialInstructions: specialInstructions.trim() || undefined,
      });
    } else {
      // Add new item
      addItem(
        menuItem,
        quantity,
        selectedCustomizations,
        specialInstructions.trim() || undefined,
        restaurant
      );
    }

    router.back();
  }, [
    menuItem,
    restaurant,
    selections,
    quantity,
    specialInstructions,
    addItem,
    updateItem,
    isEditMode,
    cartItemId,
  ]);

  const handleAddToCart = useCallback(() => {
    if (!menuItem || !restaurant) return;

    // Validate selections
    if (!validation.isValid) {
      Alert.alert(
        'Missing Selections',
        `Please select options for: ${validation.missingCustomizations.join(', ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Skip restaurant validation when editing existing item
    if (!isEditMode && !canAddFromRestaurant(restaurant.id)) {
      Alert.alert(
        'Clear Cart?',
        'You have items from another restaurant in your cart. Would you like to clear it and add this item?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear & Add',
            style: 'destructive',
            onPress: () => {
              clearCart();
              addItemToCart();
            },
          },
        ]
      );
      return;
    }

    addItemToCart();
  }, [
    menuItem,
    restaurant,
    validation,
    canAddFromRestaurant,
    clearCart,
    addItemToCart,
    isEditMode,
  ]);

  // Loading/error states
  if (!menuItem || !restaurant) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Item not found</Text>
          <Button variant="ghost" onPress={handleClose}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Close Button */}
      <Animated.View
        entering={FadeIn.delay(100).duration(AnimationDurations.normal)}
        style={[styles.closeButtonContainer, { top: insets.top + Spacing[2] }]}
      >
        <Pressable
          onPress={handleClose}
          style={[styles.closeButton, { backgroundColor: colors.card }]}
          accessibilityLabel="Close"
          accessibilityRole="button"
          testID="close-button"
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: menuItem.image || 'https://picsum.photos/seed/food/400/300' }}
              style={styles.heroImage}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.imageGradient}
            />

            {/* Badges */}
            <View style={styles.badgesContainer}>
              {menuItem.isPopular && (
                <View style={[styles.badge, { backgroundColor: PrimaryColors[500] }]}>
                  <Ionicons name="star" size={12} color="#FFFFFF" />
                  <Text style={styles.badgeText}>Popular</Text>
                </View>
              )}
              {menuItem.isSpicy && (
                <View style={[styles.badge, { backgroundColor: ErrorColors[500] }]}>
                  <Ionicons name="flame" size={12} color="#FFFFFF" />
                  <Text style={styles.badgeText}>Spicy</Text>
                </View>
              )}
            </View>
          </View>

          {/* Content */}
          <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
            {/* Name and Price */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(AnimationDurations.normal)}
              style={styles.headerSection}
            >
              <Text style={[styles.itemName, { color: colors.text }]}>{menuItem.name}</Text>
              <Text style={[styles.basePrice, { color: colors.textSecondary }]}>
                from {formatPrice(menuItem.price)}
              </Text>
            </Animated.View>

            {/* Description */}
            <Animated.View
              entering={FadeInUp.delay(150).duration(AnimationDurations.normal)}
              style={styles.descriptionSection}
            >
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {menuItem.description}
              </Text>

              {/* Nutrition & Allergens */}
              <View style={styles.infoRow}>
                {menuItem.calories && (
                  <View style={styles.infoItem}>
                    <Ionicons name="flame-outline" size={16} color={colors.icon} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                      {menuItem.calories} cal
                    </Text>
                  </View>
                )}
                {menuItem.allergens && menuItem.allergens.length > 0 && (
                  <View style={styles.infoItem}>
                    <Ionicons name="warning-outline" size={16} color={WarningColors[500]} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                      Contains: {menuItem.allergens.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Customization Sections */}
            {menuItem.customizations.map((customization, index) => (
              <CustomizationSection
                key={customization.id}
                customization={customization}
                selectedOptions={selections.get(customization.id) || new Set()}
                onOptionToggle={handleOptionToggle}
                delay={200 + index * 50}
              />
            ))}

            {/* Divider */}
            {menuItem.customizations.length > 0 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}

            {/* Special Instructions */}
            <Animated.View
              entering={FadeInUp.delay(200 + menuItem.customizations.length * 50).duration(300)}
              style={styles.instructionsSection}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Special Instructions
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Any specific preferences or allergies?
              </Text>
              <TextInput
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                placeholder="e.g., No onions, extra sauce on the side..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                maxLength={200}
                style={[
                  styles.instructionsInput,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                accessibilityLabel="Special instructions"
                testID="special-instructions-input"
              />
              <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                {specialInstructions.length}/200
              </Text>
            </Animated.View>

            {/* Quantity Selector */}
            <Animated.View
              entering={FadeInUp.delay(250 + menuItem.customizations.length * 50).duration(300)}
              style={styles.quantitySection}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quantity</Text>
              <QuantitySelector
                quantity={quantity}
                onIncrement={handleQuantityIncrement}
                onDecrement={handleQuantityDecrement}
              />
            </Animated.View>
          </View>
        </ScrollView>

        {/* Add to Cart Button */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(300)}
          style={[
            styles.addToCartContainer,
            {
              paddingBottom: insets.bottom + Spacing[4],
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
            Shadows.md as ViewStyle,
          ]}
        >
          <Button
            onPress={handleAddToCart}
            fullWidth
            disabled={!validation.isValid}
            testID="add-to-cart-button"
          >
            {isEditMode ? 'Update Item' : 'Add to Cart'} - {formatPrice(totalPrice)}
          </Button>
          {!validation.isValid && (
            <Text style={[styles.validationWarning, { color: ErrorColors[500] }]}>
              Please complete all required selections
            </Text>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  CustomizationOption,
  CustomizationSection,
  QuantitySelector,
  IMAGE_HEIGHT,
  SPRING_CONFIG,
  cartSelectionsToMap,
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[4],
  },
  loadingText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    right: Spacing[4],
    zIndex: 100,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  badgesContainer: {
    position: 'absolute',
    bottom: Spacing[3],
    left: Spacing[4],
    flexDirection: 'row',
    gap: Spacing[2],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    color: '#FFFFFF',
  },
  contentContainer: {
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    marginTop: -Spacing[6],
    paddingTop: Spacing[5],
    paddingHorizontal: Spacing[4],
  },
  headerSection: {
    marginBottom: Spacing[3],
  },
  itemName: {
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    marginBottom: Spacing[1],
  },
  basePrice: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
  },
  descriptionSection: {
    marginBottom: Spacing[4],
  },
  description: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight * 1.4,
    marginBottom: Spacing[3],
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[4],
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  infoText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  divider: {
    height: 1,
    marginVertical: Spacing[4],
  },
  customizationSection: {
    marginBottom: Spacing[5],
  },
  sectionHeader: {
    marginBottom: Spacing[3],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[1],
  },
  sectionTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  sectionSubtitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  requiredHint: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginTop: Spacing[1],
  },
  optionsContainer: {
    gap: Spacing[2],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    flex: 1,
  },
  optionName: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
  },
  optionPrice: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  instructionsSection: {
    marginBottom: Spacing[5],
  },
  instructionsInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: Spacing[2],
  },
  charCount: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    textAlign: 'right',
    marginTop: Spacing[1],
  },
  quantitySection: {
    marginBottom: Spacing[5],
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[4],
    marginTop: Spacing[3],
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    minWidth: 60,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  addToCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
  },
  validationWarning: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    textAlign: 'center',
    marginTop: Spacing[2],
  },
});
