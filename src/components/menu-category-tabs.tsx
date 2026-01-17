/**
 * Menu Category Tabs Component
 *
 * Horizontal scrollable category tabs for restaurant menus with:
 * - Auto-scroll to active category as user scrolls menu
 * - Tap to scroll to category section
 * - Animated underline indicator
 * - Sticky behavior when used with ScrollView
 */

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import {
  BorderRadius,
  Colors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================================================
// Types
// ============================================================================

export interface MenuCategory {
  id: string;
  name: string;
  icon?: keyof typeof Ionicons.glyphMap;
  itemCount?: number;
}

export interface MenuCategoryTabsProps {
  /** List of menu categories */
  categories: MenuCategory[];
  /** Currently active category ID */
  activeCategory: string;
  /** Callback when a category tab is pressed */
  onCategoryPress: (categoryId: string) => void;
  /** Optional: shared value for tracking scroll position (for indicator animation) */
  scrollProgress?: SharedValue<number>;
  /** Optional: whether the tabs are in sticky mode */
  isSticky?: boolean;
}

export interface CategoryTabProps {
  category: MenuCategory;
  isActive: boolean;
  onPress: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const TAB_HEIGHT = 48;
const INDICATOR_HEIGHT = 3;
const TAB_MIN_WIDTH = 80;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

// ============================================================================
// Category Tab Component
// ============================================================================

function CategoryTab({ category, isActive, onPress }: CategoryTabProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textColor = isActive ? PrimaryColors[500] : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={`${category.name} category${category.itemCount !== undefined ? `, ${category.itemCount} items` : ''}`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      testID={`category-tab-${category.id}`}
    >
      <Animated.View style={[styles.tab, animatedStyle]}>
        {category.icon && (
          <Ionicons name={category.icon} size={18} color={textColor} style={styles.tabIcon} />
        )}
        <ThemedText
          style={[styles.tabText, { color: textColor }, isActive && styles.tabTextActive]}
        >
          {category.name}
        </ThemedText>
        {category.itemCount !== undefined && category.itemCount > 0 && (
          <View
            style={[
              styles.itemCountBadge,
              { backgroundColor: isActive ? PrimaryColors[100] : colors.backgroundSecondary },
            ]}
          >
            <ThemedText
              style={[
                styles.itemCountText,
                { color: isActive ? PrimaryColors[600] : colors.textTertiary },
              ]}
            >
              {category.itemCount}
            </ThemedText>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ============================================================================
// Animated Underline Indicator
// ============================================================================

interface UnderlineIndicatorProps {
  activeIndex: number;
  tabLayouts: { x: number; width: number }[];
}

function UnderlineIndicator({ activeIndex, tabLayouts }: UnderlineIndicatorProps) {
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(TAB_MIN_WIDTH);

  useEffect(() => {
    if (tabLayouts[activeIndex]) {
      indicatorX.value = withSpring(tabLayouts[activeIndex].x, SPRING_CONFIG);
      indicatorWidth.value = withSpring(tabLayouts[activeIndex].width, SPRING_CONFIG);
    }
  }, [activeIndex, tabLayouts, indicatorX, indicatorWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return <Animated.View style={[styles.indicator, animatedStyle]} />;
}

// ============================================================================
// Main Component
// ============================================================================

export function MenuCategoryTabs({
  categories,
  activeCategory,
  onCategoryPress,
  isSticky = false,
}: MenuCategoryTabsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const flatListRef = useRef<FlatList<MenuCategory>>(null);
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);

  // Find the active category index
  const activeIndex = categories.findIndex((cat) => cat.id === activeCategory);

  // Auto-scroll to active category tab
  useEffect(() => {
    if (flatListRef.current && activeIndex >= 0) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5, // Center the active tab
      });
    }
  }, [activeIndex]);

  const handleTabPress = useCallback(
    (categoryId: string) => {
      onCategoryPress(categoryId);
    },
    [onCategoryPress]
  );

  const handleTabLayout = useCallback((index: number, x: number, width: number) => {
    tabLayouts.current[index] = { x, width };
  }, []);

  const renderTab = useCallback(
    ({ item, index }: { item: MenuCategory; index: number }) => (
      <View
        onLayout={(event) => {
          const { x, width } = event.nativeEvent.layout;
          handleTabLayout(index, x, width);
        }}
      >
        <CategoryTab
          category={item}
          isActive={item.id === activeCategory}
          onPress={() => handleTabPress(item.id)}
        />
      </View>
    ),
    [activeCategory, handleTabPress, handleTabLayout]
  );

  const keyExtractor = useCallback((item: MenuCategory) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<MenuCategory> | null | undefined, index: number) => ({
      length: TAB_MIN_WIDTH + Spacing[4],
      offset: (TAB_MIN_WIDTH + Spacing[4]) * index,
      index,
    }),
    []
  );

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
      // If scrollToIndex fails, scroll to the closest available position
      flatListRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: true,
      });
    },
    []
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        isSticky && styles.containerSticky,
        isSticky && Shadows.sm,
      ]}
    >
      <FlatList
        ref={flatListRef}
        data={categories}
        renderItem={renderTab}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
      />
      <View style={[styles.indicatorTrack, { backgroundColor: colors.border }]}>
        {tabLayouts.current.length > 0 && activeIndex >= 0 && (
          <UnderlineIndicator activeIndex={activeIndex} tabLayouts={tabLayouts.current} />
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
    height: TAB_HEIGHT + INDICATOR_HEIGHT,
    borderBottomWidth: 0,
  },
  containerSticky: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Will be set via border prop
  },
  contentContainer: {
    paddingHorizontal: Spacing[4],
    alignItems: 'center',
  },
  tab: {
    height: TAB_HEIGHT,
    minWidth: TAB_MIN_WIDTH,
    paddingHorizontal: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: Spacing[1],
  },
  tabText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '600',
  },
  itemCountBadge: {
    marginLeft: Spacing[1],
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  itemCountText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: '500',
  },
  indicatorTrack: {
    height: INDICATOR_HEIGHT,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  indicator: {
    height: INDICATOR_HEIGHT,
    backgroundColor: PrimaryColors[500],
    borderTopLeftRadius: BorderRadius.full,
    borderTopRightRadius: BorderRadius.full,
    position: 'absolute',
    bottom: 0,
  },
});

// ============================================================================
// Exports
// ============================================================================

export { TAB_HEIGHT, INDICATOR_HEIGHT };
