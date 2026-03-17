import apiClient from '../client/apiClient';
import { API_ENDPOINTS } from '../client/config';
import {
  AppointmentRequest,
  AppointmentResponse,
  AppointmentSlot,
  PaginationParams,
  PaginatedResponse,
} from '../client/types';

export interface AvailabilityParams {
  locationId?: string;
  serviceType?: string;
  startDate?: string;
  endDate?: string;
}

export const appointmentApi = {
  /**
   * Retrieve a paginated list of appointments.
   */
  list(params?: PaginationParams): Promise<PaginatedResponse<AppointmentResponse>> {
    return apiClient.get<PaginatedResponse<AppointmentResponse>>(API_ENDPOINTS.APPOINTMENTS.LIST, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Book a new appointment.
   */
  create(data: AppointmentRequest): Promise<AppointmentResponse> {
    return apiClient.post<AppointmentResponse>(API_ENDPOINTS.APPOINTMENTS.CREATE, data);
  },

  /**
   * Retrieve a single appointment by ID.
   */
  getById(id: string): Promise<AppointmentResponse> {
    return apiClient.get<AppointmentResponse>(API_ENDPOINTS.APPOINTMENTS.GET(id));
  },

  /**
   * Update an existing appointment.
   */
  update(id: string, data: Partial<AppointmentRequest>): Promise<AppointmentResponse> {
    return apiClient.put<AppointmentResponse>(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), data);
  },

  /**
   * Cancel an appointment.
   */
  cancel(id: string, reason?: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.APPOINTMENTS.DELETE(id), {
      params: reason ? { reason } : undefined,
    });
  },

  /**
   * Retrieve available appointment slots.
   */
  getAvailability(params?: AvailabilityParams): Promise<AppointmentSlot[]> {
    return apiClient.get<AppointmentSlot[]>(API_ENDPOINTS.APPOINTMENTS.AVAILABILITY, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },
};

export default appointmentApi;
