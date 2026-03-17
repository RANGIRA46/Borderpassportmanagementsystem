const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
const TOKEN_KEY = 'bpms_token';
const MAX_RETRIES = 3;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

function shouldRetry(status: number, attempt: number): boolean {
  return attempt < MAX_RETRIES && (status === 429 || status >= 500);
}

function backoffDelay(attempt: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 200));
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    ...options,
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await backoffDelay(attempt - 1);
    }

    const response = await fetch(url, init);

    if (response.status === 401) {
      tokenStorage.clear();
      throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      const message =
        typeof errorData === 'object' &&
        errorData !== null &&
        'message' in errorData
          ? String((errorData as { message: unknown }).message)
          : response.statusText;

      lastError = new ApiError(response.status, message, errorData);

      if (!shouldRetry(response.status, attempt)) {
        throw lastError;
      }

      continue;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  throw lastError!;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>('GET', path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>('POST', path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>('PUT', path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>('PATCH', path, body, options),

  delete: <T = void>(path: string, options?: RequestInit) =>
    request<T>('DELETE', path, undefined, options),
};
