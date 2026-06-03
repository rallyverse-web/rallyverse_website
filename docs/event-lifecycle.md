# Event Lifecycle & Playbook

This document outlines the standard operational playbook for running a RallyVerse campaign, tracing steps from concept creation to tournament completion.

---

## 🔄 Lifecycle Pipeline Flowchart

```
┌──────────────┐      ┌──────────────────┐      ┌────────────────────┐
│ Create Event │ ───► │ Configure Payment│ ───► │ Configure WhatsApp │
└──────────────┘      └────────┬─────────┘      └────────┬───────────┘
                               │                         │
                               ▼                         ▼
┌──────────────┐      ┌──────────────────┐      ┌────────────────────┐
│Publish Event │ ◄─── │Assign Event Admin│      │ Seed Email Defaults│
└──────┬───────┘      └──────────────────┘      └────────────────────┘
       │
       ▼
┌──────────────┐      ┌──────────────────┐      ┌────────────────────┐
│Registrations │ ───► │ Pay Verification │ ───► │ Player Approval/   │
│     Open     │      │   via WhatsApp   │      │ Rejection Emails   │
└──────────────┘      └──────────────────┘      └────────┬───────────┘
                                                         │
                                                         ▼
┌──────────────┐      ┌──────────────────┐      ┌────────────────────┐
│Event Finished│ ◄─── │  Run Tournament  │ ◄─── │ Send Bulk Reminders│
│ & Results EM │      │    (Check-in)    │      │    & Check-ins     │
└──────────────┘      └──────────────────┘      └────────────────────┘
```

---

## 📋 Standard Operating Procedures (SOP)

### Step 1: Create Event
- **Action**: Founder goes to `/admin/events` and clicks **Create Event**.
- **Details**: Fills out the metadata, chooses the category (e.g. Badminton), and checks the tournament formats. Seeding defaults runs automatically, preparing standard emails and settings.
- **Database State**: `events.status = 'draft'`.

### Step 2: Configure Payment
- **Action**: Founder clicks **Payment** on the newly created event row.
- **Details**: Configures the tournament's specific merchant UPI ID, account holder name, and verification contact number.
- **Database Table**: Writes to `event_payment_config`.

### Step 3: Configure WhatsApp
- **Action**: Founder sets up a dedicated WhatsApp group for the tournament and links it to the event page.
- **Details**: Updates `whatsapp_number` and `whatsapp_group_link` fields.
- **Database Table**: Writes to `events` columns.

### Step 4: Assign Event Admin
- **Action**: Founder clicks **Admins** on the event row.
- **Details**: Enters the sub-admin's name and email. The system generates a secure, unique login token.
- **Database Table**: Writes to `event_admins` table.

### Step 5: Publish Event
- **Action**: Founder changes status to **Published** or clicks **Publish**.
- **Details**: The event is rendered publicly at `/events/[slug]` and accepting registrations.
- **Database State**: `events.status = 'published'`.

### Step 6: Registrations
- **Action**: Players load `/events/[slug]/register` and fill out registration details.
- **Details**: Form restricts categories to available formats. Players are directed to submit their entry fee via the displayed UPI ID.
- **Database Table**: Writes to `registrations` with `status = 'Pending'`.

### Step 7: Payment Verification
- **Action**: Players send screenshots of their UPI transactions on WhatsApp.
- **Details**: Sub-admins audit mobile banking or merchant statements to cross-reference transactions against the `upiId` or name.

### Step 8: Approvals & Rejections
- **Action**: Admin accesses the dashboard at `/event-admin/dashboard` using their token and approves/rejects the player.
- **Details**:
  - **Approve**: Set status to `Approved`. Trigger transactional Resend email.
  - **Reject**: Set status to `Rejected` and note issues (e.g., mismatched screenshot). Mails out feedback to player.
- **Database State**: `registrations.status = 'Approved'` or `'Rejected'`.

### Step 9: Email Communication
- **Action**: Admins utilize the dashboard to send reminders and schedules.
- **Details**:
  - Bulk email reminders are triggered for tournament fixtures and check-in instructions.
  - Transactions are recorded in `email_logs`.

### Step 10: Event Day & Completion
- **Action**: Tournament is played on-court. Upon completion, admins input rankings.
- **Details**: Admins send out custom templates with final leaderboard standings. The event is updated to `completed`, locking registrations.
- **Database State**: `events.status = 'completed'`.
