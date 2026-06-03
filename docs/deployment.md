# Deployment Manual

This document provides step-by-step instructions to deploy RallyVerse v2.0 from scratch to Vercel and Supabase.

---

## 💾 Supabase Setup

### Step 1: Create a Project
1. Log in to [Supabase](https://supabase.com/).
2. Create a new project. Choose an appropriate name, database password, and select the region closest to your target audience (e.g., Singapore/Mumbai for India).
3. Wait for the database instance to provision.

### Step 2: Run SQL Migrations
1. Open the **SQL Editor** in the Supabase Project Dashboard.
2. Click **New Query**.
3. Copy the contents of the migration files in order and run them:
   - `scripts/migration.sql` (Initial Setup)
   - `scripts/migration_phase2.sql` (Payment, Sub-Admins, Registrations)
   - `scripts/migration_phase2_hardening.sql` (Integrity indexes & constraints)
   - `scripts/migration_phase3a.sql` (Email settings & template logs)
   - `scripts/migration_phase3c_analytics.sql` (Views & clicks tracking)
   - `scripts/migration_cleanup_v2.sql` (v2.0 unique constraint cleanup)
4. Verify that all tables, indexes, and constraints were created successfully in the **Table Editor**.

### Step 3: Copy Connection Details
Go to **Settings → API** and copy:
- **Project URL** (Map to `NEXT_PUBLIC_SUPABASE_URL`)
- **Anon Public API Key** (Map to `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

Go to **Settings → Database** and copy the Connection Pool details or the Service Role key:
- **Service Role Key** (Map to `SUPABASE_SERVICE_ROLE_KEY`)

---

## ⚡ Vercel Deployment

### Step 1: Connect Codebase
1. Push your codebase to a private Git repository (GitHub/GitLab/Bitbucket).
2. Log in to [Vercel](https://vercel.com) and click **Add New → Project**.
3. Import your RallyVerse repository.

### Step 2: Configure Environment Variables
Expand the **Environment Variables** section and insert the keys:

```bash
# Gateway Keys
RESEND_API_KEY="re_..."
ADMIN_PASSWORD="your-strong-founder-password"

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID="G-..."

# Supabase Configurations
NEXT_PUBLIC_SUPABASE_URL="https://yourproject.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."

# Fallback Settings
NEXT_PUBLIC_SITE_URL="https://rallyverse.social"
NEXT_PUBLIC_UPI_ID="merchant@upi"
NEXT_PUBLIC_ENTRY_FEE="799"
NEXT_PUBLIC_WHATSAPP_NUMBER="+91 89517 60369"
NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK="https://chat.whatsapp.com/..."
NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK="https://wa.me/..."
```

### Step 3: Trigger Build
1. Set the framework preset to **Next.js**.
2. Click **Deploy**.
3. Once completed, Vercel will assign a production domain (e.g. `your-project.vercel.app`).
4. Update `NEXT_PUBLIC_SITE_URL` to match this production domain.
