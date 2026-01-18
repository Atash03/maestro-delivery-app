/**
 * CategoryChip Component
 *
 * A chip component for displaying cuisine categories in a horizontal scroll.
 * Features:
 * - Icon and text display
 * - Selected state with animated scale effect
 * - Press animation using react-native-reanimated
 * - Theme support (light/dark mode)
 */

import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, PrimaryColors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Category } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface CategoryChipProps {
  /** The category to display */
  category: Category;
  /** Whether this chip is currently selected */
  isSelected?: boolean;
  /** Callback when chip is pressed */
  onPress?: (category: Category) => void;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

const CHIP_HEIGHT = 40;
const ICON_SIZE = 18;
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

// ============================================================================
// Component
// ============================================================================

export const CategoryChip = memo(function CategoryChip({
  category,
  isSelected = false,
  onPress,
  testID,
}: CategoryChipProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Animation values
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  // Handle press in
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
    pressed.value = withSpring(1, SPRING_CONFIG);
  }, [scale, pressed]);

  // Handle press out
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
    pressed.value = withSpring(0, SPRING_CONFIG);
  }, [scale, pressed]);

  // Handle press
  const handlePress = useCallback(() => {
    onPress?.(category);
  }, [category, onPress]);

  // Animated container style
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Animated background style for pressed state
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = isSelected
      ? interpolate(pressed.value, [0, 1], [1, 0.9])
      : interpolate(pressed.value, [0, 1], [0, 0.1]);

    return {
      opacity: backgroundColor,
    };
  });

  // Get icon name - cast to Ionicons name type
  const iconName = category.icon as keyof typeof Ionicons.glyphMap;

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      testID={testID}
      accessibilityLabel={`${category.name} category${isSelected ? ', selected' : ''}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: isSelected ? colors.primary : colors.backgroundSecondary,
            borderColor: isSelected ? colors.primary : colors.border,
          },
          animatedContainerStyle,
        ]}
      >
        {/* Pressed overlay */}
        <Animated.View
          style={[
            styles.pressedOverlay,
            {
              backgroundColor: isSelected ? PrimaryColors[700] : colors.text,
            },
            animatedBackgroundStyle,
          ]}
        />

        {/* Content */}
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isSelected
                  ? 'rgba(255, 255, 255, 0.2)'
                  : colors.backgroundTertiary,
              },
            ]}
          >
            <Ionicons
              name={iconName}
              size={ICON_SIZE}
              color={isSelected ? '#FFFFFF' : colors.icon}
            />
          </View>
          <ThemedText
            style={[
              styles.label,
              {
                color: isSelected ? '#FFFFFF' : colors.text,
              },
            ]}
          >
            {category.name}
          </ThemedText>
        </View>
      </Animated.View>
    </Pressable>
  );
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    height: CHIP_HEIGHT,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  pressedOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    gap: Spacing[2],
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '500',
  },
});
