/**
 * ReviewsSection Component
 *
 * Displays reviews section for restaurant detail page with:
 * - Section header with review count
 * - Recent reviews list
 * - Rating distribution (optional)
 * - "See all reviews" button
 *
 * Uses react-native-reanimated for smooth animations
 */

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ReviewCard } from '@/components/cards/review-card';
import { ThemedText } from '@/components/themed-text';
import { Skeleton } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  Spacing,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { fetchRecentReviews, getRatingDistribution } from '@/data/mock/reviews';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Review } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface ReviewsSectionProps {
  restaurantId: string;
  rating: number;
  reviewCount: number;
  showRatingDistribution?: boolean;
  maxReviews?: number;
  onSeeAllPress?: () => void;
  onPhotoPress?: (photos: string[], index: number) => void;
  testID?: string;
}

// ============================================================================
// Sub-Components
// ============================================================================

interface RatingBarProps {
  stars: number;
  count: number;
  total: number;
}

function RatingBar({ stars, count, total }: RatingBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <View style={styles.ratingBar}>
      <ThemedText style={[styles.ratingBarLabel, { color: colors.textSecondary }]}>
        {stars}
      </ThemedText>
      <Ionicons name="star" size={12} color={WarningColors[500]} />
      <View style={[styles.ratingBarTrack, { backgroundColor: colors.backgroundSecondary }]}>
        <View
          style={[
            styles.ratingBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: WarningColors[500],
            },
          ]}
        />
      </View>
      <ThemedText style={[styles.ratingBarCount, { color: colors.textTertiary }]}>
        {count}
      </ThemedText>
    </View>
  );
}

interface RatingDistributionProps {
  restaurantId: string;
  totalReviews: number;
}

function RatingDistribution({ restaurantId, totalReviews }: RatingDistributionProps) {
  const distribution = getRatingDistribution(restaurantId);

  return (
    <View style={styles.distributionContainer}>
      {[5, 4, 3, 2, 1].map((stars) => (
        <RatingBar key={stars} stars={stars} count={distribution[stars]} total={totalReviews} />
      ))}
    </View>
  );
}

function ReviewsSkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.skeletonCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.skeletonHeader}>
            <Skeleton width={40} height={40} borderRadius={BorderRadius.full} />
            <View style={styles.skeletonHeaderInfo}>
              <Skeleton width={100} height={14} />
              <Skeleton width={80} height={12} style={{ marginTop: Spacing[1] }} />
            </View>
          </View>
          <Skeleton width="100%" height={14} style={{ marginTop: Spacing[3] }} />
          <Skeleton width="80%" height={14} style={{ marginTop: Spacing[1] }} />
        </View>
      ))}
    </View>
  );
}

interface EmptyReviewsProps {
  testID?: string;
}

function EmptyReviews({ testID }: EmptyReviewsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.emptyContainer} testID={testID}>
      <Ionicons name="chatbubble-outline" size={48} color={colors.textTertiary} />
      <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
        No reviews yet
      </ThemedText>
      <ThemedText style={[styles.emptySubtext, { color: colors.textTertiary }]}>
        Be the first to review this restaurant
      </ThemedText>
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ReviewsSection({
  restaurantId,
  rating,
  reviewCount,
  showRatingDistribution = true,
  maxReviews = 3,
  onSeeAllPress,
  onPhotoPress,
  testID,
}: ReviewsSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      const fetchedReviews = await fetchRecentReviews(restaurantId, maxReviews);
      setReviews(fetchedReviews);
      setIsLoading(false);
    };
    loadReviews();
  }, [restaurantId, maxReviews]);

  const handleSeeAllPress = useCallback(() => {
    onSeeAllPress?.();
  }, [onSeeAllPress]);

  return (
    <View style={styles.container} testID={testID}>
      {/* Section Header */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(AnimationDurations.normal)}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <ThemedText style={[styles.title, { color: colors.text }]}>Reviews</ThemedText>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color={WarningColors[500]} />
            <ThemedText style={[styles.ratingText, { color: colors.text }]}>
              {rating.toFixed(1)}
            </ThemedText>
            <ThemedText style={[styles.reviewCountText, { color: colors.textSecondary }]}>
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* Rating Distribution */}
      {showRatingDistribution && reviewCount > 0 && (
        <Animated.View
          entering={FadeInUp.delay(150).duration(AnimationDurations.normal)}
          style={styles.distributionWrapper}
        >
          <RatingDistribution restaurantId={restaurantId} totalReviews={reviewCount} />
        </Animated.View>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <ReviewsSkeleton />
      ) : reviews.length > 0 ? (
        <Animated.View entering={FadeInUp.delay(200).duration(AnimationDurations.normal)}>
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              onPhotoPress={onPhotoPress}
              testID={`review-card-${index}`}
            />
          ))}
        </Animated.View>
      ) : (
        <EmptyReviews testID="empty-reviews" />
      )}

      {/* See All Button */}
      {reviewCount > maxReviews && onSeeAllPress && (
        <Animated.View entering={FadeInUp.delay(250).duration(AnimationDurations.normal)}>
          <Pressable
            onPress={handleSeeAllPress}
            style={[styles.seeAllButton, { borderColor: colors.primary }]}
            accessibilityLabel="See all reviews"
            accessibilityRole="button"
          >
            <ThemedText style={[styles.seeAllText, { color: colors.primary }]}>
              See all {reviewCount} reviews
            </ThemedText>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing[2],
  },
  header: {
    marginBottom: Spacing[4],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  title: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  ratingText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
  },
  reviewCountText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  distributionWrapper: {
    marginBottom: Spacing[4],
  },
  distributionContainer: {
    gap: Spacing[1],
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  ratingBarLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    width: 12,
    textAlign: 'center',
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  ratingBarCount: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    width: 24,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing[8],
  },
  emptyText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '500',
    marginTop: Spacing[3],
  },
  emptySubtext: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginTop: Spacing[1],
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing[2],
  },
  seeAllText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '500',
    marginRight: Spacing[1],
  },
  skeletonCard: {
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing[3],
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  skeletonHeaderInfo: {
    flex: 1,
    marginLeft: Spacing[3],
  },
});
