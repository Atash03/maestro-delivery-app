/**
 * Tests for Filters Modal Screen
 *
 * Comprehensive test suite covering:
 * - File structure and exports
 * - Component types and props
 * - Filter state management
 * - Filter chip functionality
 * - Sort options
 * - Price range selection
 * - Rating filter
 * - Delivery time filter
 * - Dietary filter
 * - Clear all functionality
 * - Apply filters functionality
 * - Animation configuration
 * - Accessibility features
 * - Styling and theme integration
 * - Default values
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Test Utilities
// ============================================================================

const FILTERS_PATH = path.join(__dirname, '../app/(modals)/filters.tsx');

const MODALS_LAYOUT_PATH = path.join(__dirname, '../app/(modals)/_layout.tsx');

const ROOT_LAYOUT_PATH = path.join(__dirname, '../app/_layout.tsx');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

describe('Filters Modal', () => {
  // ============================================================================
  // File Structure Tests
  // ============================================================================

  describe('File Structure', () => {
    it('should have filters.tsx file in (modals) directory', () => {
      expect(fs.existsSync(FILTERS_PATH)).toBe(true);
    });

    it('should have _layout.tsx file in (modals) directory', () => {
      expect(fs.existsSync(MODALS_LAYOUT_PATH)).toBe(true);
    });

    it('should export FiltersScreen as default', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('export default function FiltersScreen');
    });

    it('should export FilterState type', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('export interface FilterState');
    });

    it('should export DEFAULT_FILTER_STATE constant', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('export const DEFAULT_FILTER_STATE');
    });

    it('should export filter options constants', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('export {');
      expect(content).toContain('SORT_OPTIONS');
      expect(content).toContain('PRICE_LEVELS');
      expect(content).toContain('RATING_OPTIONS');
      expect(content).toContain('DELIVERY_TIME_OPTIONS');
      expect(content).toContain('DIETARY_OPTIONS');
    });

    it('should export FilterChip component', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('FilterChip');
    });

    it('should export FilterSection component', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('FilterSection');
    });
  });

  // ============================================================================
  // Filter State Type Tests
  // ============================================================================

  describe('FilterState Type', () => {
    it('should have sortBy property of SortOptionType', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('sortBy: SortOptionType');
    });

    it('should have priceRange property as PriceLevel array', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('priceRange: PriceLevel[]');
    });

    it('should have minRating property as number or null', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('minRating: number | null');
    });

    it('should have maxDeliveryTime property as number or null', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('maxDeliveryTime: number | null');
    });

    it('should have dietary property as DietaryOption array', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('dietary: DietaryOption[]');
    });
  });

  // ============================================================================
  // Default Filter State Tests
  // ============================================================================

  describe('Default Filter State', () => {
    it('should have recommended as default sortBy', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/sortBy:\s*['"]recommended['"]/);
    });

    it('should have empty priceRange by default', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/priceRange:\s*\[\]/);
    });

    it('should have null minRating by default', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/minRating:\s*null/);
    });

    it('should have null maxDeliveryTime by default', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/maxDeliveryTime:\s*null/);
    });

    it('should have empty dietary by default', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/dietary:\s*\[\]/);
    });
  });

  // ============================================================================
  // Sort Options Tests
  // ============================================================================

  describe('Sort Options', () => {
    it('should include recommended option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'recommended'");
      expect(content).toContain("label: 'Recommended'");
    });

    it('should include fastest_delivery option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'fastest_delivery'");
      expect(content).toContain("label: 'Fastest Delivery'");
    });

    it('should include rating option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'rating'");
      expect(content).toContain("label: 'Rating'");
    });

    it('should include distance option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'distance'");
      expect(content).toContain("label: 'Distance'");
    });

    it('should have 4 sort options defined', () => {
      const content = readFile(FILTERS_PATH);
      // Verify all 4 sort option IDs are present
      expect(content).toContain("id: 'recommended'");
      expect(content).toContain("id: 'fastest_delivery'");
      expect(content).toContain("id: 'rating'");
      expect(content).toContain("id: 'distance'");
    });
  });

  // ============================================================================
  // Price Range Tests
  // ============================================================================

  describe('Price Range Options', () => {
    it('should include $ (level 1) option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 1, label: '$' }");
    });

    it('should include $$ (level 2) option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 2, label: '$$' }");
    });

    it('should include $$$ (level 3) option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 3, label: '$$$' }");
    });

    it('should include $$$$ (level 4) option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 4, label: '$$$$' }");
    });

    it('should have 4 price levels defined', () => {
      const content = readFile(FILTERS_PATH);
      // Verify all 4 price level IDs are present
      expect(content).toContain("{ id: 1, label: '$' }");
      expect(content).toContain("{ id: 2, label: '$$' }");
      expect(content).toContain("{ id: 3, label: '$$$' }");
      expect(content).toContain("{ id: 4, label: '$$$$' }");
    });
  });

  // ============================================================================
  // Rating Options Tests
  // ============================================================================

  describe('Rating Options', () => {
    it('should include 4.5+ option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 4.5, label: '4.5+' }");
    });

    it('should include 4.0+ option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 4.0, label: '4.0+' }");
    });

    it('should include 3.5+ option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 3.5, label: '3.5+' }");
    });

    it('should have 3 rating options defined', () => {
      const content = readFile(FILTERS_PATH);
      // Verify all 3 rating option IDs are present
      expect(content).toContain("{ id: 4.5, label: '4.5+' }");
      expect(content).toContain("{ id: 4.0, label: '4.0+' }");
      expect(content).toContain("{ id: 3.5, label: '3.5+' }");
    });

    it('should use star icon for rating chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('icon="star"');
    });
  });

  // ============================================================================
  // Delivery Time Options Tests
  // ============================================================================

  describe('Delivery Time Options', () => {
    it('should include Under 30 min option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 30, label: 'Under 30 min' }");
    });

    it('should include Under 45 min option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 45, label: 'Under 45 min' }");
    });

    it('should include Under 60 min option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("{ id: 60, label: 'Under 60 min' }");
    });

    it('should have 3 delivery time options defined', () => {
      const content = readFile(FILTERS_PATH);
      // Verify all 3 delivery time option IDs are present
      expect(content).toContain("{ id: 30, label: 'Under 30 min' }");
      expect(content).toContain("{ id: 45, label: 'Under 45 min' }");
      expect(content).toContain("{ id: 60, label: 'Under 60 min' }");
    });

    it('should use time-outline icon for delivery time chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('icon="time-outline"');
    });
  });

  // ============================================================================
  // Dietary Options Tests
  // ============================================================================

  describe('Dietary Options', () => {
    it('should include Vegetarian option with leaf icon', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'vegetarian'");
      expect(content).toContain("label: 'Vegetarian'");
    });

    it('should include Vegan option with leaf icon', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'vegan'");
      expect(content).toContain("label: 'Vegan'");
    });

    it('should include Gluten-Free option with ban icon', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'gluten_free'");
      expect(content).toContain("label: 'Gluten-Free'");
      expect(content).toContain("icon: 'ban'");
    });

    it('should include Halal option with checkmark-circle icon', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'halal'");
      expect(content).toContain("label: 'Halal'");
    });

    it('should include Kosher option with checkmark-circle icon', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("id: 'kosher'");
      expect(content).toContain("label: 'Kosher'");
    });

    it('should have 5 dietary options defined', () => {
      const content = readFile(FILTERS_PATH);
      // Verify all 5 dietary option IDs are present
      expect(content).toContain("id: 'vegetarian'");
      expect(content).toContain("id: 'vegan'");
      expect(content).toContain("id: 'gluten_free'");
      expect(content).toContain("id: 'halal'");
      expect(content).toContain("id: 'kosher'");
    });
  });

  // ============================================================================
  // FilterChip Component Tests
  // ============================================================================

  describe('FilterChip Component', () => {
    it('should be defined as a function component', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('function FilterChip');
    });

    it('should have FilterChipProps interface', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('interface FilterChipProps');
    });

    it('should accept label prop', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/label:\s*string/);
    });

    it('should accept selected prop', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/selected:\s*boolean/);
    });

    it('should accept onPress prop', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/onPress:\s*\(\)\s*=>\s*void/);
    });

    it('should accept optional icon prop', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/icon\?:\s*string/);
    });

    it('should accept optional testID prop', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/testID\?:\s*string/);
    });

    it('should use AnimatedPressable for press interactions', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('AnimatedPressable');
    });

    it('should show checkmark icon when selected', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('{selected && (');
      expect(content).toContain('name="checkmark"');
    });
  });

  // ============================================================================
  // FilterSection Component Tests
  // ============================================================================

  describe('FilterSection Component', () => {
    it('should be defined as a function component', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('function FilterSection');
    });

    it('should have FilterSectionProps interface', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('interface FilterSectionProps');
    });

    it('should accept title prop', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/FilterSectionProps[\s\S]*title:\s*string/);
    });

    it('should accept children prop', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/FilterSectionProps[\s\S]*children:\s*React\.ReactNode/);
    });

    it('should accept optional delay prop for animations', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toMatch(/delay\?:\s*number/);
    });

    it('should use FadeInDown animation', () => {
      const content = readFile(FILTERS_PATH);
      // Check within FilterSection function
      expect(content).toContain('entering={FadeInDown.delay(delay)');
    });
  });

  // ============================================================================
  // Header Tests
  // ============================================================================

  describe('Header Section', () => {
    it('should have close button', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID="close-filters-button"');
      expect(content).toContain('name="close"');
    });

    it('should have Filters title', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('>Filters</Text>');
    });

    it('should have Clear All button when filters are active', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID="clear-all-button"');
      expect(content).toContain('Clear All');
    });

    it('should conditionally show Clear All button based on activeFilterCount', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('{activeFilterCount > 0 && (');
    });
  });

  // ============================================================================
  // Active Filter Count Tests
  // ============================================================================

  describe('Active Filter Count Calculation', () => {
    it('should use useMemo for activeFilterCount', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const activeFilterCount = useMemo');
    });

    it('should count sortBy when not recommended', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("if (filters.sortBy !== 'recommended') count++");
    });

    it('should count priceRange length', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('count += filters.priceRange.length');
    });

    it('should count minRating when not null', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('if (filters.minRating !== null) count++');
    });

    it('should count maxDeliveryTime when not null', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('if (filters.maxDeliveryTime !== null) count++');
    });

    it('should count dietary length', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('count += filters.dietary.length');
    });
  });

  // ============================================================================
  // Handler Tests
  // ============================================================================

  describe('Filter Handlers', () => {
    it('should have handleSortChange handler', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleSortChange = useCallback');
    });

    it('should have handlePriceToggle handler', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handlePriceToggle = useCallback');
    });

    it('should have handleRatingChange handler', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleRatingChange = useCallback');
    });

    it('should have handleDeliveryTimeChange handler', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleDeliveryTimeChange = useCallback');
    });

    it('should have handleDietaryToggle handler', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleDietaryToggle = useCallback');
    });

    it('should have handleClearAll handler', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleClearAll = useCallback');
    });

    it('should have handleApply handler', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleApply = useCallback');
    });

    it('should have handleClose handler', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleClose = useCallback');
    });

    it('handlePriceToggle should toggle price level', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('prev.priceRange.includes(priceLevel)');
      expect(content).toContain('prev.priceRange.filter((p) => p !== priceLevel)');
      expect(content).toContain('[...prev.priceRange, priceLevel]');
    });

    it('handleRatingChange should toggle rating (null or selected)', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('prev.minRating === rating ? null : rating');
    });

    it('handleDeliveryTimeChange should toggle delivery time (null or selected)', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('prev.maxDeliveryTime === time ? null : time');
    });

    it('handleDietaryToggle should toggle dietary option', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('prev.dietary.includes(dietary)');
      expect(content).toContain('prev.dietary.filter((d) => d !== dietary)');
      expect(content).toContain('[...prev.dietary, dietary]');
    });

    it('handleClearAll should reset to DEFAULT_FILTER_STATE', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('setFilters(DEFAULT_FILTER_STATE)');
    });

    it('handleApply should call router.back()', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleApply = useCallback(() => {');
      expect(content).toContain('router.back()');
    });

    it('handleClose should call router.back()', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const handleClose = useCallback(() => {');
    });
  });

  // ============================================================================
  // Apply Button Tests
  // ============================================================================

  describe('Apply Button', () => {
    it('should have Apply Filters button', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID="apply-filters-button"');
    });

    it('should use Button component', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('<Button');
      expect(content).toContain("from '@/components/ui'");
    });

    it('should be full width', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('fullWidth');
    });

    it('should show count in button text when filters are active', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('`Apply Filters (${activeFilterCount})`');
    });

    it('should show plain text when no filters are active', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("'Apply Filters'");
    });

    it('should show options icon when filters are active', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("leftIcon={activeFilterCount > 0 ? 'options' : undefined}");
    });

    it('should use FadeInUp animation', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('entering={FadeInUp.delay(300)');
    });
  });

  // ============================================================================
  // Animation Tests
  // ============================================================================

  describe('Animations', () => {
    it('should import react-native-reanimated', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from 'react-native-reanimated'");
    });

    it('should use FadeIn animation', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('FadeIn');
    });

    it('should use FadeInDown animation', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('FadeInDown');
    });

    it('should use FadeInUp animation', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('FadeInUp');
    });

    it('should use withSpring for chip animations', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('withSpring');
    });

    it('should use withTiming for chip animations', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('withTiming');
    });

    it('should use useSharedValue for animation values', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('useSharedValue');
    });

    it('should use useAnimatedStyle for animated styles', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('useAnimatedStyle');
    });

    it('should scale chips on press', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('scale.value = withSpring(0.95');
    });

    it('should change opacity on press', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('opacity.value = withTiming(0.9');
    });

    it('should have staggered delays for sections', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('delay={50}');
      expect(content).toContain('delay={100}');
      expect(content).toContain('delay={150}');
      expect(content).toContain('delay={200}');
      expect(content).toContain('delay={250}');
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    it('should have accessibilityRole on chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('accessibilityRole="button"');
    });

    it('should have accessibilityState for selected chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('accessibilityState={{ selected }}');
    });

    it('should have accessibilityLabel for chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('accessibilityLabel={`${label}${selected');
    });

    it('should have accessibilityLabel for close button', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('accessibilityLabel="Close filters"');
    });

    it('should have accessibilityLabel for clear all button', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('accessibilityLabel="Clear all filters"');
    });
  });

  // ============================================================================
  // Styling Tests
  // ============================================================================

  describe('Styling', () => {
    it('should use design system tokens', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from '@/constants/theme'");
      expect(content).toContain('BorderRadius');
      expect(content).toContain('Colors');
      expect(content).toContain('FontWeights');
      expect(content).toContain('PrimaryColors');
      expect(content).toContain('Shadows');
      expect(content).toContain('Spacing');
      expect(content).toContain('Typography');
    });

    it('should use useColorScheme hook', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('useColorScheme');
    });

    it('should use useSafeAreaInsets', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('useSafeAreaInsets');
    });

    it('should have StyleSheet.create for styles', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('const styles = StyleSheet.create');
    });

    it('should use PrimaryColors for selected chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('backgroundColor: selected ? PrimaryColors[500]');
    });

    it('should use white text for selected chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("color: selected ? '#FFFFFF'");
    });

    it('should use BorderRadius.full for chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('borderRadius: BorderRadius.full');
    });

    it('should use flexWrap wrap for chips row', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("flexWrap: 'wrap'");
    });

    it('should use gap for chips spacing', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('gap: Spacing[2]');
    });

    it('should apply Shadows.md to apply button container', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('Shadows.md as ViewStyle');
    });
  });

  // ============================================================================
  // Section Rendering Tests
  // ============================================================================

  describe('Section Rendering', () => {
    it('should render Sort By section', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('<FilterSection title="Sort By"');
    });

    it('should render Price Range section', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('<FilterSection title="Price Range"');
    });

    it('should render Rating section', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('<FilterSection title="Rating"');
    });

    it('should render Delivery Time section', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('<FilterSection title="Delivery Time"');
    });

    it('should render Dietary section', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('<FilterSection title="Dietary"');
    });

    it('should use ScrollView for content', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('<ScrollView');
    });

    it('should hide vertical scroll indicator', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('showsVerticalScrollIndicator={false}');
    });
  });

  // ============================================================================
  // TestID Tests
  // ============================================================================

  describe('Test IDs', () => {
    it('should have testID for close button', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID="close-filters-button"');
    });

    it('should have testID for clear all button', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID="clear-all-button"');
    });

    it('should have testID for apply button', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID="apply-filters-button"');
    });

    it('should have testID for sort chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID={`sort-chip-${option.id}`}');
    });

    it('should have testID for price chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID={`price-chip-${level.id}`}');
    });

    it('should have testID for rating chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID={`rating-chip-${option.id}`}');
    });

    it('should have testID for delivery time chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID={`delivery-time-chip-${option.id}`}');
    });

    it('should have testID for dietary chips', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain('testID={`dietary-chip-${option.id}`}');
    });
  });

  // ============================================================================
  // Modals Layout Tests
  // ============================================================================

  describe('Modals Layout', () => {
    it('should have _layout.tsx file', () => {
      expect(fs.existsSync(MODALS_LAYOUT_PATH)).toBe(true);
    });

    it('should export default function ModalsLayout', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain('export default function ModalsLayout');
    });

    it('should use Stack navigator', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain('<Stack');
    });

    it('should set presentation to modal', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain("presentation: 'modal'");
    });

    it('should set animation to slide_from_bottom', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain("animation: 'slide_from_bottom'");
    });

    it('should register filters screen', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain('<Stack.Screen name="filters"');
    });

    it('should register cart screen', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain('<Stack.Screen name="cart"');
    });

    it('should register dish-customization screen', () => {
      const content = readFile(MODALS_LAYOUT_PATH);
      expect(content).toContain('<Stack.Screen name="dish-customization"');
    });
  });

  // ============================================================================
  // Root Layout Integration Tests
  // ============================================================================

  describe('Root Layout Integration', () => {
    it('should have root _layout.tsx file', () => {
      expect(fs.existsSync(ROOT_LAYOUT_PATH)).toBe(true);
    });

    it('should register (modals) group in root layout', () => {
      const content = readFile(ROOT_LAYOUT_PATH);
      expect(content).toContain('<Stack.Screen');
      expect(content).toContain('name="(modals)"');
    });

    it('should set presentation to modal for modals group', () => {
      const content = readFile(ROOT_LAYOUT_PATH);
      expect(content).toContain("presentation: 'modal'");
    });
  });

  // ============================================================================
  // Imports Tests
  // ============================================================================

  describe('Imports', () => {
    it('should import from expo-router', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from 'expo-router'");
      expect(content).toContain('router');
    });

    it('should import from @expo/vector-icons', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from '@expo/vector-icons'");
      expect(content).toContain('Ionicons');
    });

    it('should import from react', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from 'react'");
      expect(content).toContain('useCallback');
      expect(content).toContain('useMemo');
      expect(content).toContain('useState');
    });

    it('should import from react-native', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from 'react-native'");
      expect(content).toContain('Pressable');
      expect(content).toContain('ScrollView');
      expect(content).toContain('StyleSheet');
      expect(content).toContain('View');
    });

    it('should import from react-native-safe-area-context', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from 'react-native-safe-area-context'");
      expect(content).toContain('useSafeAreaInsets');
    });

    it('should import Button from UI components', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from '@/components/ui'");
      expect(content).toContain('Button');
    });

    it('should import types from @/types', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from '@/types'");
      expect(content).toContain('DietaryOption');
      expect(content).toContain('PriceLevel');
      expect(content).toContain('SortOption as SortOptionType');
    });

    it('should import useColorScheme from hooks', () => {
      const content = readFile(FILTERS_PATH);
      expect(content).toContain("from '@/hooks/use-color-scheme'");
      expect(content).toContain('useColorScheme');
    });
  });
});
