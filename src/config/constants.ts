import { getEnvConfig } from './env';

const env = getEnvConfig();

export const APP_CONSTANTS = {
  APP_NAME: env.APP_NAME,
  APP_VERSION: env.APP_VERSION,

  STORAGE_KEYS: {
    JWT_TOKEN: env.JWT_STORAGE_KEY,
    REFRESH_TOKEN: env.REFRESH_TOKEN_KEY,
    USER_PREFERENCES: 'borderpassport_prefs',
    LANGUAGE: 'borderpassport_lang',
    THEME: 'borderpassport_theme',
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  PASSPORT: {
    TYPES: ['ordinary', 'official', 'diplomatic', 'emergency'] as const,
    STATUSES: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'issued', 'expired', 'cancelled'] as const,
    RENEWAL_NOTICE_MONTHS: 6,
    MAX_DOCUMENT_SIZE_MB: 10,
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  APPOINTMENTS: {
    TYPES: ['passport', 'visa', 'biometric', 'collection', 'inquiry'] as const,
    STATUSES: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'] as const,
    MAX_ADVANCE_BOOKING_DAYS: 90,
    MIN_ADVANCE_BOOKING_HOURS: 24,
    SLOT_DURATION_MINUTES: 30,
  },

  BORDER_CROSSING: {
    TYPES: ['entry', 'exit'] as const,
    STATUSES: ['cleared', 'flagged', 'detained', 'denied'] as const,
  },

  ROLES: {
    CUSTOMER: 'customer',
    OFFICER: 'officer',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super-admin',
  } as const,

  ROUTES: {
    HOME: 'home',
    LOGIN: 'login',
    REGISTER: 'register',
    DASHBOARD: 'dashboard',
    PASSPORT_APPLY: 'passport-apply',
    STATUS: 'status',
    APPOINTMENTS: 'appointments',
    BORDER_RECORDS: 'records',
    ADMIN_DASHBOARD: 'admin-dashboard',
    ANALYTICS: 'analytics',
    PROFILE: 'profile',
  } as const,

  FEATURE_FLAGS: {
    NOTIFICATIONS: env.ENABLE_NOTIFICATIONS,
    ANALYTICS: env.ENABLE_ANALYTICS,
  },
} as const;
