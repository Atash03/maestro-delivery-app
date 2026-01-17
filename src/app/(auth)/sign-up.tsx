import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Sign Up screen - Create a new account
 * Full implementation will be done in Phase 1, Task 1.3
 */
export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText type="title">Create Account</ThemedText>
      <ThemedText style={styles.subtitle}>Join Maestro today</ThemedText>

      <View style={styles.links}>
        <Link href="/(auth)/sign-in" asChild>
          <ThemedText type="link">Already have an account? Sign In</ThemedText>
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
