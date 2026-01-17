/**
 * Search Screen
 *
 * Full search functionality for finding restaurants and menu items.
 * Features:
 * - Large search input at top
 * - Debounced search results as user types
 * - Shows both restaurants and menu items matching query
 * - Empty state: "Search for restaurants or dishes"
 * - No results state: "No results for [query]"
 * - Loading skeletons during search
 * - Animated result items
 */

import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MenuItemCard, RestaurantCard } from '@/components/cards';
import { SearchBar, type SearchBarRef } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { Skeleton } from '@/components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { type MenuItemWithRestaurant, useSearch } from '@/hooks/use-search';
import type { MenuItem, Restaurant } from '@/types';

// ============================================================================
// Types
// ============================================================================

type SearchResultItem =
  | { type: 'section-header'; title: string; count: number }
  | { type: 'restaurant'; data: Restaurant }
  | { type: 'menu-item'; data: MenuItemWithRestaurant };

// ============================================================================
// Constants
// ============================================================================

const SKELETON_COUNT = 4;

// ============================================================================
// Skeleton Components
// ============================================================================

function SearchResultSkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.skeletonContainer}>
      {/* Section header skeleton */}
      <Skeleton width={120} height={20} style={styles.skeletonHeader} />

      {/* Result card skeletons */}
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <View
          key={`skeleton-${index}`}
          style={[
            styles.skeletonCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.skeletonCardContent}>
            <Skeleton width="70%" height={16} style={styles.skeletonLine} />
            <Skeleton width="90%" height={14} style={styles.skeletonLine} />
            <Skeleton width="40%" height={14} />
          </View>
          <Skeleton width={80} height={80} variant="rounded" radius={BorderRadius.md} />
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// Empty State Components
// ============================================================================

interface EmptyStateProps {
  query?: string;
}

function EmptySearchState() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.emptyStateContainer}>
      <View style={[styles.emptyStateIconCircle, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="search" size={48} color={colors.textTertiary} />
      </View>
      <ThemedText style={[styles.emptyStateTitle, { color: colors.text }]}>
        Search for restaurants or dishes
      </ThemedText>
      <ThemedText style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        Find your favorite meals from restaurants near you
      </ThemedText>
    </Animated.View>
  );
}

function NoResultsState({ query }: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.emptyStateContainer}>
      <View style={[styles.emptyStateIconCircle, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="sad-outline" size={48} color={colors.textTertiary} />
      </View>
      <ThemedText style={[styles.emptyStateTitle, { color: colors.text }]}>
        No results for "{query}"
      </ThemedText>
      <ThemedText style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        Try searching for something else or check your spelling
      </ThemedText>
    </Animated.View>
  );
}

// ============================================================================
// Section Header Component
// ============================================================================

interface SectionHeaderProps {
  title: string;
  count: number;
}

function SectionHeader({ title, count }: SectionHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>{title}</ThemedText>
      <ThemedText style={[styles.sectionCount, { color: colors.textSecondary }]}>
        {count} {count === 1 ? 'result' : 'results'}
      </ThemedText>
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const searchBarRef = useRef<SearchBarRef>(null);

  const { query, setQuery, results, isLoading, hasSearched } = useSearch({
    debounceMs: 300,
    minQueryLength: 2,
  });

  // Handle restaurant press
  const handleRestaurantPress = useCallback((restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  }, []);

  // Handle menu item press
  const handleMenuItemPress = useCallback((item: MenuItem) => {
    // Navigate to restaurant with the menu item highlighted
    router.push(`/restaurant/${item.restaurantId}`);
  }, []);

  // Build flat list data from results
  const listData: SearchResultItem[] = [];

  if (hasSearched && !isLoading) {
    // Add restaurants section
    if (results.restaurants.length > 0) {
      listData.push({
        type: 'section-header',
        title: 'Restaurants',
        count: results.restaurants.length,
      });
      results.restaurants.forEach((restaurant) => {
        listData.push({ type: 'restaurant', data: restaurant });
      });
    }

    // Add menu items section
    if (results.menuItems.length > 0) {
      listData.push({
        type: 'section-header',
        title: 'Dishes',
        count: results.menuItems.length,
      });
      results.menuItems.forEach((item) => {
        listData.push({ type: 'menu-item', data: item });
      });
    }
  }

  const hasResults = results.restaurants.length > 0 || results.menuItems.length > 0;
  const showNoResults = hasSearched && !isLoading && !hasResults && query.trim().length >= 2;
  const showEmptyState = !hasSearched && !isLoading && query.trim().length < 2;

  // Render list item
  const renderItem = useCallback(
    ({ item, index }: { item: SearchResultItem; index: number }) => {
      const animationDelay = Math.min(index * 50, 300);

      switch (item.type) {
        case 'section-header':
          return (
            <Animated.View entering={FadeInDown.delay(animationDelay).duration(200)}>
              <SectionHeader title={item.title} count={item.count} />
            </Animated.View>
          );

        case 'restaurant':
          return (
            <Animated.View
              entering={FadeInUp.delay(animationDelay).duration(200)}
              style={styles.resultItem}
            >
              <RestaurantCard
                restaurant={item.data}
                onPress={handleRestaurantPress}
                testID={`search-result-restaurant-${item.data.id}`}
              />
            </Animated.View>
          );

        case 'menu-item':
          return (
            <Animated.View
              entering={FadeInUp.delay(animationDelay).duration(200)}
              style={styles.resultItem}
            >
              <MenuItemCard
                item={item.data}
                restaurantName={item.data.restaurantName}
                onPress={handleMenuItemPress}
                testID={`search-result-menu-item-${item.data.id}`}
              />
            </Animated.View>
          );
      }
    },
    [handleRestaurantPress, handleMenuItemPress]
  );

  // Get item type for FlashList
  const getItemType = useCallback((item: SearchResultItem) => item.type, []);

  // Estimate item size for FlashList
  const estimatedItemSize = 120;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Input */}
      <View style={[styles.searchContainer, { paddingTop: insets.top + Spacing[2] }]}>
        <SearchBar
          ref={searchBarRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search restaurants or dishes..."
          navigateOnFocus={false}
          showRecentSearches={query.trim().length === 0}
          containerStyle={styles.searchBar}
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Loading State */}
        {isLoading && <SearchResultSkeleton />}

        {/* Empty State */}
        {showEmptyState && <EmptySearchState />}

        {/* No Results State */}
        {showNoResults && <NoResultsState query={query.trim()} />}

        {/* Results List */}
        {hasSearched && !isLoading && hasResults && (
          <FlashList
            data={listData}
            renderItem={renderItem}
            getItemType={getItemType}
            estimatedItemSize={estimatedItemSize}
            keyExtractor={(item, index) => {
              if (item.type === 'section-header') {
                return `section-${item.title}`;
              }
              return `${item.type}-${item.data.id}-${index}`;
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  searchContainer: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
  searchBar: {
    zIndex: 100,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    marginTop: Spacing[2],
  },
  sectionTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
  },
  sectionCount: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  resultItem: {
    marginBottom: Spacing[3],
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[8],
    paddingBottom: Spacing[20],
  },
  emptyStateIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  emptyStateTitle: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  emptyStateSubtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
  },
  skeletonContainer: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
  },
  skeletonHeader: {
    marginBottom: Spacing[4],
  },
  skeletonCard: {
    flexDirection: 'row',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing[3],
  },
  skeletonCardContent: {
    flex: 1,
    marginRight: Spacing[3],
    justifyContent: 'space-between',
  },
  skeletonLine: {
    marginBottom: Spacing[2],
  },
});
