/**
 * Help Access Tests
 *
 * Comprehensive tests for the help access functionality throughout the app:
 * - HelpButton component
 * - Help access in order details
 * - Help access in order tracking
 * - Help access in profile
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeEach, describe, expect, test } from '@jest/globals';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Help Access - File Structure', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('HelpButton component file exists', () => {
    const componentPath = path.join(srcPath, 'components/help-button.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  test('Order details screen file exists', () => {
    const screenPath = path.join(srcPath, 'app/order/details/[id].tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });

  test('Order tracking screen file exists', () => {
    const screenPath = path.join(srcPath, 'app/order/tracking/[id].tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });

  test('Profile screen file exists', () => {
    const screenPath = path.join(srcPath, 'app/(tabs)/profile.tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });

  test('Support index (help center) screen file exists', () => {
    const screenPath = path.join(srcPath, 'app/support/index.tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });

  test('Issue reporting screen file exists', () => {
    const screenPath = path.join(srcPath, 'app/support/issue/[orderId].tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });
});

// ============================================================================
// HelpButton Component Tests
// ============================================================================

describe('HelpButton Component', () => {
  const componentPath = path.join(process.cwd(), 'src/components/help-button.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports HelpButton function', () => {
      expect(content).toMatch(/export\s+function\s+HelpButton/);
    });

    test('exports HelpButtonProps interface', () => {
      expect(content).toMatch(/export\s+interface\s+HelpButtonProps/);
    });

    test('exports HelpButtonVariant type', () => {
      expect(content).toMatch(/export\s+type\s+HelpButtonVariant/);
    });

    test('exports HelpButtonSize type', () => {
      expect(content).toMatch(/export\s+type\s+HelpButtonSize/);
    });

    test('exports default HelpButton', () => {
      expect(content).toMatch(/export\s+default\s+HelpButton/);
    });
  });

  describe('Props Interface', () => {
    test('has orderId optional prop', () => {
      expect(content).toMatch(/orderId\?:\s*string/);
    });

    test('has variant optional prop', () => {
      expect(content).toMatch(/variant\?:\s*HelpButtonVariant/);
    });

    test('has size optional prop', () => {
      expect(content).toMatch(/size\?:\s*HelpButtonSize/);
    });

    test('has label optional prop', () => {
      expect(content).toMatch(/label\?:\s*string/);
    });

    test('has style optional prop', () => {
      expect(content).toMatch(/style\?:\s*ViewStyle/);
    });

    test('has testID optional prop', () => {
      expect(content).toMatch(/testID\?:\s*string/);
    });
  });

  describe('Variants', () => {
    test('supports icon variant', () => {
      expect(content).toMatch(/['"]icon['"]/);
    });

    test('supports text variant', () => {
      expect(content).toMatch(/['"]text['"]/);
    });

    test('supports full variant', () => {
      expect(content).toMatch(/['"]full['"]/);
    });

    test('default variant is full', () => {
      expect(content).toMatch(/variant\s*=\s*['"]full['"]/);
    });
  });

  describe('Sizes', () => {
    test('supports sm size', () => {
      expect(content).toMatch(/size\s*===\s*['"]sm['"]/);
    });

    test('supports md size', () => {
      expect(content).toMatch(/size\s*===\s*['"]md['"]|['"]md['"]/);
    });

    test('supports lg size', () => {
      expect(content).toMatch(/size\s*===\s*['"]lg['"]/);
    });

    test('default size is md', () => {
      expect(content).toMatch(/size\s*=\s*['"]md['"]/);
    });
  });

  describe('Navigation', () => {
    test('uses expo-router', () => {
      expect(content).toMatch(/from\s+['"]expo-router['"]/);
    });

    test('uses router.push for navigation', () => {
      expect(content).toMatch(/router\.push/);
    });

    test('navigates to issue reporting with orderId', () => {
      expect(content).toMatch(/\/support\/issue\/\$\{orderId\}/);
    });

    test('navigates to general support without orderId', () => {
      expect(content).toMatch(/router\.push\(['"]\/support['"]\)/);
    });

    test('has conditional navigation based on orderId', () => {
      expect(content).toMatch(/if\s*\(orderId\)/);
    });
  });

  describe('Animations', () => {
    test('imports react-native-reanimated', () => {
      expect(content).toMatch(/from\s+['"]react-native-reanimated['"]/);
    });

    test('uses useSharedValue for animation state', () => {
      expect(content).toMatch(/useSharedValue/);
    });

    test('uses withSpring for animations', () => {
      expect(content).toMatch(/withSpring/);
    });

    test('uses useAnimatedStyle', () => {
      expect(content).toMatch(/useAnimatedStyle/);
    });

    test('has press in handler', () => {
      expect(content).toMatch(/handlePressIn/);
    });

    test('has press out handler', () => {
      expect(content).toMatch(/handlePressOut/);
    });
  });

  describe('Accessibility', () => {
    test('has accessibilityLabel', () => {
      expect(content).toMatch(/accessibilityLabel/);
    });

    test('has accessibilityRole button', () => {
      expect(content).toMatch(/accessibilityRole=["']button["']/);
    });

    test('has accessibilityHint', () => {
      expect(content).toMatch(/accessibilityHint/);
    });

    test('has hint for order-specific help', () => {
      expect(content).toMatch(/Report an issue with this order/);
    });

    test('has hint for general help center', () => {
      expect(content).toMatch(/Open help center/);
    });
  });

  describe('Styling', () => {
    test('imports design system constants', () => {
      expect(content).toMatch(/from\s+['"]@\/constants\/theme['"]/);
    });

    test('imports Colors', () => {
      expect(content).toMatch(/Colors/);
    });

    test('imports Spacing', () => {
      expect(content).toMatch(/Spacing/);
    });

    test('imports Typography', () => {
      expect(content).toMatch(/Typography/);
    });

    test('imports BorderRadius', () => {
      expect(content).toMatch(/BorderRadius/);
    });

    test('uses StyleSheet.create', () => {
      expect(content).toMatch(/StyleSheet\.create/);
    });

    test('uses useColorScheme hook', () => {
      expect(content).toMatch(/useColorScheme/);
    });

    test('defines iconButton style', () => {
      expect(content).toMatch(/iconButton/);
    });

    test('defines textButton style', () => {
      expect(content).toMatch(/textButton/);
    });

    test('defines fullButton style', () => {
      expect(content).toMatch(/fullButton/);
    });
  });

  describe('Icon', () => {
    test('imports Ionicons', () => {
      expect(content).toMatch(/from\s+['"]@expo\/vector-icons['"]/);
    });

    test('uses help-circle-outline icon', () => {
      expect(content).toMatch(/help-circle-outline/);
    });

    test('has icon size function', () => {
      expect(content).toMatch(/getIconSize/);
    });
  });

  describe('Label', () => {
    test('has default label "Need help?"', () => {
      expect(content).toMatch(/Need help\?/);
    });

    test('has alternative label "Get Help"', () => {
      expect(content).toMatch(/Get Help/);
    });

    test('uses custom label when provided', () => {
      expect(content).toMatch(/displayLabel\s*=\s*label/);
    });
  });
});

// ============================================================================
// Order Details Screen Help Access Tests
// ============================================================================

describe('Order Details Screen - Help Access', () => {
  const screenPath = path.join(process.cwd(), 'src/app/order/details/[id].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has Get Help button', () => {
    expect(content).toMatch(/Get Help/);
  });

  test('has handleGetHelp function', () => {
    expect(content).toMatch(/handleGetHelp/);
  });

  test('navigates to support/issue with order ID', () => {
    expect(content).toMatch(/\/support\/issue\/\$\{order\.id\}/);
  });

  test('uses help-circle-outline icon', () => {
    expect(content).toMatch(/help-circle-outline/);
  });

  test('has ActionButton component for help', () => {
    expect(content).toMatch(/ActionButton[\s\S]*Get Help/);
  });
});

// ============================================================================
// Order Tracking Screen Help Access Tests
// ============================================================================

describe('Order Tracking Screen - Help Access', () => {
  const screenPath = path.join(process.cwd(), 'src/app/order/tracking/[id].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('imports HelpButton component', () => {
    expect(content).toMatch(
      /import\s*\{?\s*HelpButton\s*\}?\s*from\s+['"]@\/components\/help-button['"]/
    );
  });

  test('has HelpButtonSection component', () => {
    expect(content).toMatch(/HelpButtonSection/);
  });

  test('uses HelpButtonSection with orderId', () => {
    expect(content).toMatch(/<HelpButtonSection\s+orderId/);
  });

  test('has helpButtonContainer style', () => {
    expect(content).toMatch(/helpButtonContainer/);
  });

  test('HelpButtonSection renders HelpButton component', () => {
    expect(content).toMatch(/function\s+HelpButtonSection[\s\S]*<HelpButton/);
  });

  test('passes orderId to HelpButton', () => {
    expect(content).toMatch(/orderId=\{orderId\}/);
  });
});

// ============================================================================
// Profile Screen Help Access Tests
// ============================================================================

describe('Profile Screen - Help Access', () => {
  const screenPath = path.join(process.cwd(), 'src/app/(tabs)/profile.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  test('has Help Center menu item', () => {
    expect(content).toMatch(/Help Center/);
  });

  test('uses help-circle-outline icon', () => {
    expect(content).toMatch(/help-circle-outline/);
  });

  test('navigates to /support', () => {
    expect(content).toMatch(/router\.push\(['"]\/support['"]\)/);
  });

  test('has Support section', () => {
    expect(content).toMatch(/Support/);
  });

  test('has Contact Us menu item', () => {
    expect(content).toMatch(/Contact Us/);
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Help Access Integration', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('Support layout exists and configures routes', () => {
    const layoutPath = path.join(srcPath, 'app/support/_layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);

    const content = fs.readFileSync(layoutPath, 'utf-8');
    expect(content).toMatch(/Stack/);
  });

  test('Issue reporting screen accepts orderId param', () => {
    const screenPath = path.join(srcPath, 'app/support/issue/[orderId].tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');
    expect(content).toMatch(/useLocalSearchParams.*orderId/);
  });

  test('Help center screen has FAQ sections', () => {
    const screenPath = path.join(srcPath, 'app/support/index.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');
    expect(content).toMatch(/FAQ|faq|questions/i);
  });

  test('All help access points use consistent navigation paths', () => {
    // Check order details
    const orderDetailsContent = fs.readFileSync(
      path.join(srcPath, 'app/order/details/[id].tsx'),
      'utf-8'
    );
    expect(orderDetailsContent).toMatch(/\/support\/issue/);

    // Check order tracking
    const orderTrackingContent = fs.readFileSync(
      path.join(srcPath, 'app/order/tracking/[id].tsx'),
      'utf-8'
    );
    expect(orderTrackingContent).toMatch(/HelpButton/);

    // Check profile
    const profileContent = fs.readFileSync(path.join(srcPath, 'app/(tabs)/profile.tsx'), 'utf-8');
    expect(profileContent).toMatch(/\/support/);
  });
});

// ============================================================================
// Consistency Tests
// ============================================================================

describe('Help Access Consistency', () => {
  const componentPath = path.join(process.cwd(), 'src/components/help-button.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  test('uses same icon throughout (help-circle-outline)', () => {
    const iconMatches = content.match(/help-circle-outline/g);
    expect(iconMatches).not.toBeNull();
    expect(iconMatches!.length).toBeGreaterThanOrEqual(1);
  });

  test('supports both order-specific and general help navigation', () => {
    expect(content).toMatch(/\/support\/issue/);
    expect(content).toMatch(/\/support['"]\)/);
  });

  test('has consistent animation behavior', () => {
    expect(content).toMatch(/SPRING_CONFIG/);
    expect(content).toMatch(/damping/);
    expect(content).toMatch(/stiffness/);
    expect(content).toMatch(/mass/);
  });

  test('uses theme colors for proper light/dark mode support', () => {
    expect(content).toMatch(/colors\.text/);
    expect(content).toMatch(/colors\.backgroundSecondary/);
    expect(content).toMatch(/colors\.primary/);
  });
});
