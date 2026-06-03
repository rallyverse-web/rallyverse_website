-- ══════════════════════════════════════════════════════════════
-- Phase 3C: Analytics & Insights
-- ══════════════════════════════════════════════════════════════

-- ── Page Views ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL,
  slug TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_event_id ON page_views(event_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_type ON page_views(page_type);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_event_id_type ON page_views(event_id, page_type);

-- ── WhatsApp Clicks ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  click_type TEXT NOT NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_event_id ON whatsapp_clicks(event_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_type ON whatsapp_clicks(click_type);

-- ── Registration Analytics Indexes ─────────────────────────
CREATE INDEX IF NOT EXISTS idx_registrations_status_created ON registrations(status, created_at);
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON registrations(event_id, status);

-- ── Email Logs Analytics Indexes ───────────────────────────
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_event_status ON email_logs(event_id, status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at);
