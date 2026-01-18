/**
 * Rating Modal Component
 *
 * A modal for rating restaurant food and driver delivery experience.
 * Features:
 * - Star rating (1-5) with tap and animated selection
 * - "How was your food?" - Restaurant rating
 * - "How was your delivery?" - Driver rating
 * - Optional text review
 * - Optional photo upload (up to 3 photos)
 * - Animated star selection with scale and color transitions
 * - Swipe gestures for star selection
 */

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInDown,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  NeutralColors,
  Shadows,
  Spacing,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Order } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const STAR_SIZE = 36;
const STAR_GAP = 8;
const MAX_PHOTOS = 3;
const MAX_REVIEW_LENGTH = 500;

const SPRING_CONFIG = {
  damping: 12,
  stiffness: 200,
  mass: 0.5,
};

// Star labels for accessibility and UI feedback
const STAR_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

// ============================================================================
// Sub-Components
// ============================================================================

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
  testID?: string;
}

/**
 * Animated star component for individual star rendering
 */
interface AnimatedStarProps {
  index: number;
  isSelected: boolean;
  onPress: (index: number) => void;
  disabled?: boolean;
  testID?: string;
}

function AnimatedStar({ index, isSelected, onPress, disabled = false, testID }: AnimatedStarProps) {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(isSelected ? 1 : 0);

  // Update color progress when selection changes
  useEffect(() => {
    colorProgress.value = withTiming(isSelected ? 1 : 0, {
      duration: AnimationDurations.fast,
    });
  }, [isSelected, colorProgress]);

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(1.2, SPRING_CONFIG);
    }
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      // Bounce animation on selection
      scale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 400 }),
        withSpring(1, SPRING_CONFIG)
      );
      onPress(index + 1);
    }
  }, [disabled, scale, onPress, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const starColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorProgress.value,
      [0, 1],
      [NeutralColors[300], WarningColors[400]]
    );
    return { color };
  });

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Rate ${index + 1} star${index > 0 ? 's' : ''}`}
      accessibilityState={{ selected: isSelected }}
      testID={testID}
    >
      <Animated.View style={animatedStyle}>
        <Animated.Text style={[styles.starIcon, starColorStyle]}>
          <Ionicons name={isSelected ? 'star' : 'star-outline'} size={STAR_SIZE} />
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Star rating component with gesture support
 */
function StarRating({ rating, onRatingChange, disabled = false, testID }: StarRatingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Calculate rating from gesture x position
  const calculateRatingFromX = useCallback((x: number) => {
    const starWidth = STAR_SIZE + STAR_GAP;
    const totalWidth = starWidth * 5 - STAR_GAP;
    const clampedX = Math.max(0, Math.min(x, totalWidth));
    const newRating = Math.ceil((clampedX / totalWidth) * 5);
    return Math.max(1, Math.min(5, newRating));
  }, []);

  // Pan gesture for swiping across stars
  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      const newRating = calculateRatingFromX(event.x);
      runOnJS(onRatingChange)(newRating);
    })
    .minDistance(0);

  return (
    <View style={styles.starRatingContainer}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.starsRow} testID={testID}>
          {[0, 1, 2, 3, 4].map((index) => (
            <AnimatedStar
              key={index}
              index={index}
              isSelected={index < rating}
              onPress={onRatingChange}
              disabled={disabled}
              testID={`${testID}-star-${index + 1}`}
            />
          ))}
        </View>
      </GestureDetector>
      {rating > 0 && (
        <Animated.Text
          entering={FadeIn.duration(AnimationDurations.fast)}
          style={[styles.ratingLabel, { color: colors.textSecondary }]}
        >
          {STAR_LABELS[rating - 1]}
        </Animated.Text>
      )}
    </View>
  );
}

interface RatingSectionProps {
  title: string;
  subtitle?: string;
  rating: number;
  onRatingChange: (rating: number) => void;
  colors: (typeof Colors)['light'];
  delay?: number;
  testID?: string;
}

/**
 * Rating section with title, stars, and optional subtitle
 */
function RatingSection({
  title,
  subtitle,
  rating,
  onRatingChange,
  colors,
  delay = 0,
  testID,
}: RatingSectionProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(delay)}
      style={styles.ratingSection}
    >
      <Text style={[styles.ratingSectionTitle, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.ratingSectionSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      <StarRating rating={rating} onRatingChange={onRatingChange} testID={testID} />
    </Animated.View>
  );
}

interface PhotoPickerProps {
  photos: string[];
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
  colors: (typeof Colors)['light'];
  testID?: string;
}

/**
 * Photo picker component for adding review photos
 */
function PhotoPicker({ photos, onAddPhoto, onRemovePhoto, colors, testID }: PhotoPickerProps) {
  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(300)}
      style={styles.photoSection}
    >
      <Text style={[styles.photoSectionTitle, { color: colors.text }]}>Add Photos (Optional)</Text>
      <Text style={[styles.photoSectionSubtitle, { color: colors.textSecondary }]}>
        Share photos of your order ({photos.length}/{MAX_PHOTOS})
      </Text>

      <View style={styles.photosContainer} testID={testID}>
        {/* Existing photos */}
        {photos.map((uri, index) => (
          <Animated.View
            key={uri}
            entering={FadeIn.duration(AnimationDurations.fast)}
            style={styles.photoWrapper}
          >
            <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
            <Pressable
              onPress={() => onRemovePhoto(index)}
              style={[styles.removePhotoButton, { backgroundColor: colors.error }]}
              accessibilityLabel={`Remove photo ${index + 1}`}
              accessibilityRole="button"
              testID={`${testID}-remove-${index}`}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </Pressable>
          </Animated.View>
        ))}

        {/* Add photo button */}
        {canAddMore && (
          <Pressable
            onPress={onAddPhoto}
            style={[styles.addPhotoButton, { borderColor: colors.border }]}
            accessibilityLabel="Add photo"
            accessibilityRole="button"
            testID={`${testID}-add`}
          >
            <Ionicons name="camera-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>Add</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export interface RatingModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when rating is submitted */
  onSubmit: (data: RatingSubmission) => void;
  /** The order being rated */
  order: Order;
  /** Whether submission is in progress */
  isSubmitting?: boolean;
}

export interface RatingSubmission {
  orderId: string;
  restaurantRating: number;
  driverRating: number;
  review?: string;
  photos?: string[];
}

export function RatingModal({
  visible,
  onClose,
  onSubmit,
  order,
  isSubmitting = false,
}: RatingModalProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Rating state
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Reset state when modal opens with a new order
  // biome-ignore lint/correctness/useExhaustiveDependencies: order.id triggers reset when order changes
  useEffect(() => {
    if (visible) {
      setRestaurantRating(0);
      setDriverRating(0);
      setReview('');
      setPhotos([]);
    }
  }, [visible, order.id]);

  // Check if form is valid (at least restaurant rating)
  const isValid = restaurantRating > 0;

  // Handle photo picker
  const handleAddPhoto = useCallback(async () => {
    if (photos.length >= MAX_PHOTOS) return;

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to add photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  }, [photos.length]);

  // Handle photo removal
  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Handle submission
  const handleSubmit = useCallback(() => {
    if (!isValid) return;

    onSubmit({
      orderId: order.id,
      restaurantRating,
      driverRating: driverRating > 0 ? driverRating : restaurantRating, // Default to restaurant rating if not rated
      review: review.trim() || undefined,
      photos: photos.length > 0 ? photos : undefined,
    });
  }, [isValid, onSubmit, order.id, restaurantRating, driverRating, review, photos]);

  // Handle close with confirmation if there are unsaved changes
  const handleClose = useCallback(() => {
    if (restaurantRating > 0 || driverRating > 0 || review.trim() || photos.length > 0) {
      Alert.alert('Discard Rating?', 'You have unsaved changes. Are you sure you want to close?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onClose },
      ]);
    } else {
      onClose();
    }
  }, [restaurantRating, driverRating, review, photos.length, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
      testID="rating-modal"
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
              accessibilityLabel="Close"
              accessibilityRole="button"
              testID="rating-modal-close"
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Rate Your Order</Text>
            <View style={styles.headerSpacer} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoid}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Order info */}
              <Animated.View
                entering={FadeInDown.duration(AnimationDurations.normal)}
                style={[styles.orderCard, { backgroundColor: colors.card, ...Shadows.sm }]}
              >
                <Text style={[styles.orderRestaurant, { color: colors.text }]}>
                  {order.restaurant.name}
                </Text>
                <Text style={[styles.orderItemCount, { color: colors.textSecondary }]}>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} •{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </Animated.View>

              {/* Restaurant rating */}
              <RatingSection
                title="How was your food?"
                subtitle="Rate the quality and taste of your order"
                rating={restaurantRating}
                onRatingChange={setRestaurantRating}
                colors={colors}
                delay={100}
                testID="restaurant-rating"
              />

              {/* Driver rating (only if driver was assigned) */}
              {order.driver && (
                <RatingSection
                  title="How was your delivery?"
                  subtitle={`Rate ${order.driver.name}'s delivery service`}
                  rating={driverRating}
                  onRatingChange={setDriverRating}
                  colors={colors}
                  delay={200}
                  testID="driver-rating"
                />
              )}

              {/* Review text input */}
              <Animated.View
                entering={FadeInDown.duration(AnimationDurations.normal).delay(250)}
                style={styles.reviewSection}
              >
                <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>
                  Write a Review (Optional)
                </Text>
                <Text style={[styles.reviewSectionSubtitle, { color: colors.textSecondary }]}>
                  Share details about your experience
                </Text>
                <TextInput
                  value={review}
                  onChangeText={setReview}
                  placeholder="What did you like or dislike about your order?"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={4}
                  maxLength={MAX_REVIEW_LENGTH}
                  style={[
                    styles.reviewInput,
                    {
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  accessibilityLabel="Review text"
                  testID="review-input"
                />
                <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                  {review.length}/{MAX_REVIEW_LENGTH}
                </Text>
              </Animated.View>

              {/* Photo picker */}
              <PhotoPicker
                photos={photos}
                onAddPhoto={handleAddPhoto}
                onRemovePhoto={handleRemovePhoto}
                colors={colors}
                testID="photo-picker"
              />
            </ScrollView>

            {/* Submit button */}
            <Animated.View
              entering={FadeInDown.duration(AnimationDurations.normal).delay(350)}
              style={[
                styles.submitContainer,
                {
                  backgroundColor: colors.background,
                  borderTopColor: colors.divider,
                  paddingBottom: insets.bottom + Spacing[4],
                },
              ]}
            >
              <Button
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                fullWidth
                testID="submit-rating-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
              {!isValid && (
                <Text style={[styles.validationHint, { color: colors.textSecondary }]}>
                  Please rate your food to continue
                </Text>
              )}
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

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
    paddingVertical: Spacing[3],
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
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  headerSpacer: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing[4],
    gap: Spacing[5],
  },
  orderCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
  },
  orderRestaurant: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[1],
  },
  orderItemCount: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  ratingSection: {
    gap: Spacing[2],
  },
  ratingSectionTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  ratingSectionSubtitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  starRatingContainer: {
    alignItems: 'center',
    gap: Spacing[2],
    marginTop: Spacing[2],
  },
  starsRow: {
    flexDirection: 'row',
    gap: STAR_GAP,
  },
  starIcon: {
    lineHeight: STAR_SIZE + 4,
  },
  ratingLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  reviewSection: {
    gap: Spacing[2],
  },
  reviewSectionTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  reviewSectionSubtitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: Spacing[2],
  },
  charCount: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    textAlign: 'right',
  },
  photoSection: {
    gap: Spacing[2],
  },
  photoSectionTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  photoSectionSubtitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    marginTop: Spacing[2],
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1],
  },
  addPhotoText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  submitContainer: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
  },
  validationHint: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    textAlign: 'center',
    marginTop: Spacing[2],
  },
});

// ============================================================================
// Exports
// ============================================================================

export { StarRating, AnimatedStar, RatingSection, PhotoPicker };
export type { StarRatingProps, RatingSectionProps, PhotoPickerProps };
