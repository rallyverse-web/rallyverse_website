# Environment Variables Reference

This document outlines all environment variables utilized in RallyVerse v2.0. Legacy Google Sheets parameters are completely omitted.

---

## 🛠️ Required Production Keys

| Key Name | Scope | Example / Format | Purpose |
| :--- | :--- | :--- | :--- |
| `RESEND_API_KEY` | Server | `re_12345678_ABC...` | Authorization key for Resend email delivery |
| `ADMIN_PASSWORD` | Server | `strongPassword123` | Master password protecting the `/admin` Founder portal |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Client | `G-MHFCSTPCV5` | Measurement ID for Google Analytics 4 |
| `NEXT_PUBLIC_SUPABASE_URL` | Client | `https://upbgyijcre.supabase.co` | API endpoint URL for your Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | `eyJhbGciOiJIUzI...` | Anonymous public role key for client-side queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | `eyJhbGciOiJIUzI...` | Service role key bypasses database RLS for admin operations |

---

## ⚙️ Fallback Parameters (Optional Settings)

These parameters serve as fallback configurations in case event-specific values are not defined in the Supabase control panels:

| Key Name | Scope | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Client | `https://rallyverse.social` | Canonical hostname URL for absolute metadata paths |
| `NEXT_PUBLIC_UPI_ID` | Client | `rallyverse@upi` | Fallback UPI merchant code |
| `NEXT_PUBLIC_ENTRY_FEE` | Client | `799` | Fallback registration price in INR |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Client | `+91 89517 60369` | Fallback WhatsApp phone contact details |
| `NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK` | Client | `https://chat.whatsapp.com/...` | Fallback community invite URL |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK` | Client | `https://wa.me/...` | Fallback business WhatsApp link |

---

## ⚠️ Removed Environment Variables

The following keys represent legacy dependencies and must **not** be included in active Vercel projects or `.env` files:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` (Google Sheets auth)
- `GOOGLE_PRIVATE_KEY` (Google Sheets private key)
- `GOOGLE_SHEET_ID` (Google Sheets unique id)
- `GOOGLE_DRIVE_FOLDER_ID` (Google Drive backup folder)
- `GOOGLE_SHEET_TAB_NAME` (Spreadsheet sub-tab override)
- `NEXT_PUBLIC_PAYMENT_QR_URL` (Old static payment QR image lookup)
