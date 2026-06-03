# Diagnostics & Troubleshooting Guide

This guide details diagnostics procedures and resolutions for common issues encountered during local development or production runs of RallyVerse v2.0.

---

## 🛠️ Diagnostics & Common Issues

### 1. Database Connections
- **Symptom**: Next.js logs `Postgres connection timeout` or API calls return `500 Server Error` on Supabase queries.
- **Diagnostics**: Check if the Supabase project is active or paused (free-tier projects pause after 1 week of inactivity).
- **Resolution**:
  - Log into the Supabase dashboard. If paused, click **Restore Project**.
  - Verify that `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct.

### 2. Double Bookings & Unique Constraint Errors
- **Symptom**: Players receive an error message: `"Registration failed: Unique constraint violation."`
- **Diagnostics**:
  - The player has already submitted an entry with the same email for the same category format.
- **Resolution**:
  - The player must use a different email address or register for a different format (e.g. Mixed Doubles instead of Men's Doubles).
  - Admins can verify duplicate rows in Supabase by filtering the `registrations` table by email.

### 3. Email Delivery Failures
- **Symptom**: Emails are not arriving, and `email_logs` show rows with status `failed`.
- **Diagnostics**:
  - Review the console or hosting logs. Look for error messages returned by Resend (e.g. `Invalid API Key` or `Domain not verified`).
- **Resolution**:
  - Check that `RESEND_API_KEY` is set and valid.
  - Verify SPF/DKIM DNS settings inside the Resend dashboard for `rallyverse.social`.
  - Confirm the event's template contents do not contain malformed HTML that blocks parsing.

### 4. Admin Dashboard Unauthorized Access
- **Symptom**: Founders or admins receive `401 Unauthorized` errors when submitting dashboard changes.
- **Diagnostics**:
  - Mismatched authorization headers or session token expiry.
- **Resolution**:
  - Sign out of the control panel, clear browser cookies/localStorage, and log in again with the correct credentials.
  - For sub-admins, verify that the founder has not regenerated their access token (which invalidates the old token).
