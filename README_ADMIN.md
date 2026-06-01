# RallyVerse Registration & Admin System

A complete registration and admin management system for the RallyVerse Badminton Tournament. Built with Next.js, Google Sheets, and Resend.

---

## 1. Overview

### What It Does

The RallyVerse Registration & Admin System handles the entire lifecycle of a tournament registration:

1. A player fills out a registration form on the website
2. Their data is stored in a Google Sheet (the database)
3. An automatic "Registration Received" email is sent to them
4. An admin verifies payment manually in the sheet
5. Once verified, the admin clicks a button to send a "Registration Confirmed" email
6. The sheet is updated automatically to track confirmation status

### Architecture

```
User Registration
       │
       ▼
Website Form (rallyverse.social/register)
       │
       ▼
Google Sheets (the database — all data lives here)
       │
       ▼
Admin Dashboard (rallyverse.social/admin — password protected)
       │
       ▼
Confirmation Email (sent via Resend)
```

**Key principle**: Google Sheets is the single source of truth. Every registration is appended as a new row — existing data is never overwritten.

### Components

| Component | Purpose |
|-----------|---------|
| Registration Form (rallyverse.social/register) | 3-step form where players enter their details |
| Google Sheet | Stores all registration data as rows |
| Admin Dashboard (rallyverse.social/admin) | Password-protected panel for managing registrations |
| Resend | Email delivery service — sends registration received and confirmation emails |

---

## 2. Registration Workflow

### Step 1 — Player Fills Registration Form

The player visits `rallyverse.social/register` and completes a 3-step form:

- **Step 1**: Select category (Men's Singles, Women's Singles, Men's Doubles, etc.) and optional team name
- **Step 2**: Enter player details (name, phone, email, skill level, city, college/organization)
- **Step 3**: Enter payment details (UTR/transaction ID, phone number used for payment)

### Step 2 — Registration Stored in Google Sheets

When the form is submitted:

- A unique Registration ID is generated (e.g., `RV-260531-7421`)
- The registration date is recorded in IST timezone
- All form data is written as a **new row** in the Google Sheet
- Default values are applied:
  - Payment Status = `Pending`
  - Verification Status = `Pending`
  - Confirmation Sent = `No`
  - WhatsApp Group Joined = `No`
  - Confirmation Date = (blank)
  - Remarks = (blank)

### Step 3 — Player Receives "Registration Received" Email

If the player provided an email address, they automatically receive an email with:

- Their Registration ID
- A request to send a payment screenshot on WhatsApp
- A link to join the tournament WhatsApp group

This email is sent immediately and does **not** block the registration if it fails.

### Step 4 — Admin Verifies Payment

An admin opens the Google Sheet and checks the player's payment:

1. Look at the Transaction ID / UTR Number column (P)
2. Verify the payment in the UPI/banking app
3. Update Payment Status (S) to one of: `Paid`, `Failed`, or `Refunded`
4. Update Verification Status (T) to `Verified` or `Rejected`

### Step 5 — Admin Changes Verification Status to Verified

In the Google Sheet, the admin:

1. Finds the player's row
2. Sets `Payment Status` (column S) to `Paid`
3. Sets `Verification Status` (column T) to `Verified`

### Step 6 — Admin Clicks "Send Confirmation Emails"

In the Admin Dashboard at `rallyverse.social/admin`:

1. Log in with the admin password
2. View the metrics to see how many verified registrations are pending confirmation
3. Click **"Send Confirmation Emails"**

### Step 7 — System Sends Confirmation Email

The system:

1. Reads the Google Sheet
2. Finds all rows where Verification Status = `Verified` AND Confirmation Sent = `No`
3. For each matching row, sends a confirmation email via Resend

The email includes:

- Confirmation that their registration is verified
- A link to join the WhatsApp group
- Event details

### Step 8 — Confirmation Sent Updates to Yes

For each successful email:

- `Confirmation Sent` (column U) is updated to `Yes`
- `Confirmation Date` (column W) is updated with the current date and time

If the email fails (invalid address, Resend error, etc.), **the sheet is not updated** — the row remains eligible for the next attempt.

---

## 3. Google Sheet Structure

The Google Sheet has **24 columns** (A through X). Each row represents one registration.

| Column | Header | Purpose | Example Value | Managed By |
|--------|--------|---------|---------------|------------|
| A | Registration ID | Unique identifier for each registration | `RV-260531-7421` | Auto-generated |
| B | Registration Date | Date and time of registration (IST) | `31/05/2026, 08:15 PM` | Auto-generated |
| C | Category | Tournament category | `Men's Singles` | From form |
| D | Team Name (Optional) | Team name for doubles categories | `The Smashers` | From form (optional) |
| E | Player 1 Name | Full name of player 1 | `Rahul Sharma` | From form |
| F | Player 1 Phone | WhatsApp number of player 1 | `+91 98765 43210` | From form |
| G | Player 1 Email | Email address of player 1 | `rahul@example.com` | From form (optional) |
| H | Player 1 Skill Level | Self-assessed skill level | `Intermediate` | From form |
| I | Player 2 Name | Full name of player 2 (doubles only) | `Priya Singh` | From form |
| J | Player 2 Phone | WhatsApp number of player 2 | `+91 87654 32109` | From form |
| K | Player 2 Email | Email address of player 2 | `priya@example.com` | From form (optional) |
| L | Player 2 Skill Level | Skill level of player 2 | `Advanced` | From form |
| M | City | Player's city | `Bengaluru` | From form |
| N | College/Organization | College or organization | `RV College of Engineering` | From form (optional) |
| O | Amount Paid | Entry fee amount | `800` | Auto-filled from config |
| P | Transaction ID / UTR Number | Payment UTR or transaction ID | `HDFC12345678` | From form |
| Q | Payment Phone Number | Phone used for payment | `+91 98765 43210` | From form |
| R | Payment Screenshot Link | Link to uploaded payment screenshot | (blank — manual upload) | Manual |
| S | Payment Status | Payment verification status | `Pending` / `Paid` / `Failed` / `Refunded` | Admin (manual) |
| T | Verification Status | Overall verification status | `Pending` / `Verified` / `Rejected` | Admin (manual) |
| U | Confirmation Sent | Whether confirmation email was sent | `No` / `Yes` | Auto-updated |
| V | WhatsApp Group Joined | Whether player joined the WhatsApp group | `No` / `Yes` | Admin (manual) |
| W | Confirmation Date | When confirmation email was sent | `01/06/2026, 10:30 AM` | Auto-updated |
| X | Remarks | Free text notes | `Called player — will pay tomorrow` | Admin (manual) |

### Status Values

**Payment Status** (column S):
- `Pending` — default; payment not yet verified
- `Paid` — payment confirmed
- `Failed` — payment failed or insufficient
- `Refunded` — payment refunded

**Verification Status** (column T):
- `Pending` — default; not yet reviewed
- `Verified` — registration approved
- `Rejected` — registration rejected (with reason in Remarks)

**Confirmation Sent** (column U):
- `No` — default; confirmation email not sent
- `Yes` — confirmation email sent successfully

**WhatsApp Group Joined** (column V):
- `No` — default; not yet joined
- `Yes` — player confirmed joined

---

## 4. Admin Dashboard Guide

### Accessing the Admin Dashboard

**URL**: `https://rallyverse.social/admin`

The admin page is protected by a password. When you visit the page, you'll see a login screen asking for the admin password.

**How login works**:

1. Enter the `ADMIN_PASSWORD` (set by the developer)
2. Click "Sign In"
3. If the password is correct, the dashboard appears
4. Click "Sign Out" in the top-right to log out

> The password is stored in the server's environment variables — never in the code. It is set during deployment.

[Add Screenshot: Admin Login Screen]

---

### Dashboard Metrics

After logging in, you'll see four metric cards:

| Metric | What It Shows |
|--------|---------------|
| **Total Registrations** | Total number of rows in the sheet (excluding the header) |
| **Pending Payments** | Number of registrations where Payment Status = `Pending` |
| **Verified Registrations** | Number of registrations where Verification Status = `Verified` |
| **Confirmations Sent** | Number of registrations where Confirmation Sent = `Yes` |

These numbers update automatically when the page loads. Clicking "Send Confirmation Emails" also refreshes them.

[Add Screenshot: Dashboard with Metric Cards]

---

### Sending Confirmation Emails

This is the primary admin action. It sends confirmation emails to all verified registrations that haven't received one yet.

**Step-by-step**:

1. **Verify payment in Google Sheets**
   - Open the Google Sheet
   - Find the player's row
   - Set `Payment Status` (column S) to `Paid`
   - Set `Verification Status` (column T) to `Verified`

2. **Go to the Admin Dashboard** at `rallyverse.social/admin`

3. **Click "Send Confirmation Emails"**
   - The system reads the sheet and finds all rows where:
     - Verification Status = `Verified`
     - Confirmation Sent = `No`
   - It sends an email to each player's email address
   - On success: `Confirmation Sent` becomes `Yes`, `Confirmation Date` is filled
   - On failure: the sheet is **not** updated (the row stays eligible)

4. **Check the result message**
   - Green: `Confirmation emails sent: 5, failed: 0`
   - Red (if failures): `Confirmation emails sent: 4, failed: 1`

[Add Screenshot: Send Confirmation Emails Button with Result]

---

## 5. Environment Variables

The system uses environment variables for all configuration. These must be set in the deployment environment (Vercel) and in the `.env` file for local development.

### ADMIN_PASSWORD

| Property | Value |
|----------|-------|
| **Purpose** | Protects the admin dashboard at `/admin`. Anyone who knows this password can access the dashboard. |
| **Example** | `ADMIN_PASSWORD=rallyverse-admin-2025` |
| **Required** | Yes |
| **Set in** | `.env` file (local), Vercel Environment Variables (production) |

### RESEND_API_KEY

| Property | Value |
|----------|-------|
| **Purpose** | API key for Resend, the email delivery service. Without this, no emails are sent. |
| **Example** | `RESEND_API_KEY=re_B1EJ23C9_9Zz5oeTRxJ4Zi1tjtgyuhvEr` |
| **Required** | Yes (for emails) |
| **Set in** | `.env` file (local), Vercel Environment Variables (production) |
| **How to get** | Create an account at [resend.com](https://resend.com) → Create API key |

### GOOGLE_SHEET_ID

| Property | Value |
|----------|-------|
| **Purpose** | The ID of the Google Sheet that stores all registration data. You can find this in the sheet's URL. |
| **Example** | `GOOGLE_SHEET_ID=1Jy3JXFJDeTFrmEn7Hq-saNsF6hBHKk18e6J5RQr7i-E` |
| **Required** | Yes |
| **Set in** | `.env` file (local), Vercel Environment Variables (production) |
| **How to find** | Open the sheet → look at the URL → it's the long string between `/d/` and `/edit` |

### GOOGLE_SHEET_TAB_NAME

| Property | Value |
|----------|-------|
| **Purpose** | The name of the specific tab/sheet within the Google Sheet file. Defaults to `Sheet1` if not set. |
| **Example** | `GOOGLE_SHEET_TAB_NAME=Registrations` |
| **Required** | No (defaults to `Sheet1`) |
| **Set in** | `.env` file (local), Vercel Environment Variables (production) |

### GOOGLE_SERVICE_ACCOUNT_EMAIL

| Property | Value |
|----------|-------|
| **Purpose** | Email address of the Google Service Account that has access to the sheet. The sheet must be shared with this email. |
| **Example** | `GOOGLE_SERVICE_ACCOUNT_EMAIL=rally-verse@rally-verse-event-registration.iam.gserviceaccount.com` |
| **Required** | Yes |
| **Set in** | `.env` file (local), Vercel Environment Variables (production) |

### GOOGLE_PRIVATE_KEY

| Property | Value |
|----------|-------|
| **Purpose** | Private key for the Google Service Account. This is the secret that allows the system to authenticate with Google Sheets. |
| **Example** | `GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"` |
| **Required** | Yes |
| **Important** | Must include `\n` for line breaks. The key is long — copy it exactly as shown in the JSON key file. |
| **Set in** | `.env` file (local), Vercel Environment Variables (production) |

### GOOGLE_DRIVE_FOLDER_ID

| Property | Value |
|----------|-------|
| **Purpose** | Google Drive folder ID for storing uploaded payment screenshots (not yet used, reserved for future). |
| **Example** | `GOOGLE_DRIVE_FOLDER_ID=1CaHLt0TgQymiGMW70wUkiGLPBqeJh0tX` |
| **Required** | No |
| **Set in** | `.env` file (local), Vercel Environment Variables (production) |

### NEXT_PUBLIC_SITE_URL

| Property | Value |
|----------|-------|
| **Purpose** | The public URL of the website. |
| **Example** | `NEXT_PUBLIC_SITE_URL=https://rallyverse.social` |
| **Required** | Yes |

### NEXT_PUBLIC_UPI_ID

| Property | Value |
|----------|-------|
| **Purpose** | The UPI ID shown to players on the payment step of the registration form. |
| **Example** | `NEXT_PUBLIC_UPI_ID=adityag.007@ptaxis` |
| **Required** | Yes |

### NEXT_PUBLIC_ENTRY_FEE

| Property | Value |
|----------|-------|
| **Purpose** | The entry fee (in INR) displayed on the payment step and recorded in the Amount Paid column. |
| **Example** | `NEXT_PUBLIC_ENTRY_FEE=800` |
| **Required** | Yes |

### NEXT_PUBLIC_WHATSAPP_NUMBER

| Property | Value |
|----------|-------|
| **Purpose** | The WhatsApp number displayed on the success screen after registration. Players are asked to send payment screenshots here. |
| **Example** | `NEXT_PUBLIC_WHATSAPP_NUMBER=+91 98765 43210` |
| **Required** | Yes |

### NEXT_PUBLIC_WHATSAPP_GROUP_LINK

| Property | Value |
|----------|-------|
| **Purpose** | The invite link to the official tournament WhatsApp group. Shown on the success screen and in all emails. |
| **Example** | `NEXT_PUBLIC_WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/REPLACE_WITH_ACTUAL_LINK` |
| **Required** | Yes |

### Configuring for Local Development

1. Copy the `.env` file to the project root
2. Fill in all values (ask the developer for secrets)
3. Run `npm run dev` to start the local server

### Configuring for Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable with its value
4. Redeploy the project
5. Verify by visiting the admin dashboard

> **Important**: Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not put secrets there. All `GOOGLE_*`, `RESEND_API_KEY`, and `ADMIN_PASSWORD` are server-only.

---

## 6. Google Sheets Setup

### Step 1: Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Name it something like "RallyVerse Registrations"
3. Rename the default tab (bottom-left) to `Sheet1` or set `GOOGLE_SHEET_TAB_NAME` to whatever you name it

### Step 2: Add the Header Row

Add the following headers in **Row 1** (one per column):

```
A1: Registration ID
B1: Registration Date
C1: Category
D1: Team Name (Optional)
E1: Player 1 Name
F1: Player 1 Phone
G1: Player 1 Email
H1: Player 1 Skill Level
I1: Player 2 Name
J1: Player 2 Phone
K1: Player 2 Email
L1: Player 2 Skill Level
M1: City
N1: College/Organization
O1: Amount Paid
P1: Transaction ID / UTR Number
Q1: Payment Phone Number
R1: Payment Screenshot Link
S1: Payment Status
T1: Verification Status
U1: Confirmation Sent
V1: WhatsApp Group Joined
W1: Confirmation Date
X1: Remarks
```

### Step 3: Copy the Sheet ID

Look at the URL in your browser. It looks like:

```
https://docs.google.com/spreadsheets/d/1Jy3JXFJDeTFrmEn7Hq-saNsF6hBHKk18e6J5RQr7i-E/edit
```

The long string after `/d/` is the Sheet ID. Copy it — you'll need it for `GOOGLE_SHEET_ID`.

### Step 4: Create a Google Service Account

A service account is a special Google account that lets the website read and write to the sheet automatically.

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Go to **APIs & Services → Library**
4. Search for and enable **Google Sheets API**
5. Go to **APIs & Services → Credentials**
6. Click **Create Credentials → Service Account**
7. Give it a name (e.g., "RallyVerse Service Account")
8. Click **Done**

### Step 5: Generate a Key

1. In the service accounts list, click on the one you just created
2. Go to the **Keys** tab
3. Click **Add Key → Create New Key**
4. Choose **JSON** and click **Create**
5. A JSON file will download — **keep this safe**, it contains the private key

From this JSON file, extract:
- `client_email` → use as `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → use as `GOOGLE_PRIVATE_KEY` (including the `\n` line breaks)

### Step 6: Share the Sheet with the Service Account

1. Open your Google Sheet
2. Click the **Share** button (top-right)
3. Paste the service account email (e.g., `rally-verse@rally-verse-event-registration.iam.gserviceaccount.com`)
4. Set permission to **Editor**
5. Click **Send**

### Step 7: Configure Environment Variables

Set `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` in your `.env` file and in Vercel.

### Step 8: Test

1. Start the local server: `npm run dev`
2. Submit a test registration at `https://rallyverse.social/register`
3. Check the Google Sheet — a new row should appear with the data

---

## 7. Resend Setup

Resend is the email delivery service that sends "Registration Received" and "Registration Confirmed" emails.

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier includes 100 emails/day)
3. Verify your email address

### Step 2: Create an API Key

1. Go to the [API Keys](https://resend.com/api-keys) page
2. Click **Create API Key**
3. Give it a name (e.g., "RallyVerse Registration")
4. Copy the key — it starts with `re_`
5. Set it as `RESEND_API_KEY` in your environment variables

### Step 3: Configure Domain (Optional but Recommended)

For production, you should use your own domain instead of `onboarding@resend.dev`. The application now uses `registrations@rallyverse.social` as the sender.

1. Go to [Domains](https://resend.com/domains) in Resend
2. Click **Add Domain**
3. Enter your domain (e.g., `rallyverse.social`)
4. Resend will give you DNS records to add to your domain provider
5. Add the DNS records (TXT, CNAME) at your domain registrar
6. Wait for verification (can take a few minutes to 24 hours)
7. Update the `from` field in `lib/config.ts` from `onboarding@resend.dev` to your domain

### Step 4: Test Email Delivery

1. Submit a test registration with a valid email address
2. Check the email inbox — you should receive a "Registration Received" email
3. If not, check the server logs for errors

---

## 8. Troubleshooting

### Registrations Not Appearing in the Sheet

**Possible causes and fixes:**

| Cause | Fix |
|-------|-----|
| Google Sheet not shared with service account | Open the sheet → Share → add the service account email as Editor |
| Wrong Sheet ID | Check the URL — the ID is the long string between `/d/` and `/edit` |
| Wrong tab name | Make sure `GOOGLE_SHEET_TAB_NAME` matches the actual tab name (case-sensitive) |
| Service account permissions | In Google Cloud Console, verify the Google Sheets API is enabled |
| Network error | Check the browser console (F12 → Console) and server logs for error details |

### Emails Not Sending

**Possible causes and fixes:**

| Cause | Fix |
|-------|-----|
| Invalid Resend API key | Check `RESEND_API_KEY` is set correctly in environment variables |
| Domain not verified | When using a custom domain, verify DNS records in Resend |
| Resend rate limit | Free tier: 100 emails/day, 2 emails/second |
| Player didn't provide email | Emails are only sent if the player fills in their email address |
| Resend API error | Check server logs for the exact error message |

### Confirmation Emails Not Updating the Sheet

**Possible causes and fixes:**

| Cause | Fix |
|-------|-----|
| Sheet write permissions | Verify the service account has Editor access to the sheet |
| Service account key expired | Generate a new JSON key in Google Cloud Console |
| Incorrect column mapping | Ensure the sheet has all 24 columns (A through X) with the correct headers |
| API error | Check the server logs for the error message |

### Admin Page Inaccessible

**Possible causes and fixes:**

| Cause | Fix |
|-------|-----|
| Wrong `ADMIN_PASSWORD` | Check the value in environment variables matches what you're typing |
| `ADMIN_PASSWORD` not set | Add it to the `.env` file or Vercel environment variables |
| Deployment not updated | After changing env vars, redeploy the project on Vercel |
| Wrong URL | Make sure you're visiting `https://rallyverse.social/admin` (not `/Admin` or `/admin/`) |

### 401 Unauthorized Error on Admin API

This means the password sent from the browser doesn't match `ADMIN_PASSWORD`. Try:

1. Clearing your browser cache and cookies for the site
2. Signing out and signing back in with the correct password
3. Checking that `ADMIN_PASSWORD` hasn't been changed in the environment variables

---

## 9. Operational Checklist

### Before the Event

- [ ] **Verify registrations** — Open the Google Sheet and review all entries. Make sure player names, phone numbers, and categories look correct.
- [ ] **Check payment statuses** — Go through each row and verify the payment using the Transaction ID / UTR Number. Update Payment Status to `Paid` or `Failed`.
- [ ] **Verify registrations** — For each paid registration, update Verification Status to `Verified`.
- [ ] **Send confirmations** — Log in to the Admin Dashboard and click "Send Confirmation Emails".
- [ ] **Verify WhatsApp group joins** — Check the WhatsApp group to see who has joined. Update `WhatsApp Group Joined` to `Yes` for those who have.
- [ ] **Follow up on pending** — Contact players with `Pending` payment or verification status to resolve issues.
- [ ] **Export participant list** — Download the sheet as CSV or Excel for offline reference.

### On Event Day

- [ ] **Export participant list** — Download the latest version of the sheet. Filter to show only `Verified` registrations where `Confirmation Sent = Yes`.
- [ ] **Verify confirmed registrations** — Cross-check the participant list against check-in at the venue.
- [ ] **Handle walk-ins** — If accepting on-the-day registrations, add them manually to the sheet or have the form available.

### After the Event

- [ ] **Archive the sheet** — Make a copy of the Google Sheet and store it in a Google Drive folder for records.
- [ ] **Export participant data** — Download a final CSV/Excel file with all registrations and their final statuses.
- [ ] **Mark WhatsApp group joins** — Update `WhatsApp Group Joined` for any remaining players.
- [ ] **Add remarks** — Add any notes to the `Remarks` column (e.g., "Attended", "No-show", "Refund issued").
- [ ] **Notify bounced / rejected** — Contact players whose registrations were rejected with a reason.

---

## 10. Future Improvements

These enhancements are planned for future versions of the system:

### Automated Payment Verification

- Integrate with a payment gateway (Razorpay, PhonePe, etc.) to automatically detect and verify payments
- Eliminate the manual step of checking UTR numbers

### Automatic WhatsApp Tracking

- Use the WhatsApp Business API to detect when a player joins the group
- Auto-update `WhatsApp Group Joined` status

### Admin User Accounts

- Replace the shared `ADMIN_PASSWORD` with individual user accounts
- Add role-based permissions (viewer vs. editor)
- Track which admin performed each action

### Analytics Dashboard

- Visual charts for registration trends, categories, cities
- Export reports as PDF/Excel
- Real-time registration counter

### Multi-Event Support

- Support multiple tournaments or events from a single dashboard
- Each event gets its own sheet or tab
- Admins can switch between events

### Payment Screenshot Upload

- Allow players to upload payment screenshots directly in the form
- Store screenshots in Google Drive
- Display screenshot preview in the admin dashboard

### Automated Reminders

- Send WhatsApp reminders to players who haven't paid
- Send event day reminders to confirmed players
- Follow-up emails for incomplete registrations

---

## Appendix: Quick Reference

### URLs

| Page | URL |
|------|-----|
| Registration Form | `https://rallyverse.social/register` |
| Admin Dashboard | `https://rallyverse.social/admin` |
| Google Sheet | (see `GOOGLE_SHEET_ID` in env vars) |

### Key Commands (for developers)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type check
npx tsc --noEmit
```

### File Structure (relevant files)

```
├── .env                          ← Environment variables (secrets)
├── app/
│   ├── admin/
│   │   └── page.tsx              ← Admin dashboard (password protected)
│   ├── api/
│   │   ├── admin/
│   │   │   ├── metrics/route.ts  ← Dashboard data endpoint
│   │   │   └── send-confirmations/ ← Confirmation email endpoint
│   │   └── register/route.ts     ← Registration submission endpoint
│   ├── register/
│   │   └── page.tsx              ← Registration form page
│   └── page.tsx                  ← Homepage
├── components/
│   └── RegistrationForm.tsx      ← 3-step registration form
├── lib/
│   ├── google.ts                 ← Google Sheets API client
│   └── utils.ts                  ← Utility functions (ID generation, etc.)
└── README_ADMIN.md               ← This file
```
