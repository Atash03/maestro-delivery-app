/**
 * Mock implementation of @react-native-async-storage/async-storage for testing
 */

let storage: Record<string, string> = {};

const AsyncStorage = {
  setItem: jest.fn((key: string, value: string) => {
    storage[key] = value;
    return Promise.resolve();
  }),
  getItem: jest.fn((key: string) => {
    return Promise.resolve(storage[key] || null);
  }),
  removeItem: jest.fn((key: string) => {
    delete storage[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    storage = {};
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve(Object.keys(storage));
  }),
  multiGet: jest.fn((keys: string[]) => {
    return Promise.resolve(keys.map((key) => [key, storage[key] || null]));
  }),
  multiSet: jest.fn((keyValuePairs: [string, string][]) => {
    keyValuePairs.forEach(([key, value]) => {
      storage[key] = value;
    });
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys: string[]) => {
    keys.forEach((key) => {
      delete storage[key];
    });
    return Promise.resolve();
  }),
};

/**
 * Reset storage and clear all mocks - call in beforeEach
 */
export function resetMockStorage(): void {
  storage = {};
  AsyncStorage.setItem.mockClear();
  AsyncStorage.getItem.mockClear();
  AsyncStorage.removeItem.mockClear();
  AsyncStorage.clear.mockClear();
  AsyncStorage.getAllKeys.mockClear();
  AsyncStorage.multiGet.mockClear();
  AsyncStorage.multiSet.mockClear();
  AsyncStorage.multiRemove.mockClear();
}

export default AsyncStorage;
