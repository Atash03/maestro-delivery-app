/**
 * Report Issue Screen Tests
 *
 * Comprehensive tests for the report issue functionality including:
 * - ReportIssueScreen component
 * - Issue category selection
 * - Order summary display
 * - Navigation and routing
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeEach, describe, expect, test } from '@jest/globals';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Report Issue - File Structure', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('Support issue directory exists', () => {
    const dirPath = path.join(srcPath, 'app/support/issue');
    expect(fs.existsSync(dirPath)).toBe(true);
  });

  test('Report issue screen file exists', () => {
    const screenPath = path.join(srcPath, 'app/support/issue/[orderId].tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });
});

// ============================================================================
// Report Issue Screen Tests
// ============================================================================

describe('Report Issue Screen', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/[orderId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports default ReportIssueScreen', () => {
      expect(content).toMatch(/export\s+default\s+function\s+ReportIssueScreen/);
    });

    test('exports ISSUE_CATEGORIES data', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*ISSUE_CATEGORIES/);
    });

    test('exports IssueCategoryOption type', () => {
      expect(content).toMatch(/export\s+type\s+\{[\s\S]*IssueCategoryOption/);
    });
  });

  describe('Type Definitions', () => {
    test('defines IssueCategoryOption interface', () => {
      expect(content).toMatch(/interface\s+IssueCategoryOption\s*\{/);
    });

    test('IssueCategoryOption has id property of type IssueCategory', () => {
      expect(content).toMatch(/id:\s*IssueCategory/);
    });

    test('IssueCategoryOption has title property', () => {
      expect(content).toMatch(/title:\s*string/);
    });

    test('IssueCategoryOption has description property', () => {
      expect(content).toMatch(/description:\s*string/);
    });

    test('IssueCategoryOption has icon property', () => {
      expect(content).toMatch(/icon:\s*keyof\s+typeof\s+Ionicons\.glyphMap/);
    });
  });

  describe('Issue Categories', () => {
    test('has Missing Items category', () => {
      expect(content).toMatch(/id:\s*['"]missing_items['"]/);
      expect(content).toMatch(/title:\s*['"]Missing Items['"]/);
    });

    test('has Wrong Items category', () => {
      expect(content).toMatch(/id:\s*['"]wrong_items['"]/);
      expect(content).toMatch(/title:\s*['"]Wrong Items['"]/);
    });

    test('has Food Quality category', () => {
      expect(content).toMatch(/id:\s*['"]food_quality['"]/);
      expect(content).toMatch(/title:\s*['"]Food Quality['"]/);
    });

    test('has Late Delivery category', () => {
      expect(content).toMatch(/id:\s*['"]late_delivery['"]/);
      expect(content).toMatch(/title:\s*['"]Late Delivery['"]/);
    });

    test('has Order Never Arrived category', () => {
      expect(content).toMatch(/id:\s*['"]order_never_arrived['"]/);
      expect(content).toMatch(/title:\s*['"]Order Never Arrived['"]/);
    });

    test('has Other category', () => {
      expect(content).toMatch(/id:\s*['"]other['"]/);
      expect(content).toMatch(/title:\s*['"]Other['"]/);
    });
  });

  describe('Issue Category Descriptions', () => {
    test('Missing Items has descriptive text', () => {
      expect(content).toMatch(/Some items were not included/i);
    });

    test('Wrong Items has descriptive text', () => {
      expect(content).toMatch(/received different items/i);
    });

    test('Food Quality has descriptive text', () => {
      expect(content).toMatch(/quality was not as expected/i);
    });

    test('Late Delivery has descriptive text', () => {
      expect(content).toMatch(/arrived later than estimated/i);
    });

    test('Order Never Arrived has descriptive text', () => {
      expect(content).toMatch(/never received my order/i);
    });

    test('Other has descriptive text', () => {
      expect(content).toMatch(/different issue/i);
    });
  });

  describe('Issue Category Icons', () => {
    test('Missing Items has bag-remove icon', () => {
      expect(content).toMatch(/icon:\s*['"]bag-remove-outline['"]/);
    });

    test('Wrong Items has swap icon', () => {
      expect(content).toMatch(/icon:\s*['"]swap-horizontal-outline['"]/);
    });

    test('Food Quality has thumbs-down icon', () => {
      expect(content).toMatch(/icon:\s*['"]thumbs-down-outline['"]/);
    });

    test('Late Delivery has time icon', () => {
      expect(content).toMatch(/icon:\s*['"]time-outline['"]/);
    });

    test('Order Never Arrived has close-circle icon', () => {
      expect(content).toMatch(/icon:\s*['"]close-circle-outline['"]/);
    });

    test('Other has help-circle icon', () => {
      expect(content).toMatch(/icon:\s*['"]help-circle-outline['"]/);
    });
  });

  describe('Navigation', () => {
    test('uses useRouter from expo-router', () => {
      expect(content).toMatch(/useRouter.*from\s+['"]expo-router['"]/);
    });

    test('uses useLocalSearchParams for orderId', () => {
      expect(content).toMatch(/useLocalSearchParams/);
      expect(content).toMatch(/orderId/);
    });

    test('has go back handler', () => {
      expect(content).toMatch(/handleGoBack/);
    });

    test('has back button', () => {
      expect(content).toMatch(/arrow-back/);
    });

    test('has continue handler', () => {
      expect(content).toMatch(/handleContinue/);
    });
  });

  describe('Order Summary', () => {
    test('has OrderSummaryCard component', () => {
      expect(content).toMatch(/function\s+OrderSummaryCard/);
    });

    test('displays restaurant name', () => {
      expect(content).toMatch(/restaurant\.name/);
    });

    test('displays restaurant image', () => {
      expect(content).toMatch(/restaurant\.image/);
    });

    test('displays order total', () => {
      expect(content).toMatch(/order\.total/);
    });

    test('displays order date', () => {
      expect(content).toMatch(/formattedDate/);
    });

    test('displays item count', () => {
      expect(content).toMatch(/itemCount/);
    });
  });

  describe('Category Selection', () => {
    test('has IssueCategoryCard component', () => {
      expect(content).toMatch(/function\s+IssueCategoryCard/);
    });

    test('has selectedCategory state', () => {
      expect(content).toMatch(/selectedCategory.*=.*useState/);
    });

    test('has handleSelectCategory handler', () => {
      expect(content).toMatch(/handleSelectCategory/);
    });

    test('shows radio button selection', () => {
      expect(content).toMatch(/radioOuter/);
      expect(content).toMatch(/radioInner/);
    });

    test('has isSelected prop on card', () => {
      expect(content).toMatch(/isSelected:\s*boolean/);
    });
  });

  describe('States', () => {
    test('has loading state', () => {
      expect(content).toMatch(/isLoading.*=.*useState/);
    });

    test('has order state', () => {
      expect(content).toMatch(/order.*=.*useState/);
    });

    test('shows loading container', () => {
      expect(content).toMatch(/loadingContainer/);
    });

    test('shows error container when order not found', () => {
      expect(content).toMatch(/errorContainer/);
    });

    test('displays Order Not Found message', () => {
      expect(content).toMatch(/Order Not Found/);
    });
  });

  describe('Bottom Action Button', () => {
    test('has continue button', () => {
      expect(content).toMatch(/continueButton/);
    });

    test('disables button when no category selected', () => {
      expect(content).toMatch(/disabled=\{!canContinue\}/);
    });

    test('has canContinue validation', () => {
      expect(content).toMatch(/canContinue.*=.*selectedCategory.*!==.*null/);
    });
  });

  describe('Data Fetching', () => {
    test('fetches order on mount', () => {
      expect(content).toMatch(/useEffect/);
    });

    test('uses getOrderById from mock data', () => {
      expect(content).toMatch(/getOrderById/);
    });

    test('simulates network delay', () => {
      expect(content).toMatch(/setTimeout/);
    });
  });

  describe('Animations', () => {
    test('uses react-native-reanimated', () => {
      expect(content).toMatch(/from\s+['"]react-native-reanimated['"]/);
    });

    test('uses FadeIn animation', () => {
      expect(content).toMatch(/FadeIn/);
    });

    test('uses FadeInDown animation', () => {
      expect(content).toMatch(/FadeInDown/);
    });

    test('uses FadeOut animation', () => {
      expect(content).toMatch(/FadeOut/);
    });

    test('uses withSpring for smooth animations', () => {
      expect(content).toMatch(/withSpring/);
    });

    test('uses useSharedValue', () => {
      expect(content).toMatch(/useSharedValue/);
    });

    test('uses useAnimatedStyle', () => {
      expect(content).toMatch(/useAnimatedStyle/);
    });

    test('animates scale on press', () => {
      expect(content).toMatch(/scale.*=.*useSharedValue/);
    });
  });

  describe('Styling', () => {
    test('uses design system Colors', () => {
      expect(content).toMatch(/Colors\[colorScheme/);
    });

    test('uses Spacing tokens', () => {
      expect(content).toMatch(/Spacing\[/);
    });

    test('uses BorderRadius tokens', () => {
      expect(content).toMatch(/BorderRadius\./);
    });

    test('uses Typography tokens', () => {
      expect(content).toMatch(/Typography\./);
    });

    test('uses FontWeights tokens', () => {
      expect(content).toMatch(/FontWeights\./);
    });

    test('uses Shadows', () => {
      expect(content).toMatch(/Shadows\./);
    });

    test('uses AnimationDurations', () => {
      expect(content).toMatch(/AnimationDurations\./);
    });
  });

  describe('UI Components', () => {
    test('uses Card component', () => {
      expect(content).toMatch(/import.*Card.*from\s+['"]@\/components\/ui['"]/);
    });

    test('uses Ionicons', () => {
      expect(content).toMatch(/from\s+['"]@expo\/vector-icons['"]/);
    });

    test('uses useSafeAreaInsets', () => {
      expect(content).toMatch(/useSafeAreaInsets/);
    });

    test('uses useColorScheme', () => {
      expect(content).toMatch(/useColorScheme/);
    });

    test('uses Image component', () => {
      expect(content).toMatch(/Image[\s\S]*from\s+['"]react-native['"]/);
    });
  });

  describe('Accessibility', () => {
    test('has accessibilityRole on buttons', () => {
      expect(content).toMatch(/accessibilityRole="button"/);
    });

    test('has accessibilityRole radio on category cards', () => {
      expect(content).toMatch(/accessibilityRole="radio"/);
    });

    test('has accessibilityLabel on back button', () => {
      expect(content).toMatch(/accessibilityLabel="Go back"/);
    });

    test('has accessibilityState for selected', () => {
      expect(content).toMatch(/accessibilityState=\{\s*\{\s*selected:/);
    });

    test('has accessibilityState for disabled', () => {
      expect(content).toMatch(/accessibilityState=\{\s*\{\s*disabled:/);
    });
  });

  describe('Section Headers', () => {
    test('has section label for order', () => {
      expect(content).toMatch(/REPORTING ISSUE FOR/);
    });

    test('has section title asking what went wrong', () => {
      expect(content).toMatch(/What went wrong\?/);
    });

    test('has section subtitle for category selection', () => {
      expect(content).toMatch(/Select the category that best describes/);
    });
  });

  describe('Help Note', () => {
    test('has help note section', () => {
      expect(content).toMatch(/helpNote/);
    });

    test('displays informational text', () => {
      expect(content).toMatch(/After selecting a category/);
    });

    test('has information icon', () => {
      expect(content).toMatch(/information-circle-outline/);
    });
  });
});

// ============================================================================
// Support Layout Tests (Updated)
// ============================================================================

describe('Support Layout - Issue Routes', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/support/_layout.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(layoutPath, 'utf-8');
  });

  test('defines issue/[orderId] screen', () => {
    expect(content).toMatch(/name="issue\/\[orderId\]"/);
  });

  test('issue screen has card presentation', () => {
    expect(content).toMatch(/issue\/\[orderId\][\s\S]*presentation:\s*['"]card['"]/);
  });

  test('defines issue/details screen for future task', () => {
    expect(content).toMatch(/name="issue\/details"/);
  });

  test('defines issue/status/[issueId] screen for future task', () => {
    expect(content).toMatch(/name="issue\/status\/\[issueId\]"/);
  });
});

// ============================================================================
// Component Structure Tests
// ============================================================================

describe('Report Issue Component Structure', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/[orderId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('IssueCategoryCard Component', () => {
    test('has IssueCategoryCardProps interface', () => {
      expect(content).toMatch(/interface\s+IssueCategoryCardProps/);
    });

    test('has category prop', () => {
      expect(content).toMatch(/category:\s*IssueCategoryOption/);
    });

    test('has isSelected prop', () => {
      expect(content).toMatch(/isSelected:\s*boolean/);
    });

    test('has onSelect prop', () => {
      expect(content).toMatch(/onSelect:\s*\(\)\s*=>/);
    });

    test('uses press animation', () => {
      expect(content).toMatch(/handlePressIn/);
      expect(content).toMatch(/handlePressOut/);
    });
  });

  describe('OrderSummaryCard Component', () => {
    test('has OrderSummaryCardProps interface', () => {
      expect(content).toMatch(/interface\s+OrderSummaryCardProps/);
    });

    test('has order prop', () => {
      expect(content).toMatch(/order:\s*Order/);
    });

    test('formats date with useMemo', () => {
      expect(content).toMatch(/formattedDate.*=.*useMemo/);
    });

    test('calculates item count with useMemo', () => {
      expect(content).toMatch(/itemCount.*=.*useMemo/);
    });
  });
});

// ============================================================================
// Data Structure Tests
// ============================================================================

describe('Issue Categories Data Structure', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/[orderId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('ISSUE_CATEGORIES is an array', () => {
    expect(content).toMatch(/const\s+ISSUE_CATEGORIES:\s*IssueCategoryOption\[\]/);
  });

  test('has exactly 6 issue categories', () => {
    const idMatches =
      content.match(
        /id:\s*['"](?:missing_items|wrong_items|food_quality|late_delivery|order_never_arrived|other)['"]/g
      ) || [];
    expect(idMatches.length).toBe(6);
  });

  test('imports IssueCategory type from types', () => {
    expect(content).toMatch(/import.*IssueCategory.*from\s+['"]@\/types['"]/);
  });

  test('imports Order type from types', () => {
    expect(content).toMatch(/import.*Order.*from\s+['"]@\/types['"]/);
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Report Issue Performance', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/[orderId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('uses useCallback for handlers', () => {
    expect(content).toMatch(/useCallback/);
  });

  test('uses useMemo for computed values', () => {
    expect(content).toMatch(/useMemo/);
  });

  test('memoizes go back handler', () => {
    expect(content).toMatch(/handleGoBack.*=.*useCallback/);
  });

  test('memoizes select category handler', () => {
    expect(content).toMatch(/handleSelectCategory.*=.*useCallback/);
  });

  test('memoizes continue handler', () => {
    expect(content).toMatch(/handleContinue.*=.*useCallback/);
  });
});

// ============================================================================
// Scroll and Layout Tests
// ============================================================================

describe('Report Issue Scroll and Layout', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/[orderId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('uses ScrollView', () => {
    expect(content).toMatch(/ScrollView/);
  });

  test('hides vertical scroll indicator', () => {
    expect(content).toMatch(/showsVerticalScrollIndicator=\{false\}/);
  });

  test('persists taps on keyboard', () => {
    expect(content).toMatch(/keyboardShouldPersistTaps="handled"/);
  });

  test('respects safe area insets', () => {
    expect(content).toMatch(/insets\.top/);
    expect(content).toMatch(/insets\.bottom/);
  });

  test('has bottom container for action button', () => {
    expect(content).toMatch(/bottomContainer/);
  });

  test('bottom container has border top', () => {
    expect(content).toMatch(/borderTopColor/);
  });
});

// ============================================================================
// Type Integration Tests
// ============================================================================

describe('Type Integration', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/[orderId].tsx');
  const typesPath = path.join(process.cwd(), 'src/types/index.ts');
  let screenContent: string;
  let typesContent: string;

  beforeEach(() => {
    screenContent = fs.readFileSync(screenPath, 'utf-8');
    typesContent = fs.readFileSync(typesPath, 'utf-8');
  });

  test('IssueCategory type exists in types', () => {
    expect(typesContent).toMatch(/export\s+type\s+IssueCategory/);
  });

  test('IssueCategory includes missing_items', () => {
    expect(typesContent).toMatch(/missing_items/);
  });

  test('IssueCategory includes wrong_items', () => {
    expect(typesContent).toMatch(/wrong_items/);
  });

  test('IssueCategory includes food_quality', () => {
    expect(typesContent).toMatch(/food_quality/);
  });

  test('IssueCategory includes late_delivery', () => {
    expect(typesContent).toMatch(/late_delivery/);
  });

  test('IssueCategory includes order_never_arrived', () => {
    expect(typesContent).toMatch(/order_never_arrived/);
  });

  test('IssueCategory includes other', () => {
    expect(typesContent).toMatch(/other/);
  });

  test('screen uses IssueCategory type correctly', () => {
    expect(screenContent).toMatch(/selectedCategory.*IssueCategory\s*\|\s*null/);
  });
});

// ============================================================================
// Mock Data Integration Tests
// ============================================================================

describe('Mock Data Integration', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/[orderId].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('imports getOrderById from mock data', () => {
    expect(content).toMatch(/import.*getOrderById.*from\s+['"]@\/data\/mock\/orders['"]/);
  });

  test('uses orderId from params', () => {
    expect(content).toMatch(/getOrderById\(orderId/);
  });
});
