/**
 * RestaurantCard Component
 *
 * A card component for displaying restaurant information in lists and grids.
 * Features:
 * - Restaurant image with gradient overlay
 * - Name, cuisine type, rating with star icon
 * - Delivery time and fee display
 * - Promotional badge support
 * - "Closed" overlay when restaurant is not available
 * - Press animation using react-native-reanimated
 * - Theme support (light/dark mode)
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import {
  BorderRadius,
  Colors,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Restaurant } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface RestaurantCardProps {
  /** The restaurant data to display */
  restaurant: Restaurant;
  /** Callback when card is pressed */
  onPress?: (restaurant: Restaurant) => void;
  /** Optional promotional text to display as a badge */
  promotionalBadge?: string;
  /** Test ID for testing */
  testID?: string;
  /** Card size variant */
  variant?: 'default' | 'featured';
}

// ============================================================================
// Constants
// ============================================================================

const CARD_HEIGHT = 200;
const FEATURED_CARD_HEIGHT = 240;
const IMAGE_HEIGHT_RATIO = 0.6;
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats the price level as dollar signs
 */
export function formatPriceLevel(priceLevel: number): string {
  return '$'.repeat(Math.min(Math.max(priceLevel, 1), 4));
}

/**
 * Formats the delivery time range
 */
export function formatDeliveryTime(min: number, max: number): string {
  return `${min}-${max} min`;
}

/**
 * Formats the delivery fee
 */
export function formatDeliveryFee(fee: number): string {
  if (fee === 0) {
    return 'Free delivery';
  }
  return `$${fee.toFixed(2)} delivery`;
}

// ============================================================================
// Component
// ============================================================================

export function RestaurantCard({
  restaurant,
  onPress,
  promotionalBadge,
  testID,
  variant = 'default',
}: RestaurantCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Animation values
  const scale = useSharedValue(1);

  // Calculate card dimensions based on variant
  const cardHeight = variant === 'featured' ? FEATURED_CARD_HEIGHT : CARD_HEIGHT;
  const imageHeight = cardHeight * IMAGE_HEIGHT_RATIO;

  // Handle press in
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING_CONFIG);
  }, [scale]);

  // Handle press out
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  // Handle press
  const handlePress = useCallback(() => {
    onPress?.(restaurant);
  }, [restaurant, onPress]);

  // Animated container style
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Format display values
  const deliveryTimeText = formatDeliveryTime(
    restaurant.deliveryTime.min,
    restaurant.deliveryTime.max
  );
  const deliveryFeeText = formatDeliveryFee(restaurant.deliveryFee);
  const priceLevelText = formatPriceLevel(restaurant.priceLevel);
  const cuisineText = restaurant.cuisine.slice(0, 2).join(' • ');

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={!restaurant.isOpen}
      testID={testID}
      accessibilityLabel={`${restaurant.name}, ${cuisineText}, ${restaurant.rating} stars, ${deliveryTimeText}${!restaurant.isOpen ? ', Currently closed' : ''}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !restaurant.isOpen }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            height: cardHeight,
          },
          Shadows.md,
          animatedContainerStyle,
        ]}
      >
        {/* Image Section */}
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageGradient}
          />

          {/* Promotional Badge */}
          {promotionalBadge && restaurant.isOpen && (
            <View style={styles.promoBadge}>
              <Ionicons name="pricetag" size={10} color="#FFFFFF" style={styles.promoBadgeIcon} />
              <ThemedText style={styles.promoBadgeText}>{promotionalBadge}</ThemedText>
            </View>
          )}

          {/* Closed Overlay */}
          {!restaurant.isOpen && (
            <View style={styles.closedOverlay}>
              <View style={styles.closedBadge}>
                <ThemedText style={styles.closedText}>Currently Closed</ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          {/* Header Row: Name and Rating */}
          <View style={styles.headerRow}>
            <ThemedText
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {restaurant.name}
            </ThemedText>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={WarningColors[500]} />
              <ThemedText style={[styles.rating, { color: colors.text }]}>
                {restaurant.rating.toFixed(1)}
              </ThemedText>
              <ThemedText style={[styles.reviewCount, { color: colors.textSecondary }]}>
                ({restaurant.reviewCount})
              </ThemedText>
            </View>
          </View>

          {/* Cuisine and Price Row */}
          <View style={styles.cuisineRow}>
            <ThemedText style={[styles.cuisine, { color: colors.textSecondary }]} numberOfLines={1}>
              {cuisineText}
            </ThemedText>
            <ThemedText style={[styles.priceLevel, { color: colors.textSecondary }]}>
              {priceLevelText}
            </ThemedText>
          </View>

          {/* Delivery Info Row */}
          <View style={styles.deliveryRow}>
            <View style={styles.deliveryItem}>
              <Ionicons name="time-outline" size={14} color={colors.icon} />
              <ThemedText style={[styles.deliveryText, { color: colors.textSecondary }]}>
                {deliveryTimeText}
              </ThemedText>
            </View>
            <View style={styles.deliveryDot}>
              <ThemedText style={[styles.dot, { color: colors.textTertiary }]}>•</ThemedText>
            </View>
            <View style={styles.deliveryItem}>
              <Ionicons name="bicycle-outline" size={14} color={colors.icon} />
              <ThemedText style={[styles.deliveryText, { color: colors.textSecondary }]}>
                {deliveryFeeText}
              </ThemedText>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  promoBadge: {
    position: 'absolute',
    top: Spacing[2],
    left: Spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PrimaryColors[500],
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.sm,
  },
  promoBadgeIcon: {
    marginRight: Spacing[1],
  },
  promoBadgeText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedBadge: {
    backgroundColor: NeutralColors[800],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.md,
  },
  closedText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
    padding: Spacing[3],
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
    marginRight: Spacing[2],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '600',
    marginLeft: Spacing[1],
  },
  reviewCount: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginLeft: Spacing[0.5],
  },
  cuisineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing[0.5],
  },
  cuisine: {
    flex: 1,
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  priceLevel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '500',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[1],
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginLeft: Spacing[1],
  },
  deliveryDot: {
    marginHorizontal: Spacing[2],
  },
  dot: {
    fontSize: Typography.xs.fontSize,
  },
});
