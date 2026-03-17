-- Migration: 001_initial_schema
-- Description: Creates the core tables for the Border/Passport Management System
-- Run order: 1

-- =============================================
-- Extensions
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Users / Profiles
-- =============================================
-- Supabase Auth manages authentication.
-- This table stores additional profile information.
CREATE TABLE IF NOT EXISTS public.profiles (
    id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email        TEXT NOT NULL,
    full_name    TEXT,
    phone        TEXT,
    role         TEXT NOT NULL DEFAULT 'citizen'
                     CHECK (role IN ('citizen', 'official', 'admin')),
    is_active    BOOLEAN NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automatically create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Applications
-- =============================================
CREATE TABLE IF NOT EXISTS public.applications (
    id               TEXT PRIMARY KEY,                -- e.g. PASS-1700000000000-123
    type             TEXT NOT NULL
                         CHECK (type IN (
                             'passport', 'visa', 'permit', 'citizenship',
                             'laissez-passer', 'refugee', 'diaspora'
                         )),
    status           TEXT NOT NULL DEFAULT 'submitted'
                         CHECK (status IN (
                             'submitted', 'under_review', 'awaiting_documents',
                             'approved', 'rejected', 'ready_for_collection'
                         )),
    applicant_email  TEXT NOT NULL,
    applicant_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    form_data        JSONB NOT NULL DEFAULT '{}',
    is_emergency     BOOLEAN NOT NULL DEFAULT false,
    submitted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_updated     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- Application Status History (audit trail)
-- =============================================
CREATE TABLE IF NOT EXISTS public.application_status_history (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id   TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    status           TEXT NOT NULL,
    note             TEXT,
    changed_by       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changed_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- Documents
-- =============================================
CREATE TABLE IF NOT EXISTS public.documents (
    id               TEXT PRIMARY KEY,               -- doc_<timestamp>_<random>
    application_id   TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    document_type    TEXT NOT NULL,                  -- e.g. national_id, birth_certificate
    file_name        TEXT NOT NULL,
    file_size        BIGINT NOT NULL,
    storage_path     TEXT,                           -- Supabase Storage path
    uploaded_by      TEXT NOT NULL,                  -- email
    uploaded_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    status           TEXT NOT NULL DEFAULT 'uploaded'
                         CHECK (status IN ('uploaded', 'verified', 'rejected'))
);

-- =============================================
-- Appointments
-- =============================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id               TEXT PRIMARY KEY,               -- apt_<timestamp>_<random>
    applicant_email  TEXT NOT NULL,
    applicant_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    service_type     TEXT NOT NULL,
    location         TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    notes            TEXT,
    status           TEXT NOT NULL DEFAULT 'scheduled'
                         CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    booked_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- Border Crossings
-- =============================================
CREATE TABLE IF NOT EXISTS public.border_crossings (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_number  TEXT NOT NULL,
    traveller_name   TEXT,
    crossing_type    TEXT NOT NULL CHECK (crossing_type IN ('entry', 'exit')),
    border_post      TEXT NOT NULL,
    crossing_time    TIMESTAMPTZ NOT NULL DEFAULT now(),
    recorded_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes            TEXT
);

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.border_crossings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read and update their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admins and officials can view all profiles
CREATE POLICY "Officials can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('official', 'admin')
        )
    );

-- Applications: citizens see their own, officials/admins see all
CREATE POLICY "Citizens can view own applications"
    ON public.applications FOR SELECT
    USING (applicant_id = auth.uid());

CREATE POLICY "Officials can view all applications"
    ON public.applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('official', 'admin')
        )
    );

CREATE POLICY "Citizens can create applications"
    ON public.applications FOR INSERT
    WITH CHECK (true); -- reference number lookup by email also needs no-auth path

-- Documents follow application ownership
CREATE POLICY "Application owner can view documents"
    ON public.documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.applications a
            WHERE a.id = application_id AND a.applicant_id = auth.uid()
        )
    );

-- Appointments: users see their own
CREATE POLICY "Users can view own appointments"
    ON public.appointments FOR SELECT
    USING (applicant_id = auth.uid());

CREATE POLICY "Users can create appointments"
    ON public.appointments FOR INSERT
    WITH CHECK (true);
