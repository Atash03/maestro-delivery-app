/**
 * Tests to verify that all required dependencies are installed and working correctly.
 * These tests ensure the core packages needed for the Maestro app are properly configured.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { create } from 'zustand';

describe('Dependencies Installation', () => {
  describe('Zustand', () => {
    it('should create a basic store', () => {
      interface CounterState {
        count: number;
        increment: () => void;
        decrement: () => void;
      }

      const useCounterStore = create<CounterState>((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
      }));

      const state = useCounterStore.getState();
      expect(state.count).toBe(0);

      state.increment();
      expect(useCounterStore.getState().count).toBe(1);

      state.decrement();
      expect(useCounterStore.getState().count).toBe(0);
    });

    it('should support selectors', () => {
      interface UserState {
        user: { name: string; email: string } | null;
        setUser: (user: { name: string; email: string }) => void;
      }

      const useUserStore = create<UserState>((set) => ({
        user: null,
        setUser: (user) => set({ user }),
      }));

      useUserStore.getState().setUser({ name: 'John', email: 'john@example.com' });

      const user = useUserStore.getState().user;
      expect(user).toEqual({ name: 'John', email: 'john@example.com' });
    });
  });

  describe('Zod', () => {
    it('should validate a simple schema', () => {
      const userSchema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        age: z.number().min(0),
      });

      const validUser = { name: 'John', email: 'john@example.com', age: 25 };
      const result = userSchema.safeParse(validUser);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    it('should reject invalid data', () => {
      const userSchema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
      });

      const invalidUser = { name: '', email: 'not-an-email' };
      const result = userSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
    });

    it('should support optional and default values', () => {
      const configSchema = z.object({
        theme: z.enum(['light', 'dark']).default('light'),
        notifications: z.boolean().optional(),
      });

      const result = configSchema.parse({});
      expect(result.theme).toBe('light');
      expect(result.notifications).toBeUndefined();
    });
  });

  describe('React Hook Form', () => {
    it('should export useForm hook', () => {
      expect(useForm).toBeDefined();
      expect(typeof useForm).toBe('function');
    });

    it('should work with zodResolver', () => {
      expect(zodResolver).toBeDefined();
      expect(typeof zodResolver).toBe('function');

      const schema = z.object({
        name: z.string().min(1),
      });

      const resolver = zodResolver(schema);
      expect(typeof resolver).toBe('function');
    });
  });

  describe('date-fns', () => {
    it('should format dates correctly', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      const formatted = format(date, 'MMMM d, yyyy');

      expect(formatted).toBe('January 15, 2025');
    });

    it('should format times correctly', () => {
      const date = new Date(2025, 0, 15, 14, 30, 0);
      const formatted = format(date, 'h:mm a');

      expect(formatted).toBe('2:30 PM');
    });
  });
});
