/**
 * Order History Screen Tests
 *
 * Comprehensive tests for order history functionality including:
 * - Orders screen with Active/Past tabs
 * - OrderCard component
 * - OrderCardSkeleton component
 * - useOrderHistory hook
 * - Empty states and loading states
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeEach, describe, expect, test } from '@jest/globals';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Order History - File Structure', () => {
  const srcPath = path.join(process.cwd(), 'src');

  test('Orders screen file exists', () => {
    const screenPath = path.join(srcPath, 'app/(tabs)/orders.tsx');
    expect(fs.existsSync(screenPath)).toBe(true);
  });

  test('OrderCard component file exists', () => {
    const componentPath = path.join(srcPath, 'components/cards/order-card.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  test('OrderCardSkeleton component file exists', () => {
    const componentPath = path.join(srcPath, 'components/cards/order-card-skeleton.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  test('useOrderHistory hook file exists', () => {
    const hookPath = path.join(srcPath, 'hooks/use-order-history.ts');
    expect(fs.existsSync(hookPath)).toBe(true);
  });

  test('cards index exports OrderCard', () => {
    const indexPath = path.join(srcPath, 'components/cards/index.ts');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toMatch(/OrderCard/);
  });

  test('cards index exports OrderCardSkeleton', () => {
    const indexPath = path.join(srcPath, 'components/cards/index.ts');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toMatch(/OrderCardSkeleton/);
  });
});

// ============================================================================
// OrderCard Component Tests
// ============================================================================

describe('OrderCard Component', () => {
  const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports OrderCard component', () => {
      expect(content).toMatch(/export\s+function\s+OrderCard/);
    });

    test('exports OrderCardProps interface', () => {
      expect(content).toMatch(/export\s+interface\s+OrderCardProps/);
    });

    test('exports getStatusBadgeVariant helper', () => {
      expect(content).toMatch(/export\s+function\s+getStatusBadgeVariant/);
    });

    test('exports getStatusText helper', () => {
      expect(content).toMatch(/export\s+function\s+getStatusText/);
    });

    test('exports formatOrderDate helper', () => {
      expect(content).toMatch(/export\s+function\s+formatOrderDate/);
    });

    test('exports getItemCount helper', () => {
      expect(content).toMatch(/export\s+function\s+getItemCount/);
    });

    test('exports formatItemCount helper', () => {
      expect(content).toMatch(/export\s+function\s+formatItemCount/);
    });
  });

  describe('Props Interface', () => {
    test('has order prop of type Order', () => {
      expect(content).toMatch(/order:\s*Order/);
    });

    test('has optional onPress callback', () => {
      expect(content).toMatch(/onPress\?:\s*\(order:\s*Order\)/);
    });

    test('has optional testID prop', () => {
      expect(content).toMatch(/testID\?:\s*string/);
    });
  });

  describe('Order Display', () => {
    test('displays restaurant image', () => {
      expect(content).toMatch(/order\.restaurant\.image/);
    });

    test('displays restaurant name', () => {
      expect(content).toMatch(/order\.restaurant\.name/);
    });

    test('displays order status with Badge', () => {
      expect(content).toMatch(/Badge.*variant=\{statusVariant\}/);
    });

    test('displays order date', () => {
      expect(content).toMatch(/formatOrderDate\(order\.createdAt\)/);
    });

    test('displays item count', () => {
      expect(content).toMatch(/formatItemCount\(itemCount\)/);
    });

    test('displays total amount', () => {
      expect(content).toMatch(/order\.total\.toFixed\(2\)/);
    });
  });

  describe('Status Badge Variants', () => {
    test('DELIVERED status returns success variant', () => {
      expect(content).toMatch(/case\s+['"]DELIVERED['"]:\s*return\s+['"]success['"]/);
    });

    test('CANCELLED status returns error variant', () => {
      expect(content).toMatch(/case\s+['"]CANCELLED['"]:\s*return\s+['"]error['"]/);
    });

    test('ON_THE_WAY status returns primary variant', () => {
      expect(content).toMatch(/case\s+['"]ON_THE_WAY['"]:/);
    });

    test('PREPARING status returns warning variant', () => {
      expect(content).toMatch(/case\s+['"]PREPARING['"]:/);
    });
  });

  describe('Date Formatting', () => {
    test('uses date-fns for formatting', () => {
      expect(content).toMatch(/from\s+['"]date-fns['"]/);
    });

    test('formats today as "Today at X:XX"', () => {
      expect(content).toMatch(/isToday\(orderDate\)/);
    });

    test('formats yesterday as "Yesterday at X:XX"', () => {
      expect(content).toMatch(/isYesterday\(orderDate\)/);
    });

    test('formats other dates as "MMM d, yyyy"', () => {
      expect(content).toMatch(/format\(orderDate,\s*['"]MMM d, yyyy['"]\)/);
    });
  });

  describe('Animations', () => {
    test('uses react-native-reanimated', () => {
      expect(content).toMatch(/from\s+['"]react-native-reanimated['"]/);
    });

    test('uses scale animation on press', () => {
      expect(content).toMatch(/scale.*=.*useSharedValue/);
    });

    test('uses withSpring for animation', () => {
      expect(content).toMatch(/withSpring/);
    });

    test('uses useAnimatedStyle', () => {
      expect(content).toMatch(/useAnimatedStyle/);
    });
  });

  describe('Accessibility', () => {
    test('has accessibilityLabel', () => {
      expect(content).toMatch(/accessibilityLabel/);
    });

    test('has accessibilityRole button', () => {
      expect(content).toMatch(/accessibilityRole="button"/);
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

    test('uses Shadows', () => {
      expect(content).toMatch(/Shadows\./);
    });
  });
});

// ============================================================================
// OrderCardSkeleton Component Tests
// ============================================================================

describe('OrderCardSkeleton Component', () => {
  const componentPath = path.join(process.cwd(), 'src/components/cards/order-card-skeleton.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports OrderCardSkeleton component', () => {
      expect(content).toMatch(/export\s+function\s+OrderCardSkeleton/);
    });

    test('exports OrderCardSkeletonList component', () => {
      expect(content).toMatch(/export\s+function\s+OrderCardSkeletonList/);
    });

    test('exports OrderCardSkeletonProps interface', () => {
      expect(content).toMatch(/export\s+interface\s+OrderCardSkeletonProps/);
    });
  });

  describe('Skeleton Structure', () => {
    test('uses Skeleton component from ui', () => {
      expect(content).toMatch(/import.*Skeleton.*from\s+['"]@\/components\/ui\/skeleton['"]/);
    });

    test('has image skeleton', () => {
      expect(content).toMatch(/Skeleton[\s\S]*width=\{IMAGE_SIZE\}/);
    });

    test('has header row skeleton', () => {
      expect(content).toMatch(/headerRow/);
    });

    test('has details row skeleton', () => {
      expect(content).toMatch(/detailsRow/);
    });

    test('has total row skeleton', () => {
      expect(content).toMatch(/totalRow/);
    });
  });

  describe('SkeletonList', () => {
    test('renders multiple skeletons based on count prop', () => {
      expect(content).toMatch(/count\s*=\s*3/);
    });

    test('uses Array.from to generate items', () => {
      expect(content).toMatch(/Array\.from/);
    });

    test('generates unique keys for each skeleton', () => {
      expect(content).toMatch(/key=\{`order-skeleton-\$\{index\}`\}/);
    });
  });
});

// ============================================================================
// useOrderHistory Hook Tests
// ============================================================================

describe('useOrderHistory Hook', () => {
  const hookPath = path.join(process.cwd(), 'src/hooks/use-order-history.ts');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(hookPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports useOrderHistory hook', () => {
      expect(content).toMatch(/export\s+function\s+useOrderHistory/);
    });

    test('exports UseOrderHistoryResult interface', () => {
      expect(content).toMatch(/export\s+interface\s+UseOrderHistoryResult/);
    });
  });

  describe('Return Interface', () => {
    test('returns orders array', () => {
      expect(content).toMatch(/orders:\s*Order\[\]/);
    });

    test('returns activeOrders array', () => {
      expect(content).toMatch(/activeOrders:\s*Order\[\]/);
    });

    test('returns pastOrders array', () => {
      expect(content).toMatch(/pastOrders:\s*Order\[\]/);
    });

    test('returns isLoading boolean', () => {
      expect(content).toMatch(/isLoading:\s*boolean/);
    });

    test('returns error state', () => {
      expect(content).toMatch(/error:\s*string\s*\|\s*null/);
    });

    test('returns refresh function', () => {
      expect(content).toMatch(/refresh:\s*\(\)\s*=>\s*Promise<void>/);
    });

    test('returns hasOrders boolean', () => {
      expect(content).toMatch(/hasOrders:\s*boolean/);
    });

    test('returns hasActiveOrders boolean', () => {
      expect(content).toMatch(/hasActiveOrders:\s*boolean/);
    });

    test('returns hasPastOrders boolean', () => {
      expect(content).toMatch(/hasPastOrders:\s*boolean/);
    });
  });

  describe('Order Filtering', () => {
    test('defines ACTIVE_STATUSES constant', () => {
      expect(content).toMatch(/const\s+ACTIVE_STATUSES/);
    });

    test('defines COMPLETED_STATUSES constant', () => {
      expect(content).toMatch(/const\s+COMPLETED_STATUSES/);
    });

    test('ACTIVE_STATUSES includes PENDING', () => {
      expect(content).toMatch(/ACTIVE_STATUSES[\s\S]*PENDING/);
    });

    test('ACTIVE_STATUSES includes ON_THE_WAY', () => {
      expect(content).toMatch(/ACTIVE_STATUSES[\s\S]*ON_THE_WAY/);
    });

    test('COMPLETED_STATUSES includes DELIVERED', () => {
      expect(content).toMatch(/COMPLETED_STATUSES[\s\S]*DELIVERED/);
    });

    test('COMPLETED_STATUSES includes CANCELLED', () => {
      expect(content).toMatch(/COMPLETED_STATUSES[\s\S]*CANCELLED/);
    });
  });

  describe('Store Integration', () => {
    test('uses useOrderStore', () => {
      expect(content).toMatch(/useOrderStore/);
    });

    test('uses useAuthStore', () => {
      expect(content).toMatch(/useAuthStore/);
    });

    test('calls fetchOrderHistory', () => {
      expect(content).toMatch(/fetchOrderHistory/);
    });
  });

  describe('Mock Data', () => {
    test('imports mockOrders', () => {
      expect(content).toMatch(/import.*mockOrders.*from\s+['"]@\/data\/mock\/orders['"]/);
    });

    test('filters orders by user ID', () => {
      expect(content).toMatch(/order\.userId\s*===\s*user\.id/);
    });
  });

  describe('Memoization', () => {
    test('uses useMemo for activeOrders', () => {
      expect(content).toMatch(/useMemo/);
    });

    test('uses useCallback for refresh', () => {
      expect(content).toMatch(/useCallback/);
    });
  });

  describe('Sorting', () => {
    test('sorts orders by createdAt descending', () => {
      expect(content).toMatch(/\.sort\(/);
      expect(content).toMatch(/createdAt/);
    });
  });
});

// ============================================================================
// Orders Screen Tests
// ============================================================================

describe('Orders Screen', () => {
  const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(screenPath, 'utf-8');
  });

  describe('Exports', () => {
    test('exports default OrdersScreen', () => {
      expect(content).toMatch(/export\s+default\s+function\s+OrdersScreen/);
    });
  });

  describe('Tab Navigation', () => {
    test('has TabType type definition', () => {
      expect(content).toMatch(/type\s+TabType\s*=\s*['"]active['"]\s*\|\s*['"]past['"]/);
    });

    test('has TabButton component', () => {
      expect(content).toMatch(/function\s+TabButton/);
    });

    test('has activeTab state', () => {
      expect(content).toMatch(/activeTab.*=.*useState/);
    });

    test('shows Active tab', () => {
      expect(content).toMatch(/label="Active"/);
    });

    test('shows Past Orders tab', () => {
      expect(content).toMatch(/label="Past Orders"/);
    });

    test('tabs show count badges', () => {
      expect(content).toMatch(/count=\{activeOrders\.length\}/);
      expect(content).toMatch(/count=\{pastOrders\.length\}/);
    });
  });

  describe('Empty States', () => {
    test('has EmptyState component', () => {
      expect(content).toMatch(/function\s+EmptyState/);
    });

    test('shows "No Active Orders" for active tab', () => {
      expect(content).toMatch(/No Active Orders/);
    });

    test('shows "No Past Orders" for past tab', () => {
      expect(content).toMatch(/No Past Orders/);
    });

    test('has Start Ordering button', () => {
      expect(content).toMatch(/Start Ordering/);
    });
  });

  describe('Order List', () => {
    test('uses FlashList for performance', () => {
      expect(content).toMatch(/@shopify\/flash-list/);
    });

    test('renders OrderCard for each order', () => {
      expect(content).toMatch(/OrderCard/);
    });

    test('has orderCardContainer style for spacing', () => {
      expect(content).toMatch(/orderCardContainer/);
    });
  });

  describe('Pull to Refresh', () => {
    test('uses RefreshControl', () => {
      expect(content).toMatch(/RefreshControl/);
    });

    test('has isRefreshing state', () => {
      expect(content).toMatch(/isRefreshing.*useState/);
    });

    test('calls refresh on pull', () => {
      expect(content).toMatch(/onRefresh=\{handleRefresh\}/);
    });
  });

  describe('Loading State', () => {
    test('shows skeleton while loading', () => {
      expect(content).toMatch(/OrderCardSkeletonList/);
    });

    test('checks isLoading state', () => {
      expect(content).toMatch(/isLoading\s*&&/);
    });
  });

  describe('Guest Mode', () => {
    test('uses GuestPromptBanner', () => {
      expect(content).toMatch(/GuestPromptBanner/);
    });

    test('checks isGuest state', () => {
      expect(content).toMatch(/if\s*\(isGuest\)/);
    });

    test('shows full screen prompt for guests', () => {
      expect(content).toMatch(/fullScreen/);
    });
  });

  describe('Navigation', () => {
    test('uses useRouter from expo-router', () => {
      expect(content).toMatch(/useRouter.*from\s+['"]expo-router['"]/);
    });

    test('navigates to order details on press', () => {
      expect(content).toMatch(/router\.push.*order.*id/);
    });
  });

  describe('Hooks Integration', () => {
    test('uses useOrderHistory hook', () => {
      expect(content).toMatch(/useOrderHistory/);
    });

    test('uses useAuthStore', () => {
      expect(content).toMatch(/useAuthStore/);
    });

    test('uses useColorScheme', () => {
      expect(content).toMatch(/useColorScheme/);
    });

    test('uses useSafeAreaInsets', () => {
      expect(content).toMatch(/useSafeAreaInsets/);
    });
  });

  describe('Animations', () => {
    test('uses FadeIn animation', () => {
      expect(content).toMatch(/FadeIn/);
    });

    test('uses FadeInDown animation', () => {
      expect(content).toMatch(/FadeInDown/);
    });

    test('uses Layout animation', () => {
      expect(content).toMatch(/Layout/);
    });

    test('applies staggered animation to list items', () => {
      expect(content).toMatch(/delay\(index\s*\*\s*\d+\)/);
    });
  });

  describe('Styling', () => {
    test('uses design system Colors', () => {
      expect(content).toMatch(/Colors\[colorScheme/);
    });

    test('uses PrimaryColors for tabs', () => {
      expect(content).toMatch(/PrimaryColors/);
    });

    test('uses NeutralColors for inactive badges', () => {
      expect(content).toMatch(/NeutralColors/);
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
  });

  describe('Accessibility', () => {
    test('has accessibilityRole on tabs', () => {
      expect(content).toMatch(/accessibilityRole="tab"/);
    });

    test('has accessibilityState on tabs', () => {
      expect(content).toMatch(/accessibilityState=\{\s*\{\s*selected:/);
    });

    test('has accessibilityLabel on tabs', () => {
      expect(content).toMatch(/accessibilityLabel=.*tab/);
    });
  });
});

// ============================================================================
// Helper Function Tests
// ============================================================================

describe('OrderCard Helper Functions', () => {
  const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
  let content: string;

  beforeEach(() => {
    content = fs.readFileSync(componentPath, 'utf-8');
  });

  test('getItemCount reduces items with quantity', () => {
    expect(content).toMatch(/reduce\(\(sum,\s*item\)\s*=>\s*sum\s*\+\s*item\.quantity/);
  });

  test('formatItemCount handles singular', () => {
    expect(content).toMatch(/['"]1 item['"]/);
  });

  test('formatItemCount handles plural', () => {
    expect(content).toMatch(/\$\{count\} items/);
  });

  test('getStatusText maps all status values', () => {
    expect(content).toMatch(/PENDING.*Pending/);
    expect(content).toMatch(/CONFIRMED.*Confirmed/);
    expect(content).toMatch(/PREPARING.*Preparing/);
    expect(content).toMatch(/DELIVERED.*Delivered/);
    expect(content).toMatch(/CANCELLED.*Cancelled/);
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Order History Integration', () => {
  test('Orders screen imports OrderCard', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/import.*OrderCard.*from/);
  });

  test('Orders screen imports OrderCardSkeletonList', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/import.*OrderCardSkeletonList.*from/);
  });

  test('Orders screen imports useOrderHistory', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/import.*useOrderHistory.*from/);
  });

  test('useOrderHistory uses order store', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-order-history.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/useOrderStore/);
  });

  test('OrderCard uses Badge component', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/import.*Badge.*from\s+['"]@\/components\/ui\/badge['"]/);
  });

  test('OrderCardSkeleton uses Skeleton component', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card-skeleton.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/import.*Skeleton.*from\s+['"]@\/components\/ui\/skeleton['"]/);
  });
});

// ============================================================================
// Type Safety Tests
// ============================================================================

describe('Type Safety', () => {
  test('OrderCard imports Order type', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/import.*Order.*from\s+['"]@\/types['"]/);
  });

  test('OrderCard imports OrderStatus type', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/OrderStatus/);
  });

  test('useOrderHistory imports Order type', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-order-history.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/import.*Order.*from\s+['"]@\/types['"]/);
  });

  test('Orders screen imports Order type', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/import.*Order.*from\s+['"]@\/types['"]/);
  });
});

// ============================================================================
// Dependencies Tests
// ============================================================================

describe('Dependencies', () => {
  test('OrderCard uses expo-image', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/from\s+['"]expo-image['"]/);
  });

  test('OrderCard uses @expo/vector-icons', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/from\s+['"]@expo\/vector-icons['"]/);
  });

  test('Orders screen uses @shopify/flash-list', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/from\s+['"]@shopify\/flash-list['"]/);
  });

  test('Orders screen uses react-native-safe-area-context', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/from\s+['"]react-native-safe-area-context['"]/);
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Performance', () => {
  test('Orders screen uses useCallback for handlers', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/useCallback/);
  });

  test('Orders screen uses useCallback for renderOrderItem', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/renderOrderItem.*=.*useCallback/);
  });

  test('FlashList has estimatedItemSize', () => {
    const screenPath = path.join(process.cwd(), 'src/app/(tabs)/orders.tsx');
    const content = fs.readFileSync(screenPath, 'utf-8');

    expect(content).toMatch(/estimatedItemSize=\{\d+\}/);
  });

  test('useOrderHistory uses useMemo for filtering', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/use-order-history.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toMatch(/useMemo/);
  });
});

// ============================================================================
// Constants Tests
// ============================================================================

describe('Constants', () => {
  test('OrderCard has IMAGE_SIZE constant', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/const\s+IMAGE_SIZE\s*=\s*\d+/);
  });

  test('OrderCard has SPRING_CONFIG constant', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/const\s+SPRING_CONFIG/);
  });

  test('OrderCardSkeleton has IMAGE_SIZE constant', () => {
    const componentPath = path.join(process.cwd(), 'src/components/cards/order-card-skeleton.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    expect(content).toMatch(/const\s+IMAGE_SIZE\s*=\s*\d+/);
  });
});
