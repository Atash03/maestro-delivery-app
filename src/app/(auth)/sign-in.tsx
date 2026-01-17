import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Sign In screen - Email/phone sign in
 * Full implementation will be done in Phase 1, Task 1.4
 */
export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText type="title">Sign In</ThemedText>
      <ThemedText style={styles.subtitle}>Welcome back to Maestro</ThemedText>

      <View style={styles.links}>
        <Link href="/(auth)/sign-up" asChild>
          <ThemedText type="link">Don&apos;t have an account? Sign Up</ThemedText>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[4],
  },
  subtitle: {
    marginTop: Spacing[2],
  },
  links: {
    marginTop: Spacing[6],
  },
});
