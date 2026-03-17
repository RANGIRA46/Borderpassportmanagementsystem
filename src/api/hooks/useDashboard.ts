import { useState, useEffect, useCallback } from 'react';
import dashboardApi from '../endpoints/dashboardApi';
import { UserStats, ApplicationsStatus, AdminStats, BorderAnalytics, ApiException } from '../client/types';

interface DashboardState {
  userStats: UserStats | null;
  applicationsStatus: ApplicationsStatus | null;
  adminStats: AdminStats | null;
  borderAnalytics: BorderAnalytics | null;
  loading: boolean;
  error: string | null;
}

interface UseDashboardReturn extends DashboardState {
  fetchUserStats: () => Promise<void>;
  fetchApplicationsStatus: () => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  fetchBorderAnalytics: () => Promise<void>;
  fetchAllUserData: () => Promise<void>;
  fetchAllAdminData: () => Promise<void>;
  clearError: () => void;
}

export function useDashboard(autoFetch?: 'user' | 'admin'): UseDashboardReturn {
  const [state, setState] = useState<DashboardState>({
    userStats: null,
    applicationsStatus: null,
    adminStats: null,
    borderAnalytics: null,
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }));

  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, error, loading: false }));

  const fetchUserStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const userStats = await dashboardApi.getUserStats();
      setState((prev) => ({ ...prev, userStats, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load user statistics.';
      setError(message);
    }
  }, []);

  const fetchApplicationsStatus = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const applicationsStatus = await dashboardApi.getApplicationsStatus();
      setState((prev) => ({ ...prev, applicationsStatus, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load application status.';
      setError(message);
    }
  }, []);

  const fetchAdminStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const adminStats = await dashboardApi.getAdminStats();
      setState((prev) => ({ ...prev, adminStats, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load admin statistics.';
      setError(message);
    }
  }, []);

  const fetchBorderAnalytics = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const borderAnalytics = await dashboardApi.getBorderAnalytics();
      setState((prev) => ({ ...prev, borderAnalytics, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load border analytics.';
      setError(message);
    }
  }, []);

  const fetchAllUserData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const [userStats, applicationsStatus] = await Promise.all([
        dashboardApi.getUserStats(),
        dashboardApi.getApplicationsStatus(),
      ]);
      setState((prev) => ({ ...prev, userStats, applicationsStatus, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load dashboard data.';
      setError(message);
    }
  }, []);

  const fetchAllAdminData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      const [adminStats, borderAnalytics] = await Promise.all([
        dashboardApi.getAdminStats(),
        dashboardApi.getBorderAnalytics(),
      ]);
      setState((prev) => ({ ...prev, adminStats, borderAnalytics, loading: false }));
    } catch (err) {
      const message = err instanceof ApiException ? err.message : 'Failed to load admin dashboard data.';
      setError(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    if (autoFetch === 'user') fetchAllUserData();
    else if (autoFetch === 'admin') fetchAllAdminData();
  }, [autoFetch, fetchAllUserData, fetchAllAdminData]);

  return {
    ...state,
    fetchUserStats,
    fetchApplicationsStatus,
    fetchAdminStats,
    fetchBorderAnalytics,
    fetchAllUserData,
    fetchAllAdminData,
    clearError,
  };
}

export default useDashboard;
