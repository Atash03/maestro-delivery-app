/**
 * Reviews Tests
 *
 * Comprehensive tests for review-related functionality including:
 * - Mock reviews data
 * - ReviewCard component
 * - ReviewsSection component
 * - Review display on restaurant page
 * - Helper functions
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ============================================================================
// Test Data
// ============================================================================

const reviewsDataPath = resolve(__dirname, '../data/mock/reviews.ts');
const reviewCardPath = resolve(__dirname, '../components/cards/review-card.tsx');
const reviewsSectionPath = resolve(__dirname, '../components/reviews-section.tsx');
const restaurantDetailPath = resolve(__dirname, '../app/restaurant/[id].tsx');
const cardsIndexPath = resolve(__dirname, '../components/cards/index.ts');
const mockIndexPath = resolve(__dirname, '../data/mock/index.ts');

// ============================================================================
// Tests
// ============================================================================

describe('Reviews Feature', () => {
  // ==========================================================================
  // File Structure Tests
  // ==========================================================================

  describe('File Structure', () => {
    it('reviews mock data file should exist', () => {
      expect(existsSync(reviewsDataPath)).toBe(true);
    });

    it('ReviewCard component file should exist', () => {
      expect(existsSync(reviewCardPath)).toBe(true);
    });

    it('ReviewsSection component file should exist', () => {
      expect(existsSync(reviewsSectionPath)).toBe(true);
    });

    it('restaurant detail page should exist', () => {
      expect(existsSync(restaurantDetailPath)).toBe(true);
    });
  });

  // ==========================================================================
  // Mock Reviews Data Tests
  // ==========================================================================

  describe('Mock Reviews Data', () => {
    let reviewsContent: string;

    beforeAll(() => {
      reviewsContent = readFileSync(reviewsDataPath, 'utf-8');
    });

    it('should export mockReviews array', () => {
      expect(reviewsContent).toContain('export const mockReviews: Review[]');
    });

    it('should have reviews for multiple restaurants', () => {
      // Check for different restaurant IDs
      expect(reviewsContent).toContain("restaurantId: '1'");
      expect(reviewsContent).toContain("restaurantId: '2'");
      expect(reviewsContent).toContain("restaurantId: '3'");
    });

    it('should include all required review fields', () => {
      expect(reviewsContent).toContain('id:');
      expect(reviewsContent).toContain('userId:');
      expect(reviewsContent).toContain('userName:');
      expect(reviewsContent).toContain('restaurantId:');
      expect(reviewsContent).toContain('rating:');
      expect(reviewsContent).toContain('comment:');
      expect(reviewsContent).toContain('createdAt:');
    });

    it('should include reviews with photos', () => {
      expect(reviewsContent).toContain('photos:');
      expect(reviewsContent).toContain('picsum.photos');
    });

    it('should include reviews with different ratings', () => {
      expect(reviewsContent).toContain('rating: 5');
      expect(reviewsContent).toContain('rating: 4');
      expect(reviewsContent).toContain('rating: 3');
    });

    it('should have reviews with and without avatars', () => {
      expect(reviewsContent).toContain('userAvatar:');
      expect(reviewsContent).toContain('userAvatar: undefined');
    });
  });

  // ==========================================================================
  // Helper Functions Tests
  // ==========================================================================

  describe('Helper Functions', () => {
    let reviewsContent: string;

    beforeAll(() => {
      reviewsContent = readFileSync(reviewsDataPath, 'utf-8');
    });

    it('should export getReviewsByRestaurantId function', () => {
      expect(reviewsContent).toContain(
        'export function getReviewsByRestaurantId(restaurantId: string): Review[]'
      );
    });

    it('should export getReviewById function', () => {
      expect(reviewsContent).toContain(
        'export function getReviewById(reviewId: string): Review | undefined'
      );
    });

    it('should export getReviewsByUserId function', () => {
      expect(reviewsContent).toContain(
        'export function getReviewsByUserId(userId: string): Review[]'
      );
    });

    it('should export getAverageRating function', () => {
      expect(reviewsContent).toContain(
        'export function getAverageRating(restaurantId: string): number'
      );
    });

    it('should export getRatingDistribution function', () => {
      expect(reviewsContent).toContain(
        'export function getRatingDistribution(restaurantId: string): Record<number, number>'
      );
    });

    it('should export getRecentReviews function', () => {
      expect(reviewsContent).toContain(
        'export function getRecentReviews(restaurantId: string, limit: number = 3): Review[]'
      );
    });

    it('should export formatReviewDate function', () => {
      expect(reviewsContent).toContain('export function formatReviewDate(date: Date): string');
    });

    it('should export async fetch functions', () => {
      expect(reviewsContent).toContain('export async function fetchReviewsByRestaurantId');
      expect(reviewsContent).toContain('export async function fetchRecentReviews');
    });
  });

  // ==========================================================================
  // Format Review Date Tests
  // ==========================================================================

  describe('formatReviewDate Function', () => {
    let reviewsContent: string;

    beforeAll(() => {
      reviewsContent = readFileSync(reviewsDataPath, 'utf-8');
    });

    it('should handle today date', () => {
      expect(reviewsContent).toContain("'Today'");
    });

    it('should handle yesterday date', () => {
      expect(reviewsContent).toContain("'Yesterday'");
    });

    it('should handle days ago format', () => {
      expect(reviewsContent).toContain('days ago');
    });

    it('should handle weeks ago format', () => {
      expect(reviewsContent).toContain('weeks');
    });

    it('should handle months ago format', () => {
      expect(reviewsContent).toContain('months');
    });
  });

  // ==========================================================================
  // ReviewCard Component Tests
  // ==========================================================================

  describe('ReviewCard Component', () => {
    let reviewCardContent: string;

    beforeAll(() => {
      reviewCardContent = readFileSync(reviewCardPath, 'utf-8');
    });

    it('should export ReviewCard component', () => {
      expect(reviewCardContent).toContain('export function ReviewCard');
    });

    it('should export ReviewCardProps interface', () => {
      expect(reviewCardContent).toContain('export interface ReviewCardProps');
    });

    it('should accept review prop', () => {
      expect(reviewCardContent).toContain('review: Review');
    });

    it('should accept onPhotoPress callback', () => {
      expect(reviewCardContent).toContain('onPhotoPress?:');
    });

    it('should accept testID prop', () => {
      expect(reviewCardContent).toContain('testID?:');
    });

    it('should include StarRating sub-component', () => {
      expect(reviewCardContent).toContain('function StarRating');
      expect(reviewCardContent).toContain('StarRatingProps');
    });

    it('should include PhotoGrid sub-component', () => {
      expect(reviewCardContent).toContain('function PhotoGrid');
      expect(reviewCardContent).toContain('PhotoGridProps');
    });

    it('should display user avatar', () => {
      expect(reviewCardContent).toContain('Avatar');
      expect(reviewCardContent).toContain('review.userAvatar');
    });

    it('should display user name', () => {
      expect(reviewCardContent).toContain('review.userName');
    });

    it('should display rating stars', () => {
      expect(reviewCardContent).toContain('<StarRating');
      expect(reviewCardContent).toContain('rating={review.rating}');
    });

    it('should display review date', () => {
      expect(reviewCardContent).toContain('formatReviewDate(review.createdAt)');
    });

    it('should display review comment', () => {
      expect(reviewCardContent).toContain('review.comment');
    });

    it('should support text truncation with read more', () => {
      expect(reviewCardContent).toContain('isExpanded');
      expect(reviewCardContent).toContain('shouldTruncate');
      expect(reviewCardContent).toContain('Read more');
      expect(reviewCardContent).toContain('Show less');
    });

    it('should display photos', () => {
      expect(reviewCardContent).toContain('review.photos');
      expect(reviewCardContent).toContain('<PhotoGrid');
    });

    it('should use reanimated for animations', () => {
      expect(reviewCardContent).toContain('react-native-reanimated');
      expect(reviewCardContent).toContain('FadeIn');
    });

    it('should use design system tokens', () => {
      expect(reviewCardContent).toContain("from '@/constants/theme'");
      expect(reviewCardContent).toContain('BorderRadius');
      expect(reviewCardContent).toContain('Spacing');
      expect(reviewCardContent).toContain('Typography');
    });
  });

  // ==========================================================================
  // PhotoGrid Tests
  // ==========================================================================

  describe('PhotoGrid Sub-component', () => {
    let reviewCardContent: string;

    beforeAll(() => {
      reviewCardContent = readFileSync(reviewCardPath, 'utf-8');
    });

    it('should limit displayed photos', () => {
      expect(reviewCardContent).toContain('photos.slice(0, 3)');
    });

    it('should show more photos indicator', () => {
      expect(reviewCardContent).toContain('morePhotosOverlay');
      expect(reviewCardContent).toContain('+{photos.length - 3}');
    });

    it('should handle photo press', () => {
      expect(reviewCardContent).toContain('onPhotoPress');
    });

    it('should use expo-image for photos', () => {
      expect(reviewCardContent).toContain('expo-image');
      expect(reviewCardContent).toContain('<Image');
    });
  });

  // ==========================================================================
  // ReviewsSection Component Tests
  // ==========================================================================

  describe('ReviewsSection Component', () => {
    let reviewsSectionContent: string;

    beforeAll(() => {
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
    });

    it('should export ReviewsSection component', () => {
      expect(reviewsSectionContent).toContain('export function ReviewsSection');
    });

    it('should export ReviewsSectionProps interface', () => {
      expect(reviewsSectionContent).toContain('export interface ReviewsSectionProps');
    });

    it('should accept restaurantId prop', () => {
      expect(reviewsSectionContent).toContain('restaurantId: string');
    });

    it('should accept rating prop', () => {
      expect(reviewsSectionContent).toContain('rating: number');
    });

    it('should accept reviewCount prop', () => {
      expect(reviewsSectionContent).toContain('reviewCount: number');
    });

    it('should accept showRatingDistribution prop', () => {
      expect(reviewsSectionContent).toContain('showRatingDistribution?:');
    });

    it('should accept maxReviews prop', () => {
      expect(reviewsSectionContent).toContain('maxReviews?:');
    });

    it('should accept onSeeAllPress callback', () => {
      expect(reviewsSectionContent).toContain('onSeeAllPress?:');
    });

    it('should accept onPhotoPress callback', () => {
      expect(reviewsSectionContent).toContain('onPhotoPress?:');
    });

    it('should display section header', () => {
      expect(reviewsSectionContent).toContain('Reviews');
      expect(reviewsSectionContent).toContain('styles.title');
    });

    it('should display rating badge', () => {
      expect(reviewsSectionContent).toContain('ratingBadge');
      expect(reviewsSectionContent).toContain('rating.toFixed(1)');
    });

    it('should display review count', () => {
      expect(reviewsSectionContent).toContain('reviewCount');
      expect(reviewsSectionContent).toContain('reviews');
    });

    it('should fetch reviews on mount', () => {
      expect(reviewsSectionContent).toContain('useEffect');
      expect(reviewsSectionContent).toContain('fetchRecentReviews');
    });

    it('should render ReviewCard components', () => {
      expect(reviewsSectionContent).toContain('<ReviewCard');
      expect(reviewsSectionContent).toContain('review={review}');
    });
  });

  // ==========================================================================
  // Rating Distribution Tests
  // ==========================================================================

  describe('Rating Distribution', () => {
    let reviewsSectionContent: string;

    beforeAll(() => {
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
    });

    it('should include RatingBar sub-component', () => {
      expect(reviewsSectionContent).toContain('function RatingBar');
      expect(reviewsSectionContent).toContain('RatingBarProps');
    });

    it('should include RatingDistribution sub-component', () => {
      expect(reviewsSectionContent).toContain('function RatingDistribution');
      expect(reviewsSectionContent).toContain('RatingDistributionProps');
    });

    it('should display 5 rating bars', () => {
      expect(reviewsSectionContent).toContain('[5, 4, 3, 2, 1].map');
    });

    it('should show bar with percentage fill', () => {
      expect(reviewsSectionContent).toContain('ratingBarFill');
      expect(reviewsSectionContent).toContain('percentage');
    });

    it('should display count for each rating', () => {
      expect(reviewsSectionContent).toContain('count');
      expect(reviewsSectionContent).toContain('ratingBarCount');
    });
  });

  // ==========================================================================
  // Loading State Tests
  // ==========================================================================

  describe('Loading States', () => {
    let reviewsSectionContent: string;

    beforeAll(() => {
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
    });

    it('should track loading state', () => {
      expect(reviewsSectionContent).toContain('isLoading');
      expect(reviewsSectionContent).toContain('setIsLoading');
    });

    it('should include skeleton component', () => {
      expect(reviewsSectionContent).toContain('function ReviewsSkeleton');
    });

    it('should show skeleton while loading', () => {
      expect(reviewsSectionContent).toContain('<ReviewsSkeleton');
      expect(reviewsSectionContent).toContain('isLoading ?');
    });

    it('should use Skeleton component from UI library', () => {
      expect(reviewsSectionContent).toContain('Skeleton');
      expect(reviewsSectionContent).toContain("from '@/components/ui'");
    });
  });

  // ==========================================================================
  // Empty State Tests
  // ==========================================================================

  describe('Empty State', () => {
    let reviewsSectionContent: string;

    beforeAll(() => {
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
    });

    it('should include EmptyReviews component', () => {
      expect(reviewsSectionContent).toContain('function EmptyReviews');
      expect(reviewsSectionContent).toContain('EmptyReviewsProps');
    });

    it('should show empty state when no reviews', () => {
      expect(reviewsSectionContent).toContain('<EmptyReviews');
      expect(reviewsSectionContent).toContain('reviews.length > 0');
    });

    it('should display empty message', () => {
      expect(reviewsSectionContent).toContain('No reviews yet');
    });

    it('should display empty subtext', () => {
      expect(reviewsSectionContent).toContain('Be the first to review');
    });

    it('should include chatbubble icon', () => {
      expect(reviewsSectionContent).toContain('chatbubble-outline');
    });
  });

  // ==========================================================================
  // See All Button Tests
  // ==========================================================================

  describe('See All Button', () => {
    let reviewsSectionContent: string;

    beforeAll(() => {
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
    });

    it('should show see all button when more reviews exist', () => {
      expect(reviewsSectionContent).toContain('reviewCount > maxReviews');
      expect(reviewsSectionContent).toContain('seeAllButton');
    });

    it('should display see all text with count', () => {
      expect(reviewsSectionContent).toContain('See all');
      expect(reviewsSectionContent).toContain('reviewCount');
      expect(reviewsSectionContent).toContain('reviews');
    });

    it('should include chevron icon', () => {
      expect(reviewsSectionContent).toContain('chevron-forward');
    });

    it('should call onSeeAllPress when pressed', () => {
      expect(reviewsSectionContent).toContain('handleSeeAllPress');
      expect(reviewsSectionContent).toContain('onSeeAllPress');
    });
  });

  // ==========================================================================
  // Animation Tests
  // ==========================================================================

  describe('Animations', () => {
    let reviewsSectionContent: string;
    let reviewCardContent: string;

    beforeAll(() => {
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
      reviewCardContent = readFileSync(reviewCardPath, 'utf-8');
    });

    it('ReviewsSection should use FadeInUp animation', () => {
      expect(reviewsSectionContent).toContain('FadeInUp');
    });

    it('ReviewsSection should use AnimationDurations', () => {
      expect(reviewsSectionContent).toContain('AnimationDurations');
    });

    it('ReviewsSection should have staggered delays', () => {
      expect(reviewsSectionContent).toContain('.delay(100)');
      expect(reviewsSectionContent).toContain('.delay(150)');
      expect(reviewsSectionContent).toContain('.delay(200)');
    });

    it('ReviewCard should use FadeIn animation', () => {
      expect(reviewCardContent).toContain('FadeIn');
    });
  });

  // ==========================================================================
  // Restaurant Detail Integration Tests
  // ==========================================================================

  describe('Restaurant Detail Integration', () => {
    let restaurantDetailContent: string;

    beforeAll(() => {
      restaurantDetailContent = readFileSync(restaurantDetailPath, 'utf-8');
    });

    it('should import ReviewsSection component', () => {
      expect(restaurantDetailContent).toContain(
        "import { ReviewsSection } from '@/components/reviews-section'"
      );
    });

    it('should render ReviewsSection component', () => {
      expect(restaurantDetailContent).toContain('<ReviewsSection');
    });

    it('should pass restaurantId to ReviewsSection', () => {
      expect(restaurantDetailContent).toContain('restaurantId={restaurant.id}');
    });

    it('should pass rating to ReviewsSection', () => {
      expect(restaurantDetailContent).toContain('rating={restaurant.rating}');
    });

    it('should pass reviewCount to ReviewsSection', () => {
      expect(restaurantDetailContent).toContain('reviewCount={restaurant.reviewCount}');
    });

    it('should have showRatingDistribution prop', () => {
      expect(restaurantDetailContent).toContain('showRatingDistribution={true}');
    });

    it('should have maxReviews prop', () => {
      expect(restaurantDetailContent).toContain('maxReviews={3}');
    });

    it('should have testID prop', () => {
      expect(restaurantDetailContent).toContain('testID="reviews-section"');
    });

    it('should have divider before reviews section', () => {
      expect(restaurantDetailContent).toContain('Divider before Reviews');
    });

    it('should animate reviews section appearance', () => {
      expect(restaurantDetailContent).toContain('FadeInUp.delay(450)');
    });
  });

  // ==========================================================================
  // Exports Tests
  // ==========================================================================

  describe('Exports', () => {
    let cardsIndexContent: string;
    let mockIndexContent: string;

    beforeAll(() => {
      cardsIndexContent = readFileSync(cardsIndexPath, 'utf-8');
      mockIndexContent = readFileSync(mockIndexPath, 'utf-8');
    });

    it('ReviewCard should be exported from cards index', () => {
      expect(cardsIndexContent).toContain('export { ReviewCard, type ReviewCardProps }');
      expect(cardsIndexContent).toContain("from './review-card'");
    });

    it('mock reviews should be exported from mock index', () => {
      expect(mockIndexContent).toContain('mockReviews');
      expect(mockIndexContent).toContain("from './reviews'");
    });

    it('review helper functions should be exported from mock index', () => {
      expect(mockIndexContent).toContain('getReviewsByRestaurantId');
      expect(mockIndexContent).toContain('getReviewById');
      expect(mockIndexContent).toContain('getReviewsByUserId');
      expect(mockIndexContent).toContain('getAverageRating');
      expect(mockIndexContent).toContain('getRatingDistribution');
      expect(mockIndexContent).toContain('getRecentReviews');
      expect(mockIndexContent).toContain('formatReviewDate');
    });

    it('async fetch functions should be exported from mock index', () => {
      expect(mockIndexContent).toContain('fetchReviewsByRestaurantId');
      expect(mockIndexContent).toContain('fetchRecentReviews');
    });
  });

  // ==========================================================================
  // Accessibility Tests
  // ==========================================================================

  describe('Accessibility', () => {
    let reviewCardContent: string;
    let reviewsSectionContent: string;

    beforeAll(() => {
      reviewCardContent = readFileSync(reviewCardPath, 'utf-8');
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
    });

    it('ReviewCard should have photo accessibility labels', () => {
      expect(reviewCardContent).toContain('accessibilityLabel');
      expect(reviewCardContent).toContain('Review photo');
    });

    it('ReviewCard should have accessibility role for pressables', () => {
      expect(reviewCardContent).toContain('accessibilityRole="button"');
    });

    it('ReviewsSection should have see all accessibility label', () => {
      expect(reviewsSectionContent).toContain('accessibilityLabel="See all reviews"');
    });

    it('ReviewsSection should have accessibility role for see all button', () => {
      expect(reviewsSectionContent).toContain('accessibilityRole="button"');
    });
  });

  // ==========================================================================
  // Styling Tests
  // ==========================================================================

  describe('Styling', () => {
    let reviewCardContent: string;
    let reviewsSectionContent: string;

    beforeAll(() => {
      reviewCardContent = readFileSync(reviewCardPath, 'utf-8');
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
    });

    it('ReviewCard should use StyleSheet', () => {
      expect(reviewCardContent).toContain('StyleSheet.create');
    });

    it('ReviewsSection should use StyleSheet', () => {
      expect(reviewsSectionContent).toContain('StyleSheet.create');
    });

    it('ReviewCard should use theme colors', () => {
      expect(reviewCardContent).toContain('Colors[colorScheme');
      expect(reviewCardContent).toContain('colors.text');
      expect(reviewCardContent).toContain('colors.card');
      expect(reviewCardContent).toContain('colors.border');
    });

    it('ReviewsSection should use theme colors', () => {
      expect(reviewsSectionContent).toContain('Colors[colorScheme');
      expect(reviewsSectionContent).toContain('colors.text');
      expect(reviewsSectionContent).toContain('colors.primary');
    });

    it('should use WarningColors for stars', () => {
      expect(reviewCardContent).toContain('WarningColors[500]');
      expect(reviewsSectionContent).toContain('WarningColors[500]');
    });
  });

  // ==========================================================================
  // Type Safety Tests
  // ==========================================================================

  describe('Type Safety', () => {
    let reviewCardContent: string;
    let reviewsSectionContent: string;
    let reviewsDataContent: string;

    beforeAll(() => {
      reviewCardContent = readFileSync(reviewCardPath, 'utf-8');
      reviewsSectionContent = readFileSync(reviewsSectionPath, 'utf-8');
      reviewsDataContent = readFileSync(reviewsDataPath, 'utf-8');
    });

    it('ReviewCard should import Review type', () => {
      expect(reviewCardContent).toContain("import type { Review } from '@/types'");
    });

    it('ReviewsSection should import Review type', () => {
      expect(reviewsSectionContent).toContain("import type { Review } from '@/types'");
    });

    it('mock reviews should import Review type', () => {
      expect(reviewsDataContent).toContain("import type { Review } from '@/types'");
    });

    it('ReviewCard should use typed props', () => {
      expect(reviewCardContent).toContain('review: Review');
    });

    it('ReviewsSection should use typed state', () => {
      expect(reviewsSectionContent).toContain('useState<Review[]>');
    });
  });
});
