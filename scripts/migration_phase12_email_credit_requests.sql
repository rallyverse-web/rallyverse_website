-- ============================================================
-- Phase 12: Email Credit Purchase & Approval Workflow
-- ============================================================
-- Run this in Supabase SQL Editor.
-- ============================================================

-- 1. Create email_credit_requests table
create table if not exists email_credit_requests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  event_admin_id uuid not null references event_admins(id) on delete cascade,
  package_type varchar(20) not null check (package_type in ('50', '100')),
  email_credits integer not null check (email_credits in (50, 100)),
  amount numeric(10, 2) not null,
  transaction_name varchar(200) not null,
  transaction_reference varchar(200) not null,
  payment_screenshot_url text,
  status varchar(20) not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  admin_notes text,
  approved_by uuid references event_admins(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Indexes
create index if not exists idx_email_credit_requests_event on email_credit_requests(event_id);
create index if not exists idx_email_credit_requests_status on email_credit_requests(status);

-- 3. Create system_config table for centralized payment settings
create table if not exists system_config (
  id uuid primary key default gen_random_uuid(),
  upi_id varchar(100) not null default '',
  account_holder_name varchar(200) not null default '',
  qr_code_url text,
  payment_instructions text default 'Make payment using the QR code or UPI ID below. After payment, enter the transaction details and submit your request. Requests are reviewed manually and are usually processed within 24 hours.',
  updated_at timestamptz not null default now()
);

-- 4. Seed default system config row (update values in admin panel)
insert into system_config (upi_id, account_holder_name, payment_instructions)
select 'adityag.007@ptaxis', 'RallyVerse', 'Make payment using the QR code or UPI ID below. After payment, enter the transaction details and submit your request. Requests are reviewed manually and are usually processed within 24 hours.'
where not exists (select 1 from system_config);
