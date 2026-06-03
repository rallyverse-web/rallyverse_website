-- RallyVerse Phase 2: Registration, Payment & Event Admin Schema
-- Run this in Supabase SQL Editor

-- 1. Payment Configuration per event
create table if not exists event_payment_config (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  upi_id text not null default '',
  account_holder_name text not null default '',
  mobile_number text not null default '',
  whatsapp_number text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(event_id)
);

-- 2. Event Admins (enhanced with access_token)
alter table event_admins add column if not exists access_token text unique;
alter table event_admins add column if not exists created_by uuid;
alter table event_admins add column if not exists updated_at timestamptz default now();

-- 3. Registrations table
create table if not exists registrations (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  registration_id text unique not null,
  full_name text not null,
  phone_number text not null,
  email text not null,
  city text not null,
  gender text not null,
  format text not null,
  partner_name text default '',
  partner_phone text default '',
  status text not null default 'Pending',
  notes text default '',
  approved_by uuid references event_admins(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_registrations_event_id on registrations(event_id);
create index if not exists idx_registrations_status on registrations(status);
create index if not exists idx_event_admins_event_id on event_admins(event_id);
create index if not exists idx_event_admins_access_token on event_admins(access_token);
create index if not exists idx_event_payment_config_event_id on event_payment_config(event_id);

-- Enable RLS
alter table registrations enable row level security;
alter table event_admins enable row level security;
alter table event_payment_config enable row level security;
