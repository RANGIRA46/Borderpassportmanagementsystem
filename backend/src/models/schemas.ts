import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  role: z.enum(['citizen', 'official', 'admin']).default('citizen'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createPassportSchema = z.object({
  type: z.enum(['regular', 'diplomatic', 'official']),
  full_name: z.string().min(1, 'Full name is required'),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  nationality: z.string().min(1, 'Nationality is required'),
  place_of_birth: z.string().min(1, 'Place of birth is required'),
});

export const updatePassportSchema = createPassportSchema
  .partial()
  .extend({
    status: z.enum(['applied', 'under_review', 'approved', 'rejected']).optional(),
  });

export const createBorderCrossingSchema = z.object({
  passport_id: z.string().uuid('Invalid passport ID'),
  border_point: z.string().min(1, 'Border point is required'),
  crossing_type: z.enum(['entry', 'exit']),
  country_from: z.string().min(1, 'Country from is required'),
  country_to: z.string().min(1, 'Country to is required'),
  purpose: z.string().optional(),
});

export const createAppointmentSchema = z.object({
  appointment_type: z.enum([
    'passport_application',
    'passport_renewal',
    'border_crossing_permit',
    'other',
  ]),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = createAppointmentSchema
  .partial()
  .extend({
    status: z
      .enum(['scheduled', 'confirmed', 'completed', 'cancelled'])
      .optional(),
  });

export const updateProfileSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
});

export const borderCrossingUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'denied']),
  notes: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePassportInput = z.infer<typeof createPassportSchema>;
export type UpdatePassportInput = z.infer<typeof updatePassportSchema>;
export type CreateBorderCrossingInput = z.infer<typeof createBorderCrossingSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type BorderCrossingUpdateInput = z.infer<typeof borderCrossingUpdateSchema>;
