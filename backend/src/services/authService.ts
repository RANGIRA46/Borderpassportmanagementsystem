import { supabaseAdmin } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import { signToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
import type { User, AuthPayload } from '../models/types.js';
import type { RegisterInput, UpdateProfileInput } from '../models/schemas.js';

export const authService = {
  async register(data: RegisterInput): Promise<{ user: User; token: string }> {
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();

    if (existing) {
      throw new Error('Email already registered');
    }

    const password_hash = await hashPassword(data.password);

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: data.email,
        password_hash,
        full_name: data.full_name,
        role: data.role,
        phone: data.phone ?? null,
      })
      .select('id, email, full_name, role, phone, created_at, updated_at')
      .single();

    if (error || !user) {
      logger.error('Failed to create user', error);
      throw new Error('Failed to create user');
    }

    const payload: AuthPayload = {
      userId: user.id as string,
      email: user.email as string,
      role: user.role as AuthPayload['role'],
    };

    const token = await signToken(payload);
    return { user: user as unknown as User, token };
  },

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, full_name, role, phone, created_at, updated_at')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    const valid = await comparePassword(password, user.password_hash as string);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    const payload: AuthPayload = {
      userId: user.id as string,
      email: user.email as string,
      role: user.role as AuthPayload['role'],
    };

    const token = await signToken(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _ph, ...safeUser } = user as typeof user & { password_hash: string };
    return { user: safeUser as unknown as User, token };
  },

  async getProfile(userId: string): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, phone, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new Error('User not found');
    }

    return data as unknown as User;
  },

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<User> {
    const { data: updated, error } = await supabaseAdmin
      .from('users')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id, email, full_name, role, phone, created_at, updated_at')
      .single();

    if (error || !updated) {
      throw new Error('Failed to update profile');
    }

    return updated as unknown as User;
  },
};
