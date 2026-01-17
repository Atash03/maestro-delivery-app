/**
 * Home Screen - Main discovery feed
 *
 * Features:
 * - Delivery address header with selector
 * - Search bar for restaurant/dish search
 * - Horizontal cuisine category scroll with selection
 * - Filter button with active filter count badge
 * - Featured Restaurants carousel with larger cards
 * - Popular Near You section
 * - Quick Bites section (fast delivery)
 * - New on Maestro section
 * - Pull-to-refresh with custom animation
 * - Skeleton loading states on initial load
 * - Uses @shopify/flash-list for performance
 * - Filters persist across sessions via filter store
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChip } from '@/components/cards';
import { CustomRefreshControl } from '@/components/custom-refresh-control';
import { DeliveryAddressHeader } from '@/components/delivery-address-header';
import { RestaurantSection } from '@/components/restaurant-section';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import {
  BorderRadius,
  Colors,
  FontWeights,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { mockCategories } from '@/data/mock';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFilteredRestaurants } from '@/hooks/use-filtered-restaurants';
import { useHomeData } from '@/hooks/use-home-data';
import { useFilterStore } from '@/stores';
import type { Address, Category, Restaurant } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const CATEGORY_ITEM_GAP = Spacing[2];

// Promotional badges for featured restaurants
const PROMOTIONAL_BADGES: Record<string, string> = {
  'rest-002': '20% Off',
  'rest-005': 'Free Delivery',
  'rest-013': 'New Menu!',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================================================
// Filter Button Component
// ============================================================================

interface FilterButtonProps {
  activeCount: number;
  onPress: () => void;
  testID?: string;
}

function FilterButton({ activeCount, onPress, testID }: FilterButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200, mass: 0.5 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200, mass: 0.5 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.filterButton,
        {
          backgroundColor: activeCount > 0 ? PrimaryColors[500] : colors.backgroundSecondary,
          borderColor: activeCount > 0 ? PrimaryColors[500] : colors.border,
        },
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Filters${activeCount > 0 ? `, ${activeCount} active` : ''}`}
      accessibilityHint="Opens filter options"
      testID={testID}
    >
      <Ionicons
        name="options-outline"
        size={18}
        color={activeCount > 0 ? '#FFFFFF' : colors.text}
      />
      {activeCount > 0 && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>{activeCount}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

// ============================================================================
// Component
// ============================================================================

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-all');

  // Get selected category name for filtering
  const selectedCategoryName =
    selectedCategory === 'cat-all'
      ? null
      : (mockCategories.find((c) => c.id === selectedCategory)?.name ?? null);

  // Home data hook
  const { allRestaurants, isLoading, isRefreshing, refresh, filterByCategory } = useHomeData({
    selectedCategory: selectedCategoryName,
  });

  // Get active filter count from store
  const activeFilterCount = useFilterStore((state) => state.getActiveFilterCount());
  const clearFilters = useFilterStore((state) => state.clearFilters);

  // Apply filters to all restaurants
  const { filteredRestaurants, hasActiveFilters } = useFilteredRestaurants({
    restaurants: allRestaurants,
    categoryFilter: selectedCategoryName,
  });

  // Categorize filtered restaurants for sections
  const featuredRestaurants = filteredRestaurants.filter((r) => r.rating >= 4.6).slice(0, 10);
  const popularRestaurants = filteredRestaurants.filter((r) => r.reviewCount >= 300).slice(0, 10);
  const quickBitesRestaurants = filteredRestaurants
    .filter((r) => r.deliveryTime.max <= 30)
    .slice(0, 10);
  const newRestaurants = filteredRestaurants.filter((r) => r.reviewCount < 300).slice(0, 10);

  // Update filter when category changes
  useEffect(() => {
    filterByCategory(selectedCategoryName);
  }, [selectedCategoryName, filterByCategory]);

  // Handle filter button press
  const handleFilterPress = useCallback(() => {
    router.push('/(modals)/filters');
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  // Handle address change
  const handleAddressChange = useCallback((_address: Address) => {
    // In a real app, this would update the restaurant list based on location
  }, []);

  // Handle adding new address
  const handleAddNewAddress = useCallback(() => {
    router.push('/(tabs)/profile');
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((query: string) => {
    router.push({
      pathname: '/(tabs)/search',
      params: { query },
    });
  }, []);

  // Handle search focus - navigate to search screen
  const handleSearchFocus = useCallback(() => {
    router.push('/(tabs)/search');
  }, []);

  // Handle category selection
  const handleCategoryPress = useCallback((category: Category) => {
    setSelectedCategory(category.id);
  }, []);

  // Handle restaurant press
  const handleRestaurantPress = useCallback((restaurant: Restaurant) => {
    router.push({
      pathname: '/restaurant/[id]',
      params: { id: restaurant.id },
    });
  }, []);

  // Handle see all press for different sections
  const handleSeeAllFeatured = useCallback(() => {
    router.push({
      pathname: '/(tabs)/search',
      params: { filter: 'featured' },
    });
  }, []);

  const handleSeeAllPopular = useCallback(() => {
    router.push({
      pathname: '/(tabs)/search',
      params: { filter: 'popular' },
    });
  }, []);

  const handleSeeAllQuickBites = useCallback(() => {
    router.push({
      pathname: '/(tabs)/search',
      params: { filter: 'quick' },
    });
  }, []);

  const handleSeeAllNew = useCallback(() => {
    router.push({
      pathname: '/(tabs)/search',
      params: { filter: 'new' },
    });
  }, []);

  // Render category chip
  const renderCategoryItem = useCallback(
    ({ item, index }: { item: Category; index: number }) => (
      <Animated.View
        entering={FadeInRight.delay(index * 50).duration(300)}
        style={styles.categoryItemContainer}
      >
        <CategoryChip
          category={item}
          isSelected={selectedCategory === item.id}
          onPress={handleCategoryPress}
          testID={`category-chip-${item.id}`}
        />
      </Animated.View>
    ),
    [selectedCategory, handleCategoryPress]
  );

  // Key extractor for category list
  const categoryKeyExtractor = useCallback((item: Category) => item.id, []);

  // Check if any section has data for showing empty state
  const hasAnyRestaurants =
    featuredRestaurants.length > 0 ||
    popularRestaurants.length > 0 ||
    quickBitesRestaurants.length > 0 ||
    newRestaurants.length > 0;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
    >
      {/* Delivery Address Header */}
      <DeliveryAddressHeader
        onAddressChange={handleAddressChange}
        onAddNewAddress={handleAddNewAddress}
      />

      {/* Search Bar with Filter Button */}
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              placeholder="Search restaurants or dishes"
              onSubmit={handleSearchSubmit}
              navigateOnFocus
              onFocus={handleSearchFocus}
              testID="home-search-bar"
            />
          </View>
          <FilterButton
            activeCount={activeFilterCount}
            onPress={handleFilterPress}
            testID="home-filter-button"
          />
        </View>
      </Animated.View>

      {/* Category Scroll */}
      <Animated.View entering={FadeIn.delay(200).duration(300)} style={styles.categorySection}>
        <FlatList
          data={mockCategories}
          renderItem={renderCategoryItem}
          keyExtractor={categoryKeyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          ItemSeparatorComponent={() => <View style={{ width: CATEGORY_ITEM_GAP }} />}
          testID="category-list"
        />
      </Animated.View>

      {/* Main Content - Scrollable Restaurant Sections */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <CustomRefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            testID="home-refresh-control"
          />
        }
        testID="home-scroll-view"
      >
        {/* Active Filters Indicator */}
        {(selectedCategory !== 'cat-all' || hasActiveFilters) && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.filterIndicator}>
            <View style={styles.filterIndicatorRow}>
              <ThemedText style={[styles.filterText, { color: colors.primary }]}>
                {selectedCategory !== 'cat-all' && hasActiveFilters
                  ? `${mockCategories.find((c) => c.id === selectedCategory)?.name} • ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''}`
                  : selectedCategory !== 'cat-all'
                    ? `Showing: ${mockCategories.find((c) => c.id === selectedCategory)?.name}`
                    : `${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} active`}
              </ThemedText>
              {hasActiveFilters && (
                <Pressable
                  onPress={handleClearFilters}
                  style={styles.clearFiltersButton}
                  accessibilityLabel="Clear all filters"
                  accessibilityRole="button"
                  testID="clear-filters-button"
                >
                  <Text style={[styles.clearFiltersText, { color: colors.primary }]}>
                    Clear filters
                  </Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        )}

        {/* Featured Restaurants Carousel */}
        <RestaurantSection
          title="Featured Restaurants"
          subtitle="Handpicked by our team"
          restaurants={featuredRestaurants}
          onRestaurantPress={handleRestaurantPress}
          onSeeAllPress={handleSeeAllFeatured}
          isLoading={isLoading}
          cardVariant="featured"
          promotionalBadges={PROMOTIONAL_BADGES}
          testID="featured-section"
          animationDelay={300}
        />

        {/* Popular Near You */}
        <RestaurantSection
          title="Popular Near You"
          subtitle="Based on orders in your area"
          restaurants={popularRestaurants}
          onRestaurantPress={handleRestaurantPress}
          onSeeAllPress={handleSeeAllPopular}
          isLoading={isLoading}
          testID="popular-section"
          animationDelay={400}
        />

        {/* Quick Bites */}
        <RestaurantSection
          title="Quick Bites"
          subtitle="Delivered in 30 min or less"
          restaurants={quickBitesRestaurants}
          onRestaurantPress={handleRestaurantPress}
          onSeeAllPress={handleSeeAllQuickBites}
          isLoading={isLoading}
          testID="quick-bites-section"
          animationDelay={500}
        />

        {/* New on Maestro */}
        <RestaurantSection
          title="New on Maestro"
          subtitle="Recently added restaurants"
          restaurants={newRestaurants}
          onRestaurantPress={handleRestaurantPress}
          onSeeAllPress={handleSeeAllNew}
          isLoading={isLoading}
          testID="new-section"
          animationDelay={600}
        />

        {/* Empty State when filtering returns no results */}
        {!isLoading &&
          !hasAnyRestaurants &&
          (selectedCategory !== 'cat-all' || hasActiveFilters) && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.emptyState}>
              <Ionicons
                name="restaurant-outline"
                size={48}
                color={colors.textTertiary}
                style={styles.emptyIcon}
              />
              <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                No restaurants found
              </ThemedText>
              <ThemedText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {hasActiveFilters
                  ? 'Try adjusting your filters or selecting a different category'
                  : 'Try selecting a different category or check back later'}
              </ThemedText>
              {hasActiveFilters && (
                <Pressable
                  onPress={handleClearFilters}
                  style={[styles.emptyStateClearButton, { borderColor: colors.primary }]}
                  accessibilityLabel="Clear all filters"
                  accessibilityRole="button"
                  testID="empty-state-clear-filters"
                >
                  <Text style={[styles.emptyStateClearText, { color: colors.primary }]}>
                    Clear all filters
                  </Text>
                </Pressable>
              )}
            </Animated.View>
          )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingTop: Spacing[2],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  searchBarWrapper: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Shadows.sm,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    ...Shadows.sm,
  },
  filterBadgeText: {
    fontSize: Typography.xs.fontSize,
    fontWeight: FontWeights.bold,
    color: PrimaryColors[500],
  },
  categorySection: {
    marginTop: Spacing[3],
  },
  categoryList: {
    paddingHorizontal: Spacing[4],
  },
  categoryItemContainer: {
    // Container for animation - no additional styles needed
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing[4],
  },
  filterIndicator: {
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  filterIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterText: {
    fontWeight: FontWeights.semibold,
    fontSize: Typography.sm.fontSize,
  },
  clearFiltersButton: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
  },
  clearFiltersText: {
    fontSize: Typography.sm.fontSize,
    fontWeight: FontWeights.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
    paddingHorizontal: Spacing[4],
  },
  emptyIcon: {
    marginBottom: Spacing[4],
  },
  emptyTitle: {
    fontSize: Typography.lg.fontSize,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing[2],
  },
  emptySubtitle: {
    fontSize: Typography.sm.fontSize,
    textAlign: 'center',
    marginBottom: Spacing[4],
  },
  emptyStateClearButton: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing[2],
  },
  emptyStateClearText: {
    fontSize: Typography.base.fontSize,
    fontWeight: FontWeights.medium,
  },
  bottomSpacer: {
    height: Spacing[8],
  },
});
