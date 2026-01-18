/**
 * Orders screen - Order history and active orders
 *
 * Features:
 * - Tabs for Active Orders and Past Orders
 * - Order cards showing restaurant, date, status, and total
 * - Empty states for no orders
 * - Pull-to-refresh functionality
 * - Loading skeletons
 * - Guest mode prompts
 */

import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrderCard, OrderCardSkeletonList } from '@/components/cards';
import { GuestPromptBanner } from '@/components/guest-prompt-banner';
import { ThemedText } from '@/components/themed-text';
import {
  BorderRadius,
  Colors,
  NeutralColors,
  PrimaryColors,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOrderHistory } from '@/hooks/use-order-history';
import { useAuthStore } from '@/stores';
import type { Order } from '@/types';

// ============================================================================
// Types
// ============================================================================

type TabType = 'active' | 'past';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  count?: number;
}

// ============================================================================
// Tab Button Component
// ============================================================================

function TabButton({ label, isActive, onPress, count }: TabButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        isActive && {
          backgroundColor: isDark ? PrimaryColors[900] : PrimaryColors[50],
          borderColor: PrimaryColors[500],
        },
        !isActive && {
          backgroundColor: colors.backgroundSecondary,
          borderColor: 'transparent',
        },
      ]}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${label} tab${count !== undefined ? `, ${count} orders` : ''}`}
    >
      <ThemedText
        style={[
          styles.tabButtonText,
          {
            color: isActive ? PrimaryColors[600] : colors.textSecondary,
          },
        ]}
      >
        {label}
      </ThemedText>
      {count !== undefined && count > 0 && (
        <View
          style={[
            styles.tabBadge,
            {
              backgroundColor: isActive
                ? PrimaryColors[500]
                : isDark
                  ? NeutralColors[600]
                  : NeutralColors[400],
            },
          ]}
        >
          <ThemedText style={styles.tabBadgeText}>{count}</ThemedText>
        </View>
      )}
    </Pressable>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

interface EmptyStateProps {
  type: TabType;
}

function EmptyState({ type }: EmptyStateProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const isActive = type === 'active';
  const icon = isActive ? 'receipt-outline' : 'time-outline';
  const title = isActive ? 'No Active Orders' : 'No Past Orders';
  const description = isActive
    ? "You don't have any orders in progress. Start ordering from your favorite restaurants!"
    : "You haven't completed any orders yet. Your order history will appear here.";

  const handleStartOrdering = () => {
    router.push('/(tabs)');
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.emptyStateContainer}>
      <View
        style={[styles.emptyStateIconContainer, { backgroundColor: colors.backgroundSecondary }]}
      >
        <Ionicons name={icon} size={48} color={colors.textTertiary} />
      </View>
      <ThemedText style={[styles.emptyStateTitle, { color: colors.text }]}>{title}</ThemedText>
      <ThemedText style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
        {description}
      </ThemedText>
      {isActive && (
        <Pressable
          onPress={handleStartOrdering}
          style={[styles.emptyStateButton, { backgroundColor: PrimaryColors[500] }]}
          accessibilityRole="button"
          accessibilityLabel="Start ordering"
        >
          <ThemedText style={styles.emptyStateButtonText}>Start Ordering</ThemedText>
        </Pressable>
      )}
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function OrdersScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isGuest } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const { activeOrders, pastOrders, isLoading, refresh } = useOrderHistory();

  // Determine which orders to show based on active tab
  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  // Handle order press
  const handleOrderPress = useCallback(
    (order: Order) => {
      router.push(`/order/${order.id}`);
    },
    [router]
  );

  // Handle refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  // Render order item
  const renderOrderItem = useCallback(
    ({ item, index }: { item: Order; index: number }) => (
      <Animated.View
        entering={FadeInDown.duration(300).delay(index * 50)}
        layout={Layout.springify()}
        style={styles.orderCardContainer}
      >
        <OrderCard order={item} onPress={handleOrderPress} testID={`order-card-${item.id}`} />
      </Animated.View>
    ),
    [handleOrderPress]
  );

  // Guest mode: show full-screen prompt to sign up
  if (isGuest) {
    return <GuestPromptBanner type="orders" fullScreen />;
  }

  // Not authenticated and not guest: show generic prompt
  if (!user) {
    return <GuestPromptBanner type="general" fullScreen />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Orders</ThemedText>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabsContainer}>
        <TabButton
          label="Active"
          isActive={activeTab === 'active'}
          onPress={() => setActiveTab('active')}
          count={activeOrders.length}
        />
        <TabButton
          label="Past Orders"
          isActive={activeTab === 'past'}
          onPress={() => setActiveTab('past')}
          count={pastOrders.length}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <OrderCardSkeletonList count={3} />
          </View>
        ) : displayedOrders.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <FlashList
            data={displayedOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            estimatedItemSize={110}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            testID="orders-list"
          />
        )}
      </View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2.5],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing[2],
  },
  tabButtonText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '600',
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[1.5],
  },
  tabBadgeText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: Spacing[4],
  },
  listContentContainer: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
  },
  orderCardContainer: {
    marginBottom: Spacing[3],
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[6],
  },
  emptyStateIconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  emptyStateTitle: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: '600',
    marginBottom: Spacing[2],
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: Spacing[6],
  },
  emptyStateButton: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
  },
  emptyStateButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
