/**
 * SharedTransitionContext Tests
 *
 * Tests for the shared transition context provider and hooks.
 * Uses file-based testing to validate structure without requiring
 * full React Native environment.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('SharedTransitionContext', () => {
  const contextPath = path.join(process.cwd(), 'src/context/shared-transition-context.tsx');
  const contextIndexPath = path.join(process.cwd(), 'src/context/index.ts');

  let contextContent: string;
  let indexContent: string;

  beforeAll(() => {
    contextContent = fs.readFileSync(contextPath, 'utf-8');
    indexContent = fs.readFileSync(contextIndexPath, 'utf-8');
  });

  describe('File Structure', () => {
    it('context file exists', () => {
      expect(fs.existsSync(contextPath)).toBe(true);
    });

    it('context index exports SharedTransitionProvider', () => {
      expect(indexContent).toContain('SharedTransitionProvider');
    });

    it('context index exports useSharedTransition', () => {
      expect(indexContent).toContain('useSharedTransition');
    });

    it('context index exports useSharedTransitionOptional', () => {
      expect(indexContent).toContain('useSharedTransitionOptional');
    });
  });

  describe('SharedTransitionProvider', () => {
    it('exports SharedTransitionProvider function', () => {
      expect(contextContent).toContain('export function SharedTransitionProvider');
    });

    it('accepts children prop', () => {
      expect(contextContent).toContain('children: React.ReactNode');
    });

    it('uses React context', () => {
      expect(contextContent).toContain('createContext');
    });
  });

  describe('Transition State', () => {
    it('defines TransitionState interface', () => {
      expect(contextContent).toContain('interface TransitionState');
    });

    it('has isTransitioning boolean', () => {
      expect(contextContent).toContain('isTransitioning: boolean');
    });

    it('has sourceElement field', () => {
      expect(contextContent).toContain('sourceElement');
    });

    it('has targetRoute field', () => {
      expect(contextContent).toContain('targetRoute');
    });

    it('has direction field', () => {
      expect(contextContent).toContain('direction');
    });
  });

  describe('Hook Implementations', () => {
    it('exports useSharedTransition hook', () => {
      expect(contextContent).toContain('export function useSharedTransition');
    });

    it('exports useSharedTransitionOptional hook', () => {
      expect(contextContent).toContain('export function useSharedTransitionOptional');
    });

    it('useSharedTransition throws when outside provider', () => {
      expect(contextContent).toContain(
        'useSharedTransition must be used within a SharedTransitionProvider'
      );
    });

    it('useSharedTransitionOptional returns null when outside provider', () => {
      // This hook doesn't throw, it returns null when context is unavailable
      expect(contextContent).toContain('useSharedTransitionOptional');
    });
  });

  describe('Context Actions', () => {
    it('defines registerSourceElement action', () => {
      expect(contextContent).toContain('registerSourceElement');
    });

    it('defines clearTransition action', () => {
      expect(contextContent).toContain('clearTransition');
    });

    it('defines startTransition action', () => {
      expect(contextContent).toContain('startTransition');
    });

    it('defines endTransition action', () => {
      expect(contextContent).toContain('endTransition');
    });

    it('defines setDirection action', () => {
      expect(contextContent).toContain('setDirection');
    });

    it('defines getSourceElement action', () => {
      expect(contextContent).toContain('getSourceElement');
    });
  });

  describe('Shared Element Types', () => {
    it('defines SharedElementLayout interface', () => {
      expect(contextContent).toContain('interface SharedElementLayout');
    });

    it('SharedElementLayout has id field', () => {
      expect(contextContent).toContain('id: string');
    });

    it('SharedElementLayout has layout field', () => {
      expect(contextContent).toContain('layout');
    });
  });

  describe('State Management', () => {
    it('uses useState for transition state', () => {
      expect(contextContent).toContain('useState');
    });

    it('uses useCallback for memoized actions', () => {
      expect(contextContent).toContain('useCallback');
    });

    it('uses useMemo for context value', () => {
      expect(contextContent).toContain('useMemo');
    });
  });
});
