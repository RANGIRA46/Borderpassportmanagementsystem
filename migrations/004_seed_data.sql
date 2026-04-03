-- Migration: 004_seed_data
-- Description: Insert sample/test data for development
-- Run order: 4
-- NOTE: Only runs on development. Comment out if not needed.

-- =============================================
-- Seed Profiles (Users)
-- =============================================

-- Insert sample admin user
INSERT INTO public.profiles (id, email, full_name, phone, role, is_active)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'admin@example.com',
    'Admin User',
    '+250788123456',
    'admin',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample official user
INSERT INTO public.profiles (id, email, full_name, phone, role, is_active)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'official@example.com',
    'Border Official',
    '+250788123457',
    'official',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample citizen users
INSERT INTO public.profiles (id, email, full_name, phone, role, is_active)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440002'::uuid,
        'citizen1@example.com',
        'John Doe',
        '+250788123458',
        'citizen',
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003'::uuid,
        'citizen2@example.com',
        'Jane Smith',
        '+250788123459',
        'citizen',
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440004'::uuid,
        'citizen3@example.com',
        'Robert Johnson',
        '+250788123460',
        'citizen',
        true
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Seed Applications
-- =============================================

-- Insert sample passport applications
INSERT INTO public.applications (id, type, status, applicant_email, applicant_id, form_data, submitted_at)
VALUES
    (
        'PASS-20260402-001',
        'passport',
        'submitted',
        'citizen1@example.com',
        '550e8400-e29b-41d4-a716-446655440002'::uuid,
        '{
            "firstName": "John",
            "lastName": "Doe",
            "dateOfBirth": "1990-05-15",
            "nationality": "Rwandan",
            "placeOfBirth": "Kigali",
            "gender": "M"
        }'::jsonb,
        now() - interval '5 days'
    ),
    (
        'PASS-20260402-002',
        'passport',
        'under_review',
        'citizen2@example.com',
        '550e8400-e29b-41d4-a716-446655440003'::uuid,
        '{
            "firstName": "Jane",
            "lastName": "Smith",
            "dateOfBirth": "1992-08-22",
            "nationality": "Rwandan",
            "placeOfBirth": "Butare",
            "gender": "F"
        }'::jsonb,
        now() - interval '3 days'
    ),
    (
        'VISA-20260402-001',
        'visa',
        'approved',
        'citizen3@example.com',
        '550e8400-e29b-41d4-a716-446655440004'::uuid,
        '{
            "firstName": "Robert",
            "lastName": "Johnson",
            "dateOfBirth": "1988-12-10",
            "nationality": "Rwandan",
            "visitingCountry": "Uganda",
            "purpose": "business"
        }'::jsonb,
        now() - interval '10 days'
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Seed Application Status History
-- =============================================

INSERT INTO public.application_status_history (application_id, status, note, changed_by, changed_at)
VALUES
    (
        'PASS-20260402-001',
        'submitted',
        'Application submitted by citizen',
        '550e8400-e29b-41d4-a716-446655440002'::uuid,
        now() - interval '5 days'
    ),
    (
        'PASS-20260402-002',
        'submitted',
        'Application submitted by citizen',
        '550e8400-e29b-41d4-a716-446655440003'::uuid,
        now() - interval '3 days'
    ),
    (
        'PASS-20260402-002',
        'under_review',
        'Initial review completed, documents verified',
        '550e8400-e29b-41d4-a716-446655440001'::uuid,
        now() - interval '2 days'
    ),
    (
        'VISA-20260402-001',
        'submitted',
        'Application submitted by citizen',
        '550e8400-e29b-41d4-a716-446655440004'::uuid,
        now() - interval '10 days'
    ),
    (
        'VISA-20260402-001',
        'approved',
        'Visa approved',
        '550e8400-e29b-41d4-a716-446655440001'::uuid,
        now() - interval '1 day'
    )
ON CONFLICT DO NOTHING;

-- =============================================
-- Seed Appointments
-- =============================================

INSERT INTO public.appointments (
    id, applicant_email, applicant_id, service_type,
    location, appointment_date, appointment_time,
    first_name, last_name, phone,
    status, booked_at
)
VALUES
    (
        'APT-20260402-001',
        'citizen1@example.com',
        '550e8400-e29b-41d4-a716-446655440002'::uuid,
        'passport_application',
        'Kigali HQ',
        '2026-04-15'::date,
        '09:00',
        'John',
        'Doe',
        '+250788123458',
        'scheduled',
        now() - interval '2 days'
    ),
    (
        'APT-20260402-002',
        'citizen2@example.com',
        '550e8400-e29b-41d4-a716-446655440003'::uuid,
        'biometric_appointment',
        'Butare Center',
        '2026-04-16'::date,
        '10:30',
        'Jane',
        'Smith',
        '+250788123459',
        'scheduled',
        now() - interval '1 day'
    ),
    (
        'APT-20260402-003',
        'citizen3@example.com',
        '550e8400-e29b-41d4-a716-446655440004'::uuid,
        'passport_collection',
        'Kigali HQ',
        '2026-04-20'::date,
        '14:00',
        'Robert',
        'Johnson',
        '+250788123460',
        'scheduled',
        now() - interval '5 days'
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Seed Border Crossings
-- =============================================

INSERT INTO public.border_crossings (document_number, traveller_name, crossing_type, border_post, recorded_by, crossing_time, notes)
VALUES
    (
        'PASS-20260402-001',
        'John Doe',
        'exit',
        'Kigali - Kampala',
        '550e8400-e29b-41d4-a716-446655440001'::uuid,
        now() - interval '1 day',
        'Exit to Uganda for business'
    ),
    (
        'VISA-20260402-001',
        'Robert Johnson',
        'entry',
        'Kigali - Jinja',
        '550e8400-e29b-41d4-a716-446655440001'::uuid,
        now() - interval '3 days',
        'Business visitor from Uganda'
    )
ON CONFLICT DO NOTHING;

-- =============================================
-- Verify Seed Data
-- =============================================

-- Show profiles count
SELECT 'Profiles' as "Table", count(*) as "Count" FROM public.profiles
UNION ALL
SELECT 'Applications', count(*) FROM public.applications
UNION ALL
SELECT 'Appointments', count(*) FROM public.appointments
UNION ALL
SELECT 'Border Crossings', count(*) FROM public.border_crossings;

