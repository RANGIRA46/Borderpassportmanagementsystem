import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requireAuth, requireRole } from './middleware.mjs';
import * as domain from './domain.mjs';

export function createApp() {
  const app = new Hono();

  // Middleware
  app.use(logger());
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
      credentials: true,
    })
  );

  // Helper to extract request metadata
  function getRequestMeta(c) {
    return {
      ipAddress: c.req.header('x-forwarded-for') || c.env?.request?.socket?.remoteAddress || 'unknown',
      userAgent: c.req.header('user-agent') || 'unknown',
    };
  }

  // =============================================
  // Authentication Endpoints
  // =============================================

  app.post('/api/v1/auth/register', async (c) => {
    const body = await c.req.json();
    const result = await domain.registerUser(body, getRequestMeta(c));
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 201);
  });

  app.post('/api/v1/auth/login', async (c) => {
    const body = await c.req.json();
    const result = await domain.loginUser(body, getRequestMeta(c));
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 200);
  });

  app.post('/api/v1/auth/logout', requireAuth, async (c) => {
    const auth = c.get('auth');
    const result = await domain.logoutUser(auth, getRequestMeta(c));
    return c.json(result);
  });

  app.post('/api/v1/auth/refresh', async (c) => {
    const body = await c.req.json();
    const result = await domain.refreshUserSession(body);
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 200);
  });

  // =============================================
  // User Endpoints
  // =============================================

  app.get('/api/v1/users/profile', requireAuth, async (c) => {
    const auth = c.get('auth');
    return c.json({ user: auth.user });
  });

  app.post('/api/v1/users/profile', requireAuth, async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.updateUserProfile(auth, body, getRequestMeta(c));
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 200);
  });

  app.post('/api/v1/users/change-password', requireAuth, async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.changeUserPassword(auth, body, getRequestMeta(c));
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 200);
  });

  // =============================================
  // Passport Endpoints
  // =============================================

  app.post('/api/v1/passports', requireAuth, async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.createPassport(auth, body, getRequestMeta(c));
    return c.json(result, 201);
  });

  app.get('/api/v1/passports', requireAuth, async (c) => {
    const auth = c.get('auth');
    const query = Object.fromEntries(c.req.query());
    const result = await domain.listPassports(auth, query);
    return c.json(result);
  });

  app.get('/api/v1/passports/:id', requireAuth, async (c) => {
    const auth = c.get('auth');
    const id = c.req.param('id');
    const result = await domain.getPassport(auth, id);
    if (result === null) return c.json({ error: 'Passport not found' }, 404);
    if (result === 'forbidden') return c.json({ error: 'Forbidden' }, 403);
    return c.json(result);
  });

  app.put('/api/v1/passports/:id', requireAuth, requireRole('official', 'admin'), async (c) => {
    const auth = c.get('auth');
    const id = c.req.param('id');
    const body = await c.req.json();
    const result = await domain.updatePassportStatus(auth, id, body, getRequestMeta(c));
    if (!result) return c.json({ error: 'Passport not found' }, 404);
    return c.json(result);
  });

  app.post('/api/v1/passports/:id/verify', requireAuth, requireRole('official', 'admin'), async (c) => {
    const auth = c.get('auth');
    const id = c.req.param('id');
    const result = await domain.verifyPassport(auth, id, getRequestMeta(c));
    if (!result) return c.json({ error: 'Passport not found' }, 404);
    return c.json(result);
  });

  // =============================================
  // Biometric Endpoints
  // =============================================

  app.post('/api/v1/biometrics/enroll', requireAuth, async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.enrollBiometric(auth, body, getRequestMeta(c));
    return c.json(result, 201);
  });

  app.post('/api/v1/biometrics/verify', requireAuth, async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.verifyBiometric(auth, body, getRequestMeta(c));
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 200);
  });

  app.post('/api/v1/biometrics/identify', requireAuth, requireRole('official', 'admin'), async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.identifyBiometric(auth, body);
    return c.json(result);
  });

  app.get('/api/v1/biometrics/user/:userId', requireAuth, requireRole('official', 'admin'), async (c) => {
    const userId = c.req.param('userId');
    const result = await domain.getBiometricsForUser(userId);
    return c.json(result);
  });

  app.delete('/api/v1/biometrics/:id', requireAuth, async (c) => {
    const auth = c.get('auth');
    const id = c.req.param('id');
    const result = await domain.deleteBiometric(auth, id, getRequestMeta(c));
    return c.json({ success: result }, result ? 200 : 404);
  });

  // =============================================
  // Border Endpoints
  // =============================================

  app.post('/api/v1/border/entry', requireAuth, requireRole('official', 'admin'), async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.createBorderCrossing(auth, body, 'entry', getRequestMeta(c));
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 201);
  });

  app.post('/api/v1/border/exit', requireAuth, requireRole('official', 'admin'), async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.createBorderCrossing(auth, body, 'exit', getRequestMeta(c));
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 201);
  });

  app.get('/api/v1/border/records', requireAuth, requireRole('official', 'admin'), async (c) => {
    const query = Object.fromEntries(c.req.query());
    const result = await domain.listBorderRecords(query);
    return c.json(result);
  });

  app.get('/api/v1/border/alerts', requireAuth, requireRole('official', 'admin'), async (c) => {
    const result = await domain.getBorderAlerts();
    return c.json(result);
  });

  app.get('/api/v1/border/statistics', requireAuth, requireRole('official', 'admin'), async (c) => {
    const result = await domain.getBorderStatistics();
    return c.json(result);
  });

  app.post('/api/v1/border/verify', requireAuth, requireRole('official', 'admin'), async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.verifyTraveler(auth, body, getRequestMeta(c));
    return c.json(result.error ? result.error : result, result.error ? result.error.status : 200);
  });

  // =============================================
  // Watchlist Endpoints
  // =============================================

  app.post('/api/v1/watchlist', requireAuth, requireRole('official', 'admin'), async (c) => {
    const auth = c.get('auth');
    const body = await c.req.json();
    const result = await domain.createWatchlistRecord(auth, body, getRequestMeta(c));
    return c.json(result, 201);
  });

  app.get('/api/v1/watchlist', requireAuth, requireRole('official', 'admin'), async (c) => {
    const query = Object.fromEntries(c.req.query());
    const result = await domain.listWatchlistRecords(query);
    return c.json(result);
  });

  // =============================================
  // Health Check
  // =============================================

  app.get('/api/v1/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // =============================================
  // 404 Handler
  // =============================================

  app.notFound((c) => {
    return c.json({ error: 'Not Found', path: c.req.path }, 404);
  });

  return app;
}

