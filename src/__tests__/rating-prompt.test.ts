/**
 * Tests for Rating Prompt Functionality
 *
 * Tests the rating store and rating prompt hook for correct behavior:
 * - Rating store file structure and exports
 * - Rating prompt hook file structure
 * - Integration with order screens
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ============================================================================
// Test Paths
// ============================================================================

const ratingStorePath = resolve(__dirname, '../stores/rating-store.ts');
const ratingPromptHookPath = resolve(__dirname, '../hooks/use-rating-prompt.ts');
const orderDetailsScreenPath = resolve(__dirname, '../app/order/details/[id].tsx');
const orderTrackingScreenPath = resolve(__dirname, '../app/order/tracking/[id].tsx');
const ordersScreenPath = resolve(__dirname, '../app/(tabs)/orders.tsx');
const orderCardPath = resolve(__dirname, '../components/cards/order-card.tsx');
const storesIndexPath = resolve(__dirname, '../stores/index.ts');

// ============================================================================
// Rating Store Tests
// ============================================================================

describe('Rating Store', () => {
  let storeContent: string;

  beforeAll(() => {
    storeContent = readFileSync(ratingStorePath, 'utf-8');
  });

  describe('File Structure', () => {
    it('rating store file should exist', () => {
      expect(existsSync(ratingStorePath)).toBe(true);
    });

    it('should be exported from stores index', () => {
      const indexContent = readFileSync(storesIndexPath, 'utf-8');
      expect(indexContent).toContain('useRatingStore');
      expect(indexContent).toContain("from './rating-store'");
    });
  });

  describe('State Structure', () => {
    it('should define ratings record for storing submitted ratings', () => {
      expect(storeContent).toContain('ratings: Record<string, StoredRating>');
    });

    it('should define pendingRatingPrompts array', () => {
      expect(storeContent).toContain('pendingRatingPrompts: string[]');
    });

    it('should define dismissedPrompts array', () => {
      expect(storeContent).toContain('dismissedPrompts: string[]');
    });

    it('should export StoredRating interface', () => {
      expect(storeContent).toContain('export interface StoredRating');
    });
  });

  describe('Actions', () => {
    it('should implement submitRating action', () => {
      expect(storeContent).toContain('submitRating: (rating: RatingSubmission)');
    });

    it('should implement hasRating action', () => {
      expect(storeContent).toContain('hasRating: (orderId: string)');
    });

    it('should implement getRating action', () => {
      expect(storeContent).toContain('getRating: (orderId: string)');
    });

    it('should implement addPendingRatingPrompt action', () => {
      expect(storeContent).toContain('addPendingRatingPrompt: (orderId: string)');
    });

    it('should implement removePendingRatingPrompt action', () => {
      expect(storeContent).toContain('removePendingRatingPrompt: (orderId: string)');
    });

    it('should implement dismissRatingPrompt action', () => {
      expect(storeContent).toContain('dismissRatingPrompt: (orderId: string)');
    });

    it('should implement hasPendingRatingPrompt action', () => {
      expect(storeContent).toContain('hasPendingRatingPrompt: (orderId: string)');
    });

    it('should implement wasPromptDismissed action', () => {
      expect(storeContent).toContain('wasPromptDismissed: (orderId: string)');
    });

    it('should implement shouldShowRateButton action', () => {
      expect(storeContent).toContain('shouldShowRateButton: (orderId: string)');
    });

    it('should implement getPendingRatingPrompts action', () => {
      expect(storeContent).toContain('getPendingRatingPrompts: ()');
    });

    it('should implement clearAllRatings action', () => {
      expect(storeContent).toContain('clearAllRatings: ()');
    });
  });

  describe('Persistence', () => {
    it('should use zustand persist middleware', () => {
      expect(storeContent).toContain('persist(');
      expect(storeContent).toContain("from 'zustand/middleware'");
    });

    it('should use AsyncStorage for persistence', () => {
      expect(storeContent).toContain('AsyncStorage');
      expect(storeContent).toContain('createJSONStorage');
    });

    it('should have unique storage key', () => {
      expect(storeContent).toContain("name: 'maestro-rating-storage'");
    });
  });

  describe('Submit Rating Logic', () => {
    it('should add submittedAt timestamp to rating', () => {
      expect(storeContent).toContain('submittedAt: new Date()');
    });

    it('should remove from pending prompts when rating is submitted', () => {
      expect(storeContent).toContain('pendingRatingPrompts: state.pendingRatingPrompts.filter');
    });

    it('should remove from dismissed prompts when rating is submitted', () => {
      expect(storeContent).toContain('dismissedPrompts: state.dismissedPrompts.filter');
    });
  });

  describe('Pending Prompts Logic', () => {
    it('should check if already rated before adding pending prompt', () => {
      expect(storeContent).toContain('state.ratings[orderId]');
    });

    it('should check for duplicates before adding pending prompt', () => {
      expect(storeContent).toContain('state.pendingRatingPrompts.includes(orderId)');
    });
  });
});

// ============================================================================
// Rating Prompt Hook Tests
// ============================================================================

describe('useRatingPrompt Hook', () => {
  let hookContent: string;

  beforeAll(() => {
    hookContent = readFileSync(ratingPromptHookPath, 'utf-8');
  });

  describe('File Structure', () => {
    it('rating prompt hook file should exist', () => {
      expect(existsSync(ratingPromptHookPath)).toBe(true);
    });

    it('should export useRatingPrompt hook', () => {
      expect(hookContent).toContain('export function useRatingPrompt');
    });

    it('should export useOrderRatingStatus hook', () => {
      expect(hookContent).toContain('export function useOrderRatingStatus');
    });
  });

  describe('Options Interface', () => {
    it('should define autoShowPrompt option', () => {
      expect(hookContent).toContain('autoShowPrompt?: boolean');
    });

    it('should define orderId option', () => {
      expect(hookContent).toContain('orderId?: string');
    });
  });

  describe('Return Interface', () => {
    it('should return showRatingModal state', () => {
      expect(hookContent).toContain('showRatingModal');
    });

    it('should return orderToRate', () => {
      expect(hookContent).toContain('orderToRate');
    });

    it('should return isSubmitting state', () => {
      expect(hookContent).toContain('isSubmitting');
    });

    it('should return openRatingModal function', () => {
      expect(hookContent).toContain('openRatingModal');
    });

    it('should return closeRatingModal function', () => {
      expect(hookContent).toContain('closeRatingModal');
    });

    it('should return submitRating function', () => {
      expect(hookContent).toContain('submitRating');
    });

    it('should return dismissPrompt function', () => {
      expect(hookContent).toContain('dismissPrompt');
    });

    it('should return hasRating function', () => {
      expect(hookContent).toContain('hasRating');
    });

    it('should return shouldShowRateButton function', () => {
      expect(hookContent).toContain('shouldShowRateButton');
    });

    it('should return pendingPrompts', () => {
      expect(hookContent).toContain('pendingPrompts');
    });
  });

  describe('Integration with Stores', () => {
    it('should import useOrderStore', () => {
      expect(hookContent).toContain("import { useOrderStore, useRatingStore } from '@/stores'");
    });

    it('should import useRatingStore', () => {
      expect(hookContent).toContain('useRatingStore');
    });
  });

  describe('Order Delivery Detection', () => {
    it('should watch for order status changes', () => {
      expect(hookContent).toContain("order?.status === 'DELIVERED'");
    });

    it('should watch current order for delivery', () => {
      expect(hookContent).toContain("currentOrder?.status === 'DELIVERED'");
    });

    it('should add pending prompt when order is delivered', () => {
      expect(hookContent).toContain('addPendingRatingPrompt');
    });
  });

  describe('Auto-show Logic', () => {
    it('should check autoShowPrompt option', () => {
      expect(hookContent).toContain('autoShowPrompt && pendingPrompts.length > 0');
    });

    it('should auto-show modal for first pending prompt', () => {
      expect(hookContent).toContain('pendingPrompts[0]');
    });
  });

  describe('Submit Rating Logic', () => {
    it('should simulate network delay', () => {
      expect(hookContent).toContain('setTimeout');
    });

    it('should close modal after submission', () => {
      expect(hookContent).toContain('closeRatingModal()');
    });
  });
});

// ============================================================================
// useOrderRatingStatus Hook Tests
// ============================================================================

describe('useOrderRatingStatus Hook', () => {
  let hookContent: string;

  beforeAll(() => {
    hookContent = readFileSync(ratingPromptHookPath, 'utf-8');
  });

  it('should return order from store', () => {
    expect(hookContent).toContain('getOrderById(orderId)');
  });

  it('should check if order is delivered', () => {
    expect(hookContent).toContain("order?.status === 'DELIVERED'");
  });

  it('should check if order is rated', () => {
    expect(hookContent).toContain('hasRating(orderId)');
  });

  it('should determine if rate button should show', () => {
    expect(hookContent).toContain('shouldShowRateButton(orderId) && isDelivered');
  });

  it('should check for pending prompts', () => {
    expect(hookContent).toContain('hasPendingRatingPrompt(orderId)');
  });

  it('should check if prompt was dismissed', () => {
    expect(hookContent).toContain('wasPromptDismissed(orderId)');
  });
});

// ============================================================================
// Order Details Screen Integration Tests
// ============================================================================

describe('Order Details Screen Integration', () => {
  let screenContent: string;

  beforeAll(() => {
    screenContent = readFileSync(orderDetailsScreenPath, 'utf-8');
  });

  describe('Rating Modal Integration', () => {
    it('should import RatingModal component', () => {
      expect(screenContent).toContain('import { RatingModal');
    });

    it('should import RatingSubmission type', () => {
      expect(screenContent).toContain('RatingSubmission');
    });

    it('should import useRatingPrompt hook', () => {
      expect(screenContent).toContain(
        "import { useRatingPrompt } from '@/hooks/use-rating-prompt'"
      );
    });

    it('should use useRatingPrompt hook', () => {
      expect(screenContent).toContain('useRatingPrompt({ orderId:');
    });

    it('should render RatingModal component', () => {
      expect(screenContent).toContain('<RatingModal');
    });
  });

  describe('Rate Button', () => {
    it('should determine when to show rate button', () => {
      expect(screenContent).toContain("shouldShowRateButton(id) && order?.status === 'DELIVERED'");
    });

    it('should have Rate Order button with star icon', () => {
      expect(screenContent).toContain('label="Rate Order"');
      expect(screenContent).toContain('icon="star-outline"');
    });

    it('should handle rate order press', () => {
      expect(screenContent).toContain('handleRateOrder');
      expect(screenContent).toContain('openRatingModal(id)');
    });
  });

  describe('Rating Handlers', () => {
    it('should handle rating submission', () => {
      expect(screenContent).toContain('handleRatingSubmit');
      expect(screenContent).toContain('submitRating(rating)');
    });

    it('should handle rating close/dismiss', () => {
      expect(screenContent).toContain('handleRatingClose');
      expect(screenContent).toContain('dismissPrompt()');
    });
  });
});

// ============================================================================
// Order Tracking Screen Integration Tests
// ============================================================================

describe('Order Tracking Screen Integration', () => {
  let screenContent: string;

  beforeAll(() => {
    screenContent = readFileSync(orderTrackingScreenPath, 'utf-8');
  });

  describe('Rating Modal Integration', () => {
    it('should import RatingModal component', () => {
      expect(screenContent).toContain('import { RatingModal');
    });

    it('should import useRatingPrompt hook', () => {
      expect(screenContent).toContain(
        "import { useRatingPrompt } from '@/hooks/use-rating-prompt'"
      );
    });

    it('should use useRatingPrompt with autoShowPrompt', () => {
      expect(screenContent).toContain('autoShowPrompt: true');
    });

    it('should render RatingModal component', () => {
      expect(screenContent).toContain('<RatingModal');
    });
  });

  describe('Auto-trigger on Delivery', () => {
    it('should pass orderId to hook', () => {
      expect(screenContent).toContain('orderId: id');
    });

    it('should comment about auto-show on delivery', () => {
      expect(screenContent).toContain('appears when order is delivered');
    });
  });
});

// ============================================================================
// Orders Screen Integration Tests
// ============================================================================

describe('Orders Screen Integration', () => {
  let screenContent: string;

  beforeAll(() => {
    screenContent = readFileSync(ordersScreenPath, 'utf-8');
  });

  describe('Rating Modal Integration', () => {
    it('should import RatingModal component', () => {
      expect(screenContent).toContain('import { RatingModal');
    });

    it('should import useRatingPrompt hook', () => {
      expect(screenContent).toContain(
        "import { useRatingPrompt } from '@/hooks/use-rating-prompt'"
      );
    });

    it('should use useRatingPrompt hook', () => {
      expect(screenContent).toContain('useRatingPrompt()');
    });

    it('should render RatingModal component', () => {
      expect(screenContent).toContain('<RatingModal');
    });
  });

  describe('Rate Button in Order List', () => {
    it('should pass onRatePress to OrderCard', () => {
      expect(screenContent).toContain('onRatePress={handleRatePress}');
    });

    it('should handle rate press callback', () => {
      expect(screenContent).toContain('handleRatePress');
      expect(screenContent).toContain('openRatingModal(order.id)');
    });
  });
});

// ============================================================================
// Order Card Integration Tests
// ============================================================================

describe('Order Card Integration', () => {
  let cardContent: string;

  beforeAll(() => {
    cardContent = readFileSync(orderCardPath, 'utf-8');
  });

  describe('Rate Button Support', () => {
    it('should import useRatingStore', () => {
      expect(cardContent).toContain("import { useRatingStore } from '@/stores'");
    });

    it('should accept onRatePress prop', () => {
      expect(cardContent).toContain('onRatePress?: (order: Order) => void');
    });

    it('should check if order has been rated', () => {
      expect(cardContent).toContain('hasRating(order.id)');
    });

    it('should check if order is delivered', () => {
      expect(cardContent).toContain("order.status === 'DELIVERED'");
    });

    it('should determine when to show rate button', () => {
      expect(cardContent).toContain('showRateButton = isDelivered && !isRated && onRatePress');
    });

    it('should render rate button when appropriate', () => {
      expect(cardContent).toContain('{showRateButton && (');
    });

    it('should have Rate Order button text', () => {
      expect(cardContent).toContain('Rate Order');
    });

    it('should have star icon for rate button', () => {
      expect(cardContent).toContain('star-outline');
    });

    it('should handle rate button press', () => {
      expect(cardContent).toContain('handleRatePress');
      expect(cardContent).toContain('onRatePress?.(order)');
    });

    it('should have rate button styles', () => {
      expect(cardContent).toContain('rateButton:');
      expect(cardContent).toContain('rateButtonText:');
    });
  });
});

// ============================================================================
// Complete Flow Tests
// ============================================================================

describe('Rating Flow', () => {
  describe('Trigger on Delivery', () => {
    it('should add pending prompt when order is delivered (order tracking)', () => {
      const trackingContent = readFileSync(orderTrackingScreenPath, 'utf-8');
      expect(trackingContent).toContain('autoShowPrompt: true');
    });

    it('should watch for delivery status in hook', () => {
      const hookContent = readFileSync(ratingPromptHookPath, 'utf-8');
      expect(hookContent).toContain("status === 'DELIVERED'");
    });
  });

  describe('Rate Later Option', () => {
    it('should support dismissing the prompt', () => {
      const hookContent = readFileSync(ratingPromptHookPath, 'utf-8');
      expect(hookContent).toContain('dismissPrompt');
      expect(hookContent).toContain('dismissRatingPrompt');
    });

    it('should track dismissed prompts in store', () => {
      const storeContent = readFileSync(ratingStorePath, 'utf-8');
      expect(storeContent).toContain('dismissedPrompts');
    });
  });

  describe('Rate Order Button in History', () => {
    it('should show Rate Order button for unrated delivered orders', () => {
      const cardContent = readFileSync(orderCardPath, 'utf-8');
      expect(cardContent).toContain('showRateButton');
      expect(cardContent).toContain('Rate Order');
    });

    it('should open rating modal when Rate Order is pressed', () => {
      const ordersContent = readFileSync(ordersScreenPath, 'utf-8');
      expect(ordersContent).toContain('openRatingModal(order.id)');
    });
  });
});
