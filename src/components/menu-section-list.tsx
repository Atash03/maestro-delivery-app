/**
 * MenuSectionList Component
 *
 * Components for displaying menu items grouped by category.
 * Features:
 * - SectionList with category headers (standalone mode)
 * - Category headers with item count
 * - Empty category message if all items unavailable
 * - Skeleton loading for menu
 * - Integration with cart functionality
 *
 * Also exports individual components for use in custom scroll views:
 * - MenuSectionHeader: Category header component
 * - MenuItemsList: List of menu items for a category
 * - MenuSkeleton: Loading skeleton
 * - EmptyMenu: Empty state component
 */

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  SectionList,
  type SectionListData,
  type SectionListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { RestaurantMenuItemCard } from '@/components/cards';
import { ThemedText } from '@/components/themed-text';
import { Skeleton } from '@/components/ui';
import { AnimationDurations, BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MenuItem, Restaurant } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface MenuSection {
  /** Category ID/name */
  category: string;
  /** Menu items in this category */
  data: MenuItem[];
}

export interface MenuSectionListProps {
  /** Menu sections grouped by category */
  sections: MenuSection[];
  /** The restaurant this menu belongs to */
  restaurant: Restaurant;
  /** Whether the menu is loading */
  isLoading?: boolean;
  /** Get quantity of an item in cart */
  getItemQuantity: (menuItemId: string) => number;
  /** Callback when item is pressed (for customization modal) */
  onItemPress?: (item: MenuItem) => void;
  /** Callback when add button is pressed */
  onItemAdd?: (item: MenuItem) => void;
  /** Callback when quantity is increased */
  onItemIncrement?: (item: MenuItem) => void;
  /** Callback when quantity is decreased */
  onItemDecrement?: (item: MenuItem) => void;
  /** Callback when scroll occurs */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Callback when a category section layout is measured */
  onCategoryLayout?: (categoryId: string, event: LayoutChangeEvent) => void;
  /** Whether to show sticky section headers */
  stickySectionHeaders?: boolean;
  /** Header component to render above the sections */
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  /** Footer component to render below the sections */
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
  /** Ref setter for the SectionList */
  listRef?: React.Ref<SectionList<MenuItem, MenuSection>>;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SKELETON_SECTION_COUNT = 3;
const SKELETON_ITEM_COUNT_PER_SECTION = 3;

// ============================================================================
// Sub-Components
// ============================================================================

interface SectionHeaderProps {
  section: SectionListData<MenuItem, MenuSection>;
  onLayout?: (categoryId: string, event: LayoutChangeEvent) => void;
}

/**
 * SectionHeader - Renders the category header for a menu section
 * This is an internal component used by both MenuSectionList and MenuSectionHeader
 */
function SectionHeader({ section, onLayout }: SectionHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { category, data } = section;
  const availableCount = data.filter((item) => item.isAvailable).length;
  const totalCount = data.length;
  const allUnavailable = availableCount === 0 && totalCount > 0;

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(category, event);
    },
    [category, onLayout]
  );

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal)}
      style={[styles.sectionHeader, { backgroundColor: colors.background }]}
      onLayout={handleLayout}
    >
      <View style={styles.sectionHeaderContent}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>{category}</ThemedText>
        <ThemedText style={[styles.sectionCount, { color: colors.textTertiary }]}>
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </ThemedText>
      </View>
      {allUnavailable && (
        <Animated.View
          entering={FadeInUp.delay(100).duration(AnimationDurations.fast)}
          style={[styles.unavailableNotice, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name="alert-circle-outline" size={16} color={colors.textTertiary} />
          <ThemedText style={[styles.unavailableText, { color: colors.textTertiary }]}>
            All items in this category are currently unavailable
          </ThemedText>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ============================================================================
// Exported Building Block Components
// ============================================================================

export interface MenuSectionHeaderProps {
  /** Category name/ID */
  category: string;
  /** Menu items in this category */
  items: MenuItem[];
  /** Callback when layout is measured */
  onLayout?: (event: LayoutChangeEvent) => void;
  /** Test ID for testing */
  testID?: string;
}

/**
 * MenuSectionHeader - Standalone category header component
 * Use this when rendering menu sections in a custom ScrollView
 */
export function MenuSectionHeader({ category, items, onLayout, testID }: MenuSectionHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const availableCount = items.filter((item) => item.isAvailable).length;
  const totalCount = items.length;
  const allUnavailable = availableCount === 0 && totalCount > 0;

  return (
    <View style={styles.standaloneSectionHeader} onLayout={onLayout} testID={testID}>
      <View style={styles.sectionHeaderContent}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>{category}</ThemedText>
        <ThemedText style={[styles.sectionCount, { color: colors.textTertiary }]}>
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </ThemedText>
      </View>
      {allUnavailable && (
        <Animated.View
          entering={FadeInUp.delay(100).duration(AnimationDurations.fast)}
          style={[styles.unavailableNotice, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name="alert-circle-outline" size={16} color={colors.textTertiary} />
          <ThemedText style={[styles.unavailableText, { color: colors.textTertiary }]}>
            All items in this category are currently unavailable
          </ThemedText>
        </Animated.View>
      )}
    </View>
  );
}

/**
 * MenuItemSkeleton - Skeleton loader for a menu item
 */
function MenuItemSkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.skeletonItem, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Content Section */}
      <View style={styles.skeletonContent}>
        <Skeleton width={80} height={12} style={styles.skeletonBadge} />
        <Skeleton width="70%" height={16} style={styles.skeletonName} />
        <Skeleton width="90%" height={12} style={styles.skeletonDescription} />
        <Skeleton width="50%" height={12} style={styles.skeletonDescription} />
        <View style={styles.skeletonPriceRow}>
          <Skeleton width={60} height={16} />
          <Skeleton width={36} height={36} variant="circular" />
        </View>
      </View>
      {/* Image Section */}
      <Skeleton width={80} height={80} variant="rounded" radius={BorderRadius.md} />
    </View>
  );
}

/**
 * SectionSkeleton - Skeleton loader for a menu section
 */
function SectionSkeleton({ sectionIndex }: { sectionIndex: number }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.skeletonSection}>
      {/* Header Skeleton */}
      <View style={[styles.skeletonHeader, { backgroundColor: colors.background }]}>
        <Skeleton width={120} height={20} />
        <Skeleton width={60} height={14} />
      </View>
      {/* Items Skeleton */}
      {Array.from({ length: SKELETON_ITEM_COUNT_PER_SECTION }).map((_, index) => (
        <Animated.View
          key={`skeleton-item-${sectionIndex}-${index}`}
          entering={FadeIn.delay(100 + sectionIndex * 50 + index * 30).duration(
            AnimationDurations.fast
          )}
          style={styles.skeletonItemWrapper}
        >
          <MenuItemSkeleton />
        </Animated.View>
      ))}
    </View>
  );
}

/**
 * MenuSkeleton - Full skeleton loader for the menu
 */
export function MenuSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: SKELETON_SECTION_COUNT }).map((_, index) => (
        <SectionSkeleton key={`skeleton-section-${index}`} sectionIndex={index} />
      ))}
    </View>
  );
}

export interface EmptyMenuProps {
  /** Custom title text */
  title?: string;
  /** Custom description text */
  description?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * EmptyMenu - Displayed when there are no menu sections
 * Exported for use in custom scroll views
 */
export function EmptyMenu({
  title = 'Menu not available',
  description = "This restaurant's menu is currently unavailable. Please check back later.",
  testID,
}: EmptyMenuProps = {}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal)}
      style={[styles.emptyContainer, { backgroundColor: colors.backgroundSecondary }]}
      testID={testID}
    >
      <Ionicons name="restaurant-outline" size={48} color={colors.textTertiary} />
      <ThemedText style={[styles.emptyTitle, { color: colors.textSecondary }]}>{title}</ThemedText>
      <ThemedText style={[styles.emptyDescription, { color: colors.textTertiary }]}>
        {description}
      </ThemedText>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function MenuSectionList({
  sections,
  restaurant,
  isLoading = false,
  getItemQuantity,
  onItemPress,
  onItemAdd,
  onItemIncrement,
  onItemDecrement,
  onScroll,
  onCategoryLayout,
  stickySectionHeaders = true,
  ListHeaderComponent,
  ListFooterComponent,
  listRef,
  testID,
}: MenuSectionListProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Render section header
  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<MenuItem, MenuSection> }) => {
      return <SectionHeader section={section} onLayout={onCategoryLayout} />;
    },
    [onCategoryLayout]
  );

  // Render menu item
  const renderItem: SectionListRenderItem<MenuItem, MenuSection> = useCallback(
    ({ item, index, section }) => {
      const sectionIndex = sections.findIndex((s) => s.category === section.category);

      return (
        <Animated.View
          entering={FadeInUp.delay(sectionIndex * 50 + index * 30).duration(
            AnimationDurations.normal
          )}
          style={styles.itemWrapper}
        >
          <RestaurantMenuItemCard
            item={item}
            restaurant={restaurant}
            quantity={getItemQuantity(item.id)}
            onPress={onItemPress}
            onAdd={onItemAdd}
            onIncrement={onItemIncrement}
            onDecrement={onItemDecrement}
            testID={testID ? `${testID}-item-${item.id}` : undefined}
          />
        </Animated.View>
      );
    },
    [
      sections,
      restaurant,
      getItemQuantity,
      onItemPress,
      onItemAdd,
      onItemIncrement,
      onItemDecrement,
      testID,
    ]
  );

  // Key extractor for items
  const keyExtractor = useCallback((item: MenuItem) => item.id, []);

  // Section separator
  const renderSectionFooter = useCallback(() => {
    return <View style={styles.sectionFooter} />;
  }, []);

  // Item separator
  const renderItemSeparator = useCallback(() => {
    return <View style={styles.itemSeparator} />;
  }, []);

  // Empty component
  const ListEmptyComponent = useMemo(() => {
    if (isLoading) {
      return <MenuSkeleton />;
    }
    return <EmptyMenu />;
  }, [isLoading]);

  // If loading, show skeleton
  if (isLoading) {
    return (
      <View style={styles.container} testID={testID ? `${testID}-loading` : undefined}>
        {ListHeaderComponent && (
          <View>{typeof ListHeaderComponent === 'function' ? null : ListHeaderComponent}</View>
        )}
        <MenuSkeleton />
        {ListFooterComponent && (
          <View>{typeof ListFooterComponent === 'function' ? null : ListFooterComponent}</View>
        )}
      </View>
    );
  }

  // If no sections, show empty state
  if (sections.length === 0) {
    return (
      <View style={styles.container} testID={testID ? `${testID}-empty` : undefined}>
        {ListHeaderComponent && (
          <View>{typeof ListHeaderComponent === 'function' ? null : ListHeaderComponent}</View>
        )}
        <EmptyMenu />
        {ListFooterComponent && (
          <View>{typeof ListFooterComponent === 'function' ? null : ListFooterComponent}</View>
        )}
      </View>
    );
  }

  return (
    <SectionList
      ref={listRef}
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      ItemSeparatorComponent={renderItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      stickySectionHeadersEnabled={stickySectionHeaders}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      testID={testID}
    />
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  sectionHeader: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
  },
  standaloneSectionHeader: {
    paddingTop: Spacing[2],
    paddingBottom: Spacing[3],
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  unavailableNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[2],
    padding: Spacing[2],
    borderRadius: BorderRadius.md,
    gap: Spacing[2],
  },
  unavailableText: {
    flex: 1,
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  sectionFooter: {
    height: Spacing[4],
  },
  itemWrapper: {
    paddingHorizontal: Spacing[4],
  },
  itemSeparator: {
    height: Spacing[3],
  },
  // Empty state
  emptyContainer: {
    padding: Spacing[8],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing[4],
    marginVertical: Spacing[6],
  },
  emptyTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
    marginTop: Spacing[3],
  },
  emptyDescription: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight * 1.4,
    textAlign: 'center',
    marginTop: Spacing[2],
  },
  // Skeleton styles
  skeletonContainer: {
    paddingTop: Spacing[4],
  },
  skeletonSection: {
    marginBottom: Spacing[4],
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  skeletonItemWrapper: {
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  skeletonItem: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    minHeight: 120,
  },
  skeletonContent: {
    flex: 1,
    marginRight: Spacing[3],
  },
  skeletonBadge: {
    marginBottom: Spacing[2],
  },
  skeletonName: {
    marginBottom: Spacing[2],
  },
  skeletonDescription: {
    marginBottom: Spacing[1],
  },
  skeletonPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: Spacing[2],
  },
});
