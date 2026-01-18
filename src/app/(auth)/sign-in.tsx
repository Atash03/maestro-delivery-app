/**
 * Sign In screen - Authenticate existing users
 *
 * Features:
 * - Toggle between Email and Phone sign-in methods (remembers last used)
 * - Password field with show/hide toggle
 * - "Forgot Password?" link
 * - "Don't have an account? Sign Up" link
 * - "Continue as Guest" option
 * - Biometric authentication option (if available)
 * - Animated button loading state
 */

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
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

type SignInMethod = 'email' | 'phone';

// Storage key for remembering last used sign-in method
const LAST_SIGN_IN_METHOD_KEY = 'maestro-last-sign-in-method';

// ============================================================================
// Validation Schemas
// ============================================================================

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

type EmailFormData = z.infer<typeof emailSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;

// ============================================================================
// Method Toggle
// ============================================================================

interface MethodToggleProps {
  method: SignInMethod;
  onMethodChange: (method: SignInMethod) => void;
}

function MethodToggle({ method, onMethodChange }: MethodToggleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const indicatorPosition = useSharedValue(method === 'email' ? 0 : 1);

  const handleMethodChange = useCallback(
    (newMethod: SignInMethod) => {
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
      <Pressable
        style={styles.toggleButton}
        onPress={() => handleMethodChange('email')}
        accessibilityRole="button"
        accessibilityLabel="Sign in with email"
        accessibilityState={{ selected: method === 'email' }}
      >
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
      <Pressable
        style={styles.toggleButton}
        onPress={() => handleMethodChange('phone')}
        accessibilityRole="button"
        accessibilityLabel="Sign in with phone"
        accessibilityState={{ selected: method === 'phone' }}
      >
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
// Country Code Picker
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
        accessibilityRole="button"
        accessibilityLabel={`Selected country code ${selectedCountry.code}`}
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
              accessibilityRole="button"
              accessibilityLabel={`Select ${country.country} ${country.code}`}
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
// Biometric Button
// ============================================================================

interface BiometricButtonProps {
  onPress: () => void;
  biometricType: LocalAuthentication.AuthenticationType | null;
}

function BiometricButton({ onPress, biometricType }: BiometricButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    if (biometricType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) {
      return 'scan-outline';
    }
    return 'finger-print-outline';
  };

  const getLabel = (): string => {
    if (biometricType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) {
      return 'Sign in with Face ID';
    }
    return 'Sign in with Touch ID';
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.biometricButton,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={getLabel()}
      >
        <Ionicons name={getIcon()} size={24} color={colors.primary} />
        <Text style={[styles.biometricText, { color: colors.text }]}>{getLabel()}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function SignInScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [method, setMethod] = useState<SignInMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType | null>(
    null
  );
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const { signIn, setGuest } = useAuthStore();

  // Check for biometric availability on mount
  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (compatible && enrolled) {
          const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (types.length > 0) {
            // Prefer Face ID over Touch ID
            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
              setBiometricType(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
            } else {
              setBiometricType(types[0]);
            }
            setIsBiometricAvailable(true);
          }
        }
      } catch {
        // Biometrics not available, silently fail
      }
    };

    checkBiometrics();
  }, []);

  // Load last used sign-in method on mount
  useEffect(() => {
    const loadLastMethod = async () => {
      try {
        const savedMethod = await AsyncStorage.getItem(LAST_SIGN_IN_METHOD_KEY);
        if (savedMethod === 'email' || savedMethod === 'phone') {
          setMethod(savedMethod);
        }
      } catch {
        // Ignore errors, use default method
      }
    };

    loadLastMethod();
  }, []);

  // Email form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Phone form
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
      countryCode: '+1',
      password: '',
    },
    mode: 'onChange',
  });

  const currentForm = method === 'email' ? emailForm : phoneForm;

  const handleSignIn = useCallback(
    async (data: EmailFormData | PhoneFormData) => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create mock user object (in real app, this would come from API)
      const user: User = {
        id: `user-${Date.now()}`,
        name: 'Test User',
        email: 'email' in data ? data.email : '',
        phone: 'phone' in data ? `${data.countryCode}${data.phone}` : '',
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      signIn(user);
      setIsLoading(false);

      // Success haptic for sign in
      haptics.formSubmit();

      // Navigate to main app
      router.replace('/(tabs)');
    },
    [signIn]
  );

  const handleBiometricAuth = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Sign in to Maestro',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLoading(true);

        // Simulate API call to get stored user
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Create mock user (in real app, retrieve from secure storage)
        const user: User = {
          id: 'user-biometric',
          name: 'Biometric User',
          email: 'biometric@example.com',
          phone: '',
          addresses: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        signIn(user);
        setIsLoading(false);

        // Success haptic for biometric sign in
        haptics.formSubmit();

        router.replace('/(tabs)');
      }
    } catch {
      // Error haptic for failed biometric
      haptics.error();
      Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again.');
    }
  }, [signIn]);

  const handleForgotPassword = useCallback(() => {
    // In a real app, navigate to forgot password screen
    Alert.alert('Reset Password', 'A password reset link will be sent to your email or phone.', [
      { text: 'OK' },
    ]);
  }, []);

  const handleContinueAsGuest = useCallback(() => {
    setGuest();
    router.replace('/(tabs)');
  }, [setGuest]);

  const handleMethodChange = useCallback(
    async (newMethod: SignInMethod) => {
      setMethod(newMethod);
      // Save last used method
      try {
        await AsyncStorage.setItem(LAST_SIGN_IN_METHOD_KEY, newMethod);
      } catch {
        // Ignore errors
      }
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
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to continue ordering delicious food
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
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  leftIcon="lock-closed-outline"
                  rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  containerStyle={styles.inputContainer}
                />
              )}
            />

            {/* Forgot Password Link */}
            <Pressable
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </Pressable>

            {/* Sign In Button */}
            <Button
              onPress={currentForm.handleSubmit(handleSignIn)}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.signInButton}
            >
              Sign In
            </Button>

            {/* Biometric Authentication */}
            {isBiometricAvailable && (
              <Animated.View
                entering={FadeIn.delay(400).duration(AnimationDurations.normal)}
                exiting={FadeOut.duration(AnimationDurations.fast)}
              >
                <View style={styles.biometricContainer}>
                  <View style={styles.dividerContainer}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
                    <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
                    <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
                  </View>

                  <BiometricButton onPress={handleBiometricAuth} biometricType={biometricType} />
                </View>
              </Animated.View>
            )}

            {/* Divider for Guest */}
            {!isBiometricAvailable && (
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
              </View>
            )}

            {/* Continue as Guest */}
            <Button
              variant="outline"
              onPress={handleContinueAsGuest}
              fullWidth
              size="lg"
              style={!isBiometricAvailable ? undefined : styles.guestButton}
            >
              Continue as Guest
            </Button>
          </Animated.View>

          {/* Sign Up Link */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(AnimationDurations.normal)}
            style={styles.signUpContainer}
          >
            <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
              Don&apos;t have an account?{' '}
            </Text>
            <Pressable
              onPress={() => router.push('/sign-up')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Sign up"
            >
              <Text style={[styles.signUpLink, { color: colors.primary }]}>Sign Up</Text>
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -Spacing[2],
  },
  forgotPasswordText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  signInButton: {
    marginTop: Spacing[2],
  },
  biometricContainer: {
    gap: Spacing[4],
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing[2],
  },
  biometricText: {
    ...Typography.base,
    fontWeight: FontWeights.medium as '500',
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
  guestButton: {
    marginTop: Spacing[4],
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[6],
  },
  signUpText: {
    ...Typography.base,
  },
  signUpLink: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
  },
});

// Export for testing
export { COUNTRY_CODES, emailSchema, LAST_SIGN_IN_METHOD_KEY, phoneSchema };
export type { EmailFormData, PhoneFormData, SignInMethod };
