# Founder Operations Manual

This guide is written for the platform owner (Founder) to manage tournament campaigns, payment configuration, admin credentials, communications, and analytics in RallyVerse v2.0.

---

## 🔑 Accessing the Founder Dashboard

1. Navigate to `https://rallyverse.social/admin`.
2. Enter your master **admin password** (configured as `ADMIN_PASSWORD` in your hosting setup).
3. Click **Sign In**.

---

## 🏸 Managing Tournament Campaigns

### 1. Creating a New Event
1. Click **Events Management** or navigate to `/admin/events`.
2. Click **Create Event**.
3. Fill out the campaign information:
   - **Event Name**: E.g. `Smash Cup Doubles`.
   - **URL Slug**: E.g. `smash-cup-doubles` (automatically generated, must be unique).
   - **Category**: E.g. `Badminton`.
   - **Venue**: Address of the facility.
   - **Registration Fee (₹)**: Price in INR (use `0` if free).
   - **Capacity**: Maximum entries allowed (e.g. `64`).
   - **Available Formats**: Check the categories you want to host (e.g., Mixed Doubles, Men's Doubles).
4. Click **Create Event**. The event starts in `draft` mode and is hidden from the public.

### 2. Editing or Deleting Events
- **Edit**: Click **Edit** on the event row. Modify any details and click **Save Changes**.
- **Delete**: Click the red **Trash icon**. Confirm deletion.
  > [!WARNING]
  > Deleting an event permanently removes all registered player entries, custom payment configurations, templates, and assigned sub-admins.

### 3. Publishing an Event
When you are ready to launch your event and accept registrations:
1. Locate the event in `/admin/events`.
2. Click **Publish** on its row.
3. The event will now appear on the public portal listing (`/events`) and accept player sign-ups.

---

## 💳 Payment Setup

Each event must have its own payment settings:
1. Locate the event in `/admin/events`.
2. Click **Payment**.
3. Fill in the merchant details:
   - **UPI ID**: The target address for receives (e.g., `company@upi`).
   - **Account Holder Name**: The display name for players to verify in their banking apps.
   - **Mobile Number**: Phone number linked to the merchant account.
   - **WhatsApp Verification Number**: Number where players will send screenshots.
4. Click **Save Payment Config**.

---

## 📱 WhatsApp Setup

To connect communications:
1. Create a WhatsApp group for the specific tournament.
2. In the **Edit Event** modal, paste the group invite link into the **WhatsApp Group Link** field.
3. Input the support phone number in **WhatsApp Number**.
4. Save the event. Prefilled links will automatically direct players to these contacts.

---

## 🛡️ Assigning Event Admins (Sub-Admins)

Assign coordinators to manage registration logs on-ground:
1. Locate the event in `/admin/events`.
2. Click **Admins**.
3. In the pop-up modal, enter the admin's **Name** and **Email Address**.
4. Click **Add**.
5. The system will display a unique **Access Token** (e.g., `ea_5a6e8f...`).
   > [!IMPORTANT]
   > Copy this access token immediately and share it securely with the sub-admin. It will not be shown again.
6. The admin can now log into `/event-admin` using this token to manage the specific event.

---

## 📊 Registration Management

Verify player list status:
1. Navigate to **Registration Portal** or `/admin/registrations`.
2. Scroll to the specific event accordion. Click it to expand.
3. Review submissions:
   - **Status**: Displays `Pending`, `Approved`, or `Rejected`.
4. Click the **Eye icon** on a player row to inspect full details (partner name, phone, transaction UPI details, created timestamps).
5. Click the **Trash icon** to delete invalid entries.

---

## 📧 Communication Workflows

Broadcast emails to players:
1. Navigate to **Communication Hub** or `/admin/communication`.
2. Select your event from the dropdown.
3. Customize templates for the campaign (e.g. update check-in schedules inside the **Approval Email** body).
4. Click **Send Confirmations** or **Broadcast** to send transactional templates to filtered player groups.

---

## 📈 Monitoring Analytics

Track tournament campaign growth:
1. Navigate to **Platform Analytics** or `/admin/analytics`.
2. Review:
   - **Conversion Funnels**: Track visitors who start registration vs those who complete payments.
   - **WhatsApp Clicks**: Monitor link engagement.
   - **Outbound Email Success Rates**: Track delivered vs failed messages.
