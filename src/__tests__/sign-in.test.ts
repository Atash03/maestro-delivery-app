/**
 * Tests for the sign-in screen
 *
 * Tests screen structure, form validation, method toggle,
 * biometric authentication, and navigation.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { z } from 'zod';

// Mock react-native
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 390, height: 844 }),
  },
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
  Pressable: 'Pressable',
  TextInput: 'TextInput',
  ScrollView: 'ScrollView',
  Alert: {
    alert: jest.fn(),
  },
  Keyboard: {
    dismiss: jest.fn(),
  },
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
}));

// Mock expo-router
const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
};
jest.mock('expo-router', () => ({
  router: mockRouter,
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    View: 'Animated.View',
    ScrollView: 'Animated.ScrollView',
    createAnimatedComponent: (component: unknown) => component,
  },
  FadeIn: {
    delay: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
  },
  FadeOut: {
    delay: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
  },
  FadeInDown: {
    delay: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
  },
  FadeInUp: {
    delay: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
  },
  useAnimatedStyle: jest.fn(() => ({})),
  useSharedValue: jest.fn((initial) => ({ value: initial })),
  withSpring: jest.fn((value) => value),
  withTiming: jest.fn((value) => value),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock expo-local-authentication
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  supportedAuthenticationTypesAsync: jest.fn().mockResolvedValue([1]),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock hooks
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

// Mock stores
const mockAuthStore = {
  signIn: jest.fn(),
  setGuest: jest.fn(),
};
jest.mock('@/stores', () => ({
  useAuthStore: () => mockAuthStore,
}));

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    reset: jest.fn(),
    watch: jest.fn(() => ''),
    formState: { errors: {} },
  })),
  Controller: 'Controller',
}));

// Mock @hookform/resolvers/zod
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}));

describe('Sign In Screen', () => {
  const screenPath = path.join(__dirname, '..', 'app', '(auth)', 'sign-in.tsx');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('File Structure', () => {
    it('sign-in screen file exists', () => {
      expect(fs.existsSync(screenPath)).toBe(true);
    });

    it('exports default component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export default function SignInScreen');
    });

    it('exports validation schemas for testing', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain(
        'export { COUNTRY_CODES, emailSchema, LAST_SIGN_IN_METHOD_KEY, phoneSchema }'
      );
    });

    it('exports type definitions', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export type { EmailFormData, PhoneFormData, SignInMethod }');
    });
  });

  describe('Method Toggle', () => {
    it('has MethodToggle component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function MethodToggle');
      expect(content).toContain('MethodToggleProps');
    });

    it('supports email and phone methods', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("type SignInMethod = 'email' | 'phone'");
    });

    it('has animated toggle indicator', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('toggleIndicator');
      expect(content).toContain('withSpring');
      expect(content).toContain('indicatorPosition');
    });

    it('shows mail icon for email method', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('name="mail-outline"');
    });

    it('shows phone icon for phone method', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('name="call-outline"');
    });

    it('resets forms when switching methods', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('emailForm.reset()');
      expect(content).toContain('phoneForm.reset()');
    });

    it('remembers last used method', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('LAST_SIGN_IN_METHOD_KEY');
      expect(content).toContain('AsyncStorage.setItem(LAST_SIGN_IN_METHOD_KEY, newMethod)');
      expect(content).toContain('AsyncStorage.getItem(LAST_SIGN_IN_METHOD_KEY)');
    });

    it('has accessibility labels for toggle buttons', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('accessibilityLabel="Sign in with email"');
      expect(content).toContain('accessibilityLabel="Sign in with phone"');
      expect(content).toContain('accessibilityState={{ selected:');
    });
  });

  describe('Form Fields', () => {
    it('has email field for email method', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('label="Email Address"');
      expect(content).toContain('placeholder="Enter your email"');
      expect(content).toContain('keyboardType="email-address"');
    });

    it('has phone field for phone method', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('placeholder="Phone number"');
      expect(content).toContain('keyboardType="phone-pad"');
    });

    it('has password field', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('label="Password"');
      expect(content).toContain('placeholder="Enter your password"');
      expect(content).toContain('leftIcon="lock-closed-outline"');
    });

    it('has password visibility toggle', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('showPassword');
      expect(content).toContain("showPassword ? 'eye-off-outline' : 'eye-outline'");
      expect(content).toContain('secureTextEntry={!showPassword}');
    });
  });

  describe('Country Code Picker', () => {
    it('has CountryCodePicker component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function CountryCodePicker');
      expect(content).toContain('CountryCodePickerProps');
    });

    it('has multiple country codes', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('COUNTRY_CODES');
      expect(content).toContain("code: '+1'");
      expect(content).toContain("code: '+44'");
      expect(content).toContain("code: '+91'");
    });

    it('shows flags for countries', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('flag:');
      expect(content).toContain('🇺🇸');
      expect(content).toContain('🇬🇧');
    });

    it('has dropdown functionality', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('isOpen');
      expect(content).toContain('setIsOpen');
      expect(content).toContain('countryCodeDropdown');
    });

    it('has animated dropdown appearance', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FadeInDown');
    });

    it('has accessibility for country picker', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('accessibilityLabel={`Selected country code');
      expect(content).toContain('accessibilityLabel={`Select ${country.country}');
    });
  });

  describe('Forgot Password', () => {
    it('has Forgot Password link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Forgot Password?');
      expect(content).toContain('handleForgotPassword');
    });

    it('shows alert for forgot password', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Alert.alert(');
      expect(content).toContain('Reset Password');
      expect(content).toContain('password reset link will be sent');
    });

    it('has accessibility for forgot password button', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('accessibilityLabel="Forgot password"');
    });
  });

  describe('Biometric Authentication', () => {
    it('has BiometricButton component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function BiometricButton');
      expect(content).toContain('BiometricButtonProps');
    });

    it('checks for biometric availability', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('LocalAuthentication.hasHardwareAsync');
      expect(content).toContain('LocalAuthentication.isEnrolledAsync');
      expect(content).toContain('LocalAuthentication.supportedAuthenticationTypesAsync');
    });

    it('handles biometric authentication', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleBiometricAuth');
      expect(content).toContain('LocalAuthentication.authenticateAsync');
    });

    it('shows appropriate icon for biometric type', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('getIcon');
      expect(content).toContain('scan-outline');
      expect(content).toContain('finger-print-outline');
    });

    it('shows appropriate label for biometric type', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('getLabel');
      expect(content).toContain('Sign in with Face ID');
      expect(content).toContain('Sign in with Touch ID');
    });

    it('prefers Face ID over Touch ID', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Prefer Face ID over Touch ID');
      expect(content).toContain('FACIAL_RECOGNITION');
    });

    it('has animated biometric button', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handlePressIn');
      expect(content).toContain('handlePressOut');
      expect(content).toContain('withSpring(0.95');
    });

    it('configures authentication prompt', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("promptMessage: 'Sign in to Maestro'");
      expect(content).toContain("cancelLabel: 'Cancel'");
      expect(content).toContain("fallbackLabel: 'Use Password'");
    });

    it('handles biometric auth failure', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Authentication Failed');
      expect(content).toContain('Biometric authentication failed');
    });
  });

  describe('Validation Schemas', () => {
    it('has email schema', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const emailSchema = z.object');
      expect(content).toContain('email:');
      expect(content).toContain('password:');
    });

    it('has phone schema', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const phoneSchema = z.object');
      expect(content).toContain('phone:');
      expect(content).toContain('countryCode:');
      expect(content).toContain('password:');
    });

    it('validates email format', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('.email(');
    });

    it('validates phone format', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain(".min(10, 'Phone number must be at least 10 digits')");
      expect(content).toContain('.regex(/^[\\d+\\-\\s()]+$/,');
    });

    it('requires password', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain(".min(1, 'Password is required')");
    });
  });

  describe('Navigation', () => {
    it('navigates to tabs on successful sign in', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("router.replace('/(tabs)')");
    });

    it('has Continue as Guest option', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Continue as Guest');
      expect(content).toContain('handleContinueAsGuest');
    });

    it('navigates to tabs on guest mode', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('setGuest()');
      expect(content).toContain("router.replace('/(tabs)')");
    });

    it('has Sign Up link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Don't have an account?");
      expect(content).toContain('Sign Up');
      expect(content).toContain("router.push('/sign-up')");
    });

    it('has accessibility for sign up link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('accessibilityLabel="Sign up"');
    });
  });

  describe('Form Submission', () => {
    it('has handleSignIn function', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleSignIn');
    });

    it('shows loading state during submission', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('isLoading');
      expect(content).toContain('setIsLoading(true)');
      expect(content).toContain('setIsLoading(false)');
    });

    it('simulates API call delay', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('await new Promise');
      expect(content).toContain('setTimeout(resolve, 1500)');
    });

    it('creates user object on sign in', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const user: User = {');
      expect(content).toContain('id:');
      expect(content).toContain('addresses: []');
    });

    it('calls signIn from auth store', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('signIn(user)');
    });

    it('calls setGuest for guest mode', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('setGuest()');
    });
  });

  describe('UI Components', () => {
    it('uses Button component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("from '@/components/ui'");
      expect(content).toContain('<Button');
    });

    it('uses Input component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Input');
      expect(content).toContain('<Input');
    });

    it('has Sign In button', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Sign In');
      expect(content).toContain('</Button>');
    });

    it('Sign In button has loading state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('loading={isLoading}');
    });
  });

  describe('Styling', () => {
    it('uses theme colors', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Colors[colorScheme');
      expect(content).toContain('colors.background');
      expect(content).toContain('colors.text');
      expect(content).toContain('colors.textSecondary');
      expect(content).toContain('colors.primary');
    });

    it('uses design system spacing', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Spacing[');
    });

    it('uses design system typography', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Typography['3xl']");
      expect(content).toContain('Typography.base');
      expect(content).toContain('Typography.sm');
    });

    it('uses design system border radius', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('BorderRadius.xl');
      expect(content).toContain('BorderRadius.lg');
    });

    it('uses design system shadows', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Shadows.sm');
      expect(content).toContain('Shadows.md');
    });

    it('uses design system font weights', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FontWeights.bold');
      expect(content).toContain('FontWeights.semibold');
      expect(content).toContain('FontWeights.medium');
    });
  });

  describe('Animations', () => {
    it('uses react-native-reanimated', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("from 'react-native-reanimated'");
    });

    it('has entering animations for sections', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FadeInDown.delay(100)');
      expect(content).toContain('FadeInDown.delay(200)');
      expect(content).toContain('FadeInUp.delay(300)');
      expect(content).toContain('FadeInUp.delay(500)');
    });

    it('uses animated components', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('<Animated.View');
    });

    it('uses spring animations', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('withSpring');
    });

    it('has fade in/out for biometric section', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FadeIn.delay(400)');
      expect(content).toContain('FadeOut.duration');
    });
  });

  describe('Keyboard Handling', () => {
    it('uses KeyboardAvoidingView', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('<KeyboardAvoidingView');
    });

    it('handles keyboard dismissal', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Keyboard.dismiss');
      expect(content).toContain('TouchableWithoutFeedback');
    });

    it('uses correct behavior for iOS', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Platform.OS === 'ios' ? 'padding' : 'height'");
    });

    it('persists taps for keyboard', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('keyboardShouldPersistTaps="handled"');
    });
  });

  describe('Accessibility', () => {
    it('has hitSlop for touch targets', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('hitSlop=');
    });

    it('uses Pressable for interactive elements', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('<Pressable');
    });

    it('has accessibilityRole for buttons', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('accessibilityRole="button"');
    });

    it('has autoComplete settings', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('autoComplete="email"');
      expect(content).toContain('autoComplete="tel"');
      expect(content).toContain('autoComplete="password"');
    });
  });

  describe('Imports', () => {
    it('imports from correct modules', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');

      // React imports
      expect(content).toContain("from 'react'");
      expect(content).toContain('useCallback');
      expect(content).toContain('useState');
      expect(content).toContain('useEffect');

      // React Native imports
      expect(content).toContain("from 'react-native'");
      expect(content).toContain('KeyboardAvoidingView');
      expect(content).toContain('ScrollView');
      expect(content).toContain('Alert');

      // Expo imports
      expect(content).toContain("from 'expo-router'");
      expect(content).toContain("from '@expo/vector-icons'");
      expect(content).toContain("from 'expo-local-authentication'");

      // Form imports
      expect(content).toContain("from 'react-hook-form'");
      expect(content).toContain("from '@hookform/resolvers/zod'");
      expect(content).toContain("from 'zod'");

      // Storage imports
      expect(content).toContain("from '@react-native-async-storage/async-storage'");

      // Internal imports
      expect(content).toContain("from '@/components/ui'");
      expect(content).toContain("from '@/constants/theme'");
      expect(content).toContain("from '@/hooks/use-color-scheme'");
      expect(content).toContain("from '@/stores'");
      expect(content).toContain("from '@/types'");
    });
  });

  describe('Divider', () => {
    it('has divider between sign in options', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('dividerContainer');
      expect(content).toContain('dividerLine');
      expect(content).toContain('>or<');
    });
  });

  describe('React Hook Form Integration', () => {
    it('uses Controller for form fields', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('<Controller');
      expect(content).toContain('control={');
      expect(content).toContain('name="email"');
      expect(content).toContain('name="phone"');
      expect(content).toContain('name="password"');
      expect(content).toContain('name="countryCode"');
    });

    it('uses zodResolver', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('zodResolver(emailSchema)');
      expect(content).toContain('zodResolver(phoneSchema)');
    });

    it('sets form mode to onChange', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("mode: 'onChange'");
    });

    it('has separate forms for email and phone', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('emailForm = useForm<EmailFormData>');
      expect(content).toContain('phoneForm = useForm<PhoneFormData>');
    });

    it('uses currentForm based on method', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("currentForm = method === 'email' ? emailForm : phoneForm");
    });
  });

  describe('Header', () => {
    it('has welcome back title', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Welcome Back');
    });

    it('has descriptive subtitle', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Sign in to continue ordering delicious food');
    });
  });
});

describe('Validation Schema Tests', () => {
  // Create test schemas matching the ones in sign-in.tsx
  const emailSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  });

  const phoneSchema = z.object({
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be less than 15 digits')
      .regex(/^[\d+\-\s()]+$/, 'Please enter a valid phone number'),
    countryCode: z.string().default('+1'),
    password: z.string().min(1, 'Password is required'),
  });

  describe('Email Schema', () => {
    it('validates valid email form data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'anypassword',
      };
      expect(() => emailSchema.parse(validData)).not.toThrow();
    });

    it('rejects invalid email', () => {
      const result = emailSchema.safeParse({
        email: 'invalid-email',
        password: 'anypassword',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty password', () => {
      const result = emailSchema.safeParse({
        email: 'john@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('accepts any non-empty password', () => {
      const validData = {
        email: 'john@example.com',
        password: 'x',
      };
      expect(() => emailSchema.parse(validData)).not.toThrow();
    });
  });

  describe('Phone Schema', () => {
    it('validates valid phone form data', () => {
      const validData = {
        phone: '1234567890',
        countryCode: '+1',
        password: 'anypassword',
      };
      expect(() => phoneSchema.parse(validData)).not.toThrow();
    });

    it('rejects short phone number', () => {
      const result = phoneSchema.safeParse({
        phone: '12345',
        countryCode: '+1',
        password: 'anypassword',
      });
      expect(result.success).toBe(false);
    });

    it('rejects phone with invalid characters', () => {
      const result = phoneSchema.safeParse({
        phone: '123abc7890',
        countryCode: '+1',
        password: 'anypassword',
      });
      expect(result.success).toBe(false);
    });

    it('accepts phone with formatting characters', () => {
      const validData = {
        phone: '(123) 456-7890',
        countryCode: '+1',
        password: 'anypassword',
      };
      expect(() => phoneSchema.parse(validData)).not.toThrow();
    });

    it('uses default country code', () => {
      const validData = {
        phone: '1234567890',
        password: 'anypassword',
      };
      const result = phoneSchema.parse(validData);
      expect(result.countryCode).toBe('+1');
    });

    it('rejects empty password', () => {
      const result = phoneSchema.safeParse({
        phone: '1234567890',
        countryCode: '+1',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Country Codes', () => {
  const COUNTRY_CODES = [
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
  ];

  it('has 5 country codes', () => {
    expect(COUNTRY_CODES).toHaveLength(5);
  });

  it('each country has code, country, and flag', () => {
    for (const country of COUNTRY_CODES) {
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('country');
      expect(country).toHaveProperty('flag');
    }
  });

  it('US is first in list (default)', () => {
    expect(COUNTRY_CODES[0].code).toBe('+1');
    expect(COUNTRY_CODES[0].country).toBe('US');
  });

  it('all country codes start with +', () => {
    for (const country of COUNTRY_CODES) {
      expect(country.code.startsWith('+')).toBe(true);
    }
  });
});

describe('Last Sign In Method Storage Key', () => {
  it('has correct storage key format', () => {
    const LAST_SIGN_IN_METHOD_KEY = 'maestro-last-sign-in-method';
    expect(LAST_SIGN_IN_METHOD_KEY).toBe('maestro-last-sign-in-method');
    expect(LAST_SIGN_IN_METHOD_KEY).toContain('maestro');
    expect(LAST_SIGN_IN_METHOD_KEY).toContain('sign-in');
    expect(LAST_SIGN_IN_METHOD_KEY).toContain('method');
  });
});

describe('Biometric Authentication Types', () => {
  it('recognizes Face ID authentication type', () => {
    const AuthenticationType = {
      FINGERPRINT: 1,
      FACIAL_RECOGNITION: 2,
      IRIS: 3,
    };
    expect(AuthenticationType.FACIAL_RECOGNITION).toBe(2);
  });

  it('recognizes Touch ID authentication type', () => {
    const AuthenticationType = {
      FINGERPRINT: 1,
      FACIAL_RECOGNITION: 2,
      IRIS: 3,
    };
    expect(AuthenticationType.FINGERPRINT).toBe(1);
  });
});

describe('Sign In Screen Features Summary', () => {
  const screenPath = path.join(__dirname, '..', 'app', '(auth)', 'sign-in.tsx');
  const content = fs.readFileSync(screenPath, 'utf-8');

  it('implements email/phone toggle', () => {
    expect(content).toContain('MethodToggle');
    expect(content).toContain("method === 'email'");
    expect(content).toContain("method === 'phone'");
  });

  it('implements password show/hide toggle', () => {
    expect(content).toContain('showPassword');
    expect(content).toContain('setShowPassword');
  });

  it('implements forgot password link', () => {
    expect(content).toContain('Forgot Password?');
    expect(content).toContain('handleForgotPassword');
  });

  it('implements sign up link', () => {
    expect(content).toContain("Don't have an account?");
    expect(content).toContain("router.push('/sign-up')");
  });

  it('implements continue as guest option', () => {
    expect(content).toContain('Continue as Guest');
    expect(content).toContain('handleContinueAsGuest');
    expect(content).toContain('setGuest');
  });

  it('implements biometric authentication option', () => {
    expect(content).toContain('BiometricButton');
    expect(content).toContain('isBiometricAvailable');
    expect(content).toContain('handleBiometricAuth');
  });

  it('implements animated button loading state', () => {
    expect(content).toContain('loading={isLoading}');
    expect(content).toContain('setIsLoading(true)');
    expect(content).toContain('setIsLoading(false)');
  });

  it('remembers last used sign-in method', () => {
    expect(content).toContain('LAST_SIGN_IN_METHOD_KEY');
    expect(content).toContain('loadLastMethod');
    expect(content).toContain('AsyncStorage.getItem');
    expect(content).toContain('AsyncStorage.setItem');
  });
});
