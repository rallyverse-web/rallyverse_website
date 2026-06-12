-- RallyVerse Phase 7: Payment Verification Workflow
-- Adds audit trail columns to registrations for payment verify/reject
-- Updates payment_status check constraint to new values

-- 1. Update payment_status check constraint
-- First, migrate existing data
update registrations set payment_status = 'pending_verification' where payment_status = 'Pending Verification';
update registrations set payment_status = 'verified' where payment_status = 'Completed';
update registrations set payment_status = 'rejected' where payment_status = 'Failed' or payment_status = 'Refunded';

-- Drop old constraint and add new one
alter table if exists registrations
  drop constraint if exists registrations_payment_status_check;

alter table if exists registrations
  add constraint registrations_payment_status_check
  check (payment_status in ('pending_verification', 'verified', 'rejected'));

-- 2. Registrations: add payment audit trail columns
alter table if exists registrations
  add column if not exists payment_verified_by text;

alter table if exists registrations
  add column if not exists payment_verified_at timestamptz;

alter table if exists registrations
  add column if not exists payment_rejected_by text;

alter table if exists registrations
  add column if not exists payment_rejected_at timestamptz;

alter table if exists registrations
  add column if not exists payment_rejection_reason text;

comment on column registrations.payment_verified_by is 'Event admin who verified the payment';
comment on column registrations.payment_verified_at is 'When payment was verified';
comment on column registrations.payment_rejected_by is 'Event admin who rejected the payment';
comment on column registrations.payment_rejected_at is 'When payment was rejected';
comment on column registrations.payment_rejection_reason is 'Reason for payment rejection';
comment on column registrations.payment_status is 'Tracks the payment verification state: pending_verification, verified, rejected';

-- 3. Event payment config: add transaction_ref_required
alter table if exists event_payment_config
  add column if not exists transaction_ref_required boolean not null default true;

comment on column event_payment_config.transaction_ref_required is 'Whether transaction reference ID is required during registration';
