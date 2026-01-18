/**
 * Issue Details Form Screen
 *
 * Allows users to provide detailed information about their issue:
 * - Category selection (pre-filled from navigation)
 * - Item selection checkbox list (for missing/wrong items)
 * - Description text area
 * - Photo upload (up to 3 photos)
 * - Submit button with loading state
 */

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  Spacing,
  Typography,
} from '@/constants/theme';
import { getOrderById } from '@/data/mock/orders';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { CartItem, IssueCategory, Order } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const MAX_PHOTOS = 3;
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_DESCRIPTION_LENGTH = 10;

const CATEGORY_TITLES: Record<IssueCategory, string> = {
  missing_items: 'Missing Items',
  wrong_items: 'Wrong Items',
  food_quality: 'Food Quality',
  late_delivery: 'Late Delivery',
  order_never_arrived: 'Order Never Arrived',
  other: 'Other Issue',
};

const CATEGORY_DESCRIPTIONS: Record<IssueCategory, string> = {
  missing_items: 'Select the items that were missing from your order',
  wrong_items: 'Select the items that were incorrect',
  food_quality: 'Describe the quality issue with your food',
  late_delivery: 'Tell us about your late delivery experience',
  order_never_arrived: 'Provide details about your missing order',
  other: 'Describe your issue in detail',
};

// ============================================================================
// Item Checkbox Component
// ============================================================================

interface ItemCheckboxProps {
  item: CartItem;
  isSelected: boolean;
  onToggle: () => void;
}

function ItemCheckbox({ item, isSelected, onToggle }: ItemCheckboxProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.itemCheckbox,
          {
            backgroundColor: isSelected ? colors.primaryLight : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${item.menuItem.name}, quantity ${item.quantity}`}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: isSelected ? colors.primary : 'transparent',
              borderColor: isSelected ? colors.primary : colors.border,
            },
          ]}
        >
          {isSelected && (
            <Animated.View entering={FadeIn.duration(AnimationDurations.fast)}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </Animated.View>
          )}
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
            {item.menuItem.name}
          </Text>
          <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>
            Qty: {item.quantity}
          </Text>
        </View>
        <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>
          ${item.totalPrice.toFixed(2)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// Photo Picker Component
// ============================================================================

interface PhotoPickerProps {
  photos: string[];
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
}

function PhotoPicker({ photos, onAddPhoto, onRemovePhoto }: PhotoPickerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <Animated.View
      entering={FadeInDown.delay(400).duration(AnimationDurations.normal)}
      style={styles.photoSection}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Photos (Optional)</Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
        Share photos to help us understand the issue ({photos.length}/{MAX_PHOTOS})
      </Text>

      <View style={styles.photosContainer}>
        {photos.map((uri, index) => (
          <Animated.View
            key={uri}
            entering={FadeIn.duration(AnimationDurations.fast)}
            exiting={FadeOut.duration(AnimationDurations.fast)}
            style={styles.photoWrapper}
          >
            <Image
              source={{ uri }}
              style={styles.photo}
              resizeMode="cover"
              accessibilityLabel={`Uploaded photo ${index + 1}`}
            />
            <Pressable
              onPress={() => onRemovePhoto(index)}
              style={[styles.removePhotoButton, { backgroundColor: colors.error }]}
              accessibilityLabel={`Remove photo ${index + 1}`}
              accessibilityRole="button"
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </Pressable>
          </Animated.View>
        ))}

        {canAddMore && (
          <Pressable
            onPress={onAddPhoto}
            style={[styles.addPhotoButton, { borderColor: colors.border }]}
            accessibilityLabel="Add photo"
            accessibilityRole="button"
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
// Main Issue Details Form Screen
// ============================================================================

export default function IssueDetailsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderId, category } = useLocalSearchParams<{
    orderId: string;
    category: IssueCategory;
  }>();

  // State
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Determine if item selection is needed
  const showItemSelection = category === 'missing_items' || category === 'wrong_items';

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const fetchedOrder = getOrderById(orderId || '');
      setOrder(fetchedOrder || null);
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  // Validation
  const isDescriptionValid = description.trim().length >= MIN_DESCRIPTION_LENGTH;
  const hasRequiredItems = !showItemSelection || selectedItems.length > 0;
  const canSubmit = isDescriptionValid && hasRequiredItems && !isSubmitting;

  const validationMessage = useMemo(() => {
    if (showItemSelection && selectedItems.length === 0) {
      return 'Please select at least one item';
    }
    if (description.trim().length === 0) {
      return 'Please describe your issue';
    }
    if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
      return `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
    }
    return null;
  }, [showItemSelection, selectedItems.length, description]);

  // Handlers
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleToggleItem = useCallback((itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const handleAddPhoto = useCallback(async () => {
    if (photos.length >= MAX_PHOTOS) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to add photos.',
        [{ text: 'OK' }]
      );
      return;
    }

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

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !order || !category) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock issue ID
    const issueId = `issue_${Date.now()}`;

    setIsSubmitting(false);

    // Navigate to issue status screen
    router.replace({
      pathname: '/support/issue/status/[issueId]',
      params: { issueId },
    } as never);
  }, [canSubmit, order, category, router]);

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
          <Pressable
            onPress={handleGoBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Issue Details</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Animated.View
            entering={FadeIn.duration(AnimationDurations.normal)}
            style={[styles.loadingSpinner, { borderColor: colors.primary }]}
          />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (!order || !category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
          <Pressable
            onPress={handleGoBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Issue Details</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <View style={[styles.errorIconContainer, { backgroundColor: colors.errorLight }]}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Something Went Wrong</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            We couldn't load the issue details. Please try again.
          </Text>
          <Pressable
            onPress={handleGoBack}
            style={[styles.errorButton, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
        <Pressable
          onPress={handleGoBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Issue Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + Spacing[24] },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category Badge */}
          <Animated.View entering={FadeInDown.delay(100).duration(AnimationDurations.normal)}>
            <Card variant="outlined" padding="md" radius="lg">
              <View style={styles.categoryBadgeContainer}>
                <View style={[styles.categoryIconBadge, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="alert-circle" size={20} color={colors.primary} />
                </View>
                <View style={styles.categoryBadgeText}>
                  <Text style={[styles.categoryTitle, { color: colors.text }]}>
                    {CATEGORY_TITLES[category]}
                  </Text>
                  <Text style={[styles.categorySubtitle, { color: colors.textSecondary }]}>
                    {CATEGORY_DESCRIPTIONS[category]}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Item Selection (for missing/wrong items) */}
          {showItemSelection && (
            <Animated.View entering={FadeInDown.delay(200).duration(AnimationDurations.normal)}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Select Affected Items
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Choose the items that were {category === 'missing_items' ? 'missing' : 'wrong'}
              </Text>

              <View style={styles.itemsContainer}>
                {order.items.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInDown.delay(250 + index * 50).duration(
                      AnimationDurations.normal
                    )}
                  >
                    <ItemCheckbox
                      item={item}
                      isSelected={selectedItems.includes(item.id)}
                      onToggle={() => handleToggleItem(item.id)}
                    />
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Description */}
          <Animated.View
            entering={FadeInDown.delay(showItemSelection ? 350 : 200).duration(
              AnimationDurations.normal
            )}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Describe Your Issue</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Please provide details about what happened
            </Text>

            <View
              style={[
                styles.textAreaContainer,
                {
                  backgroundColor: colors.background,
                  borderColor:
                    description.length > 0 && !isDescriptionValid ? colors.error : colors.border,
                },
              ]}
            >
              <TextInput
                style={[styles.textArea, { color: colors.text }]}
                placeholder="Tell us what went wrong..."
                placeholderTextColor={colors.textTertiary}
                multiline
                maxLength={MAX_DESCRIPTION_LENGTH}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
                accessibilityLabel="Issue description"
                accessibilityHint={`Enter a description of at least ${MIN_DESCRIPTION_LENGTH} characters`}
              />
            </View>
            <View style={styles.characterCount}>
              <Text
                style={[
                  styles.characterCountText,
                  {
                    color:
                      description.length > 0 && !isDescriptionValid
                        ? colors.error
                        : colors.textTertiary,
                  },
                ]}
              >
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </Text>
            </View>
          </Animated.View>

          {/* Photo Upload */}
          <PhotoPicker
            photos={photos}
            onAddPhoto={handleAddPhoto}
            onRemovePhoto={handleRemovePhoto}
          />

          {/* Validation Message */}
          {validationMessage && (
            <Animated.View
              entering={FadeIn.duration(AnimationDurations.fast)}
              style={[styles.validationMessage, { backgroundColor: colors.warningLight }]}
            >
              <Ionicons name="information-circle" size={18} color={colors.warning} />
              <Text style={[styles.validationText, { color: colors.warning }]}>
                {validationMessage}
              </Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Submit Button */}
        <View
          style={[
            styles.bottomContainer,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + Spacing[4],
              borderTopColor: colors.border,
            },
          ]}
        >
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[
              styles.submitButton,
              {
                backgroundColor: canSubmit ? colors.primary : colors.primaryLight,
                opacity: canSubmit ? 1 : 0.6,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Submit issue report"
            accessibilityState={{ disabled: !canSubmit }}
          >
            {isSubmitting ? (
              <Animated.View
                entering={FadeIn.duration(AnimationDurations.fast)}
                style={[styles.submitSpinner, { borderColor: '#FFFFFF' }]}
              />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Report</Text>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
  backButton: {
    padding: Spacing[1],
  },
  headerTitle: {
    ...Typography.xl,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    gap: Spacing[5],
  },

  // Category Badge
  categoryBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  categoryIconBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadgeText: {
    flex: 1,
  },
  categoryTitle: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  categorySubtitle: {
    ...Typography.sm,
  },

  // Section styles
  sectionTitle: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[1],
  },
  sectionSubtitle: {
    ...Typography.sm,
    marginBottom: Spacing[3],
  },

  // Item selection
  itemsContainer: {
    gap: Spacing[2],
  },
  itemCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing[3],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...Typography.base,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  itemQuantity: {
    ...Typography.sm,
  },
  itemPrice: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },

  // Description
  textAreaContainer: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    minHeight: 140,
    padding: Spacing[3],
  },
  textArea: {
    ...Typography.base,
    flex: 1,
    minHeight: 120,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: Spacing[1],
  },
  characterCountText: {
    ...Typography.xs,
  },

  // Photo section
  photoSection: {
    gap: Spacing[1],
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
    width: 88,
    height: 88,
    borderRadius: BorderRadius.lg,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[1],
  },
  addPhotoText: {
    ...Typography.xs,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },

  // Validation message
  validationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
  },
  validationText: {
    ...Typography.sm,
    flex: 1,
  },

  // Bottom container
  bottomContainer: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3.5] || Spacing[4],
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
    minHeight: 52,
  },
  submitButtonText: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    color: '#FFFFFF',
  },
  submitSpinner: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderTopColor: 'transparent',
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[4],
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderTopColor: 'transparent',
  },
  loadingText: {
    ...Typography.base,
  },

  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    gap: Spacing[3],
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  errorTitle: {
    ...Typography.xl,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    textAlign: 'center',
  },
  errorText: {
    ...Typography.base,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  errorButton: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing[2],
  },
  errorButtonText: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    color: '#FFFFFF',
  },
});

// Export for testing
export {
  CATEGORY_TITLES,
  CATEGORY_DESCRIPTIONS,
  MAX_PHOTOS,
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
};
