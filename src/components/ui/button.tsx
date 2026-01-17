/**
 * Button component with primary, secondary, outline, and ghost variants
 * Includes press animations using react-native-reanimated
 */

import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button text content */
  children: string;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Shows loading spinner and disables button */
  loading?: boolean;
  /** Icon to display before the text */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Icon to display after the text */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Custom text style overrides */
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const isDisabled = disabled || loading;

  const handlePressIn: PressableProps['onPressIn'] = (event) => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(0.9, { duration: AnimationDurations.instant });
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps['onPressOut'] = (event) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(1, { duration: AnimationDurations.instant });
    onPressOut?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled ? colors.textTertiary : colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: isDisabled ? colors.textTertiary : colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: isDisabled ? colors.textTertiary : colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const getTextColor = (): string => {
    if (isDisabled) {
      return variant === 'outline' || variant === 'ghost'
        ? colors.textTertiary
        : colors.backgroundSecondary;
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return colors.text;
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: Spacing[3],
            paddingVertical: Spacing[1.5],
            minHeight: 32,
          },
          text: Typography.sm,
          iconSize: 14,
        };
      case 'md':
        return {
          container: {
            paddingHorizontal: Spacing[4],
            paddingVertical: Spacing[2],
            minHeight: 44,
          },
          text: Typography.base,
          iconSize: 18,
        };
      case 'lg':
        return {
          container: {
            paddingHorizontal: Spacing[6],
            paddingVertical: Spacing[3],
            minHeight: 52,
          },
          text: Typography.lg,
          iconSize: 20,
        };
      default:
        return {
          container: {},
          text: Typography.base,
          iconSize: 18,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const textColor = getTextColor();

  return (
    <AnimatedPressable
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        getVariantStyles(),
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={sizeStyles.iconSize}
              color={textColor}
              style={styles.leftIcon}
            />
          )}
          <Text style={[styles.text, sizeStyles.text, { color: textColor }, textStyle]}>
            {children}
          </Text>
          {rightIcon && (
            <Ionicons
              name={rightIcon}
              size={sizeStyles.iconSize}
              color={textColor}
              style={styles.rightIcon}
            />
          )}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: Spacing[1.5],
  },
  rightIcon: {
    marginLeft: Spacing[1.5],
  },
});
