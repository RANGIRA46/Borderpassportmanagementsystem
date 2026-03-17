import type { Context } from 'hono';
import { appointmentService } from '../services/appointmentService.js';
import type { UserRole } from '../models/types.js';
import type { CreateAppointmentInput, UpdateAppointmentInput } from '../models/schemas.js';

interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export const appointmentController = {
  async getAll(c: Context) {
    const user = c.get('user') as AuthUser;
    try {
      const appointments = await appointmentService.getAll(user.userId, user.role);
      return c.json({ success: true, data: appointments });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch appointments';
      return c.json({ success: false, error: message }, 500);
    }
  },

  async getById(c: Context) {
    const user = c.get('user') as AuthUser;
    const id = c.req.param('id') ?? '';
    try {
      const appointment = await appointmentService.getById(id, user.userId, user.role);
      return c.json({ success: true, data: appointment });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch appointment';
      const status = message.includes('not found') ? 404 : message.includes('Forbidden') ? 403 : 500;
      return c.json({ success: false, error: message }, status);
    }
  },

  async create(c: Context) {
    const user = c.get('user') as AuthUser;
    const body = c.get('validatedBody') as CreateAppointmentInput;
    try {
      const appointment = await appointmentService.create(user.userId, body);
      return c.json({ success: true, data: appointment }, 201);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create appointment';
      return c.json({ success: false, error: message }, 400);
    }
  },

  async update(c: Context) {
    const user = c.get('user') as AuthUser;
    const id = c.req.param('id') ?? '';
    const body = c.get('validatedBody') as UpdateAppointmentInput;
    try {
      const appointment = await appointmentService.update(id, user.userId, user.role, body);
      return c.json({ success: true, data: appointment });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update appointment';
      const status = message.includes('not found') ? 404 : message.includes('Forbidden') ? 403 : 400;
      return c.json({ success: false, error: message }, status);
    }
  },

  async cancel(c: Context) {
    const user = c.get('user') as AuthUser;
    const id = c.req.param('id') ?? '';
    try {
      const appointment = await appointmentService.cancel(id, user.userId, user.role);
      return c.json({ success: true, data: appointment });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel appointment';
      const status = message.includes('not found') ? 404 : message.includes('Forbidden') ? 403 : 400;
      return c.json({ success: false, error: message }, status);
    }
  },

  async getAvailableSlots(c: Context) {
    const { date, location } = c.req.query();
    if (!date || !location) {
      return c.json(
        { success: false, error: 'date and location query parameters are required' },
        400
      );
    }
    try {
      const slots = await appointmentService.getAvailableSlots(date, location);
      return c.json({ success: true, data: slots });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch slots';
      return c.json({ success: false, error: message }, 500);
    }
  },
};
