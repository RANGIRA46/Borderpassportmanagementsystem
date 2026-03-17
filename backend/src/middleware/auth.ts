import type { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
import type { UserRole } from '../models/types.js';

export const authMiddleware = async (c: Context, next: Next) => {
  const authorization = c.req.header('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Missing or invalid authorization header' }, 401);
  }

  const token = authorization.slice(7);

  try {
    const payload = await verifyToken(token);
    c.set('user', payload);
    await next();
  } catch (err) {
    logger.warn('Invalid token', err);
    return c.json({ success: false, error: 'Invalid or expired token' }, 401);
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as { userId: string; email: string; role: UserRole } | undefined;

    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    if (!roles.includes(user.role)) {
      return c.json(
        { success: false, error: 'Insufficient permissions' },
        403
      );
    }

    await next();
  };
};
