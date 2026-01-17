/**
 * Restaurant Detail Screen
 *
 * Displays comprehensive restaurant information with:
 * - Hero image with parallax scroll effect
 * - Restaurant name, rating, review count
 * - Cuisine tags, price level indicators
 * - Delivery time and fee
 * - "More Info" expandable section (hours, address, about)
 * - Share and favorite buttons
 *
 * Uses react-native-reanimated for smooth parallax animations
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { getRestaurantById } from '@/data/mock/restaurants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Restaurant } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const HEADER_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 100;
const PARALLAX_FACTOR = 0.5;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats the price level as dollar signs
 */
export function formatPriceLevel(priceLevel: number): string {
  return '$'.repeat(Math.min(Math.max(priceLevel, 1), 4));
}

/**
 * Formats the delivery time range
 */
export function formatDeliveryTime(min: number, max: number): string {
  return `${min}-${max} min`;
}

/**
 * Formats the delivery fee
 */
export function formatDeliveryFee(fee: number): string {
  if (fee === 0) {
    return 'Free delivery';
  }
  return `$${fee.toFixed(2)} delivery`;
}

/**
 * Get current day name for hours lookup
 */
export function getCurrentDayName(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

/**
 * Format business hours for display
 */
export function formatBusinessHours(open: string, close: string, isClosed: boolean): string {
  if (isClosed) {
    return 'Closed';
  }
  return `${open} - ${close}`;
}

// ============================================================================
// Sub-Components
// ============================================================================

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  filled?: boolean;
  fillColor?: string;
}

/**
 * ActionButton - Circular button for share/favorite actions
 */
function ActionButton({
  icon,
  onPress,
  accessibilityLabel,
  filled = false,
  fillColor,
}: ActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.actionButton, { backgroundColor: colors.card }, animatedStyle]}>
        <Ionicons name={icon} size={22} color={filled && fillColor ? fillColor : colors.text} />
      </Animated.View>
    </Pressable>
  );
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

/**
 * InfoRow - Row displaying an info item with icon
 */
function InfoRow({ icon, label, value }: InfoRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        <Ionicons name={icon} size={20} color={colors.icon} />
        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</ThemedText>
      </View>
      <ThemedText style={[styles.infoValue, { color: colors.text }]}>{value}</ThemedText>
    </View>
  );
}

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

/**
 * ExpandableSection - Collapsible section for more info
 */
function ExpandableSection({ title, children, defaultExpanded = false }: ExpandableSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const rotation = useSharedValue(defaultExpanded ? 1 : 0);
  const height = useSharedValue(defaultExpanded ? 1 : 0);

  const toggleExpanded = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    rotation.value = withTiming(newExpanded ? 1 : 0, { duration: AnimationDurations.fast });
    height.value = withTiming(newExpanded ? 1 : 0, { duration: AnimationDurations.normal });
  }, [isExpanded, rotation, height]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: height.value,
    maxHeight: interpolate(height.value, [0, 1], [0, 500]),
  }));

  return (
    <View style={styles.expandableSection}>
      <Pressable
        onPress={toggleExpanded}
        style={styles.expandableHeader}
        accessibilityLabel={`${title}, ${isExpanded ? 'collapse' : 'expand'}`}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
      >
        <ThemedText style={[styles.expandableTitle, { color: colors.text }]}>{title}</ThemedText>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color={colors.icon} />
        </Animated.View>
      </Pressable>
      <Animated.View style={[styles.expandableContent, contentStyle]}>{children}</Animated.View>
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // State
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Animation values
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // Fetch restaurant data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = getRestaurantById(id);
      setRestaurant(data ?? null);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  // Scroll handler for parallax effect
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Parallax header animation
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [-HEADER_HEIGHT * PARALLAX_FACTOR, 0, HEADER_HEIGHT * PARALLAX_FACTOR],
      Extrapolation.CLAMP
    );

    const scale = interpolate(scrollY.value, [-HEADER_HEIGHT, 0], [2, 1], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  // Header overlay opacity animation
  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
      [0.3, 0.7],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  // Back button handler
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Share handler
  const handleShare = useCallback(async () => {
    if (!restaurant) return;

    try {
      await Share.share({
        message: `Check out ${restaurant.name} on Maestro! ${restaurant.cuisine.join(', ')} • ${restaurant.rating} ⭐`,
        title: restaurant.name,
      });
    } catch {
      Alert.alert('Error', 'Unable to share restaurant');
    }
  }, [restaurant]);

  // Favorite handler
  const handleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
    // TODO: Persist favorite state to store
  }, []);

  // Memoized values
  const todayHours = useMemo(() => {
    if (!restaurant?.hours) return null;
    const dayName = getCurrentDayName() as keyof typeof restaurant.hours;
    return restaurant.hours[dayName];
  }, [restaurant?.hours]);

  const deliveryTimeText = useMemo(() => {
    if (!restaurant) return '';
    return formatDeliveryTime(restaurant.deliveryTime.min, restaurant.deliveryTime.max);
  }, [restaurant]);

  const deliveryFeeText = useMemo(() => {
    if (!restaurant) return '';
    return formatDeliveryFee(restaurant.deliveryFee);
  }, [restaurant]);

  const priceLevelText = useMemo(() => {
    if (!restaurant) return '';
    return formatPriceLevel(restaurant.priceLevel);
  }, [restaurant]);

  // Loading state
  if (isLoading || !restaurant) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <Animated.View entering={FadeIn.duration(AnimationDurations.normal)}>
            <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading...
            </ThemedText>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Button - Fixed position */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(AnimationDurations.normal)}
        style={[styles.backButtonContainer, { top: insets.top + Spacing[2] }]}
      >
        <Pressable
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: colors.card }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      </Animated.View>

      {/* Action Buttons - Fixed position */}
      <Animated.View
        entering={FadeInDown.delay(150).duration(AnimationDurations.normal)}
        style={[styles.actionButtonsContainer, { top: insets.top + Spacing[2] }]}
      >
        <ActionButton
          icon="share-outline"
          onPress={handleShare}
          accessibilityLabel="Share restaurant"
        />
        <View style={{ width: Spacing[2] }} />
        <ActionButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          onPress={handleFavorite}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          filled={isFavorite}
          fillColor={PrimaryColors[500]}
        />
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[6] }}
      >
        {/* Hero Image with Parallax */}
        <View style={styles.headerContainer}>
          <Animated.View style={[styles.imageWrapper, headerAnimatedStyle]}>
            <Image
              source={{ uri: restaurant.coverImage || restaurant.image }}
              style={styles.headerImage}
              contentFit="cover"
              transition={200}
            />
          </Animated.View>

          {/* Gradient Overlay */}
          <Animated.View style={[styles.gradientOverlay, overlayAnimatedStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Closed Overlay */}
          {!restaurant.isOpen && (
            <View style={styles.closedOverlay}>
              <Badge variant="error" size="lg">
                Currently Closed
              </Badge>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
          {/* Restaurant Name and Rating */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(AnimationDurations.normal)}
            style={styles.headerInfo}
          >
            <ThemedText style={[styles.restaurantName, { color: colors.text }]}>
              {restaurant.name}
            </ThemedText>

            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={18} color={WarningColors[500]} />
                <ThemedText style={[styles.ratingText, { color: colors.text }]}>
                  {restaurant.rating.toFixed(1)}
                </ThemedText>
                <ThemedText style={[styles.reviewCount, { color: colors.textSecondary }]}>
                  ({restaurant.reviewCount} reviews)
                </ThemedText>
              </View>
            </View>
          </Animated.View>

          {/* Cuisine Tags */}
          <Animated.View
            entering={FadeInUp.delay(250).duration(AnimationDurations.normal)}
            style={styles.cuisineContainer}
          >
            {restaurant.cuisine.map((cuisine, index) => (
              <View
                key={cuisine}
                style={[
                  styles.cuisineTag,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    marginRight: index < restaurant.cuisine.length - 1 ? Spacing[2] : 0,
                  },
                ]}
              >
                <ThemedText style={[styles.cuisineText, { color: colors.textSecondary }]}>
                  {cuisine}
                </ThemedText>
              </View>
            ))}
            <View style={[styles.priceLevelTag, { backgroundColor: colors.backgroundSecondary }]}>
              <ThemedText style={[styles.priceLevelText, { color: colors.text }]}>
                {priceLevelText}
              </ThemedText>
            </View>
          </Animated.View>

          {/* Delivery Info */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(AnimationDurations.normal)}
            style={styles.deliveryInfoContainer}
          >
            <View style={styles.deliveryItem}>
              <Ionicons name="time-outline" size={20} color={PrimaryColors[500]} />
              <ThemedText style={[styles.deliveryText, { color: colors.text }]}>
                {deliveryTimeText}
              </ThemedText>
            </View>
            <View style={styles.deliveryDivider} />
            <View style={styles.deliveryItem}>
              <Ionicons name="bicycle-outline" size={20} color={PrimaryColors[500]} />
              <ThemedText style={[styles.deliveryText, { color: colors.text }]}>
                {deliveryFeeText}
              </ThemedText>
            </View>
            {restaurant.minOrder && (
              <>
                <View style={styles.deliveryDivider} />
                <View style={styles.deliveryItem}>
                  <Ionicons name="cart-outline" size={20} color={PrimaryColors[500]} />
                  <ThemedText style={[styles.deliveryText, { color: colors.text }]}>
                    ${restaurant.minOrder.toFixed(2)} min
                  </ThemedText>
                </View>
              </>
            )}
          </Animated.View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* More Info Section */}
          <Animated.View entering={FadeInUp.delay(350).duration(AnimationDurations.normal)}>
            <ExpandableSection title="More Info" defaultExpanded={false}>
              {/* About */}
              {restaurant.description && (
                <View style={styles.aboutSection}>
                  <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                    About
                  </ThemedText>
                  <ThemedText style={[styles.descriptionText, { color: colors.textSecondary }]}>
                    {restaurant.description}
                  </ThemedText>
                </View>
              )}

              {/* Address */}
              <InfoRow icon="location-outline" label="Address" value={restaurant.address} />

              {/* Today's Hours */}
              {todayHours && (
                <InfoRow
                  icon="time-outline"
                  label="Today's Hours"
                  value={formatBusinessHours(
                    todayHours.open,
                    todayHours.close,
                    todayHours.isClosed
                  )}
                />
              )}

              {/* All Hours */}
              {restaurant.hours && (
                <View style={styles.allHoursSection}>
                  <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                    Opening Hours
                  </ThemedText>
                  {Object.entries(restaurant.hours).map(([day, hours]) => (
                    <View key={day} style={styles.hoursRow}>
                      <ThemedText style={[styles.dayText, { color: colors.textSecondary }]}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.hoursText,
                          { color: hours.isClosed ? colors.textTertiary : colors.text },
                        ]}
                      >
                        {formatBusinessHours(hours.open, hours.close, hours.isClosed)}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}
            </ExpandableSection>
          </Animated.View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Menu Section Placeholder */}
          <Animated.View entering={FadeInUp.delay(400).duration(AnimationDurations.normal)}>
            <ThemedText style={[styles.menuTitle, { color: colors.text }]}>Menu</ThemedText>
            <View style={[styles.menuPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="restaurant-outline" size={48} color={colors.textTertiary} />
              <ThemedText style={[styles.menuPlaceholderText, { color: colors.textSecondary }]}>
                Menu items coming soon...
              </ThemedText>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
  },
  backButtonContainer: {
    position: 'absolute',
    left: Spacing[4],
    zIndex: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  actionButtonsContainer: {
    position: 'absolute',
    right: Spacing[4],
    flexDirection: 'row',
    zIndex: 100,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  imageWrapper: {
    height: HEADER_HEIGHT,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    marginTop: -Spacing[6],
    paddingTop: Spacing[5],
    paddingHorizontal: Spacing[4],
  },
  headerInfo: {
    marginBottom: Spacing[3],
  },
  restaurantName: {
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
    marginLeft: Spacing[1],
  },
  reviewCount: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginLeft: Spacing[1],
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing[4],
    alignItems: 'center',
  },
  cuisineTag: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    marginBottom: Spacing[2],
  },
  cuisineText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  priceLevelTag: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    marginLeft: Spacing[2],
    marginBottom: Spacing[2],
  },
  priceLevelText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '600',
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: Spacing[4],
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginLeft: Spacing[1],
    fontWeight: '500',
  },
  deliveryDivider: {
    width: 1,
    height: 16,
    backgroundColor: NeutralColors[300],
    marginHorizontal: Spacing[3],
  },
  divider: {
    height: 1,
    marginVertical: Spacing[4],
  },
  expandableSection: {
    marginBottom: Spacing[2],
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  expandableTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
  },
  expandableContent: {
    overflow: 'hidden',
  },
  aboutSection: {
    marginBottom: Spacing[4],
  },
  sectionTitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
    marginBottom: Spacing[2],
  },
  descriptionText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight * 1.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginLeft: Spacing[2],
  },
  infoValue: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  allHoursSection: {
    marginTop: Spacing[4],
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing[1],
  },
  dayText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    textTransform: 'capitalize',
  },
  hoursText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  menuTitle: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: '700',
    marginBottom: Spacing[4],
  },
  menuPlaceholder: {
    padding: Spacing[8],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuPlaceholderText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    marginTop: Spacing[3],
  },
});
