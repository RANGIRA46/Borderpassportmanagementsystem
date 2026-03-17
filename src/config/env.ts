// Environment variable parsing and validation

interface EnvConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  JWT_STORAGE_KEY: string;
  REFRESH_TOKEN_KEY: string;
  APP_NAME: string;
  APP_VERSION: string;
  ENABLE_NOTIFICATIONS: boolean;
  ENABLE_ANALYTICS: boolean;
}

function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value !== undefined && value !== '') return String(value);
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing required environment variable: ${key}`);
}

function getEnvOptional(key: string, defaultValue = ''): string {
  const value = import.meta.env[key];
  return value !== undefined && value !== '' ? String(value) : defaultValue;
}

function getEnvInt(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value !== undefined && value !== '') {
    const parsed = parseInt(String(value), 10);
    if (!isNaN(parsed)) return parsed;
  }
  return defaultValue;
}

function getEnvBool(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value !== undefined && value !== '') {
    return String(value).toLowerCase() === 'true';
  }
  return defaultValue;
}

let _envConfig: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig {
  if (_envConfig) return _envConfig;

  _envConfig = {
    API_BASE_URL: getEnv('VITE_API_BASE_URL', 'http://localhost:3000/api'),
    API_TIMEOUT: getEnvInt('VITE_API_TIMEOUT', 30000),
    SUPABASE_URL: getEnvOptional('VITE_SUPABASE_URL'),
    SUPABASE_ANON_KEY: getEnvOptional('VITE_SUPABASE_ANON_KEY'),
    JWT_STORAGE_KEY: getEnv('VITE_JWT_STORAGE_KEY', 'borderpassport_token'),
    REFRESH_TOKEN_KEY: getEnv('VITE_REFRESH_TOKEN_KEY', 'borderpassport_refresh'),
    APP_NAME: getEnv('VITE_APP_NAME', 'Border Passport Management System'),
    APP_VERSION: getEnv('VITE_APP_VERSION', '0.1.0'),
    ENABLE_NOTIFICATIONS: getEnvBool('VITE_ENABLE_NOTIFICATIONS', true),
    ENABLE_ANALYTICS: getEnvBool('VITE_ENABLE_ANALYTICS', true),
  };

  return _envConfig;
}

// Storage helpers that respect the configured key names
export function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage may be unavailable in some environments
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // localStorage may be unavailable in some environments
  }
}
