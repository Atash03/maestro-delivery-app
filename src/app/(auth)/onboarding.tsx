/**
 * Onboarding screen - Welcome carousel for new users
 *
 * Features:
 * - 4 slides with parallax image effect
 * - Animated pagination dots
 * - Skip button and Get Started button
 * - Persists hasOnboarded flag to AsyncStorage
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = 'maestro-has-onboarded';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Discover Local Favorites',
    description: 'Browse hundreds of restaurants near you and find your next favorite meal',
    icon: 'compass',
    gradient: ['#FF6B35', '#FF8A5C'],
  },
  {
    id: '2',
    title: 'Easy Ordering',
    description: 'Customize your perfect meal with just a few taps and special instructions',
    icon: 'restaurant',
    gradient: ['#0EA5E9', '#38BDF8'],
  },
  {
    id: '3',
    title: 'Real-Time Tracking',
    description: 'Watch your order from kitchen to doorstep with live driver updates',
    icon: 'location',
    gradient: ['#22C55E', '#4ADE80'],
  },
  {
    id: '4',
    title: 'Quick Reordering',
    description: 'Your favorites saved and ready to order again with one tap',
    icon: 'heart',
    gradient: ['#F59E0B', '#FBBF24'],
  },
];

interface SlideProps {
  slide: OnboardingSlide;
  index: number;
  scrollX: Animated.SharedValue<number>;
}

function Slide({ slide, index, scrollX }: SlideProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    // Parallax effect for icon
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [SCREEN_WIDTH * 0.3, 0, -SCREEN_WIDTH * 0.3],
      Extrapolation.CLAMP
    );

    // Scale effect
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP);

    // Opacity effect
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    // Text slides in with slight delay
    const translateY = interpolate(scrollX.value, inputRange, [20, 0, 20], Extrapolation.CLAMP);

    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <View style={[styles.iconBackground, { backgroundColor: slide.gradient[0] }]}>
          <Ionicons name={slide.icon} size={80} color="#FFFFFF" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {slide.description}
        </Text>
      </Animated.View>
    </View>
  );
}

interface PaginationDotsProps {
  count: number;
  scrollX: Animated.SharedValue<number>;
}

function PaginationDots({ count, scrollX }: PaginationDotsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Animated.View
      style={styles.pagination}
      entering={FadeIn.delay(300).duration(AnimationDurations.normal)}
    >
      {Array.from({ length: count }).map((_, dotIndex) => (
        <PaginationDot
          key={`pagination-dot-${dotIndex}`}
          index={dotIndex}
          scrollX={scrollX}
          activeColor={colors.primary}
          inactiveColor={colors.border}
        />
      ))}
    </Animated.View>
  );
}

interface PaginationDotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
}

function PaginationDot({ index, scrollX, activeColor, inactiveColor }: PaginationDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const width = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolation.CLAMP);

    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP);

    return {
      width,
      opacity,
      backgroundColor:
        interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP) > 0.5
          ? activeColor
          : inactiveColor,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function OnboardingScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const buttonScale = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
      router.replace('/sign-up');
    } catch {
      // If storage fails, still navigate
      router.replace('/sign-up');
    }
  }, []);

  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const handleNext = useCallback(() => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  }, [currentIndex, completeOnboarding]);

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [buttonScale]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      <Animated.View
        style={styles.skipContainer}
        entering={FadeInDown.delay(200).duration(AnimationDurations.normal)}
      >
        <Pressable
          onPress={handleSkip}
          style={styles.skipButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </Pressable>
      </Animated.View>

      {/* Carousel */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {ONBOARDING_SLIDES.map((slide, index) => (
          <Slide key={slide.id} slide={slide} index={index} scrollX={scrollX} />
        ))}
      </Animated.ScrollView>

      {/* Bottom Section */}
      <Animated.View
        style={styles.bottomSection}
        entering={FadeInUp.delay(400).duration(AnimationDurations.normal)}
      >
        <PaginationDots count={ONBOARDING_SLIDES.length} scrollX={scrollX} />

        {/* Action Button */}
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <Pressable
            onPress={handleNext}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.actionButtonText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
            {!isLastSlide && (
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            )}
          </Pressable>
        </Animated.View>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={[styles.signInText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <Pressable
            onPress={() => router.push('/sign-in')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: Spacing[16],
    right: Spacing[4],
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  skipText: {
    ...Typography.base,
    fontWeight: FontWeights.medium as '500',
  },
  scrollContent: {
    alignItems: 'center',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[20],
  },
  iconContainer: {
    marginBottom: Spacing[10],
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
  },
  title: {
    ...Typography['3xl'],
    fontWeight: FontWeights.bold as '700',
    textAlign: 'center',
    marginBottom: Spacing[3],
  },
  description: {
    ...Typography.lg,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  bottomSection: {
    paddingBottom: Spacing[12],
    paddingHorizontal: Spacing[6],
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  dot: {
    height: 8,
    borderRadius: BorderRadius.full,
    marginHorizontal: Spacing[1],
  },
  buttonContainer: {
    marginBottom: Spacing[4],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.xl,
    minHeight: 56,
  },
  actionButtonText: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as '600',
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: Spacing[2],
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    ...Typography.base,
  },
  signInLink: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
  },
});

// Export storage key for testing
export { STORAGE_KEY };
