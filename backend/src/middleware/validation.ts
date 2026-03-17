import type { Context, Next } from 'hono';
import { ZodSchema, ZodError } from 'zod';

export const validate =
  (schema: ZodSchema) => async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const parsed = schema.parse(body);
      c.set('validatedBody', parsed);
      await next();
    } catch (err) {
      if (err instanceof ZodError) {
        return c.json(
          {
            success: false,
            error: 'Validation error',
            details: err.errors.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
          400
        );
      }
      return c.json({ success: false, error: 'Invalid request body' }, 400);
    }
  };
