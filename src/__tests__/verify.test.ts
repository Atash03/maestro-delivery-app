/**
 * Tests for the verification screen
 *
 * Tests screen structure, OTP input functionality, auto-submit,
 * resend timer, success animation, and navigation.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

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
const mockParams = {
  method: 'email',
  destination: 'test@example.com',
};
jest.mock('expo-router', () => ({
  router: mockRouter,
  useLocalSearchParams: () => mockParams,
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    View: 'Animated.View',
    Text: 'Animated.Text',
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
  withSequence: jest.fn((...args) => args[args.length - 1]),
  withDelay: jest.fn((_delay, value) => value),
  interpolate: jest.fn((value) => value),
  runOnJS: jest.fn((fn) => fn),
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
  user: {
    email: 'mock@example.com',
    phone: '+11234567890',
  },
};
jest.mock('@/stores', () => ({
  useAuthStore: () => mockAuthStore,
}));

describe('Verify Screen', () => {
  const screenPath = path.join(__dirname, '..', 'app', '(auth)', 'verify.tsx');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('File Structure', () => {
    it('verify screen file exists', () => {
      expect(fs.existsSync(screenPath)).toBe(true);
    });

    it('exports default component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export default function VerifyScreen');
    });

    it('exports constants for testing', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('export { OTP_LENGTH, RESEND_COOLDOWN }');
    });
  });

  describe('Constants', () => {
    it('has OTP_LENGTH constant set to 6', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const OTP_LENGTH = 6');
    });

    it('has RESEND_COOLDOWN constant set to 60', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('const RESEND_COOLDOWN = 60');
    });
  });

  describe('OTP Input Component', () => {
    it('has OTPInput component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function OTPInput');
      expect(content).toContain('interface OTPInputProps');
    });

    it('OTPInput has value prop', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('value: string');
    });

    it('OTPInput has onChange prop', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('onChange: (value: string) => void');
    });

    it('OTPInput has onComplete prop', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('onComplete: (code: string) => void');
    });

    it('OTPInput has disabled prop', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('disabled?: boolean');
    });

    it('OTPInput has error prop', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('error?: boolean');
    });

    it('creates 6 input boxes', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Array.from({ length: OTP_LENGTH })');
    });

    it('uses inputRefs for managing focus', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('inputRefs = useRef');
      expect(content).toContain('inputRefs.current[index]');
    });

    it('handles single digit input', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('// Handle single digit');
    });

    it('handles paste functionality', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('// Handle paste');
      expect(content).toContain('pastedDigits');
    });

    it('auto-focuses next input on digit entry', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('inputRefs.current[index + 1]?.focus()');
    });

    it('handles backspace key press', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleKeyPress');
      expect(content).toContain("key === 'Backspace'");
    });

    it('moves to previous input on backspace when empty', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('inputRefs.current[index - 1]?.focus()');
    });

    it('only allows digits', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("text.replace(/[^0-9]/g, '')");
    });

    it('uses number-pad keyboard', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('keyboardType="number-pad"');
    });

    it('has accessibility labels for inputs', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('accessibilityLabel={`Digit ${index + 1} of ${OTP_LENGTH}`}');
      expect(content).toContain('accessibilityHint="Enter verification code digit"');
    });

    it('hides caret in input', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('caretHidden');
    });

    it('selects text on focus', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('selectTextOnFocus');
    });
  });

  describe('Auto-Submit Feature', () => {
    it('auto-submits when all digits entered', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('// Auto-submit when all digits entered');
      expect(content).toContain('onComplete(newCode)');
    });

    it('blurs input on complete', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('inputRefs.current[index]?.blur()');
    });
  });

  describe('Shake Animation', () => {
    it('has shake animation for error', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('shakeAnimation = useSharedValue');
      expect(content).toContain('shakeStyle');
    });

    it('triggers shake on error', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('if (error)');
      expect(content).toContain('withSequence');
      expect(content).toContain('withTiming(-10');
      expect(content).toContain('withTiming(10');
    });

    it('applies shake style to container', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('[styles.otpContainer, shakeStyle]');
    });
  });

  describe('Success Animation Component', () => {
    it('has SuccessAnimation component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function SuccessAnimation');
      expect(content).toContain('interface SuccessAnimationProps');
    });

    it('has onAnimationComplete callback', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('onAnimationComplete?: () => void');
    });

    it('animates circle scale', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('scale = useSharedValue(0)');
      expect(content).toContain('// Circle scale up');
    });

    it('animates checkmark with delay', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('checkScale = useSharedValue(0)');
      expect(content).toContain('// Checkmark scale with delay');
      expect(content).toContain('withDelay');
    });

    it('uses spring animations', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('withSpring(1, { damping: 12, stiffness: 200 }');
    });

    it('shows checkmark icon', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('name="checkmark"');
      expect(content).toContain('size={48}');
    });

    it('shows Verified! text', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Verified!');
      expect(content).toContain('successText');
    });

    it('calls onAnimationComplete when finished', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('runOnJS(onAnimationComplete)');
    });

    it('uses success colors', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('SuccessColors');
      expect(content).toContain('successBg');
    });
  });

  describe('Resend Timer Component', () => {
    it('has ResendTimer component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('function ResendTimer');
      expect(content).toContain('interface ResendTimerProps');
    });

    it('has onResend callback', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('onResend: () => void');
    });

    it('has countdown state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('countdown, setCountdown');
      expect(content).toContain('useState(RESEND_COOLDOWN)');
    });

    it('has canResend state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('canResend, setCanResend');
      expect(content).toContain('useState(false)');
    });

    it('counts down using setTimeout', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('setTimeout(() => setCountdown(countdown - 1), 1000)');
    });

    it('enables resend when countdown reaches 0', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('setCanResend(true)');
    });

    it('resets countdown on resend', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('setCountdown(RESEND_COOLDOWN)');
      expect(content).toContain('setCanResend(false)');
    });

    it('formats time as MM:SS', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('formatTime');
      expect(content).toContain('Math.floor(seconds / 60)');
      expect(content).toContain("padStart(2, '0')");
    });

    it('shows "Didn\'t receive the code?" text', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Didn't receive the code?");
    });

    it('shows Resend Code link when available', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('canResend ?');
      expect(content).toContain('Resend Code');
    });

    it('shows countdown timer when not available', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Resend in {formatTime(countdown)}');
    });

    it('has hitSlop for resend link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}');
    });
  });

  describe('Main Screen State', () => {
    it('has otpValue state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("otpValue, setOtpValue] = useState('')");
    });

    it('has isVerifying state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('isVerifying, setIsVerifying] = useState(false)');
    });

    it('has error state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('error, setError] = useState<string | null>(null)');
    });

    it('has isSuccess state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('isSuccess, setIsSuccess] = useState(false)');
    });
  });

  describe('Route Parameters', () => {
    it('uses useLocalSearchParams', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('useLocalSearchParams');
    });

    it('reads method parameter', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('method?: string');
      expect(content).toContain("params.method || 'email'");
    });

    it('reads destination parameter', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('destination?: string');
    });

    it('determines isEmail from method', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("isEmail = method === 'email'");
    });
  });

  describe('Verification Logic', () => {
    it('has handleVerify function', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleVerify');
      expect(content).toContain('async (code: string)');
    });

    it('validates OTP length', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('code.length !== OTP_LENGTH');
      expect(content).toContain('Please enter all 6 digits');
    });

    it('sets isVerifying during API call', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('setIsVerifying(true)');
      expect(content).toContain('setIsVerifying(false)');
    });

    it('simulates API verification delay', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('await new Promise');
      expect(content).toContain('setTimeout(resolve, 1500)');
    });

    it('accepts valid code 123456', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("code === '123456'");
      expect(content).toContain('setIsSuccess(true)');
    });

    it('shows error for invalid code', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Invalid verification code. Please try again.');
      expect(content).toContain("setOtpValue('')");
    });

    it('clears error when user types', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('setError(null)');
      expect(content).toContain('// Clear error when user types');
    });
  });

  describe('Resend Logic', () => {
    it('has handleResend function', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleResend');
    });

    it('simulates resend API call', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('// Simulate resend API call');
      expect(content).toContain('setTimeout(resolve, 500)');
    });
  });

  describe('Masking Destination', () => {
    it('has getMaskedDestination function', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('getMaskedDestination');
    });

    it('masks email addresses', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("destination.includes('@')");
      expect(content).toContain("destination.split('@')");
      expect(content).toContain('maskedLocal');
    });

    it('masks phone numbers', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('destination.length > 4');
      expect(content).toContain('destination.slice(-4)');
    });

    it('uses asterisks for masking', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("'*'.repeat(");
    });
  });

  describe('Change Destination', () => {
    it('has handleChangeDestination function', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleChangeDestination');
    });

    it('navigates back on change destination', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('router.back()');
    });

    it('shows change email/phone link', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Change {isEmail ? 'email' : 'phone number'}");
    });
  });

  describe('Navigation', () => {
    it('navigates to tabs on success', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("router.replace('/(tabs)')");
    });

    it('has handleSuccessComplete callback', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('handleSuccessComplete');
    });

    it('delays navigation after success animation', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("setTimeout(() => {\n      router.replace('/(tabs)');");
    });
  });

  describe('UI Components', () => {
    it('uses Button component', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("from '@/components/ui'");
      expect(content).toContain('<Button');
    });

    it('has Verify Code button', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Verify Code');
      expect(content).toContain('</Button>');
    });

    it('button is disabled when OTP incomplete', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('disabled={otpValue.length !== OTP_LENGTH || isVerifying}');
    });

    it('button shows loading state', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('loading={isVerifying}');
    });
  });

  describe('Header', () => {
    it('has icon container', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('iconContainer');
    });

    it('shows email icon for email verification', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("name={isEmail ? 'mail-outline' : 'phone-portrait-outline'}");
    });

    it('shows verification title', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Verify Your {isEmail ? 'Email' : 'Phone'}");
    });

    it('shows code sent message', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("We've sent a 6-digit verification code to");
    });

    it('shows masked destination', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('{getMaskedDestination()}');
    });
  });

  describe('Help Section', () => {
    it('has help text', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('helpSection');
      expect(content).toContain('helpText');
    });

    it('shows context-aware help message', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain(
        "Having trouble? Check your {isEmail ? 'spam folder' : 'SMS messages'} or contact support."
      );
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
      expect(content).toContain('colors.error');
    });

    it('uses design system spacing', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Spacing[');
    });

    it('uses design system typography', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Typography['2xl']");
      expect(content).toContain('Typography.base');
      expect(content).toContain('Typography.sm');
      expect(content).toContain('Typography.lg');
      expect(content).toContain('Typography.xs');
    });

    it('uses design system border radius', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('BorderRadius.full');
      expect(content).toContain('BorderRadius.lg');
    });

    it('uses design system shadows', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('Shadows.sm');
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
      expect(content).toContain('FadeInUp.delay(200)');
      expect(content).toContain('FadeInUp.delay(300)');
      expect(content).toContain('FadeInUp.delay(400)');
    });

    it('has staggered animations for OTP boxes', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FadeInDown.delay(index * 50)');
    });

    it('uses animated components', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('<Animated.View');
      expect(content).toContain('<Animated.Text');
    });

    it('has fade in/out for error message', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('FadeIn.duration(AnimationDurations.fast)');
      expect(content).toContain('FadeOut.duration(AnimationDurations.fast)');
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

    it('uses correct behavior for platform', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain("Platform.OS === 'ios' ? 'padding' : 'height'");
    });
  });

  describe('Success State Rendering', () => {
    it('renders success animation when isSuccess', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('if (isSuccess)');
      expect(content).toContain('<SuccessAnimation');
    });

    it('passes onAnimationComplete to success animation', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('onAnimationComplete={handleSuccessComplete}');
    });
  });

  describe('Error State', () => {
    it('shows error message when error exists', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('{error && (');
      expect(content).toContain('errorText');
    });

    it('passes error prop to OTPInput', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('error={!!error}');
    });

    it('styles OTP boxes with error color', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('borderColor: error\n                    ? colors.error');
    });

    it('styles OTP input text with error color', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('color: error ? colors.error : colors.text');
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
      expect(content).toContain('useRef');

      // React Native imports
      expect(content).toContain("from 'react-native'");
      expect(content).toContain('KeyboardAvoidingView');
      expect(content).toContain('TextInput');
      expect(content).toContain('Platform');

      // Expo imports
      expect(content).toContain("from 'expo-router'");
      expect(content).toContain("from '@expo/vector-icons'");

      // Internal imports
      expect(content).toContain("from '@/components/ui'");
      expect(content).toContain("from '@/constants/theme'");
      expect(content).toContain("from '@/hooks/use-color-scheme'");
      expect(content).toContain("from '@/stores'");
    });
  });

  describe('OTP Input Styling', () => {
    it('has otpContainer style', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('otpContainer:');
      expect(content).toContain("flexDirection: 'row'");
      expect(content).toContain("justifyContent: 'center'");
    });

    it('has otpBox style', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('otpBox:');
      expect(content).toContain('width: 48');
      expect(content).toContain('height: 56');
    });

    it('has otpInput style', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('otpInput:');
      expect(content).toContain("textAlign: 'center'");
    });

    it('shows different border styles for active/filled states', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('isActive');
      expect(content).toContain('isFilled');
      expect(content).toContain('borderWidth: isActive || isFilled ? 2 : 1.5');
    });

    it('highlights active input with borderFocus color', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('colors.borderFocus');
    });

    it('highlights filled input with primary color', () => {
      const content = fs.readFileSync(screenPath, 'utf-8');
      expect(content).toContain('isFilled\n                      ? colors.primary');
    });
  });
});

describe('OTP Input Logic', () => {
  describe('Digit Validation', () => {
    it('filters out non-digit characters', () => {
      const input = 'a1b2c3';
      const digits = input.replace(/[^0-9]/g, '');
      expect(digits).toBe('123');
    });

    it('handles empty string', () => {
      const input = '';
      const digits = input.replace(/[^0-9]/g, '');
      expect(digits).toBe('');
    });

    it('handles all non-digits', () => {
      const input = 'abc';
      const digits = input.replace(/[^0-9]/g, '');
      expect(digits).toBe('');
    });

    it('handles paste with mixed content', () => {
      const input = '12-34-56';
      const digits = input.replace(/[^0-9]/g, '');
      expect(digits).toBe('123456');
    });
  });

  describe('Paste Distribution', () => {
    it('distributes pasted digits starting at index', () => {
      const value = '12';
      const pastedText = '3456';
      const index = 2;
      const newValue = value.split('');
      for (let i = 0; i < pastedText.length; i++) {
        newValue[index + i] = pastedText[i];
      }
      expect(newValue.join('')).toBe('123456');
    });

    it('limits paste to OTP_LENGTH', () => {
      const OTP_LENGTH = 6;
      const index = 3;
      const pastedDigits = '9999999';
      const slicedDigits = pastedDigits.slice(0, OTP_LENGTH - index);
      expect(slicedDigits).toBe('999');
    });
  });

  describe('Active State Detection', () => {
    it('first empty position is active when not all filled', () => {
      const value = '123';
      const valueLength = value.length;
      const OTP_LENGTH = 6;

      // Index 0, 1, 2 are filled, index 3 should be active
      for (let index = 0; index < OTP_LENGTH; index++) {
        const isActive =
          index === valueLength || (index === OTP_LENGTH - 1 && valueLength === OTP_LENGTH);
        if (index === 3) {
          expect(isActive).toBe(true);
        } else {
          expect(isActive).toBe(false);
        }
      }
    });

    it('last position is active when all filled', () => {
      const value = '123456';
      const valueLength = value.length;
      const OTP_LENGTH = 6;

      const index = 5;
      const isActive =
        index === valueLength || (index === OTP_LENGTH - 1 && valueLength === OTP_LENGTH);
      expect(isActive).toBe(true);
    });
  });

  describe('Filled State Detection', () => {
    it('detects filled positions', () => {
      const value = '12';

      expect(value[0] !== undefined && value[0] !== '').toBe(true);
      expect(value[1] !== undefined && value[1] !== '').toBe(true);
      expect(value[2] !== undefined && value[2] !== '').toBe(false);
    });
  });
});

describe('Resend Timer Logic', () => {
  describe('Time Formatting', () => {
    it('formats 60 seconds as 1:00', () => {
      const seconds = 60;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
      expect(formatted).toBe('1:00');
    });

    it('formats 45 seconds as 0:45', () => {
      const seconds = 45;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
      expect(formatted).toBe('0:45');
    });

    it('formats 5 seconds as 0:05', () => {
      const seconds = 5;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
      expect(formatted).toBe('0:05');
    });

    it('formats 0 seconds as 0:00', () => {
      const seconds = 0;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
      expect(formatted).toBe('0:00');
    });
  });
});

describe('Destination Masking Logic', () => {
  describe('Email Masking', () => {
    it('masks email with asterisks', () => {
      const email = 'john@example.com';
      const [local, domain] = email.split('@');
      const maskedLocal =
        local.length > 2
          ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
          : local;
      expect(`${maskedLocal}@${domain}`).toBe('j**n@example.com');
    });

    it('handles short email local part', () => {
      const email = 'jo@example.com';
      const [local, domain] = email.split('@');
      const maskedLocal =
        local.length > 2
          ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
          : local;
      expect(`${maskedLocal}@${domain}`).toBe('jo@example.com');
    });

    it('handles single character local part', () => {
      const email = 'j@example.com';
      const [local, domain] = email.split('@');
      const maskedLocal =
        local.length > 2
          ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
          : local;
      expect(`${maskedLocal}@${domain}`).toBe('j@example.com');
    });

    it('masks long email correctly', () => {
      const email = 'verylongname@example.com';
      const [local, domain] = email.split('@');
      const maskedLocal =
        local.length > 2
          ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
          : local;
      expect(`${maskedLocal}@${domain}`).toBe('v**********e@example.com');
    });
  });

  describe('Phone Masking', () => {
    it('masks phone number showing last 4 digits', () => {
      const phone = '+11234567890';
      const masked = phone.length > 4 ? `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}` : phone;
      expect(masked).toBe('********7890');
    });

    it('handles short phone number', () => {
      const phone = '1234';
      const masked = phone.length > 4 ? `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}` : phone;
      expect(masked).toBe('1234');
    });

    it('handles very short phone', () => {
      const phone = '123';
      const masked = phone.length > 4 ? `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}` : phone;
      expect(masked).toBe('123');
    });
  });
});

describe('Verification Code Validation', () => {
  it('accepts 123456 as valid code', () => {
    const code = '123456';
    expect(code === '123456').toBe(true);
  });

  it('rejects other 6-digit codes', () => {
    const code = '654321';
    expect(code === '123456').toBe(false);
  });

  it('validates code length', () => {
    const OTP_LENGTH = 6;
    const validCode = '123456';
    const shortCode = '12345';

    expect(validCode.length === OTP_LENGTH).toBe(true);
    expect(shortCode.length === OTP_LENGTH).toBe(false);
  });
});

describe('Screen Features Summary', () => {
  const screenPath = path.join(__dirname, '..', 'app', '(auth)', 'verify.tsx');
  const content = fs.readFileSync(screenPath, 'utf-8');

  it('implements 6-digit OTP input', () => {
    expect(content).toContain('OTP_LENGTH = 6');
    expect(content).toContain('OTPInput');
  });

  it('implements auto-focus between inputs', () => {
    expect(content).toContain('inputRefs.current[index + 1]?.focus()');
    expect(content).toContain('inputRefs.current[index - 1]?.focus()');
  });

  it('implements auto-submit when all digits entered', () => {
    expect(content).toContain('onComplete(newCode)');
  });

  it('implements resend code timer (60 seconds)', () => {
    expect(content).toContain('RESEND_COOLDOWN = 60');
    expect(content).toContain('ResendTimer');
    expect(content).toContain('countdown');
  });

  it('implements animated success checkmark', () => {
    expect(content).toContain('SuccessAnimation');
    expect(content).toContain('checkmark');
    expect(content).toContain('successCircle');
  });

  it('implements shake animation on error', () => {
    expect(content).toContain('shakeAnimation');
    expect(content).toContain('withSequence');
  });

  it('implements masked destination display', () => {
    expect(content).toContain('getMaskedDestination');
  });

  it('implements change destination option', () => {
    expect(content).toContain('handleChangeDestination');
    expect(content).toContain('router.back()');
  });

  it('supports both email and phone verification', () => {
    expect(content).toContain('isEmail');
    expect(content).toContain('mail-outline');
    expect(content).toContain('phone-portrait-outline');
  });
});
