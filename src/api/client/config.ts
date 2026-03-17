import { getEnvConfig } from '../../config/env';

const env = getEnvConfig();

export const API_CONFIG = {
  BASE_URL: env.API_BASE_URL,
  TIMEOUT: env.API_TIMEOUT,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  RETRY_BACKOFF_FACTOR: 2,
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  // Passports
  PASSPORTS: {
    LIST: '/passports',
    CREATE: '/passports',
    GET: (id: string) => `/passports/${id}`,
    UPDATE: (id: string) => `/passports/${id}`,
    DELETE: (id: string) => `/passports/${id}`,
    HISTORY: (id: string) => `/passports/${id}/history`,
    UPLOAD_DOCUMENT: (id: string) => `/passports/${id}/upload-document`,
  },
  // Appointments
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    GET: (id: string) => `/appointments/${id}`,
    UPDATE: (id: string) => `/appointments/${id}`,
    DELETE: (id: string) => `/appointments/${id}`,
    AVAILABILITY: '/appointments/availability',
  },
  // Border Crossings
  BORDER_CROSSINGS: {
    LIST: '/border-crossings',
    CREATE: '/border-crossings',
    GET: (id: string) => `/border-crossings/${id}`,
  },
  // Dashboard
  DASHBOARD: {
    USER_STATS: '/dashboard/user-stats',
    APPLICATIONS_STATUS: '/dashboard/applications-status',
    ADMIN_STATS: '/dashboard/admin-stats',
    BORDER_ANALYTICS: '/dashboard/border-analytics',
  },
} as const;
