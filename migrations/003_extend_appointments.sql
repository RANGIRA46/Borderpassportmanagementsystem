-- Migration: 003_extend_appointments
-- Description: Add extra columns to appointments table required by the full REST API
-- Run order: 3

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS location_name      TEXT,
  ADD COLUMN IF NOT EXISTS phone              TEXT,
  ADD COLUMN IF NOT EXISTS first_name         TEXT,
  ADD COLUMN IF NOT EXISTS last_name          TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_code  TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS confirmed_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completed_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Index for confirmation code look-ups (UNIQUE already creates an implicit index)
CREATE INDEX IF NOT EXISTS idx_appointments_confirmation_code
    ON public.appointments (confirmation_code);
