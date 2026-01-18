/**
 * Toast component
 *
 * A lightweight toast notification component for displaying success, error,
 * warning, and info messages. Uses react-native-reanimated for smooth
 * enter/exit animations.
 */

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  ErrorColors,
  FontWeights,
  SecondaryColors,
  Shadows,
  Spacing,
  SuccessColors,
  Typography,
  WarningColors,
  ZIndex,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
  /** Type of toast for styling */
  type: ToastType;
  /** Main message text */
  message: string;
  /** Optional title */
  title?: string;
  /** Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss?: (id: string) => void;
  /** Whether the toast can be dismissed by tapping */
  dismissible?: boolean;
  /** Optional action button */
  action?: {
    label: string;
    onPress: () => void;
  };
}

const TOAST_ICONS: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  warning: 'warning',
  info: 'information-circle',
};

const TOAST_COLORS: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: {
    bg: SuccessColors[50],
    icon: SuccessColors[500],
    border: SuccessColors[200],
  },
  error: {
    bg: ErrorColors[50],
    icon: ErrorColors[500],
    border: ErrorColors[200],
  },
  warning: {
    bg: WarningColors[50],
    icon: WarningColors[500],
    border: WarningColors[200],
  },
  info: {
    bg: SecondaryColors[50],
    icon: SecondaryColors[500],
    border: SecondaryColors[200],
  },
};

const TOAST_COLORS_DARK: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: {
    bg: SuccessColors[900],
    icon: SuccessColors[400],
    border: SuccessColors[700],
  },
  error: {
    bg: ErrorColors[900],
    icon: ErrorColors[400],
    border: ErrorColors[700],
  },
  warning: {
    bg: WarningColors[900],
    icon: WarningColors[400],
    border: WarningColors[700],
  },
  info: {
    bg: SecondaryColors[900],
    icon: SecondaryColors[400],
    border: SecondaryColors[700],
  },
};

/** Default duration for toasts in milliseconds */
const DEFAULT_TOAST_DURATION = 4000;

/**
 * Toast - Individual toast notification
 *
 * @example
 * <Toast
 *   id="toast-1"
 *   type="success"
 *   message="Order placed successfully!"
 *   onDismiss={(id) => removeToast(id)}
 * />
 */
export function Toast({
  id,
  type,
  message,
  title,
  duration = DEFAULT_TOAST_DURATION,
  onDismiss,
  dismissible = true,
  action,
}: ToastProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const toastColors = colorScheme === 'light' ? TOAST_COLORS[type] : TOAST_COLORS_DARK[type];
  const insets = useSafeAreaInsets();

  // Animation values
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  const dismiss = useCallback(() => {
    // Animate out
    opacity.value = withTiming(0, { duration: AnimationDurations.fast });
    translateY.value = withTiming(-100, { duration: AnimationDurations.normal }, () => {
      if (onDismiss) {
        runOnJS(onDismiss)(id);
      }
    });
    scale.value = withTiming(0.9, { duration: AnimationDurations.fast });
  }, [id, onDismiss, opacity, translateY, scale]);

  useEffect(() => {
    // Animate in
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: AnimationDurations.fast });
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });

    // Auto-dismiss after duration
    if (duration > 0) {
      opacity.value = withDelay(
        duration,
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(0, { duration: AnimationDurations.fast })
        )
      );
      translateY.value = withDelay(
        duration + AnimationDurations.fast,
        withTiming(-100, { duration: AnimationDurations.normal }, () => {
          if (onDismiss) {
            runOnJS(onDismiss)(id);
          }
        })
      );
    }
  }, [duration, id, onDismiss, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (dismissible) {
      dismiss();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: toastColors.bg,
          borderColor: toastColors.border,
          top: insets.top + Spacing[2],
        },
        Shadows.lg,
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={styles.pressable}
        accessibilityRole="alert"
        accessibilityLabel={title ? `${title}: ${message}` : message}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name={TOAST_ICONS[type]} size={24} color={toastColors.icon} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {title && (
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>
          )}
          <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
            {message}
          </Text>
        </View>

        {/* Action or Close Button */}
        {action ? (
          <Pressable
            onPress={() => {
              action.onPress();
              dismiss();
            }}
            style={styles.actionButton}
          >
            <Text style={[styles.actionText, { color: toastColors.icon }]}>{action.label}</Text>
          </Pressable>
        ) : (
          dismissible && (
            <Pressable onPress={dismiss} style={styles.closeButton} hitSlop={8}>
              <Ionicons name="close" size={20} color={colors.textTertiary} />
            </Pressable>
          )
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing[4],
    right: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    zIndex: ZIndex.toast,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
  },
  iconContainer: {
    marginRight: Spacing[3],
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
    marginBottom: Spacing[0.5],
  },
  message: {
    ...Typography.sm,
  },
  actionButton: {
    marginLeft: Spacing[3],
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
  },
  actionText: {
    ...Typography.sm,
    fontWeight: FontWeights.semibold as '600',
  },
  closeButton: {
    marginLeft: Spacing[2],
    padding: Spacing[1],
  },
});
