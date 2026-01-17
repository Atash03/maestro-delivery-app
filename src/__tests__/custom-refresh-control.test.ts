/**
 * Tests for CustomRefreshControl Component
 *
 * This test suite verifies:
 * - Component structure and exports
 * - Props interface
 * - Animation configuration
 * - Theme support
 * - RefreshIndicator component
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Read the component source file
const componentPath = resolve(__dirname, '../components/custom-refresh-control.tsx');
const componentSource = readFileSync(componentPath, 'utf-8');

describe('CustomRefreshControl Component', () => {
  describe('File Structure', () => {
    it('should export CustomRefreshControl component', () => {
      expect(componentSource).toContain('export function CustomRefreshControl');
    });

    it('should export CustomRefreshControlProps interface', () => {
      expect(componentSource).toContain('export interface CustomRefreshControlProps');
    });

    it('should export RefreshIndicator component', () => {
      expect(componentSource).toContain('export function RefreshIndicator');
    });

    it('should export RefreshIndicatorProps interface', () => {
      expect(componentSource).toContain('export interface RefreshIndicatorProps');
    });
  });

  describe('CustomRefreshControlProps Interface', () => {
    it('should extend RefreshControlProps', () => {
      expect(componentSource).toMatch(/extends\s*Omit<RefreshControlProps/);
    });

    it('should have tintColor prop', () => {
      expect(componentSource).toMatch(/tintColor\?:\s*string/);
    });

    it('should have testID prop', () => {
      expect(componentSource).toMatch(/testID\?:\s*string/);
    });
  });

  describe('RefreshIndicatorProps Interface', () => {
    it('should have isRefreshing prop', () => {
      expect(componentSource).toMatch(/isRefreshing:\s*boolean/);
    });

    it('should have size prop', () => {
      expect(componentSource).toMatch(/size\?:\s*number/);
    });

    it('should have color prop', () => {
      expect(componentSource).toMatch(/color\?:\s*string/);
    });
  });

  describe('Imports', () => {
    it('should import RefreshControl from react-native', () => {
      expect(componentSource).toContain("from 'react-native'");
      expect(componentSource).toContain('RefreshControl');
    });

    it('should import react-native-reanimated for animations', () => {
      expect(componentSource).toContain("from 'react-native-reanimated'");
    });

    it('should import Ionicons for icons', () => {
      expect(componentSource).toContain("from '@expo/vector-icons'");
      expect(componentSource).toContain('Ionicons');
    });

    it('should import useColorScheme hook', () => {
      expect(componentSource).toContain('useColorScheme');
    });

    it('should import PrimaryColors from theme', () => {
      expect(componentSource).toContain('PrimaryColors');
    });
  });

  describe('Animation Configuration', () => {
    it('should use useSharedValue for rotation', () => {
      expect(componentSource).toContain('useSharedValue');
      expect(componentSource).toContain('rotation');
    });

    it('should use withRepeat for continuous animation', () => {
      expect(componentSource).toContain('withRepeat');
    });

    it('should use withTiming for rotation animation', () => {
      expect(componentSource).toContain('withTiming');
    });

    it('should rotate 360 degrees', () => {
      expect(componentSource).toContain('360');
    });

    it('should use Easing.linear for consistent rotation speed', () => {
      expect(componentSource).toContain('Easing.linear');
    });

    it('should use useAnimatedStyle for animated styles', () => {
      expect(componentSource).toContain('useAnimatedStyle');
    });

    it('should cancel animation when not refreshing', () => {
      expect(componentSource).toContain('cancelAnimation');
    });
  });

  describe('CustomRefreshControl Component', () => {
    it('should render RefreshControl component', () => {
      expect(componentSource).toContain('<RefreshControl');
    });

    it('should pass refreshing prop', () => {
      expect(componentSource).toMatch(/refreshing=\{refreshing\}/);
    });

    it('should pass onRefresh prop', () => {
      expect(componentSource).toMatch(/onRefresh=\{onRefresh\}/);
    });

    it('should use tintColor for iOS', () => {
      expect(componentSource).toMatch(/tintColor=\{refreshColor\}/);
    });

    it('should use colors array for Android', () => {
      expect(componentSource).toMatch(/colors=\{\[refreshColor\]\}/);
    });

    it('should set progressBackgroundColor from theme', () => {
      expect(componentSource).toMatch(/progressBackgroundColor=\{colors\.card\}/);
    });

    it('should pass testID prop', () => {
      expect(componentSource).toMatch(/testID=\{testID\}/);
    });

    it('should default to PrimaryColors[500] for refresh color', () => {
      expect(componentSource).toContain('PrimaryColors[500]');
    });
  });

  describe('RefreshIndicator Component', () => {
    it('should render Animated.View', () => {
      expect(componentSource).toContain('<Animated.View');
    });

    it('should render refresh icon', () => {
      expect(componentSource).toContain('name="refresh"');
    });

    it('should return null when not refreshing', () => {
      expect(componentSource).toContain('if (!isRefreshing) return null');
    });

    it('should default size to 24', () => {
      expect(componentSource).toMatch(/size\s*=\s*24/);
    });
  });

  describe('useEffect for Animation', () => {
    it('should have useEffect hook', () => {
      expect(componentSource).toContain('useEffect');
    });

    it('should check refreshing state in useEffect', () => {
      expect(componentSource).toMatch(/if\s*\(refreshing\)/);
    });

    it('should reset rotation to 0 when not refreshing', () => {
      expect(componentSource).toMatch(/rotation\.value\s*=\s*0/);
    });
  });

  describe('Styling', () => {
    it('should use StyleSheet.create', () => {
      expect(componentSource).toContain('StyleSheet.create');
    });

    it('should have indicatorContainer styles', () => {
      expect(componentSource).toMatch(/indicatorContainer:\s*\{/);
    });

    it('should center content in indicator container', () => {
      expect(componentSource).toContain("alignItems: 'center'");
      expect(componentSource).toContain("justifyContent: 'center'");
    });
  });

  describe('Theme Support', () => {
    it('should use useColorScheme hook', () => {
      expect(componentSource).toContain('useColorScheme');
    });

    it('should get colors from Colors constant', () => {
      expect(componentSource).toContain('Colors[colorScheme');
    });
  });
});
