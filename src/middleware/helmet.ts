/**
 * Security Headers Middleware (Helmet equivalent for Hono)
 *
 * Applies a set of HTTP response headers that improve security
 * against common web vulnerabilities.
 */

export interface HelmetConfig {
  /** Content Security Policy directives */
  csp?: {
    enabled: boolean;
    directives?: Record<string, string[]>;
    reportOnly?: boolean;
  };
  /** X-Frame-Options header */
  frameOptions?: 'DENY' | 'SAMEORIGIN' | false;
  /** X-Content-Type-Options */
  noSniff?: boolean;
  /** HTTP Strict Transport Security */
  hsts?: {
    enabled: boolean;
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  /** Referrer-Policy */
  referrerPolicy?: string | false;
  /** X-XSS-Protection (legacy, still useful for old browsers) */
  xssProtection?: boolean;
  /** Permissions-Policy */
  permissionsPolicy?: string | false;
  /** Cross-Origin-Opener-Policy */
  coopPolicy?: string | false;
}

const DEFAULT_CSP_DIRECTIVES: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'strict-dynamic'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https:', 'data:'],
  'connect-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

const IS_PRODUCTION = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

export function buildHelmetConfig(overrides?: Partial<HelmetConfig>): HelmetConfig {
  return {
    csp: {
      enabled: IS_PRODUCTION,
      directives: DEFAULT_CSP_DIRECTIVES,
      reportOnly: false,
    },
    frameOptions: 'DENY',
    noSniff: true,
    hsts: {
      enabled: IS_PRODUCTION,
      maxAge: 31_536_000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    xssProtection: true,
    permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=()',
    coopPolicy: 'same-origin',
    ...overrides,
  };
}

function buildCspString(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Apply security headers to a Headers object.
 */
export function applySecurityHeaders(headers: Headers, config: HelmetConfig): void {
  // Content Security Policy
  if (config.csp?.enabled && config.csp.directives) {
    const cspValue = buildCspString(config.csp.directives);
    const headerName = config.csp.reportOnly
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';
    headers.set(headerName, cspValue);
  }

  // X-Frame-Options
  if (config.frameOptions) {
    headers.set('X-Frame-Options', config.frameOptions);
  }

  // X-Content-Type-Options
  if (config.noSniff) {
    headers.set('X-Content-Type-Options', 'nosniff');
  }

  // Strict-Transport-Security
  if (config.hsts?.enabled) {
    const { maxAge = 31_536_000, includeSubDomains, preload } = config.hsts;
    let hsts = `max-age=${maxAge}`;
    if (includeSubDomains) hsts += '; includeSubDomains';
    if (preload) hsts += '; preload';
    headers.set('Strict-Transport-Security', hsts);
  }

  // Referrer-Policy
  if (config.referrerPolicy) {
    headers.set('Referrer-Policy', config.referrerPolicy);
  }

  // X-XSS-Protection (legacy)
  if (config.xssProtection) {
    headers.set('X-XSS-Protection', '1; mode=block');
  }

  // Permissions-Policy
  if (config.permissionsPolicy) {
    headers.set('Permissions-Policy', config.permissionsPolicy);
  }

  // Cross-Origin-Opener-Policy
  if (config.coopPolicy) {
    headers.set('Cross-Origin-Opener-Policy', config.coopPolicy);
  }
}

/**
 * Returns a Hono-compatible security headers middleware.
 *
 * @example
 * ```ts
 * app.use('*', createHelmetMiddleware());
 * // Production (CSP + HSTS enabled):
 * app.use('*', createHelmetMiddleware({ csp: { enabled: true }, hsts: { enabled: true } }));
 * ```
 */
export function createHelmetMiddleware(overrides?: Partial<HelmetConfig>) {
  const config = buildHelmetConfig(overrides);

  return async (
    c: { header: (k: string, v: string) => void },
    next: () => Promise<void>
  ) => {
    await next();

    const headers = new Headers();
    applySecurityHeaders(headers, config);
    headers.forEach((value, key) => c.header(key, value));
  };
}

export default createHelmetMiddleware;
