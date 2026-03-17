import apiClient from '../client/apiClient';
import { API_ENDPOINTS } from '../client/config';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ChangePasswordRequest,
  RefreshTokenRequest,
} from '../client/types';

export const authApi = {
  /**
   * Register a new user account.
   */
  register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data, { skipAuth: true });
  },

  /**
   * Authenticate a user and receive access/refresh tokens.
   */
  login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data, { skipAuth: true });
  },

  /**
   * Invalidate the current session on the server.
   */
  logout(): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Obtain a new access token using a refresh token.
   */
  refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data, {
      skipAuth: true,
      skipRetry: true,
    });
  },

  /**
   * Retrieve the currently authenticated user's profile.
   */
  getMe(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Change the password for the authenticated user.
   */
  changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },
};

export default authApi;
