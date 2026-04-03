/**
 * Authentication & Registration Validation Schemas
 * Uses Zod for strict schema validation
 */

import { z } from 'zod';

// Government Employee ID validation (Format: DEPT-YYYY-XXXXX)
const GOV_EMPLOYEE_ID_REGEX = /^[A-Z]{2,4}-\d{4}-\d{5}$/;

// Work email validator - blocks personal email providers
const RESTRICTED_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'mail.com',
  'protonmail.com',
  'icloud.com',
];

export const RegistrationSchema = z.object({
  fullLegalName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),

  governmentEmployeeId: z
    .string()
    .regex(GOV_EMPLOYEE_ID_REGEX, 'Government Employee ID must follow format: DEPT-YYYY-XXXXX (e.g., CUST-2024-00001)'),

  workEmail: z
    .string()
    .email('Must be a valid email address')
    .refine(
      (email) => {
        const domain = email.split('@')[1]?.toLowerCase();
        return !RESTRICTED_EMAIL_DOMAINS.includes(domain || '');
      },
      {
        message: 'Only official government work emails are allowed. Personal email providers are blocked.',
      }
    ),

  agency: z
    .enum([
      'CUSTOMS',
      'IMMIGRATION',
      'INTELLIGENCE',
      'POLICE',
      'SECURITY_FORCE',
      'HEALTH',
      'TRANSPORT',
    ])
    .describe('Government agency or department'),

  rank: z
    .enum([
      'JUNIOR_OFFICER',
      'SENIOR_OFFICER',
      'SUPERVISOR',
      'MANAGER',
      'DIRECTOR',
      'EXECUTIVE',
    ])
    .describe('Rank or level within the agency'),

  supervisorEmail: z
    .string()
    .email('Supervisor email must be valid')
    .refine(
      (email) => {
        const domain = email.split('@')[1]?.toLowerCase();
        return !RESTRICTED_EMAIL_DOMAINS.includes(domain || '');
      },
      { message: 'Supervisor email must also be a work email' }
    ),

  departmentDescription: z
    .string()
    .optional()
    .max(500, 'Department description must not exceed 500 characters'),
});

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;

// Login schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// MFA (TOTP) verification schema
export const MFAVerificationSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only digits'),
});

export type MFAVerificationData = z.infer<typeof MFAVerificationSchema>;

// Password change schema
export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(12, 'New password must be at least 12 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a digit')
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordChangeData = z.infer<typeof PasswordChangeSchema>;

// API Response schemas
export const RegistrationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  requestId: z.string().optional(),
  errors: z.record(z.string().array()).optional(),
});

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      fullName: z.string(),
      role: z.string(),
      permissions: z.string().array(),
      mfaEnabled: z.boolean(),
      lastLogin: z.string().optional(),
    })
    .optional(),
  accessToken: z.string().optional(),
  requiresMFA: z.boolean().optional(),
});

export const ValidationError = z.object({
  field: z.string(),
  message: z.string(),
});

