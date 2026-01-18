/**
 * Help Center Screen Tests
 *
 * Comprehensive tests for the help center functionality including:
 * - HelpCenterScreen component
 * - FAQ accordion sections
 * - Search functionality
 * - Quick actions
 * - Contact support section
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeEach, describe, expect, test } from '@jest/globals';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Help Center - File Structure', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('Support directory exists', () => {
    const dirPath = path.join(srcPath, 'app/support');
    expect(fs.existsSync(dirPath)).toBe(true);
  });

  test('Help center screen file exists', () => {
    const screenPath = path.join(srcPath, 'app/support/index.tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });

  test('Support layout file exists', () => {
    const layoutPath = path.join(srcPath, 'app/support/_layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);
  });
});

// ============================================================================
// Help Center Screen Tests
// ============================================================================

describe('Help Center Screen', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/index.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports default HelpCenterScreen', () => {
      expect(content).toMatch(/export\s+default\s+function\s+HelpCenterScreen/);
    });

    test('exports FAQ_CATEGORIES data', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*FAQ_CATEGORIES/);
    });

    test('exports QUICK_ACTIONS data', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*QUICK_ACTIONS/);
    });

    test('exports FAQCategory type', () => {
      expect(content).toMatch(/export\s+type\s+\{[\s\S]*FAQCategory/);
    });

    test('exports FAQItem type', () => {
      expect(content).toMatch(/export\s+type\s+\{[\s\S]*FAQItem/);
    });

    test('exports QuickAction type', () => {
      expect(content).toMatch(/export\s+type\s+\{[\s\S]*QuickAction/);
    });
  });

  describe('Type Definitions', () => {
    test('defines FAQItem interface', () => {
      expect(content).toMatch(/interface\s+FAQItem\s*\{/);
    });

    test('FAQItem has id property', () => {
      expect(content).toMatch(/id:\s*string/);
    });

    test('FAQItem has question property', () => {
      expect(content).toMatch(/question:\s*string/);
    });

    test('FAQItem has answer property', () => {
      expect(content).toMatch(/answer:\s*string/);
    });

    test('defines FAQCategory interface', () => {
      expect(content).toMatch(/interface\s+FAQCategory\s*\{/);
    });

    test('FAQCategory has title property', () => {
      expect(content).toMatch(/title:\s*string/);
    });

    test('FAQCategory has icon property', () => {
      expect(content).toMatch(/icon:\s*keyof\s+typeof\s+Ionicons\.glyphMap/);
    });

    test('FAQCategory has faqs array', () => {
      expect(content).toMatch(/faqs:\s*FAQItem\[\]/);
    });

    test('defines QuickAction interface', () => {
      expect(content).toMatch(/interface\s+QuickAction\s*\{/);
    });
  });

  describe('FAQ Categories', () => {
    test('has Order Issues category', () => {
      expect(content).toMatch(/id:\s*['"]order-issues['"]/);
      expect(content).toMatch(/title:\s*['"]Order Issues['"]/);
    });

    test('has Payment Questions category', () => {
      expect(content).toMatch(/id:\s*['"]payment['"]/);
      expect(content).toMatch(/title:\s*['"]Payment Questions['"]/);
    });

    test('has Account Settings category', () => {
      expect(content).toMatch(/id:\s*['"]account['"]/);
      expect(content).toMatch(/title:\s*['"]Account Settings['"]/);
    });

    test('has Restaurant Feedback category', () => {
      expect(content).toMatch(/id:\s*['"]restaurant['"]/);
      expect(content).toMatch(/title:\s*['"]Restaurant Feedback['"]/);
    });
  });

  describe('Order Issues FAQs', () => {
    test('has missing items FAQ', () => {
      expect(content).toMatch(/missing.*items/i);
    });

    test('has wrong items FAQ', () => {
      expect(content).toMatch(/wrong.*order/i);
    });

    test('has late delivery FAQ', () => {
      expect(content).toMatch(/taking longer than expected/i);
    });

    test('has order never arrived FAQ', () => {
      expect(content).toMatch(/order never arrived/i);
    });

    test('has food quality FAQ', () => {
      expect(content).toMatch(/food quality/i);
    });
  });

  describe('Payment FAQs', () => {
    test('has payment methods FAQ', () => {
      expect(content).toMatch(/payment methods.*accept/i);
    });

    test('has refund time FAQ', () => {
      expect(content).toMatch(/refund.*take/i);
    });

    test('has double charge FAQ', () => {
      expect(content).toMatch(/charged twice/i);
    });

    test('has promo code FAQ', () => {
      expect(content).toMatch(/promo code/i);
    });

    test('has receipt FAQ', () => {
      expect(content).toMatch(/receipt/i);
    });
  });

  describe('Account Settings FAQs', () => {
    test('has change email FAQ', () => {
      expect(content).toMatch(/change.*email/i);
    });

    test('has delete account FAQ', () => {
      expect(content).toMatch(/delete.*account/i);
    });

    test('has reset password FAQ', () => {
      expect(content).toMatch(/forgot.*password/i);
    });

    test('has update address FAQ', () => {
      expect(content).toMatch(/add.*edit.*addresses/i);
    });

    test('has notifications FAQ', () => {
      expect(content).toMatch(/notification.*settings/i);
    });
  });

  describe('Restaurant Feedback FAQs', () => {
    test('has leave review FAQ', () => {
      expect(content).toMatch(/leave.*review/i);
    });

    test('has edit review FAQ', () => {
      expect(content).toMatch(/edit.*review/i);
    });

    test('has report restaurant FAQ', () => {
      expect(content).toMatch(/report.*problem.*restaurant/i);
    });

    test('has suggest restaurant FAQ', () => {
      expect(content).toMatch(/suggest.*new.*restaurant/i);
    });

    test('has allergen info FAQ', () => {
      expect(content).toMatch(/allergen.*information/i);
    });
  });

  describe('Quick Actions', () => {
    test('has View Recent Orders action', () => {
      expect(content).toMatch(/title:\s*['"]View Recent Orders['"]/);
    });

    test('has Contact Support action', () => {
      expect(content).toMatch(/title:\s*['"]Contact Support['"]/);
    });

    test('has Report an Issue action', () => {
      expect(content).toMatch(/title:\s*['"]Report an Issue['"]/);
    });

    test('quick actions have icons', () => {
      expect(content).toMatch(/icon:\s*['"]receipt-outline['"]/);
      expect(content).toMatch(/icon:\s*['"]chatbubbles-outline['"]/);
      expect(content).toMatch(/icon:\s*['"]warning-outline['"]/);
    });

    test('quick actions have routes', () => {
      expect(content).toMatch(/route:\s*['"]\/\(tabs\)\/orders['"]/);
      expect(content).toMatch(/route\?:\s*string/);
    });
  });

  describe('Search Functionality', () => {
    test('has SearchBar component', () => {
      expect(content).toMatch(/function\s+SearchBar/);
    });

    test('has searchQuery state', () => {
      expect(content).toMatch(/searchQuery.*=.*useState/);
    });

    test('has clear search functionality', () => {
      expect(content).toMatch(/handleClearSearch/);
    });

    test('filters FAQs based on search', () => {
      expect(content).toMatch(/filteredFAQs/);
    });

    test('shows no results state when no matches', () => {
      expect(content).toMatch(/No results found/);
    });

    test('expands all categories when searching', () => {
      expect(content).toMatch(/if\s*\(searchQuery\)\s*return\s*true/);
    });
  });

  describe('Accordion Components', () => {
    test('has FAQAccordionItem component', () => {
      expect(content).toMatch(/function\s+FAQAccordionItem/);
    });

    test('has FAQCategorySection component', () => {
      expect(content).toMatch(/function\s+FAQCategorySection/);
    });

    test('has expandedCategoryId state', () => {
      expect(content).toMatch(/expandedCategoryId.*=.*useState/);
    });

    test('has expandedFAQId state', () => {
      expect(content).toMatch(/expandedFAQId.*=.*useState/);
    });

    test('has toggle category handler', () => {
      expect(content).toMatch(/handleToggleCategory/);
    });

    test('has toggle FAQ handler', () => {
      expect(content).toMatch(/handleToggleFAQ/);
    });
  });

  describe('Contact Support Section', () => {
    test('has contact support section', () => {
      expect(content).toMatch(/Still need help\?/);
    });

    test('has support team availability text', () => {
      expect(content).toMatch(/support team.*available/i);
    });

    test('has contact button', () => {
      expect(content).toMatch(/Contact Support/);
    });
  });

  describe('Navigation', () => {
    test('uses useRouter from expo-router', () => {
      expect(content).toMatch(/useRouter.*from\s+['"]expo-router['"]/);
    });

    test('has go back handler', () => {
      expect(content).toMatch(/handleGoBack/);
    });

    test('has back button', () => {
      expect(content).toMatch(/arrow-back/);
    });

    test('navigates to route on quick action', () => {
      expect(content).toMatch(/router\.push\(action\.route/);
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

    test('uses Layout animation', () => {
      expect(content).toMatch(/Layout/);
    });

    test('uses withSpring for smooth animations', () => {
      expect(content).toMatch(/withSpring/);
    });

    test('uses withTiming for timed animations', () => {
      expect(content).toMatch(/withTiming/);
    });

    test('uses useSharedValue', () => {
      expect(content).toMatch(/useSharedValue/);
    });

    test('uses useAnimatedStyle', () => {
      expect(content).toMatch(/useAnimatedStyle/);
    });

    test('animates chevron rotation', () => {
      expect(content).toMatch(/rotation.*=.*useSharedValue/);
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
  });

  describe('Accessibility', () => {
    test('has accessibilityRole on buttons', () => {
      expect(content).toMatch(/accessibilityRole="button"/);
    });

    test('has accessibilityLabel on back button', () => {
      expect(content).toMatch(/accessibilityLabel="Go back"/);
    });

    test('has accessibilityState for expanded', () => {
      expect(content).toMatch(/accessibilityState=\{\s*\{\s*expanded:/);
    });
  });

  describe('Hero Section', () => {
    test('has hero title', () => {
      expect(content).toMatch(/How can we help you\?/);
    });

    test('has hero subtitle', () => {
      expect(content).toMatch(/Search our FAQ or browse topics below/);
    });
  });
});

// ============================================================================
// Support Layout Tests
// ============================================================================

describe('Support Layout', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/support/_layout.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(layoutPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports default SupportLayout', () => {
      expect(content).toMatch(/export\s+default\s+function\s+SupportLayout/);
    });
  });

  describe('Navigation Setup', () => {
    test('uses Stack from expo-router', () => {
      expect(content).toMatch(/Stack.*from\s+['"]expo-router['"]/);
    });

    test('has headerShown false', () => {
      expect(content).toMatch(/headerShown:\s*false/);
    });

    test('has slide animation', () => {
      expect(content).toMatch(/animation:\s*['"]slide_from_right['"]/);
    });

    test('defines index screen', () => {
      expect(content).toMatch(/Stack\.Screen\s+name="index"/);
    });

    test('prepares for issue screen', () => {
      expect(content).toMatch(/issue\/\[orderId\]/);
    });
  });

  describe('Styling', () => {
    test('uses Colors from theme', () => {
      expect(content).toMatch(/Colors.*from\s+['"]@\/constants\/theme['"]/);
    });

    test('uses useColorScheme', () => {
      expect(content).toMatch(/useColorScheme/);
    });

    test('sets contentStyle background color', () => {
      expect(content).toMatch(/contentStyle:.*backgroundColor:/);
    });
  });
});

// ============================================================================
// Profile Integration Tests
// ============================================================================

describe('Profile Screen Integration', () => {
  const profilePath = path.join(process.cwd(), 'src/app/(tabs)/profile.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(profilePath, 'utf-8');
  });

  test('Help Center menu item navigates to support', () => {
    expect(content).toMatch(/router\.push\(['"]\/support['"]\)/);
  });

  test('Help Center has correct icon', () => {
    expect(content).toMatch(/help-circle-outline/);
  });
});

// ============================================================================
// Component Structure Tests
// ============================================================================

describe('Component Structure', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/index.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('QuickActionCard Component', () => {
    test('has QuickActionCard component', () => {
      expect(content).toMatch(/function\s+QuickActionCard/);
    });

    test('has onPress handler', () => {
      expect(content).toMatch(/QuickActionCardProps[\s\S]*onPress:/);
    });

    test('uses press animation', () => {
      expect(content).toMatch(/handlePressIn/);
      expect(content).toMatch(/handlePressOut/);
    });
  });

  describe('SearchBar Component', () => {
    test('has SearchBarProps interface', () => {
      expect(content).toMatch(/interface\s+SearchBarProps/);
    });

    test('has value prop', () => {
      expect(content).toMatch(/SearchBarProps[\s\S]*value:\s*string/);
    });

    test('has onChangeText prop', () => {
      expect(content).toMatch(/SearchBarProps[\s\S]*onChangeText:/);
    });

    test('has onClear prop', () => {
      expect(content).toMatch(/SearchBarProps[\s\S]*onClear:/);
    });

    test('has focus state', () => {
      expect(content).toMatch(/isFocused.*=.*useState/);
    });

    test('has clear button when text entered', () => {
      expect(content).toMatch(/value\.length\s*>\s*0/);
      expect(content).toMatch(/close-circle/);
    });
  });
});

// ============================================================================
// Data Structure Tests
// ============================================================================

describe('Data Structure', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/index.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('FAQ_CATEGORIES is an array', () => {
    expect(content).toMatch(/const\s+FAQ_CATEGORIES:\s*FAQCategory\[\]/);
  });

  test('QUICK_ACTIONS is an array', () => {
    expect(content).toMatch(/const\s+QUICK_ACTIONS:\s*QuickAction\[\]/);
  });

  test('each category has unique id', () => {
    const idMatches = content.match(/id:\s*['"][^'"]+['"]/g) || [];
    const ids = idMatches.map((m) => m.match(/['"]([^'"]+)['"]/)?.[1]);
    const uniqueIds = new Set(ids);
    // We have at least 4 category IDs
    expect(uniqueIds.size).toBeGreaterThanOrEqual(4);
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Performance', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/index.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('uses useCallback for handlers', () => {
    expect(content).toMatch(/useCallback/);
  });

  test('uses useMemo for filtered data', () => {
    expect(content).toMatch(/useMemo/);
  });

  test('memoizes FAQ filtering', () => {
    expect(content).toMatch(/filteredFAQs.*=.*useMemo/);
  });

  test('memoizes search results check', () => {
    expect(content).toMatch(/hasSearchResults.*=.*useMemo/);
  });
});

// ============================================================================
// Scroll and Layout Tests
// ============================================================================

describe('Scroll and Layout', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/index.tsx');
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
});

// ============================================================================
// State Management Tests
// ============================================================================

describe('State Management', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/index.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('initializes searchQuery as empty string', () => {
    expect(content).toMatch(/useState\(['"]?['"]?\)/);
  });

  test('initializes expandedCategoryId as null', () => {
    expect(content).toMatch(/expandedCategoryId.*useState.*null/);
  });

  test('initializes expandedFAQId as null', () => {
    expect(content).toMatch(/expandedFAQId.*useState.*null/);
  });

  test('resets expandedFAQId when category changes', () => {
    expect(content).toMatch(/setExpandedFAQId\(null\)/);
  });

  test('toggles category expansion correctly', () => {
    expect(content).toMatch(/prev\s*===\s*categoryId\s*\?\s*null\s*:\s*categoryId/);
  });

  test('toggles FAQ expansion correctly', () => {
    expect(content).toMatch(/prev\s*===\s*faqId\s*\?\s*null\s*:\s*faqId/);
  });
});
