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
 * - Sticky menu category tabs with scroll sync
 *
 * Uses react-native-reanimated for smooth parallax animations
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, type LayoutChangeEvent, Pressable, Share, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RestaurantMenuItemCard } from '@/components/cards';
import { CART_PREVIEW_HEIGHT, CartPreview } from '@/components/cart-preview';
import { INDICATOR_HEIGHT, MenuCategoryTabs, TAB_HEIGHT } from '@/components/menu-category-tabs';
import { EmptyMenu, MenuSectionHeader, MenuSkeleton } from '@/components/menu-section-list';
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
import { getMenuItemsByRestaurant } from '@/data/mock/menu-items';
import { getRestaurantById } from '@/data/mock/restaurants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  categoriesToMenuCategories,
  getCategoriesFromMenuItems,
} from '@/hooks/use-menu-scroll-sync';
import { useCartStore } from '@/stores';
import type { MenuItem, Restaurant } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const HEADER_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 100;
const PARALLAX_FACTOR = 0.5;
const MENU_TABS_HEIGHT = TAB_HEIGHT + INDICATOR_HEIGHT;
const CATEGORY_ACTIVATION_OFFSET = 120; // How far from top to consider a section "active"

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

  // Cart Store
  const cartItems = useCartStore((state) => state.items);
  const cartRestaurantId = useCartStore((state) => state.restaurantId);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const canAddFromRestaurant = useCartStore((state) => state.canAddFromRestaurant);
  const clearCart = useCartStore((state) => state.clearCart);

  // Check if cart preview should be visible (to add extra padding)
  const showCartPreview = cartItems.length > 0 && cartRestaurantId === id;

  // State
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isTabsSticky, setIsTabsSticky] = useState(false);

  // Animation values
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // Refs for category section positions
  const categoryLayoutsRef = useRef<Map<string, { y: number; height: number }>>(new Map());
  const menuSectionYRef = useRef<number>(0);
  const isProgrammaticScrollRef = useRef(false);

  // Fetch restaurant and menu data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsMenuLoading(true);

      // Fetch restaurant data first (faster)
      await new Promise((resolve) => setTimeout(resolve, 200));
      const restaurantData = getRestaurantById(id);
      setRestaurant(restaurantData ?? null);
      setIsLoading(false);

      // Then fetch menu data (slightly longer delay to simulate heavier data)
      await new Promise((resolve) => setTimeout(resolve, 300));
      const menuData = getMenuItemsByRestaurant(id);
      setMenuItems(menuData);

      // Set initial active category
      if (menuData.length > 0) {
        const categories = getCategoriesFromMenuItems(menuData);
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }
      }
      setIsMenuLoading(false);
    };
    fetchData();
  }, [id]);

  // Get menu categories with item counts
  const menuCategories = useMemo(() => {
    const categories = getCategoriesFromMenuItems(menuItems);
    return categoriesToMenuCategories(categories, menuItems);
  }, [menuItems]);

  // Group menu items by category
  const menuByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    for (const item of menuItems) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }
    return grouped;
  }, [menuItems]);

  // Find active category based on scroll position
  const updateActiveCategoryFromScroll = useCallback(
    (offsetY: number) => {
      if (isProgrammaticScrollRef.current) return;

      const layouts = Array.from(categoryLayoutsRef.current.entries()).sort(
        ([, a], [, b]) => a.y - b.y
      );

      if (layouts.length === 0) return;

      // Find which category section is at the top
      for (let i = layouts.length - 1; i >= 0; i--) {
        const [categoryId, layout] = layouts[i];
        // Account for the menu section offset and activation threshold
        const categoryY = menuSectionYRef.current + layout.y;
        if (offsetY >= categoryY - CATEGORY_ACTIVATION_OFFSET) {
          if (categoryId !== activeCategory) {
            setActiveCategory(categoryId);
          }
          return;
        }
      }

      // Default to first category
      if (layouts.length > 0 && layouts[0][0] !== activeCategory) {
        setActiveCategory(layouts[0][0]);
      }
    },
    [activeCategory]
  );

  // Scroll handler for parallax effect and category tracking
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      // Update sticky state based on scroll position
      const stickyThreshold = menuSectionYRef.current - MENU_TABS_HEIGHT;
      const shouldBeSticky = event.contentOffset.y > stickyThreshold;

      // Run on JS thread for state updates
      runOnJS(setIsTabsSticky)(shouldBeSticky);
      runOnJS(updateActiveCategoryFromScroll)(event.contentOffset.y);
    },
  });

  // Handle category tab press - scroll to that section
  const handleCategoryPress = useCallback(
    (categoryId: string) => {
      const layout = categoryLayoutsRef.current.get(categoryId);
      if (!layout || !scrollRef.current) return;

      // Set flag to prevent scroll handler from overriding
      isProgrammaticScrollRef.current = true;
      setActiveCategory(categoryId);

      // Calculate target scroll position
      const targetY = menuSectionYRef.current + layout.y - CATEGORY_ACTIVATION_OFFSET + 10;

      // Scroll to the category section
      scrollRef.current.scrollTo({ y: targetY, animated: true });

      // Reset flag after animation
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    },
    [scrollRef]
  );

  // Handle category section layout measurement
  const handleCategoryLayout = useCallback((categoryId: string, event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    categoryLayoutsRef.current.set(categoryId, { y, height });
  }, []);

  // Handle menu section layout measurement
  const handleMenuSectionLayout = useCallback((event: LayoutChangeEvent) => {
    menuSectionYRef.current = event.nativeEvent.layout.y;
  }, []);

  // Get quantity of a menu item in cart
  const getItemQuantity = useCallback(
    (menuItemId: string): number => {
      return cartItems
        .filter((cartItem) => cartItem.menuItem.id === menuItemId)
        .reduce((total, cartItem) => total + cartItem.quantity, 0);
    },
    [cartItems]
  );

  // Get cart item by menu item id (for simple items without customizations)
  const getCartItemByMenuItemId = useCallback(
    (menuItemId: string) => {
      return cartItems.find(
        (cartItem) =>
          cartItem.menuItem.id === menuItemId && cartItem.selectedCustomizations.length === 0
      );
    },
    [cartItems]
  );

  // Handle add menu item to cart (for items without customizations)
  const handleMenuItemAdd = useCallback(
    (item: MenuItem) => {
      if (!restaurant) return;

      // Check if we can add from this restaurant
      if (!canAddFromRestaurant(restaurant.id)) {
        Alert.alert(
          'Clear Cart?',
          'You have items from another restaurant in your cart. Would you like to clear it and add this item?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear & Add',
              style: 'destructive',
              onPress: () => {
                clearCart();
                addItem(item, 1, [], undefined, restaurant);
              },
            },
          ]
        );
        return;
      }

      addItem(item, 1, [], undefined, restaurant);
    },
    [restaurant, canAddFromRestaurant, clearCart, addItem]
  );

  // Handle menu item press (opens customization modal)
  const handleMenuItemPress = useCallback(
    (item: MenuItem) => {
      if (item.customizations.length === 0) {
        // No customizations, add directly
        handleMenuItemAdd(item);
      } else {
        // Navigate to customization modal
        router.push({
          pathname: '/(modals)/dish-customization',
          params: { itemId: item.id },
        });
      }
    },
    [handleMenuItemAdd, router]
  );

  // Handle increment quantity
  const handleMenuItemIncrement = useCallback(
    (item: MenuItem) => {
      // For items with customizations, we should open the modal to allow new customization
      if (item.customizations.length > 0) {
        router.push({
          pathname: '/(modals)/dish-customization',
          params: { itemId: item.id },
        });
        return;
      }

      // Find existing cart item and increment
      const cartItem = getCartItemByMenuItemId(item.id);
      if (cartItem) {
        updateQuantity(cartItem.id, cartItem.quantity + 1);
      } else {
        // Shouldn't happen, but add new item just in case
        handleMenuItemAdd(item);
      }
    },
    [getCartItemByMenuItemId, updateQuantity, handleMenuItemAdd, router]
  );

  // Handle decrement quantity
  const handleMenuItemDecrement = useCallback(
    (item: MenuItem) => {
      const cartItem = getCartItemByMenuItemId(item.id);
      if (cartItem) {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      }
    },
    [getCartItemByMenuItemId, updateQuantity]
  );

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
        contentContainerStyle={{
          paddingBottom:
            insets.bottom + Spacing[6] + (showCartPreview ? CART_PREVIEW_HEIGHT + Spacing[4] : 0),
        }}
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

          {/* Menu Section */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(AnimationDurations.normal)}
            onLayout={handleMenuSectionLayout}
          >
            <ThemedText style={[styles.menuTitle, { color: colors.text }]}>Menu</ThemedText>

            {/* Menu Category Tabs - Show only when not loading and has categories */}
            {!isMenuLoading && menuCategories.length > 0 && (
              <View style={styles.menuTabsContainer}>
                <MenuCategoryTabs
                  categories={menuCategories}
                  activeCategory={activeCategory}
                  onCategoryPress={handleCategoryPress}
                  isSticky={false}
                />
              </View>
            )}

            {/* Menu Loading Skeleton */}
            {isMenuLoading && <MenuSkeleton />}

            {/* Menu Items by Category */}
            {!isMenuLoading &&
              menuCategories.map((category, categoryIndex) => (
                <View
                  key={category.id}
                  onLayout={(event) => handleCategoryLayout(category.id, event)}
                  style={styles.categorySection}
                >
                  {/* Category Header with unavailable notice */}
                  <MenuSectionHeader
                    category={category.name}
                    items={menuByCategory[category.id] ?? []}
                    testID={`menu-section-header-${category.id}`}
                  />

                  {/* Menu Items */}
                  {menuByCategory[category.id]?.map((item, itemIndex) => (
                    <Animated.View
                      key={item.id}
                      entering={FadeInUp.delay(100 + categoryIndex * 50 + itemIndex * 30).duration(
                        AnimationDurations.normal
                      )}
                      style={styles.menuItemWrapper}
                    >
                      <RestaurantMenuItemCard
                        item={item}
                        restaurant={restaurant}
                        quantity={getItemQuantity(item.id)}
                        onPress={handleMenuItemPress}
                        onAdd={handleMenuItemAdd}
                        onIncrement={handleMenuItemIncrement}
                        onDecrement={handleMenuItemDecrement}
                        testID={`menu-item-${item.id}`}
                      />
                    </Animated.View>
                  ))}
                </View>
              ))}

            {/* Empty Menu State */}
            {!isMenuLoading && menuCategories.length === 0 && <EmptyMenu testID="empty-menu" />}
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Menu Category Tabs (shown when scrolled past menu section) */}
      {!isMenuLoading && isTabsSticky && menuCategories.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(AnimationDurations.fast)}
          style={[
            styles.stickyTabsContainer,
            {
              top: insets.top,
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <MenuCategoryTabs
            categories={menuCategories}
            activeCategory={activeCategory}
            onCategoryPress={handleCategoryPress}
            isSticky={true}
          />
        </Animated.View>
      )}

      {/* Floating Cart Preview */}
      <CartPreview restaurantId={id} testID="cart-preview" />
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
    marginBottom: Spacing[3],
  },
  menuTabsContainer: {
    marginHorizontal: -Spacing[4],
    marginBottom: Spacing[4],
  },
  stickyTabsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 200,
    borderBottomWidth: 1,
    ...Shadows.sm,
  },
  categorySection: {
    marginBottom: Spacing[6],
  },
  menuItemWrapper: {
    marginBottom: Spacing[3],
  },
});
