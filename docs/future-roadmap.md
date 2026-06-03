# Feature Backlog & Future Roadmap

This document outlines feature extensions and architectural iterations deferred to future release cycles (Phases 4, 5, and 6) that are intentionally **not** part of RallyVerse v2.0.

---

## 📅 Phase 4: Operational Hardening

Features targeted at improving tournament operations and coordinator workflows.

### 1. Audit Logs
- **Problem it Solves**: Lack of transaction history tracking on admin actions (who approved a registration, when a template was modified, or when a token was regenerated).
- **Why Deferred**: v2.0 focuses on core registration and payment verification. A simple `approved_by` column on registrations covers immediate needs.
- **Estimated Complexity**: Low (requires a single log table and hooks inside API actions).

### 2. QR Check-In System & Attendance Tracking
- **Problem it Solves**: Long registration queues at physical venues on tournament day.
- **Why Deferred**: Can be handled manually using printed CSV registration lists in Phase 2/3.
- **Estimated Complexity**: Medium (requires generating unique QR codes in approval emails and building a scanner view on `/event-admin`).

### 3. Refund Management
- **Problem it Solves**: Player cancellations require manual banking transaction reversals.
- **Why Deferred**: RallyVerse operates on an offline payment structure; refunds are handled manually via cash or direct UPI.
- **Estimated Complexity**: High (requires integrating standard payment gateway APIs like Razorpay or Cashfree).

### 4. Waitlists
- **Problem it Solves**: Prevents lost revenue when capacity limits are hit but players cancel.
- **Why Deferred**: v2.0 stops accepting sign-ups once capacity is reached. Adding waitlist states adds complexity to registration form views.
- **Estimated Complexity**: Medium.

### 5. Discount Codes
- **Problem it Solves**: Inability to run promotional rates or early-bird pricing.
- **Why Deferred**: Overrides can be handled manually by altering pricing configurations, or by creating a separate temporary event campaign.
- **Estimated Complexity**: Low.

---

## 🔒 Phase 5: Advanced Authentication & Tenant Isolation

Moving from simple password/token access to robust multi-tenant authentication.

### 1. Supabase Auth & Multi-Role Authentication
- **Problem it Solves**: Current dashboards use single system-wide `ADMIN_PASSWORD` (for Founders) and basic tokens (for Event Admins). There is no user profiling (no passwords, reset links, or profile pictures).
- **Why Deferred**: Token-based auth is secure, lightweight, and requires no registration/recovery workflows for sub-admins.
- **Estimated Complexity**: Medium (utilizes Supabase Auth GoTrue service).

### 2. Founder Accounts & Organization Management
- **Problem it Solves**: Inability to host multiple sports clubs or distinct event brands on the platform.
- **Why Deferred**: RallyVerse currently functions as a single-organization platform.
- **Estimated Complexity**: High (requires tenant tables, schema isolation, and organizational keys).

---

## 📱 Phase 6: Mobile Experience & Automations

Building out native applications and messaging triggers.

### 1. Native Mobile App
- **Problem it Solves**: Web dashboards are hard to use on-court under sunlight; lacking offline support for coordinates.
- **Why Deferred**: Next.js dashboards are fully responsive and work well on mobile browsers.
- **Estimated Complexity**: High (requires React Native or Flutter codebase).

### 2. Push Notifications
- **Problem it Solves**: Mails land in promotion folders; players miss match call times.
- **Why Deferred**: System relies on WhatsApp messages and notifications, which have higher open rates.
- **Estimated Complexity**: Medium (requires Web Push APIs or Expo Push notification channels).

### 3. WhatsApp Automations
- **Problem it Solves**: Manual verification of payment screenshots on WhatsApp is slow.
- **Why Deferred**: Manual reconciliation is highly reliable and prevents fraud at zero cost.
- **Estimated Complexity**: High (requires Meta Business API approval, templates approval, and webhook endpoint processing).
