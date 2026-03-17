import { apiClient } from './apiClient';
import { buildQuery } from './utils';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Appointment {
  id: string;
  userId: string;
  locationId: string;
  locationName?: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: 'passport_application' | 'passport_renewal' | 'passport_collection' | 'general';
  status: AppointmentStatus;
  notes?: string;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentSlot {
  id: string;
  locationId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  available: boolean;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  userId?: string;
  locationId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const appointmentService = {
  getAll(filters?: AppointmentFilters): Promise<Appointment[]> {
    return apiClient.get<Appointment[]>(
      `/appointments${buildQuery(filters as Record<string, unknown>)}`
    );
  },

  getById(id: string): Promise<Appointment> {
    return apiClient.get<Appointment>(`/appointments/${id}`);
  },

  create(data: Partial<Appointment>): Promise<Appointment> {
    return apiClient.post<Appointment>('/appointments', data);
  },

  update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    return apiClient.patch<Appointment>(`/appointments/${id}`, data);
  },

  cancel(id: string): Promise<void> {
    return apiClient.patch<void>(`/appointments/${id}/cancel`);
  },

  getAvailableSlots(date: string, locationId: string): Promise<AppointmentSlot[]> {
    return apiClient.get<AppointmentSlot[]>(
      `/appointments/slots?date=${encodeURIComponent(date)}&locationId=${encodeURIComponent(locationId)}`
    );
  },

  sendReminder(id: string): Promise<void> {
    return apiClient.post<void>(`/appointments/${id}/reminder`);
  },
};
