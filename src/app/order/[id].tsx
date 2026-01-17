/**
 * Order Tracking Screen (Placeholder)
 *
 * This screen will be fully implemented in Phase 5: Real-Time Order Tracking.
 * For now, it serves as a placeholder that shows order confirmation.
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, type TextStyle, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Spacing,
  SuccessColors,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const buttonScale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.97, SPRING_CONFIG);
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, SPRING_CONFIG);
  }, [buttonScale]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleBackToHome = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      testID="order-tracking-screen"
    >
      {/* Success Animation */}
      <View style={styles.content}>
        <Animated.View
          entering={FadeIn.duration(AnimationDurations.normal).delay(100)}
          style={[styles.successCircle, { backgroundColor: SuccessColors[100] }]}
        >
          <Animated.View
            entering={FadeIn.duration(AnimationDurations.normal).delay(300)}
            style={[styles.successIconCircle, { backgroundColor: SuccessColors[500] }]}
          >
            <Ionicons name="checkmark" size={48} color={NeutralColors[0]} />
          </Animated.View>
        </Animated.View>

        <Animated.Text
          entering={FadeInUp.duration(AnimationDurations.normal).delay(400)}
          style={[styles.title, { color: colors.text }]}
        >
          Order Placed!
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.duration(AnimationDurations.normal).delay(500)}
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          Your order has been confirmed and is being prepared.
        </Animated.Text>

        {id && (
          <Animated.View
            entering={FadeInUp.duration(AnimationDurations.normal).delay(600)}
            style={[styles.orderIdContainer, { backgroundColor: colors.backgroundSecondary }]}
          >
            <Text style={[styles.orderIdLabel, { color: colors.textSecondary }]}>Order ID</Text>
            <Text style={[styles.orderId, { color: colors.text }]}>{id}</Text>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInDown.duration(AnimationDurations.normal).delay(700)}
          style={styles.placeholderContainer}
        >
          <Ionicons name="construct-outline" size={24} color={colors.textTertiary} />
          <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
            Real-time order tracking will be implemented in Phase 5
          </Text>
        </Animated.View>
      </View>

      {/* Back to Home Button */}
      <Animated.View
        entering={FadeInUp.duration(AnimationDurations.normal).delay(800)}
        style={styles.buttonContainer}
      >
        <AnimatedPressable
          onPress={handleBackToHome}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.button, { backgroundColor: PrimaryColors[500] }, buttonStyle]}
          accessibilityLabel="Back to home"
          accessibilityRole="button"
          testID="back-to-home-button"
        >
          <Text style={[styles.buttonText, { color: NeutralColors[0] }]}>Back to Home</Text>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography['3xl'].fontSize,
    lineHeight: Typography['3xl'].lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
    marginBottom: Spacing[6],
  },
  orderIdContainer: {
    alignItems: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[6],
  },
  orderIdLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  orderId: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    marginTop: Spacing[1],
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  placeholderText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: Spacing[4],
  },
  button: {
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
});
