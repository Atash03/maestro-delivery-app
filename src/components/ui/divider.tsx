/**
 * Divider component for separating content
 * Supports horizontal and vertical orientations with optional labels
 */

import {
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { Colors, FontWeights, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  /** Orientation of the divider */
  orientation?: DividerOrientation;
  /** Thickness of the divider line */
  thickness?: number;
  /** Color of the divider (overrides theme color) */
  color?: string;
  /** Label text to display in the center (horizontal only) */
  label?: string;
  /** Spacing around the divider */
  spacing?: number;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Custom label style overrides */
  labelStyle?: StyleProp<TextStyle>;
}

export function Divider({
  orientation = 'horizontal',
  thickness = 1,
  color,
  label,
  spacing = 0,
  style,
  labelStyle,
}: DividerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const dividerColor = color || colors.divider;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          {
            width: thickness,
            backgroundColor: dividerColor,
            marginHorizontal: spacing,
          },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[styles.horizontalWithLabel, { marginVertical: spacing }, style]}>
        <View
          style={[
            styles.horizontalLine,
            {
              height: thickness,
              backgroundColor: dividerColor,
            },
          ]}
        />
        <Text style={[styles.label, { color: colors.textTertiary }, labelStyle]}>{label}</Text>
        <View
          style={[
            styles.horizontalLine,
            {
              height: thickness,
              backgroundColor: dividerColor,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          height: thickness,
          backgroundColor: dividerColor,
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  horizontalWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  horizontalLine: {
    flex: 1,
  },
  vertical: {
    alignSelf: 'stretch',
  },
  label: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    marginHorizontal: Spacing[3],
  },
});
