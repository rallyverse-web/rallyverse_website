# RallyVerse v2.0 Documentation Portal

Welcome to the RallyVerse v2.0 Documentation Portal. This system outlines the architecture, database layout, deployment instructions, operational playbooks, and future roadmap of the RallyVerse platform.

---

## 📂 Table of Contents

### 1. Operations Manuals
- **[Founder Operations Manual](founder-dashboard.md)**: A step-by-step guide for non-technical founders to create events, manage payments, configure WhatsApp, assign admins, and check analytics.
- **[Event Admin Operations Manual](event-admin-dashboard.md)**: Training guide for sub-admins managing player approvals, sending emails, exports, and analytics.
- **[Event Lifecycle & Playbook](event-lifecycle.md)**: Complete lifecycle playbook of a RallyVerse campaign, detailing the steps from draft concept to event completion.

### 2. Architecture & Design
- **[System Architecture](architecture.md)**: Frontend, Backend, Supabase, Resend, and GA4 integration details with workflow diagrams.
- **[Database System & Schemas](database.md)**: Database layout, column descriptions, and relational model.
- **[Folder & Code Structure](folder-structure.md)**: Guide to directories, repositories, utilities, and components in the Next.js workspace.

### 3. Subsystem Technical Guides
- **[Registration System](registration-system.md)**: Supabase-based registration flows, input validations, and duplicate checks.
- **[Payment Verification Flow](payment-verification.md)**: Offline UPI payment details and sub-admin verification workflows.
- **[Email & Templates System](email-system.md)**: Resend integration, custom templates, and transaction history logs.
- **[Event & Format System](event-system.md)**: Dynamic multi-event structure and event formats management.
- **[Event Admin & Tokens](event-admin-system.md)**: Security tokens, permissions scope, and sub-admin logins.
- **[WhatsApp Integrations](whatsapp-system.md)**: Business chats, invite links, and fallback configurations.
- **[Security & RLS Policies](permissions.md)**: Database Row Level Security (RLS) policies and authentication validation rules.
- **[Analytics Infrastructure](analytics.md)**: Google Analytics 4 (GA4) conversion funnels and Supabase logging tables.

### 4. Configuration & Deployment
- **[Environment Variables Guide](environment-variables.md)**: Complete list of keys required to build, test, and run the app.
- **[Deployment Manual](deployment.md)**: Guidelines for hosting the platform on Vercel and Supabase.
- **[Pre-launch Deployment Checklist](deployment-checklist.md)**: Mandatory verification criteria before marking the system production-ready.
- **[Migrations History](migrations.md)**: Version control index of Supabase SQL migrations.
- **[Troubleshooting Guide](troubleshooting.md)**: Diagnostics, common errors, and mitigation guides.

### 5. Future Roadmap
- **[Feature Backlog & Roadmap](future-roadmap.md)**: Breakdown of deferred Phase 4, Phase 5, and Phase 6 features with estimated complexities.
