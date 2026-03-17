import apiClient from '../client/apiClient';
import { API_ENDPOINTS } from '../client/config';
import {
  BorderCrossingRequest,
  BorderCrossingResponse,
  PaginationParams,
  PaginatedResponse,
} from '../client/types';

export const borderCrossingApi = {
  /**
   * Retrieve a paginated history of border crossings.
   */
  list(params?: PaginationParams): Promise<PaginatedResponse<BorderCrossingResponse>> {
    return apiClient.get<PaginatedResponse<BorderCrossingResponse>>(API_ENDPOINTS.BORDER_CROSSINGS.LIST, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Record a new border crossing (entry or exit).
   */
  create(data: BorderCrossingRequest): Promise<BorderCrossingResponse> {
    return apiClient.post<BorderCrossingResponse>(API_ENDPOINTS.BORDER_CROSSINGS.CREATE, data);
  },

  /**
   * Retrieve a single border crossing record by ID.
   */
  getById(id: string): Promise<BorderCrossingResponse> {
    return apiClient.get<BorderCrossingResponse>(API_ENDPOINTS.BORDER_CROSSINGS.GET(id));
  },
};

export default borderCrossingApi;
