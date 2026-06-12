-- ============================================================
-- Phase 9: Add payment_verified / payment_rejected to
--          email_templates CHECK constraint
-- ============================================================
-- Run this in Supabase SQL Editor.
--
-- The constraint from migration_phase5_product_maturity.sql
-- only allows:
--   approval, rejection, reminder, results, broadcast, registration_received
--
-- We need to add:
--   payment_verified, payment_rejected
--
-- DROP/ADD is safe because we're only expanding the allowed set.
-- No existing data violates the new constraint.
-- ============================================================

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
