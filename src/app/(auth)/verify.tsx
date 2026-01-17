/**
 * Verification screen - OTP code entry
 *
 * Features:
 * - OTP input (6 digits) with auto-focus between inputs
 * - Resend code timer (60 seconds countdown)
 * - Auto-submit when all digits entered
 * - Animated success checkmark on verification
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  Shadows,
  Spacing,
  SuccessColors,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores';

// ============================================================================
// Constants
// ============================================================================

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

// ============================================================================
// OTP Input Component
// ============================================================================

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
}

function OTPInput({ value, onChange, onComplete, disabled = false, error = false }: OTPInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useSharedValue(0);

  // Shake animation when error occurs
  useEffect(() => {
    if (error) {
      shakeAnimation.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [error, shakeAnimation]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Only allow digits
      const digit = text.replace(/[^0-9]/g, '');

      if (digit.length > 1) {
        // Handle paste - distribute digits across inputs
        const newValue = value.split('');
        const pastedDigits = digit.slice(0, OTP_LENGTH - index);
        for (let i = 0; i < pastedDigits.length; i++) {
          newValue[index + i] = pastedDigits[i];
        }
        const newCode = newValue.join('').slice(0, OTP_LENGTH);
        onChange(newCode);

        // Focus appropriate input after paste
        const nextIndex = Math.min(index + pastedDigits.length, OTP_LENGTH - 1);
        if (newCode.length === OTP_LENGTH) {
          inputRefs.current[nextIndex]?.blur();
          onComplete(newCode);
        } else {
          inputRefs.current[nextIndex]?.focus();
        }
        return;
      }

      // Handle single digit
      const newValue = value.split('');
      newValue[index] = digit;
      const newCode = newValue.join('').slice(0, OTP_LENGTH);
      onChange(newCode);

      if (digit && index < OTP_LENGTH - 1) {
        // Move to next input
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all digits entered
      if (newCode.length === OTP_LENGTH && digit) {
        inputRefs.current[index]?.blur();
        onComplete(newCode);
      }
    },
    [value, onChange, onComplete]
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace') {
        if (!value[index] && index > 0) {
          // If current input is empty, move to previous and clear it
          inputRefs.current[index - 1]?.focus();
          const newValue = value.split('');
          newValue[index - 1] = '';
          onChange(newValue.join(''));
        } else if (value[index]) {
          // Clear current input
          const newValue = value.split('');
          newValue[index] = '';
          onChange(newValue.join(''));
        }
      }
    },
    [value, onChange]
  );

  const handleFocus = useCallback((index: number) => {
    // Select the text when focused
    inputRefs.current[index]?.setNativeProps({ selection: { start: 0, end: 1 } });
  }, []);

  return (
    <Animated.View style={[styles.otpContainer, shakeStyle]}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => {
        const isActive =
          index === value.length || (index === OTP_LENGTH - 1 && value.length === OTP_LENGTH);
        const isFilled = value[index] !== undefined && value[index] !== '';

        return (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(index * 50).duration(AnimationDurations.fast)}
          >
            <View
              style={[
                styles.otpBox,
                {
                  backgroundColor: colors.background,
                  borderColor: error
                    ? colors.error
                    : isFilled
                      ? colors.primary
                      : isActive
                        ? colors.borderFocus
                        : colors.border,
                  borderWidth: isActive || isFilled ? 2 : 1.5,
                },
                Shadows.sm,
              ]}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  {
                    color: error ? colors.error : colors.text,
                  },
                ]}
                value={value[index] || ''}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                onFocus={() => handleFocus(index)}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH} // Allow paste
                editable={!disabled}
                selectTextOnFocus
                caretHidden
                accessibilityLabel={`Digit ${index + 1} of ${OTP_LENGTH}`}
                accessibilityHint="Enter verification code digit"
              />
            </View>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

// ============================================================================
// Success Animation Component
// ============================================================================

interface SuccessAnimationProps {
  onAnimationComplete?: () => void;
}

function SuccessAnimation({ onAnimationComplete }: SuccessAnimationProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const scale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Circle scale up
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });

    // Checkmark scale with delay
    checkScale.value = withDelay(
      300,
      withSpring(1, { damping: 12, stiffness: 200 }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      })
    );

    // Subtle rotation for the checkmark
    rotation.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 150 }));
  }, [scale, checkScale, rotation, onAnimationComplete]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0, 1], [0, 1]),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }, { rotate: `${rotation.value}deg` }],
    opacity: checkScale.value,
  }));

  const successBg = colorScheme === 'light' ? SuccessColors[500] : SuccessColors[400];

  return (
    <View style={styles.successContainer}>
      <Animated.View style={[styles.successCircle, { backgroundColor: successBg }, circleStyle]}>
        <Animated.View style={checkStyle}>
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
      <Animated.Text
        entering={FadeIn.delay(500).duration(AnimationDurations.normal)}
        style={[styles.successText, { color: successBg }]}
      >
        Verified!
      </Animated.Text>
    </View>
  );
}

// ============================================================================
// Resend Timer Component
// ============================================================================

interface ResendTimerProps {
  onResend: () => void;
}

function ResendTimer({ onResend }: ResendTimerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = useCallback(() => {
    onResend();
    setCountdown(RESEND_COOLDOWN);
    setCanResend(false);
  }, [onResend]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.resendContainer}>
      <Text style={[styles.resendText, { color: colors.textSecondary }]}>
        Didn't receive the code?{' '}
      </Text>
      {canResend ? (
        <Pressable onPress={handleResend} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.resendLink, { color: colors.primary }]}>Resend Code</Text>
        </Pressable>
      ) : (
        <Text style={[styles.resendTimer, { color: colors.textTertiary }]}>
          Resend in {formatTime(countdown)}
        </Text>
      )}
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function VerifyScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const params = useLocalSearchParams<{ method?: string; destination?: string }>();
  const { user } = useAuthStore();

  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Determine verification method and destination
  const method = params.method || 'email';
  const destination = params.destination || user?.email || user?.phone || 'your account';
  const isEmail = method === 'email';

  const handleOtpChange = useCallback((value: string) => {
    setOtpValue(value);
    setError(null); // Clear error when user types
  }, []);

  const handleVerify = useCallback(async (code: string) => {
    if (code.length !== OTP_LENGTH) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setError(null);

    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock verification - accept "123456" as valid code
    // In production, this would call an actual API
    if (code === '123456') {
      setIsSuccess(true);
    } else {
      setError('Invalid verification code. Please try again.');
      setOtpValue('');
      setIsVerifying(false);
    }
  }, []);

  const handleResend = useCallback(async () => {
    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Show feedback that code was resent
    // In production, this would trigger actual resend
  }, []);

  const handleSuccessComplete = useCallback(() => {
    // Navigate to main app after success animation
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 500);
  }, []);

  const handleChangeDestination = useCallback(() => {
    // Go back to sign-up to change email/phone
    router.back();
  }, []);

  // Mask email/phone for display
  const getMaskedDestination = () => {
    if (isEmail && destination.includes('@')) {
      const [local, domain] = destination.split('@');
      const maskedLocal =
        local.length > 2
          ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
          : local;
      return `${maskedLocal}@${domain}`;
    }
    // Phone masking
    if (destination.length > 4) {
      return `${'*'.repeat(destination.length - 4)}${destination.slice(-4)}`;
    }
    return destination;
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SuccessAnimation onAnimationComplete={handleSuccessComplete} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(AnimationDurations.normal)}
            style={styles.header}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
              <Ionicons
                name={isEmail ? 'mail-outline' : 'phone-portrait-outline'}
                size={32}
                color={colors.primary}
              />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              Verify Your {isEmail ? 'Email' : 'Phone'}
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              We've sent a 6-digit verification code to
            </Text>

            <Text style={[styles.destination, { color: colors.text }]}>
              {getMaskedDestination()}
            </Text>

            <Pressable
              onPress={handleChangeDestination}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.changeLink, { color: colors.primary }]}>
                Change {isEmail ? 'email' : 'phone number'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* OTP Input */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(AnimationDurations.normal)}
            style={styles.otpSection}
          >
            <OTPInput
              value={otpValue}
              onChange={handleOtpChange}
              onComplete={handleVerify}
              disabled={isVerifying}
              error={!!error}
            />

            {/* Error Message */}
            {error && (
              <Animated.View
                entering={FadeIn.duration(AnimationDurations.fast)}
                exiting={FadeOut.duration(AnimationDurations.fast)}
              >
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </Animated.View>
            )}
          </Animated.View>

          {/* Verify Button */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(AnimationDurations.normal)}
            style={styles.buttonSection}
          >
            <Button
              onPress={() => handleVerify(otpValue)}
              loading={isVerifying}
              disabled={otpValue.length !== OTP_LENGTH || isVerifying}
              fullWidth
              size="lg"
            >
              Verify Code
            </Button>

            {/* Resend Timer */}
            <ResendTimer onResend={handleResend} />
          </Animated.View>

          {/* Help Text */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(AnimationDurations.normal)}
            style={styles.helpSection}
          >
            <Text style={[styles.helpText, { color: colors.textTertiary }]}>
              Having trouble? Check your {isEmail ? 'spam folder' : 'SMS messages'} or contact
              support.
            </Text>
          </Animated.View>
        </View>
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
    paddingHorizontal: Spacing[6],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  title: {
    ...Typography['2xl'],
    fontWeight: FontWeights.bold as '700',
    marginBottom: Spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.base,
    textAlign: 'center',
    marginBottom: Spacing[1],
  },
  destination: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as '600',
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  changeLink: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  otpSection: {
    marginBottom: Spacing[6],
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    ...Typography['2xl'],
    fontWeight: FontWeights.bold as '700',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  errorText: {
    ...Typography.sm,
    textAlign: 'center',
    marginTop: Spacing[3],
  },
  buttonSection: {
    marginBottom: Spacing[6],
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[4],
    flexWrap: 'wrap',
  },
  resendText: {
    ...Typography.sm,
  },
  resendLink: {
    ...Typography.sm,
    fontWeight: FontWeights.semibold as '600',
  },
  resendTimer: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  helpSection: {
    alignItems: 'center',
  },
  helpText: {
    ...Typography.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing[4],
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  successText: {
    ...Typography['2xl'],
    fontWeight: FontWeights.bold as '700',
  },
});

// Export for testing
export { OTP_LENGTH, RESEND_COOLDOWN };
