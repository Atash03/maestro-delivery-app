import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AnimationDurations, Colors, PrimaryColors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding until we're ready
SplashScreen.preventAutoHideAsync();

// Configure splash screen animation options
SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

/**
 * Custom theme that extends React Navigation default themes
 * with our app's primary colors
 */
const MaestroLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PrimaryColors[500],
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

const MaestroDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: PrimaryColors[500],
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

/**
 * AnimatedLogo - Shows an animated logo reveal on app launch
 * Uses spring animations for a bouncy, delightful reveal effect
 */
function AnimatedLogo({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Start the animation sequence
    opacity.value = withTiming(1, { duration: AnimationDurations.fast });
    scale.value = withSequence(
      // Spring in with overshoot
      withSpring(1.1, { damping: 8, stiffness: 200 }),
      // Settle to final size
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    // Fade in the text after logo animation
    textOpacity.value = withDelay(
      AnimationDurations.normal,
      withTiming(1, { duration: AnimationDurations.normal }, (finished) => {
        if (finished) {
          // After animation completes, wait a moment then trigger completion
          runOnJS(setTimeout)(() => {
            runOnJS(onAnimationComplete)();
          }, AnimationDurations.slow);
        }
      })
    );
  }, [scale, opacity, textOpacity, onAnimationComplete]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View
      style={[
        styles.logoContainer,
        { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : PrimaryColors[50] },
      ]}
    >
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <View style={styles.logoIcon}>
          <Animated.Text style={[styles.logoEmoji]}>🍽️</Animated.Text>
        </View>
      </Animated.View>
      <Animated.Text style={[styles.logoText, { color: colors.text }, textStyle]}>
        Maestro
      </Animated.Text>
      <Animated.Text style={[styles.tagline, { color: colors.textSecondary }, textStyle]}>
        Delicious food, delivered
      </Animated.Text>
    </View>
  );
}

/**
 * Root layout - Handles navigation between auth and main app flows
 *
 * Navigation structure:
 * - (auth): Unauthenticated screens (onboarding, sign-in, sign-up, verify)
 * - (tabs): Main app with bottom tab navigation
 * - (modals): Modal screens that overlay the main app
 * - restaurant/[id]: Restaurant detail screen
 * - order/*: Order-related screens
 * - support/*: Help and support screens
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MaestroDarkTheme : MaestroLightTheme;
  const colors = Colors[colorScheme ?? 'light'];

  const [appIsReady, setAppIsReady] = useState(false);
  const [showAnimatedLogo, setShowAnimatedLogo] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Here you can pre-load fonts, make API calls, or do any initialization
        // For now, we'll just simulate a brief loading period
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the native splash screen once the root view has performed layout
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleAnimationComplete = useCallback(() => {
    setShowAnimatedLogo(false);
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        {showAnimatedLogo ? (
          <Animated.View style={styles.animatedLogoWrapper} exiting={FadeOut.duration(300)}>
            <AnimatedLogo onAnimationComplete={handleAnimationComplete} />
          </Animated.View>
        ) : (
          <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: colors.background,
                },
              }}
            >
              {/* Auth flow - Stack navigation for unauthenticated users */}
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />

              {/* Main app - Tab navigation for authenticated users */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Modal screens - Presented modally over other content */}
              <Stack.Screen
                name="modal"
                options={{
                  presentation: 'modal',
                  title: 'Modal',
                }}
              />
            </Stack>
          </Animated.View>
        )}
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedLogoWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PrimaryColors[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PrimaryColors[700],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 56,
  },
  logoText: {
    fontSize: Typography['4xl'].fontSize,
    lineHeight: Typography['4xl'].lineHeight,
    fontWeight: '700',
    marginTop: 24,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    marginTop: 8,
  },
});

/**
 * Deep linking configuration
 *
 * The app.json scheme 'maestrodeliveryapp' enables URLs like:
 * - maestrodeliveryapp://restaurant/123 -> Opens restaurant detail
 * - maestrodeliveryapp://order/456 -> Opens order tracking
 * - maestrodeliveryapp://search?q=pizza -> Opens search with query
 */
export const unstable_settings = {
  // Ensure any route can link back to the main tabs
  initialRouteName: '(tabs)',
};
