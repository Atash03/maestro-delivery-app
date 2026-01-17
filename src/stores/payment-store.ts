/**
 * Payment Store
 *
 * Zustand store for managing payment methods in the Maestro app.
 * Handles saved cards, default payment method selection, and card management.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CardBrand, PaymentMethod } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface PaymentState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string | null;
}

interface PaymentActions {
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  selectPaymentMethod: (methodId: string | null) => void;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  getSelectedPaymentMethod: () => PaymentMethod | undefined;
  getPaymentMethodById: (methodId: string) => PaymentMethod | undefined;
  getSavedCards: () => PaymentMethod[];
  clearPaymentMethods: () => void;
}

type PaymentStore = PaymentState & PaymentActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: PaymentState = {
  paymentMethods: [],
  selectedPaymentMethodId: null,
};

// ============================================================================
// Store
// ============================================================================

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addPaymentMethod: (method: PaymentMethod) => {
        const { paymentMethods } = get();

        // If this is the first card or marked as default, update other methods
        const updatedMethods = method.isDefault
          ? paymentMethods.map((m) => ({ ...m, isDefault: false }))
          : [...paymentMethods];

        // If this is the first method, make it default
        if (updatedMethods.length === 0) {
          method.isDefault = true;
        }

        set({
          paymentMethods: [...updatedMethods, method],
          selectedPaymentMethodId: method.isDefault ? method.id : get().selectedPaymentMethodId,
        });
      },

      removePaymentMethod: (methodId: string) => {
        const { paymentMethods, selectedPaymentMethodId } = get();
        const filteredMethods = paymentMethods.filter((m) => m.id !== methodId);

        // If we removed the default method, set first card as default
        const hasDefault = filteredMethods.some((m) => m.isDefault);
        if (!hasDefault && filteredMethods.length > 0) {
          filteredMethods[0].isDefault = true;
        }

        // Update selected payment method if it was removed
        const newSelectedId =
          selectedPaymentMethodId === methodId
            ? (filteredMethods.find((m) => m.isDefault)?.id ?? null)
            : selectedPaymentMethodId;

        set({
          paymentMethods: filteredMethods,
          selectedPaymentMethodId: newSelectedId,
        });
      },

      setDefaultPaymentMethod: (methodId: string) => {
        const { paymentMethods } = get();

        const updatedMethods = paymentMethods.map((m) => ({
          ...m,
          isDefault: m.id === methodId,
        }));

        set({
          paymentMethods: updatedMethods,
          selectedPaymentMethodId: methodId,
        });
      },

      selectPaymentMethod: (methodId: string | null) => {
        set({ selectedPaymentMethodId: methodId });
      },

      getDefaultPaymentMethod: () => {
        const { paymentMethods } = get();
        return paymentMethods.find((m) => m.isDefault);
      },

      getSelectedPaymentMethod: () => {
        const { paymentMethods, selectedPaymentMethodId } = get();
        if (!selectedPaymentMethodId) {
          return paymentMethods.find((m) => m.isDefault);
        }
        return paymentMethods.find((m) => m.id === selectedPaymentMethodId);
      },

      getPaymentMethodById: (methodId: string) => {
        const { paymentMethods } = get();
        return paymentMethods.find((m) => m.id === methodId);
      },

      getSavedCards: () => {
        const { paymentMethods } = get();
        return paymentMethods.filter((m) => m.type === 'card');
      },

      clearPaymentMethods: () => {
        set(initialState);
      },
    }),
    {
      name: 'maestro-payment-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        paymentMethods: state.paymentMethods,
        selectedPaymentMethodId: state.selectedPaymentMethodId,
      }),
    }
  )
);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets the card brand icon name for display
 */
export function getCardBrandIcon(brand?: CardBrand): string {
  switch (brand) {
    case 'visa':
      return 'card';
    case 'mastercard':
      return 'card';
    case 'amex':
      return 'card';
    case 'discover':
      return 'card';
    default:
      return 'card-outline';
  }
}

/**
 * Gets the display name for a card brand
 */
export function getCardBrandDisplayName(brand?: CardBrand): string {
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
      return 'Card';
  }
}

/**
 * Formats card number with last 4 digits
 */
export function formatCardNumber(last4?: string): string {
  if (!last4) return '•••• ••••';
  return `•••• ${last4}`;
}

/**
 * Formats card expiry date
 */
export function formatCardExpiry(month?: number, year?: number): string {
  if (!month || !year) return '';
  const paddedMonth = month.toString().padStart(2, '0');
  const shortYear = year.toString().slice(-2);
  return `${paddedMonth}/${shortYear}`;
}

/**
 * Checks if a card is expired
 */
export function isCardExpired(month?: number, year?: number): boolean {
  if (!month || !year) return false;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return true;
  if (year === currentYear && month < currentMonth) return true;
  return false;
}

/**
 * Generates a unique payment method ID
 */
export function generatePaymentMethodId(): string {
  return `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Detects card brand from card number prefix
 */
export function detectCardBrand(cardNumber: string): CardBrand | undefined {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';

  return undefined;
}
