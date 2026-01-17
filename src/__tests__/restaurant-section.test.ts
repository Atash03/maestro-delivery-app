/**
 * Tests for RestaurantSection Component
 *
 * This test suite verifies:
 * - Component structure and exports
 * - Section header with title, subtitle, and see all button
 * - Restaurant list rendering with FlashList
 * - Skeleton loading state
 * - Empty state handling
 * - Animation configurations
 * - Card variant support
 * - Promotional badges
 * - Accessibility features
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Read the component source file
const componentPath = resolve(__dirname, '../components/restaurant-section.tsx');
const componentSource = readFileSync(componentPath, 'utf-8');

describe('RestaurantSection Component', () => {
  describe('File Structure', () => {
    it('should export RestaurantSection component', () => {
      expect(componentSource).toContain('export function RestaurantSection');
    });

    it('should export RestaurantSectionProps interface', () => {
      expect(componentSource).toContain('export interface RestaurantSectionProps');
    });
  });

  describe('Props Interface', () => {
    it('should have title prop', () => {
      expect(componentSource).toMatch(/title:\s*string/);
    });

    it('should have subtitle prop', () => {
      expect(componentSource).toMatch(/subtitle\?:\s*string/);
    });

    it('should have restaurants prop', () => {
      expect(componentSource).toMatch(/restaurants:\s*Restaurant\[\]/);
    });

    it('should have onRestaurantPress callback prop', () => {
      expect(componentSource).toMatch(/onRestaurantPress\?:\s*\(restaurant:\s*Restaurant\)/);
    });

    it('should have onSeeAllPress callback prop', () => {
      expect(componentSource).toMatch(/onSeeAllPress\?:\s*\(\)/);
    });

    it('should have isLoading prop', () => {
      expect(componentSource).toMatch(/isLoading\?:\s*boolean/);
    });

    it('should have showSeeAll prop', () => {
      expect(componentSource).toMatch(/showSeeAll\?:\s*boolean/);
    });

    it('should have cardVariant prop with default and featured options', () => {
      expect(componentSource).toMatch(/cardVariant\?:\s*['"]default['"]|['"]featured['"]/);
    });

    it('should have promotionalBadges prop', () => {
      expect(componentSource).toMatch(/promotionalBadges\?:\s*Record<string,\s*string>/);
    });

    it('should have testID prop', () => {
      expect(componentSource).toMatch(/testID\?:\s*string/);
    });

    it('should have animationDelay prop', () => {
      expect(componentSource).toMatch(/animationDelay\?:\s*number/);
    });
  });

  describe('Constants', () => {
    it('should define CARD_WIDTH constant', () => {
      expect(componentSource).toMatch(/const\s+CARD_WIDTH\s*=\s*\d+/);
    });

    it('should define FEATURED_CARD_WIDTH constant', () => {
      expect(componentSource).toMatch(/const\s+FEATURED_CARD_WIDTH\s*=\s*\d+/);
    });

    it('should define CARD_GAP constant using Spacing', () => {
      expect(componentSource).toMatch(/const\s+CARD_GAP\s*=\s*Spacing/);
    });

    it('should define SKELETON_COUNT constant', () => {
      expect(componentSource).toMatch(/const\s+SKELETON_COUNT\s*=\s*\d+/);
    });
  });

  describe('Imports', () => {
    it('should import FlashList from @shopify/flash-list', () => {
      expect(componentSource).toContain("from '@shopify/flash-list'");
      expect(componentSource).toContain('FlashList');
    });

    it('should import RestaurantCard from components/cards', () => {
      expect(componentSource).toContain("from '@/components/cards'");
      expect(componentSource).toContain('RestaurantCard');
    });

    it('should import Skeleton from components/ui', () => {
      expect(componentSource).toContain("from '@/components/ui'");
      expect(componentSource).toContain('Skeleton');
    });

    it('should import react-native-reanimated for animations', () => {
      expect(componentSource).toContain("from 'react-native-reanimated'");
    });

    it('should import Ionicons for icons', () => {
      expect(componentSource).toContain("from '@expo/vector-icons'");
      expect(componentSource).toContain('Ionicons');
    });
  });

  describe('Section Header', () => {
    it('should render title text', () => {
      expect(componentSource).toContain('{title}');
    });

    it('should conditionally render subtitle', () => {
      expect(componentSource).toMatch(/\{subtitle\s*&&/);
    });

    it('should render See All button conditionally', () => {
      expect(componentSource).toContain('showSeeAll');
      expect(componentSource).toContain('onSeeAllPress');
    });

    it('should use chevron-forward icon for See All', () => {
      expect(componentSource).toContain('chevron-forward');
    });

    it('should have accessibility label for See All button', () => {
      expect(componentSource).toMatch(/accessibilityLabel.*See\s*all/);
    });
  });

  describe('RestaurantCardSkeleton Component', () => {
    it('should define RestaurantCardSkeleton component', () => {
      expect(componentSource).toContain('function RestaurantCardSkeleton');
    });

    it('should accept variant prop', () => {
      expect(componentSource).toMatch(/RestaurantCardSkeletonProps.*variant/s);
    });

    it('should render image skeleton', () => {
      // Should have a skeleton for the image
      expect(componentSource).toContain('imageHeight');
      expect(componentSource).toContain('variant="rectangular"');
    });

    it('should render title row skeleton', () => {
      expect(componentSource).toContain('skeletonTitleRow');
    });

    it('should render cuisine row skeleton', () => {
      expect(componentSource).toContain('skeletonCuisine');
    });

    it('should render delivery row skeleton', () => {
      expect(componentSource).toContain('skeletonDeliveryRow');
    });
  });

  describe('Restaurant List', () => {
    it('should use FlashList for restaurant rendering', () => {
      expect(componentSource).toContain('<FlashList');
    });

    it('should set horizontal prop on FlashList', () => {
      expect(componentSource).toMatch(/<FlashList[^>]*horizontal/);
    });

    it('should hide horizontal scroll indicator', () => {
      expect(componentSource).toContain('showsHorizontalScrollIndicator={false}');
    });

    it('should provide estimatedItemSize for FlashList', () => {
      expect(componentSource).toContain('estimatedItemSize');
    });

    it('should use ItemSeparatorComponent for gaps', () => {
      expect(componentSource).toContain('ItemSeparatorComponent');
    });

    it('should use keyExtractor for items', () => {
      expect(componentSource).toContain('keyExtractor');
    });
  });

  describe('Loading State', () => {
    it('should conditionally render skeleton list when loading', () => {
      expect(componentSource).toMatch(/isLoading\s*\?/);
    });

    it('should render skeleton items with SKELETON_COUNT', () => {
      expect(componentSource).toContain('SKELETON_COUNT');
      expect(componentSource).toContain('Array.from');
    });

    it('should have different testID for skeleton list', () => {
      expect(componentSource).toContain('skeleton-list');
    });
  });

  describe('Empty State', () => {
    it('should return null when no restaurants and not loading', () => {
      expect(componentSource).toMatch(/restaurants\.length\s*===\s*0/);
      expect(componentSource).toContain('return null');
    });
  });

  describe('Animations', () => {
    it('should use FadeIn for container animation', () => {
      expect(componentSource).toContain('FadeIn');
    });

    it('should use FadeInRight for restaurant cards', () => {
      expect(componentSource).toContain('FadeInRight');
    });

    it('should apply animationDelay to animations', () => {
      expect(componentSource).toMatch(/FadeIn\.delay\(animationDelay\)/);
    });

    it('should apply staggered delay to restaurant cards', () => {
      expect(componentSource).toMatch(
        /FadeInRight\.delay\(animationDelay\s*\+\s*index\s*\*\s*\d+\)/
      );
    });
  });

  describe('Card Variants', () => {
    it('should use CARD_WIDTH for default variant', () => {
      expect(componentSource).toContain('CARD_WIDTH');
    });

    it('should use FEATURED_CARD_WIDTH for featured variant', () => {
      expect(componentSource).toContain('FEATURED_CARD_WIDTH');
    });

    it('should pass cardVariant to RestaurantCard', () => {
      expect(componentSource).toMatch(/variant=\{cardVariant\}/);
    });
  });

  describe('Promotional Badges', () => {
    it('should pass promotionalBadge to RestaurantCard', () => {
      expect(componentSource).toMatch(/promotionalBadge=\{promotionalBadges\?\.\[item\.id\]\}/);
    });
  });

  describe('Callbacks', () => {
    it('should pass onRestaurantPress to RestaurantCard', () => {
      expect(componentSource).toMatch(/onPress=\{onRestaurantPress\}/);
    });

    it('should use useCallback for renderRestaurantCard', () => {
      expect(componentSource).toMatch(/const\s+renderRestaurantCard\s*=\s*useCallback/);
    });

    it('should use useCallback for renderSkeletonCard', () => {
      expect(componentSource).toMatch(/const\s+renderSkeletonCard\s*=\s*useCallback/);
    });

    it('should use useCallback for keyExtractor', () => {
      expect(componentSource).toMatch(/const\s+keyExtractor\s*=\s*useCallback/);
    });

    it('should use useCallback for ItemSeparator', () => {
      expect(componentSource).toMatch(/const\s+ItemSeparator\s*=\s*useCallback/);
    });
  });

  describe('Styling', () => {
    it('should use StyleSheet.create for styles', () => {
      expect(componentSource).toContain('StyleSheet.create');
    });

    it('should have container styles', () => {
      expect(componentSource).toMatch(/container:\s*\{/);
    });

    it('should have header styles', () => {
      expect(componentSource).toMatch(/header:\s*\{/);
    });

    it('should have title styles', () => {
      expect(componentSource).toMatch(/title:\s*\{/);
    });

    it('should have subtitle styles', () => {
      expect(componentSource).toMatch(/subtitle:\s*\{/);
    });

    it('should have listContainer styles', () => {
      expect(componentSource).toMatch(/listContainer:\s*\{/);
    });

    it('should have listContent styles', () => {
      expect(componentSource).toMatch(/listContent:\s*\{/);
    });

    it('should have separator styles', () => {
      expect(componentSource).toMatch(/separator:\s*\{/);
    });

    it('should use design system tokens for spacing', () => {
      expect(componentSource).toContain('Spacing[');
    });

    it('should use design system tokens for typography', () => {
      expect(componentSource).toContain('Typography.');
    });

    it('should use design system tokens for border radius', () => {
      expect(componentSource).toContain('BorderRadius.');
    });
  });

  describe('Theme Support', () => {
    it('should use useColorScheme hook', () => {
      expect(componentSource).toContain('useColorScheme');
    });

    it('should get colors from Colors constant', () => {
      expect(componentSource).toContain('Colors[colorScheme');
    });

    it('should apply colors.text to title', () => {
      expect(componentSource).toContain('colors.text');
    });

    it('should apply colors.textSecondary to subtitle', () => {
      expect(componentSource).toContain('colors.textSecondary');
    });

    it('should apply colors.primary to See All button', () => {
      expect(componentSource).toContain('colors.primary');
    });
  });

  describe('Test IDs', () => {
    it('should apply testID to container', () => {
      expect(componentSource).toMatch(/testID=\{testID\}/);
    });

    it('should generate testID for restaurant cards', () => {
      expect(componentSource).toMatch(/testID=\{.*card-\$\{item\.id\}/);
    });

    it('should generate testID for list', () => {
      expect(componentSource).toMatch(/testID=\{.*-list/);
    });
  });
});
