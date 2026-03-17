import apiClient from '../client/apiClient';
import { API_ENDPOINTS } from '../client/config';
import { UserStats, ApplicationsStatus, AdminStats, BorderAnalytics } from '../client/types';

export const dashboardApi = {
  /**
   * Retrieve summary statistics for the authenticated citizen user.
   */
  getUserStats(): Promise<UserStats> {
    return apiClient.get<UserStats>(API_ENDPOINTS.DASHBOARD.USER_STATS);
  },

  /**
   * Retrieve application status breakdown for the current user.
   */
  getApplicationsStatus(): Promise<ApplicationsStatus> {
    return apiClient.get<ApplicationsStatus>(API_ENDPOINTS.DASHBOARD.APPLICATIONS_STATUS);
  },

  /**
   * Retrieve system-wide statistics (admin only).
   */
  getAdminStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>(API_ENDPOINTS.DASHBOARD.ADMIN_STATS);
  },

  /**
   * Retrieve border crossing analytics (admin only).
   */
  getBorderAnalytics(): Promise<BorderAnalytics> {
    return apiClient.get<BorderAnalytics>(API_ENDPOINTS.DASHBOARD.BORDER_ANALYTICS);
  },
};

export default dashboardApi;
