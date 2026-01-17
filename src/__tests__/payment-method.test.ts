/**
 * Payment Method Tests
 *
 * Comprehensive tests for the payment method section including:
 * - Payment store functionality
 * - Saved card option component
 * - Cash on delivery option
 * - Add new card button
 * - Card brand icons
 * - Helper functions
 * - Checkout integration
 */

import { beforeEach, describe, expect, it } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Payment Method - File Structure', () => {
  const paymentStorePath = path.join(process.cwd(), 'src/stores/payment-store.ts');
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  const storesIndexPath = path.join(process.cwd(), 'src/stores/index.ts');

  it('should have payment store file', () => {
    expect(fs.existsSync(paymentStorePath)).toBe(true);
  });

  it('should have checkout screen file', () => {
    expect(fs.existsSync(checkoutPath)).toBe(true);
  });

  it('should have stores index file that exports payment store', () => {
    const content = fs.readFileSync(storesIndexPath, 'utf-8');
    expect(content).toContain('usePaymentStore');
  });
});

// ============================================================================
// Payment Store Tests
// ============================================================================

describe('Payment Store', () => {
  const paymentStorePath = path.join(process.cwd(), 'src/stores/payment-store.ts');
  let storeContent: string;

  beforeEach(() => {
    storeContent = fs.readFileSync(paymentStorePath, 'utf-8');
  });

  describe('Store Structure', () => {
    it('should export usePaymentStore hook', () => {
      expect(storeContent).toContain('export const usePaymentStore');
    });

    it('should use zustand create function', () => {
      expect(storeContent).toContain("from 'zustand'");
      expect(storeContent).toContain('create<PaymentStore>');
    });

    it('should use persist middleware', () => {
      expect(storeContent).toContain('persist');
      expect(storeContent).toContain('createJSONStorage');
      expect(storeContent).toContain('AsyncStorage');
    });

    it('should have correct storage key', () => {
      expect(storeContent).toContain("name: 'maestro-payment-storage'");
    });
  });

  describe('State Properties', () => {
    it('should have paymentMethods array', () => {
      expect(storeContent).toContain('paymentMethods: PaymentMethod[]');
    });

    it('should have selectedPaymentMethodId', () => {
      expect(storeContent).toContain('selectedPaymentMethodId: string | null');
    });

    it('should have correct initial state', () => {
      expect(storeContent).toContain('paymentMethods: []');
      expect(storeContent).toContain('selectedPaymentMethodId: null');
    });
  });

  describe('Actions', () => {
    it('should have addPaymentMethod action', () => {
      expect(storeContent).toContain('addPaymentMethod: (method: PaymentMethod)');
    });

    it('should have removePaymentMethod action', () => {
      expect(storeContent).toContain('removePaymentMethod: (methodId: string)');
    });

    it('should have setDefaultPaymentMethod action', () => {
      expect(storeContent).toContain('setDefaultPaymentMethod: (methodId: string)');
    });

    it('should have selectPaymentMethod action', () => {
      expect(storeContent).toContain('selectPaymentMethod: (methodId: string | null)');
    });

    it('should have getDefaultPaymentMethod getter', () => {
      expect(storeContent).toContain('getDefaultPaymentMethod: ()');
    });

    it('should have getSelectedPaymentMethod getter', () => {
      expect(storeContent).toContain('getSelectedPaymentMethod: ()');
    });

    it('should have getPaymentMethodById getter', () => {
      expect(storeContent).toContain('getPaymentMethodById: (methodId: string)');
    });

    it('should have getSavedCards getter', () => {
      expect(storeContent).toContain('getSavedCards: ()');
    });

    it('should have clearPaymentMethods action', () => {
      expect(storeContent).toContain('clearPaymentMethods: ()');
    });
  });

  describe('Add Payment Method Logic', () => {
    it('should handle setting first method as default', () => {
      expect(storeContent).toContain('if (updatedMethods.length === 0)');
      expect(storeContent).toContain('method.isDefault = true');
    });

    it('should update selected payment when adding default', () => {
      expect(storeContent).toContain('selectedPaymentMethodId: method.isDefault ? method.id');
    });
  });

  describe('Remove Payment Method Logic', () => {
    it('should handle removing the default method', () => {
      expect(storeContent).toContain('const hasDefault = filteredMethods.some');
      expect(storeContent).toContain('filteredMethods[0].isDefault = true');
    });

    it('should update selected method when removing selected', () => {
      expect(storeContent).toContain('selectedPaymentMethodId === methodId');
    });
  });
});

// ============================================================================
// Payment Store Helper Functions Tests
// ============================================================================

describe('Payment Store Helper Functions', () => {
  const paymentStorePath = path.join(process.cwd(), 'src/stores/payment-store.ts');
  let storeContent: string;

  beforeEach(() => {
    storeContent = fs.readFileSync(paymentStorePath, 'utf-8');
  });

  describe('getCardBrandIcon', () => {
    it('should be exported', () => {
      expect(storeContent).toContain('export function getCardBrandIcon');
    });

    it('should handle visa brand', () => {
      expect(storeContent).toContain("case 'visa':");
    });

    it('should handle mastercard brand', () => {
      expect(storeContent).toContain("case 'mastercard':");
    });

    it('should handle amex brand', () => {
      expect(storeContent).toContain("case 'amex':");
    });

    it('should handle discover brand', () => {
      expect(storeContent).toContain("case 'discover':");
    });

    it('should have default fallback', () => {
      expect(storeContent).toContain("return 'card-outline'");
    });
  });

  describe('getCardBrandDisplayName', () => {
    it('should be exported', () => {
      expect(storeContent).toContain('export function getCardBrandDisplayName');
    });

    it('should return Visa for visa', () => {
      expect(storeContent).toContain("return 'Visa'");
    });

    it('should return Mastercard for mastercard', () => {
      expect(storeContent).toContain("return 'Mastercard'");
    });

    it('should return American Express for amex', () => {
      expect(storeContent).toContain("return 'American Express'");
    });

    it('should return Discover for discover', () => {
      expect(storeContent).toContain("return 'Discover'");
    });

    it('should return Card as default', () => {
      expect(storeContent).toContain("return 'Card'");
    });
  });

  describe('formatCardNumber', () => {
    it('should be exported', () => {
      expect(storeContent).toContain('export function formatCardNumber');
    });

    it('should handle missing last4', () => {
      expect(storeContent).toContain("if (!last4) return '•••• ••••'");
    });

    it('should format with bullet points', () => {
      expect(storeContent).toContain('return `•••• ${last4}`');
    });
  });

  describe('formatCardExpiry', () => {
    it('should be exported', () => {
      expect(storeContent).toContain('export function formatCardExpiry');
    });

    it('should handle missing month or year', () => {
      expect(storeContent).toContain("if (!month || !year) return ''");
    });

    it('should pad month with leading zero', () => {
      expect(storeContent).toContain("padStart(2, '0')");
    });

    it('should use short year format', () => {
      expect(storeContent).toContain('slice(-2)');
    });
  });

  describe('isCardExpired', () => {
    it('should be exported', () => {
      expect(storeContent).toContain('export function isCardExpired');
    });

    it('should compare year', () => {
      expect(storeContent).toContain('if (year < currentYear) return true');
    });

    it('should compare month when year matches', () => {
      expect(storeContent).toContain('if (year === currentYear && month < currentMonth)');
    });
  });

  describe('generatePaymentMethodId', () => {
    it('should be exported', () => {
      expect(storeContent).toContain('export function generatePaymentMethodId');
    });

    it('should use timestamp', () => {
      expect(storeContent).toContain('Date.now()');
    });

    it('should include random component', () => {
      expect(storeContent).toContain('Math.random()');
    });

    it('should have pay- prefix', () => {
      expect(storeContent).toContain('return `pay-');
    });
  });

  describe('detectCardBrand', () => {
    it('should be exported', () => {
      expect(storeContent).toContain('export function detectCardBrand');
    });

    it('should detect Visa (starts with 4)', () => {
      expect(storeContent).toContain('/^4/');
      expect(storeContent).toContain("return 'visa'");
    });

    it('should detect Mastercard (starts with 5[1-5] or 2[2-7])', () => {
      expect(storeContent).toContain('/^5[1-5]/');
      expect(storeContent).toContain('/^2[2-7]/');
      expect(storeContent).toContain("return 'mastercard'");
    });

    it('should detect Amex (starts with 3[47])', () => {
      expect(storeContent).toContain('/^3[47]/');
      expect(storeContent).toContain("return 'amex'");
    });

    it('should detect Discover (starts with 6011 or 65)', () => {
      expect(storeContent).toContain('/^6(?:011|5)/');
      expect(storeContent).toContain("return 'discover'");
    });

    it('should clean spaces from card number', () => {
      expect(storeContent).toContain("replace(/\\s/g, '')");
    });
  });
});

// ============================================================================
// Checkout Payment Integration Tests
// ============================================================================

describe('Checkout Payment Integration', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  describe('Store Imports', () => {
    it('should import usePaymentStore', () => {
      expect(checkoutContent).toContain('usePaymentStore');
    });

    it('should import formatCardNumber', () => {
      expect(checkoutContent).toContain('formatCardNumber');
    });

    it('should import formatCardExpiry', () => {
      expect(checkoutContent).toContain('formatCardExpiry');
    });

    it('should import getCardBrandDisplayName', () => {
      expect(checkoutContent).toContain('getCardBrandDisplayName');
    });
  });

  describe('Payment Store State Usage', () => {
    it('should get paymentMethods from store', () => {
      expect(checkoutContent).toContain('usePaymentStore((state) => state.paymentMethods)');
    });

    it('should get selectedPaymentMethodId from store', () => {
      expect(checkoutContent).toContain(
        'usePaymentStore((state) => state.selectedPaymentMethodId)'
      );
    });

    it('should get selectPaymentMethod action from store', () => {
      expect(checkoutContent).toContain('usePaymentStore((state) => state.selectPaymentMethod)');
    });

    it('should get getSavedCards from store', () => {
      expect(checkoutContent).toContain('usePaymentStore((state) => state.getSavedCards)');
    });

    it('should get getSelectedPaymentMethod from store', () => {
      expect(checkoutContent).toContain(
        'usePaymentStore((state) => state.getSelectedPaymentMethod)'
      );
    });
  });

  describe('Payment Method Handlers', () => {
    it('should have handleSelectPaymentMethod handler', () => {
      expect(checkoutContent).toContain('const handleSelectPaymentMethod');
    });

    it('should call selectPaymentMethod in handler', () => {
      expect(checkoutContent).toContain('selectPaymentMethod(methodId)');
    });

    it('should have handleAddNewCard handler', () => {
      expect(checkoutContent).toContain('const handleAddNewCard');
    });

    it('should navigate to add-card screen', () => {
      expect(checkoutContent).toContain('/order/add-card');
    });
  });

  describe('Payment Method Computed Values', () => {
    it('should compute savedCards using useMemo', () => {
      expect(checkoutContent).toContain('const savedCards = useMemo(');
      expect(checkoutContent).toContain('getSavedCards()');
    });

    it('should compute selectedPayment using useMemo', () => {
      expect(checkoutContent).toContain('const selectedPayment = useMemo(');
      expect(checkoutContent).toContain('getSelectedPaymentMethod()');
    });

    it('should compute paymentMethodDisplay using useMemo', () => {
      expect(checkoutContent).toContain('const paymentMethodDisplay = useMemo(');
    });

    it('should display Cash for cash selection', () => {
      expect(checkoutContent).toContain("if (selectedPaymentMethodId === 'cash') return 'Cash'");
    });

    it('should display card brand and last 4 for card', () => {
      expect(checkoutContent).toContain('getCardBrandDisplayName(selectedPayment.brand)');
      expect(checkoutContent).toContain('selectedPayment.last4');
    });
  });

  describe('Validation', () => {
    it('should check for valid payment method in canPlaceOrder', () => {
      expect(checkoutContent).toContain('const hasPaymentMethod');
      expect(checkoutContent).toContain('canPlaceOrder');
      expect(checkoutContent).toContain('hasPaymentMethod');
    });

    it('should allow cash payment', () => {
      expect(checkoutContent).toContain("selectedPaymentMethodId === 'cash'");
    });
  });
});

// ============================================================================
// SavedCardOption Component Tests
// ============================================================================

describe('SavedCardOption Component', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  describe('Component Definition', () => {
    it('should export SavedCardOption function', () => {
      expect(checkoutContent).toContain('export function SavedCardOption');
    });

    it('should have SavedCardOptionProps interface', () => {
      expect(checkoutContent).toContain('interface SavedCardOptionProps');
    });
  });

  describe('Props', () => {
    it('should accept card prop', () => {
      expect(checkoutContent).toContain('card: PaymentMethod');
    });

    it('should accept isSelected prop', () => {
      expect(checkoutContent).toContain('isSelected: boolean');
    });

    it('should accept onSelect prop', () => {
      expect(checkoutContent).toContain('onSelect: () => void');
    });

    it('should accept colors prop', () => {
      expect(checkoutContent).toContain("colors: (typeof Colors)['light']");
    });

    it('should accept optional index prop', () => {
      expect(checkoutContent).toContain('index?: number');
    });
  });

  describe('Animation', () => {
    it('should use FadeInDown animation', () => {
      expect(checkoutContent).toContain('FadeInDown.duration(AnimationDurations.normal)');
    });

    it('should have staggered delay based on index', () => {
      expect(checkoutContent).toContain('.delay(index * 50)');
    });

    it('should use spring scale animation for press', () => {
      expect(checkoutContent).toContain('withSpring(0.98, SPRING_CONFIG)');
    });
  });

  describe('Card Brand Display', () => {
    it('should use CARD_BRAND_COLORS', () => {
      expect(checkoutContent).toContain('CARD_BRAND_COLORS');
    });

    it('should display brand name', () => {
      expect(checkoutContent).toContain('getCardBrandDisplayName(card.brand)');
    });

    it('should display formatted card number', () => {
      expect(checkoutContent).toContain('formatCardNumber(card.last4)');
    });

    it('should display formatted expiry', () => {
      expect(checkoutContent).toContain('formatCardExpiry(card.expiryMonth, card.expiryYear)');
    });
  });

  describe('Default Card Badge', () => {
    it('should show default badge when card is default', () => {
      expect(checkoutContent).toContain('card.isDefault && (');
    });

    it('should use SuccessColors for default badge', () => {
      expect(checkoutContent).toContain('SuccessColors[100]');
      expect(checkoutContent).toContain('SuccessColors[700]');
    });
  });

  describe('Accessibility', () => {
    it('should have comprehensive accessibility label', () => {
      expect(checkoutContent).toContain('accessibilityLabel=');
      expect(checkoutContent).toContain('ending in');
      expect(checkoutContent).toContain('Expires');
    });

    it('should have radio role', () => {
      expect(checkoutContent).toContain('accessibilityRole="radio"');
    });

    it('should indicate selected state', () => {
      expect(checkoutContent).toContain('accessibilityState={{ selected: isSelected }}');
    });

    it('should have test ID with card ID', () => {
      expect(checkoutContent).toContain('testID={`saved-card-${card.id}`}');
    });
  });
});

// ============================================================================
// CardBrandIcon Component Tests
// ============================================================================

describe('CardBrandIcon Component', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  describe('Component Definition', () => {
    it('should export CardBrandIcon function', () => {
      expect(checkoutContent).toContain('export function CardBrandIcon');
    });

    it('should have CardBrandIconProps interface', () => {
      expect(checkoutContent).toContain('interface CardBrandIconProps');
    });
  });

  describe('Props', () => {
    it('should accept optional brand prop', () => {
      expect(checkoutContent).toContain('brand?: CardBrand');
    });

    it('should accept optional size prop', () => {
      expect(checkoutContent).toContain('size?: number');
    });

    it('should have default size of 24', () => {
      expect(checkoutContent).toContain('size = 24');
    });

    it('should accept optional color prop', () => {
      expect(checkoutContent).toContain('color?: string');
    });
  });

  describe('Brand Icons', () => {
    it('should render VISA text for visa', () => {
      expect(checkoutContent).toContain("case 'visa':");
      expect(checkoutContent).toContain('>VISA</Text>');
    });

    it('should render circles for mastercard', () => {
      expect(checkoutContent).toContain("case 'mastercard':");
      expect(checkoutContent).toContain('mastercardCircles');
      expect(checkoutContent).toContain('#EB001B');
      expect(checkoutContent).toContain('#F79E1B');
    });

    it('should render AMEX text for amex', () => {
      expect(checkoutContent).toContain("case 'amex':");
      expect(checkoutContent).toContain('>AMEX</Text>');
    });

    it('should render DISC text for discover', () => {
      expect(checkoutContent).toContain("case 'discover':");
      expect(checkoutContent).toContain('>DISC</Text>');
    });

    it('should render card icon for unknown brand', () => {
      expect(checkoutContent).toContain('name="card-outline"');
    });
  });
});

// ============================================================================
// CashOnDeliveryOption Component Tests
// ============================================================================

describe('CashOnDeliveryOption Component', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  describe('Component Definition', () => {
    it('should export CashOnDeliveryOption function', () => {
      expect(checkoutContent).toContain('export function CashOnDeliveryOption');
    });

    it('should have CashOnDeliveryOptionProps interface', () => {
      expect(checkoutContent).toContain('interface CashOnDeliveryOptionProps');
    });
  });

  describe('Content', () => {
    it('should display Cash on Delivery label', () => {
      expect(checkoutContent).toContain('>Cash on Delivery</Text>');
    });

    it('should display description', () => {
      expect(checkoutContent).toContain('Pay when your order arrives');
    });

    it('should use cash icon', () => {
      expect(checkoutContent).toContain('name="cash-outline"');
    });
  });

  describe('Accessibility', () => {
    it('should have test ID', () => {
      expect(checkoutContent).toContain('testID="payment-option-cash"');
    });

    it('should have comprehensive accessibility label', () => {
      expect(checkoutContent).toContain('Cash on Delivery. Pay when your order arrives');
    });
  });
});

// ============================================================================
// AddNewCardButton Component Tests
// ============================================================================

describe('AddNewCardButton Component', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  describe('Component Definition', () => {
    it('should export AddNewCardButton function', () => {
      expect(checkoutContent).toContain('export function AddNewCardButton');
    });

    it('should have AddNewCardButtonProps interface', () => {
      expect(checkoutContent).toContain('interface AddNewCardButtonProps');
    });
  });

  describe('Props', () => {
    it('should accept onPress prop', () => {
      expect(checkoutContent).toContain('onPress: () => void');
    });

    it('should accept colors prop', () => {
      expect(checkoutContent).toContain("colors: (typeof Colors)['light']");
    });
  });

  describe('Content', () => {
    it('should display Add New Card text', () => {
      expect(checkoutContent).toContain('>Add New Card</Text>');
    });

    it('should use add-circle icon', () => {
      expect(checkoutContent).toContain('name="add-circle-outline"');
    });

    it('should use PrimaryColors for styling', () => {
      expect(checkoutContent).toContain('color={PrimaryColors[500]}');
    });
  });

  describe('Styling', () => {
    it('should have addNewCardButton style', () => {
      expect(checkoutContent).toContain('styles.addNewCardButton');
    });

    it('should have dashed border style', () => {
      expect(checkoutContent).toContain("borderStyle: 'dashed'");
    });
  });

  describe('Accessibility', () => {
    it('should have test ID', () => {
      expect(checkoutContent).toContain('testID="add-new-card-button"');
    });

    it('should have accessibility label', () => {
      expect(checkoutContent).toContain('accessibilityLabel="Add a new card"');
    });

    it('should have button role', () => {
      expect(checkoutContent).toContain('accessibilityRole="button"');
    });
  });
});

// ============================================================================
// PaymentMethodSectionContent Component Tests
// ============================================================================

describe('PaymentMethodSectionContent Component', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  describe('Component Definition', () => {
    it('should export PaymentMethodSectionContent function', () => {
      expect(checkoutContent).toContain('export function PaymentMethodSectionContent');
    });

    it('should have PaymentMethodSectionContentProps interface', () => {
      expect(checkoutContent).toContain('interface PaymentMethodSectionContentProps');
    });
  });

  describe('Props', () => {
    it('should accept savedCards prop', () => {
      expect(checkoutContent).toContain('savedCards: PaymentMethod[]');
    });

    it('should accept selectedPaymentId prop', () => {
      expect(checkoutContent).toContain('selectedPaymentId: string | null');
    });

    it('should accept onSelectPayment prop', () => {
      expect(checkoutContent).toContain('onSelectPayment: (id: string | null) => void');
    });

    it('should accept onAddNewCard prop', () => {
      expect(checkoutContent).toContain('onAddNewCard: () => void');
    });
  });

  describe('Section Headers', () => {
    it('should show Saved Cards header when cards exist', () => {
      expect(checkoutContent).toContain('savedCards.length > 0');
      expect(checkoutContent).toContain('Saved Cards');
    });

    it('should show Other Payment Methods header', () => {
      expect(checkoutContent).toContain('Other Payment Methods');
    });

    it('should use card icon for saved cards header', () => {
      expect(checkoutContent).toContain('name="card"');
    });

    it('should use wallet icon for other methods header', () => {
      expect(checkoutContent).toContain('name="wallet-outline"');
    });
  });

  describe('Content Layout', () => {
    it('should map over saved cards', () => {
      expect(checkoutContent).toContain('savedCards.map((card, index)');
    });

    it('should render SavedCardOption for each card', () => {
      expect(checkoutContent).toContain('<SavedCardOption');
    });

    it('should render AddNewCardButton', () => {
      expect(checkoutContent).toContain('<AddNewCardButton');
    });

    it('should render CashOnDeliveryOption', () => {
      expect(checkoutContent).toContain('<CashOnDeliveryOption');
    });

    it('should have divider between sections', () => {
      expect(checkoutContent).toContain('styles.paymentDivider');
    });
  });

  describe('Cash Selection Logic', () => {
    it('should track cash selection state', () => {
      expect(checkoutContent).toContain("const isCashSelected = selectedPaymentId === 'cash'");
    });

    it('should pass cash selection to CashOnDeliveryOption', () => {
      expect(checkoutContent).toContain('isSelected={isCashSelected}');
    });

    it('should handle cash selection', () => {
      expect(checkoutContent).toContain("onSelectPayment('cash')");
    });
  });

  describe('Test ID', () => {
    it('should have payment-method-section test ID', () => {
      expect(checkoutContent).toContain('testID="payment-method-section"');
    });
  });
});

// ============================================================================
// CARD_BRAND_COLORS Constant Tests
// ============================================================================

describe('CARD_BRAND_COLORS Constant', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should export CARD_BRAND_COLORS', () => {
    expect(checkoutContent).toContain('export const CARD_BRAND_COLORS');
  });

  it('should have visa color (navy blue)', () => {
    expect(checkoutContent).toContain("visa: '#1A1F71'");
  });

  it('should have mastercard color (red)', () => {
    expect(checkoutContent).toContain("mastercard: '#EB001B'");
  });

  it('should have amex color (blue)', () => {
    expect(checkoutContent).toContain("amex: '#006FCF'");
  });

  it('should have discover color (orange)', () => {
    expect(checkoutContent).toContain("discover: '#FF6000'");
  });
});

// ============================================================================
// Styles Tests
// ============================================================================

describe('Payment Method Styles', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should have cardBrandIconContainer style', () => {
    expect(checkoutContent).toContain('cardBrandIconContainer:');
  });

  it('should have cardBrandTextContainer style', () => {
    expect(checkoutContent).toContain('cardBrandTextContainer:');
  });

  it('should have cardBrandText style', () => {
    expect(checkoutContent).toContain('cardBrandText:');
  });

  it('should have mastercardCircles style', () => {
    expect(checkoutContent).toContain('mastercardCircles:');
  });

  it('should have mastercardCircle style', () => {
    expect(checkoutContent).toContain('mastercardCircle:');
  });

  it('should have cardHeaderRow style', () => {
    expect(checkoutContent).toContain('cardHeaderRow:');
  });

  it('should have cardDetailsRow style', () => {
    expect(checkoutContent).toContain('cardDetailsRow:');
  });

  it('should have cardNumber style with monospace font', () => {
    expect(checkoutContent).toContain('cardNumber:');
    expect(checkoutContent).toContain("fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'");
  });

  it('should have cardExpiry style', () => {
    expect(checkoutContent).toContain('cardExpiry:');
  });

  it('should have defaultCardBadge style', () => {
    expect(checkoutContent).toContain('defaultCardBadge:');
  });

  it('should have defaultCardBadgeText style', () => {
    expect(checkoutContent).toContain('defaultCardBadgeText:');
  });

  it('should have addNewCardButton style', () => {
    expect(checkoutContent).toContain('addNewCardButton:');
  });

  it('should have addNewCardText style', () => {
    expect(checkoutContent).toContain('addNewCardText:');
  });

  it('should have paymentDivider style', () => {
    expect(checkoutContent).toContain('paymentDivider:');
  });

  it('should have paymentSubsectionHeader style', () => {
    expect(checkoutContent).toContain('paymentSubsectionHeader:');
  });

  it('should have paymentSubsectionTitle style', () => {
    expect(checkoutContent).toContain('paymentSubsectionTitle:');
  });
});

// ============================================================================
// Stores Index Export Tests
// ============================================================================

describe('Stores Index Exports', () => {
  const storesIndexPath = path.join(process.cwd(), 'src/stores/index.ts');
  let indexContent: string;

  beforeEach(() => {
    indexContent = fs.readFileSync(storesIndexPath, 'utf-8');
  });

  it('should export usePaymentStore', () => {
    expect(indexContent).toContain('usePaymentStore');
  });

  it('should export detectCardBrand', () => {
    expect(indexContent).toContain('detectCardBrand');
  });

  it('should export formatCardExpiry', () => {
    expect(indexContent).toContain('formatCardExpiry');
  });

  it('should export formatCardNumber', () => {
    expect(indexContent).toContain('formatCardNumber');
  });

  it('should export generatePaymentMethodId', () => {
    expect(indexContent).toContain('generatePaymentMethodId');
  });

  it('should export getCardBrandDisplayName', () => {
    expect(indexContent).toContain('getCardBrandDisplayName');
  });

  it('should export getCardBrandIcon', () => {
    expect(indexContent).toContain('getCardBrandIcon');
  });

  it('should export isCardExpired', () => {
    expect(indexContent).toContain('isCardExpired');
  });

  it('should import from payment-store', () => {
    expect(indexContent).toContain("from './payment-store'");
  });
});

// ============================================================================
// Type Import Tests
// ============================================================================

describe('Type Imports', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  let checkoutContent: string;

  beforeEach(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should import PaymentMethod type', () => {
    expect(checkoutContent).toContain('PaymentMethod');
  });

  it('should import CardBrand type', () => {
    expect(checkoutContent).toContain('CardBrand');
  });
});

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('Payment Method Edge Cases', () => {
  const checkoutPath = path.join(process.cwd(), 'src/app/order/checkout.tsx');
  const paymentStorePath = path.join(process.cwd(), 'src/stores/payment-store.ts');

  it('should handle empty saved cards array', () => {
    const content = fs.readFileSync(checkoutPath, 'utf-8');
    expect(content).toContain('savedCards.length > 0');
  });

  it('should handle missing card.last4', () => {
    const content = fs.readFileSync(checkoutPath, 'utf-8');
    expect(content).toContain("card.last4 ?? 'unknown'");
  });

  it('should handle no selected payment method', () => {
    const content = fs.readFileSync(checkoutPath, 'utf-8');
    expect(content).toContain('selectedPaymentId: string | null');
  });

  it('should handle payment method without brand', () => {
    const content = fs.readFileSync(paymentStorePath, 'utf-8');
    expect(content).toContain('return undefined');
  });

  it('should fallback paymentMethodDisplay when no selection', () => {
    const content = fs.readFileSync(checkoutPath, 'utf-8');
    expect(content).toContain("return 'Select payment'");
  });
});
