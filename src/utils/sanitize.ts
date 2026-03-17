/**
 * Input Sanitization Utilities
 *
 * Provides functions to sanitize user input against XSS, SQL injection,
 * and other injection attacks before persisting data or rendering output.
 */

// ==================== HTML / XSS SANITIZATION ====================

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Encodes HTML special characters to prevent XSS when rendering user content.
 */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"'`=/]/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

/**
 * Strips HTML tags from a string.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

// ==================== SQL INJECTION PREVENTION ====================

const SQL_INJECTION_PATTERNS = [
  /(\b)(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b/gi,
  /--|;|\/\*|\*\/|xp_|@@/g,
];

/**
 * Returns true if the string appears to contain SQL injection patterns.
 */
export function containsSqlInjection(input: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Strips common SQL injection patterns from a string.
 * Prefer parameterised queries over this function for database inputs.
 */
export function sanitizeSqlInput(input: string): string {
  let result = input;
  for (const pattern of SQL_INJECTION_PATTERNS) {
    result = result.replace(pattern, '');
  }
  return result;
}

// ==================== GENERAL STRING SANITIZATION ====================

/**
 * Trims whitespace and normalises internal whitespace to single spaces.
 */
export function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Removes non-printable and control characters from a string.
 */
export function removeControlChars(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Full sanitization pipeline for general text input:
 * 1. Remove control characters
 * 2. Strip HTML tags
 * 3. Escape HTML entities
 * 4. Normalize whitespace
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return normalizeWhitespace(escapeHtml(stripHtml(removeControlChars(input))));
}

/**
 * Sanitize an email address: lowercase and trim.
 */
export function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().toLowerCase();
}

/**
 * Sanitize a phone number: keep digits, +, -, spaces, parentheses only.
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^\d\s+\-().]/g, '').trim();
}

/**
 * Sanitize a URL: only allow http/https schemes.
 */
export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  try {
    const url = new URL(input);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.toString();
  } catch {
    return '';
  }
}

// ==================== OBJECT SANITIZATION ====================

type SanitizeFieldMap = Record<string, (v: unknown) => unknown>;

/**
 * Sanitize specific fields in a plain object using a field map.
 *
 * @example
 * ```ts
 * const clean = sanitizeObject(req.body, {
 *   email: sanitizeEmail,
 *   firstName: sanitizeText,
 *   phone: sanitizePhone,
 * });
 * ```
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  fieldMap: SanitizeFieldMap
): T {
  const result = { ...obj };
  for (const [field, sanitizer] of Object.entries(fieldMap)) {
    if (field in result) {
      (result as Record<string, unknown>)[field] = sanitizer(result[field]);
    }
  }
  return result;
}

/**
 * Deep-sanitize all string values in an object using `sanitizeText`.
 * Does not descend into nested objects more than 3 levels deep.
 */
export function deepSanitizeStrings<T>(input: T, depth = 0): T {
  if (depth > 3) return input;
  if (typeof input === 'string') return sanitizeText(input) as unknown as T;
  if (Array.isArray(input)) {
    return input.map((item) => deepSanitizeStrings(item, depth + 1)) as unknown as T;
  }
  if (input !== null && typeof input === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      result[key] = deepSanitizeStrings(value, depth + 1);
    }
    return result as T;
  }
  return input;
}
