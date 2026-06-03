# Communication Subsystem Documentation

RallyVerse v2.0 provides founders and event sub-admins with built-in channels to communicate with players in bulk or via automated transaction flows.

---

## 📧 Automated Notification Triggers

Transactional emails trigger automatically upon status changes inside administrative dashboards:

### 1. Registration Received
- **Trigger**: User registers at `/events/[slug]/register`.
- **Template**: `registrationReceivedEmail`
- **Delivery**: Instant delivery via Resend. Prompts the user to finalize payment and join the WhatsApp community.

### 2. Payment Verified & Approved
- **Trigger**: Admin clicks **Approve** on the dashboard.
- **Template**: Custom `approval` template from database.
- **Delivery**: Confirms spot booking, check-in schedules, and rules.

### 3. Payment Rejected
- **Trigger**: Admin clicks **Reject** on the dashboard.
- **Template**: Custom `rejection` template from database.
- **Delivery**: Details validation issues and outlines next steps.

---

## 📢 Administrative Manual Triggers

Admins can broadcast communications manually from the **Communication** panel:

### 1. Reminders & Announcements
- **Action**: Load the template edit screen.
- **Type**: `reminder` or `broadcast`
- **Use Case**: Update players on match schedule draws, venue changes, or weather warnings.
- **Audience**: Can be filtered to all registrants or only approved players.

### 2. Tournament Standings & Results
- **Action**: Select the `results` template.
- **Details**: Input final tournament brackets and player standings.
- **Delivery**: Sent to all players at the end of the event day.

---

## ⚙️ Batching & Rate Limiting
To prevent email throttling issues at the gateway, bulk sends are batches of **5 recipients** with a **1000ms delay** between iterations:
```typescript
const batchSize = options?.batchSize ?? 5
const batchDelay = options?.batchDelay ?? 1000
```
This matches Resend's free-tier rate limits and safeguards against transaction failures.
