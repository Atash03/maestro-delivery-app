/**
 * Jest setup file for component tests
 */

// Define __DEV__ before any imports
global.__DEV__ = true;

// Mock react-native Platform module before tests
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (obj) => obj.ios ?? obj.default,
  Version: 14,
  isPad: false,
  isTesting: true,
  isTV: false,
  constants: {
    reactNativeVersion: {
      major: 0,
      minor: 81,
      patch: 5,
    },
  },
}));

// Mock expo modules that cause issues
jest.mock('expo-font', () => ({}));
jest.mock('expo-asset', () => ({}));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
    Soft: 'soft',
    Rigid: 'rigid',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));
jest.mock('@/utils/haptics', () => ({
  isHapticsSupported: () => true,
  triggerHaptic: jest.fn().mockResolvedValue(undefined),
  HapticFeedbackType: {
    light: 'light',
    medium: 'medium',
    heavy: 'heavy',
    soft: 'soft',
    rigid: 'rigid',
    selection: 'selection',
    success: 'success',
    error: 'error',
    warning: 'warning',
  },
  haptics: {
    buttonPress: jest.fn().mockResolvedValue(undefined),
    tabSwitch: jest.fn().mockResolvedValue(undefined),
    addToCart: jest.fn().mockResolvedValue(undefined),
    formSubmit: jest.fn().mockResolvedValue(undefined),
    error: jest.fn().mockResolvedValue(undefined),
    warning: jest.fn().mockResolvedValue(undefined),
    importantAction: jest.fn().mockResolvedValue(undefined),
    toggle: jest.fn().mockResolvedValue(undefined),
    select: jest.fn().mockResolvedValue(undefined),
    confirm: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const MockIcon = (props) => React.createElement('View', props);
  return {
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
    FontAwesome: MockIcon,
    createIconSet: () => MockIcon,
  };
});

// Silence console warnings during tests
// biome-ignore lint/suspicious/noConsole: necessary for test setup
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Animated:') || args[0].includes('componentWillReceiveProps'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
