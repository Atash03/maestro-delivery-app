/**
 * RestaurantSection Component
 *
 * A reusable section component for displaying a list of restaurants
 * with a title, optional "See All" button, and horizontal scrolling.
 *
 * Features:
 * - Section header with title and optional see all button
 * - Horizontal FlatList for restaurant cards
 * - Skeleton loading state with shimmer animation
 * - Empty state handling
 * - Staggered animations for restaurant cards
 */

import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';

import { RestaurantCard } from '@/components/cards';
import { ThemedText } from '@/components/themed-text';
import { Skeleton } from '@/components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Restaurant } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface RestaurantSectionProps {
  /** Section title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** List of restaurants to display */
  restaurants: Restaurant[];
  /** Callback when a restaurant is pressed */
  onRestaurantPress?: (restaurant: Restaurant) => void;
  /** Callback when "See All" is pressed */
  onSeeAllPress?: () => void;
  /** Whether the section is in loading state */
  isLoading?: boolean;
  /** Whether to show the "See All" button */
  showSeeAll?: boolean;
  /** Card variant for restaurant cards */
  cardVariant?: 'default' | 'featured';
  /** Optional promotional badges for restaurants (by restaurant ID) */
  promotionalBadges?: Record<string, string>;
  /** Test ID for testing */
  testID?: string;
  /** Animation delay offset for staggered animations */
  animationDelay?: number;
}

// ============================================================================
// Constants
// ============================================================================

const CARD_WIDTH = 280;
const FEATURED_CARD_WIDTH = 320;
const CARD_GAP = Spacing[3];
const SKELETON_COUNT = 3;

// ============================================================================
// Skeleton Component
// ============================================================================

interface RestaurantCardSkeletonProps {
  variant?: 'default' | 'featured';
}

function RestaurantCardSkeleton({ variant = 'default' }: RestaurantCardSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardWidth = variant === 'featured' ? FEATURED_CARD_WIDTH : CARD_WIDTH;
  const cardHeight = variant === 'featured' ? 240 : 200;
  const imageHeight = cardHeight * 0.6;

  return (
    <View
      style={[
        styles.skeletonCard,
        {
          width: cardWidth,
          height: cardHeight,
          backgroundColor: colors.card,
        },
      ]}
    >
      {/* Image skeleton */}
      <Skeleton width="100%" height={imageHeight} variant="rectangular" />

      {/* Content skeleton */}
      <View style={styles.skeletonContent}>
        {/* Title row */}
        <View style={styles.skeletonTitleRow}>
          <Skeleton width="70%" height={18} variant="text" />
          <Skeleton width={50} height={16} variant="text" />
        </View>

        {/* Cuisine row */}
        <Skeleton width="50%" height={14} variant="text" style={styles.skeletonCuisine} />

        {/* Delivery row */}
        <View style={styles.skeletonDeliveryRow}>
          <Skeleton width={80} height={12} variant="text" />
          <Skeleton width={80} height={12} variant="text" />
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// Component
// ============================================================================

export function RestaurantSection({
  title,
  subtitle,
  restaurants,
  onRestaurantPress,
  onSeeAllPress,
  isLoading = false,
  showSeeAll = true,
  cardVariant = 'default',
  promotionalBadges,
  testID,
  animationDelay = 0,
}: RestaurantSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardWidth = cardVariant === 'featured' ? FEATURED_CARD_WIDTH : CARD_WIDTH;

  // Render restaurant card
  const renderRestaurantCard = useCallback(
    ({ item, index }: { item: Restaurant; index: number }) => (
      <Animated.View
        entering={FadeInRight.delay(animationDelay + index * 50).duration(300)}
        style={[styles.cardContainer, { width: cardWidth }]}
      >
        <RestaurantCard
          restaurant={item}
          onPress={onRestaurantPress}
          variant={cardVariant}
          promotionalBadge={promotionalBadges?.[item.id]}
          testID={`${testID}-card-${item.id}`}
        />
      </Animated.View>
    ),
    [cardWidth, cardVariant, promotionalBadges, onRestaurantPress, testID, animationDelay]
  );

  // Render skeleton card
  const renderSkeletonCard = useCallback(
    ({ index }: { index: number }) => (
      <Animated.View
        entering={FadeIn.delay(index * 100).duration(300)}
        style={[styles.cardContainer, { width: cardWidth }]}
      >
        <RestaurantCardSkeleton variant={cardVariant} />
      </Animated.View>
    ),
    [cardWidth, cardVariant]
  );

  // Key extractor
  const keyExtractor = useCallback((item: Restaurant) => item.id, []);
  const skeletonKeyExtractor = useCallback((_: unknown, index: number) => `skeleton-${index}`, []);

  // Item separator
  const ItemSeparator = useCallback(() => <View style={styles.separator} />, []);

  // Empty state
  if (!isLoading && restaurants.length === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.delay(animationDelay).duration(300)}
      style={styles.container}
      testID={testID}
    >
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.headerTitles}>
          <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>

        {showSeeAll && onSeeAllPress && !isLoading && restaurants.length > 0 && (
          <Pressable
            onPress={onSeeAllPress}
            style={styles.seeAllButton}
            accessibilityLabel={`See all ${title}`}
            accessibilityRole="button"
          >
            <ThemedText style={[styles.seeAllText, { color: colors.primary }]}>See All</ThemedText>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {/* Restaurant List */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <FlashList
            data={Array.from({ length: SKELETON_COUNT })}
            renderItem={renderSkeletonCard}
            keyExtractor={skeletonKeyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={ItemSeparator}
            estimatedItemSize={cardWidth}
            testID={`${testID}-skeleton-list`}
          />
        ) : (
          <FlashList
            data={restaurants}
            renderItem={renderRestaurantCard}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={ItemSeparator}
            estimatedItemSize={cardWidth}
            testID={`${testID}-list`}
          />
        )}
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing[6],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginTop: Spacing[0.5],
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[1],
  },
  seeAllText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '600',
  },
  listContainer: {
    minHeight: 200,
  },
  listContent: {
    paddingHorizontal: Spacing[4],
  },
  cardContainer: {
    // Width is set dynamically
  },
  separator: {
    width: CARD_GAP,
  },
  skeletonCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  skeletonContent: {
    flex: 1,
    padding: Spacing[3],
    justifyContent: 'space-between',
  },
  skeletonTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonCuisine: {
    marginTop: Spacing[1],
  },
  skeletonDeliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing[2],
  },
});
