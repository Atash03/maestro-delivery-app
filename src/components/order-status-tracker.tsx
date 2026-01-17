/**
 * Order Status Tracker Component
 *
 * A visual progress tracker showing the current order status through
 * a series of animated steps. Each step represents a stage in the
 * order fulfillment process.
 *
 * Features:
 * - Visual progress steps with icons and labels
 * - Animated progress line between steps
 * - Current step highlighted with pulse animation
 * - Timestamp display for completed steps
 * - Supports all OrderStatus enum values
 */

import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { StyleSheet, Text, type TextStyle, View } from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Spacing,
  SuccessColors,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { OrderStatus } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface OrderStatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  timestamp?: Date;
}

export interface OrderStatusTrackerProps {
  /** Current order status */
  currentStatus: OrderStatus;
  /** Optional timestamps for each completed step */
  statusTimestamps?: Partial<Record<OrderStatus, Date>>;
  /** Optional test ID for testing */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Ordered list of status steps in the order flow
 * Note: CANCELLED is a terminal state handled separately
 */
const ORDER_STATUS_STEPS: Omit<OrderStatusStep, 'timestamp'>[] = [
  {
    status: OrderStatus.PENDING,
    label: 'Order Placed',
    description: 'Your order has been received',
    icon: 'receipt-outline',
  },
  {
    status: OrderStatus.CONFIRMED,
    label: 'Restaurant Confirmed',
    description: 'The restaurant has confirmed your order',
    icon: 'checkmark-circle-outline',
  },
  {
    status: OrderStatus.PREPARING,
    label: 'Preparing Your Order',
    description: 'The restaurant is preparing your food',
    icon: 'restaurant-outline',
  },
  {
    status: OrderStatus.READY,
    label: 'Ready for Pickup',
    description: 'Your order is ready and waiting for driver',
    icon: 'bag-check-outline',
  },
  {
    status: OrderStatus.PICKED_UP,
    label: 'Driver On The Way',
    description: 'Your driver has picked up your order',
    icon: 'bicycle-outline',
  },
  {
    status: OrderStatus.ON_THE_WAY,
    label: 'Almost There',
    description: 'Your order is on its way to you',
    icon: 'navigate-outline',
  },
  {
    status: OrderStatus.DELIVERED,
    label: 'Delivered',
    description: 'Your order has been delivered. Enjoy!',
    icon: 'checkmark-done-outline',
  },
];

/**
 * Get the index of a status in the order flow
 */
function getStatusIndex(status: OrderStatus): number {
  const index = ORDER_STATUS_STEPS.findIndex((step) => step.status === status);
  return index === -1 ? 0 : index;
}

/**
 * Format timestamp to readable string
 */
function formatTimestamp(date: Date): string {
  return format(date, 'h:mm a');
}

// ============================================================================
// Sub-Components
// ============================================================================

interface StepIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  isCompleted: boolean;
  isCurrent: boolean;
  colors: (typeof Colors)['light'];
}

/**
 * Step icon with completion state styling
 */
function StepIcon({ icon, isCompleted, isCurrent, colors }: StepIconProps) {
  const pulseAnim = useSharedValue(0);

  // Start pulse animation for current step
  useDerivedValue(() => {
    if (isCurrent) {
      pulseAnim.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
    } else {
      pulseAnim.value = 0;
    }
  }, [isCurrent]);

  const pulseStyle = useAnimatedStyle(() => {
    if (!isCurrent) return {};

    const scale = interpolate(pulseAnim.value, [0, 1], [1, 1.15]);
    const opacity = interpolate(pulseAnim.value, [0, 1], [0.4, 0]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const iconContainerStyle = useAnimatedStyle(() => {
    if (!isCurrent) return {};

    const scale = interpolate(pulseAnim.value, [0, 0.5, 1], [1, 1.05, 1]);

    return {
      transform: [{ scale }],
    };
  });

  const backgroundColor = isCompleted
    ? SuccessColors[500]
    : isCurrent
      ? PrimaryColors[500]
      : colors.backgroundTertiary;

  const iconColor = isCompleted || isCurrent ? NeutralColors[0] : colors.textTertiary;

  return (
    <View style={styles.stepIconWrapper}>
      {/* Pulse ring for current step */}
      {isCurrent && (
        <Animated.View
          style={[styles.pulseRing, { backgroundColor: PrimaryColors[500] }, pulseStyle]}
        />
      )}

      {/* Icon container */}
      <Animated.View style={[styles.stepIconContainer, { backgroundColor }, iconContainerStyle]}>
        {isCompleted ? (
          <Ionicons name="checkmark" size={16} color={iconColor} />
        ) : (
          <Ionicons name={icon} size={16} color={iconColor} />
        )}
      </Animated.View>
    </View>
  );
}

interface ProgressLineProps {
  isCompleted: boolean;
  isActive: boolean;
  colors: (typeof Colors)['light'];
}

/**
 * Animated progress line between steps
 */
function ProgressLine({ isCompleted, isActive, colors }: ProgressLineProps) {
  const progress = useSharedValue(0);

  useDerivedValue(() => {
    if (isCompleted) {
      progress.value = withTiming(1, { duration: AnimationDurations.slow });
    } else if (isActive) {
      progress.value = withTiming(0.5, { duration: AnimationDurations.slow });
    } else {
      progress.value = 0;
    }
  }, [isCompleted, isActive]);

  const lineStyle = useAnimatedStyle(() => ({
    height: `${progress.value * 100}%`,
  }));

  return (
    <View style={[styles.progressLineContainer, { backgroundColor: colors.backgroundTertiary }]}>
      <Animated.View
        style={[styles.progressLineFill, { backgroundColor: SuccessColors[500] }, lineStyle]}
      />
    </View>
  );
}

interface StepContentProps {
  step: OrderStatusStep;
  isCompleted: boolean;
  isCurrent: boolean;
  colors: (typeof Colors)['light'];
}

/**
 * Step label and description content
 */
function StepContent({ step, isCompleted, isCurrent, colors }: StepContentProps) {
  const labelColor = isCompleted || isCurrent ? colors.text : colors.textTertiary;
  const descriptionColor = isCompleted || isCurrent ? colors.textSecondary : colors.textTertiary;

  return (
    <View style={styles.stepContent}>
      <View style={styles.stepLabelRow}>
        <Text
          style={[
            styles.stepLabel,
            {
              color: labelColor,
              fontWeight: (isCurrent
                ? FontWeights.semibold
                : FontWeights.medium) as TextStyle['fontWeight'],
            },
          ]}
          numberOfLines={1}
        >
          {step.label}
        </Text>
        {step.timestamp && isCompleted && (
          <Text style={[styles.stepTimestamp, { color: colors.textSecondary }]}>
            {formatTimestamp(step.timestamp)}
          </Text>
        )}
      </View>
      {(isCompleted || isCurrent) && (
        <Text style={[styles.stepDescription, { color: descriptionColor }]} numberOfLines={2}>
          {step.description}
        </Text>
      )}
    </View>
  );
}

interface StepRowProps {
  step: OrderStatusStep;
  index: number;
  currentIndex: number;
  isLast: boolean;
  colors: (typeof Colors)['light'];
}

/**
 * Complete step row with icon, line, and content
 */
function StepRow({ step, index, currentIndex, isLast, colors }: StepRowProps) {
  const isCompleted = index < currentIndex;
  const isCurrent = index === currentIndex;

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal).delay(index * 50)}
      style={styles.stepRow}
      testID={`order-status-step-${step.status}`}
    >
      <View style={styles.stepIndicatorColumn}>
        <StepIcon
          icon={step.icon}
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          colors={colors}
        />
        {!isLast && <ProgressLine isCompleted={isCompleted} isActive={isCurrent} colors={colors} />}
      </View>

      <StepContent step={step} isCompleted={isCompleted} isCurrent={isCurrent} colors={colors} />
    </Animated.View>
  );
}

interface CancelledBannerProps {
  timestamp?: Date;
  colors: (typeof Colors)['light'];
}

/**
 * Banner displayed when order is cancelled
 */
function CancelledBanner({ timestamp, colors }: CancelledBannerProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal)}
      style={[styles.cancelledBanner, { backgroundColor: colors.errorLight }]}
      testID="order-status-cancelled-banner"
    >
      <View style={[styles.cancelledIconContainer, { backgroundColor: colors.error }]}>
        <Ionicons name="close" size={20} color={NeutralColors[0]} />
      </View>
      <View style={styles.cancelledContent}>
        <Text style={[styles.cancelledTitle, { color: colors.error }]}>Order Cancelled</Text>
        <Text style={[styles.cancelledDescription, { color: colors.textSecondary }]}>
          This order has been cancelled
          {timestamp && ` at ${formatTimestamp(timestamp)}`}
        </Text>
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Order Status Tracker
 *
 * Displays a visual timeline of the order progress with animated
 * transitions between states.
 */
export function OrderStatusTracker({
  currentStatus,
  statusTimestamps = {},
  testID = 'order-status-tracker',
}: OrderStatusTrackerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Check if order is cancelled
  const isCancelled = currentStatus === OrderStatus.CANCELLED;

  // Get current step index
  const currentIndex = useMemo(() => getStatusIndex(currentStatus), [currentStatus]);

  // Build steps with timestamps
  const steps = useMemo(
    () =>
      ORDER_STATUS_STEPS.map((step) => ({
        ...step,
        timestamp: statusTimestamps[step.status],
      })),
    [statusTimestamps]
  );

  if (isCancelled) {
    return (
      <View style={styles.container} testID={testID}>
        <CancelledBanner timestamp={statusTimestamps[OrderStatus.CANCELLED]} colors={colors} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      {steps.map((step, index) => (
        <StepRow
          key={step.status}
          step={step}
          index={index}
          currentIndex={currentIndex}
          isLast={index === steps.length - 1}
          colors={colors}
        />
      ))}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const ICON_SIZE = 32;
const LINE_WIDTH = 2;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 72,
  },
  stepIndicatorColumn: {
    width: ICON_SIZE,
    alignItems: 'center',
    marginRight: Spacing[3],
  },
  stepIconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
  },
  stepIconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLineContainer: {
    flex: 1,
    width: LINE_WIDTH,
    marginTop: Spacing[1],
    marginBottom: Spacing[1],
    borderRadius: LINE_WIDTH / 2,
    overflow: 'hidden',
  },
  progressLineFill: {
    width: '100%',
  },
  stepContent: {
    flex: 1,
    paddingBottom: Spacing[4],
  },
  stepLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[0.5],
  },
  stepLabel: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    flex: 1,
  },
  stepTimestamp: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginLeft: Spacing[2],
  },
  stepDescription: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    gap: Spacing[3],
  },
  cancelledIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelledContent: {
    flex: 1,
  },
  cancelledTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  cancelledDescription: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
});

export default OrderStatusTracker;
