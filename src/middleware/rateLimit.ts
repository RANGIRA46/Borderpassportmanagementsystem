/**
 * Rate Limiting Middleware
 *
 * Window-based per-IP rate limiter for Hono (Deno/Node) backend.
 * Tracks request counts in a sliding time window per IP address.
 */

export interface RateLimitConfig {
  /** Duration of the rate limit window in milliseconds */
  windowMs: number;
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Error message returned when the limit is exceeded */
  message?: string;
  /** HTTP status code to respond with (default: 429) */
  statusCode?: number;
}

export interface RateLimitRecord {
  count: number;
  windowStart: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60_000, // 1 minute
  maxRequests: 100,
  message: 'Too many requests. Please try again later.',
  statusCode: 429,
};

// Per-endpoint configs (can be customised via environment)
export const RATE_LIMIT_CONFIGS = {
  default: DEFAULT_CONFIG,
  auth: {
    windowMs: 15 * 60_000, // 15 minutes
    maxRequests: 20,
    message: 'Too many authentication attempts. Please try again later.',
    statusCode: 429,
  },
  upload: {
    windowMs: 60_000,
    maxRequests: 10,
    message: 'Upload rate limit exceeded. Please try again later.',
    statusCode: 429,
  },
} satisfies Record<string, RateLimitConfig>;

// In-memory store: Map<ip, Map<windowKey, RateLimitRecord>>
const store = new Map<string, RateLimitRecord>();

function getClientIp(headers: Headers, remoteAddr?: string): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    remoteAddr ||
    'unknown'
  );
}

/**
 * Check whether a given IP has exceeded the rate limit.
 * Returns `{ allowed: boolean; remaining: number; resetAt: number }`.
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = `${ip}:${config.maxRequests}:${config.windowMs}`;
  const record = store.get(key);

  if (!record || now - record.windowStart >= config.windowMs) {
    // Start a new window
    store.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  record.count += 1;

  const allowed = record.count <= config.maxRequests;
  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - record.count),
    resetAt: record.windowStart + config.windowMs,
  };
}

/**
 * Factory function that returns a Hono middleware for the given rate limit config.
 *
 * @example
 * ```ts
 * app.use('/auth/*', createRateLimitMiddleware(RATE_LIMIT_CONFIGS.auth));
 * app.use('*', createRateLimitMiddleware());
 * ```
 */
export function createRateLimitMiddleware(config: RateLimitConfig = DEFAULT_CONFIG) {
  return async (c: { req: { raw: Request }; json: (data: unknown, status?: number) => Response; header: (k: string, v: string) => void }, next: () => Promise<void>) => {
    const ip = getClientIp(c.req.raw.headers);
    const { allowed, remaining, resetAt } = checkRateLimit(ip, config);

    // Set standard rate-limit response headers
    c.header('X-RateLimit-Limit', String(config.maxRequests));
    c.header('X-RateLimit-Remaining', String(remaining));
    c.header('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));

    if (!allowed) {
      c.header('Retry-After', String(Math.ceil((resetAt - Date.now()) / 1000)));
      return c.json(
        { error: config.message ?? DEFAULT_CONFIG.message, code: 'RATE_LIMIT_EXCEEDED' },
        (config.statusCode ?? 429) as never
      );
    }

    await next();
  };
}

export default createRateLimitMiddleware;
