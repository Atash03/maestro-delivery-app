import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors, PrimaryColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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

  return (
    <ThemeProvider value={theme}>
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
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

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
