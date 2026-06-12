-- RallyVerse Phase 6: Registration payment flow & event asset management
-- Adds: payment fields to registrations, QR code support, poster storage,
--       payment enable toggle on events

-- 1. Registrations: add payment tracking fields
alter table if exists registrations
  add column if not exists payment_status text not null default 'Pending Verification'
    check (payment_status in ('Pending Verification', 'Completed', 'Failed', 'Refunded'));

alter table if exists registrations
  add column if not exists payment_upi_id text;

alter table if exists registrations
  add column if not exists transaction_name text;

alter table if exists registrations
  add column if not exists transaction_reference text;

-- 2. Events: add poster storage URL, payment enable toggle
alter table if exists events
  add column if not exists poster_url text;

alter table if exists events
  add column if not exists payment_enabled boolean not null default false;

-- 3. Event payment config: add QR code URL
alter table if exists event_payment_config
  add column if not exists qr_code_url text;

alter table if exists event_payment_config
  add column if not exists payment_enabled boolean not null default false;

-- 4. Update registration status check constraint (existing 'Pending' stays compatible)
alter table if exists registrations
  drop constraint if exists registrations_status_check;

alter table if exists registrations
  add constraint registrations_status_check
  check (status in ('Pending', 'Pending Verification', 'Approved', 'Rejected'));

comment on column registrations.payment_status is 'Tracks the payment verification state: Pending Verification, Completed, Failed, Refunded';
comment on column registrations.payment_upi_id is 'UPI ID used by the participant to make payment';
comment on column registrations.transaction_name is 'Name appearing on the transaction';
comment on column registrations.transaction_reference is 'Optional transaction reference/UTR number';
comment on column events.poster_url is 'URL to event poster stored in Supabase Storage';
comment on column events.payment_enabled is 'Whether online payment collection is enabled for this event';
comment on column event_payment_config.qr_code_url is 'URL to QR code image stored in Supabase Storage';
