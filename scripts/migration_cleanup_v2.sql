-- RallyVerse v2.0: Database Cleanup & Integrity Pass
-- Run this in Supabase SQL Editor (https://supabase.com)

-- PART 1: EMAIL TEMPLATE INTEGRITY
-- Enforce that each event can have at most one template per template type.
-- This prevents duplicate template overrides for approval, rejection, etc.
ALTER TABLE email_templates
ADD CONSTRAINT email_templates_event_template_unique UNIQUE (event_id, template_type);

-- PART 2: EVENT FORMATS INTEGRITY
-- Enforce that each event cannot have duplicate format definitions (e.g. Mixed Doubles twice)
ALTER TABLE event_formats
ADD CONSTRAINT event_formats_event_format_name_unique UNIQUE (event_id, format_name);

-- PART 3: SCHEMA AUDIT AND RECOMMENDATIONS
-- 
-- 1. Column: events.image_url
--    - Status: UNUSED (Confirmed)
--    - Rationale: The system renders posters dynamically via assets.ts (using the slug: `/posters/{slug}-poster.png`)
--                 and uses the `poster_url` field as a fallback. `image_url` has zero references in the Next.js app.
--    - Recommendation: Safe to drop in a future release if no custom external logos/banners are bound to it.
--      SQL: ALTER TABLE events DROP COLUMN IF EXISTS image_url;
--
-- 2. Legacy Tables:
--    - Currently, no legacy tables (like Google Sheets configuration logs) exist in the Supabase schema,
--      as the legacy system operated purely on top of external spreadsheets.
--    - Active Supabase tables include:
--      - events (Core events)
--      - event_formats (Categories supported per event)
--      - event_payment_config (Custom payment settings per event)
--      - event_admins (Access tokens & sub-admin permissions)
--      - registrations (Player registration details)
--      - event_email_settings (Custom Resend settings per event)
--      - email_templates (Custom templated contents per event)
--      - email_logs (Outbound notification tracking)
--      - page_views (Web analytics)
--      - whatsapp_clicks (Web analytics)
