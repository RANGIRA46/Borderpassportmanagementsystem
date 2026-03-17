import apiClient from '../client/apiClient';
import { API_ENDPOINTS } from '../client/config';
import {
  PassportRequest,
  PassportResponse,
  PassportStatusHistory,
  PaginationParams,
  PaginatedResponse,
} from '../client/types';

export const passportApi = {
  /**
   * Retrieve a paginated list of passport applications.
   */
  list(params?: PaginationParams): Promise<PaginatedResponse<PassportResponse>> {
    return apiClient.get<PaginatedResponse<PassportResponse>>(API_ENDPOINTS.PASSPORTS.LIST, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Submit a new passport application.
   */
  create(data: PassportRequest): Promise<PassportResponse> {
    return apiClient.post<PassportResponse>(API_ENDPOINTS.PASSPORTS.CREATE, data);
  },

  /**
   * Retrieve a single passport application by ID.
   */
  getById(id: string): Promise<PassportResponse> {
    return apiClient.get<PassportResponse>(API_ENDPOINTS.PASSPORTS.GET(id));
  },

  /**
   * Update an existing passport application.
   */
  update(id: string, data: Partial<PassportRequest>): Promise<PassportResponse> {
    return apiClient.put<PassportResponse>(API_ENDPOINTS.PASSPORTS.UPDATE(id), data);
  },

  /**
   * Delete (cancel) a passport application.
   */
  delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PASSPORTS.DELETE(id));
  },

  /**
   * Get the status change history for a passport application.
   */
  getHistory(id: string): Promise<PassportStatusHistory[]> {
    return apiClient.get<PassportStatusHistory[]>(API_ENDPOINTS.PASSPORTS.HISTORY(id));
  },

  /**
   * Upload a supporting document for a passport application.
   */
  uploadDocument(id: string, file: File, documentType: string): Promise<{ documentId: string; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    return apiClient.post<{ documentId: string; message: string }>(
      API_ENDPOINTS.PASSPORTS.UPLOAD_DOCUMENT(id),
      formData
    );
  },
};

export default passportApi;
