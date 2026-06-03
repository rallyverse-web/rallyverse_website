# System Architecture Documentation

RallyVerse is built on a modern serverless stack designed for high availability, low-latency static delivery, and real-time administrative dashboards.

---

## 🏗️ Core Technology Stack

1. **Frontend**: Next.js (React 19 / App Router) styled with Tailwind CSS. Delivered via Vercel's global Edge Network.
2. **Backend**: Next.js Server Actions and API Routes. Serverless execution minimizes idle server costs.
3. **Database**: PostgreSQL hosted on Supabase, leveraging Row Level Security (RLS) and realtime triggers.
4. **Email Gateway**: Resend serverless mail delivery service.
5. **Analytics**: Google Analytics 4 (GA4) integrated with server-side Supabase conversion tracking.

---

## 📈 System Workflows & Data Flows

```
┌────────────────────────────────────────────────────────┐
│                        Vercel                          │
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │   Next.js Client Pages  │  │ Next.js API Routes  │  │
│  │   (Registration, Home)  │  │  (Event Admin, etc) │  │
│  └────────────┬────────────┘  └──────────┬──────────┘  │
└───────────────┼──────────────────────────┼─────────────┘
                │                          │
        HTTP    │                          │ REST/HTTP
        GraphQL │                          │
                ▼                          ▼
┌────────────────────────────────────────────────────────┐
│                       Supabase                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │            PostgreSQL Database Tables            │  │
│  │   (Events, Registrations, Templates, Logs)       │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
                │
                ├────────► Resend (Outbound Emails)
                │
                └────────► Google Analytics 4 (User Events)
```

---

### 1. Registration Flow

```
[Player Visits Event Page] ──► [Fills Registration Form] ──► [API: /api/events/[slug]/register]
                                                                      │
[WhatsApp Screenshot] ◄── [Sends Email Confirmation] ◄── [Inserts Registrations (Pending)]
```

1. **Client Submission**: The player fills out the registration form at `/events/[slug]/register`.
2. **API Endpoint**: Handled by `app/api/events/[slug]/register/route.ts`.
3. **Validations**: Form structure validation (UPI, Email format, Doubles verification).
4. **Supabase Record**: A new row is inserted into `registrations` with a status of `Pending`.
5. **Initial Notification**: Sends a "Registration Received" email via Resend to the player containing their `registration_id`.
6. **Payment Instruction**: Redirects the user to the WhatsApp CTA to submit their payment screenshot for manual approval.

---

### 2. Event Admin Flow

```
[Admin Signs In] ──► [Sends Authorization Token] ──► [API Verification] ──► [Supabase Queries]
```

1. **Authentication**: Event admins access the dashboard at `/event-admin` using their uniquely generated `access_token` as their password.
2. **Session Storage**: The access token is stored securely in local client state and attached to the `Authorization: Bearer <token>` header of every API call.
3. **Security Gate**: Middleware and API routes verify the token against the `event_admins` table:
   - Valid token matches the `event_id` URL parameter.
   - Restricts operations exclusively to the assigned event context.

---

### 3. Communication Flow

```
[Founder/Admin Actions] ──► [API: /api/admin/send-email] ──► [Load Template & Settings]
                                                                        │
[Log Result in email_logs] ◄── [Trigger Resend API] ◄── [Merge Placeholders (Zod Template)]
```

1. **Trigger Action**: A Founder or Admin triggers a communication event (e.g. approve player, send reminder, broadcast).
2. **Template Processing**: The server loads:
   - Custom `email_templates` for that event.
   - Sender settings from `event_email_settings`.
3. **Zod Merge**: Placeholders like `{participant_name}` or `{event_venue}` are dynamically parsed and merged using `lib/template-renderer.ts`.
4. **Delivery**: The server triggers `resend.emails.send()`.
5. **Transaction Logs**: The outcome (status `sent` or `failed`) is appended to the database `email_logs` table for dashboard metric audits.

---

### 4. Analytics Flow

```
[User Action on Page] ──► [Client GA4 Tracking]
          │
          └─────────────► [Server API Tracking] ──► [Append Supabase page_views/whatsapp_clicks]
```

1. **Client GA4 Events**: Track client-side page views and clicks via Google Analytics script loading.
2. **Server-Side Conversion Tracking**:
   - Triggers on registration starts, click-to-WhatsApp link conversions, and registrations completions.
   - Endpoint records direct hits into `page_views` and `whatsapp_clicks` tables.
   - These stats power the real-time conversion graphs shown on the analytics dashboard.
