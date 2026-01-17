/**
 * Tests for Search Screen
 */

import * as fs from 'fs';
import * as path from 'path';

import { getRestaurantById, mockMenuItems, mockRestaurants } from '@/data/mock';

const screenPath = path.join(process.cwd(), 'src/app/(tabs)/search.tsx');
const screenSource = fs.readFileSync(screenPath, 'utf-8');

// ============================================================================
// Test: File Structure
// ============================================================================

describe('SearchScreen', () => {
  describe('file structure', () => {
    it('should exist at correct path', () => {
      expect(fs.existsSync(screenPath)).toBe(true);
    });

    it('should export default component', () => {
      expect(screenSource).toContain('export default function SearchScreen');
    });
  });

  // ============================================================================
  // Test: Imports
  // ============================================================================

  describe('imports', () => {
    it('should import Ionicons', () => {
      expect(screenSource).toContain("from '@expo/vector-icons'");
    });

    it('should import FlashList', () => {
      expect(screenSource).toContain("from '@shopify/flash-list'");
    });

    it('should import router from expo-router', () => {
      expect(screenSource).toContain("from 'expo-router'");
    });

    it('should import react-native-reanimated', () => {
      expect(screenSource).toContain("from 'react-native-reanimated'");
    });

    it('should import safe area context', () => {
      expect(screenSource).toContain("from 'react-native-safe-area-context'");
    });

    it('should import MenuItemCard', () => {
      expect(screenSource).toContain('MenuItemCard');
    });

    it('should import RestaurantCard', () => {
      expect(screenSource).toContain('RestaurantCard');
    });

    it('should import SearchBar', () => {
      expect(screenSource).toContain('SearchBar');
    });

    it('should import Skeleton', () => {
      expect(screenSource).toContain('Skeleton');
    });

    it('should import useSearch hook', () => {
      expect(screenSource).toContain('useSearch');
    });
  });

  // ============================================================================
  // Test: SearchResultItem Type
  // ============================================================================

  describe('SearchResultItem type', () => {
    it('should define section-header type', () => {
      expect(screenSource).toContain("type: 'section-header'");
    });

    it('should define restaurant type', () => {
      expect(screenSource).toContain("type: 'restaurant'");
    });

    it('should define menu-item type', () => {
      expect(screenSource).toContain("type: 'menu-item'");
    });
  });

  // ============================================================================
  // Test: Search Bar Integration
  // ============================================================================

  describe('search bar integration', () => {
    it('should render SearchBar component', () => {
      expect(screenSource).toContain('<SearchBar');
    });

    it('should use controlled value from useSearch', () => {
      expect(screenSource).toContain('value={query}');
    });

    it('should use setQuery for onChangeText', () => {
      expect(screenSource).toContain('onChangeText={setQuery}');
    });

    it('should set placeholder text', () => {
      expect(screenSource).toContain('placeholder="Search restaurants or dishes..."');
    });

    it('should disable navigation on focus', () => {
      expect(screenSource).toContain('navigateOnFocus={false}');
    });

    it('should show recent searches when query is empty', () => {
      expect(screenSource).toContain('showRecentSearches={query.trim().length === 0}');
    });
  });

  // ============================================================================
  // Test: Empty States
  // ============================================================================

  describe('empty states', () => {
    describe('EmptySearchState', () => {
      it('should render EmptySearchState component', () => {
        expect(screenSource).toContain('function EmptySearchState');
      });

      it('should show search icon', () => {
        expect(screenSource).toContain('name="search"');
      });

      it('should display help text', () => {
        expect(screenSource).toContain('Search for restaurants or dishes');
      });

      it('should display subtitle text', () => {
        expect(screenSource).toContain('Find your favorite meals from restaurants near you');
      });
    });

    describe('NoResultsState', () => {
      it('should render NoResultsState component', () => {
        expect(screenSource).toContain('function NoResultsState');
      });

      it('should accept query prop', () => {
        expect(screenSource).toContain('NoResultsState({ query }');
      });

      it('should show sad icon', () => {
        expect(screenSource).toContain('name="sad-outline"');
      });

      it('should display no results message with query', () => {
        expect(screenSource).toContain('No results for "{query}"');
      });

      it('should display suggestion text', () => {
        expect(screenSource).toContain('Try searching for something else or check your spelling');
      });
    });
  });

  // ============================================================================
  // Test: Section Headers
  // ============================================================================

  describe('section headers', () => {
    it('should render SectionHeader component', () => {
      expect(screenSource).toContain('function SectionHeader');
    });

    it('should accept title prop', () => {
      expect(screenSource).toContain('title: string');
    });

    it('should accept count prop', () => {
      expect(screenSource).toContain('count: number');
    });

    it('should display result count with plural handling', () => {
      expect(screenSource).toContain("count === 1 ? 'result' : 'results'");
    });

    it('should have Restaurants section', () => {
      expect(screenSource).toContain("title: 'Restaurants'");
    });

    it('should have Dishes section', () => {
      expect(screenSource).toContain("title: 'Dishes'");
    });
  });

  // ============================================================================
  // Test: Loading State
  // ============================================================================

  describe('loading state', () => {
    it('should render SearchResultSkeleton component', () => {
      expect(screenSource).toContain('function SearchResultSkeleton');
    });

    it('should define SKELETON_COUNT', () => {
      expect(screenSource).toContain('SKELETON_COUNT = 4');
    });

    it('should show skeletons when loading', () => {
      expect(screenSource).toContain('{isLoading && <SearchResultSkeleton />}');
    });

    it('should use Skeleton component', () => {
      expect(screenSource).toContain('<Skeleton');
    });
  });

  // ============================================================================
  // Test: Results List
  // ============================================================================

  describe('results list', () => {
    it('should use FlashList for results', () => {
      expect(screenSource).toContain('<FlashList');
    });

    it('should pass data to FlashList', () => {
      expect(screenSource).toContain('data={listData}');
    });

    it('should have renderItem function', () => {
      expect(screenSource).toContain('renderItem={renderItem}');
    });

    it('should have getItemType function', () => {
      expect(screenSource).toContain('getItemType={getItemType}');
    });

    it('should have keyExtractor', () => {
      expect(screenSource).toContain('keyExtractor=');
    });

    it('should set estimatedItemSize', () => {
      expect(screenSource).toContain('estimatedItemSize={estimatedItemSize}');
    });

    it('should hide scroll indicator', () => {
      expect(screenSource).toContain('showsVerticalScrollIndicator={false}');
    });
  });

  // ============================================================================
  // Test: Result Item Rendering
  // ============================================================================

  describe('result item rendering', () => {
    it('should handle section-header type', () => {
      expect(screenSource).toContain("case 'section-header':");
    });

    it('should handle restaurant type', () => {
      expect(screenSource).toContain("case 'restaurant':");
    });

    it('should handle menu-item type', () => {
      expect(screenSource).toContain("case 'menu-item':");
    });

    it('should render RestaurantCard for restaurant type', () => {
      expect(screenSource).toContain('<RestaurantCard');
    });

    it('should render MenuItemCard for menu-item type', () => {
      expect(screenSource).toContain('<MenuItemCard');
    });

    it('should pass restaurant data to RestaurantCard', () => {
      expect(screenSource).toContain('restaurant={item.data}');
    });

    it('should pass item data to MenuItemCard', () => {
      expect(screenSource).toContain('item={item.data}');
    });

    it('should pass restaurantName to MenuItemCard', () => {
      expect(screenSource).toContain('restaurantName={item.data.restaurantName}');
    });
  });

  // ============================================================================
  // Test: Press Handlers
  // ============================================================================

  describe('press handlers', () => {
    it('should have handleRestaurantPress', () => {
      expect(screenSource).toContain('handleRestaurantPress');
    });

    it('should have handleMenuItemPress', () => {
      expect(screenSource).toContain('handleMenuItemPress');
    });

    it('should navigate to restaurant detail on restaurant press', () => {
      expect(screenSource).toContain('router.push(`/restaurant/${restaurant.id}`)');
    });

    it('should navigate to restaurant on menu item press', () => {
      expect(screenSource).toContain('router.push(`/restaurant/${item.restaurantId}`)');
    });

    it('should use useCallback for handlers', () => {
      expect(screenSource).toContain('useCallback');
    });
  });

  // ============================================================================
  // Test: Animations
  // ============================================================================

  describe('animations', () => {
    it('should use FadeIn for empty states', () => {
      expect(screenSource).toContain('FadeIn');
    });

    it('should use FadeInDown for section headers', () => {
      expect(screenSource).toContain('FadeInDown');
    });

    it('should use FadeInUp for result items', () => {
      expect(screenSource).toContain('FadeInUp');
    });

    it('should have staggered animation delays', () => {
      expect(screenSource).toContain('animationDelay');
      expect(screenSource).toContain('Math.min(index * 50, 300)');
    });

    it('should apply delay to animations', () => {
      expect(screenSource).toContain('.delay(animationDelay)');
    });
  });

  // ============================================================================
  // Test: State Conditions
  // ============================================================================

  describe('state conditions', () => {
    it('should calculate hasResults', () => {
      expect(screenSource).toContain(
        'results.restaurants.length > 0 || results.menuItems.length > 0'
      );
    });

    it('should calculate showNoResults', () => {
      expect(screenSource).toContain('showNoResults');
    });

    it('should calculate showEmptyState', () => {
      expect(screenSource).toContain('showEmptyState');
    });

    it('should check hasSearched for results display', () => {
      expect(screenSource).toContain('hasSearched');
    });

    it('should check isLoading for skeleton display', () => {
      expect(screenSource).toContain('isLoading');
    });
  });

  // ============================================================================
  // Test: List Data Building
  // ============================================================================

  describe('list data building', () => {
    it('should create listData array', () => {
      expect(screenSource).toContain('const listData: SearchResultItem[] = []');
    });

    it('should add restaurant section header when restaurants exist', () => {
      expect(screenSource).toContain('results.restaurants.length > 0');
    });

    it('should add menu items section header when menu items exist', () => {
      expect(screenSource).toContain('results.menuItems.length > 0');
    });

    it('should push restaurant items to list', () => {
      expect(screenSource).toContain("listData.push({ type: 'restaurant'");
    });

    it('should push menu item items to list', () => {
      expect(screenSource).toContain("listData.push({ type: 'menu-item'");
    });
  });

  // ============================================================================
  // Test: Safe Area Handling
  // ============================================================================

  describe('safe area handling', () => {
    it('should use useSafeAreaInsets', () => {
      expect(screenSource).toContain('useSafeAreaInsets');
    });

    it('should apply top inset to search container', () => {
      expect(screenSource).toContain('paddingTop: insets.top');
    });
  });

  // ============================================================================
  // Test: Styling
  // ============================================================================

  describe('styling', () => {
    it('should use StyleSheet.create', () => {
      expect(screenSource).toContain('StyleSheet.create');
    });

    it('should have container style', () => {
      expect(screenSource).toContain('container:');
    });

    it('should have searchContainer style', () => {
      expect(screenSource).toContain('searchContainer:');
    });

    it('should have contentContainer style', () => {
      expect(screenSource).toContain('contentContainer:');
    });

    it('should have sectionHeader style', () => {
      expect(screenSource).toContain('sectionHeader:');
    });

    it('should have emptyStateContainer style', () => {
      expect(screenSource).toContain('emptyStateContainer:');
    });

    it('should have skeletonContainer style', () => {
      expect(screenSource).toContain('skeletonContainer:');
    });

    it('should use theme colors', () => {
      expect(screenSource).toContain('colors.background');
      expect(screenSource).toContain('colors.text');
      expect(screenSource).toContain('colors.textSecondary');
      expect(screenSource).toContain('colors.textTertiary');
    });

    it('should use design system tokens', () => {
      expect(screenSource).toContain('Spacing');
      expect(screenSource).toContain('Typography');
      expect(screenSource).toContain('BorderRadius');
    });
  });

  // ============================================================================
  // Test: useSearch Hook Integration
  // ============================================================================

  describe('useSearch hook integration', () => {
    it('should destructure query from useSearch', () => {
      expect(screenSource).toContain('query');
    });

    it('should destructure setQuery from useSearch', () => {
      expect(screenSource).toContain('setQuery');
    });

    it('should destructure results from useSearch', () => {
      expect(screenSource).toContain('results');
    });

    it('should destructure isLoading from useSearch', () => {
      expect(screenSource).toContain('isLoading');
    });

    it('should destructure hasSearched from useSearch', () => {
      expect(screenSource).toContain('hasSearched');
    });

    it('should pass debounceMs option', () => {
      expect(screenSource).toContain('debounceMs: 300');
    });

    it('should pass minQueryLength option', () => {
      expect(screenSource).toContain('minQueryLength: 2');
    });
  });

  // ============================================================================
  // Test: Mock Data Integration
  // ============================================================================

  describe('mock data integration', () => {
    it('should have searchable restaurants', () => {
      const query = 'burger';
      const restaurants = mockRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.some((c) => c.toLowerCase().includes(query))
      );
      expect(restaurants.length).toBeGreaterThan(0);
    });

    it('should have searchable menu items', () => {
      const query = 'pizza';
      const menuItems = mockMenuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      );
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should be able to resolve restaurant names for menu items', () => {
      const menuItem = mockMenuItems[0];
      const restaurant = getRestaurantById(menuItem.restaurantId);
      expect(restaurant).toBeDefined();
      expect(restaurant?.name).toBeDefined();
    });
  });

  // ============================================================================
  // Test: TestIDs
  // ============================================================================

  describe('testIDs', () => {
    it('should pass testID to RestaurantCard', () => {
      expect(screenSource).toContain('testID={`search-result-restaurant-${item.data.id}`}');
    });

    it('should pass testID to MenuItemCard', () => {
      expect(screenSource).toContain('testID={`search-result-menu-item-${item.data.id}`}');
    });
  });
});
