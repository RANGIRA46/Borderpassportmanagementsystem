import { supabaseAdmin } from '../config/database.js';
import { logger } from '../utils/logger.js';
import type { Appointment, UserRole } from '../models/types.js';
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '../models/schemas.js';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
];

export const appointmentService = {
  async getAll(userId: string, role: UserRole): Promise<Appointment[]> {
    let query = supabaseAdmin
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (role === 'citizen') {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to fetch appointments', error);
      throw new Error('Failed to fetch appointments');
    }

    return (data ?? []) as unknown as Appointment[];
  },

  async getById(
    id: string,
    userId: string,
    role: UserRole
  ): Promise<Appointment> {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new Error('Appointment not found');

    const appointment = data as unknown as Appointment;
    if (role === 'citizen' && appointment.user_id !== userId) {
      throw new Error('Forbidden');
    }

    return appointment;
  },

  async create(userId: string, input: CreateAppointmentInput): Promise<Appointment> {
    const { data: conflict } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('appointment_date', input.appointment_date)
      .eq('appointment_time', input.appointment_time)
      .eq('location', input.location)
      .not('status', 'eq', 'cancelled')
      .maybeSingle();

    if (conflict) {
      throw new Error('This time slot is already booked at the selected location');
    }

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        user_id: userId,
        appointment_type: input.appointment_type,
        appointment_date: input.appointment_date,
        appointment_time: input.appointment_time,
        location: input.location,
        notes: input.notes ?? null,
        status: 'scheduled',
      })
      .select('*')
      .single();

    if (error || !data) {
      logger.error('Failed to create appointment', error);
      throw new Error('Failed to create appointment');
    }

    return data as unknown as Appointment;
  },

  async update(
    id: string,
    userId: string,
    role: UserRole,
    input: UpdateAppointmentInput
  ): Promise<Appointment> {
    const appointment = await appointmentService.getById(id, userId, role);

    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      throw new Error('Cannot update a cancelled or completed appointment');
    }

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) throw new Error('Failed to update appointment');
    return data as unknown as Appointment;
  },

  async cancel(id: string, userId: string, role: UserRole): Promise<Appointment> {
    const appointment = await appointmentService.getById(id, userId, role);

    if (appointment.status === 'cancelled') {
      throw new Error('Appointment is already cancelled');
    }

    if (appointment.status === 'completed') {
      throw new Error('Cannot cancel a completed appointment');
    }

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) throw new Error('Failed to cancel appointment');
    return data as unknown as Appointment;
  },

  async getAvailableSlots(
    date: string,
    location: string
  ): Promise<string[]> {
    const { data: booked } = await supabaseAdmin
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .eq('location', location)
      .not('status', 'eq', 'cancelled');

    const bookedTimes = new Set((booked ?? []).map((a) => a.appointment_time as string));
    return TIME_SLOTS.filter((slot) => !bookedTimes.has(slot));
  },
};
