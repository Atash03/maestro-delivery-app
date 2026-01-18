/**
 * Sign Up screen - Create a new account
 *
 * Features:
 * - Toggle between Email and Phone sign-up methods
 * - Form fields with validation using react-hook-form + zod
 * - Password strength indicator
 * - Terms & conditions checkbox
 * - "Continue as Guest" link
 * - Animated form field focus states
 */

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
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
import { useAuthStore } from '@/stores';
import type { User } from '@/types';
import { haptics } from '@/utils/haptics';

// ============================================================================
// Types
// ============================================================================

type SignUpMethod = 'email' | 'phone';

// ============================================================================
// Validation Schemas
// ============================================================================

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

type EmailFormData = z.infer<typeof emailSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;

// ============================================================================
// Password Strength Indicator
// ============================================================================

interface PasswordStrengthProps {
  password: string;
}

function PasswordStrengthIndicator({ password }: PasswordStrengthProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getStrength = useCallback((pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  }, []);

  const strength = getStrength(password);

  const getStrengthLabel = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 2) return colors.error;
    if (strength <= 3) return colors.warning;
    return colors.success;
  };

  if (!password) return null;

  return (
    <Animated.View
      style={styles.strengthContainer}
      entering={FadeIn.duration(AnimationDurations.fast)}
      exiting={FadeOut.duration(AnimationDurations.fast)}
    >
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4, 5].map((level) => (
          <View
            key={level}
            style={[
              styles.strengthBar,
              {
                backgroundColor: strength >= level ? getStrengthColor() : colors.border,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: getStrengthColor() }]}>
        {getStrengthLabel()}
      </Text>
    </Animated.View>
  );
}

// ============================================================================
// Method Toggle
// ============================================================================

interface MethodToggleProps {
  method: SignUpMethod;
  onMethodChange: (method: SignUpMethod) => void;
}

function MethodToggle({ method, onMethodChange }: MethodToggleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const indicatorPosition = useSharedValue(method === 'email' ? 0 : 1);

  const handleMethodChange = useCallback(
    (newMethod: SignUpMethod) => {
      indicatorPosition.value = withSpring(newMethod === 'email' ? 0 : 1, {
        damping: 20,
        stiffness: 300,
      });
      onMethodChange(newMethod);
    },
    [indicatorPosition, onMethodChange]
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value * 140 }],
  }));

  return (
    <View style={[styles.toggleContainer, { backgroundColor: colors.backgroundSecondary }]}>
      <Animated.View
        style={[
          styles.toggleIndicator,
          { backgroundColor: colors.background },
          Shadows.sm,
          indicatorStyle,
        ]}
      />
      <Pressable style={styles.toggleButton} onPress={() => handleMethodChange('email')}>
        <Ionicons
          name="mail-outline"
          size={18}
          color={method === 'email' ? colors.primary : colors.textSecondary}
          style={styles.toggleIcon}
        />
        <Text
          style={[
            styles.toggleText,
            {
              color: method === 'email' ? colors.primary : colors.textSecondary,
              fontWeight: method === 'email' ? FontWeights.semibold : FontWeights.normal,
            },
          ]}
        >
          Email
        </Text>
      </Pressable>
      <Pressable style={styles.toggleButton} onPress={() => handleMethodChange('phone')}>
        <Ionicons
          name="call-outline"
          size={18}
          color={method === 'phone' ? colors.primary : colors.textSecondary}
          style={styles.toggleIcon}
        />
        <Text
          style={[
            styles.toggleText,
            {
              color: method === 'phone' ? colors.primary : colors.textSecondary,
              fontWeight: method === 'phone' ? FontWeights.semibold : FontWeights.normal,
            },
          ]}
        >
          Phone
        </Text>
      </Pressable>
    </View>
  );
}

// ============================================================================
// Checkbox Component
// ============================================================================

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}

function Checkbox({ checked, onToggle, error }: CheckboxProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 400 });
    }, 100);
    onToggle();
  }, [scale, onToggle]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress} style={styles.checkboxRow}>
      <Animated.View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? colors.primary : 'transparent',
            borderColor: error ? colors.error : checked ? colors.primary : colors.border,
          },
          animatedStyle,
        ]}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </Animated.View>
      <View style={styles.checkboxTextContainer}>
        <Text style={[styles.checkboxText, { color: colors.text }]}>I agree to the </Text>
        <Pressable
          onPress={() => {
            // Navigate to terms
          }}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>Terms of Service</Text>
        </Pressable>
        <Text style={[styles.checkboxText, { color: colors.text }]}> and </Text>
        <Pressable
          onPress={() => {
            // Navigate to privacy
          }}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

// ============================================================================
// Country Code Picker (Simplified)
// ============================================================================

interface CountryCodePickerProps {
  value: string;
  onSelect: (code: string) => void;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
];

function CountryCodePicker({ value, onSelect }: CountryCodePickerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isOpen, setIsOpen] = useState(false);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  return (
    <View style={styles.countryCodeContainer}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[
          styles.countryCodeButton,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
        <Text style={[styles.countryCodeText, { color: colors.text }]}>{selectedCountry.code}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textSecondary}
        />
      </Pressable>

      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(AnimationDurations.fast)}
          style={[styles.countryCodeDropdown, { backgroundColor: colors.background }, Shadows.md]}
        >
          {COUNTRY_CODES.map((country) => (
            <Pressable
              key={country.code}
              onPress={() => {
                onSelect(country.code);
                setIsOpen(false);
              }}
              style={[styles.countryCodeOption, { borderBottomColor: colors.divider }]}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={[styles.countryCodeOptionText, { color: colors.text }]}>
                {country.country} ({country.code})
              </Text>
              {country.code === value && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function SignUpScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [method, setMethod] = useState<SignUpMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, setGuest } = useAuthStore();

  // Email form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false as unknown as true,
    },
    mode: 'onChange',
  });

  // Phone form
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      name: '',
      phone: '',
      countryCode: '+1',
      password: '',
      acceptTerms: false as unknown as true,
    },
    mode: 'onChange',
  });

  const currentForm = method === 'email' ? emailForm : phoneForm;

  const handleSignUp = useCallback(
    async (data: EmailFormData | PhoneFormData) => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create user object
      const user: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: 'email' in data ? data.email : '',
        phone: 'phone' in data ? `${data.countryCode}${data.phone}` : '',
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      signUp(user);
      setIsLoading(false);

      // Success haptic for sign up
      haptics.formSubmit();

      // Navigate to verification screen
      router.replace({
        pathname: '/verify',
        params: {
          method,
          destination: 'email' in data ? data.email : `${data.countryCode}${data.phone}`,
        },
      });
    },
    [method, signUp]
  );

  const handleContinueAsGuest = useCallback(() => {
    setGuest();
    router.replace('/(tabs)');
  }, [setGuest]);

  const handleMethodChange = useCallback(
    (newMethod: SignUpMethod) => {
      setMethod(newMethod);
      // Reset forms when switching
      emailForm.reset();
      phoneForm.reset();
    },
    [emailForm, phoneForm]
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(AnimationDurations.normal)}
            style={styles.header}
          >
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join Maestro and start ordering delicious food
            </Text>
          </Animated.View>

          {/* Method Toggle */}
          <Animated.View entering={FadeInDown.delay(200).duration(AnimationDurations.normal)}>
            <MethodToggle method={method} onMethodChange={handleMethodChange} />
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(AnimationDurations.normal)}
            style={styles.form}
          >
            {/* Name Field */}
            <Controller
              control={currentForm.control}
              name="name"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  leftIcon="person-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  autoCapitalize="words"
                  autoComplete="name"
                  containerStyle={styles.inputContainer}
                />
              )}
            />

            {/* Email or Phone Field */}
            {method === 'email' ? (
              <Controller
                control={emailForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    leftIcon="mail-outline"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    containerStyle={styles.inputContainer}
                  />
                )}
              />
            ) : (
              <View style={styles.phoneContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number</Text>
                <View style={styles.phoneInputRow}>
                  <Controller
                    control={phoneForm.control}
                    name="countryCode"
                    render={({ field: { onChange, value } }) => (
                      <CountryCodePicker value={value} onSelect={onChange} />
                    )}
                  />
                  <View style={styles.phoneInputWrapper}>
                    <Controller
                      control={phoneForm.control}
                      name="phone"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          placeholder="Phone number"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={error?.message}
                          keyboardType="phone-pad"
                          autoComplete="tel"
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Password Field */}
            <Controller
              control={currentForm.control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                  <Input
                    label="Password"
                    placeholder="Create a password"
                    leftIcon="lock-closed-outline"
                    rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    containerStyle={styles.inputContainer}
                  />
                  <PasswordStrengthIndicator password={value} />
                </View>
              )}
            />

            {/* Terms & Conditions */}
            <Controller
              control={currentForm.control}
              name="acceptTerms"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={styles.termsContainer}>
                  <Checkbox
                    checked={value === true}
                    onToggle={() => onChange(!value)}
                    error={error?.message}
                  />
                  {error?.message && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Sign Up Button */}
            <Button
              onPress={currentForm.handleSubmit(handleSignUp)}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.signUpButton}
            >
              Create Account
            </Button>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
            </View>

            {/* Continue as Guest */}
            <Button variant="outline" onPress={handleContinueAsGuest} fullWidth size="lg">
              Continue as Guest
            </Button>
          </Animated.View>

          {/* Sign In Link */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(AnimationDurations.normal)}
            style={styles.signInContainer}
          >
            <Text style={[styles.signInText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <Pressable
              onPress={() => router.push('/sign-in')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[10],
    paddingBottom: Spacing[8],
  },
  header: {
    marginBottom: Spacing[6],
  },
  title: {
    ...Typography['3xl'],
    fontWeight: FontWeights.bold as '700',
    marginBottom: Spacing[2],
  },
  subtitle: {
    ...Typography.base,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xl,
    padding: Spacing[1],
    marginBottom: Spacing[6],
    position: 'relative',
  },
  toggleIndicator: {
    position: 'absolute',
    top: Spacing[1],
    left: Spacing[1],
    width: 140,
    height: 40,
    borderRadius: BorderRadius.lg,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2],
    zIndex: 1,
  },
  toggleIcon: {
    marginRight: Spacing[1],
  },
  toggleText: {
    ...Typography.base,
  },
  form: {
    gap: Spacing[4],
  },
  inputContainer: {
    marginBottom: Spacing[0],
  },
  inputLabel: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
    marginBottom: Spacing[1],
  },
  phoneContainer: {
    marginBottom: Spacing[0],
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
  },
  phoneInputWrapper: {
    flex: 1,
  },
  countryCodeContainer: {
    position: 'relative',
    zIndex: 10,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    minHeight: 48,
  },
  countryFlag: {
    fontSize: 18,
    marginRight: Spacing[1],
  },
  countryCodeText: {
    ...Typography.base,
    marginRight: Spacing[1],
  },
  countryCodeDropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    zIndex: 100,
    minWidth: 180,
  },
  countryCodeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  countryCodeOptionText: {
    ...Typography.base,
    flex: 1,
    marginLeft: Spacing[2],
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  strengthBars: {
    flexDirection: 'row',
    gap: Spacing[1],
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: BorderRadius.full,
  },
  strengthLabel: {
    ...Typography.xs,
    fontWeight: FontWeights.medium as '500',
    marginLeft: Spacing[2],
    width: 48,
  },
  termsContainer: {
    marginTop: Spacing[2],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[2],
    marginTop: 2,
  },
  checkboxTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkboxText: {
    ...Typography.sm,
  },
  linkText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  errorText: {
    ...Typography.xs,
    marginTop: Spacing[1],
  },
  signUpButton: {
    marginTop: Spacing[4],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...Typography.sm,
    marginHorizontal: Spacing[3],
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[6],
  },
  signInText: {
    ...Typography.base,
  },
  signInLink: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
  },
});

// Export for testing
export { COUNTRY_CODES, emailSchema, phoneSchema };
export type { EmailFormData, PhoneFormData, SignUpMethod };
