import { API_CONFIG } from './config';
import { ApiError, ApiException } from './types';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../config/env';
import { APP_CONSTANTS } from '../../config/constants';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
  skipRetry?: boolean;
}

interface RetryConfig {
  attempts: number;
  delayMs: number;
  backoffFactor: number;
}

// ==================== TOKEN MANAGEMENT ====================

export function getAccessToken(): string | null {
  return getStorageItem(APP_CONSTANTS.STORAGE_KEYS.JWT_TOKEN);
}

export function setAccessToken(token: string): void {
  setStorageItem(APP_CONSTANTS.STORAGE_KEYS.JWT_TOKEN, token);
}

export function getRefreshToken(): string | null {
  return getStorageItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
}

export function setRefreshToken(token: string): void {
  setStorageItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, token);
}

export function clearTokens(): void {
  removeStorageItem(APP_CONSTANTS.STORAGE_KEYS.JWT_TOKEN);
  removeStorageItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
}

// ==================== URL UTILITIES ====================

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(path, API_CONFIG.BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

// ==================== ERROR HANDLING ====================

async function parseErrorResponse(response: Response): Promise<ApiError> {
  let body: Record<string, unknown> = {};
  try {
    body = await response.json();
  } catch {
    // non-JSON error body
  }

  return {
    message: (body.message as string) || (body.error as string) || response.statusText || 'An unexpected error occurred',
    code: body.code as string | undefined,
    statusCode: response.status,
    errors: body.errors as Record<string, string[]> | undefined,
    timestamp: new Date().toISOString(),
  };
}

// ==================== RETRY LOGIC ====================

function shouldRetry(response: Response | null, error: Error | null, attempt: number, maxAttempts: number): boolean {
  if (attempt >= maxAttempts) return false;
  if (error) return true; // Network errors should be retried
  if (response) {
    // Retry on 429 (rate limit) and 5xx server errors
    return response.status === 429 || (response.status >= 500 && response.status < 600);
  }
  return false;
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==================== TOKEN REFRESH ====================

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string): void {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiException({
      message: 'No refresh token available',
      statusCode: 401,
      code: 'NO_REFRESH_TOKEN',
    });
  }

  const response = await fetch(buildUrl('/auth/refresh-token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new ApiException({
      message: 'Session expired. Please log in again.',
      statusCode: 401,
      code: 'REFRESH_TOKEN_EXPIRED',
    });
  }

  const data = await response.json();
  const newToken: string = data.token;
  setAccessToken(newToken);
  if (data.refreshToken) {
    setRefreshToken(data.refreshToken);
  }
  return newToken;
}

// ==================== BASE REQUEST FUNCTION ====================

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
  retryConfig: RetryConfig = {
    attempts: API_CONFIG.RETRY_ATTEMPTS,
    delayMs: API_CONFIG.RETRY_DELAY_MS,
    backoffFactor: API_CONFIG.RETRY_BACKOFF_FACTOR,
  }
): Promise<T> {
  const { params, skipAuth = false, skipRetry = false, body, ...fetchOptions } = options;

  const url = buildUrl(path, params);
  const headers = new Headers(fetchOptions.headers);

  if (!headers.has('Content-Type') && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach auth token
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  let lastError: Error | null = null;
  let attempt = 0;

  while (true) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method,
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 with token refresh
      if (response.status === 401 && !skipAuth && !skipRetry) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await refreshAccessToken();
            isRefreshing = false;
            onRefreshed(newToken);
          } catch (refreshError) {
            isRefreshing = false;
            refreshSubscribers = [];
            throw refreshError;
          }
        } else {
          await new Promise<void>((resolve, reject) => {
            refreshSubscribers.push((token: string) => {
              headers.set('Authorization', `Bearer ${token}`);
              resolve();
            });
          });
          // Retry original request with new token
          continue;
        }
        headers.set('Authorization', `Bearer ${getAccessToken()!}`);
        continue;
      }

      if (!response.ok) {
        const errorData = await parseErrorResponse(response);

        if (!skipRetry && shouldRetry(response, null, attempt, retryConfig.attempts)) {
          const delay = retryConfig.delayMs * Math.pow(retryConfig.backoffFactor, attempt);
          await wait(delay);
          attempt++;
          continue;
        }

        throw new ApiException(errorData);
      }

      // Handle empty responses
      const contentType = response.headers.get('Content-Type') || '';
      if (response.status === 204 || !contentType.includes('application/json')) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiException) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiException({
          message: 'Request timed out. Please try again.',
          statusCode: 408,
          code: 'REQUEST_TIMEOUT',
        });
      }

      lastError = error as Error;

      if (!skipRetry && shouldRetry(null, lastError, attempt, retryConfig.attempts)) {
        const delay = retryConfig.delayMs * Math.pow(retryConfig.backoffFactor, attempt);
        await wait(delay);
        attempt++;
        continue;
      }

      throw new ApiException({
        message: lastError.message || 'Network error. Please check your connection.',
        statusCode: 0,
        code: 'NETWORK_ERROR',
      });
    }
  }
}

// ==================== HTTP METHOD HELPERS ====================

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', path, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', path, {
      ...options,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', path, {
      ...options,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PATCH', path, {
      ...options,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', path, options);
  },
};

export default apiClient;
