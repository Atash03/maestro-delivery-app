/**
 * DriverCard Component
 *
 * A card component for displaying driver information during order tracking.
 * Features:
 * - Driver photo, name, and rating
 * - Vehicle description
 * - Call button (opens phone dialer)
 * - Message button (placeholder for chat)
 * - Animated slide-up appearance when driver assigned
 * - Theme support (light/dark mode)
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, type TextStyle, View } from 'react-native';
import Animated, {
  FadeIn,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  SuccessColors,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Driver, VehicleType } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface DriverCardProps {
  /** The driver data to display */
  driver: Driver;
  /** Callback when call button is pressed */
  onCall?: (driver: Driver) => void;
  /** Callback when message button is pressed */
  onMessage?: (driver: Driver) => void;
  /** Test ID for testing */
  testID?: string;
  /** Whether to animate the card appearance */
  animated?: boolean;
  /** Animation delay in milliseconds */
  animationDelay?: number;
  /** Compact mode for smaller display */
  compact?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

const VEHICLE_ICONS: Record<VehicleType, keyof typeof Ionicons.glyphMap> = {
  car: 'car-outline',
  motorcycle: 'bicycle-outline', // No motorcycle icon, using bicycle as closest
  bicycle: 'bicycle-outline',
  scooter: 'bicycle-outline', // No scooter icon, using bicycle as closest
};

const VEHICLE_LABELS: Record<VehicleType, string> = {
  car: 'Car',
  motorcycle: 'Motorcycle',
  bicycle: 'Bicycle',
  scooter: 'Scooter',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats the vehicle description
 */
export function formatVehicleDescription(vehicle: Driver['vehicle']): string {
  const parts: string[] = [];

  if (vehicle.color) {
    parts.push(vehicle.color);
  }

  if (vehicle.make && vehicle.model) {
    parts.push(`${vehicle.make} ${vehicle.model}`);
  } else if (vehicle.make) {
    parts.push(vehicle.make);
  } else if (vehicle.model) {
    parts.push(vehicle.model);
  } else {
    parts.push(VEHICLE_LABELS[vehicle.type]);
  }

  return parts.join(' ');
}

/**
 * Formats the license plate for display
 */
export function formatLicensePlate(plate: string | undefined): string | null {
  if (!plate) return null;
  return plate.toUpperCase();
}

/**
 * Opens the phone dialer with the given number
 */
export async function openPhoneDialer(phoneNumber: string): Promise<boolean> {
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
  const url = Platform.OS === 'ios' ? `tel:${cleanNumber}` : `tel:${cleanNumber}`;

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// Sub-Components
// ============================================================================

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
  colors: (typeof Colors)['light'];
  testID?: string;
}

/**
 * Action button for call/message
 */
function ActionButton({ icon, label, onPress, variant, colors, testID }: ActionButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={buttonStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.actionButton,
          {
            backgroundColor: isPrimary ? SuccessColors[500] : colors.backgroundSecondary,
          },
        ]}
        accessibilityLabel={label}
        accessibilityRole="button"
        testID={testID}
      >
        <Ionicons name={icon} size={20} color={isPrimary ? NeutralColors[0] : colors.text} />
        <Text
          style={[styles.actionButtonText, { color: isPrimary ? NeutralColors[0] : colors.text }]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

interface RatingDisplayProps {
  rating: number;
  colors: (typeof Colors)['light'];
}

/**
 * Star rating display
 */
function RatingDisplay({ rating, colors }: RatingDisplayProps) {
  return (
    <View style={styles.ratingContainer}>
      <Ionicons name="star" size={14} color={WarningColors[500]} />
      <Text style={[styles.ratingText, { color: colors.text }]}>{rating.toFixed(1)}</Text>
    </View>
  );
}

// ============================================================================
// Component
// ============================================================================

export function DriverCard({
  driver,
  onCall,
  onMessage,
  testID,
  animated = true,
  animationDelay = 0,
  compact = false,
}: DriverCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Vehicle info
  const vehicleDescription = formatVehicleDescription(driver.vehicle);
  const licensePlate = formatLicensePlate(driver.vehicle.licensePlate);
  const vehicleIcon = VEHICLE_ICONS[driver.vehicle.type];

  // Handlers
  const handleCall = useCallback(() => {
    if (onCall) {
      onCall(driver);
    } else {
      openPhoneDialer(driver.phone);
    }
  }, [driver, onCall]);

  const handleMessage = useCallback(() => {
    onMessage?.(driver);
  }, [driver, onMessage]);

  const content = (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        { backgroundColor: colors.card },
        Shadows.md,
      ]}
      testID={testID}
      accessibilityLabel={`Driver ${driver.name}, ${vehicleDescription}, rated ${driver.rating.toFixed(1)} stars`}
      accessibilityRole="none"
    >
      {/* Driver Info Row */}
      <View style={[styles.driverRow, compact && styles.driverRowCompact]}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {driver.avatar ? (
            <Image
              source={{ uri: driver.avatar }}
              style={[styles.avatar, compact && styles.avatarCompact]}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                compact && styles.avatarCompact,
                { backgroundColor: PrimaryColors[100] },
              ]}
            >
              <Ionicons name="person" size={compact ? 20 : 28} color={PrimaryColors[500]} />
            </View>
          )}
          {/* Online indicator */}
          <View style={[styles.onlineIndicator, { borderColor: colors.card }]} />
        </View>

        {/* Driver Details */}
        <View style={styles.driverDetails}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.driverName,
                compact && styles.driverNameCompact,
                { color: colors.text },
              ]}
              numberOfLines={1}
            >
              {driver.name}
            </Text>
            <RatingDisplay rating={driver.rating} colors={colors} />
          </View>

          <Text style={[styles.driverLabel, { color: colors.textSecondary }]}>Your Driver</Text>
        </View>
      </View>

      {/* Vehicle Info Row */}
      <View style={[styles.vehicleRow, { borderTopColor: colors.divider }]}>
        <View
          style={[styles.vehicleIconContainer, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name={vehicleIcon} size={18} color={colors.textSecondary} />
        </View>
        <View style={styles.vehicleDetails}>
          <Text style={[styles.vehicleDescription, { color: colors.text }]} numberOfLines={1}>
            {vehicleDescription}
          </Text>
          {licensePlate && (
            <View
              style={[
                styles.licensePlateContainer,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <Text style={[styles.licensePlateText, { color: colors.textSecondary }]}>
                {licensePlate}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      {!compact && (
        <View style={styles.actionRow}>
          <ActionButton
            icon="call-outline"
            label="Call"
            onPress={handleCall}
            variant="primary"
            colors={colors}
            testID={testID ? `${testID}-call-button` : 'driver-call-button'}
          />
          <ActionButton
            icon="chatbubble-outline"
            label="Message"
            onPress={handleMessage}
            variant="secondary"
            colors={colors}
            testID={testID ? `${testID}-message-button` : 'driver-message-button'}
          />
        </View>
      )}

      {/* Compact Action Buttons */}
      {compact && (
        <View style={styles.compactActionRow}>
          <Pressable
            onPress={handleCall}
            style={[styles.compactButton, { backgroundColor: SuccessColors[500] }]}
            accessibilityLabel="Call driver"
            testID={testID ? `${testID}-call-button` : 'driver-call-button'}
          >
            <Ionicons name="call" size={18} color={NeutralColors[0]} />
          </Pressable>
          <Pressable
            onPress={handleMessage}
            style={[styles.compactButton, { backgroundColor: colors.backgroundSecondary }]}
            accessibilityLabel="Message driver"
            testID={testID ? `${testID}-message-button` : 'driver-message-button'}
          >
            <Ionicons name="chatbubble" size={18} color={colors.text} />
          </Pressable>
        </View>
      )}
    </View>
  );

  // Apply animation wrapper if animated
  if (animated) {
    return (
      <Animated.View
        entering={SlideInDown.duration(AnimationDurations.normal)
          .delay(animationDelay)
          .springify()
          .damping(15)
          .stiffness(150)}
      >
        <Animated.View entering={FadeIn.duration(AnimationDurations.normal).delay(animationDelay)}>
          {content}
        </Animated.View>
      </Animated.View>
    );
  }

  return content;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
  },
  containerCompact: {
    padding: Spacing[3],
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  driverRowCompact: {
    marginBottom: Spacing[3],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: SuccessColors[500],
    borderWidth: 2,
  },
  driverDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[0.5],
  },
  driverName: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    flex: 1,
  },
  driverNameCompact: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
  },
  driverLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  ratingText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    marginBottom: Spacing[4],
  },
  vehicleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[2],
  },
  vehicleDescription: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    flex: 1,
  },
  licensePlateContainer: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.sm,
  },
  licensePlateText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  actionButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  compactActionRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    justifyContent: 'flex-end',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'transparent', // Set dynamically
  },
  compactButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
