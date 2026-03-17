import { supabaseAdmin } from '../config/database.js';
import { logger } from '../utils/logger.js';
import type { Passport, UserRole } from '../models/types.js';
import type { CreatePassportInput, UpdatePassportInput } from '../models/schemas.js';

const generatePassportNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let num = '';
  for (let i = 0; i < 2; i++) num += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 7; i++) num += digits[Math.floor(Math.random() * digits.length)];
  return num;
};

export const passportService = {
  async getAll(userId: string, role: UserRole): Promise<Passport[]> {
    let query = supabaseAdmin
      .from('passports')
      .select('*')
      .order('created_at', { ascending: false });

    if (role === 'citizen') {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to fetch passports', error);
      throw new Error('Failed to fetch passports');
    }

    return (data ?? []) as unknown as Passport[];
  },

  async getById(id: string, userId: string, role: UserRole): Promise<Passport> {
    const { data, error } = await supabaseAdmin
      .from('passports')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error('Passport not found');
    }

    const passport = data as unknown as Passport;
    if (role === 'citizen' && passport.user_id !== userId) {
      throw new Error('Forbidden');
    }

    return passport;
  },

  async create(userId: string, input: CreatePassportInput): Promise<Passport> {
    const passport_number = generatePassportNumber();

    const { data, error } = await supabaseAdmin
      .from('passports')
      .insert({
        user_id: userId,
        passport_number,
        status: 'applied',
        type: input.type,
        full_name: input.full_name,
        date_of_birth: input.date_of_birth,
        nationality: input.nationality,
        place_of_birth: input.place_of_birth,
      })
      .select('*')
      .single();

    if (error || !data) {
      logger.error('Failed to create passport', error);
      throw new Error('Failed to create passport application');
    }

    return data as unknown as Passport;
  },

  async update(
    id: string,
    userId: string,
    role: UserRole,
    input: UpdatePassportInput
  ): Promise<Passport> {
    const passport = await passportService.getById(id, userId, role);

    if (role === 'citizen') {
      if (passport.status !== 'applied') {
        throw new Error('Cannot update passport that is already under review or processed');
      }
      const { status: _s, ...allowedFields } = input;
      const { data, error } = await supabaseAdmin
        .from('passports')
        .update({ ...allowedFields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error || !data) throw new Error('Failed to update passport');
      return data as unknown as Passport;
    }

    const { data, error } = await supabaseAdmin
      .from('passports')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) throw new Error('Failed to update passport');
    return data as unknown as Passport;
  },

  async delete(id: string, userId: string, role: UserRole): Promise<void> {
    const passport = await passportService.getById(id, userId, role);

    if (role === 'citizen' && passport.user_id !== userId) {
      throw new Error('Forbidden');
    }

    const { error } = await supabaseAdmin
      .from('passports')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Failed to delete passport', error);
      throw new Error('Failed to delete passport');
    }
  },
};
