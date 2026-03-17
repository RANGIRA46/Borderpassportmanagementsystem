import { apiClient, tokenStorage } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  nationality?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'citizen' | 'official' | 'admin';
  dateOfBirth?: string;
  nationality?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    } satisfies LoginRequest);
    tokenStorage.set(response.token);
    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    tokenStorage.set(response.token);
    return response;
  },

  logout(): void {
    tokenStorage.clear();
  },

  getCurrentUser(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/auth/me');
  },

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post<void>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post<void>('/auth/forgot-password', { email });
  },

  async refreshToken(): Promise<string> {
    const response = await apiClient.post<{ token: string }>(
      '/auth/refresh-token'
    );
    tokenStorage.set(response.token);
    return response.token;
  },
};
