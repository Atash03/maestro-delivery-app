/**
 * Help Button Component
 *
 * A reusable help button component that provides consistent navigation
 * to the help center or issue reporting screen throughout the app.
 *
 * Features:
 * - Consistent styling with press animation
 * - Optional order ID for direct issue reporting
 * - Multiple visual variants (icon-only, with label)
 * - Theme support (light/dark mode)
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { BorderRadius, Colors, FontWeights, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

export type HelpButtonVariant = 'icon' | 'text' | 'full';
export type HelpButtonSize = 'sm' | 'md' | 'lg';

export interface HelpButtonProps {
  /**
   * Optional order ID to navigate directly to issue reporting
   * If not provided, navigates to the general help center
   */
  orderId?: string;

  /**
   * Visual variant of the button
   * - 'icon': Just the help icon
   * - 'text': Text link style
   * - 'full': Icon with label in a button style
   * @default 'full'
   */
  variant?: HelpButtonVariant;

  /**
   * Size of the button
   * @default 'md'
   */
  size?: HelpButtonSize;

  /**
   * Custom label text
   * @default 'Need help?' or 'Get Help'
   */
  label?: string;

  /**
   * Additional style for the container
   */
  style?: ViewStyle;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Reusable help button component
 */
export function HelpButton({
  orderId,
  variant = 'full',
  size = 'md',
  label,
  style,
  testID = 'help-button',
}: HelpButtonProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(() => {
    if (orderId) {
      // Navigate to issue reporting for specific order
      router.push(`/support/issue/${orderId}`);
    } else {
      // Navigate to general help center
      router.push('/support');
    }
  }, [orderId, router]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Get icon size based on button size
  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  // Get display label
  const displayLabel = label || (variant === 'text' ? 'Get Help' : 'Need help?');

  // Render icon-only variant
  if (variant === 'icon') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.iconButton,
          {
            backgroundColor: colors.backgroundSecondary,
            width: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
            height: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
          },
          buttonStyle,
          style,
        ]}
        accessibilityLabel={displayLabel}
        accessibilityRole="button"
        accessibilityHint={orderId ? 'Report an issue with this order' : 'Open help center'}
        testID={testID}
      >
        <Ionicons name="help-circle-outline" size={getIconSize()} color={colors.text} />
      </AnimatedPressable>
    );
  }

  // Render text-only variant
  if (variant === 'text') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.textButton, buttonStyle, style]}
        accessibilityLabel={displayLabel}
        accessibilityRole="button"
        accessibilityHint={orderId ? 'Report an issue with this order' : 'Open help center'}
        testID={testID}
      >
        <Text
          style={[
            styles.textButtonLabel,
            {
              color: colors.primary,
              fontSize:
                size === 'sm'
                  ? Typography.sm.fontSize
                  : size === 'lg'
                    ? Typography.lg.fontSize
                    : Typography.base.fontSize,
            },
          ]}
        >
          {displayLabel}
        </Text>
      </AnimatedPressable>
    );
  }

  // Render full variant (icon + label)
  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.fullButton,
        {
          backgroundColor: colors.backgroundSecondary,
          paddingVertical: size === 'sm' ? Spacing[2] : size === 'lg' ? Spacing[4] : Spacing[3],
          paddingHorizontal: size === 'sm' ? Spacing[4] : size === 'lg' ? Spacing[8] : Spacing[6],
        },
        buttonStyle,
        style,
      ]}
      accessibilityLabel={displayLabel}
      accessibilityRole="button"
      accessibilityHint={orderId ? 'Report an issue with this order' : 'Open help center'}
      testID={testID}
    >
      <Ionicons name="help-circle-outline" size={getIconSize()} color={colors.text} />
      <Text
        style={[
          styles.fullButtonLabel,
          {
            color: colors.text,
            fontSize:
              size === 'sm'
                ? Typography.sm.fontSize
                : size === 'lg'
                  ? Typography.lg.fontSize
                  : Typography.base.fontSize,
          },
        ]}
      >
        {displayLabel}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    padding: Spacing[1],
  },
  textButtonLabel: {
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    gap: Spacing[2],
  },
  fullButtonLabel: {
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
});

export default HelpButton;
