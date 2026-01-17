/**
 * Add Card Screen Tests
 *
 * Comprehensive tests for the add card screen including:
 * - File structure and exports
 * - Validation functions (Luhn algorithm, expiry validation)
 * - Helper functions (formatting, card detection)
 * - Form schema validation
 * - Component structure
 * - Animation configuration
 * - Accessibility
 * - Store integration
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ============================================================================
// Test Setup
// ============================================================================

const addCardPath = path.join(__dirname, '../app/order/add-card.tsx');
const addCardContent = fs.readFileSync(addCardPath, 'utf8');

const rootLayoutPath = path.join(__dirname, '../app/_layout.tsx');
const rootLayoutContent = fs.readFileSync(rootLayoutPath, 'utf8');

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Add Card Screen - File Structure', () => {
  it('should exist at the correct path', () => {
    expect(fs.existsSync(addCardPath)).toBe(true);
  });

  it('should export default component', () => {
    expect(addCardContent).toContain('export default function AddCardScreen');
  });

  it('should have proper file documentation', () => {
    expect(addCardContent).toContain('Add Card Screen');
    expect(addCardContent).toContain('Features:');
  });
});

// ============================================================================
// Export Tests
// ============================================================================

describe('Add Card Screen - Exports', () => {
  it('should export CARD_NUMBER_MAX_LENGTH constant', () => {
    expect(addCardContent).toContain('export const CARD_NUMBER_MAX_LENGTH = 19');
  });

  it('should export EXPIRY_MAX_LENGTH constant', () => {
    expect(addCardContent).toContain('export const EXPIRY_MAX_LENGTH = 5');
  });

  it('should export CVV_MAX_LENGTH constant', () => {
    expect(addCardContent).toContain('export const CVV_MAX_LENGTH = 4');
  });

  it('should export NAME_MIN_LENGTH constant', () => {
    expect(addCardContent).toContain('export const NAME_MIN_LENGTH = 2');
  });

  it('should export isValidLuhn function', () => {
    expect(addCardContent).toContain('export function isValidLuhn');
  });

  it('should export isValidExpiry function', () => {
    expect(addCardContent).toContain('export function isValidExpiry');
  });

  it('should export parseExpiry function', () => {
    expect(addCardContent).toContain('export function parseExpiry');
  });

  it('should export cardFormSchema', () => {
    expect(addCardContent).toContain('export const cardFormSchema');
  });

  it('should export CardFormData type', () => {
    expect(addCardContent).toContain('export type CardFormData');
  });

  it('should export formatCardNumber function', () => {
    expect(addCardContent).toContain('export function formatCardNumber');
  });

  it('should export formatExpiryDate function', () => {
    expect(addCardContent).toContain('export function formatExpiryDate');
  });

  it('should export getCvvLength function', () => {
    expect(addCardContent).toContain('export function getCvvLength');
  });

  it('should export getCardBrandColor function', () => {
    expect(addCardContent).toContain('export function getCardBrandColor');
  });

  it('should export getCardBrandName function', () => {
    expect(addCardContent).toContain('export function getCardBrandName');
  });

  it('should export CardBrandIcon component', () => {
    expect(addCardContent).toContain('export function CardBrandIcon');
  });
});

// ============================================================================
// Luhn Algorithm Tests
// ============================================================================

describe('Add Card Screen - isValidLuhn', () => {
  // Test the function documentation
  it('should have proper documentation', () => {
    expect(addCardContent).toContain('Validates card number using Luhn algorithm');
  });

  // Test valid card numbers
  it('should validate the Luhn algorithm implementation for valid cards', () => {
    // The function checks:
    // 1. Contains only digits (after removing spaces)
    // 2. Length between 13 and 19
    // 3. Passes Luhn checksum
    expect(addCardContent).toContain("const cleanNumber = cardNumber.replace(/\\s/g, '')");
    expect(addCardContent).toContain('if (!/^\\d+$/.test(cleanNumber)) return false');
    expect(addCardContent).toContain(
      'if (cleanNumber.length < 13 || cleanNumber.length > 19) return false'
    );
    expect(addCardContent).toContain('return sum % 10 === 0');
  });

  it('should handle non-digit characters', () => {
    expect(addCardContent).toContain('if (!/^\\d+$/.test(cleanNumber)) return false');
  });

  it('should check card length constraints', () => {
    expect(addCardContent).toContain('cleanNumber.length < 13');
    expect(addCardContent).toContain('cleanNumber.length > 19');
  });

  it('should implement Luhn checksum calculation', () => {
    expect(addCardContent).toContain('digit *= 2');
    expect(addCardContent).toContain('digit -= 9');
    expect(addCardContent).toContain('sum += digit');
    expect(addCardContent).toContain('isEven = !isEven');
  });
});

// ============================================================================
// Expiry Validation Tests
// ============================================================================

describe('Add Card Screen - isValidExpiry', () => {
  it('should have proper documentation', () => {
    expect(addCardContent).toContain('Validates expiry date is not in the past');
  });

  it('should get current date for comparison', () => {
    expect(addCardContent).toContain('const now = new Date()');
    expect(addCardContent).toContain('const currentYear = now.getFullYear() % 100');
    expect(addCardContent).toContain('const currentMonth = now.getMonth() + 1');
  });

  it('should reject past years', () => {
    expect(addCardContent).toContain('if (year < currentYear) return false');
  });

  it('should reject past months in current year', () => {
    expect(addCardContent).toContain(
      'if (year === currentYear && month < currentMonth) return false'
    );
  });
});

// ============================================================================
// parseExpiry Tests
// ============================================================================

describe('Add Card Screen - parseExpiry', () => {
  it('should have proper documentation', () => {
    expect(addCardContent).toContain('Parses expiry string (MM/YY) to month and year');
  });

  it('should use regex to parse MM/YY format', () => {
    expect(addCardContent).toContain('/^(\\d{2})\\/(\\d{2})$/');
  });

  it('should return null for invalid format', () => {
    expect(addCardContent).toContain('if (!match) return null');
  });

  it('should return month and year as numbers', () => {
    expect(addCardContent).toContain('month: parseInt(match[1], 10)');
    expect(addCardContent).toContain('year: parseInt(match[2], 10)');
  });
});

// ============================================================================
// Form Schema Tests
// ============================================================================

describe('Add Card Screen - cardFormSchema', () => {
  it('should use zod for validation', () => {
    expect(addCardContent).toContain("import { z } from 'zod'");
    expect(addCardContent).toContain('z.object');
  });

  it('should validate card number with custom refinement', () => {
    expect(addCardContent).toContain(".refine((val) => isValidLuhn(val), 'Invalid card number')");
  });

  it('should validate expiry format', () => {
    expect(addCardContent).toContain(".regex(/^\\d{2}\\/\\d{2}$/, 'Use MM/YY format')");
  });

  it('should validate expiry month is between 1 and 12', () => {
    expect(addCardContent).toContain('parsed.month >= 1 && parsed.month <= 12');
  });

  it('should validate expiry is not in the past', () => {
    expect(addCardContent).toContain('return isValidExpiry(parsed.month, parsed.year)');
  });

  it('should validate CVV length', () => {
    expect(addCardContent).toContain(".min(3, 'CVV must be at least 3 digits')");
    expect(addCardContent).toContain(".max(4, 'CVV must be at most 4 digits')");
  });

  it('should validate cardholder name', () => {
    expect(addCardContent).toContain(".min(NAME_MIN_LENGTH, 'Name is required')");
  });

  it('should have saveCard boolean with default true', () => {
    expect(addCardContent).toContain('saveCard: z.boolean().default(true)');
  });
});

// ============================================================================
// Format Functions Tests
// ============================================================================

describe('Add Card Screen - formatCardNumber', () => {
  it('should have proper documentation', () => {
    expect(addCardContent).toContain('Formats card number with spaces every 4 digits');
  });

  it('should remove existing spaces', () => {
    expect(addCardContent).toContain("value.replace(/\\s/g, '')");
  });

  it('should remove non-digit characters', () => {
    expect(addCardContent).toContain(".replace(/\\D/g, '')");
  });

  it('should group into sets of 4', () => {
    expect(addCardContent).toContain('cleanValue.match(/.{1,4}/g)');
  });

  it('should join groups with spaces', () => {
    expect(addCardContent).toContain("groups.join(' ')");
  });
});

describe('Add Card Screen - formatExpiryDate', () => {
  it('should have proper documentation', () => {
    expect(addCardContent).toContain('Formats expiry date as MM/YY');
  });

  it('should remove non-digit characters', () => {
    expect(addCardContent).toContain("value.replace(/\\D/g, '')");
  });

  it('should insert slash after 2 digits', () => {
    expect(addCardContent).toContain('cleanValue.slice(0, 2)');
    expect(addCardContent).toContain('cleanValue.slice(2, 4)');
  });
});

describe('Add Card Screen - getCvvLength', () => {
  it('should return 4 for Amex', () => {
    expect(addCardContent).toContain("return brand === 'amex' ? 4 : 3");
  });

  it('should return 3 for other brands', () => {
    expect(addCardContent).toContain('? 4 : 3');
  });
});

// ============================================================================
// Card Brand Functions Tests
// ============================================================================

describe('Add Card Screen - getCardBrandColor', () => {
  it('should have colors for all card brands', () => {
    expect(addCardContent).toContain("case 'visa':");
    expect(addCardContent).toContain("return '#1A1F71'");
    expect(addCardContent).toContain("case 'mastercard':");
    expect(addCardContent).toContain("return '#EB001B'");
    expect(addCardContent).toContain("case 'amex':");
    expect(addCardContent).toContain("return '#006FCF'");
    expect(addCardContent).toContain("case 'discover':");
    expect(addCardContent).toContain("return '#FF6000'");
  });

  it('should return default color for unknown brand', () => {
    expect(addCardContent).toContain('return NeutralColors[400]');
  });
});

describe('Add Card Screen - getCardBrandName', () => {
  it('should have names for all card brands', () => {
    expect(addCardContent).toContain("return 'Visa'");
    expect(addCardContent).toContain("return 'Mastercard'");
    expect(addCardContent).toContain("return 'American Express'");
    expect(addCardContent).toContain("return 'Discover'");
  });

  it('should return empty string for unknown brand', () => {
    expect(addCardContent).toMatch(/getCardBrandName[\s\S]*?return '';/);
  });
});

// ============================================================================
// Component Tests
// ============================================================================

describe('Add Card Screen - Header Component', () => {
  it('should have Header component', () => {
    expect(addCardContent).toContain('function Header({ onBack, colors }: HeaderProps)');
  });

  it('should have back button', () => {
    expect(addCardContent).toContain('testID="add-card-back-button"');
  });

  it('should display "Add Card" title', () => {
    expect(addCardContent).toContain('>Add Card<');
  });

  it('should have FadeInDown animation', () => {
    expect(addCardContent).toContain(
      'entering={FadeInDown.duration(AnimationDurations.normal).delay(100)}'
    );
  });
});

describe('Add Card Screen - CardBrandIcon Component', () => {
  it('should have CardBrandIcon component', () => {
    expect(addCardContent).toContain(
      'export function CardBrandIcon({ brand, size = 32 }: CardBrandIconProps)'
    );
  });

  it('should show placeholder for no brand', () => {
    expect(addCardContent).toContain('testID="card-brand-icon-placeholder"');
  });

  it('should show brand-specific testID', () => {
    expect(addCardContent).toContain('testID={`card-brand-icon-${brand}`}');
  });

  it('should display brand letter', () => {
    expect(addCardContent).toContain("case 'visa':");
    expect(addCardContent).toContain("return 'V'");
    expect(addCardContent).toContain("return 'M'");
    expect(addCardContent).toContain("return 'A'");
    expect(addCardContent).toContain("return 'D'");
  });
});

describe('Add Card Screen - FormInput Component', () => {
  it('should have FormInput component', () => {
    expect(addCardContent).toContain('function FormInput({');
  });

  it('should have label display', () => {
    expect(addCardContent).toContain('<Text style={[styles.inputLabel');
  });

  it('should have error display', () => {
    expect(addCardContent).toContain('testID={`${testID}-error`}');
  });

  it('should handle focus state', () => {
    expect(addCardContent).toContain('const [isFocused, setIsFocused] = useState(false)');
    expect(addCardContent).toContain('const handleFocus = useCallback(() => setIsFocused(true)');
  });

  it('should change border color based on state', () => {
    expect(addCardContent).toContain('borderColor: error');
    expect(addCardContent).toContain('ErrorColors[500]');
    expect(addCardContent).toContain('PrimaryColors[500]');
  });

  it('should support rightContent', () => {
    expect(addCardContent).toContain('rightContent?: React.ReactNode');
    expect(addCardContent).toContain('{rightContent}');
  });
});

describe('Add Card Screen - SaveCardToggle Component', () => {
  it('should have SaveCardToggle component', () => {
    expect(addCardContent).toContain(
      'function SaveCardToggle({ value, onToggle, colors }: SaveCardToggleProps)'
    );
  });

  it('should have Switch component', () => {
    expect(addCardContent).toContain('<Switch');
    expect(addCardContent).toContain('value={value}');
    expect(addCardContent).toContain('onValueChange={onToggle}');
  });

  it('should have testID', () => {
    expect(addCardContent).toContain('testID="save-card-toggle"');
  });

  it('should have descriptive text', () => {
    expect(addCardContent).toContain('Save card for future use');
    expect(addCardContent).toContain('Securely store this card for faster checkout');
  });
});

describe('Add Card Screen - SubmitButton Component', () => {
  it('should have SubmitButton component', () => {
    expect(addCardContent).toContain(
      'function SubmitButton({ onPress, isLoading, isDisabled }: SubmitButtonProps)'
    );
  });

  it('should have testID', () => {
    expect(addCardContent).toContain('testID="submit-card-button"');
  });

  it('should show loading state', () => {
    expect(addCardContent).toContain("'Adding card...'");
    expect(addCardContent).toContain('>Adding Card...</');
  });

  it('should have press animation', () => {
    expect(addCardContent).toContain('scale.value = withSpring(0.97, SPRING_CONFIG)');
  });

  it('should be disabled when loading or invalid', () => {
    expect(addCardContent).toContain('disabled={isDisabled || isLoading}');
  });
});

describe('Add Card Screen - CardPreview Component', () => {
  it('should have CardPreview component', () => {
    expect(addCardContent).toContain(
      'function CardPreview({ cardNumber, expiry, cardholderName, brand, colors }: CardPreviewProps)'
    );
  });

  it('should have testID', () => {
    expect(addCardContent).toContain('testID="card-preview"');
  });

  it('should display placeholder values', () => {
    expect(addCardContent).toContain("'•••• •••• •••• ••••'");
    expect(addCardContent).toContain("'MM/YY'");
    expect(addCardContent).toContain("'YOUR NAME'");
  });

  it('should display card holder label', () => {
    expect(addCardContent).toContain('CARD HOLDER');
  });

  it('should display expires label', () => {
    expect(addCardContent).toContain('EXPIRES');
  });

  it('should use standard credit card aspect ratio', () => {
    expect(addCardContent).toContain('aspectRatio: 1.586');
  });
});

// ============================================================================
// Main Component Tests
// ============================================================================

describe('Add Card Screen - Main Component', () => {
  it('should use react-hook-form', () => {
    expect(addCardContent).toContain("import { Controller, useForm } from 'react-hook-form'");
    expect(addCardContent).toContain('useForm<CardFormData>');
    expect(addCardContent).toContain('zodResolver(cardFormSchema)');
  });

  it('should use payment store', () => {
    expect(addCardContent).toContain('usePaymentStore');
    expect(addCardContent).toContain('addPaymentMethod');
  });

  it('should detect card brand', () => {
    expect(addCardContent).toContain('detectCardBrand');
    expect(addCardContent).toContain('setDetectedBrand');
  });

  it('should have loading state', () => {
    expect(addCardContent).toContain('const [isLoading, setIsLoading] = useState(false)');
  });

  it('should use safe area insets', () => {
    expect(addCardContent).toContain('useSafeAreaInsets');
  });

  it('should have keyboard avoiding view', () => {
    expect(addCardContent).toContain('<KeyboardAvoidingView');
    expect(addCardContent).toContain("behavior={Platform.OS === 'ios' ? 'padding' : 'height'}");
  });

  it('should have touch to dismiss keyboard', () => {
    expect(addCardContent).toContain('<TouchableWithoutFeedback onPress={Keyboard.dismiss}');
  });
});

// ============================================================================
// Form Fields Tests
// ============================================================================

describe('Add Card Screen - Form Fields', () => {
  it('should have card number input', () => {
    expect(addCardContent).toContain('testID="card-number-input"');
    expect(addCardContent).toContain('label="Card Number"');
    expect(addCardContent).toContain('placeholder="1234 5678 9012 3456"');
  });

  it('should have expiry input', () => {
    expect(addCardContent).toContain('testID="expiry-input"');
    expect(addCardContent).toContain('label="Expiry Date"');
    expect(addCardContent).toContain('placeholder="MM/YY"');
  });

  it('should have CVV input', () => {
    expect(addCardContent).toContain('testID="cvv-input"');
    expect(addCardContent).toContain('secureTextEntry');
  });

  it('should show different CVV label for Amex', () => {
    expect(addCardContent).toContain("detectedBrand === 'amex' ? 'CVV (4 digits)' : 'CVV'");
  });

  it('should show different CVV placeholder for Amex', () => {
    expect(addCardContent).toContain("detectedBrand === 'amex' ? '••••' : '•••'");
  });

  it('should have cardholder name input', () => {
    expect(addCardContent).toContain('testID="cardholder-name-input"');
    expect(addCardContent).toContain('label="Cardholder Name"');
    expect(addCardContent).toContain('placeholder="John Doe"');
  });
});

// ============================================================================
// Form Handlers Tests
// ============================================================================

describe('Add Card Screen - Form Handlers', () => {
  it('should have handleBack function', () => {
    expect(addCardContent).toContain('const handleBack = useCallback');
    expect(addCardContent).toContain('router.back()');
  });

  it('should have handleCardNumberChange function', () => {
    expect(addCardContent).toContain('const handleCardNumberChange = useCallback');
    expect(addCardContent).toContain('formatCardNumber(text)');
  });

  it('should have handleExpiryChange function', () => {
    expect(addCardContent).toContain('const handleExpiryChange = useCallback');
    expect(addCardContent).toContain('formatExpiryDate(text)');
  });

  it('should have handleSaveCardToggle function', () => {
    expect(addCardContent).toContain('const handleSaveCardToggle = useCallback');
  });

  it('should have onSubmit function', () => {
    expect(addCardContent).toContain('const onSubmit = useCallback');
  });
});

// ============================================================================
// Form Submission Tests
// ============================================================================

describe('Add Card Screen - Form Submission', () => {
  it('should set loading state', () => {
    expect(addCardContent).toContain('setIsLoading(true)');
    expect(addCardContent).toContain('setIsLoading(false)');
  });

  it('should simulate API call', () => {
    expect(addCardContent).toContain('await new Promise((resolve) => setTimeout(resolve, 1000))');
  });

  it('should parse expiry date', () => {
    expect(addCardContent).toContain('const parsedExpiry = parseExpiry(data.expiry)');
  });

  it('should get last 4 digits', () => {
    expect(addCardContent).toContain("const cleanNumber = data.cardNumber.replace(/\\s/g, '')");
    expect(addCardContent).toContain('const last4 = cleanNumber.slice(-4)');
  });

  it('should create payment method object', () => {
    expect(addCardContent).toContain('const paymentMethod = {');
    expect(addCardContent).toContain('generatePaymentMethodId()');
    expect(addCardContent).toContain("type: 'card' as const");
    expect(addCardContent).toContain('brand: detectedBrand');
  });

  it('should add payment method to store', () => {
    expect(addCardContent).toContain('addPaymentMethod(paymentMethod)');
  });

  it('should navigate back on success', () => {
    expect(addCardContent).toContain('router.back()');
  });

  it('should show error alert on failure', () => {
    expect(addCardContent).toContain(
      "Alert.alert('Error', 'Failed to add card. Please try again.')"
    );
  });
});

// ============================================================================
// Animation Tests
// ============================================================================

describe('Add Card Screen - Animations', () => {
  it('should use reanimated', () => {
    expect(addCardContent).toContain("from 'react-native-reanimated'");
  });

  it('should have spring config', () => {
    expect(addCardContent).toContain('const SPRING_CONFIG = {');
    expect(addCardContent).toContain('damping: 15');
    expect(addCardContent).toContain('stiffness: 200');
  });

  it('should use FadeIn animations', () => {
    expect(addCardContent).toContain('FadeIn');
    expect(addCardContent).toContain('FadeInDown');
    expect(addCardContent).toContain('FadeInUp');
  });

  it('should use withSpring for press animations', () => {
    expect(addCardContent).toContain('withSpring');
  });

  it('should have staggered delays', () => {
    expect(addCardContent).toContain('delay={100}');
    expect(addCardContent).toContain('delay={200}');
    expect(addCardContent).toContain('delay={300}');
  });

  it('should have SaveCardToggle and SubmitButton with delays', () => {
    expect(addCardContent).toContain('delay(400)');
    expect(addCardContent).toContain('delay(500)');
  });
});

// ============================================================================
// Styling Tests
// ============================================================================

describe('Add Card Screen - Styling', () => {
  it('should use design system tokens', () => {
    expect(addCardContent).toContain("from '@/constants/theme'");
    expect(addCardContent).toContain('BorderRadius');
    expect(addCardContent).toContain('Spacing');
    expect(addCardContent).toContain('Typography');
    expect(addCardContent).toContain('FontWeights');
    expect(addCardContent).toContain('Shadows');
  });

  it('should have styles object', () => {
    expect(addCardContent).toContain('const styles = StyleSheet.create({');
  });

  it('should have container style', () => {
    expect(addCardContent).toContain('container: {');
    expect(addCardContent).toContain('flex: 1');
  });

  it('should have header styles', () => {
    expect(addCardContent).toContain('header: {');
    expect(addCardContent).toContain('headerTitle: {');
    expect(addCardContent).toContain('backButton: {');
  });

  it('should have form styles', () => {
    expect(addCardContent).toContain('form: {');
    expect(addCardContent).toContain('inputContainer: {');
    expect(addCardContent).toContain('inputLabel: {');
    expect(addCardContent).toContain('inputWrapper: {');
    expect(addCardContent).toContain('input: {');
  });

  it('should have card preview styles', () => {
    expect(addCardContent).toContain('cardPreview: {');
    expect(addCardContent).toContain('cardPreviewNumber: {');
    expect(addCardContent).toContain('cardPreviewFooter: {');
  });

  it('should have button styles', () => {
    expect(addCardContent).toContain('submitButton: {');
    expect(addCardContent).toContain('submitButtonText: {');
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('Add Card Screen - Accessibility', () => {
  it('should have accessibility labels', () => {
    expect(addCardContent).toContain('accessibilityLabel=');
  });

  it('should have accessibility roles', () => {
    expect(addCardContent).toContain('accessibilityRole="button"');
  });

  it('should have accessibility states', () => {
    expect(addCardContent).toContain('accessibilityState=');
  });

  it('should have testIDs for all interactive elements', () => {
    expect(addCardContent).toContain('testID="add-card-back-button"');
    expect(addCardContent).toContain('testID="card-number-input"');
    expect(addCardContent).toContain('testID="expiry-input"');
    expect(addCardContent).toContain('testID="cvv-input"');
    expect(addCardContent).toContain('testID="cardholder-name-input"');
    expect(addCardContent).toContain('testID="save-card-toggle"');
    expect(addCardContent).toContain('testID="submit-card-button"');
    expect(addCardContent).toContain('testID="card-preview"');
  });
});

// ============================================================================
// Security Notice Tests
// ============================================================================

describe('Add Card Screen - Security Notice', () => {
  it('should have security notice', () => {
    expect(addCardContent).toContain('Your card information is encrypted and secure');
  });

  it('should have shield icon', () => {
    expect(addCardContent).toContain('shield-checkmark-outline');
  });

  it('should use success color for security icon', () => {
    expect(addCardContent).toContain('SuccessColors[600]');
  });
});

// ============================================================================
// Import Tests
// ============================================================================

describe('Add Card Screen - Imports', () => {
  it('should import from expo-router', () => {
    expect(addCardContent).toContain("import { useRouter } from 'expo-router'");
  });

  it('should import from react-hook-form', () => {
    expect(addCardContent).toContain("from 'react-hook-form'");
  });

  it('should import zodResolver', () => {
    expect(addCardContent).toContain("import { zodResolver } from '@hookform/resolvers/zod'");
  });

  it('should import from stores', () => {
    expect(addCardContent).toContain("from '@/stores'");
    expect(addCardContent).toContain('detectCardBrand');
    expect(addCardContent).toContain('generatePaymentMethodId');
    expect(addCardContent).toContain('usePaymentStore');
  });

  it('should import CardBrand type', () => {
    expect(addCardContent).toContain("import type { CardBrand } from '@/types'");
  });

  it('should import Ionicons', () => {
    expect(addCardContent).toContain("import { Ionicons } from '@expo/vector-icons'");
  });

  it('should import safe area context', () => {
    expect(addCardContent).toContain(
      "import { useSafeAreaInsets } from 'react-native-safe-area-context'"
    );
  });
});

// ============================================================================
// Root Layout Integration Tests
// ============================================================================

describe('Add Card Screen - Root Layout Integration', () => {
  it('should have add-card route in root layout', () => {
    expect(rootLayoutContent).toContain('name="order/add-card"');
  });

  it('should use slide_from_right animation', () => {
    // Find the add-card route config
    const addCardRouteMatch = rootLayoutContent.match(
      /name="order\/add-card"[\s\S]*?animation: 'slide_from_right'/
    );
    expect(addCardRouteMatch).not.toBeNull();
  });

  it('should have headerShown false', () => {
    // Find the add-card route config
    const addCardRouteMatch = rootLayoutContent.match(
      /name="order\/add-card"[\s\S]*?headerShown: false/
    );
    expect(addCardRouteMatch).not.toBeNull();
  });
});

// ============================================================================
// Payment Store Integration Tests
// ============================================================================

describe('Add Card Screen - Payment Store Integration', () => {
  const paymentStorePath = path.join(__dirname, '../stores/payment-store.ts');
  const paymentStoreContent = fs.readFileSync(paymentStorePath, 'utf8');

  it('should use generatePaymentMethodId from store', () => {
    expect(paymentStoreContent).toContain('export function generatePaymentMethodId');
    expect(addCardContent).toContain('generatePaymentMethodId()');
  });

  it('should use detectCardBrand from store', () => {
    expect(paymentStoreContent).toContain('export function detectCardBrand');
    expect(addCardContent).toContain('detectCardBrand');
  });

  it('should call addPaymentMethod on submit', () => {
    expect(addCardContent).toContain('addPaymentMethod(paymentMethod)');
  });
});

// ============================================================================
// Checkout Navigation Tests
// ============================================================================

describe('Add Card Screen - Checkout Navigation', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  const checkoutContent = fs.readFileSync(checkoutPath, 'utf8');

  it('should navigate to add-card from checkout', () => {
    expect(checkoutContent).toContain("router.push('/order/add-card' as never)");
  });

  it('should have AddNewCardButton in checkout', () => {
    expect(checkoutContent).toContain('AddNewCardButton');
    expect(checkoutContent).toContain('onAddNewCard');
  });
});

// ============================================================================
// Edge Case Tests
// ============================================================================

describe('Add Card Screen - Edge Cases', () => {
  it('should handle empty card number', () => {
    expect(addCardContent).toContain("'•••• •••• •••• ••••'");
  });

  it('should handle empty expiry', () => {
    expect(addCardContent).toContain("'MM/YY'");
  });

  it('should handle empty name', () => {
    expect(addCardContent).toContain("'YOUR NAME'");
  });

  it('should convert 2-digit year to 4-digit', () => {
    expect(addCardContent).toContain('expiryYear: 2000 + parsedExpiry.year');
  });

  it('should uppercase cardholder name in preview', () => {
    expect(addCardContent).toContain('cardholderName.toUpperCase()');
  });

  it('should use default brand color for unknown brands', () => {
    expect(addCardContent).toContain('return NeutralColors[400]');
  });
});

// ============================================================================
// useCallback/useMemo Optimization Tests
// ============================================================================

describe('Add Card Screen - Performance Optimizations', () => {
  it('should memoize handleBack', () => {
    expect(addCardContent).toContain('const handleBack = useCallback');
  });

  it('should memoize handleCardNumberChange', () => {
    expect(addCardContent).toContain('const handleCardNumberChange = useCallback');
  });

  it('should memoize handleExpiryChange', () => {
    expect(addCardContent).toContain('const handleExpiryChange = useCallback');
  });

  it('should memoize handleSaveCardToggle', () => {
    expect(addCardContent).toContain('const handleSaveCardToggle = useCallback');
  });

  it('should memoize onSubmit', () => {
    expect(addCardContent).toContain('const onSubmit = useCallback');
  });

  it('should memoize cvvMaxLength', () => {
    expect(addCardContent).toContain('const cvvMaxLength = useMemo');
  });
});

// ============================================================================
// Constants Validation Tests
// ============================================================================

describe('Add Card Screen - Constants Validation', () => {
  it('should have correct CARD_NUMBER_MAX_LENGTH', () => {
    // 16 digits + 3 spaces = 19
    expect(addCardContent).toContain('export const CARD_NUMBER_MAX_LENGTH = 19');
  });

  it('should have correct EXPIRY_MAX_LENGTH', () => {
    // MM/YY = 5
    expect(addCardContent).toContain('export const EXPIRY_MAX_LENGTH = 5');
  });

  it('should have correct CVV_MAX_LENGTH', () => {
    // Amex has 4-digit CVV
    expect(addCardContent).toContain('export const CVV_MAX_LENGTH = 4');
  });

  it('should have correct NAME_MIN_LENGTH', () => {
    expect(addCardContent).toContain('export const NAME_MIN_LENGTH = 2');
  });
});

// ============================================================================
// Card Brand Detection Tests
// ============================================================================

describe('Add Card Screen - Card Brand Detection', () => {
  it('should detect brand on card number change', () => {
    expect(addCardContent).toContain('useEffect(() => {');
    expect(addCardContent).toContain('detectCardBrand(cleanNumber)');
    expect(addCardContent).toContain('setDetectedBrand(brand)');
  });

  it('should clear brand when card number is empty', () => {
    expect(addCardContent).toContain('setDetectedBrand(undefined)');
  });

  it('should show brand icon in card number input', () => {
    expect(addCardContent).toContain('rightContent={');
    expect(addCardContent).toContain('detectedBrand && (');
    expect(addCardContent).toContain('<CardBrandIcon brand={detectedBrand}');
  });
});

// ============================================================================
// Form Validation Mode Tests
// ============================================================================

describe('Add Card Screen - Form Validation', () => {
  it('should use onChange validation mode', () => {
    expect(addCardContent).toContain("mode: 'onChange'");
  });

  it('should use zodResolver', () => {
    expect(addCardContent).toContain('resolver: zodResolver(cardFormSchema)');
  });

  it('should have default values', () => {
    expect(addCardContent).toContain('defaultValues: {');
    expect(addCardContent).toContain("cardNumber: ''");
    expect(addCardContent).toContain("expiry: ''");
    expect(addCardContent).toContain("cvv: ''");
    expect(addCardContent).toContain("cardholderName: ''");
    expect(addCardContent).toContain('saveCard: true');
  });
});
