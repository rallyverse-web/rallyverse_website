# RallyVerse Configuration Guide

> **Last updated:** June 2026
>
> All RallyVerse contact information, event categories, and site-wide values
> are centralized in a single file. Edit that one file to update everywhere.

---

## Single Source of Truth

**File:** `lib/config.ts`

All pages, components, API routes, and email templates import from this file.
No hardcoded duplicates remain anywhere in the codebase.

---

## If I need to update the email later

**Edit this file:** `lib/config.ts`

Look for the `CONTACT.email` and `EMAIL.supportEmail` / `EMAIL.replyTo` properties.

Current value:

```
rallyverseofficial@gmail.com
```

There are two properties to update (same value currently):

| Property | Line |
|---|---|
| `CONTACT.email` | ~21 |
| `EMAIL.replyTo` | ~13 |
| `EMAIL.supportEmail` | ~14 |

Also check that `SOCIAL.email` uses `mailto:${CONTACT.email}` (it does — no
separate update needed).

---

## If I need to update the phone number later

**Edit this file:** `lib/config.ts`

Look for `WHATSAPP.businessNumber` (and by extension `CONTACT.phone` / `CONTACT.whatsapp`).

Current value:

```
+91 89517 60369
```

The `WHATSAPP.businessLink` is the full wa.me URL used for business/support communication.
If the phone changes, update `WHATSAPP.businessNumber` and `WHATSAPP.businessLink` both.
Then also update the env vars if they override (see below).

---

## If I need to update the address later

**Edit this file:** `lib/config.ts`

Look for the `ADDRESS` object.

Current value:

```
Rajajinagar, Bengaluru, Karnataka, India
```

Fields in the object:

| Field | Current Value |
|---|---|
| `area` | `Rajajinagar` |
| `city` | `Bengaluru` |
| `state` | `Karnataka` |
| `country` | `India` |

`ADDRESS_FULL` is derived automatically:

```ts
`${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.state}, ${ADDRESS.country}`
```

---

## If I need to update the current event details later

**Edit this file:** `lib/config.ts`

Look for the `CURRENT_EVENT` config object.

Current values:

```ts
export const CURRENT_EVENT = {
  name: 'Rally Series 01 — Badminton Tournament',
  venue: 'A2V Badminton Academy',
  date: '5 July 2026',
  time: '11:00 AM – 7:00 PM',
  registrationFee: 799,
  categories: ['Men\'s Doubles', 'Mixed Doubles'],
}
```

All event-specific pages and templates read from `CURRENT_EVENT`:

- **Events page** — venue, date, time, categories displayed
- **Home page** — event name, venue, date shown in side panel
- **FAQ** — venue and fee answers use `CURRENT_EVENT`
- **Email templates** — subject lines and body use `CURRENT_EVENT.name`
- **Structured data (JSON-LD)** — name, description, venue, date

To update the event, change values in `CURRENT_EVENT`. No other files need editing.

---

## If I need to update registration categories later

**Edit this file:** `lib/config.ts`

The `CATEGORIES` array is now derived from `CURRENT_EVENT.categories`:

```ts
export const CATEGORIES = CURRENT_EVENT.categories
```

Current values:

```
Mixed Doubles
Men's Doubles
```

Usage across the codebase:

- **Register page** — category dropdown, validation
- **Email templates** — display category in emails
- **Admin dashboard** — display category in table
- **Structured data (JSON-LD)** — description text

All consume from `CATEGORIES` or pass the value through from the registration.

---

## If I need to update WhatsApp links later

### Two separate WhatsApp destinations

**Edit this file:** `lib/config.ts`

Look for the `WHATSAPP` config object:

```ts
export const WHATSAPP = {
  communityLink: process.env.NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK || '...',
  businessLink: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK || '...',
  businessNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 89517 60369',
}
```

### Community WhatsApp (`WHATSAPP.communityLink`)

Used in these locations:

| Location | Usage |
|---|---|
| Home page — CommunityProof section | "Join WhatsApp Community" button |
| Registration success screen | "Join WhatsApp Community" CTA |
| Registration Received email | "Join WhatsApp Community" button |
| Registration Confirmed email | "Join WhatsApp Community" button |
| Payment Verified email | "Join WhatsApp Community" button |
| Footer — Social icons row | WhatsApp community icon |

To update, change `WHATSAPP.communityLink` in `lib/config.ts` or set
`NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK` in your `.env` / Vercel.

### Business WhatsApp (`WHATSAPP.businessLink`)

Used in these locations:

| Location | Usage |
|---|---|
| Registration success screen | "Send Payment Screenshot" button |
| Registration Received email | "Send Payment Screenshot" button |
| Registration Confirmed email | Support contact link |
| Payment Verified email | Support contact link |
| Contact page | WhatsApp contact button |
| Footer — Contact column | WhatsApp number link |
| Email footer | Phone link |
| `CONTACT.whatsappUrl` | Derived from business link |

To update, change `WHATSAPP.businessLink` in `lib/config.ts` or set
`NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK` in your `.env` / Vercel.

---

## Environment Variables Audit

### Override variables (optional — config file values are the default)

| Variable | Current Value | Purpose | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+91 89517 60369` | Optional override for `WHATSAPP.businessNumber` | Change in `.env` / `.env.local` AND in `lib/config.ts` |
| `NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK` | `https://chat.whatsapp.com/...` | Community group invite link | Change in `.env` / `.env.local` AND in `lib/config.ts` |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK` | `https://wa.me/918951760369` | Business WhatsApp direct link | Change in `.env` / `.env.local` AND in `lib/config.ts` |
| `NEXT_PUBLIC_SITE_URL` | `https://rallyverse.social` | Overrides `SITE.domain` in config | Change in `.env` / `.env.local` AND in `lib/config.ts` |

### Infrastructure variables (required, no config file fallback)

| Variable | Current Value | Purpose | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_UPI_ID` | `adityag.007@ptaxis` | UPI ID for payment on registration form | Set in `.env` / Vercel |
| `NEXT_PUBLIC_ENTRY_FEE` | `799` | Registration fee amount (₹799 per team) | Set in `.env` / Vercel |
| `RESEND_API_KEY` | `re_...` | Resend API key for sending emails | Set in `.env` / Vercel |
| `ADMIN_PASSWORD` | `lundlele` | Password for admin dashboard | Set in `.env` / Vercel |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `rally-verse@...` | Google service account for Sheets | Set in `.env` / Vercel |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----...` | Private key for Google auth | Set in `.env` / Vercel |
| `GOOGLE_SHEET_ID` | `1Jy3JXFJ...` | Google Sheet ID for registrations | Set in `.env` / Vercel |
| `GOOGLE_DRIVE_FOLDER_ID` | `1CaHLt...` | Google Drive folder for uploads | Set in `.env` / Vercel |
| `GOOGLE_SHEET_TAB_NAME` | `Sheet1` | Sheet tab name | Set in `.env` / Vercel |
| `NEXT_PUBLIC_PAYMENT_QR_URL` | _(empty)_ | URL of payment QR code image | Set in `.env.local` / Vercel |

---

## Vercel / Resend Settings That May Need Updating

1. **Resend sender domain** — Configured in Resend dashboard.
   - Current sender: `registrations@rallyverse.social`
   - Defined in `lib/config.ts` → `EMAIL.from`
   - If the domain changes, update Resend DNS records AND the `from` field in config.

2. **Vercel Environment Variables** — All variables listed above must be set
   in the Vercel project dashboard under **Settings → Environment Variables**.

---

## Files Modified

| File | Change |
|---|---|
| `lib/config.ts` | Added `WHATSAPP` config object (`communityLink`, `businessLink`, `businessNumber`); `CONTACT.phone`/`whatsapp`/`whatsappUrl` now derive from `WHATSAPP`; `SOCIAL.whatsapp` now uses `WHATSAPP.businessLink`; added `CURRENT_EVENT` as single source of truth for event details |
| `components/CommunityProof.tsx` | Imports `WHATSAPP` instead of `CONTACT`; uses `WHATSAPP.communityLink` |
| `components/RegistrationForm.tsx` | Imports `WHATSAPP`; success screen shows two separate CTAs: "Send Payment Screenshot" → `WHATSAPP.businessLink` and "Join WhatsApp Community" → `WHATSAPP.communityLink` |
| `components/Footer.tsx` | Imports `WHATSAPP`; social icons row uses `WHATSAPP.communityLink` for WhatsApp; contact column uses `WHATSAPP.businessLink` |
| `app/contact/page.tsx` | Imports `WHATSAPP`; WhatsApp contact uses `WHATSAPP.businessLink` |
| `app/api/register/route.ts` | Imports `WHATSAPP`; passes `WHATSAPP.businessLink` and `WHATSAPP.communityLink` to email function |
| `app/api/admin/send-verification/route.ts` | Imports `WHATSAPP`; passes both WhatsApp links to email function |
| `app/api/admin/send-confirmations/route.ts` | Imports `WHATSAPP`; passes both WhatsApp links to email function |
| `lib/email.ts` | Imports `WHATSAPP`; all email templates updated to use `communityWhatsappLink` and `businessWhatsappLink` params |
| `.env` | Replaced `NEXT_PUBLIC_WHATSAPP_GROUP_LINK` with `NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK` and `NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK` |
| `.env.local` | Same replacements as `.env` (commented out) |
| `CONFIGURATION_GUIDE.md` | Added WhatsApp configuration section; updated env var audit; updated files modified table; added `CURRENT_EVENT` documentation |
| `components/FirstEvent.tsx` | Rewrote to be platform-focused (not event-specific); reads venue/date from `CURRENT_EVENT` |
| `app/events/page.tsx` | Uses `CURRENT_EVENT` for venue, date, time, categories |
| `app/layout.tsx` | Structured data schema uses `CURRENT_EVENT` |
| `lib/email.ts` | Email subjects/body use `CURRENT_EVENT.name` |

---

## Files Verified (No Changes Needed)

These files consume values from `lib/config.ts` and needed no WhatsApp-specific changes:

- `app/privacy-policy/page.tsx` — Uses `CONTACT`, `EMAIL` (text references only, no links)
- `app/terms-and-conditions/page.tsx` — Uses `CONTACT`, `EMAIL` (text references only, no links)
- `components/SocialIcons.tsx` — Uses `SOCIAL` (Instagram, LinkedIn, email only)

---

## Final Checklist

- [x] **Email update** → Edit `lib/config.ts` (`CONTACT.email`, `EMAIL.replyTo`, `EMAIL.supportEmail`)
- [x] **Phone update** → Edit `lib/config.ts` (`WHATSAPP.businessNumber`) + `.env` override if set
- [x] **Address update** → Edit `lib/config.ts` (`ADDRESS` object)
- [x] **Event details update** → Edit `lib/config.ts` (`CURRENT_EVENT` object) — name, venue, date, time, fee, categories
- [x] **Category update** → Edit `lib/config.ts` (`CATEGORIES` array, derived from `CURRENT_EVENT.categories`)
- [x] **WhatsApp community link update** → Edit `lib/config.ts` (`WHATSAPP.communityLink`) or set `NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK`
- [x] **WhatsApp business link update** → Edit `lib/config.ts` (`WHATSAPP.businessLink`) or set `NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK`
- [x] **Env vars that may need updating** → See table above (Vercel dashboard)
- [x] **Vercel settings** → Environment variables must match `.env`
- [x] **Resend sender** → `EMAIL.from` in `lib/config.ts`; update Resend DNS if domain changes
