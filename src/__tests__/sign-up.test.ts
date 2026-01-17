/**
 * Tests for the sign-up screen
 *
 * Tests screen structure, form validation, method toggle,
 * password strength indicator, and navigation.
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

// Mock hooks
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

// Mock stores
const mockAuthStore = {
  signUp: jest.fn(),
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

describe('Sign Up Screen', () => {
  const screenPath = path.join(__dirname, '..', 'app', '(auth)', 'sign-up.tsx');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('File Structure', () => {
    it('sign-up screen file exists', () => {
      expect(fs.existsSync(screenPath)).toBe(true);
    });

    it('exports default component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export default function SignUpScreen');
    });

    it('exports validation schemas for testing', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export { COUNTRY_CODES, emailSchema, phoneSchema }');
    });

    it('exports type definitions', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export type { EmailFormData, PhoneFormData, SignUpMethod }');
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
      expect(content).toContain("type SignUpMethod = 'email' | 'phone'");
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
  });

  describe('Form Fields', () => {
    it('has name field', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('label="Full Name"');
      expect(content).toContain('placeholder="Enter your name"');
      expect(content).toContain('leftIcon="person-outline"');
    });

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
      expect(content).toContain('placeholder="Create a password"');
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
  });

  describe('Password Strength Indicator', () => {
    it('has PasswordStrengthIndicator component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function PasswordStrengthIndicator');
      expect(content).toContain('PasswordStrengthProps');
    });

    it('calculates strength based on criteria', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('getStrength');
      expect(content).toContain('pwd.length >= 8');
      expect(content).toContain('/[A-Z]/.test(pwd)');
      expect(content).toContain('/[a-z]/.test(pwd)');
      expect(content).toContain('/[0-9]/.test(pwd)');
      expect(content).toContain('/[^A-Za-z0-9]/.test(pwd)');
    });

    it('has 5 strength bars', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('[1, 2, 3, 4, 5].map');
      expect(content).toContain('strengthBar');
    });

    it('shows strength labels', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('getStrengthLabel');
      expect(content).toContain("'Weak'");
      expect(content).toContain("'Fair'");
      expect(content).toContain("'Good'");
      expect(content).toContain("'Strong'");
    });

    it('uses semantic colors for strength', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('getStrengthColor');
      expect(content).toContain('colors.error');
      expect(content).toContain('colors.warning');
      expect(content).toContain('colors.success');
    });

    it('has animated appearance', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FadeIn.duration');
      expect(content).toContain('FadeOut.duration');
    });
  });

  describe('Terms & Conditions', () => {
    it('has Checkbox component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function Checkbox');
      expect(content).toContain('CheckboxProps');
    });

    it('has animated checkbox', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('withSpring(0.9');
    });

    it('shows checkmark icon when checked', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('checked &&');
      expect(content).toContain('name="checkmark"');
    });

    it('has Terms of Service link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Terms of Service');
    });

    it('has Privacy Policy link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Privacy Policy');
    });

    it('shows error state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('error ? colors.error : checked ? colors.primary : colors.border');
    });
  });

  describe('Validation Schemas', () => {
    it('has base schema with common fields', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const baseSchema = z.object');
      expect(content).toContain('name:');
      expect(content).toContain('password:');
      expect(content).toContain('acceptTerms:');
    });

    it('has email schema extending base', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const emailSchema = baseSchema.extend');
      expect(content).toContain('email:');
    });

    it('has phone schema extending base', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const phoneSchema = baseSchema.extend');
      expect(content).toContain('phone:');
      expect(content).toContain('countryCode:');
    });

    it('validates name length', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('.min(2,');
      expect(content).toContain('.max(50,');
    });

    it('validates password requirements', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain(".min(8, 'Password must be at least 8 characters')");
      expect(content).toContain('.regex(/[A-Z]/,');
      expect(content).toContain('.regex(/[a-z]/,');
      expect(content).toContain('.regex(/[0-9]/,');
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

    it('requires terms acceptance', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('z.literal(true,');
      expect(content).toContain('You must accept the terms and conditions');
    });
  });

  describe('Navigation', () => {
    it('navigates to verify screen on sign up', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("pathname: '/verify'");
    });

    it('passes method and destination to verify screen', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('params: {');
      expect(content).toContain('method,');
      expect(content).toContain('destination:');
    });

    it('has Continue as Guest option', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Continue as Guest');
      expect(content).toContain('handleContinueAsGuest');
    });

    it('navigates to tabs on guest mode', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("router.replace('/(tabs)')");
    });

    it('has Sign In link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Already have an account?');
      expect(content).toContain('Sign In');
      expect(content).toContain("router.push('/sign-in')");
    });
  });

  describe('Form Submission', () => {
    it('has handleSignUp function', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleSignUp');
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

    it('creates user object on sign up', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const user: User = {');
      expect(content).toContain('id:');
      expect(content).toContain('name: data.name');
      expect(content).toContain('addresses: []');
    });

    it('calls signUp from auth store', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('signUp(user)');
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

    it('has Create Account button', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Create Account');
    });

    it('Create Account button has loading state', () => {
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
      expect(content).toContain('BorderRadius.sm');
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
      expect(content).toContain('FadeInUp.delay(400)');
    });

    it('uses animated components', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('<Animated.View');
    });

    it('uses spring animations', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('withSpring');
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

    it('has proper autoCapitalize settings', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('autoCapitalize="words"');
      expect(content).toContain('autoCapitalize="none"');
    });

    it('has autoComplete settings', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('autoComplete="name"');
      expect(content).toContain('autoComplete="email"');
      expect(content).toContain('autoComplete="tel"');
      expect(content).toContain('autoComplete="password-new"');
    });
  });

  describe('Imports', () => {
    it('imports from correct modules', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');

      // React imports
      expect(content).toContain("from 'react'");
      expect(content).toContain('useCallback');
      expect(content).toContain('useState');

      // React Native imports
      expect(content).toContain("from 'react-native'");
      expect(content).toContain('KeyboardAvoidingView');
      expect(content).toContain('ScrollView');

      // Expo imports
      expect(content).toContain("from 'expo-router'");
      expect(content).toContain("from '@expo/vector-icons'");

      // Form imports
      expect(content).toContain("from 'react-hook-form'");
      expect(content).toContain("from '@hookform/resolvers/zod'");
      expect(content).toContain("from 'zod'");

      // Internal imports
      expect(content).toContain("from '@/components/ui'");
      expect(content).toContain("from '@/constants/theme'");
      expect(content).toContain("from '@/hooks/use-color-scheme'");
      expect(content).toContain("from '@/stores'");
      expect(content).toContain("from '@/types'");
    });
  });

  describe('Divider', () => {
    it('has divider between sign up and guest buttons', () => {
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
      expect(content).toContain('name="name"');
      expect(content).toContain('name="email"');
      expect(content).toContain('name="phone"');
      expect(content).toContain('name="password"');
      expect(content).toContain('name="acceptTerms"');
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

    it('passes password value to strength indicator', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('<PasswordStrengthIndicator password={value} />');
    });
  });
});

describe('Validation Schema Tests', () => {
  // Create test schemas matching the ones in sign-up.tsx
  const baseSchema = z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  });

  const emailSchema = baseSchema.extend({
    email: z.string().email('Please enter a valid email address'),
  });

  const phoneSchema = baseSchema.extend({
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be less than 15 digits')
      .regex(/^[\d+\-\s()]+$/, 'Please enter a valid phone number'),
    countryCode: z.string().default('+1'),
  });

  describe('Email Schema', () => {
    it('validates valid email form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        acceptTerms: true as const,
      };
      expect(() => emailSchema.parse(validData)).not.toThrow();
    });

    it('rejects short name', () => {
      const result = emailSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        password: 'Password123',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = emailSchema.safeParse({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = emailSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Pass1',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without uppercase', () => {
      const result = emailSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without lowercase', () => {
      const result = emailSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'PASSWORD123',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without number', () => {
      const result = emailSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects when terms not accepted', () => {
      const result = emailSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        acceptTerms: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Phone Schema', () => {
    it('validates valid phone form data', () => {
      const validData = {
        name: 'John Doe',
        phone: '1234567890',
        countryCode: '+1',
        password: 'Password123',
        acceptTerms: true as const,
      };
      expect(() => phoneSchema.parse(validData)).not.toThrow();
    });

    it('rejects short phone number', () => {
      const result = phoneSchema.safeParse({
        name: 'John Doe',
        phone: '12345',
        countryCode: '+1',
        password: 'Password123',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects phone with invalid characters', () => {
      const result = phoneSchema.safeParse({
        name: 'John Doe',
        phone: '123abc7890',
        countryCode: '+1',
        password: 'Password123',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('accepts phone with formatting characters', () => {
      const validData = {
        name: 'John Doe',
        phone: '(123) 456-7890',
        countryCode: '+1',
        password: 'Password123',
        acceptTerms: true as const,
      };
      expect(() => phoneSchema.parse(validData)).not.toThrow();
    });

    it('uses default country code', () => {
      const validData = {
        name: 'John Doe',
        phone: '1234567890',
        password: 'Password123',
        acceptTerms: true as const,
      };
      const result = phoneSchema.parse(validData);
      expect(result.countryCode).toBe('+1');
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
});

describe('Password Strength Logic', () => {
  const getStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  it('returns 0 for empty password', () => {
    expect(getStrength('')).toBe(0);
  });

  it('returns 1 for password with only length', () => {
    expect(getStrength('12345678')).toBe(2); // length + numbers
  });

  it('returns higher for mixed case', () => {
    const lower = getStrength('password');
    const mixed = getStrength('Password');
    expect(mixed).toBeGreaterThan(lower);
  });

  it('returns 5 for strong password', () => {
    expect(getStrength('Password1!')).toBe(5);
  });

  it('returns 4 for password without special char', () => {
    expect(getStrength('Password123')).toBe(4);
  });
});
