# Pre-Launch Deployment Checklist

Ensure all items in this checklist are verified and marked complete before deploying RallyVerse v2.0 to production.

---

## Database & Supabase Check
- [ ] **SQL Schemas**: Run all migrations sequentially up to `scripts/migration_cleanup_v2.sql`.
- [ ] **Constraints Active**: Verify `UNIQUE(event_id, template_type)` on `email_templates` and `UNIQUE(event_id, format_name)` on `event_formats`.
- [ ] **RLS Enabled**: Check that Row Level Security (RLS) is active on `registrations`, `event_admins`, `event_payment_config`, `email_templates`, `email_logs`, `page_views`, and `whatsapp_clicks`.
- [ ] **Database Connection**: Confirm the Next.js server resolves queries successfully under load.

---

## Environment Variables
- [ ] **Secrets Validated**: Validate that `RESEND_API_KEY`, `ADMIN_PASSWORD`, and `SUPABASE_SERVICE_ROLE_KEY` are correct in the Vercel project panel.
- [ ] **URLs Configured**: `NEXT_PUBLIC_SITE_URL` must point to the canonical production URL (`https://rallyverse.social`).
- [ ] **GA4 Measurements**: Check that `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set to the correct production stream identifier.
- [ ] **Google Sheets Residuals**: Ensure all references to Sheets keys (`GOOGLE_SHEET_ID`, `GOOGLE_PRIVATE_KEY`, etc.) are completely absent.

---

## Resend Gateway & Email Testing
- [ ] **Domain Verification**: Verify the sender domain (`rallyverse.social`) is fully verified (DKIM/SPF) in the Resend dashboard.
- [ ] **Template Seeding**: Verify that `seedEventDefaults` has run for active events, creating templates for `approval`, `rejection`, `reminder`, `results`, and `broadcast`.
- [ ] **Test Email Delivery**:
  - [ ] Trigger a test template registration email.
  - [ ] Trigger an admin verification email.
  - [ ] Confirm receipt in the test mailbox.
- [ ] **Transactional Logging**: Check that triggered emails create successful rows in the `email_logs` table.

---

## Google Analytics (GA4) & Tracking
- [ ] **Script Loading**: Check the browser console on loading the site to confirm `gtag.js` is loaded without blocking errors.
- [ ] **Funnel Clicks Tracking**:
  - [ ] Verify that starting a registration triggers GA4 client actions.
  - [ ] Verify that clicking the WhatsApp support button records a hit in the `whatsapp_clicks` table in Supabase.
  - [ ] Verify that loading pages increments `page_views` table rows.

## Vercel Analytics
- [ ] **Global Mount**: Confirm `Analytics` is rendered in `app/layout.tsx` so every page is included.
- [ ] **Dashboard Access**: Verify the Vercel project dashboard shows the **Analytics** panel after deployment.
- [ ] **Traffic Visibility**: Confirm page views and top pages appear after real production traffic reaches the site.

---

## Dashboards Access & Security
- [ ] **Founder Authentication**: Try logging into `/admin` with an incorrect password, and verify it blocks access. Verify correct password allows access and displays Platform Overview metrics.
- [ ] **Sub-Admin Token Validation**:
  - [ ] Generate a sub-admin token inside `/admin/events` under the admin modal.
  - [ ] Authenticate at `/event-admin` using the generated token.
  - [ ] Verify access is granted ONLY to the assigned event campaign.
  - [ ] Verify other event statistics are hidden.

---

## Production Smoke Test
- [ ] **Register Campaign Flow**:
  - [ ] Submit a registration on the live site at `/events/[slug]/register`.
  - [ ] Verify the registration record appears in Supabase.
  - [ ] Check WhatsApp link redirections.
  - [ ] Approve registration inside `/event-admin/dashboard` using sub-admin login.
  - [ ] Verify registration state moves to `Approved` and approval email is sent.
