import type { Context } from 'hono';
import { authService } from '../services/authService.js';
import { logger } from '../utils/logger.js';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../models/schemas.js';

export const authController = {
  async register(c: Context) {
    const body = c.get('validatedBody') as RegisterInput;
    try {
      const result = await authService.register(body);
      return c.json({ success: true, data: result }, 201);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      logger.error('Register error', err);
      return c.json({ success: false, error: message }, 400);
    }
  },

  async login(c: Context) {
    const body = c.get('validatedBody') as LoginInput;
    try {
      const result = await authService.login(body.email, body.password);
      return c.json({ success: true, data: result });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return c.json({ success: false, error: message }, 401);
    }
  },

  async getProfile(c: Context) {
    const user = c.get('user') as { userId: string };
    try {
      const profile = await authService.getProfile(user.userId);
      return c.json({ success: true, data: profile });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get profile';
      return c.json({ success: false, error: message }, 404);
    }
  },

  async updateProfile(c: Context) {
    const user = c.get('user') as { userId: string };
    const body = c.get('validatedBody') as UpdateProfileInput;
    try {
      const updated = await authService.updateProfile(user.userId, body);
      return c.json({ success: true, data: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      return c.json({ success: false, error: message }, 400);
    }
  },
};
