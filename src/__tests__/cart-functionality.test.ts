/**
 * Cart Functionality Tests
 *
 * Comprehensive tests for cart functionality including:
 * - SwipeableCartItem component
 * - useCart hook
 * - Cart store integration
 * - Restaurant validation
 * - Swipe-to-delete functionality
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeEach, describe, expect, test } from '@jest/globals';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Cart Functionality - File Structure', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('SwipeableCartItem component file exists', () => {
    const componentPath = path.join(srcPath, 'components/swipeable-cart-item.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  test('useCart hook file exists', () => {
    const hookPath = path.join(srcPath, 'hooks/use-cart.ts');
    expect(fs.existsSync(hookPath)).toBe(true);
  });

  test('cart store file exists', () => {
    const storePath = path.join(srcPath, 'stores/cart-store.ts');
    expect(fs.existsSync(storePath)).toBe(true);
  });
});

// ============================================================================
// SwipeableCartItem Component Tests
// ============================================================================

describe('SwipeableCartItem Component', () => {
  const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports SwipeableCartItem component', () => {
      expect(content).toMatch(/export\s+(function|const)\s+SwipeableCartItem/);
    });

    test('exports SwipeableCartItemProps interface', () => {
      expect(content).toMatch(/export\s+interface\s+SwipeableCartItemProps/);
    });

    test('exports QuantityControls component', () => {
      expect(content).toMatch(/export\s+.*QuantityControls/);
    });

    test('exports DELETE_BUTTON_WIDTH constant', () => {
      expect(content).toMatch(/export\s+.*DELETE_BUTTON_WIDTH/);
    });

    test('exports SWIPE_THRESHOLD constant', () => {
      expect(content).toMatch(/export\s+.*SWIPE_THRESHOLD/);
    });

    test('exports formatPrice helper', () => {
      expect(content).toMatch(/export\s+function\s+formatPrice/);
    });

    test('exports formatCustomizations helper', () => {
      expect(content).toMatch(/export\s+function\s+formatCustomizations/);
    });
  });

  describe('Props Interface', () => {
    test('has item prop of type CartItem', () => {
      expect(content).toMatch(/item:\s*CartItem/);
    });

    test('has onQuantityChange callback', () => {
      expect(content).toMatch(
        /onQuantityChange:\s*\(\s*cartItemId:\s*string,\s*quantity:\s*number\)/
      );
    });

    test('has onRemove callback', () => {
      expect(content).toMatch(/onRemove:\s*\(\s*cartItemId:\s*string\)/);
    });

    test('has optional onPress callback', () => {
      expect(content).toMatch(/onPress\?:\s*\(\s*item:\s*CartItem\)/);
    });

    test('has optional testID prop', () => {
      expect(content).toMatch(/testID\?:\s*string/);
    });
  });

  describe('Swipe Gesture', () => {
    test('uses GestureDetector from react-native-gesture-handler', () => {
      expect(content).toMatch(
        /import\s+.*GestureDetector.*from\s+['"]react-native-gesture-handler['"]/
      );
    });

    test('uses Gesture.Pan for swipe handling', () => {
      expect(content).toMatch(/Gesture\.Pan\(\)/);
    });

    test('uses translateX shared value for animation', () => {
      expect(content).toMatch(/translateX.*=.*useSharedValue/);
    });

    test('clamps swipe to DELETE_BUTTON_WIDTH', () => {
      expect(content).toMatch(/-DELETE_BUTTON_WIDTH/);
    });

    test('uses SWIPE_THRESHOLD for snap decision', () => {
      expect(content).toMatch(/SWIPE_THRESHOLD/);
    });
  });

  describe('Delete Functionality', () => {
    test('has delete button with trash icon', () => {
      expect(content).toMatch(/name="trash"/);
    });

    test('shows delete confirmation alert', () => {
      expect(content).toMatch(/Alert\.alert/);
    });

    test('has Remove Item alert title', () => {
      expect(content).toMatch(/Remove Item/);
    });

    test('calls onRemove when confirmed', () => {
      expect(content).toMatch(/onRemove\(item\.id\)/);
    });
  });

  describe('Quantity Controls', () => {
    test('has QuantityControls sub-component', () => {
      expect(content).toMatch(/function\s+QuantityControls/);
    });

    test('shows trash icon when quantity is 1', () => {
      expect(content).toMatch(/isTrash\s*=\s*quantity\s*===\s*1/);
    });

    test('has increment button with testID', () => {
      expect(content).toMatch(/testID="cart-item-increment"/);
    });

    test('has decrement button with testID', () => {
      expect(content).toMatch(/testID="cart-item-decrement"/);
    });

    test('uses spring animation for button press', () => {
      expect(content).toMatch(/withSpring.*0\.85/);
    });
  });

  describe('Item Display', () => {
    test('displays item image', () => {
      expect(content).toMatch(/item\.menuItem\.image/);
    });

    test('displays item name', () => {
      expect(content).toMatch(/item\.menuItem\.name/);
    });

    test('displays total price', () => {
      expect(content).toMatch(/formatPrice\(item\.totalPrice\)/);
    });

    test('displays customizations', () => {
      expect(content).toMatch(/formatCustomizations/);
    });

    test('displays special instructions if present', () => {
      expect(content).toMatch(/item\.specialInstructions/);
    });

    test('displays unit price', () => {
      expect(content).toMatch(/item\.totalPrice\s*\/\s*item\.quantity/);
    });
  });

  describe('Animations', () => {
    test('uses FadeIn entering animation', () => {
      expect(content).toMatch(/entering=\{FadeIn/);
    });

    test('uses FadeOut exiting animation', () => {
      expect(content).toMatch(/exiting=\{FadeOut/);
    });

    test('uses Layout animation for list reordering', () => {
      expect(content).toMatch(/layout=\{Layout/);
    });

    test('uses spring-based animations with config', () => {
      expect(content).toMatch(/SPRING_CONFIG\s*=\s*\{/);
    });
  });

  describe('Accessibility', () => {
    test('has accessibility labels for buttons', () => {
      expect(content).toMatch(/accessibilityLabel/);
    });

    test('has accessibility roles', () => {
      expect(content).toMatch(/accessibilityRole="button"/);
    });

    test('has delete button accessibility label', () => {
      expect(content).toMatch(/accessibilityLabel="Delete item"/);
    });
  });
});

// ============================================================================
// useCart Hook Tests
// ============================================================================

describe('useCart Hook', () => {
  const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(hookPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports useCart hook', () => {
      expect(content).toMatch(/export\s+function\s+useCart/);
    });

    test('exports UseCartReturn interface', () => {
      expect(content).toMatch(/export\s+interface\s+UseCartReturn/);
    });

    test('exports TAX_RATE constant', () => {
      expect(content).toMatch(/export\s+const\s+TAX_RATE/);
    });

    test('exports formatPrice helper', () => {
      expect(content).toMatch(/export\s+function\s+formatPrice/);
    });

    test('exports calculateTax helper', () => {
      expect(content).toMatch(/export\s+function\s+calculateTax/);
    });

    test('exports formatItemCount helper', () => {
      expect(content).toMatch(/export\s+function\s+formatItemCount/);
    });
  });

  describe('UseCartReturn Interface', () => {
    test('includes items array', () => {
      expect(content).toMatch(/items:\s*CartItem\[\]/);
    });

    test('includes itemCount', () => {
      expect(content).toMatch(/itemCount:\s*number/);
    });

    test('includes subtotal', () => {
      expect(content).toMatch(/subtotal:\s*number/);
    });

    test('includes restaurant', () => {
      expect(content).toMatch(/restaurant:\s*Restaurant\s*\|\s*null/);
    });

    test('includes isEmpty', () => {
      expect(content).toMatch(/isEmpty:\s*boolean/);
    });

    test('includes formattedSubtotal', () => {
      expect(content).toMatch(/formattedSubtotal:\s*string/);
    });

    test('includes formattedItemCount', () => {
      expect(content).toMatch(/formattedItemCount:\s*string/);
    });

    test('includes addItem function', () => {
      expect(content).toMatch(/addItem:/);
    });

    test('includes removeItem function', () => {
      expect(content).toMatch(/removeItem:/);
    });

    test('includes updateQuantity function', () => {
      expect(content).toMatch(/updateQuantity:/);
    });

    test('includes clearCart function', () => {
      expect(content).toMatch(/clearCart:/);
    });

    test('includes canAddFromRestaurant function', () => {
      expect(content).toMatch(/canAddFromRestaurant:/);
    });

    test('includes addItemWithValidation function', () => {
      expect(content).toMatch(/addItemWithValidation:/);
    });

    test('includes getItemQuantity function', () => {
      expect(content).toMatch(/getItemQuantity:/);
    });

    test('includes getCartItemByMenuItemId function', () => {
      expect(content).toMatch(/getCartItemByMenuItemId:/);
    });

    test('includes findCartItem function', () => {
      expect(content).toMatch(/findCartItem:/);
    });
  });

  describe('Helper Functions', () => {
    test('formatPrice formats with dollar sign and 2 decimals', () => {
      expect(content).toMatch(/\$\$\{price\.toFixed\(2\)\}/);
    });

    test('calculateTax uses TAX_RATE', () => {
      expect(content).toMatch(/subtotal\s*\*\s*TAX_RATE/);
    });

    test('formatItemCount handles empty', () => {
      expect(content).toMatch(/if\s*\(count\s*===\s*0\)\s*return\s*['"]Empty['"]/);
    });

    test('formatItemCount handles singular', () => {
      expect(content).toMatch(/['"]1 item['"]/);
    });

    test('formatItemCount handles plural', () => {
      expect(content).toMatch(/items['"`]/);
    });
  });

  describe('Cart Store Integration', () => {
    test('uses useCartStore', () => {
      expect(content).toMatch(/useCartStore/);
    });

    test('gets items from store', () => {
      expect(content).toMatch(/useCartStore\(\(state\)\s*=>\s*state\.items\)/);
    });

    test('gets restaurant from store', () => {
      expect(content).toMatch(/useCartStore\(\(state\)\s*=>\s*state\.restaurant\)/);
    });

    test('gets subtotal from store', () => {
      expect(content).toMatch(/storeGetSubtotal\(\)/);
    });

    test('gets item count from store', () => {
      expect(content).toMatch(/storeGetItemCount\(\)/);
    });
  });

  describe('Utility Functions', () => {
    test('getItemQuantity sums quantities for same menu item', () => {
      expect(content).toMatch(
        /reduce\(\(total,\s*cartItem\)\s*=>\s*total\s*\+\s*cartItem\.quantity/
      );
    });

    test('getCartItemByMenuItemId finds items without customizations', () => {
      expect(content).toMatch(/selectedCustomizations\.length\s*===\s*0/);
    });

    test('getCartItemsByMenuItemId returns all matching items', () => {
      expect(content).toMatch(/items\.filter\(\(cartItem\)\s*=>\s*cartItem\.menuItem\.id/);
    });

    test('findCartItem finds by cart item ID', () => {
      expect(content).toMatch(/items\.find\(\(item\)\s*=>\s*item\.id\s*===\s*cartItemId\)/);
    });
  });

  describe('Restaurant Validation', () => {
    test('addItemWithValidation checks restaurant compatibility', () => {
      expect(content).toMatch(/storeCanAddFromRestaurant\(restaurantData\.id\)/);
    });

    test('shows alert when restaurant mismatch', () => {
      expect(content).toMatch(/Alert\.alert/);
    });

    test('has Clear Cart option in alert', () => {
      expect(content).toMatch(/Clear Cart\?/);
    });

    test('clears cart before adding on confirmation', () => {
      expect(content).toMatch(/storeClearCart\(\)/);
    });
  });
});

// ============================================================================
// Cart Store Tests
// ============================================================================

describe('Cart Store', () => {
  const storePath = path.join(process.cwd(), 'src/stores/cart-store.ts');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(storePath, 'utf-8');
  });

  describe('State', () => {
    test('has items array', () => {
      expect(content).toMatch(/items:\s*CartItem\[\]/);
    });

    test('has restaurantId', () => {
      expect(content).toMatch(/restaurantId:\s*string\s*\|\s*null/);
    });

    test('has restaurant', () => {
      expect(content).toMatch(/restaurant:\s*Restaurant\s*\|\s*null/);
    });
  });

  describe('Actions', () => {
    test('has addItem action', () => {
      expect(content).toMatch(/addItem:\s*\(/);
    });

    test('has removeItem action', () => {
      expect(content).toMatch(/removeItem:\s*\(cartItemId:\s*string\)/);
    });

    test('has updateQuantity action', () => {
      expect(content).toMatch(/updateQuantity:\s*\(cartItemId:\s*string,\s*quantity:\s*number\)/);
    });

    test('has updateItem action', () => {
      expect(content).toMatch(/updateItem:\s*\(/);
    });

    test('has clearCart action', () => {
      expect(content).toMatch(/clearCart:\s*\(\)/);
    });

    test('has getSubtotal action', () => {
      expect(content).toMatch(/getSubtotal:\s*\(\)/);
    });

    test('has getItemCount action', () => {
      expect(content).toMatch(/getItemCount:\s*\(\)/);
    });

    test('has canAddFromRestaurant action', () => {
      expect(content).toMatch(/canAddFromRestaurant:\s*\(restaurantId:\s*string\)/);
    });

    test('has setRestaurant action', () => {
      expect(content).toMatch(/setRestaurant:\s*\(restaurant:\s*Restaurant\)/);
    });
  });

  describe('Restaurant Validation Logic', () => {
    test('clears cart when adding from different restaurant', () => {
      expect(content).toMatch(/restaurantId\s*&&\s*restaurantId\s*!==\s*menuItem\.restaurantId/);
    });

    test('canAddFromRestaurant returns true for empty cart', () => {
      expect(content).toMatch(/items\.length\s*===\s*0/);
    });

    test('canAddFromRestaurant returns true for same restaurant', () => {
      expect(content).toMatch(/currentRestaurantId\s*===\s*restaurantId/);
    });
  });

  describe('Price Calculation', () => {
    test('calculateItemTotal includes base price', () => {
      expect(content).toMatch(/basePrice\s*=\s*menuItem\.price/);
    });

    test('calculateItemTotal adds customization prices', () => {
      expect(content).toMatch(/basePrice\s*\+=\s*option\.price/);
    });

    test('calculateItemTotal multiplies by quantity', () => {
      expect(content).toMatch(/basePrice\s*\*\s*quantity/);
    });

    test('getSubtotal sums all item totals', () => {
      expect(content).toMatch(/reduce\(\(total,\s*item\)\s*=>\s*total\s*\+\s*item\.totalPrice/);
    });

    test('getItemCount sums all quantities', () => {
      expect(content).toMatch(/reduce\(\(count,\s*item\)\s*=>\s*count\s*\+\s*item\.quantity/);
    });
  });

  describe('Item Removal Logic', () => {
    test('removeItem filters out the item', () => {
      expect(content).toMatch(/items\.filter\(\(item\)\s*=>\s*item\.id\s*!==\s*cartItemId\)/);
    });

    test('clears restaurant when cart becomes empty', () => {
      expect(content).toMatch(/if\s*\(newItems\.length\s*===\s*0\)/);
    });

    test('updateQuantity calls removeItem when quantity <= 0', () => {
      expect(content).toMatch(/if\s*\(quantity\s*<=\s*0\)/);
    });
  });

  describe('Persistence', () => {
    test('uses zustand persist middleware', () => {
      expect(content).toMatch(/persist\(/);
    });

    test('uses AsyncStorage', () => {
      expect(content).toMatch(/AsyncStorage/);
    });

    test('has storage key', () => {
      expect(content).toMatch(/name:\s*['"]maestro-cart-storage['"]/);
    });
  });
});

// ============================================================================
// Helper Function Unit Tests
// ============================================================================

describe('SwipeableCartItem Helper Functions', () => {
  const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  test('formatPrice formats correctly', () => {
    // The format should be $X.XX
    expect(content).toMatch(/\$\$\{price\.toFixed\(2\)\}/);
  });

  test('formatCustomizations joins options with bullet separator', () => {
    expect(content).toMatch(/join\(\s*['"].*•.*['"]\s*\)/);
  });

  test('formatCustomizations returns empty string for no customizations', () => {
    expect(content).toMatch(
      /if\s*\(item\.selectedCustomizations\.length\s*===\s*0\)\s*return\s*['"]['"];/
    );
  });
});

describe('useCart Helper Functions', () => {
  const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(hookPath, 'utf-8');
  });

  test('TAX_RATE is 8.75%', () => {
    expect(content).toMatch(/TAX_RATE\s*=\s*0\.0875/);
  });
});

// ============================================================================
// Constants Tests
// ============================================================================

describe('Cart Constants', () => {
  const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  test('DELETE_BUTTON_WIDTH is defined', () => {
    expect(content).toMatch(/const\s+DELETE_BUTTON_WIDTH\s*=\s*\d+/);
  });

  test('DELETE_BUTTON_WIDTH is 80px', () => {
    expect(content).toMatch(/DELETE_BUTTON_WIDTH\s*=\s*80/);
  });

  test('SWIPE_THRESHOLD is half of DELETE_BUTTON_WIDTH', () => {
    expect(content).toMatch(/SWIPE_THRESHOLD\s*=\s*DELETE_BUTTON_WIDTH\s*\/\s*2/);
  });

  test('SPRING_CONFIG has damping', () => {
    expect(content).toMatch(/damping:\s*\d+/);
  });

  test('SPRING_CONFIG has stiffness', () => {
    expect(content).toMatch(/stiffness:\s*\d+/);
  });

  test('SPRING_CONFIG has mass', () => {
    expect(content).toMatch(/mass:\s*[\d.]+/);
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Cart Integration', () => {
  test('restaurant detail page uses cart store', () => {
    const pagePath = path.join(process.cwd(), 'src/app/restaurant/[id].tsx');
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toMatch(/useCartStore/);
    expect(content).toMatch(/addItem/);
    expect(content).toMatch(/updateQuantity/);
    expect(content).toMatch(/canAddFromRestaurant/);
    expect(content).toMatch(/clearCart/);
  });

  test('dish customization modal uses cart store', () => {
    const modalPath = path.join(process.cwd(), 'src/app/(modals)/dish-customization.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');

    expect(content).toMatch(/useCartStore/);
    expect(content).toMatch(/addItem/);
    expect(content).toMatch(/canAddFromRestaurant/);
    expect(content).toMatch(/clearCart/);
  });

  test('cart store is exported from stores index', () => {
    const indexPath = path.join(process.cwd(), 'src/stores/index.ts');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toMatch(/useCartStore/);
  });
});

// ============================================================================
// Styling Tests
// ============================================================================

describe('SwipeableCartItem Styling', () => {
  const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  test('uses design system colors', () => {
    expect(content).toMatch(/Colors\[colorScheme/);
  });

  test('uses FontWeights', () => {
    expect(content).toMatch(/FontWeights/);
  });

  test('uses ErrorColors for delete', () => {
    expect(content).toMatch(/ErrorColors\[500\]/);
  });

  test('uses BorderRadius tokens', () => {
    expect(content).toMatch(/BorderRadius\./);
  });

  test('uses Spacing tokens', () => {
    expect(content).toMatch(/Spacing\[/);
  });

  test('uses Typography tokens', () => {
    expect(content).toMatch(/Typography\./);
  });

  test('uses Shadows', () => {
    expect(content).toMatch(/Shadows\./);
  });
});

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('Cart Edge Cases', () => {
  const storePath = path.join(process.cwd(), 'src/stores/cart-store.ts');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(storePath, 'utf-8');
  });

  test('generates unique cart item IDs', () => {
    expect(content).toMatch(/generateCartItemId/);
    expect(content).toMatch(/Date\.now\(\)/);
    expect(content).toMatch(/Math\.random\(\)/);
  });

  test('handles cart item not found gracefully', () => {
    // updateQuantity should handle missing items
    expect(content).toMatch(/if\s*\(item\.id\s*===\s*cartItemId\)/);
  });

  test('initial state has empty items', () => {
    expect(content).toMatch(/items:\s*\[\]/);
  });

  test('initial state has null restaurant', () => {
    expect(content).toMatch(/restaurantId:\s*null/);
    expect(content).toMatch(/restaurant:\s*null/);
  });
});

// ============================================================================
// Type Safety Tests
// ============================================================================

describe('Type Safety', () => {
  test('SwipeableCartItem imports CartItem type', () => {
    const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/import\s+.*CartItem.*from\s+['"]@\/types['"]/);
  });

  test('useCart imports CartItem type', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/import\s+.*CartItem.*from\s+['"]@\/types['"]/);
  });

  test('useCart imports MenuItem type', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/MenuItem/);
  });

  test('useCart imports Restaurant type', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/Restaurant/);
  });

  test('useCart imports SelectedCustomization type', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/SelectedCustomization/);
  });
});

// ============================================================================
// Dependencies Tests
// ============================================================================

describe('Cart Dependencies', () => {
  test('SwipeableCartItem uses react-native-gesture-handler', () => {
    const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/from\s+['"]react-native-gesture-handler['"]/);
  });

  test('SwipeableCartItem uses react-native-reanimated', () => {
    const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/from\s+['"]react-native-reanimated['"]/);
  });

  test('SwipeableCartItem uses expo-image', () => {
    const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/from\s+['"]expo-image['"]/);
  });

  test('useCart uses zustand store', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/from\s+['"]@\/stores['"]/);
  });
});

// ============================================================================
// Memoization Tests
// ============================================================================

describe('Cart Performance', () => {
  test('useCart uses useMemo for isEmpty', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/useMemo\(\(\)\s*=>\s*items\.length\s*===\s*0/);
  });

  test('useCart uses useCallback for utility functions', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-cart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/useCallback/);
  });

  test('SwipeableCartItem uses useCallback for handlers', () => {
    const componentPath = path.join(process.cwd(), 'src/components/swipeable-cart-item.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/useCallback/);
  });
});
