-- RallyVerse Phase 3: Partner Enquiry Schema
-- Run this in Supabase SQL Editor or via migration runner script

create table if not exists partner_enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  organization text,
  email text not null,
  phone text not null,
  organization_type text not null,
  services_interested text[] not null,
  message text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table partner_enquiries enable row level security;

-- Enable insert access for all roles
create policy "Allow public insert access to partner_enquiries"
  on partner_enquiries
  for insert
  with check (true);

-- Enable all access for service role
create policy "Allow service role full access to partner_enquiries"
  on partner_enquiries
  for all
  using (true);
