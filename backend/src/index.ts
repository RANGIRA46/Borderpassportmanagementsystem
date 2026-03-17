import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger as honoLogger } from 'hono/logger';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

import authRoutes from './routes/auth.js';
import passportRoutes from './routes/passport.js';
import borderCrossingRoutes from './routes/borderCrossing.js';
import appointmentRoutes from './routes/appointment.js';
import dashboardRoutes from './routes/dashboard.js';

const app = new Hono();

app.use('*', corsMiddleware);
app.use('*', honoLogger());

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.route('/api/auth', authRoutes);
app.route('/api/passports', passportRoutes);
app.route('/api/border-crossings', borderCrossingRoutes);
app.route('/api/appointments', appointmentRoutes);
app.route('/api/dashboard', dashboardRoutes);

app.onError(errorHandler);

app.notFound((c) =>
  c.json({ success: false, error: 'Route not found' }, 404)
);

serve(
  {
    fetch: app.fetch,
    port: env.port,
  },
  (info) => {
    logger.info(`Server started on port ${info.port} [${env.nodeEnv}]`);
  }
);

export default app;
