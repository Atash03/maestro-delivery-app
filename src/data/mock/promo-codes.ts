/**
 * Mock promo code data for Maestro Food Delivery App
 *
 * Provides sample promo codes with various discount types for testing.
 */

import type { PromoCode } from '@/types';

// ============================================================================
// Mock Promo Codes
// ============================================================================

/**
 * Sample promo codes for testing
 */
export const mockPromoCodes: PromoCode[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 15,
    maxDiscount: 5,
    isValid: true,
  },
  {
    code: 'SAVE5',
    discountType: 'fixed',
    discountValue: 5,
    minOrderAmount: 25,
    isValid: true,
  },
  {
    code: 'SPICY20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 30,
    maxDiscount: 10,
    isValid: true,
  },
  {
    code: 'FREEDELIVERY',
    discountType: 'fixed',
    discountValue: 2.99,
    isValid: true,
  },
  {
    code: 'VIP25',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 50,
    maxDiscount: 15,
    isValid: true,
  },
  {
    code: 'EXPIRED2024',
    discountType: 'percentage',
    discountValue: 15,
    expiresAt: new Date('2024-12-31'),
    isValid: false,
  },
  {
    code: 'INVALID',
    discountType: 'fixed',
    discountValue: 10,
    isValid: false,
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Finds a promo code by its code string (case-insensitive)
 */
export function getPromoCodeByCode(code: string): PromoCode | undefined {
  return mockPromoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase());
}

/**
 * Validates a promo code against order requirements
 */
export interface PromoValidationResult {
  isValid: boolean;
  error?: string;
  promoCode?: PromoCode;
}

export function validatePromoCode(code: string, subtotal: number): PromoValidationResult {
  const promoCode = getPromoCodeByCode(code);

  if (!promoCode) {
    return {
      isValid: false,
      error: 'Invalid promo code',
    };
  }

  if (!promoCode.isValid) {
    return {
      isValid: false,
      error: 'This promo code is no longer valid',
    };
  }

  if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
    return {
      isValid: false,
      error: 'This promo code has expired',
    };
  }

  if (promoCode.minOrderAmount && subtotal < promoCode.minOrderAmount) {
    return {
      isValid: false,
      error: `Minimum order of $${promoCode.minOrderAmount.toFixed(2)} required`,
    };
  }

  return {
    isValid: true,
    promoCode,
  };
}

/**
 * Calculates the discount amount for a promo code
 */
export function calculateDiscount(promoCode: PromoCode, subtotal: number): number {
  let discount = 0;

  if (promoCode.discountType === 'percentage') {
    discount = subtotal * (promoCode.discountValue / 100);
    // Apply max discount cap if specified
    if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
      discount = promoCode.maxDiscount;
    }
  } else {
    // Fixed discount
    discount = promoCode.discountValue;
  }

  // Ensure discount doesn't exceed subtotal
  return Math.min(discount, subtotal);
}

/**
 * Formats a promo code for display
 */
export function formatPromoCodeDescription(promoCode: PromoCode): string {
  if (promoCode.discountType === 'percentage') {
    let description = `${promoCode.discountValue}% off`;
    if (promoCode.maxDiscount) {
      description += ` (up to $${promoCode.maxDiscount.toFixed(2)})`;
    }
    return description;
  }
  return `$${promoCode.discountValue.toFixed(2)} off`;
}

/**
 * Gets valid promo codes for display/suggestions
 */
export function getValidPromoCodes(): PromoCode[] {
  return mockPromoCodes.filter((p) => p.isValid && (!p.expiresAt || new Date() <= p.expiresAt));
}

// ============================================================================
// Async Functions (with simulated delays)
// ============================================================================

/**
 * Validates a promo code with simulated network delay
 */
export async function validatePromoCodeAsync(
  code: string,
  subtotal: number,
  delayMs = 500
): Promise<PromoValidationResult> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return validatePromoCode(code, subtotal);
}
