# Project Codebase Structure

This guide outlines the file and directory layout of RallyVerse v2.0, detailing components, routing directories, database scripts, and assets.

---

## 📂 Codebase Directory Layout

```
rally-verse-landing-page/
├── app/                          # Next.js App Router Pages & APIs
│   ├── admin/                    # Founder Control Panel Views
│   │   ├── analytics/            # Conversion Trends Dashboard
│   │   ├── communication/        # Email Broadcast Control Panel
│   │   ├── events/               # Event CRUD Control Panel
│   │   ├── registrations/        # Global Submissions Accordion
│   │   ├── AdminAuthContext.tsx  # Shared Authentication State Provider
│   │   ├── layout.tsx            # Sticky Header Navigation Layout Wrapper
│   │   └── page.tsx              # Founder Dashboard Homepage (Overview)
│   ├── api/                      # Next.js Serverless API Endpoints
│   │   ├── admin/                # Founder APIs (events, all-registrations, etc.)
│   │   │   └── email-templates/  # Email templates ([eventId], [eventId]/[templateId], [eventId]/duplicate, [eventId]/preview)
│   │   ├── event-admin/          # Sub-admin APIs (approve, registrations, export)
│   │   │   └── email-templates/  # Scoped email templates ([eventId], [eventId]/[templateId], [eventId]/duplicate, [eventId]/preview)
│   │   └── track/                # Server-side Analytics APIs (views, clicks)
│   ├── event-admin/              # Sub-Admin Dashboard Views
│   │   ├── analytics/            # Event-specific analytics
│   │   ├── communication/        # Event-specific comms broadcasts
│   │   ├── dashboard/            # Event-specific registration management
│   │   ├── layout.tsx            # Session Check & Navigation Header Layout Wrapper
│   │   └── page.tsx              # Sub-admin authentication gate
│   ├── events/                   # Public Tournament Details Pages
│   │   ├── [slug]/               # Dynamic Event Information
│   │   │   ├── register/         # Event Registration Form (Supabase-backed)
│   │   │   └── page.tsx          # Detail Page View (JSON-LD Schemas)
│   │   └── page.tsx              # Active published campaigns listings
│   ├── layout.tsx                # Base website layout & font styling
│   └── page.tsx                  # Landing homepage (Hero, Manifesto, Believers)
├── components/                   # Shared UI Components & Sections
│   ├── ui/                       # Shadcn UI atoms (buttons, dialogs, dropdowns)
│   ├── FirstEvent.tsx            # Featured event hero highlight card
│   ├── HeroIntro.tsx             # Interactive text animations hero banner
│   ├── ThemedLogo.tsx            # Context-sensitive light/dark brand logos
│   └── navbar.tsx                # Responsive header & drawer menu
├── data/                         # Hardcoded UI lists (believers list, FAQs)
├── docs/                         # Platform operations manuals & design documents
├── hooks/                        # Custom React hooks
├── lib/                          # Core backend utils, configs, & DB repos
│   ├── repositories/             # Supabase DB operations (CRUD layer)
│   │   ├── analytics.ts          # Aggregate visitor trends queries
│   │   ├── email-logs.ts         # Logs database operations
│   │   ├── email-templates.ts    # Template updates & selects
│   │   ├── event-admins.ts       # Sub-admin assignments & tokens
│   │   ├── events.ts             # Event campaign database CRUD
│   │   └── registrations.ts      # Player records CRUD
│   ├── config.ts                 # Client configurations (address, social links)
│   ├── resend-service.ts         # Direct gateway client connection
│   └── send-email-service.ts     # Batch transactional notification helper
├── public/                       # Static assets served by Next.js
│   ├── logo/                     # Brand logos (transparent, black, text)
│   ├── posters/                  # Event posters and placeholders
│   ├── profile_pics/             # Staff/User avatar graphic assets
│   └── sponsors/                 # Sponsor logo graphic assets
├── scripts/                      # Database seed scripts & SQL migrations
└── tsconfig.json                 # TypeScript compiler setup
```
