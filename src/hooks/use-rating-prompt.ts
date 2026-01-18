/**
 * Rating Prompt Hook
 *
 * Manages the rating prompt flow for orders:
 * - Triggers rating prompt when an order is delivered
 * - Handles dismissal and "rate later" functionality
 * - Provides state for showing the rating modal
 * - Integrates with the rating store for persistence
 */

import { useCallback, useEffect, useState } from 'react';

import type { RatingSubmission } from '@/components/rating-modal';
import { useOrderStore, useRatingStore } from '@/stores';
import type { Order } from '@/types';

interface UseRatingPromptOptions {
  /** Whether to auto-show the modal for the first pending prompt */
  autoShowPrompt?: boolean;
  /** Specific order ID to monitor (optional - if not provided, checks all delivered orders) */
  orderId?: string;
}

interface UseRatingPromptReturn {
  /** Whether the rating modal should be shown */
  showRatingModal: boolean;
  /** The order to rate (if any) */
  orderToRate: Order | null;
  /** Whether a rating is being submitted */
  isSubmitting: boolean;
  /** Open the rating modal for a specific order */
  openRatingModal: (orderId: string) => void;
  /** Close the rating modal */
  closeRatingModal: () => void;
  /** Submit a rating */
  submitRating: (rating: RatingSubmission) => Promise<void>;
  /** Dismiss the rating prompt (rate later) */
  dismissPrompt: () => void;
  /** Check if an order has been rated */
  hasRating: (orderId: string) => boolean;
  /** Check if an order should show the "Rate Order" button */
  shouldShowRateButton: (orderId: string) => boolean;
  /** Get pending rating prompts */
  pendingPrompts: string[];
}

export function useRatingPrompt(options: UseRatingPromptOptions = {}): UseRatingPromptReturn {
  const { autoShowPrompt = false, orderId } = options;

  // Local state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store hooks
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const currentOrder = useOrderStore((state) => state.currentOrder);

  const {
    submitRating: storeSubmitRating,
    hasRating,
    addPendingRatingPrompt,
    dismissRatingPrompt,
    shouldShowRateButton,
    getPendingRatingPrompts,
  } = useRatingStore();

  // Get the order to rate
  const orderToRate = currentOrderId ? (getOrderById(currentOrderId) ?? null) : null;

  // Get pending prompts
  const pendingPrompts = getPendingRatingPrompts();

  // Watch for order delivery to trigger rating prompt
  useEffect(() => {
    if (orderId) {
      const order = getOrderById(orderId);
      if (order?.status === 'DELIVERED' && !hasRating(orderId)) {
        addPendingRatingPrompt(orderId);
      }
    }
  }, [orderId, getOrderById, hasRating, addPendingRatingPrompt]);

  // Watch current order for delivery
  useEffect(() => {
    if (currentOrder?.status === 'DELIVERED' && !hasRating(currentOrder.id)) {
      addPendingRatingPrompt(currentOrder.id);
    }
  }, [currentOrder?.status, currentOrder?.id, hasRating, addPendingRatingPrompt]);

  // Auto-show modal for pending prompts
  useEffect(() => {
    if (autoShowPrompt && pendingPrompts.length > 0 && !showRatingModal) {
      const firstPendingId = pendingPrompts[0];
      // Only auto-show if the order exists and is delivered
      const order = getOrderById(firstPendingId);
      if (order?.status === 'DELIVERED') {
        setCurrentOrderId(firstPendingId);
        setShowRatingModal(true);
      }
    }
  }, [autoShowPrompt, pendingPrompts, showRatingModal, getOrderById]);

  // Open rating modal for a specific order
  const openRatingModal = useCallback(
    (orderIdToRate: string) => {
      const order = getOrderById(orderIdToRate);
      if (order && !hasRating(orderIdToRate)) {
        setCurrentOrderId(orderIdToRate);
        setShowRatingModal(true);
      }
    },
    [getOrderById, hasRating]
  );

  // Close rating modal
  const closeRatingModal = useCallback(() => {
    setShowRatingModal(false);
    setCurrentOrderId(null);
  }, []);

  // Submit rating
  const submitRating = useCallback(
    async (rating: RatingSubmission) => {
      setIsSubmitting(true);

      try {
        // Simulate network delay for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Store the rating
        storeSubmitRating(rating);

        // Close the modal
        closeRatingModal();
      } finally {
        setIsSubmitting(false);
      }
    },
    [storeSubmitRating, closeRatingModal]
  );

  // Dismiss the prompt (rate later)
  const dismissPrompt = useCallback(() => {
    if (currentOrderId) {
      dismissRatingPrompt(currentOrderId);
    }
    closeRatingModal();
  }, [currentOrderId, dismissRatingPrompt, closeRatingModal]);

  return {
    showRatingModal,
    orderToRate,
    isSubmitting,
    openRatingModal,
    closeRatingModal,
    submitRating,
    dismissPrompt,
    hasRating,
    shouldShowRateButton,
    pendingPrompts,
  };
}

/**
 * Hook to check if a specific order should show rating prompt
 * Useful for individual order screens
 */
export function useOrderRatingStatus(orderId: string) {
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const { hasRating, shouldShowRateButton, hasPendingRatingPrompt, wasPromptDismissed } =
    useRatingStore();

  const order = getOrderById(orderId);
  const isDelivered = order?.status === 'DELIVERED';
  const isRated = hasRating(orderId);
  const showRateButton = shouldShowRateButton(orderId) && isDelivered;
  const hasPending = hasPendingRatingPrompt(orderId);
  const wasDismissed = wasPromptDismissed(orderId);

  return {
    order,
    isDelivered,
    isRated,
    showRateButton,
    hasPendingPrompt: hasPending,
    wasDismissed,
  };
}
