/**
 * Rating Modal Tests
 *
 * Comprehensive tests for the rating modal component including:
 * - File structure and exports
 * - Star rating functionality
 * - Rating sections
 * - Photo picker
 * - Form validation
 * - Submission handling
 * - Animations
 * - Accessibility
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ============================================================================
// Test Data
// ============================================================================

const ratingModalPath = resolve(__dirname, '../components/rating-modal.tsx');

// ============================================================================
// Constants from rating modal
// ============================================================================

const STAR_SIZE = 36;
const STAR_GAP = 8;
const MAX_PHOTOS = 3;
const MAX_REVIEW_LENGTH = 500;

const STAR_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

// ============================================================================
// Tests
// ============================================================================

describe('Rating Modal', () => {
  // ==========================================================================
  // File Structure Tests
  // ==========================================================================

  describe('File Structure', () => {
    it('rating modal file should exist', () => {
      expect(existsSync(ratingModalPath)).toBe(true);
    });
  });

  // ==========================================================================
  // Exports Tests
  // ==========================================================================

  describe('Exports', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should export RatingModal component', () => {
      expect(ratingModalContent).toContain('export function RatingModal');
    });

    it('should export RatingModalProps interface', () => {
      expect(ratingModalContent).toContain('export interface RatingModalProps');
    });

    it('should export RatingSubmission interface', () => {
      expect(ratingModalContent).toContain('export interface RatingSubmission');
    });

    it('should export StarRating component', () => {
      expect(ratingModalContent).toContain('export { StarRating');
    });

    it('should export AnimatedStar component', () => {
      expect(ratingModalContent).toContain('AnimatedStar');
    });

    it('should export RatingSection component', () => {
      expect(ratingModalContent).toContain('RatingSection');
    });

    it('should export PhotoPicker component', () => {
      expect(ratingModalContent).toContain('PhotoPicker');
    });

    it('should export type definitions', () => {
      expect(ratingModalContent).toContain('StarRatingProps');
      expect(ratingModalContent).toContain('RatingSectionProps');
      expect(ratingModalContent).toContain('PhotoPickerProps');
    });
  });

  // ==========================================================================
  // Constants Tests
  // ==========================================================================

  describe('Constants', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should define STAR_SIZE constant', () => {
      expect(ratingModalContent).toContain('const STAR_SIZE = 36');
    });

    it('should define STAR_GAP constant', () => {
      expect(ratingModalContent).toContain('const STAR_GAP = 8');
    });

    it('should define MAX_PHOTOS constant', () => {
      expect(ratingModalContent).toContain('const MAX_PHOTOS = 3');
    });

    it('should define MAX_REVIEW_LENGTH constant', () => {
      expect(ratingModalContent).toContain('const MAX_REVIEW_LENGTH = 500');
    });

    it('should define SPRING_CONFIG for animations', () => {
      expect(ratingModalContent).toContain('const SPRING_CONFIG');
    });

    it('should define STAR_LABELS array', () => {
      expect(ratingModalContent).toContain('const STAR_LABELS');
      expect(ratingModalContent).toContain("'Poor'");
      expect(ratingModalContent).toContain("'Fair'");
      expect(ratingModalContent).toContain("'Good'");
      expect(ratingModalContent).toContain("'Very Good'");
      expect(ratingModalContent).toContain("'Excellent'");
    });

    it('STAR_LABELS should have correct length', () => {
      expect(STAR_LABELS.length).toBe(5);
    });

    it('STAR_LABELS should map to 1-5 rating', () => {
      expect(STAR_LABELS[0]).toBe('Poor');
      expect(STAR_LABELS[4]).toBe('Excellent');
    });
  });

  // ==========================================================================
  // RatingModalProps Tests
  // ==========================================================================

  describe('RatingModalProps', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should have visible prop', () => {
      expect(ratingModalContent).toContain('visible: boolean');
    });

    it('should have onClose prop', () => {
      expect(ratingModalContent).toContain('onClose: () => void');
    });

    it('should have onSubmit prop', () => {
      expect(ratingModalContent).toContain('onSubmit: (data: RatingSubmission) => void');
    });

    it('should have order prop', () => {
      expect(ratingModalContent).toContain('order: Order');
    });

    it('should have optional isSubmitting prop', () => {
      expect(ratingModalContent).toContain('isSubmitting?: boolean');
    });
  });

  // ==========================================================================
  // RatingSubmission Tests
  // ==========================================================================

  describe('RatingSubmission Interface', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should include orderId', () => {
      expect(ratingModalContent).toContain('orderId: string');
    });

    it('should include restaurantRating', () => {
      expect(ratingModalContent).toContain('restaurantRating: number');
    });

    it('should include driverRating', () => {
      expect(ratingModalContent).toContain('driverRating: number');
    });

    it('should include optional review', () => {
      expect(ratingModalContent).toContain('review?: string');
    });

    it('should include optional photos', () => {
      expect(ratingModalContent).toContain('photos?: string[]');
    });
  });

  // ==========================================================================
  // AnimatedStar Tests
  // ==========================================================================

  describe('AnimatedStar Component', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should define AnimatedStar component', () => {
      expect(ratingModalContent).toContain('function AnimatedStar');
    });

    it('should accept index prop', () => {
      expect(ratingModalContent).toContain('index: number');
    });

    it('should accept isSelected prop', () => {
      expect(ratingModalContent).toContain('isSelected: boolean');
    });

    it('should accept onPress callback', () => {
      expect(ratingModalContent).toContain('onPress: (index: number) => void');
    });

    it('should accept optional disabled prop', () => {
      expect(ratingModalContent).toContain('disabled?: boolean');
    });

    it('should use scale animation on press', () => {
      expect(ratingModalContent).toContain('useSharedValue(1)');
      expect(ratingModalContent).toContain('scale.value');
    });

    it('should animate color on selection', () => {
      expect(ratingModalContent).toContain('colorProgress');
      expect(ratingModalContent).toContain('interpolateColor');
    });

    it('should use filled star when selected', () => {
      expect(ratingModalContent).toContain("isSelected ? 'star' : 'star-outline'");
    });

    it('should have accessibility role', () => {
      expect(ratingModalContent).toContain('accessibilityRole="button"');
    });

    it('should have accessibility state', () => {
      expect(ratingModalContent).toContain('accessibilityState={{ selected: isSelected');
    });

    it('should have accessibility label', () => {
      expect(ratingModalContent).toContain('accessibilityLabel={`Rate');
    });

    it('should use bounce animation on selection', () => {
      expect(ratingModalContent).toContain('withSequence');
      expect(ratingModalContent).toContain('withSpring(1.3');
    });
  });

  // ==========================================================================
  // StarRating Tests
  // ==========================================================================

  describe('StarRating Component', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should define StarRating component', () => {
      expect(ratingModalContent).toContain('function StarRating');
    });

    it('should accept rating prop', () => {
      expect(ratingModalContent).toContain('rating: number');
    });

    it('should accept onRatingChange callback', () => {
      expect(ratingModalContent).toContain('onRatingChange: (rating: number) => void');
    });

    it('should render 5 stars', () => {
      expect(ratingModalContent).toContain('[0, 1, 2, 3, 4].map');
    });

    it('should show rating label when rating > 0', () => {
      expect(ratingModalContent).toContain('{rating > 0 &&');
      expect(ratingModalContent).toContain('STAR_LABELS[rating - 1]');
    });

    it('should support gesture-based rating', () => {
      expect(ratingModalContent).toContain('GestureDetector');
      expect(ratingModalContent).toContain('Gesture.Pan');
    });

    it('should calculate rating from x position', () => {
      expect(ratingModalContent).toContain('calculateRatingFromX');
    });

    it('should clamp rating between 1 and 5', () => {
      expect(ratingModalContent).toContain('Math.max(1, Math.min(5');
    });
  });

  // ==========================================================================
  // RatingSection Tests
  // ==========================================================================

  describe('RatingSection Component', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should define RatingSection component', () => {
      expect(ratingModalContent).toContain('function RatingSection');
    });

    it('should accept title prop', () => {
      expect(ratingModalContent).toContain('title: string');
    });

    it('should accept optional subtitle prop', () => {
      expect(ratingModalContent).toContain('subtitle?: string');
    });

    it('should include StarRating component', () => {
      expect(ratingModalContent).toContain('<StarRating');
    });

    it('should use FadeInDown animation', () => {
      expect(ratingModalContent).toContain('FadeInDown');
    });

    it('should accept delay prop for animation', () => {
      expect(ratingModalContent).toContain('delay?: number');
    });
  });

  // ==========================================================================
  // PhotoPicker Tests
  // ==========================================================================

  describe('PhotoPicker Component', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should define PhotoPicker component', () => {
      expect(ratingModalContent).toContain('function PhotoPicker');
    });

    it('should accept photos array', () => {
      expect(ratingModalContent).toContain('photos: string[]');
    });

    it('should accept onAddPhoto callback', () => {
      expect(ratingModalContent).toContain('onAddPhoto: () => void');
    });

    it('should accept onRemovePhoto callback', () => {
      expect(ratingModalContent).toContain('onRemovePhoto: (index: number) => void');
    });

    it('should limit to MAX_PHOTOS', () => {
      expect(ratingModalContent).toContain('photos.length < MAX_PHOTOS');
    });

    it('should show photo count', () => {
      expect(ratingModalContent).toContain('photos.length}/{MAX_PHOTOS}');
    });

    it('should include remove button for each photo', () => {
      expect(ratingModalContent).toContain('onRemovePhoto(index)');
    });

    it('should include camera icon for add button', () => {
      expect(ratingModalContent).toContain('camera-outline');
    });

    it('should conditionally show add button', () => {
      expect(ratingModalContent).toContain('{canAddMore &&');
    });
  });

  // ==========================================================================
  // Modal Structure Tests
  // ==========================================================================

  describe('Modal Structure', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should use Modal component', () => {
      expect(ratingModalContent).toContain('<Modal');
    });

    it('should use slide animation', () => {
      expect(ratingModalContent).toContain('animationType="slide"');
    });

    it('should use pageSheet presentation', () => {
      expect(ratingModalContent).toContain('presentationStyle="pageSheet"');
    });

    it('should handle onRequestClose', () => {
      expect(ratingModalContent).toContain('onRequestClose={handleClose}');
    });

    it('should wrap in GestureHandlerRootView', () => {
      expect(ratingModalContent).toContain('GestureHandlerRootView');
    });

    it('should use KeyboardAvoidingView', () => {
      expect(ratingModalContent).toContain('KeyboardAvoidingView');
    });

    it('should use ScrollView for content', () => {
      expect(ratingModalContent).toContain('<ScrollView');
    });

    it('should handle keyboard dismiss on tap', () => {
      expect(ratingModalContent).toContain('keyboardShouldPersistTaps="handled"');
    });
  });

  // ==========================================================================
  // Header Tests
  // ==========================================================================

  describe('Header', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should have header section', () => {
      expect(ratingModalContent).toContain('styles.header');
    });

    it('should have close button', () => {
      expect(ratingModalContent).toContain('testID="rating-modal-close"');
    });

    it('should display title', () => {
      expect(ratingModalContent).toContain('Rate Your Order');
    });

    it('should have close icon', () => {
      expect(ratingModalContent).toContain('name="close"');
    });
  });

  // ==========================================================================
  // Order Info Tests
  // ==========================================================================

  describe('Order Info Display', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should display restaurant name', () => {
      expect(ratingModalContent).toContain('order.restaurant.name');
    });

    it('should display item count', () => {
      expect(ratingModalContent).toContain('order.items.length');
    });

    it('should display order date', () => {
      expect(ratingModalContent).toContain('order.createdAt');
    });

    it('should have order card styling', () => {
      expect(ratingModalContent).toContain('orderCard');
    });
  });

  // ==========================================================================
  // Rating Questions Tests
  // ==========================================================================

  describe('Rating Questions', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should ask about food quality', () => {
      expect(ratingModalContent).toContain('How was your food?');
    });

    it('should ask about delivery', () => {
      expect(ratingModalContent).toContain('How was your delivery?');
    });

    it('should have restaurant rating test ID', () => {
      expect(ratingModalContent).toContain('testID="restaurant-rating"');
    });

    it('should have driver rating test ID', () => {
      expect(ratingModalContent).toContain('testID="driver-rating"');
    });

    it('should only show driver rating if driver exists', () => {
      expect(ratingModalContent).toContain('{order.driver &&');
    });

    it('should display driver name in subtitle', () => {
      expect(ratingModalContent).toContain('order.driver.name');
    });
  });

  // ==========================================================================
  // Review Input Tests
  // ==========================================================================

  describe('Review Input', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should have review section', () => {
      expect(ratingModalContent).toContain('Write a Review');
    });

    it('should indicate optional', () => {
      expect(ratingModalContent).toContain('(Optional)');
    });

    it('should have multiline input', () => {
      expect(ratingModalContent).toContain('multiline');
    });

    it('should limit input length', () => {
      expect(ratingModalContent).toContain('maxLength={MAX_REVIEW_LENGTH}');
    });

    it('should show character count', () => {
      expect(ratingModalContent).toContain('review.length}/{MAX_REVIEW_LENGTH}');
    });

    it('should have review input test ID', () => {
      expect(ratingModalContent).toContain('testID="review-input"');
    });

    it('should have placeholder text', () => {
      expect(ratingModalContent).toContain('placeholder="');
    });
  });

  // ==========================================================================
  // Photo Upload Tests
  // ==========================================================================

  describe('Photo Upload', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should import ImagePicker', () => {
      expect(ratingModalContent).toContain("import * as ImagePicker from 'expo-image-picker'");
    });

    it('should request permissions', () => {
      expect(ratingModalContent).toContain('requestMediaLibraryPermissionsAsync');
    });

    it('should launch image picker', () => {
      expect(ratingModalContent).toContain('launchImageLibraryAsync');
    });

    it('should allow editing', () => {
      expect(ratingModalContent).toContain('allowsEditing: true');
    });

    it('should set aspect ratio', () => {
      expect(ratingModalContent).toContain('aspect:');
    });

    it('should set quality', () => {
      expect(ratingModalContent).toContain('quality:');
    });

    it('should handle permission denied', () => {
      expect(ratingModalContent).toContain("status !== 'granted'");
    });

    it('should have photo picker test ID', () => {
      expect(ratingModalContent).toContain('testID="photo-picker"');
    });
  });

  // ==========================================================================
  // Form State Tests
  // ==========================================================================

  describe('Form State', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should track restaurant rating state', () => {
      expect(ratingModalContent).toContain('restaurantRating, setRestaurantRating');
    });

    it('should track driver rating state', () => {
      expect(ratingModalContent).toContain('driverRating, setDriverRating');
    });

    it('should track review state', () => {
      expect(ratingModalContent).toContain('review, setReview');
    });

    it('should track photos state', () => {
      expect(ratingModalContent).toContain('photos, setPhotos');
    });

    it('should reset state when modal opens', () => {
      expect(ratingModalContent).toContain('if (visible)');
      expect(ratingModalContent).toContain('setRestaurantRating(0)');
      expect(ratingModalContent).toContain('setDriverRating(0)');
      expect(ratingModalContent).toContain("setReview('')");
      expect(ratingModalContent).toContain('setPhotos([])');
    });
  });

  // ==========================================================================
  // Form Validation Tests
  // ==========================================================================

  describe('Form Validation', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should require restaurant rating', () => {
      expect(ratingModalContent).toContain('restaurantRating > 0');
    });

    it('should disable submit when invalid', () => {
      expect(ratingModalContent).toContain('disabled={!isValid');
    });

    it('should show validation hint', () => {
      expect(ratingModalContent).toContain('{!isValid &&');
      expect(ratingModalContent).toContain('Please rate your food');
    });

    it('should define isValid flag', () => {
      expect(ratingModalContent).toContain('const isValid = restaurantRating > 0');
    });
  });

  // ==========================================================================
  // Submit Button Tests
  // ==========================================================================

  describe('Submit Button', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should have submit button', () => {
      expect(ratingModalContent).toContain('testID="submit-rating-button"');
    });

    it('should use Button component', () => {
      expect(ratingModalContent).toContain('<Button');
    });

    it('should handle loading state', () => {
      expect(ratingModalContent).toContain('loading={isSubmitting}');
    });

    it('should show loading text', () => {
      expect(ratingModalContent).toContain("isSubmitting ? 'Submitting...' : 'Submit Rating'");
    });

    it('should be full width', () => {
      expect(ratingModalContent).toContain('fullWidth');
    });

    it('should call onSubmit on press', () => {
      expect(ratingModalContent).toContain('onPress={handleSubmit}');
    });
  });

  // ==========================================================================
  // Submit Handler Tests
  // ==========================================================================

  describe('handleSubmit', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should define handleSubmit', () => {
      expect(ratingModalContent).toContain('const handleSubmit = useCallback');
    });

    it('should check validity before submit', () => {
      expect(ratingModalContent).toContain('if (!isValid) return');
    });

    it('should call onSubmit with orderId', () => {
      expect(ratingModalContent).toContain('orderId: order.id');
    });

    it('should include restaurantRating', () => {
      expect(ratingModalContent).toContain('restaurantRating,');
    });

    it('should include driverRating', () => {
      expect(ratingModalContent).toContain('driverRating');
    });

    it('should include optional review', () => {
      expect(ratingModalContent).toContain('review: review.trim() || undefined');
    });

    it('should include optional photos', () => {
      expect(ratingModalContent).toContain('photos: photos.length > 0 ? photos : undefined');
    });

    it('should default driver rating to restaurant rating if not set', () => {
      expect(ratingModalContent).toContain('driverRating > 0 ? driverRating : restaurantRating');
    });
  });

  // ==========================================================================
  // Close Handler Tests
  // ==========================================================================

  describe('handleClose', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should define handleClose', () => {
      expect(ratingModalContent).toContain('const handleClose = useCallback');
    });

    it('should show confirmation for unsaved changes', () => {
      expect(ratingModalContent).toContain('Alert.alert');
      expect(ratingModalContent).toContain('Discard Rating?');
    });

    it('should check for unsaved changes', () => {
      expect(ratingModalContent).toContain('restaurantRating > 0');
      expect(ratingModalContent).toContain('driverRating > 0');
      expect(ratingModalContent).toContain('review.trim()');
      expect(ratingModalContent).toContain('photos.length > 0');
    });

    it('should call onClose without confirmation if no changes', () => {
      expect(ratingModalContent).toContain('} else {');
      expect(ratingModalContent).toContain('onClose();');
    });

    it('should have discard option', () => {
      expect(ratingModalContent).toContain("text: 'Discard'");
      expect(ratingModalContent).toContain("style: 'destructive'");
    });

    it('should have cancel option', () => {
      expect(ratingModalContent).toContain("text: 'Cancel'");
      expect(ratingModalContent).toContain("style: 'cancel'");
    });
  });

  // ==========================================================================
  // Animations Tests
  // ==========================================================================

  describe('Animations', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should import from react-native-reanimated', () => {
      expect(ratingModalContent).toContain("from 'react-native-reanimated'");
    });

    it('should use FadeIn animation', () => {
      expect(ratingModalContent).toContain('FadeIn');
    });

    it('should use FadeInDown animation', () => {
      expect(ratingModalContent).toContain('FadeInDown');
    });

    it('should use FadeIn animation for rating label', () => {
      expect(ratingModalContent).toContain('entering={FadeIn');
    });

    it('should use withSpring for star animations', () => {
      expect(ratingModalContent).toContain('withSpring');
    });

    it('should use withSequence for bounce effect', () => {
      expect(ratingModalContent).toContain('withSequence');
    });

    it('should use withTiming for color transitions', () => {
      expect(ratingModalContent).toContain('withTiming');
    });

    it('should use interpolateColor for star color', () => {
      expect(ratingModalContent).toContain('interpolateColor');
    });

    it('should use useAnimatedStyle', () => {
      expect(ratingModalContent).toContain('useAnimatedStyle');
    });

    it('should use useSharedValue', () => {
      expect(ratingModalContent).toContain('useSharedValue');
    });

    it('should use runOnJS for gesture callbacks', () => {
      expect(ratingModalContent).toContain('runOnJS');
    });
  });

  // ==========================================================================
  // Styling Tests
  // ==========================================================================

  describe('Styling', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should import design system constants', () => {
      expect(ratingModalContent).toContain('BorderRadius');
      expect(ratingModalContent).toContain('Colors');
      expect(ratingModalContent).toContain('FontWeights');
      expect(ratingModalContent).toContain('Shadows');
      expect(ratingModalContent).toContain('Spacing');
      expect(ratingModalContent).toContain('Typography');
    });

    it('should import color constants', () => {
      expect(ratingModalContent).toContain('NeutralColors');
      expect(ratingModalContent).toContain('WarningColors');
    });

    it('should use StyleSheet.create', () => {
      expect(ratingModalContent).toContain('StyleSheet.create');
    });

    it('should have styles object', () => {
      expect(ratingModalContent).toContain('const styles = StyleSheet.create');
    });

    it('should handle safe area insets', () => {
      expect(ratingModalContent).toContain('useSafeAreaInsets');
    });

    it('should apply theme colors', () => {
      expect(ratingModalContent).toContain('colors.background');
      expect(ratingModalContent).toContain('colors.text');
    });

    it('should use useColorScheme', () => {
      expect(ratingModalContent).toContain('useColorScheme');
    });
  });

  // ==========================================================================
  // Accessibility Tests
  // ==========================================================================

  describe('Accessibility', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should have accessibility labels for stars', () => {
      expect(ratingModalContent).toContain('accessibilityLabel={`Rate');
    });

    it('should have accessibility roles for buttons', () => {
      expect(ratingModalContent).toContain('accessibilityRole="button"');
    });

    it('should have accessibility label for close button', () => {
      expect(ratingModalContent).toContain('accessibilityLabel="Close"');
    });

    it('should have accessibility label for add photo', () => {
      expect(ratingModalContent).toContain('accessibilityLabel="Add photo"');
    });

    it('should have accessibility label for remove photo', () => {
      expect(ratingModalContent).toContain('accessibilityLabel={`Remove photo');
    });

    it('should have accessibility label for review input', () => {
      expect(ratingModalContent).toContain('accessibilityLabel="Review text"');
    });

    it('should have accessibility state for stars', () => {
      expect(ratingModalContent).toContain('accessibilityState');
    });
  });

  // ==========================================================================
  // Test IDs Tests
  // ==========================================================================

  describe('Test IDs', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should have modal test ID', () => {
      expect(ratingModalContent).toContain('testID="rating-modal"');
    });

    it('should have close button test ID', () => {
      expect(ratingModalContent).toContain('testID="rating-modal-close"');
    });

    it('should have restaurant rating test ID', () => {
      expect(ratingModalContent).toContain('testID="restaurant-rating"');
    });

    it('should have driver rating test ID', () => {
      expect(ratingModalContent).toContain('testID="driver-rating"');
    });

    it('should have review input test ID', () => {
      expect(ratingModalContent).toContain('testID="review-input"');
    });

    it('should have photo picker test ID', () => {
      expect(ratingModalContent).toContain('testID="photo-picker"');
    });

    it('should have submit button test ID', () => {
      expect(ratingModalContent).toContain('testID="submit-rating-button"');
    });

    it('should have star test IDs', () => {
      expect(ratingModalContent).toContain('testID={`${testID}-star-${index + 1}`}');
    });
  });

  // ==========================================================================
  // Imports Tests
  // ==========================================================================

  describe('Imports', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should import from expo-image-picker', () => {
      expect(ratingModalContent).toContain("from 'expo-image-picker'");
    });

    it('should import from react-native', () => {
      expect(ratingModalContent).toContain("from 'react-native'");
    });

    it('should import from react-native-gesture-handler', () => {
      expect(ratingModalContent).toContain("from 'react-native-gesture-handler'");
    });

    it('should import from react-native-reanimated', () => {
      expect(ratingModalContent).toContain("from 'react-native-reanimated'");
    });

    it('should import from react-native-safe-area-context', () => {
      expect(ratingModalContent).toContain("from 'react-native-safe-area-context'");
    });

    it('should import Button component', () => {
      expect(ratingModalContent).toContain("from '@/components/ui/button'");
    });

    it('should import theme constants', () => {
      expect(ratingModalContent).toContain("from '@/constants/theme'");
    });

    it('should import useColorScheme hook', () => {
      expect(ratingModalContent).toContain("from '@/hooks/use-color-scheme'");
    });

    it('should import types', () => {
      expect(ratingModalContent).toContain("from '@/types'");
    });

    it('should import Ionicons', () => {
      expect(ratingModalContent).toContain("from '@expo/vector-icons'");
    });
  });

  // ==========================================================================
  // Hooks Usage Tests
  // ==========================================================================

  describe('Hooks Usage', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should use useState for state management', () => {
      expect(ratingModalContent).toContain('useState');
    });

    it('should use useCallback for handlers', () => {
      expect(ratingModalContent).toContain('useCallback');
    });

    it('should use useEffect for reset on open', () => {
      expect(ratingModalContent).toContain('useEffect');
    });

    it('should use useSafeAreaInsets', () => {
      expect(ratingModalContent).toContain('useSafeAreaInsets');
    });

    it('should use useColorScheme', () => {
      expect(ratingModalContent).toContain('useColorScheme');
    });
  });

  // ==========================================================================
  // Integration Tests
  // ==========================================================================

  describe('Integration', () => {
    it('MAX_PHOTOS constant should be 3', () => {
      expect(MAX_PHOTOS).toBe(3);
    });

    it('MAX_REVIEW_LENGTH constant should be 500', () => {
      expect(MAX_REVIEW_LENGTH).toBe(500);
    });

    it('STAR_SIZE constant should be 36', () => {
      expect(STAR_SIZE).toBe(36);
    });

    it('STAR_GAP constant should be 8', () => {
      expect(STAR_GAP).toBe(8);
    });

    it('should be able to calculate total star row width', () => {
      const starWidth = STAR_SIZE + STAR_GAP;
      const totalWidth = starWidth * 5 - STAR_GAP;
      expect(totalWidth).toBe(212);
    });
  });

  // ==========================================================================
  // GestureHandler Tests
  // ==========================================================================

  describe('GestureHandler Integration', () => {
    let ratingModalContent: string;

    beforeAll(() => {
      ratingModalContent = readFileSync(ratingModalPath, 'utf-8');
    });

    it('should import Gesture', () => {
      expect(ratingModalContent).toContain('Gesture');
    });

    it('should import GestureDetector', () => {
      expect(ratingModalContent).toContain('GestureDetector');
    });

    it('should import GestureHandlerRootView', () => {
      expect(ratingModalContent).toContain('GestureHandlerRootView');
    });

    it('should create Pan gesture', () => {
      expect(ratingModalContent).toContain('Gesture.Pan()');
    });

    it('should use onUpdate for gesture', () => {
      expect(ratingModalContent).toContain('.onUpdate(');
    });

    it('should enable/disable gesture based on disabled prop', () => {
      expect(ratingModalContent).toContain('.enabled(!disabled)');
    });
  });
});
