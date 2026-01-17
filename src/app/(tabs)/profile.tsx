/**
 * Profile screen - User profile and settings
 * Shows limited UI for guests with prompts to sign up
 * Full profile editing will be implemented in Phase 1, Task 1.7
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GuestPromptBanner } from '@/components/guest-prompt-banner';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showBadge?: boolean;
  danger?: boolean;
}

function MenuItem({ icon, label, onPress, showBadge, danger }: MenuItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuIconContainer,
            { backgroundColor: danger ? `${colors.error}15` : colors.backgroundSecondary },
          ]}
        >
          <Ionicons name={icon} size={20} color={danger ? colors.error : colors.textSecondary} />
        </View>
        <ThemedText style={[styles.menuItemLabel, danger && { color: colors.error }]}>
          {label}
        </ThemedText>
        {showBadge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.badgeText}>New</ThemedText>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isGuest, signOut } = useAuthStore();

  // Guest mode: show full-screen prompt to sign up
  if (isGuest) {
    return <GuestPromptBanner type="profile" fullScreen />;
  }

  // Not authenticated and not guest: should redirect to auth
  // This is a fallback case
  if (!user) {
    return <GuestPromptBanner type="general" fullScreen />;
  }

  const handleSignOut = () => {
    signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing[4] }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.header}>
        <Avatar
          source={user.avatar ? { uri: user.avatar } : undefined}
          name={user.name}
          size={80}
        />
        <ThemedText type="title" style={styles.userName}>
          {user.name}
        </ThemedText>
        <ThemedText style={[styles.userEmail, { color: colors.textSecondary }]}>
          {user.email}
        </ThemedText>
        {user.phone && (
          <ThemedText style={[styles.userPhone, { color: colors.textTertiary }]}>
            {user.phone}
          </ThemedText>
        )}
      </Animated.View>

      {/* Account Section */}
      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.sectionTitle, { color: colors.textSecondary }]}
        >
          Account
        </ThemedText>
        <Card variant="elevated" padding="none" radius="lg">
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="location-outline" label="Saved Addresses" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="card-outline" label="Payment Methods" onPress={() => {}} />
        </Card>
      </Animated.View>

      {/* Preferences Section */}
      <Animated.View entering={FadeInDown.duration(400).delay(300)}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.sectionTitle, { color: colors.textSecondary }]}
        >
          Preferences
        </ThemedText>
        <Card variant="elevated" padding="none" radius="lg">
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="moon-outline" label="Appearance" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="language-outline" label="Language" onPress={() => {}} />
        </Card>
      </Animated.View>

      {/* Support Section */}
      <Animated.View entering={FadeInDown.duration(400).delay(400)}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.sectionTitle, { color: colors.textSecondary }]}
        >
          Support
        </ThemedText>
        <Card variant="elevated" padding="none" radius="lg">
          <MenuItem icon="help-circle-outline" label="Help Center" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="chatbubble-outline" label="Contact Us" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="document-text-outline" label="Terms & Privacy" onPress={() => {}} />
        </Card>
      </Animated.View>

      {/* Sign Out */}
      <Animated.View entering={FadeInDown.duration(400).delay(500)}>
        <Card variant="elevated" padding="none" radius="lg" style={styles.signOutCard}>
          <MenuItem icon="log-out-outline" label="Sign Out" onPress={handleSignOut} danger />
        </Card>
      </Animated.View>

      {/* App Version */}
      <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.versionContainer}>
        <ThemedText style={[styles.versionText, { color: colors.textTertiary }]}>
          Maestro v1.0.0
        </ThemedText>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  userName: {
    marginTop: Spacing[3],
  },
  userEmail: {
    fontSize: Typography.base.fontSize,
    marginTop: Spacing[1],
  },
  userPhone: {
    fontSize: Typography.sm.fontSize,
    marginTop: Spacing[0.5],
  },
  sectionTitle: {
    fontSize: Typography.sm.fontSize,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing[6],
    marginBottom: Spacing[2],
    marginLeft: Spacing[1],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[3],
  },
  menuItemLabel: {
    fontSize: Typography.base.fontSize,
  },
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: BorderRadius.full,
    marginLeft: Spacing[2],
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: Typography.xs.fontSize,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: Spacing[4] + 36 + Spacing[3], // icon container width + margins
  },
  signOutCard: {
    marginTop: Spacing[6],
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: Spacing[6],
  },
  versionText: {
    fontSize: Typography.sm.fontSize,
  },
});
