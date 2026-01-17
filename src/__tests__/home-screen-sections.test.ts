/**
 * Tests for Home Screen Sections (Task 2.5)
 *
 * This test suite verifies:
 * - Home screen structure with all required sections
 * - Featured Restaurants carousel
 * - Popular Near You section
 * - Quick Bites section
 * - New on Maestro section
 * - Pull-to-refresh functionality
 * - Skeleton loading state
 * - Category filtering
 * - Navigation handlers
 * - Empty state handling
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Read the home screen source file
const homeScreenPath = resolve(__dirname, '../app/(tabs)/index.tsx');
const homeScreenSource = readFileSync(homeScreenPath, 'utf-8');

describe('Home Screen Sections', () => {
  describe('File Structure', () => {
    it('should export default HomeScreen component', () => {
      expect(homeScreenSource).toContain('export default function HomeScreen');
    });
  });

  describe('Imports', () => {
    it('should import RestaurantSection component', () => {
      expect(homeScreenSource).toContain("from '@/components/restaurant-section'");
      expect(homeScreenSource).toContain('RestaurantSection');
    });

    it('should import CustomRefreshControl component', () => {
      expect(homeScreenSource).toContain("from '@/components/custom-refresh-control'");
      expect(homeScreenSource).toContain('CustomRefreshControl');
    });

    it('should import useHomeData hook', () => {
      expect(homeScreenSource).toContain("from '@/hooks/use-home-data'");
      expect(homeScreenSource).toContain('useHomeData');
    });

    it('should import ScrollView from react-native', () => {
      expect(homeScreenSource).toContain("from 'react-native'");
      expect(homeScreenSource).toContain('ScrollView');
    });

    it('should import router from expo-router', () => {
      expect(homeScreenSource).toContain("from 'expo-router'");
      expect(homeScreenSource).toContain('router');
    });
  });

  describe('useHomeData Hook Usage', () => {
    it('should destructure featuredRestaurants from useHomeData', () => {
      expect(homeScreenSource).toContain('featuredRestaurants');
    });

    it('should destructure popularRestaurants from useHomeData', () => {
      expect(homeScreenSource).toContain('popularRestaurants');
    });

    it('should destructure quickBitesRestaurants from useHomeData', () => {
      expect(homeScreenSource).toContain('quickBitesRestaurants');
    });

    it('should destructure newRestaurants from useHomeData', () => {
      expect(homeScreenSource).toContain('newRestaurants');
    });

    it('should destructure isLoading from useHomeData', () => {
      expect(homeScreenSource).toContain('isLoading');
    });

    it('should destructure isRefreshing from useHomeData', () => {
      expect(homeScreenSource).toContain('isRefreshing');
    });

    it('should destructure refresh from useHomeData', () => {
      expect(homeScreenSource).toContain('refresh');
    });

    it('should destructure filterByCategory from useHomeData', () => {
      expect(homeScreenSource).toContain('filterByCategory');
    });

    it('should pass selectedCategory to useHomeData', () => {
      expect(homeScreenSource).toMatch(/useHomeData\(\{[\s\S]*selectedCategory/);
    });
  });

  describe('Featured Restaurants Section', () => {
    it('should render RestaurantSection for featured restaurants', () => {
      expect(homeScreenSource).toContain('title="Featured Restaurants"');
    });

    it('should have subtitle for featured section', () => {
      expect(homeScreenSource).toContain('subtitle="Handpicked by our team"');
    });

    it('should pass featuredRestaurants to RestaurantSection', () => {
      expect(homeScreenSource).toMatch(/restaurants=\{featuredRestaurants\}/);
    });

    it('should use featured cardVariant for featured section', () => {
      expect(homeScreenSource).toMatch(/cardVariant="featured"/);
    });

    it('should pass promotionalBadges to featured section', () => {
      expect(homeScreenSource).toMatch(/promotionalBadges=\{PROMOTIONAL_BADGES\}/);
    });

    it('should have testID for featured section', () => {
      expect(homeScreenSource).toContain('testID="featured-section"');
    });
  });

  describe('Popular Near You Section', () => {
    it('should render RestaurantSection for popular restaurants', () => {
      expect(homeScreenSource).toContain('title="Popular Near You"');
    });

    it('should have subtitle for popular section', () => {
      expect(homeScreenSource).toContain('subtitle="Based on orders in your area"');
    });

    it('should pass popularRestaurants to RestaurantSection', () => {
      expect(homeScreenSource).toMatch(/restaurants=\{popularRestaurants\}/);
    });

    it('should have testID for popular section', () => {
      expect(homeScreenSource).toContain('testID="popular-section"');
    });
  });

  describe('Quick Bites Section', () => {
    it('should render RestaurantSection for quick bites', () => {
      expect(homeScreenSource).toContain('title="Quick Bites"');
    });

    it('should have subtitle for quick bites section', () => {
      expect(homeScreenSource).toContain('subtitle="Delivered in 30 min or less"');
    });

    it('should pass quickBitesRestaurants to RestaurantSection', () => {
      expect(homeScreenSource).toMatch(/restaurants=\{quickBitesRestaurants\}/);
    });

    it('should have testID for quick bites section', () => {
      expect(homeScreenSource).toContain('testID="quick-bites-section"');
    });
  });

  describe('New on Maestro Section', () => {
    it('should render RestaurantSection for new restaurants', () => {
      expect(homeScreenSource).toContain('title="New on Maestro"');
    });

    it('should have subtitle for new section', () => {
      expect(homeScreenSource).toContain('subtitle="Recently added restaurants"');
    });

    it('should pass newRestaurants to RestaurantSection', () => {
      expect(homeScreenSource).toMatch(/restaurants=\{newRestaurants\}/);
    });

    it('should have testID for new section', () => {
      expect(homeScreenSource).toContain('testID="new-section"');
    });
  });

  describe('Pull-to-Refresh', () => {
    it('should use ScrollView as main container', () => {
      expect(homeScreenSource).toContain('<ScrollView');
    });

    it('should have refreshControl prop on ScrollView', () => {
      expect(homeScreenSource).toContain('refreshControl=');
    });

    it('should use CustomRefreshControl for refresh', () => {
      expect(homeScreenSource).toContain('<CustomRefreshControl');
    });

    it('should pass isRefreshing to CustomRefreshControl', () => {
      expect(homeScreenSource).toMatch(/refreshing=\{isRefreshing\}/);
    });

    it('should pass refresh callback to CustomRefreshControl', () => {
      expect(homeScreenSource).toMatch(/onRefresh=\{refresh\}/);
    });

    it('should have testID for refresh control', () => {
      expect(homeScreenSource).toContain('testID="home-refresh-control"');
    });
  });

  describe('Loading State', () => {
    it('should pass isLoading to all RestaurantSections', () => {
      // Should appear 4 times (once for each section)
      const matches = homeScreenSource.match(/isLoading=\{isLoading\}/g);
      expect(matches).not.toBeNull();
      expect(matches?.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Navigation Handlers', () => {
    it('should define handleRestaurantPress callback', () => {
      expect(homeScreenSource).toMatch(/const\s+handleRestaurantPress\s*=\s*useCallback/);
    });

    it('should navigate to restaurant detail on press', () => {
      expect(homeScreenSource).toMatch(/router\.push\(\{[\s\S]*pathname:.*restaurant/);
    });

    it('should pass restaurant id as route param', () => {
      expect(homeScreenSource).toMatch(/params:\s*\{\s*id:\s*restaurant\.id\s*\}/);
    });

    it('should define handleSeeAllFeatured callback', () => {
      expect(homeScreenSource).toMatch(/const\s+handleSeeAllFeatured\s*=\s*useCallback/);
    });

    it('should define handleSeeAllPopular callback', () => {
      expect(homeScreenSource).toMatch(/const\s+handleSeeAllPopular\s*=\s*useCallback/);
    });

    it('should define handleSeeAllQuickBites callback', () => {
      expect(homeScreenSource).toMatch(/const\s+handleSeeAllQuickBites\s*=\s*useCallback/);
    });

    it('should define handleSeeAllNew callback', () => {
      expect(homeScreenSource).toMatch(/const\s+handleSeeAllNew\s*=\s*useCallback/);
    });

    it('should pass handleRestaurantPress to all sections', () => {
      expect(homeScreenSource).toMatch(/onRestaurantPress=\{handleRestaurantPress\}/);
    });

    it('should pass handleSeeAllFeatured to featured section', () => {
      expect(homeScreenSource).toMatch(/onSeeAllPress=\{handleSeeAllFeatured\}/);
    });

    it('should pass handleSeeAllPopular to popular section', () => {
      expect(homeScreenSource).toMatch(/onSeeAllPress=\{handleSeeAllPopular\}/);
    });

    it('should pass handleSeeAllQuickBites to quick bites section', () => {
      expect(homeScreenSource).toMatch(/onSeeAllPress=\{handleSeeAllQuickBites\}/);
    });

    it('should pass handleSeeAllNew to new section', () => {
      expect(homeScreenSource).toMatch(/onSeeAllPress=\{handleSeeAllNew\}/);
    });
  });

  describe('Category Filtering', () => {
    it('should define selectedCategoryName', () => {
      expect(homeScreenSource).toContain('selectedCategoryName');
    });

    it('should handle cat-all category as null', () => {
      expect(homeScreenSource).toMatch(/selectedCategory\s*===\s*['"]cat-all['"]/);
    });

    it('should call filterByCategory when category changes', () => {
      expect(homeScreenSource).toContain('filterByCategory(selectedCategoryName)');
    });

    it('should use useEffect for category filter updates', () => {
      expect(homeScreenSource).toContain('useEffect');
      expect(homeScreenSource).toMatch(/\[selectedCategoryName,\s*filterByCategory\]/);
    });
  });

  describe('Filter Indicator', () => {
    it('should show filter indicator when category is selected', () => {
      expect(homeScreenSource).toMatch(/selectedCategory\s*!==\s*['"]cat-all['"]/);
    });

    it('should display selected category name', () => {
      expect(homeScreenSource).toContain('Showing:');
    });

    it('should have filterIndicator style', () => {
      expect(homeScreenSource).toContain('filterIndicator');
    });
  });

  describe('Empty State', () => {
    it('should check hasAnyRestaurants', () => {
      expect(homeScreenSource).toContain('hasAnyRestaurants');
    });

    it('should show empty state when no restaurants match filter', () => {
      expect(homeScreenSource).toContain('No restaurants found');
    });

    it('should show helpful message in empty state', () => {
      expect(homeScreenSource).toContain('Try selecting a different category');
    });

    it('should only show empty state when not loading', () => {
      expect(homeScreenSource).toMatch(/!isLoading\s*&&\s*!hasAnyRestaurants/);
    });
  });

  describe('Promotional Badges', () => {
    it('should define PROMOTIONAL_BADGES constant', () => {
      expect(homeScreenSource).toContain('const PROMOTIONAL_BADGES');
    });

    it('should have promotional badges for specific restaurants', () => {
      expect(homeScreenSource).toMatch(/['"]rest-\d+['"]:\s*['"]/);
    });

    it('should include discount promotional badge', () => {
      expect(homeScreenSource).toMatch(/['"].*Off['"]/);
    });

    it('should include free delivery promotional badge', () => {
      expect(homeScreenSource).toContain('Free Delivery');
    });
  });

  describe('Animation Delays', () => {
    it('should pass animationDelay to featured section', () => {
      expect(homeScreenSource).toMatch(/testID="featured-section"[\s\S]*?animationDelay=\{\d+\}/);
    });

    it('should pass animationDelay to popular section', () => {
      expect(homeScreenSource).toMatch(/testID="popular-section"[\s\S]*?animationDelay=\{\d+\}/);
    });

    it('should pass animationDelay to quick bites section', () => {
      expect(homeScreenSource).toMatch(
        /testID="quick-bites-section"[\s\S]*?animationDelay=\{\d+\}/
      );
    });

    it('should pass animationDelay to new section', () => {
      expect(homeScreenSource).toMatch(/testID="new-section"[\s\S]*?animationDelay=\{\d+\}/);
    });

    it('should use staggered animation delays', () => {
      // Check that different sections have increasing delays
      expect(homeScreenSource).toContain('animationDelay={300}');
      expect(homeScreenSource).toContain('animationDelay={400}');
      expect(homeScreenSource).toContain('animationDelay={500}');
      expect(homeScreenSource).toContain('animationDelay={600}');
    });
  });

  describe('ScrollView Configuration', () => {
    it('should hide vertical scroll indicator', () => {
      expect(homeScreenSource).toContain('showsVerticalScrollIndicator={false}');
    });

    it('should have scrollContent style', () => {
      expect(homeScreenSource).toContain('contentContainerStyle={styles.scrollContent}');
    });

    it('should have testID for scroll view', () => {
      expect(homeScreenSource).toContain('testID="home-scroll-view"');
    });
  });

  describe('Styling', () => {
    it('should use StyleSheet.create', () => {
      expect(homeScreenSource).toContain('StyleSheet.create');
    });

    it('should have scrollView style', () => {
      expect(homeScreenSource).toMatch(/scrollView:\s*\{/);
    });

    it('should have scrollContent style', () => {
      expect(homeScreenSource).toMatch(/scrollContent:\s*\{/);
    });

    it('should have filterIndicator style', () => {
      expect(homeScreenSource).toMatch(/filterIndicator:\s*\{/);
    });

    it('should have filterText style', () => {
      expect(homeScreenSource).toMatch(/filterText:\s*\{/);
    });

    it('should have emptyState style', () => {
      expect(homeScreenSource).toMatch(/emptyState:\s*\{/);
    });

    it('should have emptyTitle style', () => {
      expect(homeScreenSource).toMatch(/emptyTitle:\s*\{/);
    });

    it('should have emptySubtitle style', () => {
      expect(homeScreenSource).toMatch(/emptySubtitle:\s*\{/);
    });

    it('should have bottomSpacer style', () => {
      expect(homeScreenSource).toMatch(/bottomSpacer:\s*\{/);
    });
  });

  describe('Existing Features Preserved', () => {
    it('should still render DeliveryAddressHeader', () => {
      expect(homeScreenSource).toContain('<DeliveryAddressHeader');
    });

    it('should still render SearchBar', () => {
      expect(homeScreenSource).toContain('<SearchBar');
    });

    it('should still render category scroll', () => {
      expect(homeScreenSource).toContain('category-list');
    });

    it('should still handle category selection', () => {
      expect(homeScreenSource).toContain('handleCategoryPress');
    });
  });
});
