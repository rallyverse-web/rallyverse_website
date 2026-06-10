-- Create contact_submissions table
create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  organization text,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table contact_submissions enable row level security;
