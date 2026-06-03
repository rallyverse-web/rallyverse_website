# Payment Verification Workflows

RallyVerse relies on an offline UPI transaction matching workflow combined with sub-admin dashboard verification. This balances friction-free player registration with administrative control.

---

## 🔁 Verification Lifecycle

```
[Registration Form Completed]
           │
           ▼
[Render Custom Payment Box] ──► Displays UPI ID, Account Name, Mobile Number
           │
           ▼
[Client Completes Payment]
           │
           ▼
[Sends Screenshot on WhatsApp] ──► Chat initiated via wa.me link with prefilled message
           │
           ▼
[Sub-Admin Verifies Payment]  ──► Matches UPI Transaction ID against statement
           │
           ▼
[Click "Approve" on Dashboard] ──► Changes database state & fires Resend template email
```

---

## 📋 Step-by-Step Operations

### 1. Payment Display
Upon filling out the registration form at `/events/[slug]/register`, the page fetches the dynamic configuration from `event_payment_config`.
The player is presented with:
- **Merchant UPI ID**
- **Registered Name**
- **Mobile Number**
- The registration status is initialized as `Pending`.

### 2. Prefilled WhatsApp Communication
The client success screen provides a CTA link pointing to `https://wa.me/{number}?text={encoded_message}`.
The message contains:
- **Player Name**
- **Unique Registration ID**
- **Event Name**
- **Category Format**
This message allows the user to immediately send their screenshot with clear transaction metadata.

### 3. Sub-Admin Reconciliation
1. The assigned event admin opens the dashboard at `/event-admin/dashboard` using their secure login token.
2. The admin views the `Pending` registration list.
3. The admin audits the merchant app or bank statement to check for a matching payment from the player's name, phone, or UPI ID.
4. If matched, the admin clicks **Approve**. This marks the database entry as `Approved`, logs the action under the admin's `approved_by` column, and sends out the confirmation email automatically.
5. If the payment cannot be reconciled, the admin clicks **Reject**, specifying a reason (e.g. "Payment screenshot not received"). This triggers a rejection feedback email.
