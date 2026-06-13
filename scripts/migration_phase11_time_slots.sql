-- ============================================================
-- Phase 11: Time Slot Registration
-- ============================================================
-- Run this in Supabase SQL Editor.
-- ============================================================

-- 1. Add time_slots JSONB column to events (array of time slot strings, e.g. ["8:00 AM", "10:00 AM", "2:00 PM"])
alter table if exists events
  add column if not exists time_slots jsonb default null;

-- 2. Add time_slot column to registrations
alter table if exists registrations
  add column if not exists time_slot varchar(50) default null;

-- 3. Add index on time_slot for filtering
create index if not exists idx_registrations_time_slot on registrations(event_id, time_slot);
