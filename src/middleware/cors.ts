/**
 * CORS Configuration Middleware
 *
 * Provides environment-aware CORS headers with whitelist support
 * and proper preflight request handling.
 */

export interface CorsConfig {
  /** List of allowed origins. Use ['*'] to allow all origins (not recommended in production). */
  allowedOrigins: string[];
  /** Whether to allow credentials (cookies, Authorization header). */
  allowCredentials: boolean;
  /** Allowed HTTP methods */
  allowMethods: string[];
  /** Allowed request headers */
  allowHeaders: string[];
  /** Headers exposed to the browser */
  exposeHeaders: string[];
  /** Preflight cache duration in seconds */
  maxAge: number;
}

const DEFAULT_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const DEFAULT_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'];
const DEFAULT_EXPOSE = ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'];

function getOriginFromEnv(): string[] {
  const env = typeof process !== 'undefined' ? process.env : {};
  const raw = env.CORS_ALLOWED_ORIGINS || env.ALLOWED_ORIGINS || '';
  if (!raw) return ['http://localhost:3000', 'http://localhost:5173'];
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

export function buildCorsConfig(overrides?: Partial<CorsConfig>): CorsConfig {
  return {
    allowedOrigins: getOriginFromEnv(),
    allowCredentials: true,
    allowMethods: DEFAULT_METHODS,
    allowHeaders: DEFAULT_HEADERS,
    exposeHeaders: DEFAULT_EXPOSE,
    maxAge: 86_400, // 24 hours
    ...overrides,
  };
}

/**
 * Determines the response origin header value.
 * Returns the request origin if it is in the allowlist, otherwise undefined.
 */
export function resolveOrigin(requestOrigin: string | null, config: CorsConfig): string | undefined {
  if (!requestOrigin) return undefined;
  if (config.allowedOrigins.includes('*')) return '*';
  if (config.allowedOrigins.includes(requestOrigin)) return requestOrigin;
  return undefined;
}

/**
 * Applies CORS headers to a Headers object.
 */
export function applyCorsHeaders(
  responseHeaders: Headers,
  requestOrigin: string | null,
  config: CorsConfig,
  isPreflight = false
): void {
  const origin = resolveOrigin(requestOrigin, config);
  if (!origin) return;

  responseHeaders.set('Access-Control-Allow-Origin', origin);

  if (config.allowCredentials && origin !== '*') {
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
  }

  if (config.exposeHeaders.length) {
    responseHeaders.set('Access-Control-Expose-Headers', config.exposeHeaders.join(', '));
  }

  if (isPreflight) {
    responseHeaders.set('Access-Control-Allow-Methods', config.allowMethods.join(', '));
    responseHeaders.set('Access-Control-Allow-Headers', config.allowHeaders.join(', '));
    responseHeaders.set('Access-Control-Max-Age', String(config.maxAge));
  }

  // Vary on Origin so caches don't serve the wrong CORS headers
  const vary = responseHeaders.get('Vary');
  responseHeaders.set('Vary', vary ? `${vary}, Origin` : 'Origin');
}

/**
 * Returns a Hono-compatible CORS middleware.
 *
 * @example
 * ```ts
 * app.use('*', createCorsMiddleware());
 * // or with custom config:
 * app.use('*', createCorsMiddleware({ allowedOrigins: ['https://myapp.com'] }));
 * ```
 */
export function createCorsMiddleware(overrides?: Partial<CorsConfig>) {
  const config = buildCorsConfig(overrides);

  return async (
    c: {
      req: { raw: Request };
      res: Response;
      header: (k: string, v: string) => void;
      newResponse: (body: null, status: number, headers: Record<string, string>) => Response;
    },
    next: () => Promise<void>
  ) => {
    const requestOrigin = c.req.raw.headers.get('Origin');
    const isPreflight = c.req.raw.method === 'OPTIONS';

    if (isPreflight) {
      const headers: Record<string, string> = {};
      const tmp = new Headers();
      applyCorsHeaders(tmp, requestOrigin, config, true);
      tmp.forEach((value, key) => { headers[key] = value; });
      return c.newResponse(null, 204, headers);
    }

    await next();

    const responseHeaders = new Headers(c.res.headers);
    applyCorsHeaders(responseHeaders, requestOrigin, config, false);
    responseHeaders.forEach((value, key) => c.header(key, value));
  };
}

export default createCorsMiddleware;
