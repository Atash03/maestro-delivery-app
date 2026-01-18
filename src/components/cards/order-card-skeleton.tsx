/**
 * OrderCardSkeleton Component
 *
 * A skeleton loading state for the OrderCard component.
 * Displays shimmer animation while order data is loading.
 */

import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================================================
// Types
// ============================================================================

export interface OrderCardSkeletonProps {
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

const IMAGE_SIZE = 72;

// ============================================================================
// Component
// ============================================================================

export function OrderCardSkeleton({ testID }: OrderCardSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        Shadows.sm,
      ]}
      testID={testID}
    >
      {/* Image Skeleton */}
      <Skeleton width={IMAGE_SIZE} height={IMAGE_SIZE} variant="rounded" radius={BorderRadius.md} />

      {/* Info Skeleton */}
      <View style={styles.infoContainer}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Skeleton width="60%" height={18} />
          <Skeleton width={70} height={22} variant="rounded" />
        </View>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <Skeleton width={120} height={14} />
          <Skeleton width={50} height={14} style={styles.itemCountSkeleton} />
        </View>

        {/* Total Row */}
        <View style={styles.totalRow}>
          <Skeleton width={80} height={16} />
        </View>
      </View>

      {/* Chevron Skeleton */}
      <View style={styles.chevronContainer}>
        <Skeleton width={20} height={20} variant="circular" />
      </View>
    </View>
  );
}

/**
 * Renders multiple skeleton cards for loading state
 */
export function OrderCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }, (_, index) => (
        <OrderCardSkeleton key={`order-skeleton-${index}`} testID={`order-skeleton-${index}`} />
      ))}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  infoContainer: {
    flex: 1,
    marginLeft: Spacing[3],
    marginRight: Spacing[2],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  itemCountSkeleton: {
    marginLeft: Spacing[3],
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    gap: Spacing[3],
  },
});
