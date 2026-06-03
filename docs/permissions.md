# Security & Permissions Reference

This document outlines the security architecture of RallyVerse v2.0, details Supabase Row Level Security (RLS) policies, and explains the sub-admin token validation gates.

---

## 🗄️ Database Row Level Security (RLS)

All sensitive tables have RLS enabled. This prevents unauthorized direct reads/writes from public client bundles using the public anonymous key.

### Policy Rules

#### 1. Table: `registrations`
- **Enable RLS**: Yes
- **Policies**:
  - `Allow public insert`: Permits public anonymous players to submit registration forms.
    - SQL: `CREATE POLICY public_insert ON registrations FOR INSERT WITH CHECK (true);`
  - `Restrict select/update/delete`: Requires admin authentication. Bypassed only via `SUPABASE_SERVICE_ROLE_KEY` inside secure Server Actions.
    - SQL: `CREATE POLICY admin_all ON registrations TO service_role USING (true);`

#### 2. Table: `event_admins`
- **Enable RLS**: Yes
- **Policies**:
  - `Disable public select/insert/update/delete`: All actions restricted to `service_role`. Clients can never query this table directly.
    - SQL: `CREATE POLICY service_role_only ON event_admins TO service_role USING (true);`

#### 3. Table: `event_payment_config`
- **Enable RLS**: Yes
- **Policies**:
  - `Allow public select`: Enables the registration page to pull UPI details.
    - SQL: `CREATE POLICY public_select ON event_payment_config FOR SELECT USING (true);`
  - `Restrict update/insert/delete`: Restricts changes to `service_role` (via Founder dashboard calls).

#### 4. Table: `email_templates` and `email_logs`
- **Enable RLS**: Yes
- **Policies**:
  - `Service Role Only`: Public users cannot query template configurations or transactional log lists.

---

## 🔑 Administrative Route Authorization Gates

Administrative actions are protected by token authorization hooks:

### 1. Founder Dashboard Gate (`/api/admin/*`)
- **Method**: The route extracts the `Authorization: Bearer <token>` header.
- **Check**: Validates if `<token> === process.env.ADMIN_PASSWORD`.
- **Action**: Failure returns `401 Unauthorized`.

### 2. Event Admin Gate (`/api/event-admin/*`)
- **Method**: The route extracts the `Authorization: Bearer <token>` header.
- **Check**: Validates the token against the `access_token` column in the `event_admins` table:
  - Fetches the row: `SELECT event_id FROM event_admins WHERE access_token = token`.
  - Asserts that the requested resources fall within the returned `event_id` boundary.
- **Action**: Mismatched tokens or missing rows returns `401 Unauthorized`.
