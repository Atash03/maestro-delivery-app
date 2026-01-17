/**
 * SearchBar component with animated focus state, clear button, and recent searches
 *
 * Features:
 * - Animated focus state with border color transition
 * - Search icon on the left
 * - Clear button when text is entered
 * - Recent searches dropdown stored in AsyncStorage
 * - Navigation to search screen on focus (when not already on search screen)
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, usePathname } from 'expo-router';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Storage key for recent searches */
export const RECENT_SEARCHES_KEY = 'maestro-recent-searches';

/** Maximum number of recent searches to store */
export const MAX_RECENT_SEARCHES = 10;

export interface SearchBarProps extends Omit<TextInputProps, 'style' | 'onFocus' | 'onBlur'> {
  /** Callback when search is submitted */
  onSearch?: (query: string) => void;
  /** Callback when the search bar is focused */
  onFocus?: () => void;
  /** Callback when the search bar loses focus */
  onBlur?: () => void;
  /** Callback when a recent search is selected */
  onRecentSearchSelect?: (query: string) => void;
  /** Whether to show recent searches dropdown */
  showRecentSearches?: boolean;
  /** Whether to navigate to search screen on focus (default: true when not on search screen) */
  navigateOnFocus?: boolean;
  /** Custom container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Custom dropdown style */
  dropdownStyle?: StyleProp<ViewStyle>;
  /** Whether the search bar is disabled */
  disabled?: boolean;
}

export interface SearchBarRef {
  /** Focus the input */
  focus: () => void;
  /** Blur the input */
  blur: () => void;
  /** Clear the input */
  clear: () => void;
  /** Get current value */
  getValue: () => string;
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  (
    {
      value: controlledValue,
      onChangeText,
      onSearch,
      onFocus,
      onBlur,
      onRecentSearchSelect,
      showRecentSearches = true,
      navigateOnFocus,
      containerStyle,
      dropdownStyle,
      disabled = false,
      placeholder = 'Search restaurants or dishes...',
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const pathname = usePathname();
    const isOnSearchScreen = pathname === '/search' || pathname === '/(tabs)/search';

    const inputRef = useRef<TextInput>(null);
    const [internalValue, setInternalValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Use controlled or internal value
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    // Animation values
    const focusProgress = useSharedValue(0);
    const clearButtonScale = useSharedValue(0);

    // Determine if we should navigate on focus
    const shouldNavigateOnFocus = navigateOnFocus ?? !isOnSearchScreen;

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => handleClear(),
      getValue: () => value,
    }));

    // Load recent searches on mount
    useEffect(() => {
      const loadSearches = async () => {
        try {
          const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
          if (stored) {
            setRecentSearches(JSON.parse(stored));
          }
        } catch {
          // Silently fail if storage is unavailable
        }
      };
      loadSearches();
    }, []);

    // Update clear button visibility
    useEffect(() => {
      clearButtonScale.value = withSpring(value.length > 0 ? 1 : 0, {
        damping: 15,
        stiffness: 400,
      });
    }, [value, clearButtonScale]);

    const saveRecentSearch = useCallback(
      async (query: string) => {
        if (!query.trim()) return;

        try {
          const trimmedQuery = query.trim();
          // Remove duplicates and add to front
          const updated = [trimmedQuery, ...recentSearches.filter((s) => s !== trimmedQuery)].slice(
            0,
            MAX_RECENT_SEARCHES
          );
          setRecentSearches(updated);
          await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch {
          // Silently fail if storage is unavailable
        }
      },
      [recentSearches]
    );

    const removeRecentSearch = useCallback(
      async (query: string) => {
        try {
          const updated = recentSearches.filter((s) => s !== query);
          setRecentSearches(updated);
          await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch {
          // Silently fail if storage is unavailable
        }
      },
      [recentSearches]
    );

    const clearAllRecentSearches = useCallback(async () => {
      try {
        setRecentSearches([]);
        await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      } catch {
        // Silently fail if storage is unavailable
      }
    }, []);

    const handleFocus = useCallback(() => {
      if (disabled) return;

      setIsFocused(true);
      focusProgress.value = withTiming(1, { duration: AnimationDurations.fast });

      // Show dropdown if we have recent searches and feature is enabled
      if (showRecentSearches && recentSearches.length > 0) {
        setIsDropdownVisible(true);
      }

      // Navigate to search screen if configured
      if (shouldNavigateOnFocus) {
        router.push('/(tabs)/search');
      }

      onFocus?.();
    }, [
      disabled,
      focusProgress,
      showRecentSearches,
      recentSearches.length,
      shouldNavigateOnFocus,
      onFocus,
    ]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      focusProgress.value = withTiming(0, { duration: AnimationDurations.fast });

      // Delay hiding dropdown to allow for item selection
      setTimeout(() => {
        setIsDropdownVisible(false);
      }, 150);

      onBlur?.();
    }, [focusProgress, onBlur]);

    const handleChangeText = useCallback(
      (text: string) => {
        if (controlledValue === undefined) {
          setInternalValue(text);
        }
        onChangeText?.(text);

        // Show/hide dropdown based on text and recent searches
        if (showRecentSearches && text.length === 0 && recentSearches.length > 0 && isFocused) {
          setIsDropdownVisible(true);
        } else if (text.length > 0) {
          setIsDropdownVisible(false);
        }
      },
      [controlledValue, onChangeText, showRecentSearches, recentSearches.length, isFocused]
    );

    const handleClear = useCallback(() => {
      if (controlledValue === undefined) {
        setInternalValue('');
      }
      onChangeText?.('');
      inputRef.current?.focus();

      // Show dropdown again after clearing
      if (showRecentSearches && recentSearches.length > 0) {
        setIsDropdownVisible(true);
      }
    }, [controlledValue, onChangeText, showRecentSearches, recentSearches.length]);

    const handleSubmit = useCallback(() => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        saveRecentSearch(trimmedValue);
        onSearch?.(trimmedValue);
      }
      setIsDropdownVisible(false);
    }, [value, onSearch, saveRecentSearch]);

    const handleRecentSearchPress = useCallback(
      (query: string) => {
        if (controlledValue === undefined) {
          setInternalValue(query);
        }
        onChangeText?.(query);
        onRecentSearchSelect?.(query);
        setIsDropdownVisible(false);

        // Also trigger search
        saveRecentSearch(query);
        onSearch?.(query);
      },
      [controlledValue, onChangeText, onRecentSearchSelect, onSearch, saveRecentSearch]
    );

    // Animated styles
    const animatedBorderStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        focusProgress.value,
        [0, 1],
        [colors.border, colors.borderFocus]
      );

      return {
        borderColor,
        borderWidth: 1.5,
      };
    });

    const clearButtonAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: clearButtonScale.value }],
      opacity: clearButtonScale.value,
    }));

    const getIconColor = () => {
      if (disabled) return colors.textTertiary;
      if (isFocused) return colors.primary;
      return colors.icon;
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        <AnimatedView
          style={[
            styles.container,
            {
              backgroundColor: disabled ? colors.backgroundTertiary : colors.backgroundSecondary,
            },
            animatedBorderStyle,
          ]}
        >
          {/* Search Icon */}
          <Ionicons
            name="search"
            size={20}
            color={getIconColor()}
            style={styles.searchIcon}
            accessibilityElementsHidden
          />

          {/* Text Input */}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            editable={!disabled}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.input,
              Typography.base,
              {
                color: disabled ? colors.textTertiary : colors.text,
              },
            ]}
            accessibilityLabel="Search input"
            accessibilityHint="Enter a search term to find restaurants or dishes"
            {...props}
          />

          {/* Clear Button */}
          <AnimatedPressable
            onPress={handleClear}
            style={[styles.clearButton, clearButtonAnimatedStyle]}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={[styles.clearButtonInner, { backgroundColor: colors.textTertiary }]}>
              <Ionicons name="close" size={12} color={colors.background} />
            </View>
          </AnimatedPressable>
        </AnimatedView>

        {/* Recent Searches Dropdown */}
        {isDropdownVisible && showRecentSearches && recentSearches.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(AnimationDurations.fast)}
            exiting={FadeOut.duration(AnimationDurations.fast)}
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.background,
                ...Shadows.md,
              },
              dropdownStyle,
            ]}
          >
            {/* Header */}
            <View style={styles.dropdownHeader}>
              <Text style={[styles.dropdownTitle, { color: colors.textSecondary }]}>
                Recent Searches
              </Text>
              <Pressable
                onPress={clearAllRecentSearches}
                accessibilityLabel="Clear all recent searches"
                accessibilityRole="button"
              >
                <Text style={[styles.clearAllText, { color: colors.primary }]}>Clear All</Text>
              </Pressable>
            </View>

            {/* Recent Search Items */}
            {recentSearches.map((query, index) => (
              <Pressable
                key={`${query}-${index}`}
                onPress={() => handleRecentSearchPress(query)}
                style={({ pressed }) => [
                  styles.recentSearchItem,
                  {
                    backgroundColor: pressed ? colors.backgroundSecondary : 'transparent',
                  },
                ]}
                accessibilityLabel={`Recent search: ${query}`}
                accessibilityRole="button"
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.textTertiary}
                  style={styles.recentSearchIcon}
                />
                <Text style={[styles.recentSearchText, { color: colors.text }]} numberOfLines={1}>
                  {query}
                </Text>
                <Pressable
                  onPress={() => removeRecentSearch(query)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel={`Remove ${query} from recent searches`}
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={16} color={colors.textTertiary} />
                </Pressable>
              </Pressable>
            ))}
          </Animated.View>
        )}
      </View>
    );
  }
);

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    minHeight: 48,
  },
  searchIcon: {
    marginLeft: Spacing[3],
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    paddingVertical: Spacing[2],
    paddingRight: Spacing[1],
  },
  clearButton: {
    marginRight: Spacing[3],
    marginLeft: Spacing[2],
  },
  clearButtonInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing[2],
    zIndex: 101,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  dropdownTitle: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  clearAllText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  recentSearchIcon: {
    marginRight: Spacing[3],
  },
  recentSearchText: {
    flex: 1,
    ...Typography.base,
  },
});
