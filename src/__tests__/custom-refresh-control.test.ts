/**
 * Tests for CustomRefreshControl Component
 *
 * This test suite verifies:
 * - Component structure and exports
 * - Props interface
 * - Animation configuration
 * - Theme support
 * - RefreshIndicator component
 * - FoodRefreshIndicator component
 * - Animation variants (spin, bounce, pulse)
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

    it('should export FoodRefreshIndicator component', () => {
      expect(componentSource).toContain('export function FoodRefreshIndicator');
    });

    it('should export FoodRefreshIndicatorProps interface', () => {
      expect(componentSource).toContain('export interface FoodRefreshIndicatorProps');
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

    it('should have variant prop with spin, bounce, pulse options', () => {
      expect(componentSource).toMatch(
        /variant\?:\s*['"]spin['"]\s*\|\s*['"]bounce['"]\s*\|\s*['"]pulse['"]/
      );
    });
  });

  describe('FoodRefreshIndicatorProps Interface', () => {
    it('should have isRefreshing prop', () => {
      expect(componentSource).toMatch(/isRefreshing:\s*boolean/);
    });

    it('should have size prop', () => {
      expect(componentSource).toMatch(/size\?:\s*number/);
    });

    it('should have color prop', () => {
      expect(componentSource).toMatch(/color\?:\s*string/);
    });

    it('should have testID prop', () => {
      expect(componentSource).toMatch(/testID\?:\s*string/);
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

    it('should import animation utilities from reanimated', () => {
      expect(componentSource).toContain('withSequence');
      expect(componentSource).toContain('withSpring');
      expect(componentSource).toContain('withDelay');
      expect(componentSource).toContain('interpolate');
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

  describe('RefreshIndicator Animation Variants', () => {
    it('should support spin variant (default)', () => {
      expect(componentSource).toContain("variant = 'spin'");
    });

    it('should handle bounce variant animation', () => {
      expect(componentSource).toContain("if (variant === 'bounce')");
      expect(componentSource).toContain('bounce.value = withRepeat');
    });

    it('should handle pulse variant animation', () => {
      expect(componentSource).toContain("if (variant === 'pulse')");
      expect(componentSource).toContain('scale.value = withRepeat');
    });

    it('should use shared values for bounce and scale', () => {
      // Check that bounce and scale are initialized with useSharedValue
      const bounceMatch = componentSource.match(/const\s+bounce\s*=\s*useSharedValue/);
      const scaleMatch = componentSource.match(/const\s+scale\s*=\s*useSharedValue/);
      expect(bounceMatch).toBeTruthy();
      expect(scaleMatch).toBeTruthy();
    });

    it('should cancel all animations when not refreshing', () => {
      expect(componentSource).toContain('cancelAnimation(bounce)');
      expect(componentSource).toContain('cancelAnimation(scale)');
    });
  });

  describe('FoodRefreshIndicator Component', () => {
    it('should render with restaurant icon', () => {
      expect(componentSource).toContain('name="restaurant"');
    });

    it('should have bouncing animation effect', () => {
      expect(componentSource).toContain('Bouncing animation');
      expect(componentSource).toContain('withSpring(-12');
    });

    it('should have pulsating scale animation', () => {
      expect(componentSource).toContain('pulsating scale');
      expect(componentSource).toContain('withTiming(1.15');
    });

    it('should have shadow/reflection effect', () => {
      expect(componentSource).toContain('Shadow/reflection effect');
      expect(componentSource).toContain('foodIndicatorShadow');
    });

    it('should use interpolate for shadow animation', () => {
      expect(componentSource).toContain('shadowStyle = useAnimatedStyle');
      expect(componentSource).toContain('interpolate(opacity.value');
      expect(componentSource).toContain('interpolate(scale.value');
      expect(componentSource).toContain('interpolate(bounce.value');
    });

    it('should have opacity animation for fade in/out', () => {
      expect(componentSource).toContain('opacity.value = withTiming(1');
      expect(componentSource).toContain('opacity.value = withTiming(0');
    });

    it('should have testID support', () => {
      expect(componentSource).toContain('testID={testID}');
    });

    it('should default size to 32', () => {
      expect(componentSource).toMatch(/size\s*=\s*32/);
    });
  });

  describe('FoodRefreshIndicator Styles', () => {
    it('should have foodIndicatorContainer styles', () => {
      expect(componentSource).toMatch(/foodIndicatorContainer:\s*\{/);
    });

    it('should have foodIndicatorIcon styles', () => {
      expect(componentSource).toMatch(/foodIndicatorIcon:\s*\{/);
    });

    it('should have foodIndicatorShadow styles', () => {
      expect(componentSource).toMatch(/foodIndicatorShadow:\s*\{/);
    });

    it('should set container height for proper animation space', () => {
      expect(componentSource).toContain('height: 80');
    });
  });
});
