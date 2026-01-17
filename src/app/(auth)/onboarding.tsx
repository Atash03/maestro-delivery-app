import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Onboarding screen - Welcome carousel for new users
 * Full implementation will be done in Phase 1, Task 1.2
 */
export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText type="title">Welcome to Maestro</ThemedText>
      <ThemedText style={styles.subtitle}>Your food, delivered</ThemedText>
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
});
