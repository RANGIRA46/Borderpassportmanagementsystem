import { getAuthContext } from './security.mjs';

export async function requireAuth(c, next) {
  const auth = await getAuthContext(c.req.header('Authorization'));
  if (!auth) return c.json({ message: 'Unauthorized' }, 401);
  c.set('auth', auth);
  return next();
}

export function requireRole(...roles) {
  return async (c, next) => {
    const auth = c.get('auth');
    if (!auth || !roles.includes(auth.user.role)) {
      return c.json({ message: 'Forbidden' }, 403);
    }
    return next();
  };
}
