/**
 * useGuestConversion hook - Manages guest-to-user conversion flow
 *
 * This hook provides functionality to:
 * - Check if the current user is a guest
 * - Prompt guests to sign up when accessing restricted features
 * - Preserve cart data during conversion
 * - Handle the conversion flow
 */

import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { useAuthStore, useCartStore } from '@/stores';
import type { User } from '@/types';

export type RestrictedFeature =
  | 'order_history'
  | 'saved_addresses'
  | 'saved_payments'
  | 'favorites'
  | 'profile'
  | 'checkout';

interface UseGuestConversionReturn {
  /** Whether the current user is a guest */
  isGuest: boolean;
  /** Whether the user is authenticated (not guest) */
  isAuthenticated: boolean;
  /** Check if a feature is restricted for guests */
  isFeatureRestricted: (feature: RestrictedFeature) => boolean;
  /** Get the list of restricted features for guests */
  restrictedFeatures: RestrictedFeature[];
  /** Prompt the guest to sign up, navigating to sign-up screen */
  promptSignUp: (returnTo?: string) => void;
  /** Prompt the guest to sign in, navigating to sign-in screen */
  promptSignIn: (returnTo?: string) => void;
  /** Convert guest to user with preserved cart */
  convertToUser: (user: User) => void;
  /** Check if guest has pending cart items */
  hasGuestCart: boolean;
  /** Number of items in guest cart */
  guestCartItemCount: number;
}

/**
 * Features that are restricted for guest users
 * These features require authentication to access
 */
const RESTRICTED_FEATURES: RestrictedFeature[] = [
  'order_history',
  'saved_addresses',
  'saved_payments',
  'favorites',
  'profile',
  'checkout', // Guests can add to cart but need to sign up to checkout
];

export function useGuestConversion(): UseGuestConversionReturn {
  const router = useRouter();
  const { isGuest, isAuthenticated, convertGuestToUser } = useAuthStore();
  const { items, getItemCount } = useCartStore();

  const isFeatureRestricted = useCallback(
    (feature: RestrictedFeature): boolean => {
      if (!isGuest) {
        return false; // Authenticated users have access to all features
      }
      return RESTRICTED_FEATURES.includes(feature);
    },
    [isGuest]
  );

  const promptSignUp = useCallback(
    (returnTo?: string) => {
      // Store the return path for after sign-up if needed
      // For now, just navigate to sign-up
      // In future, could use AsyncStorage to preserve navigation intent
      router.push({
        pathname: '/(auth)/sign-up',
        params: returnTo ? { returnTo } : undefined,
      });
    },
    [router]
  );

  const promptSignIn = useCallback(
    (returnTo?: string) => {
      router.push({
        pathname: '/(auth)/sign-in',
        params: returnTo ? { returnTo } : undefined,
      });
    },
    [router]
  );

  const convertToUser = useCallback(
    (user: User) => {
      // The cart items are preserved because they're stored separately
      // in the cart store. We just need to convert the guest to a user.
      convertGuestToUser(user);
    },
    [convertGuestToUser]
  );

  const hasGuestCart = useMemo(() => {
    return isGuest && items.length > 0;
  }, [isGuest, items.length]);

  const guestCartItemCount = useMemo(() => {
    if (!isGuest) {
      return 0;
    }
    return getItemCount();
  }, [isGuest, getItemCount]);

  return {
    isGuest,
    isAuthenticated,
    isFeatureRestricted,
    restrictedFeatures: RESTRICTED_FEATURES,
    promptSignUp,
    promptSignIn,
    convertToUser,
    hasGuestCart,
    guestCartItemCount,
  };
}
