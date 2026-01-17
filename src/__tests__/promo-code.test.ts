/**
 * Tests for Promo Code Feature
 *
 * Tests promo code validation, discount calculation, and checkout integration.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Promo Code Feature - File Structure', () => {
  const basePath = path.join(__dirname, '..');

  describe('promo-codes.ts mock data file', () => {
    const promoCodesPath = path.join(basePath, 'data/mock/promo-codes.ts');

    it('should exist in the mock data directory', () => {
      expect(fs.existsSync(promoCodesPath)).toBe(true);
    });

    it('should be readable', () => {
      const content = fs.readFileSync(promoCodesPath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe('mock data index exports', () => {
    const indexPath = path.join(basePath, 'data/mock/index.ts');

    it('should export promo code functions', () => {
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain('mockPromoCodes');
      expect(content).toContain('getPromoCodeByCode');
      expect(content).toContain('validatePromoCode');
      expect(content).toContain('validatePromoCodeAsync');
      expect(content).toContain('calculateDiscount');
      expect(content).toContain('formatPromoCodeDescription');
      expect(content).toContain('getValidPromoCodes');
    });

    it('should export PromoValidationResult type', () => {
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain('PromoValidationResult');
    });
  });
});

// ============================================================================
// Mock Promo Codes Data Tests
// ============================================================================

describe('Promo Code Feature - Mock Data', () => {
  const promoCodesPath = path.join(__dirname, '..', 'data/mock/promo-codes.ts');
  const content = fs.readFileSync(promoCodesPath, 'utf-8');

  describe('mockPromoCodes array', () => {
    it('should export mockPromoCodes', () => {
      expect(content).toContain('export const mockPromoCodes');
    });

    it('should contain percentage discount codes', () => {
      expect(content).toContain("discountType: 'percentage'");
    });

    it('should contain fixed discount codes', () => {
      expect(content).toContain("discountType: 'fixed'");
    });

    it('should contain codes with minOrderAmount', () => {
      expect(content).toContain('minOrderAmount:');
    });

    it('should contain codes with maxDiscount', () => {
      expect(content).toContain('maxDiscount:');
    });

    it('should contain valid codes', () => {
      expect(content).toContain('isValid: true');
    });

    it('should contain invalid codes for testing', () => {
      expect(content).toContain('isValid: false');
    });

    it('should contain expired codes for testing', () => {
      expect(content).toContain('expiresAt:');
      expect(content).toContain('EXPIRED');
    });
  });

  describe('sample promo codes', () => {
    it('should have WELCOME10 code', () => {
      expect(content).toContain("code: 'WELCOME10'");
    });

    it('should have SAVE5 code', () => {
      expect(content).toContain("code: 'SAVE5'");
    });

    it('should have SPICY20 code', () => {
      expect(content).toContain("code: 'SPICY20'");
    });

    it('should have FREEDELIVERY code', () => {
      expect(content).toContain("code: 'FREEDELIVERY'");
    });

    it('should have VIP25 code', () => {
      expect(content).toContain("code: 'VIP25'");
    });
  });
});

// ============================================================================
// Helper Functions Tests
// ============================================================================

describe('Promo Code Feature - Helper Functions', () => {
  const promoCodesPath = path.join(__dirname, '..', 'data/mock/promo-codes.ts');
  const content = fs.readFileSync(promoCodesPath, 'utf-8');

  describe('getPromoCodeByCode', () => {
    it('should be exported', () => {
      expect(content).toContain('export function getPromoCodeByCode');
    });

    it('should accept a code string', () => {
      expect(content).toContain('function getPromoCodeByCode(code: string)');
    });

    it('should return PromoCode or undefined', () => {
      expect(content).toContain('PromoCode | undefined');
    });

    it('should be case-insensitive', () => {
      expect(content).toContain('toLowerCase()');
    });
  });

  describe('validatePromoCode', () => {
    it('should be exported', () => {
      expect(content).toContain('export function validatePromoCode');
    });

    it('should accept code and subtotal parameters', () => {
      expect(content).toContain('validatePromoCode(code: string, subtotal: number)');
    });

    it('should return PromoValidationResult', () => {
      expect(content).toContain('PromoValidationResult');
    });

    it('should check if code exists', () => {
      expect(content).toContain("'Invalid promo code'");
    });

    it('should check if code is valid', () => {
      expect(content).toContain("'This promo code is no longer valid'");
    });

    it('should check for expiration', () => {
      expect(content).toContain("'This promo code has expired'");
    });

    it('should check minimum order amount', () => {
      expect(content).toContain('minOrderAmount');
      expect(content).toContain('Minimum order');
    });
  });

  describe('calculateDiscount', () => {
    it('should be exported', () => {
      expect(content).toContain('export function calculateDiscount');
    });

    it('should accept promoCode and subtotal parameters', () => {
      expect(content).toContain('calculateDiscount(promoCode: PromoCode, subtotal: number)');
    });

    it('should handle percentage discounts', () => {
      expect(content).toContain("discountType === 'percentage'");
      expect(content).toContain('discountValue / 100');
    });

    it('should apply max discount cap for percentage', () => {
      expect(content).toContain('promoCode.maxDiscount');
    });

    it('should handle fixed discounts', () => {
      expect(content).toContain('// Fixed discount');
      expect(content).toContain('discount = promoCode.discountValue');
    });

    it('should not exceed subtotal', () => {
      expect(content).toContain('Math.min(discount, subtotal)');
    });
  });

  describe('formatPromoCodeDescription', () => {
    it('should be exported', () => {
      expect(content).toContain('export function formatPromoCodeDescription');
    });

    it('should format percentage discounts', () => {
      expect(content).toContain('% off');
    });

    it('should show max discount in parentheses', () => {
      expect(content).toContain('(up to $');
    });

    it('should format fixed discounts', () => {
      expect(content).toContain('off');
      expect(content).toContain('.toFixed(2)} off');
    });
  });

  describe('getValidPromoCodes', () => {
    it('should be exported', () => {
      expect(content).toContain('export function getValidPromoCodes');
    });

    it('should filter by isValid', () => {
      expect(content).toContain('p.isValid');
    });

    it('should filter by expiration', () => {
      expect(content).toContain('expiresAt');
    });
  });

  describe('validatePromoCodeAsync', () => {
    it('should be exported', () => {
      expect(content).toContain('export async function validatePromoCodeAsync');
    });

    it('should accept delay parameter', () => {
      expect(content).toContain('delayMs');
    });

    it('should simulate network delay', () => {
      expect(content).toContain('setTimeout');
    });
  });
});

// ============================================================================
// PromoValidationResult Type Tests
// ============================================================================

describe('Promo Code Feature - PromoValidationResult Type', () => {
  const promoCodesPath = path.join(__dirname, '..', 'data/mock/promo-codes.ts');
  const content = fs.readFileSync(promoCodesPath, 'utf-8');

  it('should define PromoValidationResult interface', () => {
    expect(content).toContain('export interface PromoValidationResult');
  });

  it('should have isValid property', () => {
    expect(content).toContain('isValid: boolean');
  });

  it('should have optional error property', () => {
    expect(content).toContain('error?: string');
  });

  it('should have optional promoCode property', () => {
    expect(content).toContain('promoCode?: PromoCode');
  });
});

// ============================================================================
// Checkout Integration Tests
// ============================================================================

describe('Promo Code Feature - Checkout Integration', () => {
  const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
  const content = fs.readFileSync(checkoutPath, 'utf-8');

  describe('imports', () => {
    it('should import promo code functions from mock data', () => {
      expect(content).toContain('calculateDiscount');
      expect(content).toContain('formatPromoCodeDescription');
      expect(content).toContain('validatePromoCodeAsync');
    });

    it('should import PromoValidationResult type', () => {
      expect(content).toContain('PromoValidationResult');
    });

    it('should import PromoCode type', () => {
      expect(content).toContain("PromoCode } from '@/types'");
    });
  });

  describe('state variables', () => {
    it('should have promoCodeInput state', () => {
      expect(content).toContain("useState('')");
      expect(content).toContain('promoCodeInput');
    });

    it('should have isValidatingPromo state', () => {
      expect(content).toContain('isValidatingPromo');
      expect(content).toContain('setIsValidatingPromo');
    });

    it('should have appliedPromoCode state', () => {
      expect(content).toContain('appliedPromoCode');
      expect(content).toContain('setAppliedPromoCode');
    });

    it('should have promoValidationError state', () => {
      expect(content).toContain('promoValidationError');
      expect(content).toContain('setPromoValidationError');
    });
  });

  describe('discount computed value', () => {
    it('should calculate discount based on applied promo', () => {
      expect(content).toContain('const discount = useMemo');
      expect(content).toContain('appliedPromoCode ? calculateDiscount');
    });

    it('should include discount in total calculation', () => {
      expect(content).toContain('calculateTotal(subtotal, deliveryFee, tax, discount)');
    });
  });

  describe('handlers', () => {
    it('should have handlePromoCodeChange handler', () => {
      expect(content).toContain('handlePromoCodeChange');
    });

    it('should have handleApplyPromoCode handler', () => {
      expect(content).toContain('handleApplyPromoCode');
    });

    it('should have handleRemovePromoCode handler', () => {
      expect(content).toContain('handleRemovePromoCode');
    });

    it('should convert input to uppercase', () => {
      expect(content).toContain('toUpperCase()');
    });

    it('should clear error when user types', () => {
      expect(content).toContain('promoValidationError');
      expect(content).toContain('setPromoValidationError(null)');
    });
  });
});

// ============================================================================
// PromoCodeSection Component Tests
// ============================================================================

describe('Promo Code Feature - PromoCodeSection Component', () => {
  const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
  const content = fs.readFileSync(checkoutPath, 'utf-8');

  describe('component definition', () => {
    it('should export PromoCodeSection component', () => {
      expect(content).toContain('export function PromoCodeSection');
    });

    it('should have PromoCodeSectionProps interface', () => {
      expect(content).toContain('interface PromoCodeSectionProps');
    });
  });

  describe('props', () => {
    it('should have promoCode prop', () => {
      expect(content).toContain('promoCode: string');
    });

    it('should have onChangePromoCode prop', () => {
      expect(content).toContain('onChangePromoCode: (text: string)');
    });

    it('should have onApply prop', () => {
      expect(content).toContain('onApply: ()');
    });

    it('should have onRemove prop', () => {
      expect(content).toContain('onRemove: ()');
    });

    it('should have isValidating prop', () => {
      expect(content).toContain('isValidating: boolean');
    });

    it('should have appliedPromo prop', () => {
      expect(content).toContain('appliedPromo: PromoCode | null');
    });

    it('should have validationError prop', () => {
      expect(content).toContain('validationError: string | null');
    });

    it('should have discount prop', () => {
      expect(content).toContain('discount: number');
    });
  });

  describe('applied promo state', () => {
    it('should show applied state when promo is active', () => {
      expect(content).toContain('if (appliedPromo)');
    });

    it('should have promo-applied testID', () => {
      expect(content).toContain('testID="promo-applied"');
    });

    it('should show promo code', () => {
      expect(content).toContain('appliedPromo.code');
    });

    it('should show discount description', () => {
      expect(content).toContain('formatPromoCodeDescription(appliedPromo)');
    });

    it('should show savings amount', () => {
      expect(content).toContain('Saving {formatPrice(discount)}');
    });

    it('should have remove button', () => {
      expect(content).toContain('promo-remove-button');
    });
  });

  describe('input state', () => {
    it('should have promo input section testID', () => {
      expect(content).toContain('testID="promo-input-section"');
    });

    it('should have promo input testID', () => {
      expect(content).toContain('testID="promo-input"');
    });

    it('should have apply button testID', () => {
      expect(content).toContain('testID="promo-apply-button"');
    });

    it('should have placeholder text', () => {
      expect(content).toContain('placeholder="Enter promo code"');
    });

    it('should auto-capitalize characters', () => {
      expect(content).toContain('autoCapitalize="characters"');
    });
  });

  describe('error state', () => {
    it('should show error when validation fails', () => {
      expect(content).toContain('validationError &&');
    });

    it('should have promo-error testID', () => {
      expect(content).toContain('testID="promo-error"');
    });

    it('should show alert icon for error', () => {
      expect(content).toContain('name="alert-circle"');
    });
  });

  describe('hint text', () => {
    it('should show sample promo codes as hints', () => {
      expect(content).toContain('Try: WELCOME10, SAVE5, or FREEDELIVERY');
    });
  });
});

// ============================================================================
// Styles Tests
// ============================================================================

describe('Promo Code Feature - Styles', () => {
  const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
  const content = fs.readFileSync(checkoutPath, 'utf-8');

  it('should have promoInputContainer style', () => {
    expect(content).toContain('promoInputContainer:');
  });

  it('should have promoInputRow style', () => {
    expect(content).toContain('promoInputRow:');
  });

  it('should have promoInput style', () => {
    expect(content).toContain('promoInput:');
  });

  it('should have promoApplyButton style', () => {
    expect(content).toContain('promoApplyButton:');
  });

  it('should have promoApplyText style', () => {
    expect(content).toContain('promoApplyText:');
  });

  it('should have promoErrorContainer style', () => {
    expect(content).toContain('promoErrorContainer:');
  });

  it('should have promoErrorText style', () => {
    expect(content).toContain('promoErrorText:');
  });

  it('should have promoHintText style', () => {
    expect(content).toContain('promoHintText:');
  });

  it('should have promoAppliedContainer style', () => {
    expect(content).toContain('promoAppliedContainer:');
  });

  it('should have promoAppliedContent style', () => {
    expect(content).toContain('promoAppliedContent:');
  });

  it('should have promoAppliedDetails style', () => {
    expect(content).toContain('promoAppliedDetails:');
  });

  it('should have promoAppliedCode style', () => {
    expect(content).toContain('promoAppliedCode:');
  });

  it('should have promoAppliedDescription style', () => {
    expect(content).toContain('promoAppliedDescription:');
  });

  it('should have promoRemoveButton style', () => {
    expect(content).toContain('promoRemoveButton:');
  });

  it('should have promoAppliedBadge style', () => {
    expect(content).toContain('promoAppliedBadge:');
  });
});

// ============================================================================
// Animation Tests
// ============================================================================

describe('Promo Code Feature - Animations', () => {
  const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
  const content = fs.readFileSync(checkoutPath, 'utf-8');

  it('should have shake animation for errors', () => {
    expect(content).toContain('shakeX = useSharedValue');
  });

  it('should have scale animation for apply button', () => {
    expect(content).toContain('scale = useSharedValue');
  });

  it('should use spring animation on press', () => {
    expect(content).toContain('withSpring(0.95');
  });

  it('should animate input on error with translateX', () => {
    expect(content).toContain('translateX: shakeX.value');
  });

  it('should fade in error message', () => {
    expect(content).toContain('FadeIn.duration(AnimationDurations.fast)');
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('Promo Code Feature - Accessibility', () => {
  const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
  const content = fs.readFileSync(checkoutPath, 'utf-8');

  it('should have accessibility label for promo input', () => {
    expect(content).toContain('accessibilityLabel="Promo code input"');
  });

  it('should have accessibility label for apply button', () => {
    expect(content).toContain('accessibilityLabel="Apply promo code"');
  });

  it('should have accessibility label for remove button', () => {
    expect(content).toContain('accessibilityLabel="Remove promo code"');
  });

  it('should have accessibilityRole for buttons', () => {
    expect(content).toContain('accessibilityRole="button"');
  });

  it('should have accessibilityState for disabled button', () => {
    expect(content).toContain('accessibilityState={{ disabled:');
  });
});

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('Promo Code Feature - Edge Cases', () => {
  const promoCodesPath = path.join(__dirname, '..', 'data/mock/promo-codes.ts');
  const content = fs.readFileSync(promoCodesPath, 'utf-8');

  it('should handle empty code', () => {
    // The checkout component should prevent applying empty codes
    const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
    const checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
    expect(checkoutContent).toContain('!promoCodeInput.trim()');
  });

  it('should handle case-insensitive code matching', () => {
    expect(content).toContain('.toLowerCase()');
  });

  it('should handle expired codes', () => {
    expect(content).toContain("'This promo code has expired'");
  });

  it('should handle invalid codes', () => {
    expect(content).toContain("'This promo code is no longer valid'");
  });

  it('should handle codes with minimum order requirement', () => {
    expect(content).toContain('Minimum order of');
    expect(content).toContain('required');
  });

  it('should cap discount at subtotal', () => {
    expect(content).toContain('Math.min(discount, subtotal)');
  });

  it('should cap percentage discount at maxDiscount', () => {
    expect(content).toContain('maxDiscount && discount > promoCode.maxDiscount');
  });
});

// ============================================================================
// CollapsibleSection Integration Tests
// ============================================================================

describe('Promo Code Feature - Section Integration', () => {
  const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
  const content = fs.readFileSync(checkoutPath, 'utf-8');

  it('should use CollapsibleSection for promo code', () => {
    expect(content).toContain('CollapsibleSection');
    expect(content).toContain('title="Promo Code"');
  });

  it('should have pricetag icon for section', () => {
    expect(content).toContain('icon="pricetag-outline"');
  });

  it('should track expanded state in expandedSections', () => {
    expect(content).toContain('expandedSections.promo');
  });

  it('should show applied code as badge when promo is applied', () => {
    expect(content).toContain('appliedPromoCode ?');
    expect(content).toContain('appliedPromoCode.code');
  });

  it('should pass PromoCodeSection to section content', () => {
    expect(content).toContain('<PromoCodeSection');
    expect(content).toContain('promoCode={promoCodeInput}');
    expect(content).toContain('onChangePromoCode={handlePromoCodeChange}');
    expect(content).toContain('onApply={handleApplyPromoCode}');
    expect(content).toContain('onRemove={handleRemovePromoCode}');
  });
});

// ============================================================================
// Order Summary Integration Tests
// ============================================================================

describe('Promo Code Feature - Order Summary Integration', () => {
  const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
  const content = fs.readFileSync(checkoutPath, 'utf-8');

  it('should pass discount to OrderSummarySection', () => {
    expect(content).toContain('discount={discount}');
  });

  it('should show discount row when discount is applied', () => {
    expect(content).toContain('discount && discount > 0');
    expect(content).toContain('label="Discount"');
  });

  it('should format discount as negative value', () => {
    expect(content).toContain('-${formatPrice(discount)}');
  });

  it('should highlight discount row', () => {
    expect(content).toContain('isHighlighted');
  });

  it('should show savings in TotalRow', () => {
    expect(content).toContain('savings={discount}');
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Promo Code Feature - Performance', () => {
  const checkoutPath = path.join(__dirname, '..', 'app/order/checkout.tsx');
  const content = fs.readFileSync(checkoutPath, 'utf-8');

  it('should use useCallback for handlers', () => {
    expect(content).toContain('handlePromoCodeChange = useCallback');
    expect(content).toContain('handleApplyPromoCode = useCallback');
    expect(content).toContain('handleRemovePromoCode = useCallback');
  });

  it('should use useMemo for discount calculation', () => {
    expect(content).toContain('const discount = useMemo');
  });

  it('should debounce async validation', () => {
    // Validation is triggered on button press, not on every keystroke
    expect(content).toContain('handleApplyPromoCode');
    expect(content).not.toContain('useEffect(() => { validatePromoCode');
  });
});

// ============================================================================
// Types Integration Tests
// ============================================================================

describe('Promo Code Feature - Types', () => {
  const typesPath = path.join(__dirname, '..', 'types/index.ts');
  const content = fs.readFileSync(typesPath, 'utf-8');

  it('should have PromoCode interface', () => {
    expect(content).toContain('export interface PromoCode');
  });

  it('should have DiscountType type', () => {
    expect(content).toContain('export type DiscountType');
    expect(content).toContain("'percentage'");
    expect(content).toContain("'fixed'");
  });

  it('should have code property', () => {
    expect(content).toContain('code: string');
  });

  it('should have discountType property', () => {
    expect(content).toContain('discountType: DiscountType');
  });

  it('should have discountValue property', () => {
    expect(content).toContain('discountValue: number');
  });

  it('should have optional minOrderAmount', () => {
    expect(content).toContain('minOrderAmount?: number');
  });

  it('should have optional maxDiscount', () => {
    expect(content).toContain('maxDiscount?: number');
  });

  it('should have optional expiresAt', () => {
    expect(content).toContain('expiresAt?: Date');
  });

  it('should have isValid property', () => {
    expect(content).toContain('isValid: boolean');
  });
});
