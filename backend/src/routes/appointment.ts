import { Hono } from 'hono';
import { appointmentController } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from '../models/schemas.js';

const appointment = new Hono();

appointment.use('*', authMiddleware);

appointment.get('/slots', appointmentController.getAvailableSlots);
appointment.get('/', appointmentController.getAll);
appointment.get('/:id', appointmentController.getById);
appointment.post('/', validate(createAppointmentSchema), appointmentController.create);
appointment.patch('/:id', validate(updateAppointmentSchema), appointmentController.update);
appointment.delete('/:id', appointmentController.cancel);

export default appointment;
