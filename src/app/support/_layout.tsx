/**
 * Support route layout
 * Stack navigation for help center and issue reporting screens
 */

import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SupportLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="issue/[orderId]"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="issue/details"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="issue/status/[issueId]"
        options={{
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
