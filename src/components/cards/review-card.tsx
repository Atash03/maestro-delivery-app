/**
 * ReviewCard Component
 *
 * Displays a single review with:
 * - User avatar and name
 * - Rating stars
 * - Review text
 * - Photos (if any)
 * - Date
 *
 * Uses react-native-reanimated for smooth animations
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  NeutralColors,
  Spacing,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { formatReviewDate } from '@/data/mock/reviews';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Review } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface ReviewCardProps {
  review: Review;
  onPhotoPress?: (photos: string[], index: number) => void;
  testID?: string;
}

// ============================================================================
// Sub-Components
// ============================================================================

interface StarRatingProps {
  rating: number;
  size?: number;
}

function StarRating({ rating, size = 14 }: StarRatingProps) {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={size}
          color={star <= rating ? WarningColors[500] : NeutralColors[300]}
          style={styles.star}
        />
      ))}
    </View>
  );
}

interface PhotoGridProps {
  photos: string[];
  onPhotoPress?: (photos: string[], index: number) => void;
}

function PhotoGrid({ photos, onPhotoPress }: PhotoGridProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = useCallback(
    (index: number) => {
      onPhotoPress?.(photos, index);
    },
    [photos, onPhotoPress]
  );

  if (photos.length === 0) return null;

  return (
    <View style={styles.photoGrid}>
      {photos.slice(0, 3).map((photo, index) => (
        <Pressable
          key={photo}
          onPress={() => handlePress(index)}
          style={[styles.photoWrapper, { borderColor: colors.border }]}
          accessibilityLabel={`Review photo ${index + 1}`}
          accessibilityRole="button"
        >
          <Image source={{ uri: photo }} style={styles.photo} contentFit="cover" transition={200} />
          {index === 2 && photos.length > 3 && (
            <View style={styles.morePhotosOverlay}>
              <ThemedText style={styles.morePhotosText}>+{photos.length - 3}</ThemedText>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export const ReviewCard = memo(function ReviewCard({
  review,
  onPhotoPress,
  testID,
}: ReviewCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = review.comment && review.comment.length > 150;
  const displayText =
    shouldTruncate && !isExpanded ? `${review.comment?.slice(0, 150)}...` : review.comment;

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal)}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      testID={testID}
    >
      {/* Header: Avatar, Name, Rating, Date */}
      <View style={styles.header}>
        <Avatar
          source={review.userAvatar ? { uri: review.userAvatar } : undefined}
          name={review.userName}
          size={40}
        />
        <View style={styles.headerInfo}>
          <ThemedText style={[styles.userName, { color: colors.text }]}>
            {review.userName}
          </ThemedText>
          <View style={styles.ratingDateRow}>
            <StarRating rating={review.rating} />
            <ThemedText style={[styles.date, { color: colors.textTertiary }]}>
              {formatReviewDate(review.createdAt)}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Review Text */}
      {review.comment && (
        <View style={styles.commentContainer}>
          <ThemedText style={[styles.comment, { color: colors.textSecondary }]}>
            {displayText}
          </ThemedText>
          {shouldTruncate && (
            <Pressable onPress={handleToggleExpand} accessibilityRole="button">
              <ThemedText style={[styles.readMore, { color: colors.primary }]}>
                {isExpanded ? 'Show less' : 'Read more'}
              </ThemedText>
            </Pressable>
          )}
        </View>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <PhotoGrid photos={review.photos} onPhotoPress={onPhotoPress} />
      )}
    </Animated.View>
  );
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing[3],
  },
  userName: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
  },
  ratingDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[1],
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  date: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginLeft: Spacing[2],
  },
  commentContainer: {
    marginTop: Spacing[3],
  },
  comment: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight * 1.4,
  },
  readMore: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '500',
    marginTop: Spacing[1],
  },
  photoGrid: {
    flexDirection: 'row',
    marginTop: Spacing[3],
    gap: Spacing[2],
  },
  photoWrapper: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  morePhotosOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    color: '#FFFFFF',
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
  },
});
