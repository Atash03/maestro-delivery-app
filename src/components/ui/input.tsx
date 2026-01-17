/**
 * Input component with label, error state, and icon support
 * Features animated focus states using react-native-reanimated
 */

import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
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

const AnimatedView = Animated.createAnimatedComponent(View);

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Label displayed above the input */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Helper text displayed below the input (hidden when error is shown) */
  helperText?: string;
  /** Icon displayed on the left side of the input */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Icon displayed on the right side of the input */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  /** Callback when right icon is pressed */
  onRightIconPress?: () => void;
  /** Custom container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Custom input style */
  inputStyle?: StyleProp<TextStyle>;
  /** Disabled state */
  disabled?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      inputStyle,
      disabled = false,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const [isFocused, setIsFocused] = useState(false);

    const focusProgress = useSharedValue(0);
    const hasError = !!error;

    const handleFocus: TextInputProps['onFocus'] = (event) => {
      setIsFocused(true);
      focusProgress.value = withTiming(1, { duration: AnimationDurations.fast });
      onFocus?.(event);
    };

    const handleBlur: TextInputProps['onBlur'] = (event) => {
      setIsFocused(false);
      focusProgress.value = withTiming(0, { duration: AnimationDurations.fast });
      onBlur?.(event);
    };

    const getBorderColor = () => {
      if (hasError) return colors.error;
      if (disabled) return colors.textTertiary;
      return colors.border;
    };

    const getFocusedBorderColor = () => {
      if (hasError) return colors.error;
      return colors.borderFocus;
    };

    const animatedBorderStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        focusProgress.value,
        [0, 1],
        [getBorderColor(), getFocusedBorderColor()]
      );

      return {
        borderColor,
        borderWidth: 1.5,
      };
    });

    const getIconColor = () => {
      if (disabled) return colors.textTertiary;
      if (hasError) return colors.error;
      if (isFocused) return colors.primary;
      return colors.icon;
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: hasError ? colors.error : colors.text,
              },
            ]}
          >
            {label}
          </Text>
        )}

        <AnimatedView
          style={[
            styles.container,
            {
              backgroundColor: disabled ? colors.backgroundTertiary : colors.background,
            },
            animatedBorderStyle,
          ]}
        >
          {leftIcon && (
            <Ionicons name={leftIcon} size={20} color={getIconColor()} style={styles.leftIcon} />
          )}

          <TextInput
            ref={ref}
            editable={!disabled}
            placeholderTextColor={colors.textTertiary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              styles.input,
              Typography.base,
              {
                color: disabled ? colors.textTertiary : colors.text,
              },
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              inputStyle,
            ]}
            {...props}
          />

          {rightIcon && (
            <Ionicons
              name={rightIcon}
              size={20}
              color={getIconColor()}
              style={styles.rightIcon}
              onPress={disabled ? undefined : onRightIconPress}
            />
          )}
        </AnimatedView>

        {(error || helperText) && (
          <Text
            style={[
              styles.helperText,
              {
                color: hasError ? colors.error : colors.textSecondary,
              },
            ]}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    marginBottom: Spacing[1],
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    marginLeft: Spacing[3],
    marginRight: Spacing[2],
  },
  rightIcon: {
    marginRight: Spacing[3],
    marginLeft: Spacing[2],
  },
  helperText: {
    ...Typography.xs,
    marginTop: Spacing[1],
  },
});
