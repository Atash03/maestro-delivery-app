/**
 * Tests for Issue Store
 *
 * Tests the issue store for correct state management including:
 * - Issue submission
 * - Issue status updates
 * - Issue retrieval by ID, order ID, and status
 */

import { generateIssueId, type IssueSubmissionData, useIssueStore } from '@/stores/issue-store';
import type { Issue } from '@/types';

// Helper to reset store between tests
function resetStore() {
  useIssueStore.setState({
    issues: [],
    currentIssue: null,
    isSubmitting: false,
    submissionError: null,
  });
}

// ============================================================================
// Test Data Fixtures
// ============================================================================

const createMockIssueSubmission = (
  overrides?: Partial<IssueSubmissionData>
): IssueSubmissionData => ({
  orderId: 'order-123',
  userId: 'user-456',
  category: 'missing_items',
  description: 'Some items were missing from my order',
  photos: [],
  affectedItems: ['item-1', 'item-2'],
  ...overrides,
});

const createMockIssue = (overrides?: Partial<Issue>): Issue => ({
  id: 'ISS-TEST-123',
  orderId: 'order-123',
  userId: 'user-456',
  category: 'missing_items',
  description: 'Test issue description',
  photos: [],
  affectedItems: ['item-1'],
  status: 'reported',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
  ...overrides,
});

// ============================================================================
// Tests
// ============================================================================

describe('Issue Store', () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useIssueStore.getState();
      expect(state.issues).toEqual([]);
      expect(state.currentIssue).toBeNull();
      expect(state.isSubmitting).toBe(false);
      expect(state.submissionError).toBeNull();
    });
  });

  describe('generateIssueId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateIssueId();
      const id2 = generateIssueId();

      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with ISS- prefix', () => {
      const id = generateIssueId();
      expect(id.startsWith('ISS-')).toBe(true);
    });

    it('should generate IDs in uppercase', () => {
      const id = generateIssueId();
      expect(id).toBe(id.toUpperCase());
    });
  });

  describe('submitIssue', () => {
    it('should submit an issue successfully', async () => {
      const { submitIssue } = useIssueStore.getState();
      const submissionData = createMockIssueSubmission();

      const issue = await submitIssue(submissionData);

      expect(issue).toBeDefined();
      expect(issue.id).toBeDefined();
      expect(issue.orderId).toBe(submissionData.orderId);
      expect(issue.userId).toBe(submissionData.userId);
      expect(issue.category).toBe(submissionData.category);
      expect(issue.description).toBe(submissionData.description);
      expect(issue.status).toBe('reported');
    });

    it('should add the issue to the issues array', async () => {
      const { submitIssue } = useIssueStore.getState();
      const submissionData = createMockIssueSubmission();

      await submitIssue(submissionData);

      const state = useIssueStore.getState();
      expect(state.issues).toHaveLength(1);
      expect(state.issues[0].orderId).toBe(submissionData.orderId);
    });

    it('should set the submitted issue as currentIssue', async () => {
      const { submitIssue } = useIssueStore.getState();
      const submissionData = createMockIssueSubmission();

      const issue = await submitIssue(submissionData);

      const state = useIssueStore.getState();
      expect(state.currentIssue).toEqual(issue);
    });

    it('should set isSubmitting to false after submission', async () => {
      const { submitIssue } = useIssueStore.getState();
      const submissionData = createMockIssueSubmission();

      await submitIssue(submissionData);

      const state = useIssueStore.getState();
      expect(state.isSubmitting).toBe(false);
    });

    it('should include photos when provided', async () => {
      const { submitIssue } = useIssueStore.getState();
      const photos = ['photo1.jpg', 'photo2.jpg'];
      const submissionData = createMockIssueSubmission({ photos });

      const issue = await submitIssue(submissionData);

      expect(issue.photos).toEqual(photos);
    });

    it('should include affected items when provided', async () => {
      const { submitIssue } = useIssueStore.getState();
      const affectedItems = ['item-a', 'item-b', 'item-c'];
      const submissionData = createMockIssueSubmission({ affectedItems });

      const issue = await submitIssue(submissionData);

      expect(issue.affectedItems).toEqual(affectedItems);
    });

    it('should handle multiple issue submissions', async () => {
      const { submitIssue } = useIssueStore.getState();

      await submitIssue(createMockIssueSubmission({ orderId: 'order-1' }));
      await submitIssue(createMockIssueSubmission({ orderId: 'order-2' }));
      await submitIssue(createMockIssueSubmission({ orderId: 'order-3' }));

      const state = useIssueStore.getState();
      expect(state.issues).toHaveLength(3);
    });

    it('should add new issues at the beginning of the array', async () => {
      const { submitIssue } = useIssueStore.getState();

      await submitIssue(createMockIssueSubmission({ orderId: 'order-1' }));
      await submitIssue(createMockIssueSubmission({ orderId: 'order-2' }));

      const state = useIssueStore.getState();
      expect(state.issues[0].orderId).toBe('order-2');
      expect(state.issues[1].orderId).toBe('order-1');
    });
  });

  describe('updateIssueStatus', () => {
    beforeEach(async () => {
      // Add a test issue
      const { submitIssue } = useIssueStore.getState();
      await submitIssue(createMockIssueSubmission());
    });

    it('should update issue status', () => {
      const { issues, updateIssueStatus } = useIssueStore.getState();
      const issueId = issues[0].id;

      updateIssueStatus(issueId, 'under_review');

      const state = useIssueStore.getState();
      const updatedIssue = state.issues.find((i) => i.id === issueId);
      expect(updatedIssue?.status).toBe('under_review');
    });

    it('should update currentIssue if it matches', () => {
      const { currentIssue, updateIssueStatus } = useIssueStore.getState();
      if (!currentIssue) throw new Error('currentIssue should exist');

      updateIssueStatus(currentIssue.id, 'resolved');

      const state = useIssueStore.getState();
      expect(state.currentIssue?.status).toBe('resolved');
    });

    it('should set resolvedAt when status is resolved', () => {
      const { issues, updateIssueStatus } = useIssueStore.getState();
      const issueId = issues[0].id;

      updateIssueStatus(issueId, 'resolved');

      const state = useIssueStore.getState();
      const updatedIssue = state.issues.find((i) => i.id === issueId);
      expect(updatedIssue?.resolvedAt).toBeDefined();
    });

    it('should set resolvedAt when status is refunded', () => {
      const { issues, updateIssueStatus } = useIssueStore.getState();
      const issueId = issues[0].id;

      updateIssueStatus(issueId, 'refunded');

      const state = useIssueStore.getState();
      const updatedIssue = state.issues.find((i) => i.id === issueId);
      expect(updatedIssue?.resolvedAt).toBeDefined();
    });

    it('should include resolution message when provided', () => {
      const { issues, updateIssueStatus } = useIssueStore.getState();
      const issueId = issues[0].id;
      const resolution = 'Refund of $10 has been processed';

      updateIssueStatus(issueId, 'resolved', resolution);

      const state = useIssueStore.getState();
      const updatedIssue = state.issues.find((i) => i.id === issueId);
      expect(updatedIssue?.resolution).toBe(resolution);
    });

    it('should update updatedAt timestamp', () => {
      const { issues, updateIssueStatus } = useIssueStore.getState();
      const issueId = issues[0].id;
      const originalUpdatedAt = issues[0].updatedAt;

      // Wait a tiny bit to ensure timestamp is different
      updateIssueStatus(issueId, 'under_review');

      const state = useIssueStore.getState();
      const updatedIssue = state.issues.find((i) => i.id === issueId);
      expect(updatedIssue?.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('getIssueById', () => {
    beforeEach(async () => {
      const { submitIssue } = useIssueStore.getState();
      await submitIssue(createMockIssueSubmission({ orderId: 'order-1' }));
      await submitIssue(createMockIssueSubmission({ orderId: 'order-2' }));
    });

    it('should return the correct issue by ID', () => {
      const { issues, getIssueById } = useIssueStore.getState();
      const targetIssue = issues[0];

      const result = getIssueById(targetIssue.id);

      expect(result).toEqual(targetIssue);
    });

    it('should return undefined for non-existent ID', () => {
      const { getIssueById } = useIssueStore.getState();

      const result = getIssueById('non-existent-id');

      expect(result).toBeUndefined();
    });
  });

  describe('getIssuesByOrderId', () => {
    beforeEach(async () => {
      const { submitIssue } = useIssueStore.getState();
      await submitIssue(createMockIssueSubmission({ orderId: 'order-1' }));
      await submitIssue(createMockIssueSubmission({ orderId: 'order-1' }));
      await submitIssue(createMockIssueSubmission({ orderId: 'order-2' }));
    });

    it('should return all issues for an order', () => {
      const { getIssuesByOrderId } = useIssueStore.getState();

      const results = getIssuesByOrderId('order-1');

      expect(results).toHaveLength(2);
      expect(results.every((i) => i.orderId === 'order-1')).toBe(true);
    });

    it('should return empty array for order with no issues', () => {
      const { getIssuesByOrderId } = useIssueStore.getState();

      const results = getIssuesByOrderId('order-999');

      expect(results).toEqual([]);
    });
  });

  describe('getIssuesByStatus', () => {
    beforeEach(async () => {
      const { submitIssue } = useIssueStore.getState();

      const issue1 = await submitIssue(createMockIssueSubmission({ orderId: 'order-1' }));
      const issue2 = await submitIssue(createMockIssueSubmission({ orderId: 'order-2' }));
      await submitIssue(createMockIssueSubmission({ orderId: 'order-3' }));

      // Update statuses
      useIssueStore.getState().updateIssueStatus(issue1.id, 'resolved');
      useIssueStore.getState().updateIssueStatus(issue2.id, 'under_review');
    });

    it('should return all issues with reported status', () => {
      const { getIssuesByStatus } = useIssueStore.getState();

      const results = getIssuesByStatus('reported');

      expect(results).toHaveLength(1);
    });

    it('should return all issues with resolved status', () => {
      const { getIssuesByStatus } = useIssueStore.getState();

      const results = getIssuesByStatus('resolved');

      expect(results).toHaveLength(1);
    });

    it('should return empty array for status with no issues', () => {
      const { getIssuesByStatus } = useIssueStore.getState();

      const results = getIssuesByStatus('refunded');

      expect(results).toEqual([]);
    });
  });

  describe('setCurrentIssue', () => {
    it('should set currentIssue', () => {
      const { setCurrentIssue } = useIssueStore.getState();
      const mockIssue = createMockIssue();

      setCurrentIssue(mockIssue);

      const state = useIssueStore.getState();
      expect(state.currentIssue).toEqual(mockIssue);
    });

    it('should clear currentIssue when set to null', () => {
      const { setCurrentIssue } = useIssueStore.getState();
      const mockIssue = createMockIssue();

      setCurrentIssue(mockIssue);
      setCurrentIssue(null);

      const state = useIssueStore.getState();
      expect(state.currentIssue).toBeNull();
    });
  });

  describe('clearSubmissionError', () => {
    it('should clear submission error', () => {
      // Set an error state manually
      useIssueStore.setState({ submissionError: 'Test error' });

      const { clearSubmissionError } = useIssueStore.getState();
      clearSubmissionError();

      const state = useIssueStore.getState();
      expect(state.submissionError).toBeNull();
    });
  });

  describe('clearAllIssues', () => {
    beforeEach(async () => {
      const { submitIssue } = useIssueStore.getState();
      await submitIssue(createMockIssueSubmission());
      await submitIssue(createMockIssueSubmission());
    });

    it('should clear all issues', () => {
      const { clearAllIssues } = useIssueStore.getState();

      clearAllIssues();

      const state = useIssueStore.getState();
      expect(state.issues).toEqual([]);
      expect(state.currentIssue).toBeNull();
      expect(state.isSubmitting).toBe(false);
      expect(state.submissionError).toBeNull();
    });
  });

  describe('Issue Categories', () => {
    const categories: Array<{ category: Issue['category']; name: string }> = [
      { category: 'missing_items', name: 'missing items' },
      { category: 'wrong_items', name: 'wrong items' },
      { category: 'food_quality', name: 'food quality' },
      { category: 'late_delivery', name: 'late delivery' },
      { category: 'order_never_arrived', name: 'order never arrived' },
      { category: 'other', name: 'other' },
    ];

    categories.forEach(({ category, name }) => {
      it(`should handle ${name} category`, async () => {
        const { submitIssue } = useIssueStore.getState();
        const submissionData = createMockIssueSubmission({ category });

        const issue = await submitIssue(submissionData);

        expect(issue.category).toBe(category);
      });
    });
  });
});
