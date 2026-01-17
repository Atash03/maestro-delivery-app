/**
 * Badge component for displaying status indicators, labels, and counts
 * Supports various color variants and sizes
 */

import { Ionicons } from '@expo/vector-icons';
import {
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import {
  BorderRadius,
  Colors,
  ErrorColors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  SecondaryColors,
  Spacing,
  SuccessColors,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Text content of the badge */
  children: string;
  /** Color variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Icon to display before the text */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Use outlined style instead of filled */
  outlined?: boolean;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Custom text style overrides */
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  outlined = false,
  style,
  textStyle,
}: BadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const getVariantColors = (): {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  } => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: outlined
            ? 'transparent'
            : isDark
              ? PrimaryColors[900]
              : PrimaryColors[100],
          textColor: isDark ? PrimaryColors[300] : PrimaryColors[700],
          borderColor: isDark ? PrimaryColors[700] : PrimaryColors[300],
        };
      case 'secondary':
        return {
          backgroundColor: outlined
            ? 'transparent'
            : isDark
              ? SecondaryColors[900]
              : SecondaryColors[100],
          textColor: isDark ? SecondaryColors[300] : SecondaryColors[700],
          borderColor: isDark ? SecondaryColors[700] : SecondaryColors[300],
        };
      case 'success':
        return {
          backgroundColor: outlined
            ? 'transparent'
            : isDark
              ? SuccessColors[900]
              : SuccessColors[100],
          textColor: isDark ? SuccessColors[300] : SuccessColors[700],
          borderColor: isDark ? SuccessColors[700] : SuccessColors[300],
        };
      case 'warning':
        return {
          backgroundColor: outlined
            ? 'transparent'
            : isDark
              ? WarningColors[900]
              : WarningColors[100],
          textColor: isDark ? WarningColors[300] : WarningColors[700],
          borderColor: isDark ? WarningColors[700] : WarningColors[300],
        };
      case 'error':
        return {
          backgroundColor: outlined ? 'transparent' : isDark ? ErrorColors[900] : ErrorColors[100],
          textColor: isDark ? ErrorColors[300] : ErrorColors[700],
          borderColor: isDark ? ErrorColors[700] : ErrorColors[300],
        };
      default:
        return {
          backgroundColor: outlined
            ? 'transparent'
            : isDark
              ? NeutralColors[800]
              : NeutralColors[100],
          textColor: colors.textSecondary,
          borderColor: colors.border,
        };
    }
  };

  const getSizeStyles = (): {
    container: ViewStyle;
    text: TextStyle;
    iconSize: number;
  } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: Spacing[1.5],
            paddingVertical: Spacing[0.5],
            borderRadius: BorderRadius.sm,
          },
          text: Typography.xs,
          iconSize: 10,
        };
      case 'md':
        return {
          container: {
            paddingHorizontal: Spacing[2],
            paddingVertical: Spacing[0.5],
            borderRadius: BorderRadius.md,
          },
          text: Typography.sm,
          iconSize: 12,
        };
      case 'lg':
        return {
          container: {
            paddingHorizontal: Spacing[3],
            paddingVertical: Spacing[1],
            borderRadius: BorderRadius.md,
          },
          text: Typography.base,
          iconSize: 14,
        };
      default:
        return {
          container: {},
          text: Typography.sm,
          iconSize: 12,
        };
    }
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        {
          backgroundColor: variantColors.backgroundColor,
          borderWidth: outlined ? 1 : 0,
          borderColor: variantColors.borderColor,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={variantColors.textColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[styles.text, sizeStyles.text, { color: variantColors.textColor }, textStyle]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: Spacing[1],
  },
  text: {
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
});
