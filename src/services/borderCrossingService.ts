import { apiClient } from './apiClient';
import { buildQuery } from './utils';

export type CrossingDirection = 'entry' | 'exit';
export type CrossingStatus = 'cleared' | 'flagged' | 'detained' | 'refused';

export interface BorderCrossing {
  id: string;
  passportId: string;
  passportNumber: string;
  citizenName: string;
  officialId: string;
  borderPostId: string;
  borderPostName?: string;
  direction: CrossingDirection;
  status: CrossingStatus;
  timestamp: string;
  notes?: string;
  flagReason?: string;
  createdAt: string;
}

export interface CrossingFilters {
  passportId?: string;
  borderPostId?: string;
  direction?: CrossingDirection;
  status?: CrossingStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CrossingReport {
  generatedAt: string;
  filters: CrossingFilters;
  totalCrossings: number;
  entries: number;
  exits: number;
  flagged: number;
  refused: number;
  byBorderPost: Array<{ borderPostId: string; name: string; count: number }>;
  byDay: Array<{ date: string; entries: number; exits: number }>;
}

export const borderCrossingService = {
  getHistory(filters?: CrossingFilters): Promise<BorderCrossing[]> {
    return apiClient.get<BorderCrossing[]>(
      `/border-crossings${buildQuery(filters as Record<string, unknown>)}`
    );
  },

  recordCrossing(data: Partial<BorderCrossing>): Promise<BorderCrossing> {
    return apiClient.post<BorderCrossing>('/border-crossings', data);
  },

  getDetails(id: string): Promise<BorderCrossing> {
    return apiClient.get<BorderCrossing>(`/border-crossings/${id}`);
  },

  generateReport(filters: CrossingFilters): Promise<CrossingReport> {
    return apiClient.post<CrossingReport>('/border-crossings/report', filters);
  },
};
