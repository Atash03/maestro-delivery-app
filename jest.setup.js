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
