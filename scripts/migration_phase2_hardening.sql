-- RallyVerse Phase 2 Hardening Pass
-- Run this in Supabase SQL Editor after migration_phase2.sql

-- PART 1: Registration Status Simplification
-- Migrate existing registrations to new 3-state system
UPDATE registrations SET status = 'Pending' WHERE status IN ('Pending Payment', 'Payment Verification Pending');

-- PART 2: Duplicate Registration Protection
-- Prevent same email from registering for same event+format twice
ALTER TABLE registrations ADD CONSTRAINT registrations_event_email_format_unique UNIQUE (event_id, email, format);

-- PART 5: Database Hardening
-- CHECK constraint to restrict status values
ALTER TABLE registrations ADD CONSTRAINT registrations_status_check CHECK (status IN ('Pending', 'Approved', 'Rejected'));

-- Missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_registration_id ON registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON registrations(event_id, status);

-- Add NOT NULL constraint on event_admins.event_id
ALTER TABLE event_admins ALTER COLUMN event_id SET NOT NULL;
