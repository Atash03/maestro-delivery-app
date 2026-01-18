/**
 * Filters Modal Screen
 *
 * Comprehensive filter modal for restaurant discovery with animated filter chips.
 * Filter sections:
 * - Sort by: Recommended, Fastest Delivery, Rating, Distance
 * - Price Range: $, $$, $$$, $$$$
 * - Rating: 4.5+, 4.0+, 3.5+
 * - Delivery Time: Under 30 min, Under 45 min, Under 60 min
 * - Dietary: Vegetarian, Vegan, Gluten-Free, Halal, Kosher
 *
 * Features:
 * - "Apply Filters" button with count badge
 * - "Clear All" option
 * - Animated filter chip selection
 * - Spring-based press animations
 * - Persists filters to store on apply
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DEFAULT_FILTER_STATE, type FilterState, useFilterStore } from '@/stores';
import { useShallow } from 'zustand/react/shallow';
import type { DietaryOption, PriceLevel, SortOption as SortOptionType } from '@/types';

// Re-export FilterState for backwards compatibility
export type { FilterState };
export { DEFAULT_FILTER_STATE };

// ============================================================================
// Constants
// ============================================================================

const SORT_OPTIONS: { id: SortOptionType; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'fastest_delivery', label: 'Fastest Delivery' },
  { id: 'rating', label: 'Rating' },
  { id: 'distance', label: 'Distance' },
];

const PRICE_LEVELS: { id: PriceLevel; label: string }[] = [
  { id: 1, label: '$' },
  { id: 2, label: '$$' },
  { id: 3, label: '$$$' },
  { id: 4, label: '$$$$' },
];

const RATING_OPTIONS: { id: number; label: string }[] = [
  { id: 4.5, label: '4.5+' },
  { id: 4.0, label: '4.0+' },
  { id: 3.5, label: '3.5+' },
];

const DELIVERY_TIME_OPTIONS: { id: number; label: string }[] = [
  { id: 30, label: 'Under 30 min' },
  { id: 45, label: 'Under 45 min' },
  { id: 60, label: 'Under 60 min' },
];

const DIETARY_OPTIONS: { id: DietaryOption; label: string; icon: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian', icon: 'leaf' },
  { id: 'vegan', label: 'Vegan', icon: 'leaf' },
  { id: 'gluten_free', label: 'Gluten-Free', icon: 'ban' },
  { id: 'halal', label: 'Halal', icon: 'checkmark-circle' },
  { id: 'kosher', label: 'Kosher', icon: 'checkmark-circle' },
];

// ============================================================================
// Filter Chip Component
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
  testID?: string;
}

function FilterChip({ label, selected, onPress, icon, testID }: FilterChipProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200, mass: 0.5 });
    opacity.value = withTiming(0.9, { duration: AnimationDurations.instant });
  }, [scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200, mass: 0.5 });
    opacity.value = withTiming(1, { duration: AnimationDurations.instant });
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const chipStyle: ViewStyle = {
    backgroundColor: selected ? PrimaryColors[500] : colors.backgroundSecondary,
    borderColor: selected ? PrimaryColors[500] : colors.border,
    borderWidth: 1,
  };

  const textStyle: TextStyle = {
    color: selected ? '#FFFFFF' : colors.text,
  };

  const iconColor = selected ? '#FFFFFF' : colors.icon;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.chip, chipStyle, animatedStyle]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}${selected ? ', selected' : ''}`}
      testID={testID}
    >
      {icon && (
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={16}
          color={iconColor}
          style={styles.chipIcon}
        />
      )}
      <Text style={[styles.chipText, textStyle]}>{label}</Text>
      {selected && (
        <Ionicons name="checkmark" size={16} color="#FFFFFF" style={styles.chipCheckmark} />
      )}
    </AnimatedPressable>
  );
}

// ============================================================================
// Section Component
// ============================================================================

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

function FilterSection({ title, children, delay = 0 }: FilterSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(300)} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function FiltersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Get initial state from store (useShallow prevents infinite re-renders)
  const storeFilters = useFilterStore(
    useShallow((state) => ({
      sortBy: state.sortBy,
      priceRange: state.priceRange,
      minRating: state.minRating,
      maxDeliveryTime: state.maxDeliveryTime,
      dietary: state.dietary,
    }))
  );
  const applyFiltersToStore = useFilterStore((state) => state.applyFilters);

  // Local filter state (initialized from store)
  const [filters, setFilters] = useState<FilterState>(storeFilters);

  // Sync local state when store changes (e.g., on clear from elsewhere)
  useEffect(() => {
    setFilters(storeFilters);
  }, [storeFilters]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.sortBy !== 'recommended') count++;
    count += filters.priceRange.length;
    if (filters.minRating !== null) count++;
    if (filters.maxDeliveryTime !== null) count++;
    count += filters.dietary.length;
    return count;
  }, [filters]);

  // Handlers
  const handleSortChange = useCallback((sortBy: SortOptionType) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const handlePriceToggle = useCallback((priceLevel: PriceLevel) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange.includes(priceLevel)
        ? prev.priceRange.filter((p) => p !== priceLevel)
        : [...prev.priceRange, priceLevel],
    }));
  }, []);

  const handleRatingChange = useCallback((rating: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? null : rating,
    }));
  }, []);

  const handleDeliveryTimeChange = useCallback((time: number) => {
    setFilters((prev) => ({
      ...prev,
      maxDeliveryTime: prev.maxDeliveryTime === time ? null : time,
    }));
  }, []);

  const handleDietaryToggle = useCallback((dietary: DietaryOption) => {
    setFilters((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(dietary)
        ? prev.dietary.filter((d) => d !== dietary)
        : [...prev.dietary, dietary],
    }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE);
  }, []);

  const handleApply = useCallback(() => {
    // Save filters to store for persistence
    applyFiltersToStore(filters);
    router.back();
  }, [applyFiltersToStore, filters]);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing[2],
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          accessibilityLabel="Close filters"
          accessibilityRole="button"
          testID="close-filters-button"
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Filters</Text>

        {activeFilterCount > 0 && (
          <Pressable
            onPress={handleClearAll}
            style={styles.clearButton}
            accessibilityLabel="Clear all filters"
            accessibilityRole="button"
            testID="clear-all-button"
          >
            <Text style={[styles.clearButtonText, { color: colors.primary }]}>Clear All</Text>
          </Pressable>
        )}

        {activeFilterCount === 0 && <View style={styles.clearButtonPlaceholder} />}
      </Animated.View>

      {/* Filter Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sort By Section */}
        <FilterSection title="Sort By" delay={50}>
          <View style={styles.chipsRow}>
            {SORT_OPTIONS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={filters.sortBy === option.id}
                onPress={() => handleSortChange(option.id)}
                testID={`sort-chip-${option.id}`}
              />
            ))}
          </View>
        </FilterSection>

        {/* Price Range Section */}
        <FilterSection title="Price Range" delay={100}>
          <View style={styles.chipsRow}>
            {PRICE_LEVELS.map((level) => (
              <FilterChip
                key={level.id}
                label={level.label}
                selected={filters.priceRange.includes(level.id)}
                onPress={() => handlePriceToggle(level.id)}
                testID={`price-chip-${level.id}`}
              />
            ))}
          </View>
        </FilterSection>

        {/* Rating Section */}
        <FilterSection title="Rating" delay={150}>
          <View style={styles.chipsRow}>
            {RATING_OPTIONS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={filters.minRating === option.id}
                onPress={() => handleRatingChange(option.id)}
                icon="star"
                testID={`rating-chip-${option.id}`}
              />
            ))}
          </View>
        </FilterSection>

        {/* Delivery Time Section */}
        <FilterSection title="Delivery Time" delay={200}>
          <View style={styles.chipsRow}>
            {DELIVERY_TIME_OPTIONS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={filters.maxDeliveryTime === option.id}
                onPress={() => handleDeliveryTimeChange(option.id)}
                icon="time-outline"
                testID={`delivery-time-chip-${option.id}`}
              />
            ))}
          </View>
        </FilterSection>

        {/* Dietary Section */}
        <FilterSection title="Dietary" delay={250}>
          <View style={styles.chipsRow}>
            {DIETARY_OPTIONS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={filters.dietary.includes(option.id)}
                onPress={() => handleDietaryToggle(option.id)}
                icon={option.icon}
                testID={`dietary-chip-${option.id}`}
              />
            ))}
          </View>
        </FilterSection>
      </ScrollView>

      {/* Apply Button */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(300)}
        style={[
          styles.applyButtonContainer,
          {
            paddingBottom: insets.bottom + Spacing[4],
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
          Shadows.md as ViewStyle,
        ]}
      >
        <Button
          onPress={handleApply}
          fullWidth
          testID="apply-filters-button"
          leftIcon={activeFilterCount > 0 ? 'options' : undefined}
        >
          {activeFilterCount > 0 ? `Apply Filters (${activeFilterCount})` : 'Apply Filters'}
        </Button>
      </Animated.View>
    </View>
  );
}

// ============================================================================
// Exports for use in other components
// ============================================================================

export {
  SORT_OPTIONS,
  PRICE_LEVELS,
  RATING_OPTIONS,
  DELIVERY_TIME_OPTIONS,
  DIETARY_OPTIONS,
  FilterChip,
  FilterSection,
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing[2],
  },
  headerTitle: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  clearButton: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
  },
  clearButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  clearButtonPlaceholder: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
  },
  section: {
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[3],
  },
  sectionContent: {
    // Container for filter chips
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
  },
  chipIcon: {
    marginRight: Spacing[1],
  },
  chipText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  chipCheckmark: {
    marginLeft: Spacing[1],
  },
  applyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
  },
});
