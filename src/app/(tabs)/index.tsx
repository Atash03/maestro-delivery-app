/**
 * Home Screen - Main discovery feed
 *
 * Features:
 * - Delivery address header with selector
 * - Search bar for restaurant/dish search
 * - Horizontal cuisine category scroll with selection
 * - Featured Restaurants carousel with larger cards
 * - Popular Near You section
 * - Quick Bites section (fast delivery)
 * - New on Maestro section
 * - Pull-to-refresh with custom animation
 * - Skeleton loading states on initial load
 * - Uses @shopify/flash-list for performance
 */

import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChip } from '@/components/cards';
import { CustomRefreshControl } from '@/components/custom-refresh-control';
import { DeliveryAddressHeader } from '@/components/delivery-address-header';
import { RestaurantSection } from '@/components/restaurant-section';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { mockCategories } from '@/data/mock';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHomeData } from '@/hooks/use-home-data';
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
  const {
    featuredRestaurants,
    popularRestaurants,
    quickBitesRestaurants,
    newRestaurants,
    isLoading,
    isRefreshing,
    refresh,
    filterByCategory,
  } = useHomeData({
    selectedCategory: selectedCategoryName,
  });

  // Update filter when category changes
  useEffect(() => {
    filterByCategory(selectedCategoryName);
  }, [selectedCategoryName, filterByCategory]);

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

      {/* Search Bar */}
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.searchContainer}>
        <SearchBar
          placeholder="Search restaurants or dishes"
          onSubmit={handleSearchSubmit}
          navigateOnFocus
          onFocus={handleSearchFocus}
          testID="home-search-bar"
        />
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
        {/* Selected Category Filter Indicator */}
        {selectedCategory !== 'cat-all' && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.filterIndicator}>
            <ThemedText style={[styles.filterText, { color: colors.primary }]}>
              Showing: {mockCategories.find((c) => c.id === selectedCategory)?.name}
            </ThemedText>
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
        {!isLoading && !hasAnyRestaurants && selectedCategory !== 'cat-all' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.emptyState}>
            <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
              No restaurants found
            </ThemedText>
            <ThemedText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try selecting a different category or check back later
            </ThemedText>
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
  filterText: {
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
    paddingHorizontal: Spacing[4],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing[2],
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: Spacing[8],
  },
});
