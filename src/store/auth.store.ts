/**
 * Zustand Store for Authentication & Authorization State
 * Manages user session, permissions, and auth state globally
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSession, Permission, Role } from '@/lib/rbac/roles';

interface AuthStore {
  // State
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  sessionToken: string | null;

  // User Actions
  setUser: (user: UserSession) => void;
  clearUser: () => void;
  updateUserPermissions: (permissions: Permission[]) => void;
  updateUserRole: (role: Role) => void;

  // Auth Actions
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setMFARequired: (value: boolean) => void;
  setSessionToken: (token: string | null) => void;

  // Permission Checks
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (role: Role) => boolean;

  // Session Management
  logout: () => void;
  refreshSession: (user: UserSession, token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      mfaRequired: false,
      sessionToken: null,

      // User Actions
      setUser: (user: UserSession) => {
        set({ user, isAuthenticated: true, error: null });
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
          sessionToken: null,
          mfaRequired: false,
        });
      },

      updateUserPermissions: (permissions: Permission[]) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              permissions,
            },
          });
        }
      },

      updateUserRole: (role: Role) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              role,
            },
          });
        }
      },

      // Auth Actions
      setAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
      },

      setLoading: (value: boolean) => {
        set({ isLoading: value });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setMFARequired: (value: boolean) => {
        set({ mfaRequired: value });
      },

      setSessionToken: (token: string | null) => {
        set({ sessionToken: token });
      },

      // Permission Checks
      hasPermission: (permission: Permission) => {
        const { user } = get();
        return user?.permissions.includes(permission) ?? false;
      },

      hasAnyPermission: (permissions: Permission[]) => {
        const { user } = get();
        if (!user) return false;
        return permissions.some((perm) => user.permissions.includes(perm));
      },

      hasAllPermissions: (permissions: Permission[]) => {
        const { user } = get();
        if (!user) return false;
        return permissions.every((perm) => user.permissions.includes(perm));
      },

      hasRole: (role: Role) => {
        const { user } = get();
        return user?.role === role ?? false;
      },

      // Session Management
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          sessionToken: null,
          mfaRequired: false,
          error: null,
        });
      },

      refreshSession: (user: UserSession, token: string) => {
        set({
          user,
          sessionToken: token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionToken: state.sessionToken,
      }),
    }
  )
);

/**
 * Custom hook for checking permissions with proper typing
 */
export const usePermission = (permission: Permission | Permission[]) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

  if (Array.isArray(permission)) {
    return hasAnyPermission(permission);
  }
  return hasPermission(permission);
};

/**
 * Custom hook for checking role
 */
export const useRole = (role: Role | Role[]) => {
  const hasRole = useAuthStore((state) => state.hasRole);

  if (Array.isArray(role)) {
    return role.some((r) => hasRole(r));
  }
  return hasRole(role);
};

/**
 * Custom hook for getting current user
 */
export const useUser = () => {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));
};

/**
 * Custom hook for auth actions
 */
export const useAuthActions = () => {
  return useAuthStore((state) => ({
    setUser: state.setUser,
    clearUser: state.clearUser,
    logout: state.logout,
    setLoading: state.setLoading,
    setError: state.setError,
  }));
};

