import type { Context } from 'hono';
import { analyticsService } from '../services/analyticsService.js';
import type { UserRole } from '../models/types.js';

interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export const dashboardController = {
  async getStats(c: Context) {
    const user = c.get('user') as AuthUser;
    try {
      if (user.role === 'citizen') {
        const stats = await analyticsService.getUserStats(user.userId);
        return c.json({ success: true, data: stats });
      }
      const stats = await analyticsService.getDashboardStats();
      return c.json({ success: true, data: stats });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stats';
      return c.json({ success: false, error: message }, 500);
    }
  },

  async getPassportStats(c: Context) {
    try {
      const stats = await analyticsService.getPassportStats();
      return c.json({ success: true, data: stats });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch passport stats';
      return c.json({ success: false, error: message }, 500);
    }
  },

  async getBorderCrossingStats(c: Context) {
    try {
      const stats = await analyticsService.getBorderCrossingStats();
      return c.json({ success: true, data: stats });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch crossing stats';
      return c.json({ success: false, error: message }, 500);
    }
  },
};
