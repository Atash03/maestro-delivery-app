/**
 * Avatar component for displaying user or restaurant images
 * Features fallback initials and placeholder icon support
 */

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
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
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  /** Image source (URI or require()) */
  source?: ImageSourcePropType | string;
  /** Name for generating initials fallback */
  name?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Border radius variant */
  rounded?: boolean;
  /** Custom background color for fallback */
  backgroundColor?: string;
  /** Show online indicator */
  showOnline?: boolean;
  /** Online status */
  isOnline?: boolean;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
};

const FONT_SIZE_MAP: Record<AvatarSize, typeof Typography.xs> = {
  xs: Typography.xs,
  sm: Typography.sm,
  md: Typography.base,
  lg: Typography.lg,
  xl: Typography['2xl'],
  '2xl': Typography['3xl'],
};

const ICON_SIZE_MAP: Record<AvatarSize, number> = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 34,
  '2xl': 42,
};

const ONLINE_INDICATOR_SIZE_MAP: Record<AvatarSize, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
};

export function Avatar({
  source,
  name,
  size = 'md',
  rounded = true,
  backgroundColor,
  showOnline = false,
  isOnline = false,
  style,
}: AvatarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [imageError, setImageError] = useState(false);

  const avatarSize = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];
  const onlineIndicatorSize = ONLINE_INDICATOR_SIZE_MAP[size];

  const borderRadius = rounded ? avatarSize / 2 : BorderRadius.md;

  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;
    return isDark ? PrimaryColors[900] : PrimaryColors[100];
  };

  const getTextColor = (): string => {
    return isDark ? PrimaryColors[300] : PrimaryColors[700];
  };

  const imageSource: ImageSourcePropType | null =
    typeof source === 'string' ? { uri: source } : source || null;

  const hasValidImage = imageSource && !imageError;
  const initials = name ? getInitials(name) : '';

  const renderContent = () => {
    if (hasValidImage) {
      return (
        <Image
          source={imageSource}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius,
            },
          ]}
          onError={() => setImageError(true)}
        />
      );
    }

    if (initials) {
      return (
        <View
          style={[
            styles.fallback,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius,
              backgroundColor: getBackgroundColor(),
            },
          ]}
        >
          <Text style={[styles.initials, fontSize, { color: getTextColor() }]}>{initials}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.fallback,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius,
            backgroundColor: isDark ? NeutralColors[800] : NeutralColors[200],
          },
        ]}
      >
        <Ionicons
          name="person"
          size={iconSize}
          color={isDark ? NeutralColors[500] : NeutralColors[400]}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderContent()}
      {showOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: onlineIndicatorSize,
              height: onlineIndicatorSize,
              borderRadius: onlineIndicatorSize / 2,
              backgroundColor: isOnline ? colors.success : colors.textTertiary,
              borderColor: colors.background,
              borderWidth: 2,
            },
          ]}
        />
      )}
    </View>
  );
}

/**
 * Avatar group component for displaying multiple avatars with overlap
 */
export interface AvatarGroupProps {
  /** Array of avatar props */
  avatars: Omit<AvatarProps, 'size' | 'rounded'>[];
  /** Maximum number of avatars to display */
  max?: number;
  /** Size of the avatars */
  size?: AvatarSize;
  /** Overlap amount (negative margin) */
  overlap?: number;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

export function AvatarGroup({ avatars, max = 4, size = 'md', overlap, style }: AvatarGroupProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const avatarSize = SIZE_MAP[size];
  const defaultOverlap = -avatarSize * 0.25;
  const marginLeft = overlap ?? defaultOverlap;

  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <View style={[styles.group, style]}>
      {visibleAvatars.map((avatar, index) => (
        <View
          key={`avatar-group-${avatar.name ?? avatar.source ?? index}`}
          style={[
            styles.groupItem,
            index > 0 && { marginLeft },
            { zIndex: visibleAvatars.length - index },
          ]}
        >
          <Avatar
            {...avatar}
            size={size}
            rounded
            style={[
              {
                borderWidth: 2,
                borderColor: colors.background,
              },
            ]}
          />
        </View>
      ))}
      {remaining > 0 && (
        <View style={[styles.groupItem, { marginLeft }, { zIndex: 0 }]}>
          <View
            style={[
              styles.remainingCount,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: colors.backgroundTertiary,
                borderWidth: 2,
                borderColor: colors.background,
              },
            ]}
          >
            <Text
              style={[styles.remainingText, FONT_SIZE_MAP[size], { color: colors.textSecondary }]}
            >
              +{remaining}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItem: {
    position: 'relative',
  },
  remainingCount: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingText: {
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
});
