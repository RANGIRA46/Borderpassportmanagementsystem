import type { Context } from 'hono';
import { passportService } from '../services/passportService.js';
import type { UserRole } from '../models/types.js';
import type { CreatePassportInput, UpdatePassportInput } from '../models/schemas.js';

interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export const passportController = {
  async getAll(c: Context) {
    const user = c.get('user') as AuthUser;
    try {
      const passports = await passportService.getAll(user.userId, user.role);
      return c.json({ success: true, data: passports });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch passports';
      return c.json({ success: false, error: message }, 500);
    }
  },

  async getById(c: Context) {
    const user = c.get('user') as AuthUser;
    const id = c.req.param('id') ?? '';
    try {
      const passport = await passportService.getById(id, user.userId, user.role);
      return c.json({ success: true, data: passport });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch passport';
      const status = message.includes('not found') ? 404 : message.includes('Forbidden') ? 403 : 500;
      return c.json({ success: false, error: message }, status);
    }
  },

  async create(c: Context) {
    const user = c.get('user') as AuthUser;
    const body = c.get('validatedBody') as CreatePassportInput;
    try {
      const passport = await passportService.create(user.userId, body);
      return c.json({ success: true, data: passport }, 201);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create passport';
      return c.json({ success: false, error: message }, 400);
    }
  },

  async update(c: Context) {
    const user = c.get('user') as AuthUser;
    const id = c.req.param('id') ?? '';
    const body = c.get('validatedBody') as UpdatePassportInput;
    try {
      const passport = await passportService.update(id, user.userId, user.role, body);
      return c.json({ success: true, data: passport });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update passport';
      const status = message.includes('not found') ? 404 : message.includes('Forbidden') ? 403 : 400;
      return c.json({ success: false, error: message }, status);
    }
  },

  async delete(c: Context) {
    const user = c.get('user') as AuthUser;
    const id = c.req.param('id') ?? '';
    try {
      await passportService.delete(id, user.userId, user.role);
      return c.json({ success: true, message: 'Passport deleted successfully' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete passport';
      const status = message.includes('not found') ? 404 : message.includes('Forbidden') ? 403 : 500;
      return c.json({ success: false, error: message }, status);
    }
  },
};
