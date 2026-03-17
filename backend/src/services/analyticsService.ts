import { supabaseAdmin } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const analyticsService = {
  async getDashboardStats(): Promise<Record<string, unknown>> {
    const [usersResult, passportsResult, crossingsResult, appointmentsResult] =
      await Promise.all([
        supabaseAdmin.from('users').select('role'),
        supabaseAdmin.from('passports').select('status'),
        supabaseAdmin.from('border_crossings').select('status, crossing_type'),
        supabaseAdmin.from('appointments').select('status, appointment_type'),
      ]);

    const users = usersResult.data ?? [];
    const passports = passportsResult.data ?? [];
    const crossings = crossingsResult.data ?? [];
    const appointments = appointmentsResult.data ?? [];

    return {
      users: {
        total: users.length,
        citizens: users.filter((u) => u.role === 'citizen').length,
        officials: users.filter((u) => u.role === 'official').length,
        admins: users.filter((u) => u.role === 'admin').length,
      },
      passports: {
        total: passports.length,
        applied: passports.filter((p) => p.status === 'applied').length,
        under_review: passports.filter((p) => p.status === 'under_review').length,
        approved: passports.filter((p) => p.status === 'approved').length,
        rejected: passports.filter((p) => p.status === 'rejected').length,
      },
      borderCrossings: {
        total: crossings.length,
        pending: crossings.filter((c) => c.status === 'pending').length,
        approved: crossings.filter((c) => c.status === 'approved').length,
        denied: crossings.filter((c) => c.status === 'denied').length,
        entries: crossings.filter((c) => c.crossing_type === 'entry').length,
        exits: crossings.filter((c) => c.crossing_type === 'exit').length,
      },
      appointments: {
        total: appointments.length,
        scheduled: appointments.filter((a) => a.status === 'scheduled').length,
        confirmed: appointments.filter((a) => a.status === 'confirmed').length,
        completed: appointments.filter((a) => a.status === 'completed').length,
        cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      },
    };
  },

  async getUserStats(userId: string): Promise<Record<string, unknown>> {
    const [passportsResult, crossingsResult, appointmentsResult] =
      await Promise.all([
        supabaseAdmin.from('passports').select('status').eq('user_id', userId),
        supabaseAdmin.from('border_crossings').select('status').eq('user_id', userId),
        supabaseAdmin.from('appointments').select('status').eq('user_id', userId),
      ]);

    const passports = passportsResult.data ?? [];
    const crossings = crossingsResult.data ?? [];
    const appointments = appointmentsResult.data ?? [];

    return {
      passports: {
        total: passports.length,
        approved: passports.filter((p) => p.status === 'approved').length,
        pending: passports.filter((p) =>
          ['applied', 'under_review'].includes(p.status as string)
        ).length,
      },
      borderCrossings: {
        total: crossings.length,
        approved: crossings.filter((c) => c.status === 'approved').length,
      },
      appointments: {
        total: appointments.length,
        upcoming: appointments.filter((a) =>
          ['scheduled', 'confirmed'].includes(a.status as string)
        ).length,
      },
    };
  },

  async getPassportStats(): Promise<Record<string, unknown>> {
    const { data, error } = await supabaseAdmin
      .from('passports')
      .select('status, type, created_at');

    if (error) {
      logger.error('Failed to fetch passport stats', error);
      throw new Error('Failed to fetch passport statistics');
    }

    const passports = data ?? [];

    return {
      total: passports.length,
      byStatus: {
        applied: passports.filter((p) => p.status === 'applied').length,
        under_review: passports.filter((p) => p.status === 'under_review').length,
        approved: passports.filter((p) => p.status === 'approved').length,
        rejected: passports.filter((p) => p.status === 'rejected').length,
      },
      byType: {
        regular: passports.filter((p) => p.type === 'regular').length,
        diplomatic: passports.filter((p) => p.type === 'diplomatic').length,
        official: passports.filter((p) => p.type === 'official').length,
      },
    };
  },

  async getBorderCrossingStats(): Promise<Record<string, unknown>> {
    const { data, error } = await supabaseAdmin
      .from('border_crossings')
      .select('status, crossing_type, border_point, crossing_date');

    if (error) {
      logger.error('Failed to fetch crossing stats', error);
      throw new Error('Failed to fetch border crossing statistics');
    }

    const crossings = data ?? [];

    const borderPointCounts: Record<string, number> = {};
    crossings.forEach((c) => {
      const bp = c.border_point as string;
      borderPointCounts[bp] = (borderPointCounts[bp] ?? 0) + 1;
    });

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
      byBorderPoint: borderPointCounts,
    };
  },
};
