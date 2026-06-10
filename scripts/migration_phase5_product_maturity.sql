-- RallyVerse Phase 5: Product maturity upgrades
-- Adds featured events, registration audit logging, and support for registration-received email templates.

-- 1. Featured events
alter table if exists events
  add column if not exists featured boolean not null default false;

create index if not exists idx_events_featured on events(featured);

-- 2. Registration audit logs
create table if not exists registration_audit_logs (
  id uuid default gen_random_uuid() primary key,
  registration_id uuid references registrations(id) on delete cascade not null,
  event_id uuid references events(id) on delete cascade not null,
  action text not null,
  changed_by uuid references event_admins(id),
  previous_data jsonb,
  next_data jsonb,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_registration_audit_logs_registration_id on registration_audit_logs(registration_id);
create index if not exists idx_registration_audit_logs_event_id on registration_audit_logs(event_id);
create index if not exists idx_registration_audit_logs_created_at on registration_audit_logs(created_at);

-- 3. Email template type support
alter table if exists email_templates
  drop constraint if exists email_templates_template_type_check;

alter table if exists email_templates
  add constraint email_templates_template_type_check
  check (template_type in ('approval', 'rejection', 'reminder', 'results', 'broadcast', 'registration_received'));

-- 4. Optional helper comments
comment on column events.featured is 'Featured events are promoted first on the public homepage and Services page.';
comment on table registration_audit_logs is 'Audit trail for registration edits, approvals, rejections, and deletions.';
