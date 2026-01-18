/**
 * Issue Store
 *
 * Manages issue reporting state for the Maestro Food Delivery App.
 * Handles issue submission, tracking, and status updates.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Issue, IssueCategory, IssueStatus } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface IssueSubmissionData {
  orderId: string;
  userId: string;
  category: IssueCategory;
  description: string;
  photos?: string[];
  affectedItems?: string[];
}

interface IssueState {
  issues: Issue[];
  currentIssue: Issue | null;
  isSubmitting: boolean;
  submissionError: string | null;
}

interface IssueActions {
  submitIssue: (data: IssueSubmissionData) => Promise<Issue>;
  updateIssueStatus: (issueId: string, status: IssueStatus, resolution?: string) => void;
  getIssueById: (issueId: string) => Issue | undefined;
  getIssuesByOrderId: (orderId: string) => Issue[];
  getIssuesByStatus: (status: IssueStatus) => Issue[];
  setCurrentIssue: (issue: Issue | null) => void;
  clearSubmissionError: () => void;
  clearAllIssues: () => void;
}

type IssueStore = IssueState & IssueActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: IssueState = {
  issues: [],
  currentIssue: null,
  isSubmitting: false,
  submissionError: null,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a unique issue ID
 */
function generateIssueId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `ISS-${timestamp}-${randomPart}`.toUpperCase();
}

/**
 * Simulate network delay for mock API calls
 */
function simulateNetworkDelay(minMs: number = 800, maxMs: number = 1500): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// ============================================================================
// Store
// ============================================================================

export const useIssueStore = create<IssueStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Submit a new issue
       * Simulates API call with network delay
       */
      submitIssue: async (data: IssueSubmissionData): Promise<Issue> => {
        set({ isSubmitting: true, submissionError: null });

        try {
          // Simulate network delay
          await simulateNetworkDelay();

          // Create the issue object
          const now = new Date();
          const newIssue: Issue = {
            id: generateIssueId(),
            orderId: data.orderId,
            userId: data.userId,
            category: data.category,
            description: data.description,
            photos: data.photos || [],
            affectedItems: data.affectedItems || [],
            status: 'reported',
            createdAt: now,
            updatedAt: now,
          };

          // Add to store
          set((state) => ({
            issues: [newIssue, ...state.issues],
            currentIssue: newIssue,
            isSubmitting: false,
          }));

          return newIssue;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to submit issue';
          set({
            isSubmitting: false,
            submissionError: errorMessage,
          });
          throw error;
        }
      },

      /**
       * Update an issue's status
       */
      updateIssueStatus: (issueId: string, status: IssueStatus, resolution?: string) => {
        const now = new Date();
        set((state) => ({
          issues: state.issues.map((issue) => {
            if (issue.id === issueId) {
              return {
                ...issue,
                status,
                resolution: resolution || issue.resolution,
                updatedAt: now,
                resolvedAt: status === 'resolved' || status === 'refunded' ? now : issue.resolvedAt,
              };
            }
            return issue;
          }),
          currentIssue:
            state.currentIssue?.id === issueId
              ? {
                  ...state.currentIssue,
                  status,
                  resolution: resolution || state.currentIssue.resolution,
                  updatedAt: now,
                  resolvedAt:
                    status === 'resolved' || status === 'refunded'
                      ? now
                      : state.currentIssue.resolvedAt,
                }
              : state.currentIssue,
        }));
      },

      /**
       * Get issue by ID
       */
      getIssueById: (issueId: string) => {
        return get().issues.find((issue) => issue.id === issueId);
      },

      /**
       * Get all issues for an order
       */
      getIssuesByOrderId: (orderId: string) => {
        return get().issues.filter((issue) => issue.orderId === orderId);
      },

      /**
       * Get all issues with a specific status
       */
      getIssuesByStatus: (status: IssueStatus) => {
        return get().issues.filter((issue) => issue.status === status);
      },

      /**
       * Set the current issue being viewed
       */
      setCurrentIssue: (issue: Issue | null) => {
        set({ currentIssue: issue });
      },

      /**
       * Clear submission error
       */
      clearSubmissionError: () => {
        set({ submissionError: null });
      },

      /**
       * Clear all issues (for testing/development)
       */
      clearAllIssues: () => {
        set(initialState);
      },
    }),
    {
      name: 'maestro-issue-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        issues: state.issues,
      }),
    }
  )
);

// ============================================================================
// Exports
// ============================================================================

export { generateIssueId, simulateNetworkDelay };
export type { IssueSubmissionData, IssueState, IssueActions };
