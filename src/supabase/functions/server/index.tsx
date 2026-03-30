import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use('*', logger(console.log));

// ==================== SUPABASE CLIENTS ====================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Admin client – bypasses RLS (used for auth operations and admin endpoints)
const adminDb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// User-scoped client factory – respects RLS
function userScopedDb(token: string) {
  return createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
}

// ==================== SHARED UTILITIES ====================

const generateReferenceNumber = (type: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${type.toUpperCase()}-${timestamp}-${random}`;
};

const generateId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

// ==================== APPOINTMENT AVAILABILITY CONFIG ====================

const APPOINTMENT_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];
const APPOINTMENT_SLOT_CAPACITY = Number(Deno.env.get('APPOINTMENT_SLOT_CAPACITY') || '2');

const generateConfirmationCode = (id: string): string =>
  id.toUpperCase().slice(-8);

function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
}

async function getAuthUser(authHeader: string | undefined) {
  const token = extractToken(authHeader);
  if (!token) return null;
  try {
    const { data: { user } } = await adminDb.auth.getUser(token);
    return user ? { user, token } : null;
  } catch {
    return null;
  }
}

// Legacy helper kept for backward-compatible endpoints below
const getUserFromAuth = async (authHeader: string | undefined) => {
  const result = await getAuthUser(authHeader);
  return result ? result.user : null;
};

// ==================== RESPONSE MAPPERS ====================

function mapApplicationToPassportResponse(app: Record<string, unknown>, history: Record<string, unknown>[] = []) {
  const fd = (app.form_data as Record<string, unknown>) || {};
  return {
    id: app.id,
    referenceNumber: app.id,
    applicantId: app.applicant_id || '',
    type: fd.type || 'ordinary',
    status: app.status,
    firstName: fd.firstName || '',
    lastName: fd.lastName || '',
    dateOfBirth: fd.dateOfBirth || '',
    placeOfBirth: fd.placeOfBirth || '',
    nationality: fd.nationality || '',
    gender: fd.gender || '',
    email: app.applicant_email,
    phone: fd.phone || '',
    address: fd.address || '',
    emergencyContact: fd.emergencyContact || null,
    documentIds: (fd.documentIds as string[]) || [],
    statusHistory: history.map((h) => ({
      status: h.status,
      timestamp: h.changed_at,
      note: h.note || undefined,
      updatedBy: h.changed_by || undefined,
    })),
    submittedAt: app.submitted_at,
    lastUpdated: app.last_updated,
    issuedAt: fd.issuedAt || null,
    expiresAt: fd.expiresAt || null,
    passportNumber: fd.passportNumber || null,
  };
}

function mapAppointmentToResponse(row: Record<string, unknown>) {
  const id = String(row.id);
  return {
    id,
    userId: row.applicant_id || undefined,
    serviceType: row.service_type,
    status: row.status,
    date: row.appointment_date,
    time: row.appointment_time,
    locationId: row.location,
    locationName: row.location_name || row.location,
    notes: row.notes || undefined,
    email: row.applicant_email,
    phone: row.phone || '',
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    bookedAt: row.booked_at,
    confirmedAt: row.confirmed_at || undefined,
    completedAt: row.completed_at || undefined,
    cancelledAt: row.cancelled_at || undefined,
    cancellationReason: row.cancellation_reason || undefined,
    confirmationCode: row.confirmation_code || generateConfirmationCode(id),
  };
}

function mapBorderCrossingToResponse(row: Record<string, unknown>) {
  return {
    id: row.id,
    travelerId: row.traveller_name || '',
    passportNumber: row.document_number,
    crossingType: row.crossing_type,
    status: 'cleared',
    borderPostId: row.border_post,
    borderPostName: row.border_post,
    purposeOfTravel: row.notes || undefined,
    destinationCountry: undefined,
    originCountry: undefined,
    crossedAt: row.crossing_time,
    recordedBy: row.recorded_by || undefined,
    notes: row.notes || undefined,
  };
}

function buildUserProfileResponse(
  user: { id: string; email?: string; created_at: string; user_metadata?: Record<string, unknown> },
  profile: { full_name?: string; role?: string; phone?: string; is_active?: boolean } | null
) {
  const meta = user.user_metadata || {};
  const nameParts = (profile?.full_name || '').split(' ');
  const firstName = String(meta.firstName || nameParts[0] || '');
  const lastName = String(meta.lastName || nameParts.slice(1).join(' ') || '');
  const dbRole = profile?.role ?? 'citizen';
  const role = dbRole === 'admin' ? 'admin' : dbRole === 'official' ? 'officer' : 'customer';
  return { firstName, lastName, role };
}

// ==================== HEALTH CHECK ====================

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/make-server-8ee81f4f/health', (c) =>
  c.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ==================== AUTH ROUTES ====================

app.post('/auth/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firstName, lastName, phone, nationality, userType } = body;
    if (!email || !password || !firstName || !lastName) {
      return c.json({ message: 'email, password, firstName and lastName are required' }, 400);
    }

    const { data, error } = await adminDb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { firstName, lastName, phone, nationality },
    });
    if (error) return c.json({ message: error.message }, 400);

    const userId = data.user!.id;
    await adminDb.from('profiles').update({
      full_name: `${firstName} ${lastName}`,
      phone: phone || null,
      role: userType === 'admin' ? 'admin' : 'citizen',
    }).eq('id', userId);

    const { data: signIn, error: signInErr } = await adminDb.auth.signInWithPassword({ email, password });
    if (signInErr || !signIn.session) {
      return c.json({ message: 'Account created but sign-in failed' }, 500);
    }

    const { data: profile } = await adminDb.from('profiles').select('*').eq('id', userId).maybeSingle();
    const { firstName: fn, lastName: ln, role } = buildUserProfileResponse(signIn.user!, profile);

    return c.json({
      user: {
        id: userId,
        email: signIn.user!.email!,
        firstName: fn,
        lastName: ln,
        role,
        permissions: [],
        createdAt: signIn.user!.created_at,
        status: 'active',
      },
      token: signIn.session.access_token,
      refreshToken: signIn.session.refresh_token,
      expiresAt: new Date(signIn.session.expires_at! * 1000).toISOString(),
    }, 201);
  } catch (err) {
    console.log('Register error:', err);
    return c.json({ message: 'Registration failed' }, 500);
  }
});

app.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ message: 'email and password are required' }, 400);
    }

    const { data, error } = await adminDb.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return c.json({ message: error?.message || 'Invalid credentials' }, 401);
    }

    const { data: profile } = await adminDb.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
    const { firstName, lastName, role } = buildUserProfileResponse(data.user, profile);

    return c.json({
      user: {
        id: data.user.id,
        email: data.user.email!,
        firstName,
        lastName,
        role,
        permissions: [],
        createdAt: data.user.created_at,
        lastLogin: new Date().toISOString(),
        status: profile?.is_active !== false ? 'active' : 'suspended',
      },
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: new Date(data.session.expires_at! * 1000).toISOString(),
    });
  } catch (err) {
    console.log('Login error:', err);
    return c.json({ message: 'Login failed' }, 500);
  }
});

app.post('/auth/logout', async (c) => {
  try {
    const token = extractToken(c.req.header('Authorization'));
    if (token) {
      await userScopedDb(token).auth.signOut();
    }
  } catch {
    // Logout always succeeds from the client's perspective
  }
  return c.json({ success: true });
});

app.post('/auth/refresh-token', async (c) => {
  try {
    const { refreshToken } = await c.req.json();
    if (!refreshToken) return c.json({ message: 'refreshToken is required' }, 400);

    const tempClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data, error } = await tempClient.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) {
      return c.json({ message: 'Invalid or expired refresh token' }, 401);
    }

    const { data: profile } = await adminDb.from('profiles').select('*').eq('id', data.user!.id).maybeSingle();
    const { firstName, lastName, role } = buildUserProfileResponse(data.user!, profile);

    return c.json({
      user: {
        id: data.user!.id,
        email: data.user!.email!,
        firstName,
        lastName,
        role,
        permissions: [],
        createdAt: data.user!.created_at,
        status: 'active',
      },
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: new Date(data.session.expires_at! * 1000).toISOString(),
    });
  } catch (err) {
    console.log('Refresh token error:', err);
    return c.json({ message: 'Token refresh failed' }, 500);
  }
});

app.get('/auth/me', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const { data: profile } = await adminDb.from('profiles').select('*').eq('id', auth.user.id).maybeSingle();
    const { firstName, lastName, role } = buildUserProfileResponse(auth.user, profile);

    return c.json({
      id: auth.user.id,
      email: auth.user.email!,
      firstName,
      lastName,
      role,
      permissions: [],
      createdAt: auth.user.created_at,
      lastLogin: new Date().toISOString(),
      status: profile?.is_active !== false ? 'active' : 'suspended',
    });
  } catch (err) {
    console.log('GetMe error:', err);
    return c.json({ message: 'Failed to get user' }, 500);
  }
});

app.post('/auth/change-password', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const { currentPassword, newPassword } = await c.req.json();
    if (!currentPassword || !newPassword) {
      return c.json({ message: 'currentPassword and newPassword are required' }, 400);
    }

    // Verify current password before changing
    const { error: verifyErr } = await adminDb.auth.signInWithPassword({
      email: auth.user.email!,
      password: currentPassword,
    });
    if (verifyErr) return c.json({ message: 'Current password is incorrect' }, 400);

    const { error } = await adminDb.auth.admin.updateUserById(auth.user.id, { password: newPassword });
    if (error) return c.json({ message: error.message }, 400);

    return c.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.log('Change password error:', err);
    return c.json({ message: 'Failed to change password' }, 500);
  }
});

// ==================== PASSPORT / APPLICATION ROUTES ====================

app.get('/passports', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const page = Math.max(1, Number(c.req.query('page') || '1'));
    const limit = Math.min(100, Math.max(1, Number(c.req.query('limit') || '10')));
    const status = c.req.query('status');
    const search = c.req.query('search');

    const { data: profile } = await adminDb.from('profiles').select('role').eq('id', auth.user.id).maybeSingle();
    const isPrivileged = profile?.role === 'admin' || profile?.role === 'official';

    let query = adminDb.from('applications').select('*', { count: 'exact' }).eq('type', 'passport');
    if (!isPrivileged) query = query.eq('applicant_id', auth.user.id);
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('applicant_email', `%${search}%`);

    const offset = (page - 1) * limit;
    const { data: apps, error, count } = await query
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);
    return c.json({
      data: (apps || []).map((a) => mapApplicationToPassportResponse(a)),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  } catch (err) {
    console.log('List passports error:', err);
    return c.json({ message: 'Failed to list applications' }, 500);
  }
});

app.post('/passports', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    const body = await c.req.json();
    const refNumber = generateReferenceNumber('PASS');

    const { data: app, error } = await adminDb.from('applications').insert({
      id: refNumber,
      type: 'passport',
      status: 'submitted',
      applicant_email: body.email,
      applicant_id: auth?.user.id || null,
      form_data: body,
      is_emergency: false,
    }).select().single();
    if (error) throw error;

    await adminDb.from('application_status_history').insert({
      application_id: refNumber,
      status: 'submitted',
      note: 'Application submitted successfully',
      changed_by: auth?.user.id || null,
    });

    return c.json(mapApplicationToPassportResponse(app), 201);
  } catch (err) {
    console.log('Create passport error:', err);
    return c.json({ message: 'Failed to submit application' }, 500);
  }
});

app.get('/passports/:id', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const { data: app, error } = await adminDb.from('applications')
      .select('*').eq('id', id).eq('type', 'passport').maybeSingle();
    if (error) throw error;
    if (!app) return c.json({ message: 'Application not found' }, 404);

    const { data: history } = await adminDb.from('application_status_history')
      .select('*').eq('application_id', id).order('changed_at', { ascending: true });

    return c.json(mapApplicationToPassportResponse(app, history || []));
  } catch (err) {
    console.log('Get passport error:', err);
    return c.json({ message: 'Failed to get application' }, 500);
  }
});

app.put('/passports/:id', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const body = await c.req.json();

    const { data: existing } = await adminDb.from('applications').select('*').eq('id', id).maybeSingle();
    if (!existing) return c.json({ message: 'Application not found' }, 404);

    const updatedFormData = { ...(existing.form_data || {}), ...body };
    const updatePayload: Record<string, unknown> = {
      form_data: updatedFormData,
      last_updated: new Date().toISOString(),
    };
    if (body.status) updatePayload.status = body.status;

    const { data: updated, error } = await adminDb.from('applications')
      .update(updatePayload).eq('id', id).select().single();
    if (error) throw error;

    if (body.status && body.status !== existing.status) {
      await adminDb.from('application_status_history').insert({
        application_id: id,
        status: body.status,
        note: body.note || `Status updated to ${body.status}`,
        changed_by: auth.user.id,
      });
    }

    const { data: history } = await adminDb.from('application_status_history')
      .select('*').eq('application_id', id).order('changed_at', { ascending: true });

    return c.json(mapApplicationToPassportResponse(updated, history || []));
  } catch (err) {
    console.log('Update passport error:', err);
    return c.json({ message: 'Failed to update application' }, 500);
  }
});

app.delete('/passports/:id', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const { error } = await adminDb.from('applications').update({
      status: 'rejected',
      last_updated: new Date().toISOString(),
    }).eq('id', id);
    if (error) throw error;

    await adminDb.from('application_status_history').insert({
      application_id: id,
      status: 'rejected',
      note: 'Application cancelled by applicant',
      changed_by: auth.user.id,
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    console.log('Delete passport error:', err);
    return c.json({ message: 'Failed to cancel application' }, 500);
  }
});

app.get('/passports/:id/history', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const { data: history, error } = await adminDb.from('application_status_history')
      .select('*').eq('application_id', id).order('changed_at', { ascending: true });
    if (error) throw error;

    return c.json((history || []).map((h) => ({
      status: h.status,
      timestamp: h.changed_at,
      note: h.note || undefined,
      updatedBy: h.changed_by || undefined,
    })));
  } catch (err) {
    console.log('Get passport history error:', err);
    return c.json({ message: 'Failed to get history' }, 500);
  }
});

app.post('/passports/:id/upload-document', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;
    const documentType = String(formData.get('documentType') || 'other');
    if (!file) return c.json({ message: 'file is required' }, 400);

    const documentId = generateId('doc');
    const storagePath = `documents/${id}/${documentId}-${file.name}`;

    const fileBytes = await file.arrayBuffer();
    await adminDb.storage.from('documents').upload(storagePath, fileBytes, {
      contentType: file.type,
      upsert: false,
    });

    const { error: dbError } = await adminDb.from('documents').insert({
      id: documentId,
      application_id: id,
      document_type: documentType,
      file_name: file.name,
      file_size: file.size,
      storage_path: storagePath,
      uploaded_by: auth.user.email!,
      status: 'uploaded',
    });
    if (dbError) throw dbError;

    return c.json({ documentId, message: 'Document uploaded successfully' }, 201);
  } catch (err) {
    console.log('Upload document error:', err);
    return c.json({ message: 'Failed to upload document' }, 500);
  }
});

// ==================== APPOINTMENT ROUTES ====================

app.get('/appointments', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const page = Math.max(1, Number(c.req.query('page') || '1'));
    const limit = Math.min(100, Math.max(1, Number(c.req.query('limit') || '10')));
    const status = c.req.query('status');

    const { data: profile } = await adminDb.from('profiles').select('role').eq('id', auth.user.id).maybeSingle();
    const isPrivileged = profile?.role === 'admin' || profile?.role === 'official';

    let query = adminDb.from('appointments').select('*', { count: 'exact' });
    if (!isPrivileged) query = query.eq('applicant_id', auth.user.id);
    if (status) query = query.eq('status', status);

    const offset = (page - 1) * limit;
    const { data: rows, error, count } = await query
      .order('appointment_date', { ascending: true })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);
    return c.json({
      data: (rows || []).map(mapAppointmentToResponse),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  } catch (err) {
    console.log('List appointments error:', err);
    return c.json({ message: 'Failed to list appointments' }, 500);
  }
});

// NOTE: /appointments/availability must be registered before /appointments/:id
app.get('/appointments/availability', async (c) => {
  try {
    const locationId = c.req.query('locationId');
    const serviceType = c.req.query('serviceType');
    const startDate = c.req.query('startDate') || new Date().toISOString().split('T')[0];
    const endDate = c.req.query('endDate') ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let query = adminDb.from('appointments')
      .select('appointment_date, appointment_time, location')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .in('status', ['scheduled', 'confirmed']);
    if (locationId) query = query.eq('location', locationId);
    if (serviceType) query = query.eq('service_type', serviceType);
    const { data: booked } = await query;

    const TIME_SLOTS = APPOINTMENT_TIME_SLOTS;
    const CAPACITY = APPOINTMENT_SLOT_CAPACITY;
    const slots: unknown[] = [];

    const current = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    while (current <= end) {
      const dow = current.getUTCDay();
      if (dow !== 0 && dow !== 6) {
        const dateStr = current.toISOString().split('T')[0];
        for (const time of TIME_SLOTS) {
          const bookedCount = (booked || []).filter(
            (b) => b.appointment_date === dateStr && b.appointment_time === time
          ).length;
          slots.push({
            date: dateStr,
            time,
            available: bookedCount < CAPACITY,
            locationId: locationId || 'main-office',
            locationName: locationId || 'Main Office',
            capacity: CAPACITY,
            booked: bookedCount,
          });
        }
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }

    return c.json(slots);
  } catch (err) {
    console.log('Availability error:', err);
    return c.json({ message: 'Failed to get availability' }, 500);
  }
});

app.post('/appointments', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    const body = await c.req.json();
    if (!body.email || !body.preferredDate || !body.preferredTime) {
      return c.json({ message: 'email, preferredDate and preferredTime are required' }, 400);
    }

    const locationKey = body.locationId || body.locationName;

    // Check slot availability before booking to prevent double-booking
    const { count: bookedCount } = await adminDb.from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('appointment_date', body.preferredDate)
      .eq('appointment_time', body.preferredTime)
      .eq('location', locationKey)
      .in('status', ['scheduled', 'confirmed']);

    if ((bookedCount ?? 0) >= APPOINTMENT_SLOT_CAPACITY) {
      return c.json({ message: 'The requested time slot is no longer available' }, 409);
    }

    const id = generateId('apt');

    const { data: row, error } = await adminDb.from('appointments').insert({
      id,
      applicant_email: body.email,
      applicant_id: auth?.user.id || null,
      service_type: body.serviceType,
      location: locationKey,
      location_name: body.locationName,
      appointment_date: body.preferredDate,
      appointment_time: body.preferredTime,
      notes: body.notes || null,
      phone: body.phone || null,
      first_name: body.firstName || null,
      last_name: body.lastName || null,
      confirmation_code: generateConfirmationCode(id),
      status: 'scheduled',
    }).select().single();
    if (error) throw error;

    return c.json(mapAppointmentToResponse(row), 201);
  } catch (err) {
    console.log('Create appointment error:', err);
    return c.json({ message: 'Failed to book appointment' }, 500);
  }
});

app.get('/appointments/:id', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const { data: row, error } = await adminDb.from('appointments').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!row) return c.json({ message: 'Appointment not found' }, 404);

    return c.json(mapAppointmentToResponse(row));
  } catch (err) {
    console.log('Get appointment error:', err);
    return c.json({ message: 'Failed to get appointment' }, 500);
  }
});

app.put('/appointments/:id', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const body = await c.req.json();

    const updatePayload: Record<string, unknown> = {};
    if (body.serviceType) updatePayload.service_type = body.serviceType;
    if (body.preferredDate) updatePayload.appointment_date = body.preferredDate;
    if (body.preferredTime) updatePayload.appointment_time = body.preferredTime;
    if (body.locationId) updatePayload.location = body.locationId;
    if (body.locationName) updatePayload.location_name = body.locationName;
    if (body.notes !== undefined) updatePayload.notes = body.notes;
    if (body.status) {
      updatePayload.status = body.status;
      if (body.status === 'confirmed') updatePayload.confirmed_at = new Date().toISOString();
      else if (body.status === 'completed') updatePayload.completed_at = new Date().toISOString();
      else if (body.status === 'cancelled') {
        updatePayload.cancelled_at = new Date().toISOString();
        if (body.cancellationReason) updatePayload.cancellation_reason = body.cancellationReason;
      }
    }

    const { data: row, error } = await adminDb.from('appointments')
      .update(updatePayload).eq('id', id).select().single();
    if (error) throw error;

    return c.json(mapAppointmentToResponse(row));
  } catch (err) {
    console.log('Update appointment error:', err);
    return c.json({ message: 'Failed to update appointment' }, 500);
  }
});

app.delete('/appointments/:id', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const reason = c.req.query('reason');

    const updatePayload: Record<string, unknown> = {
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    };
    if (reason) updatePayload.cancellation_reason = reason;

    const { error } = await adminDb.from('appointments').update(updatePayload).eq('id', id);
    if (error) throw error;

    return new Response(null, { status: 204 });
  } catch (err) {
    console.log('Cancel appointment error:', err);
    return c.json({ message: 'Failed to cancel appointment' }, 500);
  }
});

// ==================== BORDER CROSSING ROUTES ====================

app.get('/border-crossings', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const page = Math.max(1, Number(c.req.query('page') || '1'));
    const limit = Math.min(100, Math.max(1, Number(c.req.query('limit') || '10')));
    const offset = (page - 1) * limit;

    const { data: rows, error, count } = await adminDb.from('border_crossings')
      .select('*', { count: 'exact' })
      .order('crossing_time', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);
    return c.json({
      data: (rows || []).map(mapBorderCrossingToResponse),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  } catch (err) {
    console.log('List border crossings error:', err);
    return c.json({ message: 'Failed to list border crossings' }, 500);
  }
});

app.post('/border-crossings', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const body = await c.req.json();
    const { data: row, error } = await adminDb.from('border_crossings').insert({
      document_number: body.passportNumber,
      traveller_name: body.travelerId,
      crossing_type: body.crossingType,
      border_post: body.borderPostName || body.borderPostId,
      crossing_time: new Date().toISOString(),
      recorded_by: auth.user.id,
      notes: body.purposeOfTravel || null,
    }).select().single();
    if (error) throw error;

    return c.json(mapBorderCrossingToResponse(row), 201);
  } catch (err) {
    console.log('Create border crossing error:', err);
    return c.json({ message: 'Failed to record border crossing' }, 500);
  }
});

app.get('/border-crossings/:id', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const { data: row, error } = await adminDb.from('border_crossings').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!row) return c.json({ message: 'Border crossing not found' }, 404);

    return c.json(mapBorderCrossingToResponse(row));
  } catch (err) {
    console.log('Get border crossing error:', err);
    return c.json({ message: 'Failed to get border crossing' }, 500);
  }
});

// ==================== DASHBOARD ROUTES ====================

app.get('/dashboard/user-stats', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const userId = auth.user.id;
    const [appsRes, aptsRes] = await Promise.all([
      adminDb.from('applications').select('status').eq('applicant_id', userId),
      adminDb.from('appointments').select('status').eq('applicant_id', userId),
    ]);

    const apps = appsRes.data || [];
    const apts = aptsRes.data || [];
    const PENDING = ['submitted', 'under_review', 'awaiting_documents'];
    const APPROVED = ['approved', 'ready_for_collection'];

    return c.json({
      totalApplications: apps.length,
      pendingApplications: apps.filter((a) => PENDING.includes(a.status)).length,
      approvedApplications: apps.filter((a) => APPROVED.includes(a.status)).length,
      rejectedApplications: apps.filter((a) => a.status === 'rejected').length,
      upcomingAppointments: apts.filter((a) => ['scheduled', 'confirmed'].includes(a.status)).length,
      borderCrossings: 0,
    });
  } catch (err) {
    console.log('User stats error:', err);
    return c.json({ message: 'Failed to get user statistics' }, 500);
  }
});

app.get('/dashboard/applications-status', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const { data: apps } = await adminDb.from('applications')
      .select('status').eq('applicant_id', auth.user.id);

    const counts = { submitted: 0, underReview: 0, approved: 0, rejected: 0, issued: 0, draft: 0 };
    (apps || []).forEach((a) => {
      if (a.status === 'submitted') counts.submitted++;
      else if (a.status === 'under_review' || a.status === 'awaiting_documents') counts.underReview++;
      else if (a.status === 'approved' || a.status === 'ready_for_collection') counts.approved++;
      else if (a.status === 'rejected') counts.rejected++;
    });

    return c.json(counts);
  } catch (err) {
    console.log('Applications status error:', err);
    return c.json({ message: 'Failed to get applications status' }, 500);
  }
});

app.get('/dashboard/admin-stats', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const today = new Date().toISOString().split('T')[0];
    const [profilesRes, appsRes, aptsRes, crossingsRes] = await Promise.all([
      adminDb.from('profiles').select('id, is_active'),
      adminDb.from('applications').select('id, status, submitted_at'),
      adminDb.from('appointments').select('id, status'),
      adminDb.from('border_crossings').select('id').gte('crossing_time', `${today}T00:00:00Z`),
    ]);

    const profiles = profilesRes.data || [];
    const apps = appsRes.data || [];
    const apts = aptsRes.data || [];
    const crossings = crossingsRes.data || [];
    const PENDING = ['submitted', 'under_review', 'awaiting_documents'];

    return c.json({
      totalUsers: profiles.length,
      activeUsers: profiles.filter((p) => p.is_active !== false).length,
      totalApplications: apps.length,
      pendingApplications: apps.filter((a) => PENDING.includes(a.status)).length,
      processedToday: apps.filter((a) => a.submitted_at?.startsWith(today)).length,
      borderCrossingsToday: crossings.length,
      totalAppointments: apts.length,
      scheduledAppointments: apts.filter((a) => ['scheduled', 'confirmed'].includes(a.status)).length,
      systemHealth: 'healthy',
    });
  } catch (err) {
    console.log('Admin stats error:', err);
    return c.json({ message: 'Failed to get admin statistics' }, 500);
  }
});

app.get('/dashboard/border-analytics', async (c) => {
  try {
    const auth = await getAuthUser(c.req.header('Authorization'));
    if (!auth) return c.json({ message: 'Unauthorized' }, 401);

    const { data: rows } = await adminDb.from('border_crossings')
      .select('crossing_type, border_post, crossing_time, notes')
      .order('crossing_time', { ascending: false })
      .limit(1000);

    const crossings = rows || [];
    const byPost: Record<string, number> = {};
    const dailyMap: Record<string, { entries: number; exits: number }> = {};

    crossings.forEach((r) => {
      byPost[r.border_post] = (byPost[r.border_post] || 0) + 1;
      const date = String(r.crossing_time).split('T')[0];
      if (!dailyMap[date]) dailyMap[date] = { entries: 0, exits: 0 };
      if (r.crossing_type === 'entry') dailyMap[date].entries++;
      else dailyMap[date].exits++;
    });

    return c.json({
      totalCrossings: crossings.length,
      entriesCount: crossings.filter((r) => r.crossing_type === 'entry').length,
      exitsCount: crossings.filter((r) => r.crossing_type === 'exit').length,
      flaggedCount: 0,
      crossingsByPost: Object.entries(byPost).map(([name, count]) => ({ name, count })),
      crossingsByPurpose: [],
      dailyTrend: Object.entries(dailyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-7)
        .map(([date, counts]) => ({ date, ...counts })),
    });
  } catch (err) {
    console.log('Border analytics error:', err);
    return c.json({ message: 'Failed to get border analytics' }, 500);
  }
});

// ==================== APPLICATION SUBMISSION ENDPOINTS ====================

// Submit passport application
app.post('/make-server-8ee81f4f/applications/passport', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('PASS');
    
    const application = {
      id: referenceNumber,
      type: 'passport',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'passport',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Passport application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Passport application submitted successfully',
      estimatedProcessingTime: '10-15 business days'
    });
  } catch (error) {
    console.log('Error submitting passport application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit visa application
app.post('/make-server-8ee81f4f/applications/visa', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('VISA');
    
    const application = {
      id: referenceNumber,
      type: 'visa',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Visa application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'visa',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Visa application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Visa application submitted successfully',
      estimatedProcessingTime: '5-10 business days'
    });
  } catch (error) {
    console.log('Error submitting visa application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit permit application
app.post('/make-server-8ee81f4f/applications/permit', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('PERM');
    
    const application = {
      id: referenceNumber,
      type: 'permit',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Permit application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'permit',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Permit application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Permit application submitted successfully',
      estimatedProcessingTime: '10-15 business days'
    });
  } catch (error) {
    console.log('Error submitting permit application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit citizenship application
app.post('/make-server-8ee81f4f/applications/citizenship', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('CITZ');
    
    const application = {
      id: referenceNumber,
      type: 'citizenship',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Citizenship application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'citizenship',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Citizenship application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Citizenship application submitted successfully',
      estimatedProcessingTime: '6-12 months'
    });
  } catch (error) {
    console.log('Error submitting citizenship application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit laissez-passer application
app.post('/make-server-8ee81f4f/applications/laissez-passer', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('LP');
    
    const processingTime = formData.isEmergency ? '24-48 hours' : '3-5 business days';
    
    const application = {
      id: referenceNumber,
      type: 'laissez-passer',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isEmergency: formData.isEmergency,
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: formData.isEmergency ? 'Emergency application submitted' : 'Application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'laissez-passer',
      status: 'submitted',
      submittedAt: application.submittedAt,
      isEmergency: formData.isEmergency
    }));

    console.log(`Laissez-passer application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Emergency travel document application submitted successfully',
      estimatedProcessingTime: processingTime
    });
  } catch (error) {
    console.log('Error submitting laissez-passer application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit refugee services request
app.post('/make-server-8ee81f4f/applications/refugee', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('REF');
    
    const application = {
      id: referenceNumber,
      type: 'refugee',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Refugee service request submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'refugee',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Refugee services request submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Refugee service request submitted successfully',
      nextSteps: 'A case worker will contact you within 48 hours'
    });
  } catch (error) {
    console.log('Error submitting refugee services request:', error);
    return c.json({ error: 'Failed to submit request' }, 500);
  }
});

// Submit diaspora services request
app.post('/make-server-8ee81f4f/applications/diaspora', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('DIAS');
    
    const application = {
      id: referenceNumber,
      type: 'diaspora',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Diaspora service request submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'diaspora',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Diaspora services request submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Diaspora service request submitted successfully',
      nextSteps: 'Our diaspora team will contact you within 48 hours'
    });
  } catch (error) {
    console.log('Error submitting diaspora services request:', error);
    return c.json({ error: 'Failed to submit request' }, 500);
  }
});

// ==================== APPLICATION STATUS & TRACKING ====================

// Get application status by reference number
app.get('/make-server-8ee81f4f/applications/status/:refNumber', async (c) => {
  try {
    const refNumber = c.req.param('refNumber');
    
    const applicationData = await kv.get(`application:${refNumber}`);
    if (!applicationData) {
      return c.json({ error: 'Application not found' }, 404);
    }

    const application = JSON.parse(applicationData);
    
    return c.json({
      success: true,
      application: {
        referenceNumber: application.id,
        type: application.type,
        status: application.status,
        submittedAt: application.submittedAt,
        lastUpdated: application.lastUpdated,
        statusHistory: application.statusHistory,
        isEmergency: application.isEmergency || false
      }
    });
  } catch (error) {
    console.log('Error fetching application status:', error);
    return c.json({ error: 'Failed to fetch status' }, 500);
  }
});

// Get all applications for a user by email
app.get('/make-server-8ee81f4f/applications/user/:email', async (c) => {
  try {
    const email = c.req.param('email');
    
    const userApplications = await kv.getByPrefix(`user_applications:${email}:`);
    
    const applications = userApplications.map(app => JSON.parse(app.value));
    
    return c.json({
      success: true,
      applications: applications.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
    });
  } catch (error) {
    console.log('Error fetching user applications:', error);
    return c.json({ error: 'Failed to fetch applications' }, 500);
  }
});

// Update application status (for admin use)
app.put('/make-server-8ee81f4f/applications/:refNumber/status', async (c) => {
  try {
    const refNumber = c.req.param('refNumber');
    const { status, note } = await c.req.json();
    
    const applicationData = await kv.get(`application:${refNumber}`);
    if (!applicationData) {
      return c.json({ error: 'Application not found' }, 404);
    }

    const application = JSON.parse(applicationData);
    
    // Update application
    application.status = status;
    application.lastUpdated = new Date().toISOString();
    application.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`
    });

    await kv.set(`application:${refNumber}`, JSON.stringify(application));
    
    // Update user application list
    const userApp = await kv.get(`user_applications:${application.formData.email}:${refNumber}`);
    if (userApp) {
      const userAppData = JSON.parse(userApp);
      userAppData.status = status;
      await kv.set(`user_applications:${application.formData.email}:${refNumber}`, JSON.stringify(userAppData));
    }

    console.log(`Application ${refNumber} status updated to ${status}`);

    return c.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.log('Error updating application status:', error);
    return c.json({ error: 'Failed to update status' }, 500);
  }
});

// ==================== SYSTEM STATISTICS & ANALYTICS ====================

// Get system statistics
app.get('/make-server-8ee81f4f/statistics', async (c) => {
  try {
    const allApplications = await kv.getByPrefix('application:');
    
    const stats = {
      totalApplications: allApplications.length,
      applicationsByType: {},
      applicationsByStatus: {},
      emergencyApplications: 0,
      applicationsToday: 0,
      applicationsThisWeek: 0
    };

    const today = new Date().toDateString();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    allApplications.forEach(app => {
      const application = JSON.parse(app.value);
      
      // Count by type
      stats.applicationsByType[application.type] = (stats.applicationsByType[application.type] || 0) + 1;
      
      // Count by status
      stats.applicationsByStatus[application.status] = (stats.applicationsByStatus[application.status] || 0) + 1;
      
      // Count emergency applications
      if (application.isEmergency) {
        stats.emergencyApplications++;
      }
      
      // Count today's applications
      const appDate = new Date(application.submittedAt);
      if (appDate.toDateString() === today) {
        stats.applicationsToday++;
      }
      
      // Count this week's applications
      if (appDate >= oneWeekAgo) {
        stats.applicationsThisWeek++;
      }
    });

    return c.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.log('Error fetching statistics:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// ==================== DOCUMENT MANAGEMENT ====================

// Save document metadata
app.post('/make-server-8ee81f4f/documents', async (c) => {
  try {
    const { applicationRef, documentType, fileName, fileSize, uploadedBy } = await c.req.json();
    
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const document = {
      id: documentId,
      applicationRef,
      documentType,
      fileName,
      fileSize,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded'
    };

    await kv.set(`document:${documentId}`, JSON.stringify(document));
    await kv.set(`app_documents:${applicationRef}:${documentId}`, JSON.stringify(document));

    console.log(`Document uploaded for application ${applicationRef}: ${fileName}`);

    return c.json({
      success: true,
      documentId,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.log('Error saving document metadata:', error);
    return c.json({ error: 'Failed to save document' }, 500);
  }
});

// Get documents for an application
app.get('/make-server-8ee81f4f/applications/:refNumber/documents', async (c) => {
  try {
    const refNumber = c.req.param('refNumber');
    
    const documents = await kv.getByPrefix(`app_documents:${refNumber}:`);
    
    const documentList = documents.map(doc => JSON.parse(doc.value));
    
    return c.json({
      success: true,
      documents: documentList.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
    });
  } catch (error) {
    console.log('Error fetching documents:', error);
    return c.json({ error: 'Failed to fetch documents' }, 500);
  }
});

// ==================== APPOINTMENT MANAGEMENT ====================

// Book appointment
app.post('/make-server-8ee81f4f/appointments', async (c) => {
  try {
    const appointmentData = await c.req.json();
    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const appointment = {
      id: appointmentId,
      ...appointmentData,
      status: 'scheduled',
      bookedAt: new Date().toISOString(),
      confirmationSent: false
    };

    await kv.set(`appointment:${appointmentId}`, JSON.stringify(appointment));
    await kv.set(`user_appointments:${appointmentData.email}:${appointmentId}`, JSON.stringify(appointment));

    console.log(`Appointment booked: ${appointmentId}`);

    return c.json({
      success: true,
      appointmentId,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.log('Error booking appointment:', error);
    return c.json({ error: 'Failed to book appointment' }, 500);
  }
});

// Get user appointments
app.get('/make-server-8ee81f4f/appointments/user/:email', async (c) => {
  try {
    const email = c.req.param('email');
    
    const appointments = await kv.getByPrefix(`user_appointments:${email}:`);
    
    const appointmentList = appointments.map(apt => JSON.parse(apt.value));
    
    return c.json({
      success: true,
      appointments: appointmentList.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    });
  } catch (error) {
    console.log('Error fetching appointments:', error);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});

console.log('Border & Immigration Management Server started successfully');

Deno.serve(app.fetch);