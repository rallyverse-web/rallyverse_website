# RallyVerse — Rally Beyond Routine

RallyVerse is a Bengaluru-based sports and outdoor community platform organizing badminton tournaments, treks, marathons, and social athletic experiences. 

This repository houses the complete serverless web application, featuring dynamic public registration campaigns, an offline UPI payment reconciliation loop, scoped sub-admin portals, transactional templated communications, and analytics funnels.

---

## 🚀 Key Features

### Public Portal
- **Dynamic Campaign Listings**: Lists upcoming published tournaments, treks, and events.
- **Dynamic Registration Flow**: Multi-step registration forms with category formats validation (e.g. partner details validation for double matches) and automatic slot limit gates.
- **Interactive Branding**: Premium UI styling including glassmorphism layouts, theme toggling, decrypted text glitch effects, and smooth reveal animations.

### Founder Control Panel
- **Event Lifecycle Manager**: Draft, publish, cancel, or complete campaigns.
- **Payment & WhatsApp Configuration**: Configure custom merchant UPI credentials and support details per campaign.
- **Sub-Admin Provisioning**: Dynamically assign coordinator emails to events. The system generates unique, revocable access tokens for on-ground staff.
- **Outbound Email Communications**: Edit templated HTML campaigns, and broadcast confirmation notices or event updates.

### Event Admin Dashboard
- **Access Scoping**: Coordinators sign in with their unique token and access *only* the registration entries, communications, and analytics of their assigned event.
- **Payment Screenshots Verification**: Match and reconcile incoming transaction screenshots on WhatsApp against registrations, transitioning players from `Pending` to `Approved`.
- **CSV Data Export**: One-click registration details export for offline match bracket draws or seed charting.

---

## 🛠️ Technical Stack

- **Framework**: Next.js 16 (React 19, App Router)
- **Database**: PostgreSQL on Supabase (RLS Policies enabled)
- **Email Gateway**: Resend Transactional Mail Service
- **Analytics**: Google Analytics 4 (Client-side) & Server-side event tracking
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18.x or later)
- pnpm package manager (`npm install -g pnpm`)

### Installation & Run
1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Copy the environment template to create local configuration files:
   ```bash
   cp .env.local.example .env.local
   ```
3. Populate variables in `.env.local` (refer to the [Environment Variables Guide](docs/environment-variables.md) for details).
4. Run the Next.js local development server:
   ```bash
   pnpm dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## 📂 Documentation Directory

Full subsystem guides, setup playbooks, and operations manuals are located in the `docs/` folder:

1. **[Founder Operations Manual](docs/founder-dashboard.md)**: Campaign management guide for non-technical platform owners.
2. **[Event Admin Operations Manual](docs/event-admin-dashboard.md)**: Training playbook for tournament organizers.
3. **[Event Lifecycle playbook](docs/event-lifecycle.md)**: Transition flows mapping a campaign from draft creation to completion.
4. **[System Architecture](docs/architecture.md)**: Data flows, components, and subsystem blueprints.
5. **[Database Schema Reference](docs/database.md)**: Relational model, schemas, columns, and foreign keys.
6. **[Security & Row Level Security (RLS)](docs/permissions.md)**: Database policy permissions.
7. **[Outbound Emails & Resend Guide](docs/email-system.md)**: Templated transactional notifications.
8. **[WhatsApp Integration](docs/whatsapp-system.md)**: Preferred user links generation rules and fallbacks.
9. **[Analytics & Funnel Tracking](docs/analytics.md)**: GA4 and database conversions logs.
10. **[Codebase & Directories Tree](docs/folder-structure.md)**: Code architecture layout.
11. **[Environment Variables](docs/environment-variables.md)**: Variables lookup reference.
12. **[Supabase & Vercel Deployment Manual](docs/deployment.md)**: Serverless launch configuration.
13. **[Pre-launch Deployment Checklist](docs/deployment-checklist.md)**: Launch verification steps.
14. **[Future Feature Roadmap](docs/future-roadmap.md)**: Deferred backlog list for future phases.
15. **[Migrations History](docs/migrations.md)**: SQL schema modification index.
16. **[Troubleshooting Guide](docs/troubleshooting.md)**: Bug diagnostics and mitigations.
