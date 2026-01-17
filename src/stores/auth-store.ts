import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Address, User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
}

interface AuthActions {
  signIn: (user: User) => void;
  signUp: (user: User) => void;
  signOut: () => void;
  setGuest: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>) => void;
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, updates: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  convertGuestToUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      signIn: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
        });
      },

      signUp: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
        });
      },

      signOut: () => {
        set(initialState);
      },

      setGuest: () => {
        set({
          user: null,
          isAuthenticated: false,
          isGuest: true,
          isLoading: false,
        });
      },

      updateProfile: (updates) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            ...updates,
            updatedAt: new Date(),
          },
        });
      },

      addAddress: (address: Address) => {
        const { user } = get();
        if (!user) return;

        const addresses = [...user.addresses];

        // If this is the first address or marked as default, update other addresses
        if (address.isDefault || addresses.length === 0) {
          addresses.forEach((addr) => {
            addr.isDefault = false;
          });
          address.isDefault = true;
        }

        addresses.push(address);

        set({
          user: {
            ...user,
            addresses,
            updatedAt: new Date(),
          },
        });
      },

      updateAddress: (addressId: string, updates: Partial<Address>) => {
        const { user } = get();
        if (!user) return;

        const addresses = user.addresses.map((addr) => {
          if (addr.id === addressId) {
            return { ...addr, ...updates };
          }
          // If we're setting this address as default, remove default from others
          if (updates.isDefault && addr.id !== addressId) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });

        set({
          user: {
            ...user,
            addresses,
            updatedAt: new Date(),
          },
        });
      },

      removeAddress: (addressId: string) => {
        const { user } = get();
        if (!user) return;

        const addresses = user.addresses.filter((addr) => addr.id !== addressId);

        // If we removed the default address and there are other addresses, set first as default
        const hasDefault = addresses.some((addr) => addr.isDefault);
        if (!hasDefault && addresses.length > 0) {
          addresses[0].isDefault = true;
        }

        set({
          user: {
            ...user,
            addresses,
            updatedAt: new Date(),
          },
        });
      },

      setDefaultAddress: (addressId: string) => {
        const { user } = get();
        if (!user) return;

        const addresses = user.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }));

        set({
          user: {
            ...user,
            addresses,
            updatedAt: new Date(),
          },
        });
      },

      convertGuestToUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'maestro-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
    }
  )
);
