-- RallyVerse Phase 1: Schema Migration
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/upbgyijcrekpedyqyods/sql/new)

-- Add columns to events table for full RallyEvent data
alter table events add column if not exists category text;
alter table events add column if not exists capacity integer;
alter table events add column if not exists rally_points integer default 0;
alter table events add column if not exists image_url text;
alter table events add column if not exists updated_at timestamptz default now();
alter table events add column if not exists date_label text;
alter table events add column if not exists time_label text;
alter table events add column if not exists is_date_confirmed boolean default true;
