/**
 * Rating Store
 *
 * Manages order rating state including:
 * - Tracking which orders have been rated
 * - Tracking which orders have pending rating prompts
 * - Storing submitted ratings
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { RatingSubmission } from '@/components/rating-modal';

export interface StoredRating extends RatingSubmission {
  submittedAt: Date;
}

interface RatingState {
  /** Map of order IDs to their submitted ratings */
  ratings: Record<string, StoredRating>;
  /** Set of order IDs that have pending rating prompts (delivered but not yet rated or dismissed) */
  pendingRatingPrompts: string[];
  /** Set of order IDs where the user dismissed the rating prompt */
  dismissedPrompts: string[];
}

interface RatingActions {
  /** Submit a rating for an order */
  submitRating: (rating: RatingSubmission) => void;
  /** Check if an order has been rated */
  hasRating: (orderId: string) => boolean;
  /** Get the rating for an order */
  getRating: (orderId: string) => StoredRating | undefined;
  /** Add an order to the pending rating prompts (called when order is delivered) */
  addPendingRatingPrompt: (orderId: string) => void;
  /** Remove an order from pending rating prompts */
  removePendingRatingPrompt: (orderId: string) => void;
  /** Dismiss the rating prompt for an order (user chose to rate later) */
  dismissRatingPrompt: (orderId: string) => void;
  /** Check if an order has a pending rating prompt */
  hasPendingRatingPrompt: (orderId: string) => boolean;
  /** Check if the rating prompt was dismissed for an order */
  wasPromptDismissed: (orderId: string) => boolean;
  /** Check if an order should show the "Rate Order" button (delivered, not rated) */
  shouldShowRateButton: (orderId: string) => boolean;
  /** Get all pending rating prompts */
  getPendingRatingPrompts: () => string[];
  /** Clear all ratings (for testing/logout) */
  clearAllRatings: () => void;
}

type RatingStore = RatingState & RatingActions;

const initialState: RatingState = {
  ratings: {},
  pendingRatingPrompts: [],
  dismissedPrompts: [],
};

export const useRatingStore = create<RatingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      submitRating: (rating: RatingSubmission) => {
        const storedRating: StoredRating = {
          ...rating,
          submittedAt: new Date(),
        };

        set((state) => ({
          ratings: {
            ...state.ratings,
            [rating.orderId]: storedRating,
          },
          // Remove from pending prompts when rated
          pendingRatingPrompts: state.pendingRatingPrompts.filter((id) => id !== rating.orderId),
          // Also remove from dismissed prompts
          dismissedPrompts: state.dismissedPrompts.filter((id) => id !== rating.orderId),
        }));
      },

      hasRating: (orderId: string) => {
        const { ratings } = get();
        return orderId in ratings;
      },

      getRating: (orderId: string) => {
        const { ratings } = get();
        return ratings[orderId];
      },

      addPendingRatingPrompt: (orderId: string) => {
        set((state) => {
          // Don't add if already rated or already pending
          if (state.ratings[orderId] || state.pendingRatingPrompts.includes(orderId)) {
            return state;
          }
          return {
            ...state,
            pendingRatingPrompts: [...state.pendingRatingPrompts, orderId],
          };
        });
      },

      removePendingRatingPrompt: (orderId: string) => {
        set((state) => ({
          ...state,
          pendingRatingPrompts: state.pendingRatingPrompts.filter((id) => id !== orderId),
        }));
      },

      dismissRatingPrompt: (orderId: string) => {
        set((state) => ({
          ...state,
          pendingRatingPrompts: state.pendingRatingPrompts.filter((id) => id !== orderId),
          dismissedPrompts: state.dismissedPrompts.includes(orderId)
            ? state.dismissedPrompts
            : [...state.dismissedPrompts, orderId],
        }));
      },

      hasPendingRatingPrompt: (orderId: string) => {
        const { pendingRatingPrompts } = get();
        return pendingRatingPrompts.includes(orderId);
      },

      wasPromptDismissed: (orderId: string) => {
        const { dismissedPrompts } = get();
        return dismissedPrompts.includes(orderId);
      },

      shouldShowRateButton: (orderId: string) => {
        const { ratings } = get();
        // Show rate button if the order hasn't been rated yet
        return !(orderId in ratings);
      },

      getPendingRatingPrompts: () => {
        const { pendingRatingPrompts } = get();
        return pendingRatingPrompts;
      },

      clearAllRatings: () => {
        set(initialState);
      },
    }),
    {
      name: 'maestro-rating-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
