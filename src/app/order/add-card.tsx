/**
 * Add Card Screen
 *
 * Screen for adding a new credit/debit card payment method.
 *
 * Features:
 * - Card number input with formatting (groups of 4 digits)
 * - Expiry date (MM/YY) input with auto-formatting
 * - CVV input with masking
 * - Cardholder name input
 * - Card type auto-detection with icon display
 * - Save card toggle for future use
 * - Form validation using react-hook-form + zod
 */

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import {
  AnimationDurations,
  BorderRadius,
  Colors,
  ErrorColors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  SuccessColors,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { detectCardBrand, generatePaymentMethodId, usePaymentStore } from '@/stores';
import type { CardBrand } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

export const CARD_NUMBER_MAX_LENGTH = 19; // 16 digits + 3 spaces
export const EXPIRY_MAX_LENGTH = 5; // MM/YY
export const CVV_MAX_LENGTH = 4; // 3 for most cards, 4 for Amex
export const NAME_MIN_LENGTH = 2;

// ============================================================================
// Validation Schema
// ============================================================================

/**
 * Validates card number using Luhn algorithm
 */
export function isValidLuhn(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleanNumber)) return false;
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validates expiry date is not in the past
 */
export function isValidExpiry(month: number, year: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Get 2-digit year
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

/**
 * Parses expiry string (MM/YY) to month and year
 */
export function parseExpiry(expiry: string): { month: number; year: number } | null {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return null;
  return {
    month: parseInt(match[1], 10),
    year: parseInt(match[2], 10),
  };
}

export const cardFormSchema = z.object({
  cardNumber: z
    .string()
    .min(13, 'Card number is too short')
    .refine((val) => isValidLuhn(val), 'Invalid card number'),
  expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, 'Use MM/YY format')
    .refine((val) => {
      const parsed = parseExpiry(val);
      if (!parsed) return false;
      return parsed.month >= 1 && parsed.month <= 12;
    }, 'Invalid month')
    .refine((val) => {
      const parsed = parseExpiry(val);
      if (!parsed) return false;
      return isValidExpiry(parsed.month, parsed.year);
    }, 'Card has expired'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits').max(4, 'CVV must be at most 4 digits'),
  cardholderName: z.string().min(NAME_MIN_LENGTH, 'Name is required'),
  saveCard: z.boolean().default(true),
});

export type CardFormData = z.infer<typeof cardFormSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats card number with spaces every 4 digits
 */
export function formatCardNumber(value: string): string {
  const cleanValue = value.replace(/\s/g, '').replace(/\D/g, '');
  const groups = cleanValue.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleanValue;
}

/**
 * Formats expiry date as MM/YY
 */
export function formatExpiryDate(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
  }
  return cleanValue;
}

/**
 * Gets the CVV length based on card brand
 */
export function getCvvLength(brand?: CardBrand): number {
  return brand === 'amex' ? 4 : 3;
}

/**
 * Gets the card brand color for styling
 */
export function getCardBrandColor(brand?: CardBrand): string {
  switch (brand) {
    case 'visa':
      return '#1A1F71';
    case 'mastercard':
      return '#EB001B';
    case 'amex':
      return '#006FCF';
    case 'discover':
      return '#FF6000';
    default:
      return NeutralColors[400];
  }
}

/**
 * Gets the card brand display name
 */
export function getCardBrandName(brand?: CardBrand): string {
  switch (brand) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'American Express';
    case 'discover':
      return 'Discover';
    default:
      return '';
  }
}

// ============================================================================
// Sub-Components
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeaderProps {
  onBack: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Screen header with back button and title
 */
function Header({ onBack, colors }: HeaderProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(100)}
      style={[styles.header, { borderBottomColor: colors.divider }]}
    >
      <Pressable
        onPress={onBack}
        style={styles.backButton}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        testID="add-card-back-button"
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Add Card</Text>
      <View style={styles.headerSpacer} />
    </Animated.View>
  );
}

interface CardBrandIconProps {
  brand?: CardBrand;
  size?: number;
}

/**
 * Card brand icon display
 */
export function CardBrandIcon({ brand, size = 32 }: CardBrandIconProps) {
  const brandColor = getCardBrandColor(brand);

  // Simple colored card icon with brand letter
  const getBrandLetter = () => {
    switch (brand) {
      case 'visa':
        return 'V';
      case 'mastercard':
        return 'M';
      case 'amex':
        return 'A';
      case 'discover':
        return 'D';
      default:
        return '';
    }
  };

  if (!brand) {
    return (
      <View
        style={[
          styles.cardBrandIcon,
          { width: size, height: size * 0.65, backgroundColor: NeutralColors[100] },
        ]}
        testID="card-brand-icon-placeholder"
      >
        <Ionicons name="card-outline" size={size * 0.5} color={NeutralColors[400]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.cardBrandIcon,
        { width: size, height: size * 0.65, backgroundColor: brandColor },
      ]}
      testID={`card-brand-icon-${brand}`}
    >
      <Text style={[styles.cardBrandLetter, { fontSize: size * 0.4 }]}>{getBrandLetter()}</Text>
    </View>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'number-pad';
  maxLength?: number;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  colors: (typeof Colors)['light'];
  rightContent?: React.ReactNode;
  testID: string;
  delay?: number;
}

/**
 * Reusable form input with label and error display
 */
function FormInput({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  keyboardType = 'default',
  maxLength,
  secureTextEntry,
  autoCapitalize = 'none',
  colors,
  rightContent,
  testID,
  delay = 0,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur();
  }, [onBlur]);

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(delay)}
      style={styles.inputContainer}
    >
      <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: error ? ErrorColors[500] : isFocused ? PrimaryColors[500] : colors.border,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          style={[styles.input, { color: colors.text }]}
          accessibilityLabel={label}
          testID={testID}
        />
        {rightContent}
      </View>
      {error && (
        <Animated.Text
          entering={FadeIn.duration(AnimationDurations.fast)}
          style={[styles.inputError, { color: ErrorColors[500] }]}
          testID={`${testID}-error`}
        >
          {error}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

interface SaveCardToggleProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  colors: (typeof Colors)['light'];
}

/**
 * Toggle for saving card for future use
 */
function SaveCardToggle({ value, onToggle, colors }: SaveCardToggleProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal).delay(400)}
      style={[styles.toggleContainer, { backgroundColor: colors.backgroundSecondary }]}
    >
      <View style={styles.toggleContent}>
        <Ionicons name="bookmark-outline" size={20} color={PrimaryColors[500]} />
        <View style={styles.toggleTextContainer}>
          <Text style={[styles.toggleTitle, { color: colors.text }]}>Save card for future use</Text>
          <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>
            Securely store this card for faster checkout
          </Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: NeutralColors[300], true: PrimaryColors[200] }}
        thumbColor={value ? PrimaryColors[500] : NeutralColors[0]}
        ios_backgroundColor={NeutralColors[300]}
        accessibilityLabel="Save card for future use"
        testID="save-card-toggle"
      />
    </Animated.View>
  );
}

interface SubmitButtonProps {
  onPress: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

/**
 * Submit button with loading and disabled states
 */
function SubmitButton({ onPress, isLoading, isDisabled }: SubmitButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!isDisabled && !isLoading) {
      scale.value = withSpring(0.97, SPRING_CONFIG);
    }
  }, [scale, isDisabled, isLoading]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.duration(AnimationDurations.normal).delay(500)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled || isLoading}
        style={[
          styles.submitButton,
          {
            backgroundColor: isDisabled ? NeutralColors[300] : PrimaryColors[500],
            opacity: isLoading ? 0.7 : 1,
          },
          animatedStyle,
        ]}
        accessibilityLabel={isLoading ? 'Adding card...' : 'Add card'}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled || isLoading }}
        testID="submit-card-button"
      >
        {isLoading ? (
          <Text style={[styles.submitButtonText, { color: NeutralColors[0] }]}>Adding Card...</Text>
        ) : (
          <>
            <Ionicons name="add-circle-outline" size={20} color={NeutralColors[0]} />
            <Text style={[styles.submitButtonText, { color: NeutralColors[0] }]}>Add Card</Text>
          </>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

interface CardPreviewProps {
  cardNumber: string;
  expiry: string;
  cardholderName: string;
  brand?: CardBrand;
  colors: (typeof Colors)['light'];
}

/**
 * Visual card preview showing entered data
 */
function CardPreview({ cardNumber, expiry, cardholderName, brand, colors }: CardPreviewProps) {
  const brandColor = getCardBrandColor(brand);
  const displayNumber = cardNumber || '•••• •••• •••• ••••';
  const displayExpiry = expiry || 'MM/YY';
  const displayName = cardholderName.toUpperCase() || 'YOUR NAME';

  return (
    <Animated.View
      entering={FadeIn.duration(AnimationDurations.normal).delay(50)}
      style={[
        styles.cardPreview,
        {
          backgroundColor: brand ? brandColor : colors.card,
          ...Shadows.lg,
        },
      ]}
      testID="card-preview"
    >
      <View style={styles.cardPreviewHeader}>
        <Ionicons name="wifi" size={20} color={NeutralColors[0]} style={styles.cardChip} />
        <CardBrandIcon brand={brand} size={40} />
      </View>
      <Text style={styles.cardPreviewNumber}>{displayNumber}</Text>
      <View style={styles.cardPreviewFooter}>
        <View>
          <Text style={styles.cardPreviewLabel}>CARD HOLDER</Text>
          <Text style={styles.cardPreviewValue} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
        <View style={styles.cardPreviewExpiry}>
          <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
          <Text style={styles.cardPreviewValue}>{displayExpiry}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function AddCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { addPaymentMethod } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);
  const [detectedBrand, setDetectedBrand] = useState<CardBrand | undefined>();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    mode: 'onChange',
    defaultValues: {
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardholderName: '',
      saveCard: true,
    },
  });

  // Watch form values for card preview
  const cardNumber = watch('cardNumber');
  const expiry = watch('expiry');
  const cardholderName = watch('cardholderName');
  const saveCard = watch('saveCard');

  // Detect card brand as user types
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length >= 1) {
      const brand = detectCardBrand(cleanNumber);
      setDetectedBrand(brand);
    } else {
      setDetectedBrand(undefined);
    }
  }, [cardNumber]);

  // CVV max length based on card brand
  const cvvMaxLength = useMemo(() => getCvvLength(detectedBrand), [detectedBrand]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle card number formatting
  const handleCardNumberChange = useCallback(
    (text: string) => {
      const formatted = formatCardNumber(text);
      setValue('cardNumber', formatted, { shouldValidate: true });
    },
    [setValue]
  );

  // Handle expiry formatting
  const handleExpiryChange = useCallback(
    (text: string) => {
      const formatted = formatExpiryDate(text);
      setValue('expiry', formatted, { shouldValidate: true });
    },
    [setValue]
  );

  // Handle form submission
  const onSubmit = useCallback(
    async (data: CardFormData) => {
      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Parse expiry
        const parsedExpiry = parseExpiry(data.expiry);
        if (!parsedExpiry) {
          throw new Error('Invalid expiry date');
        }

        // Get last 4 digits
        const cleanNumber = data.cardNumber.replace(/\s/g, '');
        const last4 = cleanNumber.slice(-4);

        // Create payment method
        const paymentMethod = {
          id: generatePaymentMethodId(),
          type: 'card' as const,
          last4,
          brand: detectedBrand,
          expiryMonth: parsedExpiry.month,
          expiryYear: 2000 + parsedExpiry.year, // Convert 2-digit year to 4-digit
          isDefault: false,
        };

        // Add to store
        addPaymentMethod(paymentMethod);

        // Navigate back
        router.back();
      } catch {
        Alert.alert('Error', 'Failed to add card. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [addPaymentMethod, detectedBrand, router]
  );

  // Handle save card toggle
  const handleSaveCardToggle = useCallback(
    (value: boolean) => {
      setValue('saveCard', value);
    },
    [setValue]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.content, { paddingTop: insets.top }]}>
            <Header onBack={handleBack} colors={colors} />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Card Preview */}
              <CardPreview
                cardNumber={cardNumber}
                expiry={expiry}
                cardholderName={cardholderName}
                brand={detectedBrand}
                colors={colors}
              />

              {/* Form */}
              <View style={styles.form}>
                {/* Card Number */}
                <Controller
                  control={control}
                  name="cardNumber"
                  render={({ field: { onBlur } }) => (
                    <FormInput
                      label="Card Number"
                      value={cardNumber}
                      onChangeText={handleCardNumberChange}
                      onBlur={onBlur}
                      error={errors.cardNumber?.message}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="number-pad"
                      maxLength={CARD_NUMBER_MAX_LENGTH}
                      colors={colors}
                      rightContent={
                        detectedBrand && (
                          <Animated.View entering={FadeIn.duration(AnimationDurations.fast)}>
                            <CardBrandIcon brand={detectedBrand} size={28} />
                          </Animated.View>
                        )
                      }
                      testID="card-number-input"
                      delay={100}
                    />
                  )}
                />

                {/* Expiry and CVV Row */}
                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <Controller
                      control={control}
                      name="expiry"
                      render={({ field: { onBlur } }) => (
                        <FormInput
                          label="Expiry Date"
                          value={expiry}
                          onChangeText={handleExpiryChange}
                          onBlur={onBlur}
                          error={errors.expiry?.message}
                          placeholder="MM/YY"
                          keyboardType="number-pad"
                          maxLength={EXPIRY_MAX_LENGTH}
                          colors={colors}
                          testID="expiry-input"
                          delay={200}
                        />
                      )}
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Controller
                      control={control}
                      name="cvv"
                      render={({ field: { value, onChange, onBlur } }) => (
                        <FormInput
                          label={detectedBrand === 'amex' ? 'CVV (4 digits)' : 'CVV'}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={errors.cvv?.message}
                          placeholder={detectedBrand === 'amex' ? '••••' : '•••'}
                          keyboardType="number-pad"
                          maxLength={cvvMaxLength}
                          secureTextEntry
                          colors={colors}
                          testID="cvv-input"
                          delay={200}
                        />
                      )}
                    />
                  </View>
                </View>

                {/* Cardholder Name */}
                <Controller
                  control={control}
                  name="cardholderName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormInput
                      label="Cardholder Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.cardholderName?.message}
                      placeholder="John Doe"
                      autoCapitalize="words"
                      colors={colors}
                      testID="cardholder-name-input"
                      delay={300}
                    />
                  )}
                />

                {/* Save Card Toggle */}
                <SaveCardToggle value={saveCard} onToggle={handleSaveCardToggle} colors={colors} />
              </View>

              {/* Security Notice */}
              <Animated.View
                entering={FadeIn.duration(AnimationDurations.normal).delay(450)}
                style={styles.securityNotice}
              >
                <Ionicons name="shield-checkmark-outline" size={16} color={SuccessColors[600]} />
                <Text style={[styles.securityText, { color: colors.textSecondary }]}>
                  Your card information is encrypted and secure
                </Text>
              </Animated.View>
            </ScrollView>

            {/* Submit Button */}
            <View
              style={[
                styles.footer,
                { paddingBottom: insets.bottom + Spacing[4], backgroundColor: colors.background },
              ]}
            >
              <SubmitButton
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                isDisabled={!isValid}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing[1],
  },
  headerTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: FontWeights.semibold,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
  },
  cardPreview: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    marginBottom: Spacing[6],
    aspectRatio: 1.586, // Standard credit card aspect ratio
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[6],
  },
  cardChip: {
    transform: [{ rotate: '90deg' }],
  },
  cardPreviewNumber: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.medium,
    color: NeutralColors[0],
    letterSpacing: 2,
    marginBottom: Spacing[6],
  },
  cardPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPreviewExpiry: {
    alignItems: 'flex-end',
  },
  cardPreviewLabel: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    color: NeutralColors[200],
    marginBottom: Spacing[1],
  },
  cardPreviewValue: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.semibold,
    color: NeutralColors[0],
  },
  cardBrandIcon: {
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBrandLetter: {
    fontWeight: FontWeights.bold,
    color: NeutralColors[0],
  },
  form: {
    gap: Spacing[4],
  },
  inputContainer: {
    gap: Spacing[2],
  },
  inputLabel: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[4],
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
  },
  inputError: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  halfInput: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing[2],
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    flex: 1,
    marginRight: Spacing[3],
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium,
  },
  toggleSubtitle: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[1],
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    marginTop: Spacing[6],
    paddingVertical: Spacing[3],
  },
  securityText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
  },
  footer: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: NeutralColors[100],
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  submitButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold,
  },
});
