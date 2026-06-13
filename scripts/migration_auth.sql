-- ══════════════════════════════════════════════════════════════
-- Migration: Supabase Auth Integration
-- ══════════════════════════════════════════════════════════════

-- 1. admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'super_admin',
  created_at timestamptz default now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own record" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- 2. Add auth_user_id to event_admins
ALTER TABLE event_admins ADD COLUMN IF NOT EXISTS auth_user_id uuid references auth.users(id) on delete set null;

CREATE INDEX IF NOT EXISTS idx_event_admins_auth_user_id ON event_admins(auth_user_id);

-- 3. Add status and last_login_at to event_admins
ALTER TABLE event_admins ADD COLUMN IF NOT EXISTS status text not null default 'pending'
  CHECK (status IN ('pending', 'active', 'disabled'));
ALTER TABLE event_admins ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_event_admins_status ON event_admins(status);
CREATE INDEX IF NOT EXISTS idx_event_admins_email ON event_admins(email);

-- Update existing admins with auth_user_id to active
UPDATE event_admins SET status = 'active' WHERE auth_user_id IS NOT NULL AND status = 'pending';

-- 4. Add auth_user_id to registration audit columns
-- No schema change needed — approved_by, checked_in_by, payment_verified_by already store UUID
-- Migration: For event admin actions, these will now store the auth_user_id instead of event_admin UUID

-- 5. ⚠ RLS hotfix: events table has RLS enabled but no SELECT policy for anonymous users.
--    The server uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS, but if that key is missing
--    from Vercel env, all event queries return empty. This policy ensures public visibility:
CREATE POLICY "Everyone can view events" ON public.events
  FOR SELECT USING (true);

-- ══════════════════════════════════════════════════════════════
-- Manual Supabase Steps (run after migration):
-- ══════════════════════════════════════════════════════════════
-- 1. Create admin user via Supabase Dashboard > Authentication > Users > Invite user
--    Email: [founder email]
--    Password: [set a strong password]
--
-- 2. Insert into admin_users:
--    INSERT INTO admin_users (id, email, role)
--    VALUES ('<auth_user_id_from_step_1>', '<founder_email>', 'super_admin');
--
-- 3. For existing event admins, create Sup Auth users for each:
--    INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
--    VALUES ('<admin_email>', '<hashed_password>', now())
--    RETURNING id;
--    Then update event_admins:
--    UPDATE event_admins SET auth_user_id = '<returned_id>' WHERE email = '<admin_email>';
--    UPDATE event_admins SET status = 'active' WHERE auth_user_id IS NOT NULL;
--
-- 4. Remove ADMIN_PASSWORD from .env after verifying all flows work
