import { apiClient } from './apiClient';

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface CitizenDashboardData {
  userId: string;
  passports: {
    active: number;
    expiringSoon: number;
    pendingApplications: number;
  };
  appointments: {
    upcoming: Array<{
      id: string;
      date: string;
      startTime: string;
      locationName: string;
      purpose: string;
    }>;
    total: number;
  };
  recentCrossings: Array<{
    id: string;
    direction: 'entry' | 'exit';
    borderPostName: string;
    timestamp: string;
    status: string;
  }>;
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    createdAt: string;
    read: boolean;
  }>;
}

export interface OfficialDashboardData {
  pendingApplications: number;
  processedToday: number;
  scheduledAppointments: number;
  flaggedCrossings: number;
  recentApplications: Array<{
    id: string;
    citizenName: string;
    type: string;
    status: string;
    submittedAt: string;
  }>;
  todaysAppointments: Array<{
    id: string;
    citizenName: string;
    startTime: string;
    purpose: string;
    status: string;
  }>;
}

export interface AdminStats {
  totalCitizens: number;
  totalOfficials: number;
  totalPassports: number;
  activePassports: number;
  pendingApplications: number;
  crossingsThisMonth: number;
  appointmentsThisMonth: number;
  systemHealth: {
    apiLatencyMs: number;
    errorRate: number;
    uptime: number;
  };
}

export interface AnalyticsData {
  period: AnalyticsPeriod;
  applications: Array<{ label: string; submitted: number; approved: number; rejected: number }>;
  crossings: Array<{ label: string; entries: number; exits: number; flagged: number }>;
  appointments: Array<{ label: string; scheduled: number; completed: number; cancelled: number }>;
  citizenGrowth: Array<{ label: string; count: number }>;
}

export const dashboardService = {
  getCitizenDashboard(userId: string): Promise<CitizenDashboardData> {
    return apiClient.get<CitizenDashboardData>(`/dashboard/citizen/${userId}`);
  },

  getOfficialDashboard(): Promise<OfficialDashboardData> {
    return apiClient.get<OfficialDashboardData>('/dashboard/official');
  },

  getAdminStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>('/dashboard/admin/stats');
  },

  getAnalytics(period: AnalyticsPeriod): Promise<AnalyticsData> {
    return apiClient.get<AnalyticsData>(
      `/dashboard/analytics?period=${encodeURIComponent(period)}`
    );
  },
};
