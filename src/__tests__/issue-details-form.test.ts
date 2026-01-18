/**
 * Issue Details Form Screen Tests
 *
 * Comprehensive tests for the issue details form functionality including:
 * - IssueDetailsScreen component
 * - Category display
 * - Item selection (for missing/wrong items)
 * - Description text area
 * - Photo upload
 * - Form validation
 * - Submission flow
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeEach, describe, expect, test } from '@jest/globals';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Issue Details Form - File Structure', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('Issue details form file exists', () => {
    const screenPath = path.join(srcPath, 'app/support/issue/details.tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });
});

// ============================================================================
// Issue Details Screen Tests
// ============================================================================

describe('Issue Details Screen', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports default IssueDetailsScreen', () => {
      expect(content).toMatch(/export\s+default\s+function\s+IssueDetailsScreen/);
    });

    test('exports CATEGORY_TITLES constant', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*CATEGORY_TITLES/);
    });

    test('exports CATEGORY_DESCRIPTIONS constant', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*CATEGORY_DESCRIPTIONS/);
    });

    test('exports MAX_PHOTOS constant', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*MAX_PHOTOS/);
    });

    test('exports MAX_DESCRIPTION_LENGTH constant', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*MAX_DESCRIPTION_LENGTH/);
    });

    test('exports MIN_DESCRIPTION_LENGTH constant', () => {
      expect(content).toMatch(/export\s+\{[\s\S]*MIN_DESCRIPTION_LENGTH/);
    });
  });

  describe('Constants', () => {
    test('MAX_PHOTOS is set to 3', () => {
      expect(content).toMatch(/MAX_PHOTOS\s*=\s*3/);
    });

    test('MAX_DESCRIPTION_LENGTH is set to 1000', () => {
      expect(content).toMatch(/MAX_DESCRIPTION_LENGTH\s*=\s*1000/);
    });

    test('MIN_DESCRIPTION_LENGTH is set to 10', () => {
      expect(content).toMatch(/MIN_DESCRIPTION_LENGTH\s*=\s*10/);
    });
  });

  describe('Category Titles', () => {
    test('has title for missing_items', () => {
      expect(content).toMatch(/missing_items:\s*['"]Missing Items['"]/);
    });

    test('has title for wrong_items', () => {
      expect(content).toMatch(/wrong_items:\s*['"]Wrong Items['"]/);
    });

    test('has title for food_quality', () => {
      expect(content).toMatch(/food_quality:\s*['"]Food Quality['"]/);
    });

    test('has title for late_delivery', () => {
      expect(content).toMatch(/late_delivery:\s*['"]Late Delivery['"]/);
    });

    test('has title for order_never_arrived', () => {
      expect(content).toMatch(/order_never_arrived:\s*['"]Order Never Arrived['"]/);
    });

    test('has title for other', () => {
      expect(content).toMatch(/other:\s*['"]Other Issue['"]/);
    });
  });

  describe('Category Descriptions', () => {
    test('has description for missing_items', () => {
      expect(content).toMatch(/missing_items:\s*['"]Select the items that were missing/);
    });

    test('has description for wrong_items', () => {
      expect(content).toMatch(/wrong_items:\s*['"]Select the items that were incorrect/);
    });

    test('has description for food_quality', () => {
      expect(content).toMatch(/food_quality:\s*['"]Describe the quality issue/);
    });

    test('has description for late_delivery', () => {
      expect(content).toMatch(/late_delivery:\s*['"]Tell us about your late delivery/);
    });

    test('has description for order_never_arrived', () => {
      expect(content).toMatch(
        /order_never_arrived:\s*['"]Provide details about your missing order/
      );
    });

    test('has description for other', () => {
      expect(content).toMatch(/other:\s*['"]Describe your issue in detail/);
    });
  });
});

// ============================================================================
// Navigation Tests
// ============================================================================

describe('Issue Details Navigation', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('uses useRouter from expo-router', () => {
    expect(content).toMatch(/useRouter.*from\s+['"]expo-router['"]/);
  });

  test('uses useLocalSearchParams for orderId and category', () => {
    expect(content).toMatch(/useLocalSearchParams/);
    expect(content).toMatch(/orderId/);
    expect(content).toMatch(/category/);
  });

  test('has go back handler', () => {
    expect(content).toMatch(/handleGoBack/);
  });

  test('has back button', () => {
    expect(content).toMatch(/arrow-back/);
  });

  test('navigates to issue status screen on success', () => {
    expect(content).toMatch(/\/support\/issue\/status\/\[issueId\]/);
  });
});

// ============================================================================
// Item Selection Tests
// ============================================================================

describe('Item Selection', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has ItemCheckbox component', () => {
    expect(content).toMatch(/function\s+ItemCheckbox/);
  });

  test('ItemCheckbox has item prop', () => {
    expect(content).toMatch(/item:\s*CartItem/);
  });

  test('ItemCheckbox has isSelected prop', () => {
    expect(content).toMatch(/isSelected:\s*boolean/);
  });

  test('ItemCheckbox has onToggle prop', () => {
    expect(content).toMatch(/onToggle:\s*\(\)\s*=>/);
  });

  test('has selectedItems state', () => {
    expect(content).toMatch(/selectedItems.*=.*useState/);
  });

  test('has handleToggleItem handler', () => {
    expect(content).toMatch(/handleToggleItem/);
  });

  test('shows item selection only for missing/wrong items', () => {
    expect(content).toMatch(
      /showItemSelection.*=.*category\s*===\s*['"]missing_items['"].*\|\|.*category\s*===\s*['"]wrong_items['"]/
    );
  });

  test('checkbox has proper accessibility role', () => {
    expect(content).toMatch(/accessibilityRole="checkbox"/);
  });

  test('checkbox has accessibilityState for checked', () => {
    expect(content).toMatch(/accessibilityState=\{\s*\{\s*checked:/);
  });

  test('displays item name', () => {
    expect(content).toMatch(/item\.menuItem\.name/);
  });

  test('displays item quantity', () => {
    expect(content).toMatch(/item\.quantity/);
  });

  test('displays item price', () => {
    expect(content).toMatch(/item\.totalPrice/);
  });
});

// ============================================================================
// Description Tests
// ============================================================================

describe('Description Text Area', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has description state', () => {
    expect(content).toMatch(/description.*=.*useState/);
  });

  test('uses TextInput for description', () => {
    expect(content).toMatch(/TextInput[\s\S]*multiline/);
  });

  test('has max length on TextInput', () => {
    expect(content).toMatch(/maxLength=\{MAX_DESCRIPTION_LENGTH\}/);
  });

  test('has placeholder text', () => {
    expect(content).toMatch(/placeholder.*Tell us what went wrong/);
  });

  test('shows character count', () => {
    expect(content).toMatch(/description\.length.*\/.*MAX_DESCRIPTION_LENGTH/);
  });

  test('validates minimum description length', () => {
    expect(content).toMatch(
      /isDescriptionValid.*=.*description\.trim\(\)\.length\s*>=\s*MIN_DESCRIPTION_LENGTH/
    );
  });

  test('has proper accessibility label', () => {
    expect(content).toMatch(/accessibilityLabel="Issue description"/);
  });
});

// ============================================================================
// Photo Upload Tests
// ============================================================================

describe('Photo Upload', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has PhotoPicker component', () => {
    expect(content).toMatch(/function\s+PhotoPicker/);
  });

  test('has photos state', () => {
    expect(content).toMatch(/photos.*=.*useState/);
  });

  test('has handleAddPhoto handler', () => {
    expect(content).toMatch(/handleAddPhoto/);
  });

  test('has handleRemovePhoto handler', () => {
    expect(content).toMatch(/handleRemovePhoto/);
  });

  test('imports expo-image-picker', () => {
    expect(content).toMatch(/from\s+['"]expo-image-picker['"]/);
  });

  test('requests media library permissions', () => {
    expect(content).toMatch(/requestMediaLibraryPermissionsAsync/);
  });

  test('uses launchImageLibraryAsync', () => {
    expect(content).toMatch(/launchImageLibraryAsync/);
  });

  test('limits photos to MAX_PHOTOS', () => {
    expect(content).toMatch(/photos\.length\s*>=\s*MAX_PHOTOS/);
  });

  test('shows photo count', () => {
    expect(content).toMatch(/photos\.length.*\/.*MAX_PHOTOS/);
  });

  test('has remove photo button', () => {
    expect(content).toMatch(/removePhotoButton/);
  });

  test('has add photo button', () => {
    expect(content).toMatch(/addPhotoButton/);
  });

  test('shows camera icon on add button', () => {
    expect(content).toMatch(/camera-outline/);
  });

  test('has proper accessibility on add button', () => {
    expect(content).toMatch(/accessibilityLabel="Add photo"/);
  });

  test('has proper accessibility on remove button', () => {
    expect(content).toMatch(/accessibilityLabel=\{`Remove photo/);
  });
});

// ============================================================================
// Form Validation Tests
// ============================================================================

describe('Form Validation', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has canSubmit validation', () => {
    expect(content).toMatch(/canSubmit.*=.*isDescriptionValid.*&&.*hasRequiredItems/);
  });

  test('validates required items for item selection categories', () => {
    expect(content).toMatch(
      /hasRequiredItems.*=.*!showItemSelection.*\|\|.*selectedItems\.length\s*>\s*0/
    );
  });

  test('has validation message computed value', () => {
    expect(content).toMatch(/validationMessage.*=.*useMemo/);
  });

  test('shows validation message for no items selected', () => {
    expect(content).toMatch(/Please select at least one item/);
  });

  test('shows validation message for empty description', () => {
    expect(content).toMatch(/Please describe your issue/);
  });

  test('shows validation message for short description', () => {
    expect(content).toMatch(/Description must be at least/);
  });

  test('displays validation message component', () => {
    expect(content).toMatch(/validationMessage\s*&&/);
  });
});

// ============================================================================
// Submission Tests
// ============================================================================

describe('Issue Submission', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('uses isSubmitting from store', () => {
    expect(content).toMatch(/isSubmitting.*:.*storeIsSubmitting/);
  });

  test('has handleSubmit handler', () => {
    expect(content).toMatch(/handleSubmit/);
  });

  test('submit button is disabled when cannot submit', () => {
    expect(content).toMatch(/disabled=\{!canSubmit\}/);
  });

  test('shows loading spinner when submitting', () => {
    expect(content).toMatch(/storeIsSubmitting\s*\?/);
    expect(content).toMatch(/submitSpinner/);
  });

  test('submit button has proper text', () => {
    expect(content).toMatch(/Submit Report/);
  });

  test('submit button has send icon', () => {
    expect(content).toMatch(/name="send"/);
  });

  test('uses issue store for submission', () => {
    expect(content).toMatch(/useIssueStore/);
    expect(content).toMatch(/submitIssue/);
  });

  test('uses router.replace to navigate on success', () => {
    expect(content).toMatch(/router\.replace/);
  });

  test('shows success modal after submission', () => {
    expect(content).toMatch(/showSuccessModal/);
    expect(content).toMatch(/SuccessModal/);
  });
});

// ============================================================================
// States Tests
// ============================================================================

describe('States', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has loading state', () => {
    expect(content).toMatch(/isLoading.*=.*useState/);
  });

  test('has order state', () => {
    expect(content).toMatch(/order.*=.*useState/);
  });

  test('shows loading container', () => {
    expect(content).toMatch(/loadingContainer/);
  });

  test('shows error container when order/category not found', () => {
    expect(content).toMatch(/errorContainer/);
  });

  test('displays Something Went Wrong message', () => {
    expect(content).toMatch(/Something Went Wrong/);
  });
});

// ============================================================================
// Animations Tests
// ============================================================================

describe('Animations', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

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

  test('animates scale on item checkbox press', () => {
    expect(content).toMatch(/scale.*=.*useSharedValue/);
  });
});

// ============================================================================
// Styling Tests
// ============================================================================

describe('Styling', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

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

  test('uses AnimationDurations', () => {
    expect(content).toMatch(/AnimationDurations\./);
  });
});

// ============================================================================
// UI Components Tests
// ============================================================================

describe('UI Components', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

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

  test('uses KeyboardAvoidingView', () => {
    expect(content).toMatch(/KeyboardAvoidingView/);
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('Accessibility', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has accessibilityRole on buttons', () => {
    expect(content).toMatch(/accessibilityRole="button"/);
  });

  test('has accessibilityRole on checkboxes', () => {
    expect(content).toMatch(/accessibilityRole="checkbox"/);
  });

  test('has accessibilityLabel on back button', () => {
    expect(content).toMatch(/accessibilityLabel="Go back"/);
  });

  test('has accessibilityLabel on submit button', () => {
    expect(content).toMatch(/accessibilityLabel="Submit issue report"/);
  });

  test('has accessibilityState for disabled', () => {
    expect(content).toMatch(/accessibilityState=\{\s*\{\s*disabled:/);
  });

  test('has accessibilityHint on description input', () => {
    expect(content).toMatch(/accessibilityHint/);
  });
});

// ============================================================================
// Section Headers Tests
// ============================================================================

describe('Section Headers', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has header title Issue Details', () => {
    expect(content).toMatch(/Issue Details/);
  });

  test('has section title for item selection', () => {
    expect(content).toMatch(/Select Affected Items/);
  });

  test('has section title for description', () => {
    expect(content).toMatch(/Describe Your Issue/);
  });

  test('has section title for photos', () => {
    expect(content).toMatch(/Add Photos.*Optional/);
  });
});

// ============================================================================
// Category Badge Tests
// ============================================================================

describe('Category Badge', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('displays category badge', () => {
    expect(content).toMatch(/categoryBadgeContainer/);
  });

  test('uses CATEGORY_TITLES for display', () => {
    expect(content).toMatch(/CATEGORY_TITLES\[category\]/);
  });

  test('uses CATEGORY_DESCRIPTIONS for subtitle', () => {
    expect(content).toMatch(/CATEGORY_DESCRIPTIONS\[category\]/);
  });

  test('has category icon', () => {
    expect(content).toMatch(/categoryIconBadge/);
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Performance', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
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

  test('memoizes toggle item handler', () => {
    expect(content).toMatch(/handleToggleItem.*=.*useCallback/);
  });

  test('memoizes add photo handler', () => {
    expect(content).toMatch(/handleAddPhoto.*=.*useCallback/);
  });

  test('memoizes remove photo handler', () => {
    expect(content).toMatch(/handleRemovePhoto.*=.*useCallback/);
  });

  test('memoizes submit handler', () => {
    expect(content).toMatch(/handleSubmit.*=.*useCallback/);
  });

  test('memoizes validation message', () => {
    expect(content).toMatch(/validationMessage.*=.*useMemo/);
  });
});

// ============================================================================
// Scroll and Layout Tests
// ============================================================================

describe('Scroll and Layout', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
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

  test('has bottom container for submit button', () => {
    expect(content).toMatch(/bottomContainer/);
  });

  test('bottom container has border top', () => {
    expect(content).toMatch(/borderTopColor/);
  });

  test('uses KeyboardAvoidingView for keyboard handling', () => {
    expect(content).toMatch(/KeyboardAvoidingView/);
    expect(content).toMatch(/behavior=\{Platform\.OS\s*===\s*['"]ios['"]\s*\?\s*['"]padding['"]/);
  });
});

// ============================================================================
// Type Integration Tests
// ============================================================================

describe('Type Integration', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('imports IssueCategory type from types', () => {
    expect(content).toMatch(/import.*IssueCategory.*from\s+['"]@\/types['"]/);
  });

  test('imports Order type from types', () => {
    expect(content).toMatch(/import.*Order.*from\s+['"]@\/types['"]/);
  });

  test('imports CartItem type from types', () => {
    expect(content).toMatch(/import.*CartItem.*from\s+['"]@\/types['"]/);
  });
});

// ============================================================================
// Mock Data Integration Tests
// ============================================================================

describe('Mock Data Integration', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
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

// ============================================================================
// PhotoPicker Component Tests
// ============================================================================

describe('PhotoPicker Component', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has PhotoPickerProps interface', () => {
    expect(content).toMatch(/interface\s+PhotoPickerProps/);
  });

  test('has photos prop in PhotoPicker', () => {
    expect(content).toMatch(/photos:\s*string\[\]/);
  });

  test('has onAddPhoto prop in PhotoPicker', () => {
    expect(content).toMatch(/onAddPhoto:\s*\(\)\s*=>/);
  });

  test('has onRemovePhoto prop in PhotoPicker', () => {
    expect(content).toMatch(/onRemovePhoto:\s*\(index:\s*number\)\s*=>/);
  });

  test('checks canAddMore based on MAX_PHOTOS', () => {
    expect(content).toMatch(/canAddMore.*=.*photos\.length\s*<\s*MAX_PHOTOS/);
  });

  test('renders photo with Image component', () => {
    expect(content).toMatch(/<Image[\s\S]*source=\{\s*\{\s*uri\s*\}\s*\}/);
  });

  test('conditionally renders add button', () => {
    expect(content).toMatch(/canAddMore\s*&&/);
  });
});

// ============================================================================
// ItemCheckbox Component Tests
// ============================================================================

describe('ItemCheckbox Component', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has ItemCheckboxProps interface', () => {
    expect(content).toMatch(/interface\s+ItemCheckboxProps/);
  });

  test('shows checkmark icon when selected', () => {
    expect(content).toMatch(/name="checkmark"/);
  });

  test('uses Animated.View for press animation', () => {
    expect(content).toMatch(/Animated\.View.*style=\{animatedStyle\}/);
  });

  test('handles pressIn and pressOut events', () => {
    expect(content).toMatch(/handlePressIn/);
    expect(content).toMatch(/handlePressOut/);
  });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

describe('Error Handling', () => {
  const screenPath = path.join(process.cwd(), 'src/app/support/issue/details.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('handles missing order', () => {
    expect(content).toMatch(/if\s*\(!order/);
  });

  test('handles missing category', () => {
    expect(content).toMatch(/\|\|\s*!category/);
  });

  test('shows Alert for permission denial', () => {
    expect(content).toMatch(/Alert\.alert[\s\S]*Permission Required/);
  });

  test('checks ImagePicker result for cancellation', () => {
    expect(content).toMatch(/result\.canceled/);
  });
});
