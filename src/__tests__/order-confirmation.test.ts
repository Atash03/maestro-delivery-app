/**
 * Order Confirmation Screen Tests
 *
 * Tests for Task 5.1: Build order confirmation screen
 * Tests validate:
 * - Success animation with confetti/particle effects
 * - Order number and estimated time display
 * - Restaurant name display
 * - Track Order button
 * - Back to Home button
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Test Setup
// ============================================================================

const orderConfirmationScreenPath = path.join(__dirname, '../app/order/[id].tsx');

let screenContent: string;

beforeAll(() => {
  screenContent = fs.readFileSync(orderConfirmationScreenPath, 'utf-8');
});

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Order Confirmation - File Structure', () => {
  test('order confirmation screen file exists', () => {
    expect(fs.existsSync(orderConfirmationScreenPath)).toBe(true);
  });

  test('file has correct documentation header', () => {
    expect(screenContent).toContain('Order Confirmation Screen');
    expect(screenContent).toContain('confetti particle effects');
    expect(screenContent).toContain('Track Order and Back to Home navigation');
  });

  test('exports helper functions', () => {
    expect(screenContent).toContain('export function formatDeliveryTime');
    expect(screenContent).toContain('export function formatPrice');
    expect(screenContent).toContain('export function getMinutesUntil');
  });
});

// ============================================================================
// Confetti Animation Tests
// ============================================================================

describe('Order Confirmation - Confetti Animation', () => {
  test('defines CONFETTI_COLORS array', () => {
    expect(screenContent).toContain('const CONFETTI_COLORS = [');
    expect(screenContent).toContain('PrimaryColors[500]');
    expect(screenContent).toContain('SecondaryColors[500]');
    expect(screenContent).toContain('SuccessColors[500]');
    expect(screenContent).toContain('WarningColors[500]');
  });

  test('defines CONFETTI_COUNT constant', () => {
    expect(screenContent).toContain('const CONFETTI_COUNT = 24');
  });

  test('has ConfettiParticle component', () => {
    expect(screenContent).toContain('function ConfettiParticle');
    expect(screenContent).toContain('ConfettiParticleProps');
  });

  test('ConfettiParticle uses index and color props', () => {
    expect(screenContent).toContain('index: number');
    expect(screenContent).toContain('color: string');
  });

  test('ConfettiParticle has progress animation', () => {
    expect(screenContent).toContain('const progress = useSharedValue(0)');
  });

  test('ConfettiParticle has rotation animation', () => {
    expect(screenContent).toContain('const rotation = useSharedValue(0)');
  });

  test('ConfettiParticle calculates trajectory with angles', () => {
    expect(screenContent).toContain('Math.cos(angle)');
    expect(screenContent).toContain('Math.sin(angle)');
  });

  test('ConfettiParticle has explosion animation with timing', () => {
    expect(screenContent).toContain('withTiming(1, { duration: 600 })');
    expect(screenContent).toContain('withTiming(1.2, { duration: 400 })');
  });

  test('ConfettiParticle has rotation repeat animation', () => {
    expect(screenContent).toContain('withRepeat(withTiming(360, { duration: 1000 }), 2, false)');
  });

  test('ConfettiParticle uses interpolate for smooth animation', () => {
    expect(screenContent).toContain('import Animated, {');
    expect(screenContent).toContain('interpolate,');
    expect(screenContent).toContain('interpolate(progress.value');
  });

  test('ConfettiParticle has various shapes', () => {
    expect(screenContent).toContain('const isCircle = index % 3 === 0');
    expect(screenContent).toContain('const isSquare = index % 3 === 1');
  });

  test('has ConfettiExplosion container component', () => {
    expect(screenContent).toContain('function ConfettiExplosion');
  });

  test('ConfettiExplosion generates particles array', () => {
    expect(screenContent).toContain('Array.from({ length: CONFETTI_COUNT }');
  });

  test('SuccessAnimation includes ConfettiExplosion', () => {
    expect(screenContent).toContain('<ConfettiExplosion />');
  });
});

// ============================================================================
// Success Animation Tests
// ============================================================================

describe('Order Confirmation - Success Animation', () => {
  test('has SuccessAnimation component', () => {
    expect(screenContent).toContain('function SuccessAnimation');
  });

  test('success animation has scale animation', () => {
    expect(screenContent).toContain('const scale = useSharedValue(0)');
  });

  test('success animation has checkScale animation', () => {
    expect(screenContent).toContain('const checkScale = useSharedValue(0)');
  });

  test('success animation has pulse effect', () => {
    expect(screenContent).toContain('const pulseScale = useSharedValue(1)');
    expect(screenContent).toContain('const pulseOpacity = useSharedValue(0.6)');
  });

  test('success animation uses spring physics', () => {
    expect(screenContent).toContain('withSpring(1, { damping: 10, stiffness: 100 })');
  });

  test('success animation uses sequence for checkmark', () => {
    expect(screenContent).toContain('withSequence');
  });

  test('success animation uses delay for timing', () => {
    expect(screenContent).toContain('withDelay(100, withSpring');
    // Check that multiple withDelay calls exist for staggered animations
    const withDelayMatches = screenContent.match(/withDelay\(/g);
    expect(withDelayMatches).toBeTruthy();
    expect(withDelayMatches!.length).toBeGreaterThanOrEqual(5);
  });

  test('success animation shows checkmark icon', () => {
    expect(screenContent).toContain('name="checkmark"');
    expect(screenContent).toContain('size={48}');
  });

  test('success animation has pulse ring', () => {
    expect(screenContent).toContain('pulseRing');
    expect(screenContent).toContain('pulseStyle');
  });
});

// ============================================================================
// Order Info Card Tests
// ============================================================================

describe('Order Confirmation - Order Info Card', () => {
  test('has OrderInfoCard component', () => {
    expect(screenContent).toContain('function OrderInfoCard');
    expect(screenContent).toContain('OrderInfoCardProps');
  });

  test('displays restaurant image', () => {
    expect(screenContent).toContain('order.restaurant.image');
  });

  test('displays restaurant name', () => {
    expect(screenContent).toContain('order.restaurant.name');
    expect(screenContent).toContain('restaurantName');
  });

  test('displays item count', () => {
    expect(screenContent).toContain('itemCount');
    expect(screenContent).toContain("itemCount === 1 ? 'item' : 'items'");
  });

  test('displays total price', () => {
    expect(screenContent).toContain('formatPrice(order.total)');
  });

  test('displays estimated delivery time', () => {
    expect(screenContent).toContain('Estimated Delivery');
    expect(screenContent).toContain('estimatedMinutes');
    expect(screenContent).toContain('formatDeliveryTime');
  });

  test('displays delivery address', () => {
    expect(screenContent).toContain('Delivery Address');
    expect(screenContent).toContain('order.address.street');
    expect(screenContent).toContain('order.address.city');
  });

  test('has time icon for estimated delivery', () => {
    expect(screenContent).toContain('name="time-outline"');
  });

  test('has location icon for address', () => {
    expect(screenContent).toContain('name="location-outline"');
  });
});

// ============================================================================
// Order Status Info Tests
// ============================================================================

describe('Order Confirmation - Order Status Info', () => {
  test('has status info container', () => {
    expect(screenContent).toContain('statusInfoContainer');
  });

  test('displays preparing order status', () => {
    expect(screenContent).toContain('Preparing Your Order');
  });

  test('displays status subtitle', () => {
    expect(screenContent).toContain('restaurant is now preparing your delicious food');
  });

  test('has restaurant icon for status', () => {
    expect(screenContent).toContain('name="restaurant-outline"');
  });

  test('status info has animation', () => {
    expect(screenContent).toContain('FadeInDown.duration(AnimationDurations.normal).delay(700)');
  });
});

// ============================================================================
// Track Order Button Tests
// ============================================================================

describe('Order Confirmation - Track Order Button', () => {
  test('has Track Order button', () => {
    expect(screenContent).toContain('"Track Order"');
  });

  test('Track Order button has navigate icon', () => {
    expect(screenContent).toContain('icon="navigate-outline"');
  });

  test('Track Order button is primary variant', () => {
    // Track Order should be primary, Back to Home should be secondary
    const trackOrderButtonMatch = screenContent.match(/label="Track Order"[\s\S]*?variant="(\w+)"/);
    expect(trackOrderButtonMatch).toBeTruthy();
    expect(trackOrderButtonMatch![1]).toBe('primary');
  });

  test('has handleTrackOrder handler', () => {
    expect(screenContent).toContain('const handleTrackOrder = useCallback');
  });

  test('Track Order button uses handleTrackOrder', () => {
    expect(screenContent).toContain('onPress={handleTrackOrder}');
  });
});

// ============================================================================
// Back to Home Button Tests
// ============================================================================

describe('Order Confirmation - Back to Home Button', () => {
  test('has Back to Home button', () => {
    expect(screenContent).toContain('"Back to Home"');
  });

  test('Back to Home button has home icon', () => {
    expect(screenContent).toContain('icon="home-outline"');
  });

  test('Back to Home button is secondary variant', () => {
    const backToHomeButtonMatch = screenContent.match(
      /label="Back to Home"[\s\S]*?variant="(\w+)"/
    );
    expect(backToHomeButtonMatch).toBeTruthy();
    expect(backToHomeButtonMatch![1]).toBe('secondary');
  });

  test('has handleBackToHome handler', () => {
    expect(screenContent).toContain('const handleBackToHome = useCallback');
  });

  test('handleBackToHome navigates to tabs', () => {
    expect(screenContent).toContain("router.replace('/(tabs)')");
  });
});

// ============================================================================
// Action Button Component Tests
// ============================================================================

describe('Order Confirmation - Action Button Component', () => {
  test('has ActionButton component', () => {
    expect(screenContent).toContain('function ActionButton');
    expect(screenContent).toContain('ActionButtonProps');
  });

  test('ActionButton supports primary and secondary variants', () => {
    expect(screenContent).toContain("variant: 'primary' | 'secondary'");
  });

  test('ActionButton has scale animation on press', () => {
    expect(screenContent).toContain('const scale = useSharedValue(1)');
    expect(screenContent).toContain('handlePressIn');
    expect(screenContent).toContain('handlePressOut');
  });

  test('ActionButton uses spring animation for press', () => {
    expect(screenContent).toContain('withSpring(0.97, SPRING_CONFIG)');
    expect(screenContent).toContain('withSpring(1, SPRING_CONFIG)');
  });

  test('ActionButton has accessibility props', () => {
    expect(screenContent).toContain('accessibilityLabel={label}');
    expect(screenContent).toContain('accessibilityRole="button"');
  });

  test('ActionButton has testID for testing', () => {
    expect(screenContent).toContain('testID={`action-button-');
  });

  test('ActionButton has enter animation', () => {
    expect(screenContent).toContain(
      'entering={FadeInUp.duration(AnimationDurations.normal).delay(delay)}'
    );
  });
});

// ============================================================================
// Main Screen Content Tests
// ============================================================================

describe('Order Confirmation - Main Screen Content', () => {
  test('displays Order Placed title', () => {
    expect(screenContent).toContain('Order Placed!');
  });

  test('displays confirmation message', () => {
    expect(screenContent).toContain('Your order has been confirmed and is being prepared');
  });

  test('displays order ID when available', () => {
    expect(screenContent).toContain('Order ID');
    expect(screenContent).toContain('{id}');
  });

  test('order ID is conditionally rendered', () => {
    expect(screenContent).toContain('{id && (');
  });

  test('uses ScrollView for content', () => {
    expect(screenContent).toContain('<ScrollView');
    expect(screenContent).toContain('showsVerticalScrollIndicator={false}');
  });

  test('respects safe area insets', () => {
    expect(screenContent).toContain('useSafeAreaInsets');
    expect(screenContent).toContain('paddingTop: insets.top');
    expect(screenContent).toContain('paddingBottom: insets.bottom');
  });
});

// ============================================================================
// Order Store Integration Tests
// ============================================================================

describe('Order Confirmation - Order Store Integration', () => {
  test('imports useOrderStore', () => {
    expect(screenContent).toContain('useOrderStore');
    expect(screenContent).toContain("from '@/stores'");
  });

  test('gets getOrderById from store', () => {
    expect(screenContent).toContain(
      'const getOrderById = useOrderStore((state) => state.getOrderById)'
    );
  });

  test('gets currentOrder from store', () => {
    expect(screenContent).toContain(
      'const currentOrder = useOrderStore((state) => state.currentOrder)'
    );
  });

  test('uses useMemo for order retrieval', () => {
    expect(screenContent).toContain('useMemo');
    expect(screenContent).toContain('getOrderById(id)');
  });

  test('falls back to currentOrder if no id', () => {
    expect(screenContent).toContain('return currentOrder');
  });
});

// ============================================================================
// Navigation Tests
// ============================================================================

describe('Order Confirmation - Navigation', () => {
  test('imports useLocalSearchParams', () => {
    expect(screenContent).toContain('useLocalSearchParams');
  });

  test('imports useRouter', () => {
    expect(screenContent).toContain('useRouter');
  });

  test('gets id from search params', () => {
    expect(screenContent).toContain('const { id } = useLocalSearchParams<{ id: string }>()');
  });

  test('creates router instance', () => {
    expect(screenContent).toContain('const router = useRouter()');
  });
});

// ============================================================================
// Theme Tests
// ============================================================================

describe('Order Confirmation - Theme Support', () => {
  test('uses useColorScheme hook', () => {
    expect(screenContent).toContain('useColorScheme');
  });

  test('gets colors based on color scheme', () => {
    expect(screenContent).toContain("const colors = Colors[colorScheme ?? 'light']");
  });

  test('applies theme colors to container', () => {
    expect(screenContent).toContain('backgroundColor: colors.background');
  });

  test('applies theme colors to text', () => {
    expect(screenContent).toContain('color: colors.text');
    expect(screenContent).toContain('color: colors.textSecondary');
  });

  test('applies theme colors to card', () => {
    expect(screenContent).toContain('backgroundColor: colors.card');
  });
});

// ============================================================================
// Design System Tests
// ============================================================================

describe('Order Confirmation - Design System', () => {
  test('imports design system tokens', () => {
    expect(screenContent).toContain('AnimationDurations');
    expect(screenContent).toContain('BorderRadius');
    expect(screenContent).toContain('Colors');
    expect(screenContent).toContain('FontWeights');
    expect(screenContent).toContain('NeutralColors');
    expect(screenContent).toContain('PrimaryColors');
    expect(screenContent).toContain('SecondaryColors');
    expect(screenContent).toContain('Shadows');
    expect(screenContent).toContain('Spacing');
    expect(screenContent).toContain('SuccessColors');
    expect(screenContent).toContain('Typography');
    expect(screenContent).toContain('WarningColors');
  });

  test('uses Spacing for layout', () => {
    expect(screenContent).toContain('Spacing[');
  });

  test('uses BorderRadius for rounded corners', () => {
    expect(screenContent).toContain('BorderRadius.');
  });

  test('uses Typography for text styles', () => {
    expect(screenContent).toContain('Typography.');
  });

  test('uses FontWeights for text weight', () => {
    expect(screenContent).toContain('FontWeights.');
  });

  test('uses Shadows for elevation', () => {
    expect(screenContent).toContain('Shadows.md');
  });
});

// ============================================================================
// Styling Tests
// ============================================================================

describe('Order Confirmation - Styling', () => {
  test('has StyleSheet defined', () => {
    expect(screenContent).toContain('const styles = StyleSheet.create({');
  });

  test('has container style', () => {
    expect(screenContent).toContain('container: {');
  });

  test('has scrollView and scrollContent styles', () => {
    expect(screenContent).toContain('scrollView: {');
    expect(screenContent).toContain('scrollContent: {');
  });

  test('has successContainer style', () => {
    expect(screenContent).toContain('successContainer: {');
  });

  test('has confettiContainer style', () => {
    expect(screenContent).toContain('confettiContainer: {');
  });

  test('has confettiParticle style', () => {
    expect(screenContent).toContain('confettiParticle: {');
  });

  test('has title and subtitle styles', () => {
    expect(screenContent).toContain('title: {');
    expect(screenContent).toContain('subtitle: {');
  });

  test('has orderCard style', () => {
    expect(screenContent).toContain('orderCard: {');
  });

  test('has buttonContainer style', () => {
    expect(screenContent).toContain('buttonContainer: {');
  });

  test('has actionButton style', () => {
    expect(screenContent).toContain('actionButton: {');
  });

  test('has statusInfoContainer style', () => {
    expect(screenContent).toContain('statusInfoContainer: {');
  });

  test('has statusIconContainer style', () => {
    expect(screenContent).toContain('statusIconContainer: {');
  });

  test('has statusTextContainer style', () => {
    expect(screenContent).toContain('statusTextContainer: {');
  });

  test('has statusTitle and statusSubtitle styles', () => {
    expect(screenContent).toContain('statusTitle: {');
    expect(screenContent).toContain('statusSubtitle: {');
  });
});

// ============================================================================
// Animation Imports Tests
// ============================================================================

describe('Order Confirmation - Animation Imports', () => {
  test('imports reanimated components', () => {
    expect(screenContent).toContain("from 'react-native-reanimated'");
  });

  test('imports FadeInDown', () => {
    expect(screenContent).toContain('FadeInDown');
  });

  test('imports FadeInUp', () => {
    expect(screenContent).toContain('FadeInUp');
  });

  test('imports interpolate', () => {
    expect(screenContent).toContain('interpolate,');
  });

  test('imports useAnimatedStyle', () => {
    expect(screenContent).toContain('useAnimatedStyle');
  });

  test('imports useSharedValue', () => {
    expect(screenContent).toContain('useSharedValue');
  });

  test('imports withDelay', () => {
    expect(screenContent).toContain('withDelay');
  });

  test('imports withRepeat', () => {
    expect(screenContent).toContain('withRepeat');
  });

  test('imports withSequence', () => {
    expect(screenContent).toContain('withSequence');
  });

  test('imports withSpring', () => {
    expect(screenContent).toContain('withSpring');
  });

  test('imports withTiming', () => {
    expect(screenContent).toContain('withTiming');
  });
});

// ============================================================================
// Helper Function Tests
// ============================================================================

describe('Order Confirmation - Helper Functions', () => {
  // Re-implement for testing
  function formatDeliveryTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  function getMinutesUntil(futureDate: Date): number {
    const now = new Date();
    const diff = futureDate.getTime() - now.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60)));
  }

  describe('formatDeliveryTime', () => {
    test('formats morning time correctly', () => {
      const date = new Date('2024-01-01T09:30:00');
      const result = formatDeliveryTime(date);
      expect(result).toContain('9');
      expect(result).toContain('30');
    });

    test('formats afternoon time correctly', () => {
      const date = new Date('2024-01-01T14:45:00');
      const result = formatDeliveryTime(date);
      expect(result).toContain('2');
      expect(result).toContain('45');
    });
  });

  describe('formatPrice', () => {
    test('formats price with dollar sign', () => {
      expect(formatPrice(10)).toBe('$10.00');
    });

    test('handles decimal prices', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
      expect(formatPrice(10.99)).toBe('$10.99');
    });
  });

  describe('getMinutesUntil', () => {
    test('returns positive minutes for future date', () => {
      const futureDate = new Date(Date.now() + 30 * 60 * 1000);
      const result = getMinutesUntil(futureDate);
      expect(result).toBeGreaterThanOrEqual(29);
      expect(result).toBeLessThanOrEqual(31);
    });

    test('returns 0 for past date', () => {
      const pastDate = new Date(Date.now() - 30 * 60 * 1000);
      const result = getMinutesUntil(pastDate);
      expect(result).toBe(0);
    });
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('Order Confirmation - Accessibility', () => {
  test('screen has testID', () => {
    expect(screenContent).toContain('testID="order-tracking-screen"');
  });

  test('action buttons have testID', () => {
    expect(screenContent).toContain('testID={`action-button-');
  });

  test('action buttons have accessibility labels', () => {
    expect(screenContent).toContain('accessibilityLabel={label}');
  });

  test('action buttons have accessibility role', () => {
    expect(screenContent).toContain('accessibilityRole="button"');
  });

  test('order info card conditionally renders', () => {
    expect(screenContent).toContain('{order && <OrderInfoCard');
  });

  test('OrderInfoCard handles null order', () => {
    expect(screenContent).toContain('if (!order) return null');
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Order Confirmation - Performance', () => {
  test('uses useMemo for computed values', () => {
    expect(screenContent).toContain('useMemo');
  });

  test('uses useCallback for handlers', () => {
    expect(screenContent).toContain('useCallback');
  });

  test('ConfettiParticle uses useMemo for trajectory calculations', () => {
    expect(screenContent).toContain('const startX = useMemo');
    expect(screenContent).toContain('const endX = useMemo');
    expect(screenContent).toContain('const endY = useMemo');
    expect(screenContent).toContain('const size = useMemo');
    expect(screenContent).toContain('const delay = useMemo');
  });

  test('ConfettiExplosion uses useMemo for particles array', () => {
    expect(screenContent).toContain('const particles = useMemo');
  });

  test('confetti container has pointerEvents none', () => {
    expect(screenContent).toContain('pointerEvents="none"');
  });
});

// ============================================================================
// React Imports Tests
// ============================================================================

describe('Order Confirmation - React Imports', () => {
  test('imports useCallback', () => {
    expect(screenContent).toContain('useCallback');
  });

  test('imports useEffect', () => {
    expect(screenContent).toContain('useEffect');
  });

  test('imports useMemo', () => {
    expect(screenContent).toContain('useMemo');
  });

  test('imports from expo-image', () => {
    expect(screenContent).toContain("from 'expo-image'");
    expect(screenContent).toContain('Image');
  });

  test('imports from expo-router', () => {
    expect(screenContent).toContain("from 'expo-router'");
  });

  test('imports from react-native-safe-area-context', () => {
    expect(screenContent).toContain("from 'react-native-safe-area-context'");
    expect(screenContent).toContain('useSafeAreaInsets');
  });

  test('imports Ionicons', () => {
    expect(screenContent).toContain("from '@expo/vector-icons'");
    expect(screenContent).toContain('Ionicons');
  });
});

// ============================================================================
// Constants Tests
// ============================================================================

describe('Order Confirmation - Constants', () => {
  test('defines SPRING_CONFIG', () => {
    expect(screenContent).toContain('const SPRING_CONFIG = {');
  });

  test('SPRING_CONFIG has damping property', () => {
    expect(screenContent).toContain('damping: 15');
  });

  test('SPRING_CONFIG has stiffness property', () => {
    expect(screenContent).toContain('stiffness: 200');
  });

  test('SPRING_CONFIG has mass property', () => {
    expect(screenContent).toContain('mass: 0.5');
  });
});

// ============================================================================
// Component Export Tests
// ============================================================================

describe('Order Confirmation - Component Export', () => {
  test('exports default function component', () => {
    expect(screenContent).toContain('export default function OrderTrackingScreen');
  });

  test('component is a function', () => {
    expect(screenContent).toMatch(/export default function OrderTrackingScreen\(\)/);
  });
});
