module.exports = {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@react-native-async-storage/async-storage$': '<rootDir>/src/__mocks__/async-storage.js',
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': [
          'babel-jest',
          {
            presets: ['babel-preset-expo'],
          },
        ],
      },
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated)',
      ],
    },
    {
      displayName: 'components',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/__tests__/**/*.test.tsx'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@react-native-async-storage/async-storage$': '<rootDir>/src/__mocks__/async-storage.js',
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': [
          'babel-jest',
          {
            presets: ['babel-preset-expo'],
          },
        ],
      },
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated)',
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    },
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/__tests__/**'],
};
