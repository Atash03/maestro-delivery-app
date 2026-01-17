/**
 * Tests for MenuSectionList component
 *
 * Tests cover:
 * - File structure and exports
 * - Component props and types
 * - MenuSectionHeader component
 * - MenuSkeleton component
 * - EmptyMenu component
 * - MenuSectionList SectionList wrapper
 * - Empty category message logic
 * - Integration with restaurant detail screen
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// Helper to read file contents
const readFile = (filePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');
};

// ============================================================================
// File Structure Tests
// ============================================================================

describe('MenuSectionList - File Structure', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should exist at the correct path', () => {
    const exists = fs.existsSync(path.join(process.cwd(), componentPath));
    expect(exists).toBe(true);
  });

  it('should export MenuSection type', () => {
    expect(componentContent).toContain('export interface MenuSection');
  });

  it('should export MenuSectionListProps type', () => {
    expect(componentContent).toContain('export interface MenuSectionListProps');
  });

  it('should export MenuSectionHeader component', () => {
    expect(componentContent).toContain('export function MenuSectionHeader');
  });

  it('should export MenuSectionHeaderProps type', () => {
    expect(componentContent).toContain('export interface MenuSectionHeaderProps');
  });

  it('should export MenuSkeleton component', () => {
    expect(componentContent).toContain('export function MenuSkeleton');
  });

  it('should export EmptyMenu component', () => {
    expect(componentContent).toContain('export function EmptyMenu');
  });

  it('should export EmptyMenuProps type', () => {
    expect(componentContent).toContain('export interface EmptyMenuProps');
  });

  it('should export MenuSectionList component', () => {
    expect(componentContent).toContain('export function MenuSectionList');
  });
});

// ============================================================================
// Component Import Tests
// ============================================================================

describe('MenuSectionList - Imports', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should import Ionicons for icons', () => {
    expect(componentContent).toContain("from '@expo/vector-icons'");
  });

  it('should import SectionList from react-native', () => {
    expect(componentContent).toContain('SectionList');
    expect(componentContent).toContain("from 'react-native'");
  });

  it('should import Animated and animations from react-native-reanimated', () => {
    expect(componentContent).toContain("from 'react-native-reanimated'");
    expect(componentContent).toContain('FadeIn');
    expect(componentContent).toContain('FadeInUp');
  });

  it('should import RestaurantMenuItemCard from cards', () => {
    expect(componentContent).toContain("from '@/components/cards'");
    expect(componentContent).toContain('RestaurantMenuItemCard');
  });

  it('should import ThemedText', () => {
    expect(componentContent).toContain("from '@/components/themed-text'");
  });

  it('should import Skeleton from UI components', () => {
    expect(componentContent).toContain("from '@/components/ui'");
    expect(componentContent).toContain('Skeleton');
  });

  it('should import theme constants', () => {
    expect(componentContent).toContain("from '@/constants/theme'");
    expect(componentContent).toContain('Colors');
    expect(componentContent).toContain('Spacing');
    expect(componentContent).toContain('Typography');
    expect(componentContent).toContain('BorderRadius');
  });

  it('should import useColorScheme hook', () => {
    expect(componentContent).toContain("from '@/hooks/use-color-scheme'");
  });

  it('should import MenuItem and Restaurant types', () => {
    expect(componentContent).toContain("from '@/types'");
    expect(componentContent).toContain('MenuItem');
    expect(componentContent).toContain('Restaurant');
  });
});

// ============================================================================
// MenuSection Type Tests
// ============================================================================

describe('MenuSectionList - MenuSection Type', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should define category property as string', () => {
    expect(componentContent).toContain('category: string');
  });

  it('should define data property as MenuItem array', () => {
    expect(componentContent).toContain('data: MenuItem[]');
  });
});

// ============================================================================
// MenuSectionHeaderProps Type Tests
// ============================================================================

describe('MenuSectionList - MenuSectionHeaderProps Type', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should have category prop', () => {
    // Check in MenuSectionHeaderProps interface
    const propsMatch = componentContent.match(
      /export interface MenuSectionHeaderProps[\s\S]*?category: string/
    );
    expect(propsMatch).not.toBeNull();
  });

  it('should have items prop as MenuItem array', () => {
    const propsMatch = componentContent.match(
      /export interface MenuSectionHeaderProps[\s\S]*?items: MenuItem\[\]/
    );
    expect(propsMatch).not.toBeNull();
  });

  it('should have optional onLayout callback', () => {
    const propsMatch = componentContent.match(
      /export interface MenuSectionHeaderProps[\s\S]*?onLayout\?:/
    );
    expect(propsMatch).not.toBeNull();
  });

  it('should have optional testID', () => {
    const propsMatch = componentContent.match(
      /export interface MenuSectionHeaderProps[\s\S]*?testID\?:/
    );
    expect(propsMatch).not.toBeNull();
  });
});

// ============================================================================
// MenuSectionListProps Type Tests
// ============================================================================

describe('MenuSectionList - MenuSectionListProps Type', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should have sections prop', () => {
    expect(componentContent).toContain('sections: MenuSection[]');
  });

  it('should have restaurant prop', () => {
    expect(componentContent).toContain('restaurant: Restaurant');
  });

  it('should have optional isLoading prop', () => {
    expect(componentContent).toContain('isLoading?: boolean');
  });

  it('should have getItemQuantity callback', () => {
    expect(componentContent).toContain('getItemQuantity:');
  });

  it('should have optional onItemPress callback', () => {
    expect(componentContent).toContain('onItemPress?:');
  });

  it('should have optional onItemAdd callback', () => {
    expect(componentContent).toContain('onItemAdd?:');
  });

  it('should have optional onItemIncrement callback', () => {
    expect(componentContent).toContain('onItemIncrement?:');
  });

  it('should have optional onItemDecrement callback', () => {
    expect(componentContent).toContain('onItemDecrement?:');
  });

  it('should have optional onScroll callback', () => {
    expect(componentContent).toContain('onScroll?:');
  });

  it('should have optional onCategoryLayout callback', () => {
    expect(componentContent).toContain('onCategoryLayout?:');
  });

  it('should have optional stickySectionHeaders prop', () => {
    expect(componentContent).toContain('stickySectionHeaders?:');
  });

  it('should have optional ListHeaderComponent prop', () => {
    expect(componentContent).toContain('ListHeaderComponent?:');
  });

  it('should have optional ListFooterComponent prop', () => {
    expect(componentContent).toContain('ListFooterComponent?:');
  });
});

// ============================================================================
// EmptyMenuProps Type Tests
// ============================================================================

describe('MenuSectionList - EmptyMenuProps Type', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should have optional title prop', () => {
    const propsMatch = componentContent.match(/export interface EmptyMenuProps[\s\S]*?title\?:/);
    expect(propsMatch).not.toBeNull();
  });

  it('should have optional description prop', () => {
    const propsMatch = componentContent.match(
      /export interface EmptyMenuProps[\s\S]*?description\?:/
    );
    expect(propsMatch).not.toBeNull();
  });

  it('should have optional testID prop', () => {
    const propsMatch = componentContent.match(/export interface EmptyMenuProps[\s\S]*?testID\?:/);
    expect(propsMatch).not.toBeNull();
  });
});

// ============================================================================
// MenuSectionHeader Component Tests
// ============================================================================

describe('MenuSectionList - MenuSectionHeader Component', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should use useColorScheme hook', () => {
    // Check that the exported MenuSectionHeader uses useColorScheme
    const functionBody = componentContent.match(
      /export function MenuSectionHeader[\s\S]*?return \(/
    );
    expect(functionBody?.[0]).toContain('useColorScheme');
  });

  it('should calculate available item count', () => {
    expect(componentContent).toContain('availableCount');
    expect(componentContent).toContain('filter((item) => item.isAvailable)');
  });

  it('should calculate total item count', () => {
    expect(componentContent).toContain('totalCount');
    expect(componentContent).toContain('items.length');
  });

  it('should detect when all items are unavailable', () => {
    expect(componentContent).toContain('allUnavailable');
    expect(componentContent).toContain('availableCount === 0 && totalCount > 0');
  });

  it('should render category name', () => {
    expect(componentContent).toContain('{category}');
  });

  it('should render item count with correct plural form', () => {
    expect(componentContent).toContain("totalCount === 1 ? 'item' : 'items'");
  });

  it('should show unavailable notice when all items unavailable', () => {
    expect(componentContent).toContain('{allUnavailable && (');
    expect(componentContent).toContain('All items in this category are currently unavailable');
  });

  it('should use alert-circle-outline icon for unavailable notice', () => {
    expect(componentContent).toContain('alert-circle-outline');
  });

  it('should support onLayout callback', () => {
    expect(componentContent).toContain('onLayout={onLayout}');
  });

  it('should support testID prop', () => {
    expect(componentContent).toContain('testID={testID}');
  });
});

// ============================================================================
// MenuSkeleton Component Tests
// ============================================================================

describe('MenuSectionList - MenuSkeleton Component', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should define skeleton section count constant', () => {
    expect(componentContent).toContain('SKELETON_SECTION_COUNT');
  });

  it('should define skeleton item count per section constant', () => {
    expect(componentContent).toContain('SKELETON_ITEM_COUNT_PER_SECTION');
  });

  it('should render multiple skeleton sections', () => {
    expect(componentContent).toContain('SKELETON_SECTION_COUNT');
    expect(componentContent).toContain('SectionSkeleton');
  });

  it('should have MenuItemSkeleton sub-component', () => {
    expect(componentContent).toContain('function MenuItemSkeleton');
  });

  it('should have SectionSkeleton sub-component', () => {
    expect(componentContent).toContain('function SectionSkeleton');
  });

  it('should use Skeleton component for loading placeholders', () => {
    expect(componentContent).toContain('<Skeleton');
  });

  it('should have skeleton for badge', () => {
    expect(componentContent).toContain('skeletonBadge');
  });

  it('should have skeleton for name', () => {
    expect(componentContent).toContain('skeletonName');
  });

  it('should have skeleton for description', () => {
    expect(componentContent).toContain('skeletonDescription');
  });

  it('should have skeleton for price row', () => {
    expect(componentContent).toContain('skeletonPriceRow');
  });

  it('should use FadeIn animation for skeleton items', () => {
    expect(componentContent).toContain('entering={FadeIn');
  });
});

// ============================================================================
// EmptyMenu Component Tests
// ============================================================================

describe('MenuSectionList - EmptyMenu Component', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should have default title', () => {
    expect(componentContent).toContain("title = 'Menu not available'");
  });

  it('should have default description', () => {
    expect(componentContent).toContain('description = "This restaurant\'s menu is currently');
  });

  it('should use restaurant-outline icon', () => {
    expect(componentContent).toContain('restaurant-outline');
  });

  it('should use FadeIn animation', () => {
    // The EmptyMenu component uses Animated.View with FadeIn entering animation
    // Check that it appears after the EmptyMenu function definition
    const emptyMenuSection = componentContent.match(
      /export function EmptyMenu[\s\S]*?entering={FadeIn/
    );
    expect(emptyMenuSection).not.toBeNull();
  });

  it('should render title text', () => {
    expect(componentContent).toContain('{title}');
  });

  it('should render description text', () => {
    expect(componentContent).toContain('{description}');
  });

  it('should support testID prop', () => {
    const emptyMenuSection = componentContent.match(
      /export function EmptyMenu[\s\S]*?testID={testID}/
    );
    expect(emptyMenuSection).not.toBeNull();
  });
});

// ============================================================================
// MenuSectionList Component Tests
// ============================================================================

describe('MenuSectionList - MenuSectionList Component', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should use SectionList from react-native', () => {
    expect(componentContent).toContain('<SectionList');
  });

  it('should enable sticky section headers by default', () => {
    expect(componentContent).toContain('stickySectionHeaders = true');
  });

  it('should pass stickySectionHeadersEnabled prop', () => {
    expect(componentContent).toContain('stickySectionHeadersEnabled={stickySectionHeaders}');
  });

  it('should set scrollEventThrottle to 16', () => {
    expect(componentContent).toContain('scrollEventThrottle={16}');
  });

  it('should hide vertical scroll indicator', () => {
    expect(componentContent).toContain('showsVerticalScrollIndicator={false}');
  });

  it('should pass keyExtractor', () => {
    expect(componentContent).toContain('keyExtractor={keyExtractor}');
  });

  it('should pass renderItem', () => {
    expect(componentContent).toContain('renderItem={renderItem}');
  });

  it('should pass renderSectionHeader', () => {
    expect(componentContent).toContain('renderSectionHeader={renderSectionHeader}');
  });

  it('should pass ItemSeparatorComponent', () => {
    expect(componentContent).toContain('ItemSeparatorComponent={renderItemSeparator}');
  });

  it('should show loading state when isLoading is true', () => {
    expect(componentContent).toContain('if (isLoading)');
    expect(componentContent).toContain('<MenuSkeleton');
  });

  it('should show empty state when sections is empty', () => {
    expect(componentContent).toContain('if (sections.length === 0)');
    expect(componentContent).toContain('<EmptyMenu');
  });
});

// ============================================================================
// Restaurant Detail Screen Integration Tests
// ============================================================================

describe('MenuSectionList - Restaurant Detail Integration', () => {
  const screenPath = 'src/app/restaurant/[id].tsx';
  let screenContent: string;

  beforeAll(() => {
    screenContent = readFile(screenPath);
  });

  it('should import MenuSectionHeader from menu-section-list', () => {
    expect(screenContent).toContain("from '@/components/menu-section-list'");
    expect(screenContent).toContain('MenuSectionHeader');
  });

  it('should import MenuSkeleton from menu-section-list', () => {
    expect(screenContent).toContain('MenuSkeleton');
  });

  it('should import EmptyMenu from menu-section-list', () => {
    expect(screenContent).toContain('EmptyMenu');
  });

  it('should have isMenuLoading state', () => {
    expect(screenContent).toContain('isMenuLoading');
    expect(screenContent).toContain('setIsMenuLoading');
  });

  it('should show MenuSkeleton when menu is loading', () => {
    expect(screenContent).toContain('{isMenuLoading && <MenuSkeleton');
  });

  it('should use MenuSectionHeader for category headers', () => {
    expect(screenContent).toContain('<MenuSectionHeader');
    expect(screenContent).toContain('category={category.name}');
    expect(screenContent).toContain('items={menuByCategory[category.id]');
  });

  it('should use EmptyMenu when no categories', () => {
    expect(screenContent).toContain('<EmptyMenu');
    expect(screenContent).toContain('testID="empty-menu"');
  });

  it('should hide menu tabs when loading', () => {
    expect(screenContent).toContain('{!isMenuLoading && menuCategories.length > 0 && (');
  });

  it('should hide sticky tabs when loading', () => {
    expect(screenContent).toContain('{!isMenuLoading && isTabsSticky && menuCategories.length > 0');
  });

  it('should hide menu items when loading', () => {
    expect(screenContent).toContain('{!isMenuLoading &&');
    expect(screenContent).toContain('menuCategories.map((category');
  });

  it('should set isMenuLoading to true at start of fetch', () => {
    expect(screenContent).toContain('setIsMenuLoading(true)');
  });

  it('should set isMenuLoading to false after menu is fetched', () => {
    expect(screenContent).toContain('setIsMenuLoading(false)');
  });
});

// ============================================================================
// Styling Tests
// ============================================================================

describe('MenuSectionList - Styles', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should define container style', () => {
    expect(componentContent).toContain('container:');
    expect(componentContent).toContain('flex: 1');
  });

  it('should define sectionHeader style', () => {
    expect(componentContent).toContain('sectionHeader:');
  });

  it('should define standaloneSectionHeader style', () => {
    expect(componentContent).toContain('standaloneSectionHeader:');
  });

  it('should define sectionHeaderContent style', () => {
    expect(componentContent).toContain('sectionHeaderContent:');
  });

  it('should define sectionTitle style', () => {
    expect(componentContent).toContain('sectionTitle:');
  });

  it('should define sectionCount style', () => {
    expect(componentContent).toContain('sectionCount:');
  });

  it('should define unavailableNotice style', () => {
    expect(componentContent).toContain('unavailableNotice:');
  });

  it('should define unavailableText style', () => {
    expect(componentContent).toContain('unavailableText:');
  });

  it('should define emptyContainer style', () => {
    expect(componentContent).toContain('emptyContainer:');
  });

  it('should define emptyTitle style', () => {
    expect(componentContent).toContain('emptyTitle:');
  });

  it('should define emptyDescription style', () => {
    expect(componentContent).toContain('emptyDescription:');
  });

  it('should define skeletonContainer style', () => {
    expect(componentContent).toContain('skeletonContainer:');
  });

  it('should define skeletonSection style', () => {
    expect(componentContent).toContain('skeletonSection:');
  });

  it('should define skeletonItem style', () => {
    expect(componentContent).toContain('skeletonItem:');
  });
});

// ============================================================================
// Animation Tests
// ============================================================================

describe('MenuSectionList - Animations', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should import AnimationDurations from theme', () => {
    expect(componentContent).toContain('AnimationDurations');
  });

  it('should use AnimationDurations.normal for fade animations', () => {
    expect(componentContent).toContain('AnimationDurations.normal');
  });

  it('should use AnimationDurations.fast for fast animations', () => {
    expect(componentContent).toContain('AnimationDurations.fast');
  });

  it('should use FadeIn for entering animations', () => {
    expect(componentContent).toContain('FadeIn.duration');
  });

  it('should use FadeInUp for staggered item animations', () => {
    expect(componentContent).toContain('FadeInUp.delay');
  });

  it('should have staggered delay for skeleton items', () => {
    // Check for delay calculation with index
    expect(componentContent).toContain('sectionIndex * 50');
    expect(componentContent).toContain('index * 30');
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('MenuSectionList - Accessibility', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should support testID prop on MenuSectionHeader', () => {
    expect(componentContent).toContain('testID={testID}');
  });

  it('should support testID prop on MenuSectionList', () => {
    expect(componentContent).toContain('testID={testID}');
  });

  it('should support testID prop on EmptyMenu', () => {
    const emptyMenuSection = componentContent.match(
      /export function EmptyMenu[\s\S]*?testID={testID}/
    );
    expect(emptyMenuSection).not.toBeNull();
  });

  it('should generate testID for individual menu items', () => {
    expect(componentContent).toContain('testID={testID ? `${testID}-item-${item.id}` : undefined}');
  });
});

// ============================================================================
// Edge Case Tests
// ============================================================================

describe('MenuSectionList - Edge Cases', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should handle empty sections array', () => {
    expect(componentContent).toContain('sections.length === 0');
  });

  it('should handle loading state', () => {
    expect(componentContent).toContain('isLoading = false');
    expect(componentContent).toContain('if (isLoading)');
  });

  it('should handle undefined callbacks gracefully', () => {
    // Optional callbacks with ?. operator or default handling
    expect(componentContent).toContain('onLayout?.(');
  });

  it('should handle null/undefined items array', () => {
    // Restaurant detail screen handles this
    const screenPath = 'src/app/restaurant/[id].tsx';
    const screenContent = readFile(screenPath);
    expect(screenContent).toContain('menuByCategory[category.id] ?? []');
  });
});

// ============================================================================
// Constant Value Tests
// ============================================================================

describe('MenuSectionList - Constants', () => {
  const componentPath = 'src/components/menu-section-list.tsx';
  let componentContent: string;

  beforeAll(() => {
    componentContent = readFile(componentPath);
  });

  it('should have SKELETON_SECTION_COUNT of 3', () => {
    expect(componentContent).toContain('SKELETON_SECTION_COUNT = 3');
  });

  it('should have SKELETON_ITEM_COUNT_PER_SECTION of 3', () => {
    expect(componentContent).toContain('SKELETON_ITEM_COUNT_PER_SECTION = 3');
  });
});
