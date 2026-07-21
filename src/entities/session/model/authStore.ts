import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionUser, UserRole } from './types';

interface SessionState {
  user: SessionUser | null;
  /** True only after a successful boot-time `me` check. */
  isInitialized: boolean;
  setUser: (user: SessionUser | null) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      isInitialized: false,
      setUser: (user) => set({ user, isInitialized: true }),
      setInitialized: (value) => set({ isInitialized: value }),
      logout: () => set({ user: null, isInitialized: true }),
      hasRole: (...roles) => {
        const role = get().user?.role;
        return role != null && roles.includes(role);
      },
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

/** Convenience selectors. */
export const selectIsAuthenticated = (s: SessionState) => s.user != null;
export const selectIsAdmin = (s: SessionState) => s.user?.role === 'user';
export const selectIsVerified = (s: SessionState) => s.user?.isVerified === true;
export const selectUser = (s: SessionState) => s.user;
