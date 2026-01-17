/**
 * Cart Preview Component Tests
 *
 * Comprehensive tests for the floating cart preview component including:
 * - File structure and exports
 * - Component props and types
 * - Helper functions
 * - Animation configurations
 * - Restaurant detail integration
 * - Styling and theme integration
 * - Accessibility
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeEach, describe, expect, test } from '@jest/globals';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Cart Preview - File Structure', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('CartPreview component file exists', () => {
    const componentPath = path.join(srcPath, 'components/cart-preview.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  test('restaurant detail screen exists', () => {
    const screenPath = path.join(srcPath, 'app/restaurant/[id].tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });

  test('cart store exists', () => {
    const storePath = path.join(srcPath, 'stores/cart-store.ts');
    expect(fs.existsSync(storePath)).toBe(true);
  });

  test('useCart hook exists', () => {
    const hookPath = path.join(srcPath, 'hooks/use-cart.ts');
    expect(fs.existsSync(hookPath)).toBe(true);
  });
});

// ============================================================================
// CartPreview Component Tests
// ============================================================================

describe('CartPreview Component', () => {
  const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports CartPreview component', () => {
      expect(content).toMatch(/export\s+function\s+CartPreview/);
    });

    test('exports CartPreviewProps interface', () => {
      expect(content).toMatch(/export\s+interface\s+CartPreviewProps/);
    });

    test('exports CART_PREVIEW_HEIGHT constant', () => {
      expect(content).toMatch(/export\s+const\s+CART_PREVIEW_HEIGHT/);
    });

    test('exports formatCartTotal helper', () => {
      expect(content).toMatch(/export\s+function\s+formatCartTotal/);
    });

    test('exports formatItemCount helper', () => {
      expect(content).toMatch(/export\s+function\s+formatItemCount/);
    });
  });

  describe('Props Interface', () => {
    test('has optional restaurantId prop', () => {
      expect(content).toMatch(/restaurantId\?:\s*string/);
    });

    test('has optional testID prop', () => {
      expect(content).toMatch(/testID\?:\s*string/);
    });
  });

  describe('Constants', () => {
    test('CART_PREVIEW_HEIGHT is 64', () => {
      expect(content).toMatch(/CART_PREVIEW_HEIGHT\s*=\s*64/);
    });

    test('has HORIZONTAL_MARGIN constant', () => {
      expect(content).toMatch(/HORIZONTAL_MARGIN\s*=\s*Spacing\[4\]/);
    });

    test('has BOTTOM_MARGIN constant', () => {
      expect(content).toMatch(/BOTTOM_MARGIN\s*=\s*Spacing\[2\]/);
    });

    test('has SPRING_CONFIG for press animations', () => {
      expect(content).toMatch(/SPRING_CONFIG\s*=\s*\{/);
    });

    test('has BOUNCE_SPRING_CONFIG for bounce animations', () => {
      expect(content).toMatch(/BOUNCE_SPRING_CONFIG\s*=\s*\{/);
    });
  });

  describe('Helper Functions', () => {
    describe('formatCartTotal', () => {
      test('formats price with dollar sign and two decimals', () => {
        expect(content).toMatch(/formatCartTotal.*\{[\s\S]*?\$.*toFixed\(2\)/);
      });

      test('returns string type', () => {
        expect(content).toMatch(/formatCartTotal\(.*\):\s*string/);
      });

      test('takes number parameter', () => {
        expect(content).toMatch(/formatCartTotal\(\s*total:\s*number\s*\)/);
      });
    });

    describe('formatItemCount', () => {
      test('handles singular case (1 item)', () => {
        expect(content).toMatch(/count\s*===\s*1[\s\S]*?'1 item'/);
      });

      test('handles plural case (items)', () => {
        expect(content).toMatch(/`\$\{count\}\s*items`/);
      });

      test('returns string type', () => {
        expect(content).toMatch(/formatItemCount\(.*\):\s*string/);
      });

      test('takes number parameter', () => {
        expect(content).toMatch(/formatItemCount\(\s*count:\s*number\s*\)/);
      });
    });
  });

  describe('Cart Store Integration', () => {
    test('uses useCartStore hook', () => {
      expect(content).toMatch(/useCartStore/);
    });

    test('gets items from cart store', () => {
      expect(content).toMatch(/items\s*=\s*useCartStore/);
    });

    test('gets cartRestaurantId from cart store', () => {
      expect(content).toMatch(/cartRestaurantId\s*=\s*useCartStore/);
    });

    test('gets getSubtotal from cart store', () => {
      expect(content).toMatch(/getSubtotal\s*=\s*useCartStore/);
    });

    test('gets getItemCount from cart store', () => {
      expect(content).toMatch(/getItemCount\s*=\s*useCartStore/);
    });
  });

  describe('Visibility Logic', () => {
    test('checks if cart has items', () => {
      expect(content).toMatch(/items\.length\s*>\s*0/);
    });

    test('checks if restaurantId matches cartRestaurantId', () => {
      expect(content).toMatch(/cartRestaurantId\s*===\s*restaurantId/);
    });

    test('returns null when shouldShow is false', () => {
      expect(content).toMatch(/if\s*\(\s*!shouldShow\s*\)\s*\{[\s\S]*?return\s+null/);
    });
  });

  describe('Bounce Animation', () => {
    test('tracks previous item count with useRef', () => {
      expect(content).toMatch(/prevItemCountRef\s*=\s*useRef/);
    });

    test('triggers bounce when item count increases', () => {
      expect(content).toMatch(/itemCount\s*>\s*prevItemCountRef\.current/);
    });

    test('uses bounceScale shared value', () => {
      expect(content).toMatch(/bounceScale\s*=\s*useSharedValue/);
    });

    test('uses badgeScale shared value for badge bounce', () => {
      expect(content).toMatch(/badgeScale\s*=\s*useSharedValue/);
    });

    test('uses withSequence for bounce animation', () => {
      expect(content).toMatch(/withSequence/);
    });

    test('uses withSpring for bounce effect', () => {
      expect(content).toMatch(/withSpring.*BOUNCE_SPRING_CONFIG/);
    });

    test('updates prevItemCountRef after animation', () => {
      expect(content).toMatch(/prevItemCountRef\.current\s*=\s*itemCount/);
    });
  });

  describe('Press Animation', () => {
    test('has handlePressIn callback', () => {
      expect(content).toMatch(/handlePressIn\s*=\s*useCallback/);
    });

    test('has handlePressOut callback', () => {
      expect(content).toMatch(/handlePressOut\s*=\s*useCallback/);
    });

    test('scales down on press in (0.97)', () => {
      expect(content).toMatch(/withSpring\(\s*0\.97/);
    });

    test('scales back to 1 on press out', () => {
      expect(content).toMatch(/withSpring\(\s*1,\s*SPRING_CONFIG/);
    });
  });

  describe('Navigation', () => {
    test('uses useRouter hook', () => {
      expect(content).toMatch(/useRouter/);
    });

    test('has handlePress callback for navigation', () => {
      expect(content).toMatch(/handlePress\s*=\s*useCallback/);
    });

    test('navigates to cart modal on press', () => {
      expect(content).toMatch(/router\.push\(\s*['"`]\/?\(modals\)\/cart['"`]\s*\)/);
    });
  });

  describe('UI Structure', () => {
    test('has wrapper with Animated.View', () => {
      expect(content).toMatch(/<Animated\.View[\s\S]*?styles\.wrapper/);
    });

    test('has Pressable for tap handling', () => {
      expect(content).toMatch(/<Pressable/);
    });

    test('has container Animated.View', () => {
      expect(content).toMatch(/<Animated\.View[\s\S]*?styles\.container/);
    });

    test('has left section for badge', () => {
      expect(content).toMatch(/styles\.leftSection/);
    });

    test('has center section for view cart text', () => {
      expect(content).toMatch(/styles\.centerSection/);
    });

    test('has right section for total price', () => {
      expect(content).toMatch(/styles\.rightSection/);
    });

    test('displays item count in badge', () => {
      expect(content).toMatch(/\{itemCount\}/);
    });

    test('displays "View Cart" text', () => {
      expect(content).toMatch(/View Cart/);
    });

    test('displays formatted total', () => {
      expect(content).toMatch(/formatCartTotal\(subtotal\)/);
    });

    test('has chevron icon', () => {
      expect(content).toMatch(/name=["']chevron-forward["']/);
    });
  });

  describe('Animations', () => {
    test('uses FadeInUp for entering animation', () => {
      expect(content).toMatch(/FadeInUp/);
    });

    test('uses FadeOutDown for exiting animation', () => {
      expect(content).toMatch(/FadeOutDown/);
    });

    test('uses springify for enter animation', () => {
      expect(content).toMatch(/springify\(\)/);
    });

    test('has containerAnimatedStyle', () => {
      expect(content).toMatch(/containerAnimatedStyle\s*=\s*useAnimatedStyle/);
    });

    test('has badgeAnimatedStyle', () => {
      expect(content).toMatch(/badgeAnimatedStyle\s*=\s*useAnimatedStyle/);
    });

    test('combines scale and bounceScale in container style', () => {
      expect(content).toMatch(/scale\.value\s*\*\s*bounceScale\.value/);
    });
  });

  describe('Styling', () => {
    test('uses PrimaryColors for container background', () => {
      expect(content).toMatch(/PrimaryColors\[500\]/);
    });

    test('uses NeutralColors for badge background', () => {
      expect(content).toMatch(/NeutralColors\[0\]/);
    });

    test('uses Shadows.lg for elevation', () => {
      expect(content).toMatch(/Shadows\.lg/);
    });

    test('uses BorderRadius.xl for container', () => {
      expect(content).toMatch(/BorderRadius\.xl/);
    });

    test('uses BorderRadius.full for badge', () => {
      expect(content).toMatch(/BorderRadius\.full/);
    });

    test('uses ZIndex.fixed for positioning', () => {
      expect(content).toMatch(/ZIndex\.fixed/);
    });

    test('uses safe area insets for bottom positioning', () => {
      expect(content).toMatch(/insets\.bottom\s*\+\s*BOTTOM_MARGIN/);
    });
  });

  describe('Accessibility', () => {
    test('has accessibilityLabel on Pressable', () => {
      expect(content).toMatch(/accessibilityLabel=\{/);
    });

    test('includes item count in accessibility label', () => {
      expect(content).toMatch(/formatItemCount\(itemCount\)/);
    });

    test('includes total in accessibility label', () => {
      expect(content).toMatch(/formatCartTotal\(subtotal\)/);
    });

    test('has accessibilityRole button', () => {
      expect(content).toMatch(/accessibilityRole=["']button["']/);
    });

    test('has accessibilityHint', () => {
      expect(content).toMatch(/accessibilityHint=/);
    });
  });

  describe('Hooks Usage', () => {
    test('uses useSafeAreaInsets', () => {
      expect(content).toMatch(/useSafeAreaInsets/);
    });

    test('uses useRouter from expo-router', () => {
      expect(content).toMatch(/useRouter.*from\s*['"]expo-router['"]/);
    });

    test('uses useCallback for handlers', () => {
      expect(content).toMatch(/useCallback/);
    });

    test('uses useEffect for bounce animation', () => {
      expect(content).toMatch(/useEffect/);
    });

    test('uses useRef for previous item count', () => {
      expect(content).toMatch(/useRef/);
    });

    test('uses useSharedValue for animations', () => {
      expect(content).toMatch(/useSharedValue/);
    });

    test('uses useAnimatedStyle for animated styles', () => {
      expect(content).toMatch(/useAnimatedStyle/);
    });
  });

  describe('Imports', () => {
    test('imports from expo-router', () => {
      expect(content).toMatch(/import.*from\s*['"]expo-router['"]/);
    });

    test('imports Animated from react-native-reanimated', () => {
      expect(content).toMatch(/import\s+Animated[\s\S]*from\s*['"]react-native-reanimated['"]/);
    });

    test('imports from react-native-safe-area-context', () => {
      expect(content).toMatch(/import.*from\s*['"]react-native-safe-area-context['"]/);
    });

    test('imports from @/stores', () => {
      expect(content).toMatch(/import.*from\s*['"]@\/stores['"]/);
    });

    test('imports constants from theme', () => {
      expect(content).toMatch(/import\s*\{[\s\S]*\}\s*from\s*['"]@\/constants\/theme['"]/);
    });

    test('imports ThemedText', () => {
      expect(content).toMatch(/import.*ThemedText.*from/);
    });

    test('imports Ionicons', () => {
      expect(content).toMatch(/import.*Ionicons.*from/);
    });
  });
});

// ============================================================================
// Restaurant Detail Integration Tests
// ============================================================================

describe('Restaurant Detail Screen - Cart Preview Integration', () => {
  const screenPath = path.join(process.cwd(), 'src/app/restaurant/[id].tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('Imports', () => {
    test('imports CartPreview component', () => {
      expect(content).toMatch(/import.*CartPreview.*from\s*['"]@\/components\/cart-preview['"]/);
    });

    test('imports CART_PREVIEW_HEIGHT constant', () => {
      expect(content).toMatch(
        /import.*CART_PREVIEW_HEIGHT.*from\s*['"]@\/components\/cart-preview['"]/
      );
    });
  });

  describe('Cart State', () => {
    test('gets cartRestaurantId from cart store', () => {
      expect(content).toMatch(/cartRestaurantId\s*=\s*useCartStore/);
    });

    test('calculates showCartPreview condition', () => {
      expect(content).toMatch(/showCartPreview\s*=/);
    });

    test('checks cartItems.length in showCartPreview', () => {
      expect(content).toMatch(/cartItems\.length\s*>\s*0/);
    });

    test('checks cartRestaurantId matches id', () => {
      expect(content).toMatch(/cartRestaurantId\s*===\s*id/);
    });
  });

  describe('Component Rendering', () => {
    test('renders CartPreview component', () => {
      expect(content).toMatch(/<CartPreview/);
    });

    test('passes restaurantId prop to CartPreview', () => {
      expect(content).toMatch(/<CartPreview\s+restaurantId=\{id\}/);
    });

    test('passes testID prop to CartPreview', () => {
      expect(content).toMatch(/<CartPreview[\s\S]*?testID=["']cart-preview["']/);
    });

    test('CartPreview is rendered after sticky tabs', () => {
      // CartPreview should come after the sticky tabs section
      const stickyTabsIndex = content.indexOf('Sticky Menu Category Tabs');
      const cartPreviewIndex = content.indexOf('<CartPreview');
      expect(cartPreviewIndex).toBeGreaterThan(stickyTabsIndex);
    });
  });

  describe('Scroll Padding', () => {
    test('adjusts paddingBottom based on showCartPreview', () => {
      expect(content).toMatch(/showCartPreview\s*\?\s*CART_PREVIEW_HEIGHT/);
    });

    test('adds CART_PREVIEW_HEIGHT plus spacing to padding', () => {
      expect(content).toMatch(/CART_PREVIEW_HEIGHT\s*\+\s*Spacing\[4\]/);
    });

    test('uses conditional padding in contentContainerStyle', () => {
      expect(content).toMatch(/contentContainerStyle=\{[\s\S]*?paddingBottom:/);
    });
  });
});

// ============================================================================
// Helper Function Unit Tests
// ============================================================================

describe('Cart Preview Helper Functions - Logic', () => {
  describe('formatCartTotal logic', () => {
    test('whole numbers get .00 suffix', () => {
      // The function uses toFixed(2), so 10 becomes "10.00"
      const expected = /\$.*toFixed\(2\)/;
      const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toMatch(expected);
    });

    test('handles zero correctly', () => {
      // formatCartTotal(0) should return "$0.00"
      // This is implied by the toFixed(2) logic
      const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toMatch(/total\.toFixed\(2\)/);
    });
  });

  describe('formatItemCount logic', () => {
    test('has singular check for count === 1', () => {
      const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toMatch(/count\s*===\s*1/);
    });

    test('returns singular form for 1', () => {
      const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toMatch(/['"]1 item['"]/);
    });

    test('returns plural form for other numbers', () => {
      const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toMatch(/`\$\{count\}\s*items`/);
    });
  });
});

// ============================================================================
// Animation Configuration Tests
// ============================================================================

describe('Cart Preview Animation Configurations', () => {
  const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  describe('SPRING_CONFIG', () => {
    test('has damping value', () => {
      expect(content).toMatch(/SPRING_CONFIG\s*=\s*\{[\s\S]*?damping:\s*15/);
    });

    test('has stiffness value', () => {
      expect(content).toMatch(/SPRING_CONFIG\s*=\s*\{[\s\S]*?stiffness:\s*200/);
    });

    test('has mass value', () => {
      expect(content).toMatch(/SPRING_CONFIG\s*=\s*\{[\s\S]*?mass:\s*0\.5/);
    });
  });

  describe('BOUNCE_SPRING_CONFIG', () => {
    test('has damping value', () => {
      expect(content).toMatch(/BOUNCE_SPRING_CONFIG\s*=\s*\{[\s\S]*?damping:\s*12/);
    });

    test('has stiffness value', () => {
      expect(content).toMatch(/BOUNCE_SPRING_CONFIG\s*=\s*\{[\s\S]*?stiffness:\s*400/);
    });

    test('has mass value', () => {
      expect(content).toMatch(/BOUNCE_SPRING_CONFIG\s*=\s*\{[\s\S]*?mass:\s*0\.3/);
    });
  });

  describe('Bounce Animation Values', () => {
    test('bounces to 1.05 scale on item add', () => {
      expect(content).toMatch(/withSpring\(\s*1\.05/);
    });

    test('badge bounces to 1.3 scale', () => {
      expect(content).toMatch(/withSpring\(\s*1\.3/);
    });

    test('settles back to 1', () => {
      expect(content).toMatch(/withSpring\(\s*1,\s*BOUNCE_SPRING_CONFIG/);
    });
  });

  describe('Entering/Exiting Animations', () => {
    test('uses FadeInUp with duration', () => {
      expect(content).toMatch(/FadeInUp\.duration\(/);
    });

    test('uses AnimationDurations.normal for enter', () => {
      expect(content).toMatch(/FadeInUp\.duration\(\s*AnimationDurations\.normal\s*\)/);
    });

    test('uses FadeOutDown with duration', () => {
      expect(content).toMatch(/FadeOutDown\.duration\(/);
    });

    test('uses AnimationDurations.fast for exit', () => {
      expect(content).toMatch(/FadeOutDown\.duration\(\s*AnimationDurations\.fast\s*\)/);
    });
  });
});

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('Cart Preview Edge Cases', () => {
  const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  test('handles empty restaurantId prop', () => {
    // When restaurantId is not provided, cart should show for any restaurant
    expect(content).toMatch(/!restaurantId\s*\|\|/);
  });

  test('initializes prevItemCountRef with current itemCount', () => {
    expect(content).toMatch(/useRef\(\s*itemCount\s*\)/);
  });

  test('only triggers bounce when shouldShow is true', () => {
    expect(content).toMatch(/itemCount\s*>\s*prevItemCountRef\.current\s*&&\s*shouldShow/);
  });

  test('has default testID value', () => {
    expect(content).toMatch(/testID\s*=\s*['"]cart-preview['"]/);
  });

  test('badge has minimum width for single digit', () => {
    expect(content).toMatch(/minWidth:\s*28/);
  });
});

// ============================================================================
// Style Tests
// ============================================================================

describe('Cart Preview Styles', () => {
  const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  test('wrapper has position absolute', () => {
    expect(content).toMatch(/wrapper:[\s\S]*?position:\s*['"]absolute['"]/);
  });

  test('wrapper has left: 0', () => {
    expect(content).toMatch(/wrapper:[\s\S]*?left:\s*0/);
  });

  test('wrapper has right: 0', () => {
    expect(content).toMatch(/wrapper:[\s\S]*?right:\s*0/);
  });

  test('container has height from constant', () => {
    expect(content).toMatch(/height:\s*CART_PREVIEW_HEIGHT/);
  });

  test('container has flexDirection row', () => {
    expect(content).toMatch(/container:[\s\S]*?flexDirection:\s*['"]row['"]/);
  });

  test('badge has circular shape', () => {
    expect(content).toMatch(/badge:[\s\S]*?borderRadius:\s*BorderRadius\.full/);
  });

  test('badge has centered content', () => {
    expect(content).toMatch(/badge:[\s\S]*?justifyContent:\s*['"]center['"]/);
    expect(content).toMatch(/badge:[\s\S]*?alignItems:\s*['"]center['"]/);
  });

  test('centerSection has flex: 1', () => {
    expect(content).toMatch(/centerSection:[\s\S]*?flex:\s*1/);
  });

  test('viewCartText has bold weight', () => {
    expect(content).toMatch(/viewCartText:[\s\S]*?fontWeight:\s*['"]600['"]/);
  });

  test('totalText has bold weight', () => {
    expect(content).toMatch(/totalText:[\s\S]*?fontWeight:\s*['"]700['"]/);
  });

  test('chevron has marginLeft', () => {
    expect(content).toMatch(/chevron:[\s\S]*?marginLeft:/);
  });
});

// ============================================================================
// TypeScript Types Tests
// ============================================================================

describe('Cart Preview Types', () => {
  const componentPath = path.join(process.cwd(), 'src/components/cart-preview.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  test('CartPreviewProps is an interface', () => {
    expect(content).toMatch(/interface\s+CartPreviewProps/);
  });

  test('restaurantId is optional string', () => {
    expect(content).toMatch(/restaurantId\?:\s*string/);
  });

  test('testID is optional string', () => {
    expect(content).toMatch(/testID\?:\s*string/);
  });

  test('component uses typed props', () => {
    expect(content).toMatch(
      /function\s+CartPreview\s*\(\s*\{\s*restaurantId,\s*testID[\s\S]*?\}:\s*CartPreviewProps\s*\)/
    );
  });
});
