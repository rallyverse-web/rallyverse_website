# Event Admin Operations Manual

This guide is written for Event Coordinators (Sub-Admins) to manage player registrations, verify payments, send notifications, and review metrics for their assigned tournament campaigns.

---

## 🔑 Logging In

1. Navigate to `https://rallyverse.social/event-admin`.
2. Enter your unique **Access Token** (provided by the Founder) in the password field.
3. Click **Sign In**.
4. You will be redirected to your dashboard, scoped to your assigned event.

---

## 🏸 Registration & Payment Verification

The core task of a sub-admin is verifying player payment screenshots submitted via WhatsApp.

### Step-by-Step Approval Workflow:
1. Open the WhatsApp Web interface or phone chat.
2. Review incoming player messages containing payment screenshot confirmations and unique **Registration IDs** (e.g. `RV-5243-XX`).
3. Cross-reference the player's name and UPI transaction ID against your merchant account statement.
4. On the dashboard, locate the registration record (you can search by name or Registration ID).
5. Open details by clicking the **Eye icon**.
6. If payment is matched and verified:
   - Click **Approve**.
   - The status changes to `Approved`.
   - The player is automatically sent a template **Confirmation Email** containing check-in guidelines and WhatsApp community group access.
7. If payment is invalid, duplicate, or screenshot is missing:
   - Click **Reject**.
   - In the pop-up, choose or specify a reason (e.g. "Transaction ID not found").
   - The status changes to `Rejected`.
   - The player is automatically sent a template **Action Required Email**.

---

## 🗑️ Registration Deletion
- In cases where a player double-registers, requests cancellation, or submits fraudulent entries, click the **Trash icon** on their row.
- Confirm deletion in the pop-up modal. This removes the record from the database.

---

## 📧 Outbound Emails & Messaging

Manage campaign communications from the **Communication** dashboard tab:

### 1. Verification Emails
- Trigger confirmation emails to individual players manually if they request a resend by clicking **Notify** on their registration row.

### 2. Broadcasts
- Prepare a general update message in the **Broadcast** template.
- Review variables (e.g. `{event_name}`) and click **Send Broadcast** to email all registered players.

### 3. Reminders
- Trigger scheduled reminders (e.g. 24 hours before the event) by choosing the **Reminder** template. This alerts players about rules, attire, and check-in times.

### 4. Tournament Results
- Once the tournament completes, edit the **Results** email template to display final brackets and rankings.
- Click **Send Results** to notify participants.

---

## 📉 Real-time Analytics & CSV Exports

- **Dashboard Charts**: Review views vs clicks tracking trends, check email success rates, and monitor category slot fill rates.
- **CSV Export**: Click **Export CSV** to download the player registrations log. This spreadsheet contains player columns, status codes, partner details, and payment UPIs — useful for offline draws, brackets scheduling, or tournament software imports.
