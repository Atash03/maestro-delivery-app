/**
 * Card component with optional pressable behavior
 * Features shadow and scale animation on press
 */

import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AnimationDurations, BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends Omit<PressableProps, 'style'> {
  /** Content of the card */
  children: React.ReactNode;
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Padding inside the card */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Border radius size */
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  /** Makes the card pressable with animations */
  pressable?: boolean;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  radius = 'lg',
  pressable = false,
  style,
  onPressIn,
  onPressOut,
  ...props
}: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(1);

  const handlePressIn: PressableProps['onPressIn'] = (event) => {
    if (pressable) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(0.5, { duration: AnimationDurations.instant });
    }
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps['onPressOut'] = (event) => {
    if (pressable) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(1, { duration: AnimationDurations.fast });
    }
    onPressOut?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: shadowOpacity.value,
  }));

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          ...(Shadows.md as ViewStyle),
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.backgroundSecondary,
        };
      default:
        return {};
    }
  };

  const getPaddingStyles = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: Spacing[2] };
      case 'md':
        return { padding: Spacing[3] };
      case 'lg':
        return { padding: Spacing[4] };
      default:
        return {};
    }
  };

  const getRadiusStyles = (): ViewStyle => {
    switch (radius) {
      case 'sm':
        return { borderRadius: BorderRadius.sm };
      case 'md':
        return { borderRadius: BorderRadius.md };
      case 'lg':
        return { borderRadius: BorderRadius.lg };
      case 'xl':
        return { borderRadius: BorderRadius.xl };
      default:
        return {};
    }
  };

  const cardStyles = [
    styles.container,
    getVariantStyles(),
    getPaddingStyles(),
    getRadiusStyles(),
    style,
  ];

  if (pressable) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[cardStyles, animatedStyle]}
        accessibilityRole="button"
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={cardStyles} {...(props as object)}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
