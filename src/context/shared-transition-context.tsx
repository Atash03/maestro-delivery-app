/**
 * SharedTransitionContext
 *
 * Provides shared state for coordinating animations between screens.
 * This enables smooth visual transitions by:
 * - Tracking the source element's layout (position, size)
 * - Storing transition identifiers for matching elements
 * - Coordinating entry/exit animations between screens
 */

import type React from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { LayoutRectangle } from 'react-native';

// ============================================================================
// Types
// ============================================================================

export interface SharedElementLayout {
  /** Unique identifier for the shared element */
  id: string;
  /** The layout rectangle of the element */
  layout: LayoutRectangle;
  /** Image URI for image transitions */
  imageUri?: string;
  /** Additional data for the transition */
  data?: Record<string, unknown>;
}

export interface TransitionState {
  /** Whether a transition is currently active */
  isTransitioning: boolean;
  /** The source element being transitioned from */
  sourceElement: SharedElementLayout | null;
  /** The target screen/route */
  targetRoute: string | null;
  /** Transition direction */
  direction: 'forward' | 'backward';
}

export interface SharedTransitionContextValue {
  /** Current transition state */
  transitionState: TransitionState;
  /** Register a shared element before navigating */
  registerSourceElement: (element: SharedElementLayout, targetRoute: string) => void;
  /** Clear the transition state after animation completes */
  clearTransition: () => void;
  /** Check if there's a matching shared element for the current route */
  getSourceElement: (id: string) => SharedElementLayout | null;
  /** Set transition direction */
  setDirection: (direction: 'forward' | 'backward') => void;
  /** Mark transition as started */
  startTransition: () => void;
  /** Mark transition as completed */
  endTransition: () => void;
}

// ============================================================================
// Context
// ============================================================================

const SharedTransitionContext = createContext<SharedTransitionContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export interface SharedTransitionProviderProps {
  children: React.ReactNode;
}

export function SharedTransitionProvider({ children }: SharedTransitionProviderProps) {
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    sourceElement: null,
    targetRoute: null,
    direction: 'forward',
  });

  // Use ref to store registered elements for quick lookup
  const registeredElementsRef = useRef<Map<string, SharedElementLayout>>(new Map());

  const registerSourceElement = useCallback((element: SharedElementLayout, targetRoute: string) => {
    registeredElementsRef.current.set(element.id, element);
    setTransitionState((prev) => ({
      ...prev,
      sourceElement: element,
      targetRoute,
    }));
  }, []);

  const clearTransition = useCallback(() => {
    registeredElementsRef.current.clear();
    setTransitionState({
      isTransitioning: false,
      sourceElement: null,
      targetRoute: null,
      direction: 'forward',
    });
  }, []);

  const getSourceElement = useCallback((id: string): SharedElementLayout | null => {
    return registeredElementsRef.current.get(id) ?? null;
  }, []);

  const setDirection = useCallback((direction: 'forward' | 'backward') => {
    setTransitionState((prev) => ({
      ...prev,
      direction,
    }));
  }, []);

  const startTransition = useCallback(() => {
    setTransitionState((prev) => ({
      ...prev,
      isTransitioning: true,
    }));
  }, []);

  const endTransition = useCallback(() => {
    setTransitionState((prev) => ({
      ...prev,
      isTransitioning: false,
    }));
    // Clear after a short delay to allow exit animations
    setTimeout(() => {
      registeredElementsRef.current.clear();
    }, 100);
  }, []);

  const value = useMemo(
    () => ({
      transitionState,
      registerSourceElement,
      clearTransition,
      getSourceElement,
      setDirection,
      startTransition,
      endTransition,
    }),
    [
      transitionState,
      registerSourceElement,
      clearTransition,
      getSourceElement,
      setDirection,
      startTransition,
      endTransition,
    ]
  );

  return (
    <SharedTransitionContext.Provider value={value}>{children}</SharedTransitionContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useSharedTransition(): SharedTransitionContextValue {
  const context = useContext(SharedTransitionContext);
  if (!context) {
    throw new Error('useSharedTransition must be used within a SharedTransitionProvider');
  }
  return context;
}

/**
 * Hook to optionally use shared transition context
 * Returns null if provider is not available (safe for testing)
 */
export function useSharedTransitionOptional(): SharedTransitionContextValue | null {
  return useContext(SharedTransitionContext);
}

// ============================================================================
// Exports
// ============================================================================

export { SharedTransitionContext };
