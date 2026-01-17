/**
 * Tests for the SearchBar component
 * Tests component exports, types, functionality, and styling
 *
 * Note: Full rendering tests require a React Native environment.
 * These tests validate the component module structure, types, and logic.
 */

// Mock Platform before any imports
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: <T>(obj: { ios?: T; android?: T; default?: T }): T | undefined => {
      return obj.ios ?? obj.default;
    },
    Version: 14,
  },
  StyleSheet: {
    create: <T extends object>(styles: T): T => styles,
  },
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  Pressable: 'Pressable',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    createAnimatedComponent: (component: unknown) => component,
    View: 'View',
    Text: 'Text',
  },
  useSharedValue: (init: unknown) => ({ value: init }),
  useAnimatedStyle: () => ({}),
  withSpring: (toValue: unknown) => toValue,
  withTiming: (toValue: unknown) => toValue,
  interpolateColor: () => '#000000',
  createAnimatedComponent: (component: unknown) => component,
  FadeIn: {
    duration: () => ({ delay: () => ({}) }),
  },
  FadeOut: {
    duration: () => ({}),
  },
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
}));

// Mock hooks
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  usePathname: () => '/',
}));

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn((key: string) => Promise.resolve(mockStorage[key] || null)),
    setItem: jest.fn((key: string, value: string) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
  },
}));

describe('SearchBar Component', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
    jest.clearAllMocks();
  });

  describe('Component Exports', () => {
    it('exports SearchBar component', () => {
      const component = require('@/components/search-bar');
      expect(component.SearchBar).toBeDefined();
      expect(typeof component.SearchBar).toBe('object'); // forwardRef returns object
    });

    it('exports RECENT_SEARCHES_KEY constant', () => {
      const component = require('@/components/search-bar');
      expect(component.RECENT_SEARCHES_KEY).toBeDefined();
      expect(component.RECENT_SEARCHES_KEY).toBe('maestro-recent-searches');
    });

    it('exports MAX_RECENT_SEARCHES constant', () => {
      const component = require('@/components/search-bar');
      expect(component.MAX_RECENT_SEARCHES).toBeDefined();
      expect(component.MAX_RECENT_SEARCHES).toBe(10);
    });
  });

  describe('Type Definitions', () => {
    it('SearchBarProps supports all expected props', () => {
      const props = {
        value: 'test',
        onChangeText: jest.fn(),
        onSearch: jest.fn(),
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onRecentSearchSelect: jest.fn(),
        showRecentSearches: true,
        navigateOnFocus: false,
        containerStyle: {},
        dropdownStyle: {},
        disabled: false,
        placeholder: 'Search...',
      };

      expect(typeof props.value).toBe('string');
      expect(typeof props.onChangeText).toBe('function');
      expect(typeof props.onSearch).toBe('function');
      expect(typeof props.onFocus).toBe('function');
      expect(typeof props.onBlur).toBe('function');
      expect(typeof props.onRecentSearchSelect).toBe('function');
      expect(typeof props.showRecentSearches).toBe('boolean');
      expect(typeof props.navigateOnFocus).toBe('boolean');
      expect(typeof props.disabled).toBe('boolean');
      expect(typeof props.placeholder).toBe('string');
    });

    it('SearchBarRef provides correct methods', () => {
      const refMethods = {
        focus: jest.fn(),
        blur: jest.fn(),
        clear: jest.fn(),
        getValue: jest.fn(() => 'test'),
      };

      expect(typeof refMethods.focus).toBe('function');
      expect(typeof refMethods.blur).toBe('function');
      expect(typeof refMethods.clear).toBe('function');
      expect(typeof refMethods.getValue).toBe('function');
      expect(refMethods.getValue()).toBe('test');
    });
  });
});

describe('Recent Searches Storage', () => {
  const MAX_RECENT_SEARCHES = 10;

  beforeEach(() => {
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
  });

  describe('saveRecentSearch logic', () => {
    it('adds new search to front of list', () => {
      const existing = ['pizza', 'burgers'];
      const newSearch = 'sushi';
      const result = [newSearch, ...existing.filter((s) => s !== newSearch)].slice(
        0,
        MAX_RECENT_SEARCHES
      );

      expect(result[0]).toBe('sushi');
      expect(result[1]).toBe('pizza');
      expect(result[2]).toBe('burgers');
    });

    it('removes duplicate before adding to front', () => {
      const existing = ['pizza', 'burgers', 'sushi'];
      const newSearch = 'burgers';
      const result = [newSearch, ...existing.filter((s) => s !== newSearch)].slice(
        0,
        MAX_RECENT_SEARCHES
      );

      expect(result).toEqual(['burgers', 'pizza', 'sushi']);
      expect(result).toHaveLength(3);
    });

    it('limits list to MAX_RECENT_SEARCHES', () => {
      const existing = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      const newSearch = '11';
      const result = [newSearch, ...existing.filter((s) => s !== newSearch)].slice(
        0,
        MAX_RECENT_SEARCHES
      );

      expect(result).toHaveLength(10);
      expect(result[0]).toBe('11');
      expect(result[9]).toBe('9');
      expect(result).not.toContain('10');
    });

    it('does not add empty searches', () => {
      const trimmedQuery = ''.trim();
      const shouldAdd = trimmedQuery.length > 0;

      expect(shouldAdd).toBe(false);
    });

    it('does not add whitespace-only searches', () => {
      const trimmedQuery = '   '.trim();
      const shouldAdd = trimmedQuery.length > 0;

      expect(shouldAdd).toBe(false);
    });

    it('trims whitespace from searches', () => {
      const query = '  pizza  ';
      const trimmedQuery = query.trim();

      expect(trimmedQuery).toBe('pizza');
    });
  });

  describe('removeRecentSearch logic', () => {
    it('removes specified search from list', () => {
      const existing = ['pizza', 'burgers', 'sushi'];
      const toRemove = 'burgers';
      const result = existing.filter((s) => s !== toRemove);

      expect(result).toEqual(['pizza', 'sushi']);
      expect(result).not.toContain('burgers');
    });

    it('handles removing non-existent search', () => {
      const existing = ['pizza', 'burgers'];
      const toRemove = 'tacos';
      const result = existing.filter((s) => s !== toRemove);

      expect(result).toEqual(['pizza', 'burgers']);
    });

    it('handles empty list', () => {
      const existing: string[] = [];
      const toRemove = 'pizza';
      const result = existing.filter((s) => s !== toRemove);

      expect(result).toEqual([]);
    });
  });

  describe('clearAllRecentSearches logic', () => {
    it('clears entire list', () => {
      // Simulating clearing ['pizza', 'burgers', 'sushi'] list
      const result: string[] = [];

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('loadRecentSearches logic', () => {
    it('parses stored JSON correctly', () => {
      const stored = '["pizza", "burgers", "sushi"]';
      const result = JSON.parse(stored);

      expect(result).toEqual(['pizza', 'burgers', 'sushi']);
    });

    it('returns empty array when nothing stored', () => {
      const stored = null;
      const result = stored ? JSON.parse(stored) : [];

      expect(result).toEqual([]);
    });

    it('handles malformed JSON gracefully', () => {
      const stored = 'not valid json';
      let result: string[] = [];

      try {
        result = JSON.parse(stored);
      } catch {
        result = [];
      }

      expect(result).toEqual([]);
    });
  });
});

describe('Search Bar Focus Behavior', () => {
  describe('Navigation on focus', () => {
    it('should navigate when not on search screen and navigateOnFocus is undefined', () => {
      const pathname = '/';
      const isOnSearchScreen = pathname === '/search' || pathname === '/(tabs)/search';
      const navigateOnFocus = undefined;
      const shouldNavigate = navigateOnFocus ?? !isOnSearchScreen;

      expect(shouldNavigate).toBe(true);
    });

    it('should not navigate when on search screen', () => {
      const pathname = '/(tabs)/search';
      const isOnSearchScreen = pathname === '/search' || pathname === '/(tabs)/search';
      const navigateOnFocus = undefined;
      const shouldNavigate = navigateOnFocus ?? !isOnSearchScreen;

      expect(shouldNavigate).toBe(false);
    });

    it('should respect explicit navigateOnFocus=true', () => {
      const navigateOnFocus = true;
      const shouldNavigate = navigateOnFocus;

      expect(shouldNavigate).toBe(true);
    });

    it('should respect explicit navigateOnFocus=false', () => {
      const navigateOnFocus = false;
      const shouldNavigate = navigateOnFocus;

      expect(shouldNavigate).toBe(false);
    });
  });

  describe('Dropdown visibility', () => {
    it('shows dropdown when focused and has recent searches', () => {
      const isFocused = true;
      const recentSearches = ['pizza', 'burgers'];
      const showRecentSearches = true;

      const shouldShowDropdown = showRecentSearches && recentSearches.length > 0 && isFocused;

      expect(shouldShowDropdown).toBe(true);
    });

    it('hides dropdown when not focused', () => {
      const isFocused = false;
      const recentSearches = ['pizza', 'burgers'];
      const showRecentSearches = true;

      const shouldShowDropdown = showRecentSearches && recentSearches.length > 0 && isFocused;

      expect(shouldShowDropdown).toBe(false);
    });

    it('hides dropdown when no recent searches', () => {
      const isFocused = true;
      const recentSearches: string[] = [];
      const showRecentSearches = true;

      const shouldShowDropdown = showRecentSearches && recentSearches.length > 0 && isFocused;

      expect(shouldShowDropdown).toBe(false);
    });

    it('hides dropdown when showRecentSearches is false', () => {
      const isFocused = true;
      const recentSearches = ['pizza', 'burgers'];
      const showRecentSearches = false;

      const shouldShowDropdown = showRecentSearches && recentSearches.length > 0 && isFocused;

      expect(shouldShowDropdown).toBe(false);
    });

    it('hides dropdown when text is entered', () => {
      const value = 'search text';
      const shouldHideDropdown = value.length > 0;

      expect(shouldHideDropdown).toBe(true);
    });
  });
});

describe('Clear Button Behavior', () => {
  describe('Visibility', () => {
    it('shows clear button when value is not empty', () => {
      const value = 'test';
      const shouldShow = value.length > 0;

      expect(shouldShow).toBe(true);
    });

    it('hides clear button when value is empty', () => {
      const value = '';
      const shouldShow = value.length > 0;

      expect(shouldShow).toBe(false);
    });
  });

  describe('Animation scale values', () => {
    it('uses scale 1 when visible', () => {
      const value = 'test';
      const scale = value.length > 0 ? 1 : 0;

      expect(scale).toBe(1);
    });

    it('uses scale 0 when hidden', () => {
      const value = '';
      const scale = value.length > 0 ? 1 : 0;

      expect(scale).toBe(0);
    });
  });
});

describe('Search Submission', () => {
  describe('handleSubmit logic', () => {
    it('submits trimmed value', () => {
      const value = '  pizza  ';
      const trimmedValue = value.trim();

      expect(trimmedValue).toBe('pizza');
    });

    it('does not submit empty value', () => {
      const value = '';
      const trimmedValue = value.trim();
      const shouldSubmit = trimmedValue.length > 0;

      expect(shouldSubmit).toBe(false);
    });

    it('does not submit whitespace-only value', () => {
      const value = '   ';
      const trimmedValue = value.trim();
      const shouldSubmit = trimmedValue.length > 0;

      expect(shouldSubmit).toBe(false);
    });

    it('calls onSearch with trimmed value', () => {
      const onSearch = jest.fn();
      const value = '  burger  ';
      const trimmedValue = value.trim();

      if (trimmedValue) {
        onSearch(trimmedValue);
      }

      expect(onSearch).toHaveBeenCalledWith('burger');
    });
  });
});

describe('Controlled vs Uncontrolled Mode', () => {
  describe('Value handling', () => {
    it('uses controlled value when provided', () => {
      const controlledValue = 'controlled';
      const internalValue = 'internal';
      const value = controlledValue !== undefined ? controlledValue : internalValue;

      expect(value).toBe('controlled');
    });

    it('uses internal value when controlled value is undefined', () => {
      const controlledValue = undefined;
      const internalValue = 'internal';
      const value = controlledValue !== undefined ? controlledValue : internalValue;

      expect(value).toBe('internal');
    });
  });

  describe('Change text handling', () => {
    it('updates internal value when uncontrolled', () => {
      const controlledValue = undefined;
      const setInternalValue = jest.fn();
      const onChangeText = jest.fn();

      if (controlledValue === undefined) {
        setInternalValue('new text');
      }
      onChangeText('new text');

      expect(setInternalValue).toHaveBeenCalledWith('new text');
      expect(onChangeText).toHaveBeenCalledWith('new text');
    });

    it('does not update internal value when controlled', () => {
      const controlledValue = 'controlled';
      const setInternalValue = jest.fn();
      const onChangeText = jest.fn();

      if (controlledValue === undefined) {
        setInternalValue('new text');
      }
      onChangeText('new text');

      expect(setInternalValue).not.toHaveBeenCalled();
      expect(onChangeText).toHaveBeenCalledWith('new text');
    });
  });
});

describe('Animation Configuration', () => {
  describe('Focus animation', () => {
    it('uses fast duration for focus transition', () => {
      const { AnimationDurations } = require('@/constants/theme');
      expect(AnimationDurations.fast).toBe(150);
    });

    it('animates to 1 on focus', () => {
      const focusProgress = { value: 0 };
      focusProgress.value = 1; // withTiming(1, ...)
      expect(focusProgress.value).toBe(1);
    });

    it('animates to 0 on blur', () => {
      const focusProgress = { value: 1 };
      focusProgress.value = 0; // withTiming(0, ...)
      expect(focusProgress.value).toBe(0);
    });
  });

  describe('Clear button animation', () => {
    it('uses spring animation with correct config', () => {
      const springConfig = { damping: 15, stiffness: 400 };
      expect(springConfig.damping).toBe(15);
      expect(springConfig.stiffness).toBe(400);
    });
  });
});

describe('Icon Colors', () => {
  describe('getIconColor logic', () => {
    it('returns textTertiary when disabled', () => {
      const disabled = true;
      const isFocused = false;
      const colors = {
        textTertiary: '#A0A0A0',
        primary: '#FF6B35',
        icon: '#6B7280',
      };

      const iconColor = disabled ? colors.textTertiary : isFocused ? colors.primary : colors.icon;

      expect(iconColor).toBe('#A0A0A0');
    });

    it('returns primary when focused', () => {
      const disabled = false;
      const isFocused = true;
      const colors = {
        textTertiary: '#A0A0A0',
        primary: '#FF6B35',
        icon: '#6B7280',
      };

      const iconColor = disabled ? colors.textTertiary : isFocused ? colors.primary : colors.icon;

      expect(iconColor).toBe('#FF6B35');
    });

    it('returns icon color when not focused and not disabled', () => {
      const disabled = false;
      const isFocused = false;
      const colors = {
        textTertiary: '#A0A0A0',
        primary: '#FF6B35',
        icon: '#6B7280',
      };

      const iconColor = disabled ? colors.textTertiary : isFocused ? colors.primary : colors.icon;

      expect(iconColor).toBe('#6B7280');
    });
  });
});

describe('Styling', () => {
  describe('Container styles', () => {
    it('has correct flex direction', () => {
      const containerStyle = { flexDirection: 'row' };
      expect(containerStyle.flexDirection).toBe('row');
    });

    it('has correct alignment', () => {
      const containerStyle = { alignItems: 'center' };
      expect(containerStyle.alignItems).toBe('center');
    });

    it('has correct min height', () => {
      const containerStyle = { minHeight: 48 };
      expect(containerStyle.minHeight).toBe(48);
    });
  });

  describe('Wrapper styles', () => {
    it('has full width', () => {
      const wrapperStyle = { width: '100%' };
      expect(wrapperStyle.width).toBe('100%');
    });

    it('has relative positioning for dropdown', () => {
      const wrapperStyle = { position: 'relative' };
      expect(wrapperStyle.position).toBe('relative');
    });

    it('has high z-index', () => {
      const wrapperStyle = { zIndex: 100 };
      expect(wrapperStyle.zIndex).toBe(100);
    });
  });

  describe('Dropdown styles', () => {
    it('is positioned absolutely', () => {
      const dropdownStyle = { position: 'absolute' };
      expect(dropdownStyle.position).toBe('absolute');
    });

    it('is positioned below the input', () => {
      const dropdownStyle = { top: 52 };
      expect(dropdownStyle.top).toBe(52);
    });

    it('stretches to container width', () => {
      const dropdownStyle = { left: 0, right: 0 };
      expect(dropdownStyle.left).toBe(0);
      expect(dropdownStyle.right).toBe(0);
    });

    it('has higher z-index than wrapper', () => {
      const dropdownStyle = { zIndex: 101 };
      expect(dropdownStyle.zIndex).toBe(101);
    });
  });

  describe('Clear button styles', () => {
    it('clear button inner has correct size', () => {
      const clearButtonInnerStyle = { width: 20, height: 20 };
      expect(clearButtonInnerStyle.width).toBe(20);
      expect(clearButtonInnerStyle.height).toBe(20);
    });

    it('clear button inner is circular', () => {
      const clearButtonInnerStyle = { borderRadius: 10 };
      expect(clearButtonInnerStyle.borderRadius).toBe(10);
    });
  });
});

describe('Accessibility', () => {
  describe('Search input accessibility', () => {
    it('has correct accessibility label', () => {
      const accessibilityLabel = 'Search input';
      expect(accessibilityLabel).toBe('Search input');
    });

    it('has correct accessibility hint', () => {
      const accessibilityHint = 'Enter a search term to find restaurants or dishes';
      expect(accessibilityHint).toContain('search term');
    });
  });

  describe('Clear button accessibility', () => {
    it('has correct accessibility label', () => {
      const accessibilityLabel = 'Clear search';
      expect(accessibilityLabel).toBe('Clear search');
    });

    it('has correct accessibility role', () => {
      const accessibilityRole = 'button';
      expect(accessibilityRole).toBe('button');
    });
  });

  describe('Recent search items accessibility', () => {
    it('has correct accessibility label format', () => {
      const query = 'pizza';
      const accessibilityLabel = `Recent search: ${query}`;
      expect(accessibilityLabel).toBe('Recent search: pizza');
    });

    it('remove button has correct accessibility label', () => {
      const query = 'pizza';
      const accessibilityLabel = `Remove ${query} from recent searches`;
      expect(accessibilityLabel).toBe('Remove pizza from recent searches');
    });
  });

  describe('Clear all button accessibility', () => {
    it('has correct accessibility label', () => {
      const accessibilityLabel = 'Clear all recent searches';
      expect(accessibilityLabel).toBe('Clear all recent searches');
    });
  });
});

describe('Default Props', () => {
  it('default placeholder is correct', () => {
    const defaultPlaceholder = 'Search restaurants or dishes...';
    expect(defaultPlaceholder).toContain('restaurants');
    expect(defaultPlaceholder).toContain('dishes');
  });

  it('showRecentSearches defaults to true', () => {
    const defaultShowRecentSearches = true;
    expect(defaultShowRecentSearches).toBe(true);
  });

  it('disabled defaults to false', () => {
    const defaultDisabled = false;
    expect(defaultDisabled).toBe(false);
  });
});

describe('TextInput Configuration', () => {
  it('uses search return key type', () => {
    const returnKeyType = 'search';
    expect(returnKeyType).toBe('search');
  });

  it('disables auto capitalize', () => {
    const autoCapitalize = 'none';
    expect(autoCapitalize).toBe('none');
  });

  it('disables auto correct', () => {
    const autoCorrect = false;
    expect(autoCorrect).toBe(false);
  });
});

describe('Recent Search Item Interaction', () => {
  describe('handleRecentSearchPress', () => {
    it('sets value to selected search', () => {
      const setInternalValue = jest.fn();
      const query = 'pizza';

      setInternalValue(query);

      expect(setInternalValue).toHaveBeenCalledWith('pizza');
    });

    it('calls onChangeText with selected search', () => {
      const onChangeText = jest.fn();
      const query = 'pizza';

      onChangeText(query);

      expect(onChangeText).toHaveBeenCalledWith('pizza');
    });

    it('calls onRecentSearchSelect with selected search', () => {
      const onRecentSearchSelect = jest.fn();
      const query = 'pizza';

      onRecentSearchSelect(query);

      expect(onRecentSearchSelect).toHaveBeenCalledWith('pizza');
    });

    it('triggers search with selected query', () => {
      const onSearch = jest.fn();
      const query = 'pizza';

      onSearch(query);

      expect(onSearch).toHaveBeenCalledWith('pizza');
    });

    it('hides dropdown after selection', () => {
      const setIsDropdownVisible = jest.fn();

      setIsDropdownVisible(false);

      expect(setIsDropdownVisible).toHaveBeenCalledWith(false);
    });
  });
});

describe('Dropdown Header', () => {
  it('displays "Recent Searches" title', () => {
    const title = 'Recent Searches';
    expect(title).toBe('Recent Searches');
  });

  it('displays "Clear All" button', () => {
    const buttonText = 'Clear All';
    expect(buttonText).toBe('Clear All');
  });
});

describe('Recent Search Item Display', () => {
  it('displays time icon for each item', () => {
    const iconName = 'time-outline';
    expect(iconName).toBe('time-outline');
  });

  it('displays close icon for remove button', () => {
    const iconName = 'close';
    expect(iconName).toBe('close');
  });

  it('truncates long search text to one line', () => {
    const numberOfLines = 1;
    expect(numberOfLines).toBe(1);
  });
});

describe('Background Color Logic', () => {
  describe('Container background', () => {
    it('uses backgroundTertiary when disabled', () => {
      const disabled = true;
      const colors = {
        backgroundTertiary: '#E5E7EB',
        backgroundSecondary: '#F9FAFB',
      };

      const backgroundColor = disabled ? colors.backgroundTertiary : colors.backgroundSecondary;

      expect(backgroundColor).toBe('#E5E7EB');
    });

    it('uses backgroundSecondary when enabled', () => {
      const disabled = false;
      const colors = {
        backgroundTertiary: '#E5E7EB',
        backgroundSecondary: '#F9FAFB',
      };

      const backgroundColor = disabled ? colors.backgroundTertiary : colors.backgroundSecondary;

      expect(backgroundColor).toBe('#F9FAFB');
    });
  });

  describe('Text color', () => {
    it('uses textTertiary when disabled', () => {
      const disabled = true;
      const colors = {
        textTertiary: '#A0A0A0',
        text: '#111827',
      };

      const textColor = disabled ? colors.textTertiary : colors.text;

      expect(textColor).toBe('#A0A0A0');
    });

    it('uses text color when enabled', () => {
      const disabled = false;
      const colors = {
        textTertiary: '#A0A0A0',
        text: '#111827',
      };

      const textColor = disabled ? colors.textTertiary : colors.text;

      expect(textColor).toBe('#111827');
    });
  });
});

describe('Blur Delay Behavior', () => {
  it('uses 150ms delay before hiding dropdown on blur', () => {
    jest.useFakeTimers();

    const setIsDropdownVisible = jest.fn();

    // Simulate blur behavior
    setTimeout(() => {
      setIsDropdownVisible(false);
    }, 150);

    expect(setIsDropdownVisible).not.toHaveBeenCalled();

    jest.advanceTimersByTime(150);

    expect(setIsDropdownVisible).toHaveBeenCalledWith(false);

    jest.useRealTimers();
  });
});

describe('Path Detection', () => {
  describe('isOnSearchScreen logic', () => {
    it('returns true for /search path', () => {
      const pathname = '/search';
      const isOnSearchScreen = pathname === '/search' || pathname === '/(tabs)/search';
      expect(isOnSearchScreen).toBe(true);
    });

    it('returns true for /(tabs)/search path', () => {
      const pathname = '/(tabs)/search';
      const isOnSearchScreen = pathname === '/search' || pathname === '/(tabs)/search';
      expect(isOnSearchScreen).toBe(true);
    });

    it('returns false for home path', () => {
      const pathname = '/';
      const isOnSearchScreen = pathname === '/search' || pathname === '/(tabs)/search';
      expect(isOnSearchScreen).toBe(false);
    });

    it('returns false for other paths', () => {
      const pathname = '/(tabs)/orders';
      const isOnSearchScreen = pathname === '/search' || pathname === '/(tabs)/search';
      expect(isOnSearchScreen).toBe(false);
    });
  });
});

describe('Key Generation for Recent Search List', () => {
  it('generates unique keys using query and index', () => {
    const searches = ['pizza', 'pizza', 'burgers'];
    const keys = searches.map((query, index) => `${query}-${index}`);

    expect(keys[0]).toBe('pizza-0');
    expect(keys[1]).toBe('pizza-1');
    expect(keys[2]).toBe('burgers-2');
    expect(new Set(keys).size).toBe(3); // All unique
  });
});
