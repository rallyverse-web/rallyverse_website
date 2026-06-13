-- ============================================================
-- Phase 10: Check-In System & Email Quota
-- ============================================================
-- Run this in Supabase SQL Editor.
-- ============================================================

-- 1. Add check-in fields to registrations
alter table if exists registrations
  add column if not exists checked_in boolean not null default false;

alter table if exists registrations
  add column if not exists checked_in_at timestamptz;

alter table if exists registrations
  add column if not exists checked_in_by uuid references event_admins(id);

-- 2. Add email quota fields to events
alter table if exists events
  add column if not exists email_limit integer not null default 50;

alter table if exists events
  add column if not exists emails_sent integer not null default 0;

alter table if exists events
  add column if not exists additional_email_credits integer not null default 0;

-- 3. Update email_templates check constraint to include new template types
alter table if exists email_templates
  drop constraint if exists email_templates_template_type_check;

alter table if exists email_templates
  add constraint email_templates_template_type_check
  check (template_type in (
    'approval',
    'rejection',
    'reminder',
    'results',
    'broadcast',
    'registration_received',
    'payment_verified',
    'payment_rejected'
  ));

-- 4. Add index on checked_in for filtering
create index if not exists idx_registrations_checked_in on registrations(event_id, checked_in);
