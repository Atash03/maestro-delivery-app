/**
 * GuestPromptBanner - Displays a banner prompting guests to sign up
 * Used in screens where guest users have limited access (Orders, Profile, etc.)
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BorderRadius, Colors, PrimaryColors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type GuestPromptType = 'orders' | 'addresses' | 'profile' | 'favorites' | 'general';

interface GuestPromptBannerProps {
  /** The type of prompt to display */
  type?: GuestPromptType;
  /** Optional custom title */
  title?: string;
  /** Optional custom description */
  description?: string;
  /** Whether to show as a full-screen empty state */
  fullScreen?: boolean;
  /** Optional callback when sign up is pressed */
  onSignUp?: () => void;
  /** Optional callback when sign in is pressed */
  onSignIn?: () => void;
}

const promptContent: Record<
  GuestPromptType,
  { title: string; description: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  orders: {
    title: 'Track Your Orders',
    description: 'Sign up to save your order history and easily reorder your favorites.',
    icon: 'receipt-outline',
  },
  addresses: {
    title: 'Save Your Addresses',
    description: 'Create an account to save delivery addresses for faster checkout.',
    icon: 'location-outline',
  },
  profile: {
    title: 'Create Your Profile',
    description: 'Sign up to personalize your experience and save your preferences.',
    icon: 'person-outline',
  },
  favorites: {
    title: 'Save Your Favorites',
    description: 'Create an account to save your favorite restaurants and dishes.',
    icon: 'heart-outline',
  },
  general: {
    title: 'Unlock More Features',
    description:
      'Sign up for the full Maestro experience with order tracking, saved addresses, and more.',
    icon: 'sparkles-outline',
  },
};

export function GuestPromptBanner({
  type = 'general',
  title,
  description,
  fullScreen = false,
  onSignUp,
  onSignIn,
}: GuestPromptBannerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const content = promptContent[type];
  const displayTitle = title ?? content.title;
  const displayDescription = description ?? content.description;

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      router.push('/(auth)/sign-up');
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      router.push('/(auth)/sign-in');
    }
  };

  if (fullScreen) {
    return (
      <View style={[styles.fullScreenContainer, { backgroundColor: colors.background }]}>
        <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: PrimaryColors[50] }]}>
            <Ionicons name={content.icon} size={48} color={PrimaryColors[500]} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.textContainer}>
          <ThemedText type="title" style={styles.fullScreenTitle}>
            {displayTitle}
          </ThemedText>
          <ThemedText style={[styles.fullScreenDescription, { color: colors.textSecondary }]}>
            {displayDescription}
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(400).delay(300)}
          style={styles.fullScreenButtons}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSignUp}
            accessibilityLabel="Sign up for an account"
          >
            Sign Up
          </Button>

          <Pressable
            onPress={handleSignIn}
            style={styles.signInLink}
            accessibilityRole="button"
            accessibilityLabel="Sign in to existing account"
          >
            <ThemedText style={{ color: colors.textSecondary }}>
              Already have an account?{' '}
            </ThemedText>
            <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>Sign In</ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(100)}>
      <Card
        variant="filled"
        padding="md"
        radius="lg"
        style={[styles.bannerCard, { borderColor: PrimaryColors[200] }]}
      >
        <View style={styles.bannerContent}>
          <View style={[styles.bannerIconCircle, { backgroundColor: PrimaryColors[100] }]}>
            <Ionicons name={content.icon} size={24} color={PrimaryColors[600]} />
          </View>

          <View style={styles.bannerTextContainer}>
            <ThemedText type="defaultSemiBold" style={styles.bannerTitle}>
              {displayTitle}
            </ThemedText>
            <ThemedText
              style={[styles.bannerDescription, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {displayDescription}
            </ThemedText>
          </View>
        </View>

        <View style={styles.bannerButtons}>
          <Button
            variant="primary"
            size="sm"
            onPress={handleSignUp}
            style={styles.bannerSignUpButton}
            accessibilityLabel="Sign up for an account"
          >
            Sign Up
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onPress={handleSignIn}
            accessibilityLabel="Sign in to existing account"
          >
            Sign In
          </Button>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Full screen styles
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[6],
  },
  iconContainer: {
    marginBottom: Spacing[6],
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  fullScreenTitle: {
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  fullScreenDescription: {
    textAlign: 'center',
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    maxWidth: 300,
  },
  fullScreenButtons: {
    width: '100%',
    maxWidth: 320,
  },
  signInLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[4],
    paddingVertical: Spacing[2],
  },

  // Banner styles
  bannerCard: {
    borderWidth: 1,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing[3],
  },
  bannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[3],
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    marginBottom: Spacing[0.5],
  },
  bannerDescription: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  bannerButtons: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  bannerSignUpButton: {
    flex: 1,
  },
});
