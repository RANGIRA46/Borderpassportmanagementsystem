-- Migration: 002_add_indexes
-- Description: Performance indexes for common query patterns
-- Run order: 2

-- Applications
CREATE INDEX IF NOT EXISTS idx_applications_email
    ON public.applications (applicant_email);

CREATE INDEX IF NOT EXISTS idx_applications_applicant_id
    ON public.applications (applicant_id);

CREATE INDEX IF NOT EXISTS idx_applications_status
    ON public.applications (status);

CREATE INDEX IF NOT EXISTS idx_applications_type
    ON public.applications (type);

CREATE INDEX IF NOT EXISTS idx_applications_submitted_at
    ON public.applications (submitted_at DESC);

-- Application status history
CREATE INDEX IF NOT EXISTS idx_status_history_application_id
    ON public.application_status_history (application_id);

CREATE INDEX IF NOT EXISTS idx_status_history_changed_at
    ON public.application_status_history (changed_at DESC);

-- Documents
CREATE INDEX IF NOT EXISTS idx_documents_application_id
    ON public.documents (application_id);

CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by
    ON public.documents (uploaded_by);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_email
    ON public.appointments (applicant_email);

CREATE INDEX IF NOT EXISTS idx_appointments_applicant_id
    ON public.appointments (applicant_id);

CREATE INDEX IF NOT EXISTS idx_appointments_date
    ON public.appointments (appointment_date);

CREATE INDEX IF NOT EXISTS idx_appointments_status
    ON public.appointments (status);

-- Border crossings
CREATE INDEX IF NOT EXISTS idx_border_crossings_document_number
    ON public.border_crossings (document_number);

CREATE INDEX IF NOT EXISTS idx_border_crossings_time
    ON public.border_crossings (crossing_time DESC);

CREATE INDEX IF NOT EXISTS idx_border_crossings_post
    ON public.border_crossings (border_post);
