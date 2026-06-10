# Analytics Infrastructure Documentation

RallyVerse utilizes a dual-layer analytics approach:
1. **Google Analytics 4 (GA4)**: Captures client-side user behavior, page engagement, and client-side conversion indicators.
2. **Server-Side Supabase Logging**: Captures concrete conversion actions (page views and WhatsApp CTA clicks) directly inside PostgreSQL.

Vercel Analytics is now added as a lightweight site-traffic layer for global page-view reporting in the Vercel dashboard. It complements, rather than replaces, the existing GA4 and Supabase tracking.

---

## 📈 Client-Side Google Analytics 4 (GA4)

GA4 tracking is initialized client-side via the component `TrackPageView.tsx`. It triggers automatically on route loading.

### Stream Setup
GA4 is enabled by defining `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in the environment configuration.

### Custom Conversion Actions
- **`registration_start`**: Fired when a user loads `/events/[slug]/register`.
- **`whatsapp_click`**: Fired when a user clicks the "Send Payment Screenshot" CTA link.
- **`registration_complete`**: Fired when a registration record is successfully written to the database.

---

## ⚙️ Server-Side Supabase Analytics

To bypass adblockers and log high-accuracy event signals, server-side hits are written to the database.

### 1. Page Views (`page_views` Table)
Logged whenever a user visits an event campaign details page.
- **Table Columns**: `id`, `event_id`, `page_type`, `visitor_ip_hash`, `user_agent`, `created_at`
- **Logged Types**:
  - `homepage`: Visits to the main portal page.
  - `event_detail`: Visits to `/events/[slug]`.
  - `event_register`: Visits to `/events/[slug]/register`.

### 2. WhatsApp Conversions (`whatsapp_clicks` Table)
Logged when a user initiates contact with the organizer for payment confirmation or support.
- **Table Columns**: `id`, `event_id`, `click_type`, `visitor_ip_hash`, `created_at`
- **Logged Types**:
  - `whatsapp_contact`: Direct wa.me messages.
  - `whatsapp_group`: Group invitation URL clicks.

---

## 📊 Analytics Dashboard
Founder and Event Admin dashboards aggregate these logs to display real-time metrics:
- **Conversion Rate**: $\text{Conversion Rate} = \frac{\text{Total Registrations}}{\text{Total Page Views}} \times 100$
- **Engagement Funnel**: Visual progression tracking Page Views ➔ WhatsApp Clicks ➔ Registrations.
