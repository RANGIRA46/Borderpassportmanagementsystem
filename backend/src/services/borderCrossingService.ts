import { supabaseAdmin } from '../config/database.js';
import { logger } from '../utils/logger.js';
import type { BorderCrossing, UserRole } from '../models/types.js';
import type { CreateBorderCrossingInput, BorderCrossingUpdateInput } from '../models/schemas.js';

interface CrossingFilters {
  status?: string;
  border_point?: string;
  crossing_type?: string;
  from_date?: string;
  to_date?: string;
}

export const borderCrossingService = {
  async getAll(
    userId: string,
    role: UserRole,
    filters: CrossingFilters = {}
  ): Promise<BorderCrossing[]> {
    let query = supabaseAdmin
      .from('border_crossings')
      .select('*')
      .order('created_at', { ascending: false });

    if (role === 'citizen') {
      query = query.eq('user_id', userId);
    }

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.border_point) query = query.eq('border_point', filters.border_point);
    if (filters.crossing_type) query = query.eq('crossing_type', filters.crossing_type);
    if (filters.from_date) query = query.gte('crossing_date', filters.from_date);
    if (filters.to_date) query = query.lte('crossing_date', filters.to_date);

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to fetch border crossings', error);
      throw new Error('Failed to fetch border crossings');
    }

    return (data ?? []) as unknown as BorderCrossing[];
  },

  async getById(
    id: string,
    userId: string,
    role: UserRole
  ): Promise<BorderCrossing> {
    const { data, error } = await supabaseAdmin
      .from('border_crossings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new Error('Border crossing not found');

    const crossing = data as unknown as BorderCrossing;
    if (role === 'citizen' && crossing.user_id !== userId) {
      throw new Error('Forbidden');
    }

    return crossing;
  },

  async create(
    userId: string,
    input: CreateBorderCrossingInput
  ): Promise<BorderCrossing> {
    const { data, error } = await supabaseAdmin
      .from('border_crossings')
      .insert({
        user_id: userId,
        passport_id: input.passport_id,
        border_point: input.border_point,
        crossing_type: input.crossing_type,
        crossing_date: new Date().toISOString().split('T')[0],
        country_from: input.country_from,
        country_to: input.country_to,
        purpose: input.purpose ?? null,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error || !data) {
      logger.error('Failed to create border crossing', error);
      throw new Error('Failed to create border crossing record');
    }

    return data as unknown as BorderCrossing;
  },

  async update(
    id: string,
    officerId: string,
    input: BorderCrossingUpdateInput
  ): Promise<BorderCrossing> {
    const { data, error } = await supabaseAdmin
      .from('border_crossings')
      .update({
        status: input.status,
        notes: input.notes ?? null,
        officer_id: officerId,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) throw new Error('Failed to update border crossing');
    return data as unknown as BorderCrossing;
  },

  async getStats(): Promise<Record<string, unknown>> {
    const { data, error } = await supabaseAdmin
      .from('border_crossings')
      .select('status, crossing_type, border_point');

    if (error) throw new Error('Failed to fetch crossing stats');

    const crossings = data ?? [];

    return {
      total: crossings.length,
      byStatus: {
        pending: crossings.filter((c) => c.status === 'pending').length,
        approved: crossings.filter((c) => c.status === 'approved').length,
        denied: crossings.filter((c) => c.status === 'denied').length,
      },
      byType: {
        entry: crossings.filter((c) => c.crossing_type === 'entry').length,
        exit: crossings.filter((c) => c.crossing_type === 'exit').length,
      },
    };
  },
};
