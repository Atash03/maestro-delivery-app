/**
 * ETA Display Component
 *
 * A prominent countdown timer showing estimated time of arrival for order delivery.
 * Features animated updates when ETA changes and real-time countdown.
 *
 * Features:
 * - Large countdown timer display
 * - "Arriving in X minutes" text
 * - Update animation when ETA changes
 * - Real-time countdown updates
 * - Supports both minutes and time display formats
 */

import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, type TextStyle, View } from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  PrimaryColors,
  Shadows,
  Spacing,
  SuccessColors,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================================================
// Types
// ============================================================================

export interface ETADisplayProps {
  /** Estimated delivery time */
  estimatedTime: Date;
  /** Whether to show seconds in countdown (default: false) */
  showSeconds?: boolean;
  /** Size variant - affects typography and spacing */
  size?: 'compact' | 'normal' | 'large';
  /** Optional test ID for testing */
  testID?: string;
}

type ETAStatus = 'onTime' | 'soon' | 'arriving' | 'overdue';

// ============================================================================
// Constants
// ============================================================================

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

// Minutes thresholds for status changes
const STATUS_THRESHOLDS = {
  arriving: 5, // Less than 5 min = arriving
  soon: 15, // Less than 15 min = soon
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the ETA status based on minutes remaining
 */
function getETAStatus(minutesRemaining: number): ETAStatus {
  if (minutesRemaining <= 0) return 'overdue';
  if (minutesRemaining <= STATUS_THRESHOLDS.arriving) return 'arriving';
  if (minutesRemaining <= STATUS_THRESHOLDS.soon) return 'soon';
  return 'onTime';
}

/**
 * Get the status text based on ETA status
 */
function getStatusText(status: ETAStatus, minutes: number): string {
  switch (status) {
    case 'overdue':
      return 'Any moment now!';
    case 'arriving':
      return minutes === 1 ? 'Arriving in 1 minute' : `Arriving in ${minutes} minutes`;
    case 'soon':
      return `Arriving in ${minutes} minutes`;
    case 'onTime':
      return `Estimated arrival in ${minutes} min`;
  }
}

/**
 * Format time remaining as MM:SS or just minutes
 */
function formatTimeRemaining(
  estimatedTime: Date,
  showSeconds: boolean
): { display: string; minutes: number; seconds: number } {
  const now = new Date();
  // Calculate difference in seconds manually to avoid ESM import issues
  const diffMs = estimatedTime.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.round(diffMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (showSeconds) {
    return {
      display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      minutes,
      seconds,
    };
  }

  return {
    display: `${minutes}`,
    minutes,
    seconds,
  };
}

/**
 * Format the actual arrival time
 */
function formatArrivalTime(date: Date): string {
  return format(date, 'h:mm a');
}

// ============================================================================
// Sub-Components
// ============================================================================

interface PulsingDotProps {
  color: string;
}

/**
 * Animated pulsing dot indicator
 */
function PulsingDot({ color }: PulsingDotProps) {
  const pulseAnim = useSharedValue(0);

  useEffect(() => {
    pulseAnim.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, [pulseAnim]);

  const dotStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnim.value, [0, 1], [1, 1.3]);
    const opacity = interpolate(pulseAnim.value, [0, 1], [1, 0.5]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return <Animated.View style={[styles.pulsingDot, { backgroundColor: color }, dotStyle]} />;
}

interface CountdownTimerProps {
  display: string;
  status: ETAStatus;
  colors: (typeof Colors)['light'];
  size: ETADisplayProps['size'];
  previousMinutes: React.MutableRefObject<number>;
  currentMinutes: number;
}

/**
 * Animated countdown timer display
 */
function CountdownTimer({
  display,
  status,
  colors,
  size,
  previousMinutes,
  currentMinutes,
}: CountdownTimerProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Animate when minutes change
  useEffect(() => {
    if (previousMinutes.current !== currentMinutes && previousMinutes.current !== -1) {
      scale.value = withSequence(
        withSpring(1.1, SPRING_CONFIG),
        withSpring(1, { ...SPRING_CONFIG, damping: 20 })
      );
      opacity.value = withSequence(
        withTiming(0.7, { duration: 100 }),
        withTiming(1, { duration: 200 })
      );
    }
    previousMinutes.current = currentMinutes;
  }, [currentMinutes, scale, opacity, previousMinutes]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Determine text color based on status
  const textColor =
    status === 'overdue'
      ? colors.warning
      : status === 'arriving'
        ? SuccessColors[500]
        : colors.text;

  // Determine font size based on size prop
  const fontSize =
    size === 'large'
      ? Typography['5xl'].fontSize
      : size === 'compact'
        ? Typography['3xl'].fontSize
        : Typography['4xl'].fontSize;

  const lineHeight =
    size === 'large'
      ? Typography['5xl'].lineHeight
      : size === 'compact'
        ? Typography['3xl'].lineHeight
        : Typography['4xl'].lineHeight;

  return (
    <Animated.Text
      style={[
        styles.countdownText,
        {
          color: textColor,
          fontSize,
          lineHeight,
        },
        animatedStyle,
      ]}
      testID="eta-countdown-display"
    >
      {display}
    </Animated.Text>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * ETA Display
 *
 * Shows the estimated time of arrival with a prominent countdown timer
 * and animated updates when the ETA changes.
 */
export function ETADisplay({
  estimatedTime,
  showSeconds = false,
  size = 'normal',
  testID = 'eta-display',
}: ETADisplayProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Track previous minutes for animation
  const previousMinutes = useRef<number>(-1);

  // State for countdown
  const [timeRemaining, setTimeRemaining] = useState(() =>
    formatTimeRemaining(estimatedTime, showSeconds)
  );

  // Update countdown every second or minute based on showSeconds
  useEffect(() => {
    const interval = setInterval(
      () => {
        setTimeRemaining(formatTimeRemaining(estimatedTime, showSeconds));
      },
      showSeconds ? 1000 : 60000
    );

    // Initial update
    setTimeRemaining(formatTimeRemaining(estimatedTime, showSeconds));

    return () => clearInterval(interval);
  }, [estimatedTime, showSeconds]);

  // Calculate status
  const status = useMemo(() => getETAStatus(timeRemaining.minutes), [timeRemaining.minutes]);

  // Get status text
  const statusText = useMemo(
    () => getStatusText(status, timeRemaining.minutes),
    [status, timeRemaining.minutes]
  );

  // Get arrival time string
  const arrivalTimeText = useMemo(() => formatArrivalTime(estimatedTime), [estimatedTime]);

  // Get status color
  const statusColor = useMemo(() => {
    switch (status) {
      case 'overdue':
        return WarningColors[500];
      case 'arriving':
        return SuccessColors[500];
      case 'soon':
        return PrimaryColors[500];
      case 'onTime':
        return colors.primary;
    }
  }, [status, colors.primary]);

  // Get status icon
  const statusIcon = useMemo((): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'overdue':
        return 'time-outline';
      case 'arriving':
        return 'bicycle';
      case 'soon':
        return 'timer-outline';
      case 'onTime':
        return 'time-outline';
    }
  }, [status]);

  // Determine padding based on size
  const containerPadding =
    size === 'large' ? Spacing[6] : size === 'compact' ? Spacing[3] : Spacing[4];

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          padding: containerPadding,
          ...Shadows.md,
        },
      ]}
      testID={testID}
    >
      {/* Header with icon and status */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${statusColor}20` }]}>
          <Ionicons name={statusIcon} size={size === 'compact' ? 18 : 22} color={statusColor} />
        </View>
        <PulsingDot color={statusColor} />
      </View>

      {/* Countdown Timer */}
      <View style={styles.countdownContainer}>
        <CountdownTimer
          display={timeRemaining.display}
          status={status}
          colors={colors}
          size={size}
          previousMinutes={previousMinutes}
          currentMinutes={timeRemaining.minutes}
        />
        <Text
          style={[
            styles.unitText,
            {
              color: colors.textSecondary,
              fontSize: size === 'compact' ? Typography.sm.fontSize : Typography.base.fontSize,
            },
          ]}
          testID="eta-unit-label"
        >
          {showSeconds ? '' : 'min'}
        </Text>
      </View>

      {/* Status Text */}
      <Text
        style={[
          styles.statusText,
          {
            color: statusColor,
            fontSize: size === 'compact' ? Typography.sm.fontSize : Typography.base.fontSize,
          },
        ]}
        testID="eta-status-text"
      >
        {statusText}
      </Text>

      {/* Arrival Time */}
      <View style={[styles.arrivalTimeContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="flag-outline" size={14} color={colors.textSecondary} />
        <Text
          style={[
            styles.arrivalTimeText,
            {
              color: colors.textSecondary,
              fontSize: size === 'compact' ? Typography.xs.fontSize : Typography.sm.fontSize,
            },
          ]}
          testID="eta-arrival-time"
        >
          Expected by {arrivalTimeText}
        </Text>
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: Spacing[1],
    marginBottom: Spacing[2],
  },
  countdownText: {
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  unitText: {
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  statusText: {
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[3],
  },
  arrivalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1.5],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
  },
  arrivalTimeText: {
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
});

export default ETADisplay;
