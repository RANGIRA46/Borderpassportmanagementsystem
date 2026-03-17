import { useState, useEffect, useCallback } from 'react';
import authApi from '../endpoints/authApi';
import { setAccessToken, setRefreshToken, clearTokens, getAccessToken } from '../client/apiClient';
import { User, LoginRequest, RegisterRequest, ChangePasswordRequest, ApiException } from '../client/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (data: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }));

  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, error, loading: false }));

  const setUser = (user: User | null) =>
    setState({ user, loading: false, error: null, isAuthenticated: !!user });

  // Restore session from stored token on mount
  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      setLoading(true);
      const user = await authApi.getMe();
      setUser(user);
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (data: LoginRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const response = await authApi.login(data);
      setAccessToken(response.token);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      return true;
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Login failed. Please try again.';
      setError(message);
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const response = await authApi.register(data);
      setAccessToken(response.token);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      return true;
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Registration failed. Please try again.';
      setError(message);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // Ignore server errors on logout
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      await authApi.changePassword(data);
      setLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Password change failed.';
      setError(message);
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    changePassword,
    clearError,
    refreshUser,
  };
}

export default useAuth;
