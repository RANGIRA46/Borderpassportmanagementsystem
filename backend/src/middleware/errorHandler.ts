import type { Context } from 'hono';
import { logger } from '../utils/logger.js';

export const errorHandler = (err: Error, c: Context) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });

  if (err.message.includes('not found') || err.message.includes('Not found')) {
    return c.json({ success: false, error: err.message }, 404);
  }

  if (
    err.message.includes('Unauthorized') ||
    err.message.includes('unauthorized')
  ) {
    return c.json({ success: false, error: err.message }, 401);
  }

  if (
    err.message.includes('Forbidden') ||
    err.message.includes('Insufficient permissions')
  ) {
    return c.json({ success: false, error: err.message }, 403);
  }

  return c.json(
    {
      success: false,
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
    },
    500
  );
};
