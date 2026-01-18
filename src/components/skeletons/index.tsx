/**
 * Skeleton Components Library
 *
 * Comprehensive skeleton loading states for all major screens:
 * - HomeScreenSkeleton
 * - RestaurantDetailSkeleton
 * - OrderDetailsSkeleton
 * - SearchScreenSkeleton
 *
 * All skeletons use shimmer animation from the base Skeleton component.
 */

import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Skeleton } from '@/components/ui/skeleton';
import { AnimationDurations, BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================================================
// Restaurant Card Skeleton (Horizontal Scroll Item)
// ============================================================================

interface RestaurantCardSkeletonProps {
  variant?: 'default' | 'featured';
  testID?: string;
}

export function RestaurantCardSkeleton({
  variant = 'default',
  testID,
}: RestaurantCardSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardWidth = variant === 'featured' ? 320 : 280;
  const cardHeight = variant === 'featured' ? 240 : 200;
  const imageHeight = cardHeight * 0.6;

  return (
    <View
      style={[
        styles.restaurantCardSkeleton,
        {
          width: cardWidth,
          height: cardHeight,
          backgroundColor: colors.card,
        },
      ]}
      testID={testID}
    >
      {/* Image skeleton */}
      <Skeleton width="100%" height={imageHeight} variant="rectangular" />

      {/* Content skeleton */}
      <View style={styles.restaurantCardContent}>
        {/* Title row */}
        <View style={styles.restaurantCardTitleRow}>
          <Skeleton width="70%" height={18} variant="text" />
          <Skeleton width={50} height={16} variant="text" />
        </View>

        {/* Cuisine row */}
        <Skeleton width="50%" height={14} variant="text" style={styles.restaurantCardCuisine} />

        {/* Delivery row */}
        <View style={styles.restaurantCardDeliveryRow}>
          <Skeleton width={80} height={12} variant="text" />
          <Skeleton width={80} height={12} variant="text" />
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// Home Screen Skeleton
// ============================================================================

export interface HomeScreenSkeletonProps {
  testID?: string;
}

/**
 * Full-screen skeleton for the home screen
 * Includes: address header, search bar, categories, and restaurant sections
 */
export function HomeScreenSkeleton({ testID }: HomeScreenSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
      testID={testID}
    >
      {/* Delivery Address Header Skeleton */}
      <Animated.View
        entering={FadeIn.duration(AnimationDurations.fast)}
        style={styles.homeHeaderSkeleton}
      >
        <View style={styles.homeAddressRow}>
          <Skeleton width={20} height={20} variant="circular" />
          <View style={styles.homeAddressTextContainer}>
            <Skeleton width={80} height={12} />
            <Skeleton width={150} height={16} style={styles.homeAddressText} />
          </View>
          <Skeleton width={20} height={20} variant="circular" />
        </View>
      </Animated.View>

      {/* Search Bar Skeleton */}
      <Animated.View
        entering={FadeIn.delay(50).duration(AnimationDurations.fast)}
        style={styles.homeSearchRow}
      >
        <Skeleton width="82%" height={44} variant="rounded" radius={BorderRadius.lg} />
        <Skeleton width={44} height={44} variant="rounded" radius={BorderRadius.lg} />
      </Animated.View>

      {/* Category Chips Skeleton */}
      <Animated.View
        entering={FadeIn.delay(100).duration(AnimationDurations.fast)}
        style={styles.homeCategorySkeleton}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={`category-skeleton-${index}`}
            width={80}
            height={36}
            variant="rounded"
            radius={BorderRadius.full}
            style={index > 0 ? styles.homeCategoryChip : undefined}
          />
        ))}
      </Animated.View>

      {/* Restaurant Sections Skeleton */}
      <View style={styles.homeSectionsContainer}>
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <Animated.View
            key={`section-skeleton-${sectionIndex}`}
            entering={FadeIn.delay(150 + sectionIndex * 50).duration(AnimationDurations.fast)}
            style={styles.homeSectionSkeleton}
          >
            {/* Section Header */}
            <View style={styles.homeSectionHeader}>
              <View>
                <Skeleton width={160} height={22} />
                <Skeleton width={120} height={14} style={styles.homeSectionSubtitle} />
              </View>
              <Skeleton width={60} height={16} />
            </View>

            {/* Restaurant Cards Row */}
            <View style={styles.homeCardsRow}>
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <RestaurantCardSkeleton
                  key={`card-skeleton-${sectionIndex}-${cardIndex}`}
                  variant={sectionIndex === 0 ? 'featured' : 'default'}
                  testID={`restaurant-card-skeleton-${sectionIndex}-${cardIndex}`}
                />
              ))}
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

// ============================================================================
// Restaurant Detail Skeleton
// ============================================================================

export interface RestaurantDetailSkeletonProps {
  testID?: string;
}

/**
 * Full-screen skeleton for the restaurant detail screen
 * Includes: hero image, restaurant info, and menu sections
 */
export function RestaurantDetailSkeleton({ testID }: RestaurantDetailSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID={testID}>
      {/* Hero Image Skeleton */}
      <Skeleton width="100%" height={280} variant="rectangular" />

      {/* Back/Action Buttons Skeleton */}
      <View style={[styles.restaurantDetailBackButton, { top: insets.top + Spacing[2] }]}>
        <Skeleton width={40} height={40} variant="circular" />
      </View>
      <View style={[styles.restaurantDetailActionButtons, { top: insets.top + Spacing[2] }]}>
        <Skeleton width={40} height={40} variant="circular" />
        <Skeleton
          width={40}
          height={40}
          variant="circular"
          style={styles.restaurantDetailActionButtonGap}
        />
      </View>

      {/* Content Container */}
      <View
        style={[styles.restaurantDetailContentContainer, { backgroundColor: colors.background }]}
      >
        {/* Restaurant Name and Rating */}
        <Animated.View
          entering={FadeIn.delay(100).duration(AnimationDurations.fast)}
          style={styles.restaurantDetailHeaderInfo}
        >
          <Skeleton width="70%" height={28} />
          <View style={styles.restaurantDetailRatingRow}>
            <Skeleton width={18} height={18} variant="circular" />
            <Skeleton width={30} height={18} style={styles.restaurantDetailRatingText} />
            <Skeleton width={80} height={14} style={styles.restaurantDetailRatingText} />
          </View>
        </Animated.View>

        {/* Cuisine Tags */}
        <Animated.View
          entering={FadeIn.delay(150).duration(AnimationDurations.fast)}
          style={styles.restaurantDetailCuisineContainer}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`cuisine-skeleton-${index}`}
              width={70}
              height={28}
              variant="rounded"
              radius={BorderRadius.full}
              style={index > 0 ? styles.restaurantDetailCuisineTag : undefined}
            />
          ))}
        </Animated.View>

        {/* Delivery Info */}
        <Animated.View
          entering={FadeIn.delay(200).duration(AnimationDurations.fast)}
          style={styles.restaurantDetailDeliveryInfo}
        >
          <Skeleton width={100} height={20} />
          <View style={styles.restaurantDetailDeliveryDivider} />
          <Skeleton width={100} height={20} />
        </Animated.View>

        {/* Divider */}
        <View style={[styles.restaurantDetailDivider, { backgroundColor: colors.border }]} />

        {/* Menu Section Header */}
        <Animated.View entering={FadeIn.delay(250).duration(AnimationDurations.fast)}>
          <Skeleton width={80} height={24} />
        </Animated.View>

        {/* Menu Category Tabs */}
        <Animated.View
          entering={FadeIn.delay(300).duration(AnimationDurations.fast)}
          style={styles.restaurantDetailMenuTabs}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`tab-skeleton-${index}`}
              width={80}
              height={36}
              variant="rounded"
              radius={BorderRadius.md}
              style={index > 0 ? styles.restaurantDetailMenuTab : undefined}
            />
          ))}
        </Animated.View>

        {/* Menu Items Skeleton */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Animated.View
            key={`menu-item-skeleton-${index}`}
            entering={FadeIn.delay(350 + index * 50).duration(AnimationDurations.fast)}
            style={[
              styles.restaurantDetailMenuItem,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <View style={styles.restaurantDetailMenuItemContent}>
              <Skeleton width="60%" height={18} />
              <Skeleton
                width="90%"
                height={14}
                style={styles.restaurantDetailMenuItemDescription}
              />
              <Skeleton
                width="40%"
                height={14}
                style={styles.restaurantDetailMenuItemDescription}
              />
              <View style={styles.restaurantDetailMenuItemPriceRow}>
                <Skeleton width={60} height={18} />
                <Skeleton width={36} height={36} variant="circular" />
              </View>
            </View>
            <Skeleton width={80} height={80} variant="rounded" radius={BorderRadius.md} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

// ============================================================================
// Order Details Skeleton
// ============================================================================

export interface OrderDetailsSkeletonProps {
  testID?: string;
}

/**
 * Full-screen skeleton for the order details screen
 * Includes: header, status tracker, items, receipt, and action buttons
 */
export function OrderDetailsSkeleton({ testID }: OrderDetailsSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
      testID={testID}
    >
      {/* Header */}
      <View style={[styles.orderDetailsHeader, { borderBottomColor: colors.divider }]}>
        <Skeleton width={24} height={24} variant="circular" />
        <Skeleton width={120} height={20} />
        <View style={styles.orderDetailsHeaderSpacer} />
      </View>

      {/* Scrollable Content */}
      <View style={styles.orderDetailsContent}>
        {/* Order Header Card */}
        <Animated.View
          entering={FadeIn.duration(AnimationDurations.fast)}
          style={[styles.orderDetailsCard, { backgroundColor: colors.card, ...Shadows.md }]}
        >
          <View style={styles.orderDetailsRestaurantRow}>
            <Skeleton width={60} height={60} variant="rounded" radius={BorderRadius.lg} />
            <View style={styles.orderDetailsRestaurantInfo}>
              <Skeleton width="70%" height={20} />
              <Skeleton width="90%" height={14} style={styles.orderDetailsRestaurantDate} />
            </View>
          </View>
          <View style={[styles.orderDetailsIdRow, { borderTopColor: colors.divider }]}>
            <View>
              <Skeleton width={60} height={12} />
              <Skeleton width={100} height={16} style={styles.orderDetailsIdValue} />
            </View>
            <Skeleton width={80} height={26} variant="rounded" radius={BorderRadius.md} />
          </View>
        </Animated.View>

        {/* Order Status Section */}
        <Animated.View
          entering={FadeIn.delay(100).duration(AnimationDurations.fast)}
          style={[styles.orderDetailsCard, { backgroundColor: colors.card, ...Shadows.sm }]}
        >
          <Skeleton width={100} height={18} />
          <View style={[styles.orderDetailsDivider, { backgroundColor: colors.divider }]} />
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={`status-skeleton-${index}`} style={styles.orderDetailsStatusRow}>
              <Skeleton width={24} height={24} variant="circular" />
              <View style={styles.orderDetailsStatusContent}>
                <Skeleton width={120} height={16} />
                <Skeleton width={80} height={12} style={styles.orderDetailsStatusTime} />
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Order Items Section */}
        <Animated.View
          entering={FadeIn.delay(200).duration(AnimationDurations.fast)}
          style={[styles.orderDetailsCard, { backgroundColor: colors.card, ...Shadows.sm }]}
        >
          <Skeleton width={100} height={18} />
          <View style={[styles.orderDetailsDivider, { backgroundColor: colors.divider }]} />
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={`item-skeleton-${index}`} style={styles.orderDetailsItemRow}>
              <Skeleton width={32} height={20} />
              <View style={styles.orderDetailsItemDetails}>
                <Skeleton width="70%" height={16} />
                <Skeleton width="50%" height={12} style={styles.orderDetailsItemCustomization} />
              </View>
              <Skeleton width={50} height={16} />
            </View>
          ))}
        </Animated.View>

        {/* Receipt Section */}
        <Animated.View
          entering={FadeIn.delay(300).duration(AnimationDurations.fast)}
          style={[styles.orderDetailsCard, { backgroundColor: colors.card, ...Shadows.sm }]}
        >
          <Skeleton width={80} height={18} />
          <View style={[styles.orderDetailsDivider, { backgroundColor: colors.divider }]} />
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={`receipt-skeleton-${index}`} style={styles.orderDetailsReceiptRow}>
              <Skeleton width={80} height={14} />
              <Skeleton width={60} height={14} />
            </View>
          ))}
          <View style={[styles.orderDetailsTotalDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.orderDetailsReceiptRow}>
            <Skeleton width={50} height={20} />
            <Skeleton width={80} height={22} />
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View
        style={[
          styles.orderDetailsButtonContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.divider,
            paddingBottom: insets.bottom + Spacing[4],
          },
        ]}
      >
        <Skeleton width="48%" height={48} variant="rounded" radius={BorderRadius.lg} />
        <Skeleton width="48%" height={48} variant="rounded" radius={BorderRadius.lg} />
      </View>
    </View>
  );
}

// ============================================================================
// Search Screen Skeleton
// ============================================================================

export interface SearchScreenSkeletonProps {
  testID?: string;
}

/**
 * Full-screen skeleton for the search screen
 * Includes: search bar and search results
 */
export function SearchScreenSkeleton({ testID }: SearchScreenSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
      testID={testID}
    >
      {/* Search Bar Skeleton */}
      <Animated.View
        entering={FadeIn.duration(AnimationDurations.fast)}
        style={styles.searchScreenSearchBar}
      >
        <Skeleton width="100%" height={48} variant="rounded" radius={BorderRadius.lg} />
      </Animated.View>

      {/* Results Header */}
      <Animated.View
        entering={FadeIn.delay(50).duration(AnimationDurations.fast)}
        style={styles.searchScreenResultsHeader}
      >
        <Skeleton width={120} height={18} />
        <Skeleton width={80} height={14} />
      </Animated.View>

      {/* Search Results */}
      <View style={styles.searchScreenResults}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Animated.View
            key={`search-result-skeleton-${index}`}
            entering={FadeIn.delay(100 + index * 50).duration(AnimationDurations.fast)}
            style={[styles.searchScreenResultItem, { borderBottomColor: colors.divider }]}
          >
            <Skeleton width={70} height={70} variant="rounded" radius={BorderRadius.md} />
            <View style={styles.searchScreenResultContent}>
              <Skeleton width="70%" height={18} />
              <Skeleton width="50%" height={14} style={styles.searchScreenResultSubtext} />
              <View style={styles.searchScreenResultInfoRow}>
                <Skeleton width={50} height={14} />
                <Skeleton width={80} height={14} />
                <Skeleton width={60} height={14} />
              </View>
            </View>
          </Animated.View>
        ))}
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

  // Restaurant Card Skeleton
  restaurantCardSkeleton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  restaurantCardContent: {
    flex: 1,
    padding: Spacing[3],
    justifyContent: 'space-between',
  },
  restaurantCardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantCardCuisine: {
    marginTop: Spacing[1],
  },
  restaurantCardDeliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing[2],
  },

  // Home Screen Skeleton
  homeHeaderSkeleton: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  homeAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeAddressTextContainer: {
    flex: 1,
    marginLeft: Spacing[2],
  },
  homeAddressText: {
    marginTop: Spacing[1],
  },
  homeSearchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    gap: Spacing[2],
  },
  homeCategorySkeleton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  homeCategoryChip: {
    marginLeft: Spacing[2],
  },
  homeSectionsContainer: {
    flex: 1,
    paddingTop: Spacing[4],
  },
  homeSectionSkeleton: {
    marginBottom: Spacing[6],
  },
  homeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  homeSectionSubtitle: {
    marginTop: Spacing[1],
  },
  homeCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
  },

  // Restaurant Detail Skeleton
  restaurantDetailBackButton: {
    position: 'absolute',
    left: Spacing[4],
    zIndex: 100,
  },
  restaurantDetailActionButtons: {
    position: 'absolute',
    right: Spacing[4],
    flexDirection: 'row',
    zIndex: 100,
  },
  restaurantDetailActionButtonGap: {
    marginLeft: Spacing[2],
  },
  restaurantDetailContentContainer: {
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    marginTop: -Spacing[6],
    paddingTop: Spacing[5],
    paddingHorizontal: Spacing[4],
    flex: 1,
  },
  restaurantDetailHeaderInfo: {
    marginBottom: Spacing[3],
  },
  restaurantDetailRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  restaurantDetailRatingText: {
    marginLeft: Spacing[1],
  },
  restaurantDetailCuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing[4],
  },
  restaurantDetailCuisineTag: {
    marginLeft: Spacing[2],
  },
  restaurantDetailDeliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  restaurantDetailDeliveryDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginHorizontal: Spacing[3],
  },
  restaurantDetailDivider: {
    height: 1,
    marginVertical: Spacing[4],
  },
  restaurantDetailMenuTabs: {
    flexDirection: 'row',
    marginTop: Spacing[3],
    marginBottom: Spacing[4],
  },
  restaurantDetailMenuTab: {
    marginLeft: Spacing[2],
  },
  restaurantDetailMenuItem: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[3],
  },
  restaurantDetailMenuItemContent: {
    flex: 1,
    marginRight: Spacing[3],
  },
  restaurantDetailMenuItemDescription: {
    marginTop: Spacing[2],
  },
  restaurantDetailMenuItemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing[3],
  },

  // Order Details Skeleton
  orderDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  orderDetailsHeaderSpacer: {
    width: 24,
  },
  orderDetailsContent: {
    flex: 1,
    padding: Spacing[4],
    gap: Spacing[4],
  },
  orderDetailsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
  },
  orderDetailsRestaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  orderDetailsRestaurantInfo: {
    flex: 1,
  },
  orderDetailsRestaurantDate: {
    marginTop: Spacing[1],
  },
  orderDetailsIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
  },
  orderDetailsIdValue: {
    marginTop: Spacing[0.5],
  },
  orderDetailsDivider: {
    height: 1,
    marginVertical: Spacing[3],
  },
  orderDetailsStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  orderDetailsStatusContent: {
    flex: 1,
  },
  orderDetailsStatusTime: {
    marginTop: Spacing[0.5],
  },
  orderDetailsItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  orderDetailsItemDetails: {
    flex: 1,
  },
  orderDetailsItemCustomization: {
    marginTop: Spacing[1],
  },
  orderDetailsReceiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[2],
  },
  orderDetailsTotalDivider: {
    height: 1,
    marginVertical: Spacing[3],
  },
  orderDetailsButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    padding: Spacing[4],
    gap: Spacing[3],
    borderTopWidth: 1,
  },

  // Search Screen Skeleton
  searchScreenSearchBar: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  searchScreenResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[2],
  },
  searchScreenResults: {
    flex: 1,
    paddingHorizontal: Spacing[4],
  },
  searchScreenResultItem: {
    flexDirection: 'row',
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    gap: Spacing[3],
  },
  searchScreenResultContent: {
    flex: 1,
  },
  searchScreenResultSubtext: {
    marginTop: Spacing[1],
  },
  searchScreenResultInfoRow: {
    flexDirection: 'row',
    gap: Spacing[4],
    marginTop: Spacing[2],
  },
});
