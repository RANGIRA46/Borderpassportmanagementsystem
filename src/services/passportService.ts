import { apiClient, tokenStorage, ApiError } from './apiClient';
import { buildQuery } from './utils';

export type PassportStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'issued'
  | 'expired'
  | 'revoked';

export interface Passport {
  id: string;
  userId: string;
  passportNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  placeOfBirth: string;
  gender: 'M' | 'F' | 'X';
  issueDate?: string;
  expiryDate?: string;
  status: PassportStatus;
  applicationId?: string;
  documents?: DocumentUpload[];
  createdAt: string;
  updatedAt: string;
}

export interface PassportApplication {
  id: string;
  userId: string;
  type: 'new' | 'renewal' | 'replacement';
  status: PassportStatus;
  submittedAt?: string;
  processedAt?: string;
  notes?: string;
  passport?: Passport;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUpload {
  id: string;
  passportId: string;
  docType:
    | 'photo'
    | 'birth_certificate'
    | 'national_id'
    | 'supporting_doc'
    | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface PassportFilters {
  status?: PassportStatus;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const passportService = {
  getAll(filters?: PassportFilters): Promise<Passport[]> {
    return apiClient.get<Passport[]>(
      `/passports${buildQuery(filters as Record<string, unknown>)}`
    );
  },

  getById(id: string): Promise<Passport> {
    return apiClient.get<Passport>(`/passports/${id}`);
  },

  create(data: Partial<Passport>): Promise<Passport> {
    return apiClient.post<Passport>('/passports', data);
  },

  update(id: string, data: Partial<Passport>): Promise<Passport> {
    return apiClient.patch<Passport>(`/passports/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete(`/passports/${id}`);
  },

  getHistory(id: string): Promise<Passport[]> {
    return apiClient.get<Passport[]>(`/passports/${id}/history`);
  },

  async uploadDocument(
    passportId: string,
    file: File,
    docType: DocumentUpload['docType']
  ): Promise<DocumentUpload> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);

    // Bypass apiClient JSON serialization for multipart/form-data upload
    const baseUrl = import.meta.env.VITE_API_URL ?? '/api';
    const token = tokenStorage.get();

    const response = await fetch(
      `${baseUrl}/passports/${passportId}/documents`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      }
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json() as Promise<DocumentUpload>;
  },

  getApplications(userId?: string): Promise<PassportApplication[]> {
    const query = userId ? `?userId=${userId}` : '';
    return apiClient.get<PassportApplication[]>(`/passport-applications${query}`);
  },
};
