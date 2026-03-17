/**
 * Request Validation Middleware
 *
 * Schema-based validation for request body, query parameters, and route parameters.
 * Uses a lightweight custom validator to avoid adding heavy dependencies.
 */

export type ValidationRule =
  | { type: 'string'; minLength?: number; maxLength?: number; pattern?: RegExp; optional?: boolean }
  | { type: 'email'; optional?: boolean }
  | { type: 'number'; min?: number; max?: number; optional?: boolean }
  | { type: 'boolean'; optional?: boolean }
  | { type: 'enum'; values: string[]; optional?: boolean }
  | { type: 'date'; optional?: boolean }
  | { type: 'array'; itemType?: 'string' | 'number'; optional?: boolean }
  | { type: 'uuid'; optional?: boolean };

export type ValidationSchema = Record<string, ValidationRule>;

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validate(data: Record<string, unknown>, schema: ValidationSchema): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field];
    const isUndefined = value === undefined || value === null || value === '';

    if (isUndefined) {
      if (!rule.optional) {
        errors[field] = `${field} is required`;
      }
      continue;
    }

    switch (rule.type) {
      case 'string': {
        if (typeof value !== 'string') {
          errors[field] = `${field} must be a string`;
          break;
        }
        if (rule.minLength !== undefined && value.length < rule.minLength) {
          errors[field] = `${field} must be at least ${rule.minLength} characters`;
        } else if (rule.maxLength !== undefined && value.length > rule.maxLength) {
          errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
        } else if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = `${field} format is invalid`;
        }
        break;
      }
      case 'email': {
        if (typeof value !== 'string' || !EMAIL_RE.test(value)) {
          errors[field] = `${field} must be a valid email address`;
        }
        break;
      }
      case 'number': {
        const num = Number(value);
        if (isNaN(num)) {
          errors[field] = `${field} must be a number`;
        } else if (rule.min !== undefined && num < rule.min) {
          errors[field] = `${field} must be at least ${rule.min}`;
        } else if (rule.max !== undefined && num > rule.max) {
          errors[field] = `${field} must not exceed ${rule.max}`;
        }
        break;
      }
      case 'boolean': {
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          errors[field] = `${field} must be a boolean`;
        }
        break;
      }
      case 'enum': {
        if (!rule.values.includes(String(value))) {
          errors[field] = `${field} must be one of: ${rule.values.join(', ')}`;
        }
        break;
      }
      case 'date': {
        const d = new Date(String(value));
        if (isNaN(d.getTime())) {
          errors[field] = `${field} must be a valid date`;
        }
        break;
      }
      case 'array': {
        if (!Array.isArray(value)) {
          errors[field] = `${field} must be an array`;
        }
        break;
      }
      case 'uuid': {
        if (typeof value !== 'string' || !UUID_RE.test(value)) {
          errors[field] = `${field} must be a valid UUID`;
        }
        break;
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ==================== PREDEFINED SCHEMAS ====================

export const LOGIN_SCHEMA: ValidationSchema = {
  email: { type: 'email' },
  password: { type: 'string', minLength: 8, maxLength: 128 },
};

export const REGISTER_SCHEMA: ValidationSchema = {
  email: { type: 'email' },
  password: { type: 'string', minLength: 8, maxLength: 128 },
  firstName: { type: 'string', minLength: 1, maxLength: 100 },
  lastName: { type: 'string', minLength: 1, maxLength: 100 },
  phone: { type: 'string', minLength: 7, maxLength: 20 },
  nationality: { type: 'string', minLength: 2, maxLength: 100 },
};

export const PASSPORT_SCHEMA: ValidationSchema = {
  type: { type: 'enum', values: ['ordinary', 'official', 'diplomatic', 'emergency'] },
  firstName: { type: 'string', minLength: 1, maxLength: 100 },
  lastName: { type: 'string', minLength: 1, maxLength: 100 },
  dateOfBirth: { type: 'date' },
  placeOfBirth: { type: 'string', minLength: 2, maxLength: 200 },
  nationality: { type: 'string', minLength: 2, maxLength: 100 },
  gender: { type: 'enum', values: ['male', 'female', 'other'] },
  email: { type: 'email' },
  phone: { type: 'string', minLength: 7, maxLength: 20 },
  address: { type: 'string', minLength: 5, maxLength: 500 },
};

export const APPOINTMENT_SCHEMA: ValidationSchema = {
  serviceType: { type: 'enum', values: ['passport', 'visa', 'biometric', 'collection', 'inquiry'] },
  preferredDate: { type: 'date' },
  preferredTime: { type: 'string', pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  locationId: { type: 'string', minLength: 1 },
  locationName: { type: 'string', minLength: 1, maxLength: 200 },
  email: { type: 'email' },
  phone: { type: 'string', minLength: 7, maxLength: 20 },
  firstName: { type: 'string', minLength: 1, maxLength: 100 },
  lastName: { type: 'string', minLength: 1, maxLength: 100 },
  notes: { type: 'string', maxLength: 1000, optional: true },
};

export const BORDER_CROSSING_SCHEMA: ValidationSchema = {
  travelerId: { type: 'string', minLength: 1 },
  passportNumber: { type: 'string', minLength: 5, maxLength: 20 },
  crossingType: { type: 'enum', values: ['entry', 'exit'] },
  borderPostId: { type: 'string', minLength: 1 },
  borderPostName: { type: 'string', minLength: 1, maxLength: 200 },
  purposeOfTravel: { type: 'string', maxLength: 500, optional: true },
  destinationCountry: { type: 'string', maxLength: 100, optional: true },
  originCountry: { type: 'string', maxLength: 100, optional: true },
};

// ==================== HONO MIDDLEWARE FACTORY ====================

/**
 * Returns a Hono middleware that validates the request body against a schema.
 *
 * @example
 * ```ts
 * app.post('/auth/login', createValidationMiddleware(LOGIN_SCHEMA), handler);
 * ```
 */
export function createValidationMiddleware(schema: ValidationSchema) {
  return async (
    c: { req: { json: () => Promise<Record<string, unknown>> }; json: (data: unknown, status?: number) => Response },
    next: () => Promise<void>
  ) => {
    let body: Record<string, unknown>;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'Invalid JSON body', code: 'INVALID_JSON' }, 400 as never);
    }

    const { valid, errors } = validate(body, schema);
    if (!valid) {
      return c.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', errors },
        422 as never
      );
    }

    await next();
  };
}

export default createValidationMiddleware;
