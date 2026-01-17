/**
 * Orders screen - Order history and active orders
 * Shows limited UI for guests with prompts to sign up
 * Full implementation will be done in Phase 6, Task 6.1
 */

import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GuestPromptBanner } from '@/components/guest-prompt-banner';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores';

export default function OrdersScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { user, isGuest } = useAuthStore();

  // Guest mode: show full-screen prompt to sign up
  if (isGuest) {
    return <GuestPromptBanner type="orders" fullScreen />;
  }

  // Not authenticated and not guest: show generic prompt
  if (!user) {
    return <GuestPromptBanner type="general" fullScreen />;
  }

  // Authenticated user: show orders (placeholder for now)
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="title">Orders</ThemedText>
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.subtitle}>Track and view your orders</ThemedText>
        <ThemedText style={[styles.placeholder, { color: colors.textTertiary }]}>
          Your orders will appear here
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[4],
  },
  subtitle: {
    marginBottom: Spacing[2],
  },
  placeholder: {
    textAlign: 'center',
  },
});
