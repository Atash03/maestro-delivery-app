import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';

import { haptics } from '@/utils/haptics';

/**
 * HapticTab component
 *
 * A tab bar button that provides haptic feedback when pressed.
 * Works on both iOS and Android (where supported).
 */
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Add selection haptic feedback when pressing tabs
        haptics.tabSwitch();
        props.onPressIn?.(ev);
      }}
    />
  );
}
