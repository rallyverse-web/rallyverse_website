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

Look for `CONTACT.phone` and `CONTACT.whatsapp`.

Current value:

```
+91 89517 60369
```

The `CONTACT.whatsappUrl` is derived from the number automatically:

- `whatsappUrl` = `https://wa.me/918951760369` (digits only)

If the phone changes, update `CONTACT.phone` and `CONTACT.whatsapp` both to
the new number. Then also update the env vars if they override (see below).

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

## If I need to update registration categories later

**Edit this file:** `lib/config.ts`

Look for the `CATEGORIES` array.

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

## Environment Variables Audit

### Override variables (optional — config file values are the default)

| Variable | Current Value | Purpose | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+91 89517 60369` | Optional override for WhatsApp CTA links | Change in `.env` / `.env.local` AND in `lib/config.ts` |
| `NEXT_PUBLIC_SITE_URL` | `https://rallyverse.social` | Overrides `SITE.domain` in config | Change in `.env` / `.env.local` AND in `lib/config.ts` |

### Infrastructure variables (required, no config file fallback)

| Variable | Current Value | Purpose | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_UPI_ID` | `adityag.007@ptaxis` | UPI ID for payment on registration form | Set in `.env` / Vercel |
| `NEXT_PUBLIC_ENTRY_FEE` | `800` | Registration fee amount | Set in `.env` / Vercel |
| `NEXT_PUBLIC_WHATSAPP_GROUP_LINK` | `https://chat.whatsapp.com/REPLACE_WITH_ACTUAL_LINK` | Invite link to tournament WhatsApp group | **Replace with real link before launch** |
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
| `lib/config.ts` | Added `CATEGORIES`; fixed `ADDRESS.area` from `Whitefield` to `Rajajinagar`; removed `isTemporary` flag |
| `components/RegistrationForm.tsx` | Imports `CATEGORIES` and `CONTACT` from config; hardcoded categories removed; phone placeholders use `CONTACT.phone`; `whatsappNumber` fallback uses `CONTACT.phone` |
| `components/CommunityProof.tsx` | `WHATSAPP_LINK` now imports from `CONTACT.whatsappUrl` instead of hardcoded URL |
| `components/Footer.tsx` | Uses `ADDRESS.area` instead of `ADDRESS.line1` |
| `app/api/register/route.ts` | `whatsappNumber` fallback uses `CONTACT.phone` instead of hardcoded string |
| `app/layout.tsx` | Structured data (JSON-LD) now uses `SITE`, `ADDRESS`, `ADDRESS_FULL`, `CATEGORIES` from config |
| `.env` | Added section comments documenting which vars override config |
| `.env.local` | Added section comments documenting which vars override config |

---

## Files Verified (No Changes Needed)

These files already consume values from `lib/config.ts` correctly:

- `app/contact/page.tsx` — Uses `CONTACT`, `ADDRESS_FULL`, `SOCIAL`, `EMAIL`
- `app/privacy-policy/page.tsx` — Uses `CONTACT`, `EMAIL`
- `app/terms-and-conditions/page.tsx` — Uses `CONTACT`, `EMAIL`
- `lib/email.ts` — Uses `SITE`, `CONTACT`, `EMAIL`
- `app/api/admin/send-verification/route.ts` — Uses `EMAIL`
- `app/api/admin/send-confirmations/route.ts` — Uses `EMAIL`
- `components/SocialIcons.tsx` — Uses `SOCIAL`
- `components/Footer.tsx` — Uses `SITE`, `CONTACT`, `ADDRESS`, `SOCIAL`, `QUICK_LINKS`, `LEGAL_LINKS`

---

## Final Checklist

- [x] **Email update** → Edit `lib/config.ts` (`CONTACT.email`, `EMAIL.replyTo`, `EMAIL.supportEmail`)
- [x] **Phone update** → Edit `lib/config.ts` (`CONTACT.phone`, `CONTACT.whatsapp`) + `.env` override if set
- [x] **Address update** → Edit `lib/config.ts` (`ADDRESS` object)
- [x] **Category update** → Edit `lib/config.ts` (`CATEGORIES` array)
- [x] **Env vars that may need updating** → See table above (Vercel dashboard)
- [x] **Vercel settings** → Environment variables must match `.env`
- [x] **Resend sender** → `EMAIL.from` in `lib/config.ts`; update Resend DNS if domain changes
- [x] **WhatsApp group link** → Replace `NEXT_PUBLIC_WHATSAPP_GROUP_LINK` in Vercel before launch
