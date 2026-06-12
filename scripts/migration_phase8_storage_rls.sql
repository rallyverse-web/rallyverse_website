-- ============================================================
-- Phase 8: Storage Security & RLS Policies
-- ============================================================
-- Run this in Supabase SQL Editor after setup_storage_buckets.mjs
--
-- NOTE: ALTER TABLE storage.objects is NOT needed here because
-- Supabase already enables RLS on storage.objects by default.
-- Running ALTER TABLE would fail with "must be owner of table objects"
-- since storage schema tables are owned by supabase_storage_admin.
-- ============================================================

-- 1. Allow public read access to event-assets bucket (posters, QR codes, screenshots)
drop policy if exists "Public read access for event-assets" on storage.objects;
create policy "Public read access for event-assets"
  on storage.objects for select
  using ( bucket_id = 'event-assets' );

-- 2. Allow service role full access (bypasses RLS with service key but makes intent explicit)
drop policy if exists "Service role full access for event-assets" on storage.objects;
create policy "Service role full access for event-assets"
  on storage.objects for all
  using ( bucket_id = 'event-assets' )
  with check ( bucket_id = 'event-assets' );

-- 3. Block anonymous uploads/updates/deletes (only service role can write)
drop policy if exists "Block anonymous write for event-assets" on storage.objects;
create policy "Block anonymous write for event-assets"
  on storage.objects for insert
  with check ( false );

drop policy if exists "Block anonymous update for event-assets" on storage.objects;
create policy "Block anonymous update for event-assets"
  on storage.objects for update
  using ( false );

drop policy if exists "Block anonymous delete for event-assets" on storage.objects;
create policy "Block anonymous delete for event-assets"
  on storage.objects for delete
  using ( false );
