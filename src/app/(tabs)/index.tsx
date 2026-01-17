/**
 * Home Screen - Main discovery feed
 *
 * Features:
 * - Delivery address header with selector
 * - Search bar for restaurant/dish search
 * - Horizontal cuisine category scroll with selection
 * - Restaurant discovery sections (to be implemented in Phase 2.5)
 */

import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChip } from '@/components/cards';
import { DeliveryAddressHeader } from '@/components/delivery-address-header';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { mockCategories } from '@/data/mock';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Address, Category } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const CATEGORY_ITEM_GAP = Spacing[2];

// ============================================================================
// Component
// ============================================================================

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-all');

  // Handle address change
  const handleAddressChange = useCallback((_address: Address) => {
    // In a real app, this would update the restaurant list based on location
    // This will be implemented in Phase 2.5 when building restaurant discovery
  }, []);

  // Handle adding new address
  const handleAddNewAddress = useCallback(() => {
    // Navigate to profile screen to add new address
    // In Phase 4, this could open a dedicated address form
    router.push('/(tabs)/profile');
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((query: string) => {
    // Navigate to search screen with query
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
    // In Phase 2.5, this will filter the restaurant list by cuisine
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

      {/* Placeholder content - Will be replaced in Phase 2.5 */}
      <View style={styles.content}>
        <ThemedText type="title">Maestro</ThemedText>
        <ThemedText style={styles.subtitle}>Discover restaurants near you</ThemedText>
        {selectedCategory !== 'cat-all' && (
          <Animated.View entering={FadeIn.duration(200)}>
            <ThemedText style={[styles.filterText, { color: colors.primary }]}>
              Filtering by: {mockCategories.find((c) => c.id === selectedCategory)?.name}
            </ThemedText>
          </Animated.View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[4],
  },
  subtitle: {
    marginTop: Spacing[2],
  },
  filterText: {
    marginTop: Spacing[4],
    fontWeight: '500',
  },
});
