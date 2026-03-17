import { Hono } from 'hono';
import { dashboardController } from '../controllers/dashboardController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const dashboard = new Hono();

dashboard.use('*', authMiddleware);

dashboard.get('/stats', dashboardController.getStats);
dashboard.get(
  '/passport-stats',
  requireRole('admin', 'official'),
  dashboardController.getPassportStats
);
dashboard.get(
  '/crossing-stats',
  requireRole('admin', 'official'),
  dashboardController.getBorderCrossingStats
);

export default dashboard;
