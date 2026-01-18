/**
 * MenuItemCard Component
 *
 * A compact card component for displaying menu item information in search results.
 * Features:
 * - Menu item image (square, right-aligned)
 * - Name and description (truncated)
 * - Price with "from" prefix if customizable
 * - "Popular" or "Spicy" badges
 * - Restaurant name for context in search results
 * - Press animation using react-native-reanimated
 * - Theme support (light/dark mode)
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import {
  BorderRadius,
  Colors,
  ErrorColors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MenuItem } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface MenuItemCardProps {
  /** The menu item data to display */
  item: MenuItem;
  /** Restaurant name for context */
  restaurantName?: string;
  /** Callback when card is pressed */
  onPress?: (item: MenuItem) => void;
  /** Test ID for testing */
  testID?: string;
  /** Whether to show the restaurant name */
  showRestaurantName?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const IMAGE_SIZE = 80;
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
// Component
// ============================================================================

export const MenuItemCard = memo(function MenuItemCard({
  item,
  restaurantName,
  onPress,
  testID,
  showRestaurantName = true,
}: MenuItemCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Animation values
  const scale = useSharedValue(1);

  // Determine if item has customizations that affect price
  const hasCustomizations = item.customizations.length > 0;

  // Handle press in
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_CONFIG);
  }, [scale]);

  // Handle press out
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  // Handle press
  const handlePress = useCallback(() => {
    if (item.isAvailable) {
      onPress?.(item);
    }
  }, [item, onPress]);

  // Animated container style
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Format price
  const priceText = formatMenuItemPrice(item.price, hasCustomizations);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={!item.isAvailable}
      testID={testID}
      accessibilityLabel={`${item.name}, ${priceText}${restaurantName ? `, from ${restaurantName}` : ''}${!item.isAvailable ? ', Currently unavailable' : ''}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !item.isAvailable }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          Shadows.sm,
          animatedContainerStyle,
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
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.description}
          </ThemedText>

          {/* Price and Restaurant Row */}
          <View style={styles.bottomRow}>
            <ThemedText
              style={[
                styles.price,
                { color: item.isAvailable ? colors.text : colors.textTertiary },
              ]}
            >
              {priceText}
            </ThemedText>
            {showRestaurantName && restaurantName && (
              <View style={styles.restaurantContainer}>
                <Ionicons
                  name="restaurant-outline"
                  size={12}
                  color={colors.textTertiary}
                  style={styles.restaurantIcon}
                />
                <ThemedText
                  style={[styles.restaurantName, { color: colors.textTertiary }]}
                  numberOfLines={1}
                >
                  {restaurantName}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Unavailable Overlay Text */}
          {!item.isAvailable && (
            <View style={styles.unavailableContainer}>
              <ThemedText style={[styles.unavailableText, { color: colors.textTertiary }]}>
                Currently unavailable
              </ThemedText>
            </View>
          )}
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
    borderWidth: 1,
    padding: Spacing[3],
    minHeight: 100,
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
    lineHeight: Typography.sm.lineHeight,
    marginTop: Spacing[1],
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  price: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '600',
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: Spacing[2],
    justifyContent: 'flex-end',
  },
  restaurantIcon: {
    marginRight: Spacing[1],
  },
  restaurantName: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    maxWidth: 120,
  },
  unavailableContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  unavailableText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontStyle: 'italic',
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
});
