import type { Context } from 'hono';
import { borderCrossingService } from '../services/borderCrossingService.js';
import type { UserRole } from '../models/types.js';
import type { CreateBorderCrossingInput, BorderCrossingUpdateInput } from '../models/schemas.js';

interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export const borderCrossingController = {
  async getAll(c: Context) {
    const user = c.get('user') as AuthUser;
    const { status, border_point, crossing_type, from_date, to_date } = c.req.query();
    try {
      const crossings = await borderCrossingService.getAll(user.userId, user.role, {
        status,
        border_point,
        crossing_type,
        from_date,
        to_date,
      });
      return c.json({ success: true, data: crossings });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch crossings';
      return c.json({ success: false, error: message }, 500);
    }
  },

  async getById(c: Context) {
    const user = c.get('user') as AuthUser;
    const id = c.req.param('id') ?? '';
    try {
      const crossing = await borderCrossingService.getById(id, user.userId, user.role);
      return c.json({ success: true, data: crossing });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch crossing';
      const status = message.includes('not found') ? 404 : message.includes('Forbidden') ? 403 : 500;
      return c.json({ success: false, error: message }, status);
    }
  },

  async create(c: Context) {
    const user = c.get('user') as AuthUser;
    const body = c.get('validatedBody') as CreateBorderCrossingInput;
    try {
      const crossing = await borderCrossingService.create(user.userId, body);
      return c.json({ success: true, data: crossing }, 201);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create crossing';
      return c.json({ success: false, error: message }, 400);
    }
  },

  async update(c: Context) {
    const user = c.get('user') as AuthUser;
    const id = c.req.param('id') ?? '';
    const body = c.get('validatedBody') as BorderCrossingUpdateInput;
    try {
      const crossing = await borderCrossingService.update(id, user.userId, body);
      return c.json({ success: true, data: crossing });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update crossing';
      const status = message.includes('not found') ? 404 : 400;
      return c.json({ success: false, error: message }, status);
    }
  },

  async getStats(c: Context) {
    try {
      const stats = await borderCrossingService.getStats();
      return c.json({ success: true, data: stats });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stats';
      return c.json({ success: false, error: message }, 500);
    }
  },
};
