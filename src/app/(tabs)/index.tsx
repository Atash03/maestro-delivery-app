/**
 * Home Screen - Main discovery feed
 *
 * Features:
 * - Delivery address header with selector
 * - Restaurant discovery sections (to be implemented in Phase 2.5)
 */

import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeliveryAddressHeader } from '@/components/delivery-address-header';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Address } from '@/types';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const handleAddressChange = useCallback((_address: Address) => {
    // In a real app, this would update the restaurant list based on location
    // This will be implemented in Phase 2.5 when building restaurant discovery
  }, []);

  const handleAddNewAddress = useCallback(() => {
    // Navigate to profile screen to add new address
    // In Phase 4, this could open a dedicated address form
    router.push('/(tabs)/profile');
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
    >
      {/* Delivery Address Header */}
      <DeliveryAddressHeader
        onAddressChange={handleAddressChange}
        onAddNewAddress={handleAddNewAddress}
      />

      {/* Placeholder content - Will be replaced in Phase 2.5 */}
      <View style={styles.content}>
        <ThemedText type="title">Maestro</ThemedText>
        <ThemedText style={styles.subtitle}>Discover restaurants near you</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[4],
  },
  subtitle: {
    marginTop: Spacing[2],
  },
});
