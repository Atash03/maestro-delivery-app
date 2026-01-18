/**
 * Report Issue screen - Allows users to report problems with their orders
 * Accessible via order details or help center
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { getOrderById } from '@/data/mock/orders';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { IssueCategory, Order } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface IssueCategoryOption {
  id: IssueCategory;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// ============================================================================
// Constants
// ============================================================================

const ISSUE_CATEGORIES: IssueCategoryOption[] = [
  {
    id: 'missing_items',
    title: 'Missing Items',
    description: 'Some items were not included in my order',
    icon: 'bag-remove-outline',
  },
  {
    id: 'wrong_items',
    title: 'Wrong Items',
    description: 'I received different items than I ordered',
    icon: 'swap-horizontal-outline',
  },
  {
    id: 'food_quality',
    title: 'Food Quality',
    description: 'The food quality was not as expected',
    icon: 'thumbs-down-outline',
  },
  {
    id: 'late_delivery',
    title: 'Late Delivery',
    description: 'My order arrived later than estimated',
    icon: 'time-outline',
  },
  {
    id: 'order_never_arrived',
    title: 'Order Never Arrived',
    description: 'I never received my order',
    icon: 'close-circle-outline',
  },
  {
    id: 'other',
    title: 'Other',
    description: 'I have a different issue with my order',
    icon: 'help-circle-outline',
  },
];

// ============================================================================
// Issue Category Card Component
// ============================================================================

interface IssueCategoryCardProps {
  category: IssueCategoryOption;
  isSelected: boolean;
  onSelect: () => void;
}

function IssueCategoryCard({ category, isSelected, onSelect }: IssueCategoryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.categoryCard,
          {
            backgroundColor: isSelected ? colors.primaryLight : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          },
          isSelected ? null : Shadows.sm,
        ]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${category.title}: ${category.description}`}
      >
        <View
          style={[
            styles.categoryIconContainer,
            {
              backgroundColor: isSelected ? colors.primary : colors.backgroundSecondary,
            },
          ]}
        >
          <Ionicons
            name={category.icon}
            size={24}
            color={isSelected ? '#FFFFFF' : colors.textSecondary}
          />
        </View>
        <View style={styles.categoryTextContainer}>
          <Text
            style={[styles.categoryTitle, { color: isSelected ? colors.primary : colors.text }]}
          >
            {category.title}
          </Text>
          <Text
            style={[styles.categoryDescription, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {category.description}
          </Text>
        </View>
        <View
          style={[
            styles.radioOuter,
            {
              borderColor: isSelected ? colors.primary : colors.border,
            },
          ]}
        >
          {isSelected && (
            <Animated.View
              entering={FadeIn.duration(AnimationDurations.fast)}
              exiting={FadeOut.duration(AnimationDurations.fast)}
              style={[styles.radioInner, { backgroundColor: colors.primary }]}
            />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// Order Summary Card Component
// ============================================================================

interface OrderSummaryCardProps {
  order: Order;
}

function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const formattedDate = useMemo(() => {
    const date = new Date(order.createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }, [order.createdAt]);

  const itemCount = useMemo(() => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [order.items]);

  return (
    <Card variant="outlined" padding="md" radius="lg">
      <View style={styles.orderSummaryContent}>
        <Image
          source={{ uri: order.restaurant.image }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        <View style={styles.orderSummaryText}>
          <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
            {order.restaurant.name}
          </Text>
          <Text style={[styles.orderMeta, { color: colors.textSecondary }]}>
            Order #{order.id.slice(-4)} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
          <Text style={[styles.orderDate, { color: colors.textTertiary }]}>{formattedDate}</Text>
        </View>
        <View style={styles.orderTotal}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            ${order.total.toFixed(2)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================================================
// Main Report Issue Screen
// ============================================================================

export default function ReportIssueScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | null>(null);

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const fetchedOrder = getOrderById(orderId || '');
      setOrder(fetchedOrder || null);
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSelectCategory = useCallback((categoryId: IssueCategory) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedCategory || !order) return;

    // Navigate to issue details form (to be implemented in task 7.3)
    // For now, we'll show an alert-like behavior
    router.push({
      pathname: '/support/issue/details',
      params: {
        orderId: order.id,
        category: selectedCategory,
      },
    } as never);
  }, [selectedCategory, order, router]);

  const canContinue = selectedCategory !== null && order !== null;

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
          <Pressable
            onPress={handleGoBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Report an Issue</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Animated.View
            entering={FadeIn.duration(AnimationDurations.normal)}
            style={[styles.loadingSpinner, { borderColor: colors.primary }]}
          />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading order details...
          </Text>
        </View>
      </View>
    );
  }

  // Order not found state
  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
          <Pressable
            onPress={handleGoBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Report an Issue</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <View style={[styles.errorIconContainer, { backgroundColor: colors.errorLight }]}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Order Not Found</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            We couldn't find the order you're looking for. Please try again or contact support.
          </Text>
          <Pressable
            onPress={handleGoBack}
            style={[styles.errorButton, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
        <Pressable
          onPress={handleGoBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Report an Issue</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing[24] },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(100).duration(AnimationDurations.normal)}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            REPORTING ISSUE FOR
          </Text>
          <OrderSummaryCard order={order} />
        </Animated.View>

        {/* Category Selection */}
        <Animated.View entering={FadeInDown.delay(200).duration(AnimationDurations.normal)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What went wrong?</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select the category that best describes your issue
          </Text>

          <View style={styles.categoriesContainer}>
            {ISSUE_CATEGORIES.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInDown.delay(250 + index * 50).duration(AnimationDurations.normal)}
              >
                <IssueCategoryCard
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onSelect={() => handleSelectCategory(category.id)}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Help Note */}
        <Animated.View entering={FadeInDown.delay(550).duration(AnimationDurations.normal)}>
          <View style={[styles.helpNote, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.helpNoteText, { color: colors.textSecondary }]}>
              After selecting a category, you'll be able to provide more details about your issue.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View
        style={[
          styles.bottomContainer,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + Spacing[4],
            borderTopColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={handleContinue}
          disabled={!canContinue}
          style={[
            styles.continueButton,
            {
              backgroundColor: canContinue ? colors.primary : colors.primaryLight,
              opacity: canContinue ? 1 : 0.6,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continue to provide issue details"
          accessibilityState={{ disabled: !canContinue }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
  backButton: {
    padding: Spacing[1],
  },
  headerTitle: {
    ...Typography.xl,
    fontWeight: FontWeights.bold as '700',
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
  },

  // Section styles
  sectionLabel: {
    ...Typography.xs,
    fontWeight: FontWeights.semibold as '600',
    letterSpacing: 0.5,
    marginBottom: Spacing[2],
  },
  sectionTitle: {
    ...Typography.xl,
    fontWeight: FontWeights.bold as '700',
    marginTop: Spacing[6],
    marginBottom: Spacing[1],
  },
  sectionSubtitle: {
    ...Typography.base,
    marginBottom: Spacing[4],
  },

  // Order Summary styles
  orderSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  restaurantImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
  },
  orderSummaryText: {
    flex: 1,
  },
  restaurantName: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
    marginBottom: Spacing[0.5],
  },
  orderMeta: {
    ...Typography.sm,
    marginBottom: Spacing[0.5],
  },
  orderDate: {
    ...Typography.xs,
  },
  orderTotal: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    ...Typography.xs,
    marginBottom: Spacing[0.5],
  },
  totalAmount: {
    ...Typography.lg,
    fontWeight: FontWeights.bold as '700',
  },

  // Category Card styles
  categoriesContainer: {
    gap: Spacing[3],
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing[3],
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
    marginBottom: Spacing[0.5],
  },
  categoryDescription: {
    ...Typography.sm,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
  },

  // Help Note styles
  helpNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing[6],
    gap: Spacing[2],
  },
  helpNoteText: {
    ...Typography.sm,
    flex: 1,
  },

  // Bottom Container styles
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3.5] || Spacing[4],
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
  },
  continueButtonText: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
    color: '#FFFFFF',
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[4],
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderTopColor: 'transparent',
  },
  loadingText: {
    ...Typography.base,
  },

  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    gap: Spacing[3],
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  errorTitle: {
    ...Typography.xl,
    fontWeight: FontWeights.bold as '700',
    textAlign: 'center',
  },
  errorText: {
    ...Typography.base,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  errorButton: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing[2],
  },
  errorButtonText: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
    color: '#FFFFFF',
  },
});

// Export for testing
export { ISSUE_CATEGORIES };
export type { IssueCategoryOption };
