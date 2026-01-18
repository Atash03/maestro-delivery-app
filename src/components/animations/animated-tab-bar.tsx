'use no memo';

/**
 * AnimatedTabBar Component
 *
 * Custom animated tab bar with smooth transitions.
 * Features:
 * - Scale animation on tab press
 * - Animated indicator sliding between tabs
 * - Icon scale animation for active state
 * - Label fade animation
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  AnimationDurations,
  Colors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================================================
// Types
// ============================================================================

interface TabConfig {
  name: string;
  label: string;
  icon: string;
}

// ============================================================================
// Constants
// ============================================================================

const TAB_BAR_HEIGHT = 64;
const TAB_BAR_HEIGHT_IOS = 88;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

const ICON_SPRING_CONFIG = {
  damping: 12,
  stiffness: 250,
  mass: 0.4,
};

const TABS: Record<string, TabConfig> = {
  index: { name: 'index', label: 'Home', icon: 'house.fill' },
  search: { name: 'search', label: 'Search', icon: 'magnifyingglass' },
  orders: { name: 'orders', label: 'Orders', icon: 'doc.text.fill' },
  profile: { name: 'profile', label: 'Profile', icon: 'person.fill' },
};

// ============================================================================
// Tab Item Component
// ============================================================================

interface TabItemProps {
  routeName: string;
  label: string;
  icon: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  colors: {
    tint: string;
    tabIconDefault: string;
    text: string;
    textSecondary: string;
  };
}

function TabItem({
  routeName,
  label,
  icon,
  isFocused,
  onPress,
  onLongPress,
  colors,
}: TabItemProps) {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(isFocused ? 1 : 0.85);
  const labelOpacity = useSharedValue(isFocused ? 1 : 0.7);

  // Update animations when focus changes
  useEffect(() => {
    iconScale.value = withSpring(isFocused ? 1 : 0.85, ICON_SPRING_CONFIG);
    labelOpacity.value = withTiming(isFocused ? 1 : 0.7, { duration: AnimationDurations.fast });
  }, [isFocused, iconScale, labelOpacity]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(() => {
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [onPress]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      testID={`tab-${routeName}`}
    >
      <Animated.View style={[styles.tabItemContent, containerAnimatedStyle]}>
        <Animated.View style={iconAnimatedStyle}>
          <IconSymbol
            name={icon as Parameters<typeof IconSymbol>[0]['name']}
            size={24}
            color={isFocused ? colors.tint : colors.tabIconDefault}
          />
        </Animated.View>
        <Animated.View style={labelAnimatedStyle}>
          <ThemedText
            style={[
              styles.tabLabel,
              {
                color: isFocused ? colors.tint : colors.textSecondary,
                fontWeight: isFocused ? '600' : '500',
              },
            ]}
          >
            {label}
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Animated indicator position
  const indicatorPosition = useSharedValue(0);

  // Update indicator position when active tab changes
  useEffect(() => {
    indicatorPosition.value = withSpring(state.index, SPRING_CONFIG);
  }, [state.index, indicatorPosition]);

  // Indicator animated style
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = state.routes.map((_, i) => i);
    const tabCount = state.routes.filter(
      (route) => descriptors[route.key]?.options?.href !== null
    ).length;

    if (tabCount === 0) return {};

    const baseWidth = 100 / tabCount;

    return {
      left: `${interpolate(
        indicatorPosition.value,
        inputRange,
        inputRange.map((i) => i * baseWidth)
      )}%`,
      width: `${baseWidth}%`,
    };
  });

  const tabBarHeight = Platform.OS === 'ios' ? TAB_BAR_HEIGHT_IOS : TAB_BAR_HEIGHT;

  return (
    <View
      style={[
        styles.container,
        {
          height: tabBarHeight + (Platform.OS === 'ios' ? 0 : insets.bottom),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Spacing[2],
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        Platform.OS === 'ios' && Shadows.sm,
      ]}
    >
      {/* Animated Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: PrimaryColors[500],
          },
          indicatorAnimatedStyle,
        ]}
      />

      {/* Tab Items */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // Skip hidden tabs
          if (options.href === null) {
            return null;
          }

          const tabConfig = TABS[route.name] || {
            name: route.name,
            label: options.title || route.name,
            icon: 'questionmark.circle',
          };

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              routeName={route.name}
              label={tabConfig.label}
              icon={tabConfig.icon}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              colors={colors}
            />
          );
        })}
      </View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    position: 'relative',
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: Spacing[1],
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[0.5],
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});

// ============================================================================
// Exports
// ============================================================================

export default AnimatedTabBar;
