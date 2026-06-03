-- RallyVerse Phase 3A: Communication Infrastructure
-- Run this in Supabase SQL Editor

-- 1. Event Email Settings
create table if not exists event_email_settings (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  sender_name text not null default 'RallyVerse',
  reply_to_email text not null default '',
  support_email text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(event_id)
);

-- 2. Email Templates
create table if not exists email_templates (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  template_type text not null check (template_type in ('approval','rejection','reminder','results','broadcast')),
  subject text not null default '',
  content text not null default '',
  created_by uuid references event_admins(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Email Logs
create table if not exists email_logs (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  template_id uuid references email_templates(id) on delete set null,
  recipient_email text not null,
  subject text not null default '',
  sent_by uuid references event_admins(id),
  status text not null default 'sent' check (status in ('sent','failed')),
  provider_message_id text default '',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_email_settings_event_id on event_email_settings(event_id);
create index if not exists idx_email_templates_event_id on email_templates(event_id);
create index if not exists idx_email_templates_type on email_templates(template_type);
create index if not exists idx_email_logs_event_id on email_logs(event_id);
create index if not exists idx_email_logs_template_id on email_logs(template_id);
create index if not exists idx_email_logs_created_at on email_logs(created_at);

-- Enable RLS
alter table event_email_settings enable row level security;
alter table email_templates enable row level security;
alter table email_logs enable row level security;
