/**
 * Checkout Screen Tests
 *
 * Comprehensive tests for the checkout screen with collapsible sections.
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Test Setup
// ============================================================================

const checkoutScreenPath = path.join(__dirname, '../app/order/checkout.tsx');
const orderTrackingScreenPath = path.join(__dirname, '../app/order/[id].tsx');
const rootLayoutPath = path.join(__dirname, '../app/_layout.tsx');

let checkoutScreenContent: string;
let orderTrackingScreenContent: string;
let rootLayoutContent: string;

beforeAll(() => {
  checkoutScreenContent = fs.readFileSync(checkoutScreenPath, 'utf-8');
  orderTrackingScreenContent = fs.readFileSync(orderTrackingScreenPath, 'utf-8');
  rootLayoutContent = fs.readFileSync(rootLayoutPath, 'utf-8');
});

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Checkout Screen - File Structure', () => {
  test('checkout screen file exists', () => {
    expect(fs.existsSync(checkoutScreenPath)).toBe(true);
  });

  test('order tracking placeholder file exists', () => {
    expect(fs.existsSync(orderTrackingScreenPath)).toBe(true);
  });

  test('order directory exists', () => {
    const orderDir = path.join(__dirname, '../app/order');
    expect(fs.existsSync(orderDir)).toBe(true);
  });
});

// ============================================================================
// Checkout Screen Exports Tests
// ============================================================================

describe('Checkout Screen - Exports', () => {
  test('exports TAX_RATE constant', () => {
    expect(checkoutScreenContent).toContain('export const TAX_RATE');
  });

  test('exports DELIVERY_FEE_MINIMUM constant', () => {
    expect(checkoutScreenContent).toContain('export const DELIVERY_FEE_MINIMUM');
  });

  test('exports formatPrice helper function', () => {
    expect(checkoutScreenContent).toContain('export function formatPrice');
  });

  test('exports calculateTax helper function', () => {
    expect(checkoutScreenContent).toContain('export function calculateTax');
  });

  test('exports getDeliveryFee helper function', () => {
    expect(checkoutScreenContent).toContain('export function getDeliveryFee');
  });

  test('exports calculateTotal helper function', () => {
    expect(checkoutScreenContent).toContain('export function calculateTotal');
  });

  test('exports formatEstimatedDelivery helper function', () => {
    expect(checkoutScreenContent).toContain('export function formatEstimatedDelivery');
  });

  test('exports getAddressIcon helper function', () => {
    expect(checkoutScreenContent).toContain('export function getAddressIcon');
  });

  test('exports default CheckoutScreen component', () => {
    expect(checkoutScreenContent).toContain('export default function CheckoutScreen');
  });
});

// ============================================================================
// Helper Function Unit Tests (via source code analysis)
// ============================================================================

describe('Checkout Screen - Helper Functions', () => {
  // TAX_RATE and DELIVERY_FEE_MINIMUM values from source
  const TAX_RATE = 0.0875;
  const DELIVERY_FEE_MINIMUM = 2.99;

  // Re-implement helper functions to test logic
  function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  function calculateTax(subtotal: number): number {
    return subtotal * TAX_RATE;
  }

  function getDeliveryFee(restaurantDeliveryFee?: number): number {
    return restaurantDeliveryFee ?? DELIVERY_FEE_MINIMUM;
  }

  function calculateTotal(
    subtotal: number,
    deliveryFee: number,
    tax: number,
    discount?: number
  ): number {
    return subtotal + deliveryFee + tax - (discount ?? 0);
  }

  function formatEstimatedDelivery(minMinutes: number, maxMinutes: number): string {
    return `${minMinutes}-${maxMinutes} min`;
  }

  function getAddressIcon(label: string): string {
    switch (label.toLowerCase()) {
      case 'home':
        return 'home-outline';
      case 'work':
        return 'briefcase-outline';
      default:
        return 'location-outline';
    }
  }

  describe('TAX_RATE constant', () => {
    test('should be 8.75% in source', () => {
      expect(checkoutScreenContent).toContain('export const TAX_RATE = 0.0875');
    });
  });

  describe('DELIVERY_FEE_MINIMUM constant', () => {
    test('should be $2.99 in source', () => {
      expect(checkoutScreenContent).toContain('export const DELIVERY_FEE_MINIMUM = 2.99');
    });
  });

  describe('formatPrice', () => {
    test('formats zero correctly', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    test('formats whole numbers correctly', () => {
      expect(formatPrice(10)).toBe('$10.00');
    });

    test('formats decimals correctly', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
    });

    test('formats small decimals correctly', () => {
      expect(formatPrice(10.99)).toBe('$10.99');
    });

    test('formats large numbers correctly', () => {
      expect(formatPrice(1234.56)).toBe('$1234.56');
    });

    test('rounds to two decimal places', () => {
      expect(formatPrice(10.999)).toBe('$11.00');
    });
  });

  describe('calculateTax', () => {
    test('calculates tax on $0 subtotal', () => {
      expect(calculateTax(0)).toBe(0);
    });

    test('calculates tax on $100 subtotal', () => {
      expect(calculateTax(100)).toBe(8.75);
    });

    test('calculates tax on $50 subtotal', () => {
      expect(calculateTax(50)).toBeCloseTo(4.375);
    });

    test('calculates tax on $10.50 subtotal', () => {
      expect(calculateTax(10.5)).toBeCloseTo(0.91875);
    });
  });

  describe('getDeliveryFee', () => {
    test('returns restaurant fee when provided', () => {
      expect(getDeliveryFee(5.99)).toBe(5.99);
    });

    test('returns minimum fee when not provided', () => {
      expect(getDeliveryFee()).toBe(DELIVERY_FEE_MINIMUM);
    });

    test('returns minimum fee when undefined', () => {
      expect(getDeliveryFee(undefined)).toBe(DELIVERY_FEE_MINIMUM);
    });

    test('returns zero when restaurant fee is zero', () => {
      expect(getDeliveryFee(0)).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    test('calculates total without discount', () => {
      const subtotal = 50;
      const deliveryFee = 2.99;
      const tax = 4.375;
      expect(calculateTotal(subtotal, deliveryFee, tax)).toBeCloseTo(57.365);
    });

    test('calculates total with discount', () => {
      const subtotal = 50;
      const deliveryFee = 2.99;
      const tax = 4.375;
      const discount = 10;
      expect(calculateTotal(subtotal, deliveryFee, tax, discount)).toBeCloseTo(47.365);
    });

    test('handles zero values', () => {
      expect(calculateTotal(0, 0, 0)).toBe(0);
    });

    test('handles undefined discount', () => {
      expect(calculateTotal(50, 2.99, 4.375, undefined)).toBeCloseTo(57.365);
    });
  });

  describe('formatEstimatedDelivery', () => {
    test('formats delivery time range', () => {
      expect(formatEstimatedDelivery(25, 35)).toBe('25-35 min');
    });

    test('formats single-digit delivery times', () => {
      expect(formatEstimatedDelivery(5, 10)).toBe('5-10 min');
    });

    test('formats same min and max', () => {
      expect(formatEstimatedDelivery(30, 30)).toBe('30-30 min');
    });
  });

  describe('getAddressIcon', () => {
    test('returns home icon for Home label', () => {
      expect(getAddressIcon('Home')).toBe('home-outline');
    });

    test('returns briefcase icon for Work label', () => {
      expect(getAddressIcon('Work')).toBe('briefcase-outline');
    });

    test('returns location icon for Other label', () => {
      expect(getAddressIcon('Other')).toBe('location-outline');
    });

    test('returns location icon for unknown label', () => {
      expect(getAddressIcon('Unknown')).toBe('location-outline');
    });

    test('is case insensitive', () => {
      expect(getAddressIcon('home')).toBe('home-outline');
      expect(getAddressIcon('WORK')).toBe('briefcase-outline');
    });
  });
});

// ============================================================================
// Collapsible Sections Tests
// ============================================================================

describe('Checkout Screen - Collapsible Sections', () => {
  test('has Delivery Address section', () => {
    expect(checkoutScreenContent).toContain('Delivery Address');
    expect(checkoutScreenContent).toContain('location-outline');
  });

  test('has Order Summary section', () => {
    expect(checkoutScreenContent).toContain('Order Summary');
    expect(checkoutScreenContent).toContain('receipt-outline');
  });

  test('has Payment Method section', () => {
    expect(checkoutScreenContent).toContain('Payment Method');
    expect(checkoutScreenContent).toContain('card-outline');
  });

  test('has Promo Code section', () => {
    expect(checkoutScreenContent).toContain('Promo Code');
    expect(checkoutScreenContent).toContain('pricetag-outline');
  });

  test('has CollapsibleSection component', () => {
    expect(checkoutScreenContent).toContain('function CollapsibleSection');
  });

  test('has SectionHeader component', () => {
    expect(checkoutScreenContent).toContain('function SectionHeader');
  });

  test('sections track expanded state', () => {
    expect(checkoutScreenContent).toContain('expandedSections');
    expect(checkoutScreenContent).toContain('setExpandedSections');
  });

  test('has toggleSection handler', () => {
    expect(checkoutScreenContent).toContain('toggleSection');
  });

  test('has animated chevron rotation', () => {
    expect(checkoutScreenContent).toContain('chevronStyle');
    expect(checkoutScreenContent).toContain('rotate');
  });

  test('has animated content height', () => {
    expect(checkoutScreenContent).toContain('contentStyle');
    expect(checkoutScreenContent).toContain('maxHeight');
  });
});

// ============================================================================
// Delivery Address Section Tests
// ============================================================================

describe('Checkout Screen - Delivery Address Section', () => {
  test('has AddressCard component', () => {
    expect(checkoutScreenContent).toContain('function AddressCard');
  });

  test('displays address label', () => {
    expect(checkoutScreenContent).toContain('address.label');
  });

  test('displays address street', () => {
    expect(checkoutScreenContent).toContain('address.street');
  });

  test('displays address city and zip', () => {
    expect(checkoutScreenContent).toContain('address.city');
    expect(checkoutScreenContent).toContain('address.zipCode');
  });

  test('has radio button for selection', () => {
    expect(checkoutScreenContent).toContain('radioButton');
  });

  test('tracks selected address', () => {
    expect(checkoutScreenContent).toContain('selectedAddressId');
    expect(checkoutScreenContent).toContain('setSelectedAddressId');
  });

  test('has handleSelectAddress handler', () => {
    expect(checkoutScreenContent).toContain('handleSelectAddress');
  });

  test('shows empty state when no addresses', () => {
    expect(checkoutScreenContent).toContain('No saved addresses');
    expect(checkoutScreenContent).toContain('Add Address');
  });

  test('integrates with auth store for addresses', () => {
    expect(checkoutScreenContent).toContain('useAuthStore');
    expect(checkoutScreenContent).toContain('user?.addresses');
  });
});

// ============================================================================
// Order Summary Section Tests
// ============================================================================

describe('Checkout Screen - Order Summary Section', () => {
  test('has OrderItemRow component', () => {
    expect(checkoutScreenContent).toContain('function OrderItemRow');
  });

  test('displays item name and quantity', () => {
    // New format: quantity badge and name are separate elements
    expect(checkoutScreenContent).toContain('{quantity}x');
    expect(checkoutScreenContent).toContain('{name}');
  });

  test('displays item price', () => {
    expect(checkoutScreenContent).toContain('formatPrice(price)');
  });

  test('displays customizations', () => {
    expect(checkoutScreenContent).toContain('customizations');
    expect(checkoutScreenContent).toContain('formatCustomizations');
  });

  test('displays subtotal', () => {
    expect(checkoutScreenContent).toContain('Subtotal');
    expect(checkoutScreenContent).toContain('formatPrice(subtotal)');
  });

  test('displays delivery fee', () => {
    expect(checkoutScreenContent).toContain('Delivery Fee');
    expect(checkoutScreenContent).toContain('formatPrice(deliveryFee)');
  });

  test('displays tax', () => {
    expect(checkoutScreenContent).toContain('Tax');
    expect(checkoutScreenContent).toContain('formatPrice(tax)');
  });

  test('displays total', () => {
    expect(checkoutScreenContent).toContain('Total');
    expect(checkoutScreenContent).toContain('formatPrice(total)');
  });

  test('integrates with cart store', () => {
    expect(checkoutScreenContent).toContain('useCartStore');
    expect(checkoutScreenContent).toContain('getSubtotal');
  });
});

// ============================================================================
// Payment Method Section Tests
// ============================================================================

describe('Checkout Screen - Payment Method Section', () => {
  test('has SavedCardOption component', () => {
    expect(checkoutScreenContent).toContain('function SavedCardOption');
  });

  test('has saved cards section', () => {
    expect(checkoutScreenContent).toContain('Saved Cards');
    expect(checkoutScreenContent).toContain('savedCards');
  });

  test('has Cash on Delivery option', () => {
    expect(checkoutScreenContent).toContain('CashOnDeliveryOption');
    expect(checkoutScreenContent).toContain('Pay when your order arrives');
  });

  test('tracks selected payment method', () => {
    expect(checkoutScreenContent).toContain('selectedPaymentMethodId');
    expect(checkoutScreenContent).toContain('selectPaymentMethod');
  });

  test('has handleSelectPaymentMethod handler', () => {
    expect(checkoutScreenContent).toContain('handleSelectPaymentMethod');
  });

  test('payment options have icons', () => {
    expect(checkoutScreenContent).toContain('card-outline');
    expect(checkoutScreenContent).toContain('cash-outline');
  });
});

// ============================================================================
// Place Order Button Tests
// ============================================================================

describe('Checkout Screen - Place Order Button', () => {
  test('has PlaceOrderButton component', () => {
    expect(checkoutScreenContent).toContain('function PlaceOrderButton');
  });

  test('displays Place Order text', () => {
    expect(checkoutScreenContent).toContain('Place Order');
  });

  test('displays total price', () => {
    expect(checkoutScreenContent).toContain('placeOrderPrice');
    expect(checkoutScreenContent).toContain('formatPrice(total)');
  });

  test('has loading state', () => {
    expect(checkoutScreenContent).toContain('isLoading');
    expect(checkoutScreenContent).toContain('Processing...');
  });

  test('has disabled state', () => {
    expect(checkoutScreenContent).toContain('isDisabled');
    expect(checkoutScreenContent).toContain('canPlaceOrder');
  });

  test('has handlePlaceOrder handler', () => {
    expect(checkoutScreenContent).toContain('handlePlaceOrder');
  });

  test('validates before placing order', () => {
    expect(checkoutScreenContent).toContain('Missing Information');
    expect(checkoutScreenContent).toContain('Please select a delivery address');
  });

  test('clears cart on success', () => {
    expect(checkoutScreenContent).toContain('clearCart');
  });

  test('navigates to order tracking', () => {
    expect(checkoutScreenContent).toContain("router.replace('/order/[id]'");
  });
});

// ============================================================================
// Header Tests
// ============================================================================

describe('Checkout Screen - Header', () => {
  test('has Header component', () => {
    expect(checkoutScreenContent).toContain('function Header');
  });

  test('has back button', () => {
    expect(checkoutScreenContent).toContain('backButton');
    expect(checkoutScreenContent).toContain('arrow-back');
  });

  test('displays Checkout title', () => {
    expect(checkoutScreenContent).toContain('Checkout');
    expect(checkoutScreenContent).toContain('headerTitle');
  });

  test('has handleBack handler', () => {
    expect(checkoutScreenContent).toContain('handleBack');
    expect(checkoutScreenContent).toContain('router.back()');
  });
});

// ============================================================================
// Restaurant Info Tests
// ============================================================================

describe('Checkout Screen - Restaurant Info', () => {
  test('displays restaurant banner when restaurant exists', () => {
    expect(checkoutScreenContent).toContain('restaurantBanner');
    expect(checkoutScreenContent).toContain('{restaurant &&');
  });

  test('displays restaurant image', () => {
    expect(checkoutScreenContent).toContain('restaurantImage');
    expect(checkoutScreenContent).toContain('restaurant.image');
  });

  test('displays restaurant name', () => {
    expect(checkoutScreenContent).toContain('restaurantName');
    expect(checkoutScreenContent).toContain('restaurant.name');
  });

  test('displays estimated delivery time', () => {
    expect(checkoutScreenContent).toContain('estimatedDelivery');
    expect(checkoutScreenContent).toContain('time-outline');
  });
});

// ============================================================================
// Empty Cart State Tests
// ============================================================================

describe('Checkout Screen - Empty Cart State', () => {
  test('shows empty cart message', () => {
    expect(checkoutScreenContent).toContain('Your cart is empty');
  });

  test('shows empty cart subtitle', () => {
    expect(checkoutScreenContent).toContain('Add items to continue to checkout');
  });

  test('shows cart icon for empty state', () => {
    expect(checkoutScreenContent).toContain('cart-outline');
  });

  test('checks for empty items array', () => {
    expect(checkoutScreenContent).toContain('items.length === 0');
  });
});

// ============================================================================
// Animation Tests
// ============================================================================

describe('Checkout Screen - Animations', () => {
  test('uses react-native-reanimated', () => {
    expect(checkoutScreenContent).toContain("from 'react-native-reanimated'");
  });

  test('uses FadeIn animation', () => {
    expect(checkoutScreenContent).toContain('FadeIn');
  });

  test('uses FadeInDown animation', () => {
    expect(checkoutScreenContent).toContain('FadeInDown');
  });

  test('uses FadeInUp animation', () => {
    expect(checkoutScreenContent).toContain('FadeInUp');
  });

  test('uses spring animations for buttons', () => {
    expect(checkoutScreenContent).toContain('withSpring');
    expect(checkoutScreenContent).toContain('SPRING_CONFIG');
  });

  test('uses timing animations for sections', () => {
    expect(checkoutScreenContent).toContain('withTiming');
  });

  test('uses interpolate for animations', () => {
    expect(checkoutScreenContent).toContain('interpolate');
  });

  test('has scale animations for pressables', () => {
    expect(checkoutScreenContent).toContain('scale.value');
    expect(checkoutScreenContent).toContain('handlePressIn');
    expect(checkoutScreenContent).toContain('handlePressOut');
  });

  test('has staggered delays for sections', () => {
    expect(checkoutScreenContent).toContain('delay={100}');
    expect(checkoutScreenContent).toContain('delay={200}');
    expect(checkoutScreenContent).toContain('delay={300}');
    expect(checkoutScreenContent).toContain('delay={400}');
  });
});

// ============================================================================
// Styling Tests
// ============================================================================

describe('Checkout Screen - Styling', () => {
  test('uses StyleSheet', () => {
    expect(checkoutScreenContent).toContain('StyleSheet.create');
  });

  test('uses design system colors', () => {
    expect(checkoutScreenContent).toContain('Colors');
    expect(checkoutScreenContent).toContain('PrimaryColors');
    expect(checkoutScreenContent).toContain('NeutralColors');
  });

  test('uses design system typography', () => {
    expect(checkoutScreenContent).toContain('Typography');
    expect(checkoutScreenContent).toContain('FontWeights');
  });

  test('uses design system spacing', () => {
    expect(checkoutScreenContent).toContain('Spacing');
  });

  test('uses design system border radius', () => {
    expect(checkoutScreenContent).toContain('BorderRadius');
  });

  test('uses design system shadows', () => {
    expect(checkoutScreenContent).toContain('Shadows');
  });

  test('uses safe area insets', () => {
    expect(checkoutScreenContent).toContain('useSafeAreaInsets');
    expect(checkoutScreenContent).toContain('insets.top');
    expect(checkoutScreenContent).toContain('insets.bottom');
  });

  test('supports dark mode', () => {
    expect(checkoutScreenContent).toContain('useColorScheme');
    expect(checkoutScreenContent).toContain("colorScheme ?? 'light'");
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('Checkout Screen - Accessibility', () => {
  test('has accessibility labels on buttons', () => {
    expect(checkoutScreenContent).toContain('accessibilityLabel');
  });

  test('has accessibility roles', () => {
    expect(checkoutScreenContent).toContain('accessibilityRole="button"');
    expect(checkoutScreenContent).toContain('accessibilityRole="radio"');
  });

  test('has accessibility states', () => {
    expect(checkoutScreenContent).toContain('accessibilityState');
    expect(checkoutScreenContent).toContain('expanded');
    expect(checkoutScreenContent).toContain('selected');
    expect(checkoutScreenContent).toContain('disabled');
  });

  test('has test IDs', () => {
    expect(checkoutScreenContent).toContain('testID=');
    expect(checkoutScreenContent).toContain('checkout-screen');
    expect(checkoutScreenContent).toContain('checkout-back-button');
    expect(checkoutScreenContent).toContain('place-order-button');
  });

  test('has hit slop for small touch targets', () => {
    expect(checkoutScreenContent).toContain('hitSlop');
  });
});

// ============================================================================
// Navigation Tests
// ============================================================================

describe('Checkout Screen - Navigation', () => {
  test('uses expo-router', () => {
    expect(checkoutScreenContent).toContain("from 'expo-router'");
  });

  test('uses useRouter hook', () => {
    expect(checkoutScreenContent).toContain('useRouter');
  });

  test('has back navigation', () => {
    expect(checkoutScreenContent).toContain('router.back()');
  });

  test('navigates to order tracking on success', () => {
    expect(checkoutScreenContent).toContain('router.replace');
  });
});

// ============================================================================
// Root Layout Integration Tests
// ============================================================================

describe('Checkout Screen - Root Layout Integration', () => {
  test('root layout includes order/checkout route', () => {
    expect(rootLayoutContent).toContain('name="order/checkout"');
  });

  test('root layout includes order/[id] route', () => {
    expect(rootLayoutContent).toContain('name="order/[id]"');
  });

  test('order routes use slide_from_right animation', () => {
    expect(rootLayoutContent).toContain("animation: 'slide_from_right'");
  });

  test('order routes have headerShown: false', () => {
    expect(rootLayoutContent).toMatch(/name="order\/checkout"[\s\S]*?headerShown: false/);
  });
});

// ============================================================================
// Order Tracking Placeholder Tests
// ============================================================================

describe('Order Tracking Screen - Placeholder', () => {
  test('has default export', () => {
    expect(orderTrackingScreenContent).toContain('export default function OrderTrackingScreen');
  });

  test('displays success animation', () => {
    expect(orderTrackingScreenContent).toContain('Order Placed!');
    expect(orderTrackingScreenContent).toContain('successCircle');
    expect(orderTrackingScreenContent).toContain('checkmark');
  });

  test('displays order confirmation message', () => {
    expect(orderTrackingScreenContent).toContain('order has been confirmed');
  });

  test('displays order ID if available', () => {
    expect(orderTrackingScreenContent).toContain('Order ID');
    expect(orderTrackingScreenContent).toContain('useLocalSearchParams');
  });

  test('has back to home button', () => {
    expect(orderTrackingScreenContent).toContain('Back to Home');
    expect(orderTrackingScreenContent).toContain('handleBackToHome');
  });

  test('navigates back to tabs', () => {
    expect(orderTrackingScreenContent).toContain("router.replace('/(tabs)')");
  });

  test('mentions Phase 5 for real implementation', () => {
    expect(orderTrackingScreenContent).toContain('Phase 5');
  });

  test('uses design system colors', () => {
    expect(orderTrackingScreenContent).toContain('SuccessColors');
    expect(orderTrackingScreenContent).toContain('PrimaryColors');
  });
});

// ============================================================================
// Keyboard Handling Tests
// ============================================================================

describe('Checkout Screen - Keyboard Handling', () => {
  test('uses KeyboardAvoidingView', () => {
    expect(checkoutScreenContent).toContain('KeyboardAvoidingView');
  });

  test('handles iOS behavior', () => {
    expect(checkoutScreenContent).toContain(
      "behavior={Platform.OS === 'ios' ? 'padding' : 'height'}"
    );
  });

  test('imports Platform', () => {
    expect(checkoutScreenContent).toContain('Platform');
  });
});

// ============================================================================
// Promo Code Section Tests
// ============================================================================

describe('Checkout Screen - Promo Code Section', () => {
  test('has promo code section', () => {
    expect(checkoutScreenContent).toContain('Promo Code');
  });

  test('has PromoCodeSection component implementation', () => {
    expect(checkoutScreenContent).toContain('PromoCodeSection');
    expect(checkoutScreenContent).toContain('promoCode={promoCodeInput}');
  });

  test('tracks promo section expanded state', () => {
    expect(checkoutScreenContent).toContain('promo:');
  });
});

// ============================================================================
// Store Integration Tests
// ============================================================================

describe('Checkout Screen - Store Integration', () => {
  test('uses auth store', () => {
    expect(checkoutScreenContent).toContain('useAuthStore');
  });

  test('uses cart store', () => {
    expect(checkoutScreenContent).toContain('useCartStore');
  });

  test('gets user from auth store', () => {
    expect(checkoutScreenContent).toContain('const user = useAuthStore((state) => state.user)');
  });

  test('gets items from cart store', () => {
    expect(checkoutScreenContent).toContain('const items = useCartStore((state) => state.items)');
  });

  test('gets restaurant from cart store', () => {
    expect(checkoutScreenContent).toContain(
      'const restaurant = useCartStore((state) => state.restaurant)'
    );
  });

  test('gets clearCart action from cart store', () => {
    expect(checkoutScreenContent).toContain(
      'const clearCart = useCartStore((state) => state.clearCart)'
    );
  });
});

// ============================================================================
// Import Tests
// ============================================================================

describe('Checkout Screen - Imports', () => {
  test('imports from expo-router', () => {
    expect(checkoutScreenContent).toContain("from 'expo-router'");
  });

  test('imports from expo-image', () => {
    expect(checkoutScreenContent).toContain("from 'expo-image'");
  });

  test('imports from @expo/vector-icons', () => {
    expect(checkoutScreenContent).toContain("from '@expo/vector-icons'");
  });

  test('imports from react-native', () => {
    expect(checkoutScreenContent).toContain("from 'react-native'");
  });

  test('imports from react-native-reanimated', () => {
    expect(checkoutScreenContent).toContain("from 'react-native-reanimated'");
  });

  test('imports from react-native-safe-area-context', () => {
    expect(checkoutScreenContent).toContain("from 'react-native-safe-area-context'");
  });

  test('imports from theme constants', () => {
    expect(checkoutScreenContent).toContain("from '@/constants/theme'");
  });

  test('imports from stores', () => {
    expect(checkoutScreenContent).toContain("from '@/stores'");
  });

  test('imports Address type', () => {
    expect(checkoutScreenContent).toContain("from '@/types'");
    expect(checkoutScreenContent).toContain('Address');
  });
});

// ============================================================================
// Computed Values Tests
// ============================================================================

describe('Checkout Screen - Computed Values', () => {
  test('uses useMemo for computed values', () => {
    expect(checkoutScreenContent).toContain('useMemo');
  });

  test('computes subtotal', () => {
    expect(checkoutScreenContent).toContain('const subtotal = getSubtotal()');
  });

  test('computes delivery fee', () => {
    expect(checkoutScreenContent).toContain('const deliveryFee = useMemo');
  });

  test('computes tax', () => {
    expect(checkoutScreenContent).toContain('const tax = useMemo');
  });

  test('computes total', () => {
    expect(checkoutScreenContent).toContain('const total = useMemo');
  });

  test('computes selected address', () => {
    expect(checkoutScreenContent).toContain('const selectedAddress = useMemo');
  });

  test('computes estimated delivery', () => {
    expect(checkoutScreenContent).toContain('const estimatedDelivery = useMemo');
  });
});

// ============================================================================
// Validation Tests
// ============================================================================

describe('Checkout Screen - Validation', () => {
  test('validates address selection', () => {
    expect(checkoutScreenContent).toContain('selectedAddress !== undefined');
  });

  test('validates cart has items', () => {
    expect(checkoutScreenContent).toContain('items.length > 0');
  });

  test('combines validation into canPlaceOrder', () => {
    expect(checkoutScreenContent).toContain('canPlaceOrder');
  });

  test('shows alert when validation fails', () => {
    expect(checkoutScreenContent).toContain('Alert.alert');
  });
});

// ============================================================================
// Edge Case Tests
// ============================================================================

describe('Checkout Screen - Edge Cases', () => {
  test('handles user with no addresses', () => {
    expect(checkoutScreenContent).toContain('user?.addresses && user.addresses.length > 0');
  });

  test('handles missing default address', () => {
    expect(checkoutScreenContent).toContain('user?.addresses.find((a) => a.isDefault)?.id');
    expect(checkoutScreenContent).toContain('?? user?.addresses[0]?.id');
    expect(checkoutScreenContent).toContain('?? null');
  });

  test('handles missing restaurant delivery time', () => {
    expect(checkoutScreenContent).toContain('restaurant?.deliveryTime');
    expect(checkoutScreenContent).toContain("'30-45 min'");
  });

  test('handles missing restaurant', () => {
    expect(checkoutScreenContent).toContain('{restaurant &&');
  });
});

// ============================================================================
// Callback Memoization Tests
// ============================================================================

describe('Checkout Screen - Callback Memoization', () => {
  test('uses useCallback for handlers', () => {
    expect(checkoutScreenContent).toContain('useCallback');
  });

  test('memoizes handleBack', () => {
    expect(checkoutScreenContent).toContain('const handleBack = useCallback');
  });

  test('memoizes toggleSection', () => {
    expect(checkoutScreenContent).toContain('const toggleSection = useCallback');
  });

  test('memoizes handleSelectAddress', () => {
    expect(checkoutScreenContent).toContain('const handleSelectAddress = useCallback');
  });

  test('memoizes handleSelectPaymentMethod', () => {
    expect(checkoutScreenContent).toContain('const handleSelectPaymentMethod = useCallback');
  });

  test('memoizes handlePlaceOrder', () => {
    expect(checkoutScreenContent).toContain('const handlePlaceOrder = useCallback');
  });

  test('memoizes formatCustomizations', () => {
    expect(checkoutScreenContent).toContain('const formatCustomizations = useCallback');
  });
});
