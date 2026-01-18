/**
 * SharedTransitionContext Tests
 *
 * Tests for the shared transition context provider and hooks.
 */

import { act, render } from '@testing-library/react-native';

import {
  SharedTransitionProvider,
  useSharedTransition,
  useSharedTransitionOptional,
} from '@/context';

// ============================================================================
// Tests
// ============================================================================

describe('SharedTransitionContext', () => {
  describe('SharedTransitionProvider', () => {
    it('provides context to children', () => {
      let contextValue: ReturnType<typeof useSharedTransition> | null = null;

      function TestConsumer() {
        contextValue = useSharedTransition();
        return null;
      }

      render(
        <SharedTransitionProvider>
          <TestConsumer />
        </SharedTransitionProvider>
      );

      expect(contextValue).not.toBeNull();
      expect(contextValue?.transitionState).toBeDefined();
      expect(contextValue?.registerSourceElement).toBeDefined();
      expect(contextValue?.clearTransition).toBeDefined();
    });

    it('initializes with correct default state', () => {
      let contextValue: ReturnType<typeof useSharedTransition> | null = null;

      function TestConsumer() {
        contextValue = useSharedTransition();
        return null;
      }

      render(
        <SharedTransitionProvider>
          <TestConsumer />
        </SharedTransitionProvider>
      );

      expect(contextValue?.transitionState).toEqual({
        isTransitioning: false,
        sourceElement: null,
        targetRoute: null,
        direction: 'forward',
      });
    });

    it('registers source element correctly', async () => {
      let contextValue: ReturnType<typeof useSharedTransition> | null = null;

      function TestConsumer() {
        contextValue = useSharedTransition();
        return null;
      }

      render(
        <SharedTransitionProvider>
          <TestConsumer />
        </SharedTransitionProvider>
      );

      const mockElement = {
        id: 'test-id',
        layout: { x: 0, y: 0, width: 100, height: 100 },
        imageUri: 'https://example.com/image.jpg',
      };

      await act(() => {
        contextValue?.registerSourceElement(mockElement, '/restaurant/1');
      });

      expect(contextValue?.transitionState.sourceElement).toEqual(mockElement);
      expect(contextValue?.transitionState.targetRoute).toBe('/restaurant/1');
    });

    it('clears transition state', async () => {
      let contextValue: ReturnType<typeof useSharedTransition> | null = null;

      function TestConsumer() {
        contextValue = useSharedTransition();
        return null;
      }

      render(
        <SharedTransitionProvider>
          <TestConsumer />
        </SharedTransitionProvider>
      );

      // Register an element first
      await act(() => {
        contextValue?.registerSourceElement(
          {
            id: 'test-id',
            layout: { x: 0, y: 0, width: 100, height: 100 },
          },
          '/restaurant/1'
        );
      });

      // Clear the transition
      await act(() => {
        contextValue?.clearTransition();
      });

      expect(contextValue?.transitionState).toEqual({
        isTransitioning: false,
        sourceElement: null,
        targetRoute: null,
        direction: 'forward',
      });
    });

    it('sets transition direction', async () => {
      let contextValue: ReturnType<typeof useSharedTransition> | null = null;

      function TestConsumer() {
        contextValue = useSharedTransition();
        return null;
      }

      render(
        <SharedTransitionProvider>
          <TestConsumer />
        </SharedTransitionProvider>
      );

      await act(() => {
        contextValue?.setDirection('backward');
      });

      expect(contextValue?.transitionState.direction).toBe('backward');
    });

    it('starts and ends transition', async () => {
      let contextValue: ReturnType<typeof useSharedTransition> | null = null;

      function TestConsumer() {
        contextValue = useSharedTransition();
        return null;
      }

      render(
        <SharedTransitionProvider>
          <TestConsumer />
        </SharedTransitionProvider>
      );

      await act(() => {
        contextValue?.startTransition();
      });
      expect(contextValue?.transitionState.isTransitioning).toBe(true);

      await act(() => {
        contextValue?.endTransition();
      });
      expect(contextValue?.transitionState.isTransitioning).toBe(false);
    });

    it('retrieves registered source element by id', async () => {
      let contextValue: ReturnType<typeof useSharedTransition> | null = null;

      function TestConsumer() {
        contextValue = useSharedTransition();
        return null;
      }

      render(
        <SharedTransitionProvider>
          <TestConsumer />
        </SharedTransitionProvider>
      );

      const mockElement = {
        id: 'restaurant-image-1',
        layout: { x: 10, y: 20, width: 200, height: 150 },
        imageUri: 'https://example.com/restaurant.jpg',
      };

      await act(() => {
        contextValue?.registerSourceElement(mockElement, '/restaurant/1');
      });

      const retrieved = contextValue?.getSourceElement('restaurant-image-1');
      expect(retrieved).toEqual(mockElement);

      const notFound = contextValue?.getSourceElement('non-existent');
      expect(notFound).toBeNull();
    });
  });

  describe('useSharedTransitionOptional', () => {
    it('returns null when used outside provider', () => {
      let contextValue: ReturnType<typeof useSharedTransitionOptional>;

      function TestConsumer() {
        contextValue = useSharedTransitionOptional();
        return null;
      }

      render(<TestConsumer />);

      expect(contextValue).toBeNull();
    });

    it('returns context when used inside provider', () => {
      let contextValue: ReturnType<typeof useSharedTransitionOptional>;

      function TestConsumer() {
        contextValue = useSharedTransitionOptional();
        return null;
      }

      render(
        <SharedTransitionProvider>
          <TestConsumer />
        </SharedTransitionProvider>
      );

      expect(contextValue).not.toBeNull();
    });
  });

  describe('useSharedTransition', () => {
    it('throws error when used outside provider', () => {
      function TestConsumer() {
        useSharedTransition();
        return null;
      }

      // Suppress console.error for expected error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TestConsumer />)).toThrow(
        'useSharedTransition must be used within a SharedTransitionProvider'
      );

      consoleSpy.mockRestore();
    });
  });
});
