# Database Migrations Log

This document indexes all database SQL migrations for RallyVerse, outlining the modifications applied in each phase.

---

## 📅 Migrations Version Index

### 1. `scripts/migration.sql` (Phase 1)
- **Scope**: Core Events Table schema definition.
- **Modifications**: Added columns: `category`, `capacity`, `rally_points`, `image_url`, `date_label`, `time_label`, and `is_date_confirmed`.

### 2. `scripts/migration_phase2.sql` (Phase 2)
- **Scope**: Payment, Sub-Admins, and Registrations.
- **Modifications**:
  - Created table `event_payment_config`.
  - Added columns to `event_admins` table: `access_token`, `created_by`.
  - Created table `registrations` with foreign keys to `events` and `event_admins`.
  - Added performance indexes for `event_id` and status codes.

### 3. `scripts/migration_phase2_hardening.sql` (Phase 2 Hardening)
- **Scope**: Data Integrity and Performance.
- **Modifications**:
  - Restructured player registration status checks: `CHECK (status IN ('Pending', 'Approved', 'Rejected'))`.
  - Enforced a unique index on player campaigns: `registrations_event_email_format_unique UNIQUE(event_id, email, format)`.
  - Added composite indexes for queries.

### 4. `scripts/migration_phase3a.sql` (Phase 3A)
- **Scope**: Templated Communications.
- **Modifications**:
  - Created table `event_email_settings` (sender credentials).
  - Created table `email_templates` (HTML templates for approvals, rejections, broadcasts).
  - Created table `email_logs` (audits for outgoing messages).
  - Enabled Row Level Security (RLS) on all new communication tables.

### 5. `scripts/migration_phase3a_whatsapp.sql` (Phase 3A Update)
- **Scope**: WhatsApp link tracking.
- **Modifications**: Added columns to event tables to support community chat redirects.

### 6. `scripts/migration_phase3c_analytics.sql` (Phase 3C)
- **Scope**: Platform analytics and tracking logs.
- **Modifications**:
  - Created table `page_views` (track client traffic funnels).
  - Created table `whatsapp_clicks` (track support conversions).
  - Configured RLS policies.

### 7. `scripts/migration_cleanup_v2.sql` (v2.0 Cleanups)
- **Scope**: Final data integrity pass.
- **Modifications**:
  - Added unique constraint on email templates: `UNIQUE(event_id, template_type)`.
  - Added unique constraint on event formats: `UNIQUE(event_id, format_name)`.
