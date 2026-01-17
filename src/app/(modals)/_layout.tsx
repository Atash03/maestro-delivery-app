/**
 * Modal Layout
 *
 * Stack navigator for modal screens that are presented modally over other content.
 * Features spring-based slide-up presentation animations.
 */

import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ModalsLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="filters" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ headerShown: false }} />
      <Stack.Screen name="dish-customization" options={{ headerShown: false }} />
    </Stack>
  );
}
