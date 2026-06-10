# Database Schema Documentation

RallyVerse utilizes a relational schema on PostgreSQL (hosted via Supabase). Row Level Security (RLS) is enabled across all sensitive tables to protect player registrations and administrative tokens.

---

## 🗺️ Entity Relationship Map

- **events** (One) ◄───► (Many) **event_formats**
- **events** (One) ◄───► (One)  **event_payment_config**
- **events** (One) ◄───► (Many) **event_admins**
- **events** (One) ◄───► (Many) **registrations**
- **events** (One) ◄───► (One)  **event_email_settings**
- **events** (One) ◄───► (Many) **email_templates**
- **events** (One) ◄───► (Many) **email_logs**

---

## 📋 Table Definitions

### 1. `events`
Stores information about each sports event campaign.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` | Unique campaign identifier |
| `name` | `text` | NOT NULL | Name of the tournament/event |
| `slug` | `text` | Unique, NOT NULL | URL-friendly lookup slug |
| `description`| `text` | - | Full markdown details |
| `category` | `text` | Check: `badminton, trek, marathon, cycling` | Core event category |
| `venue` | `text` | - | Location address |
| `event_date` | `timestamptz`| - | Exact date/time of event |
| `date_label` | `text` | - | Display-friendly date (e.g. 5 July) |
| `time_label` | `text` | - | Display-friendly time (e.g. 11am-7pm) |
| `is_date_confirmed` | `boolean`| Default: `true` | False if date is tentative |
| `registration_fee` | `integer` | - | Entry fee in INR (0 if free) |
| `payment_info`| `text` | - | Short instructions for payments |
| `capacity` | `integer` | - | Maximum player slots available |
| `rally_points`| `integer` | Default: `0` | Loyalty points awarded |
| `whatsapp_number` | `text` | - | Organizer WhatsApp contact number |
| `whatsapp_group_link`| `text` | - | Community/Event invite URL |
| `status` | `text` | Check: `draft, published, cancelled, completed` | Event lifecycle state |
| `created_at` | `timestamptz`| Default: `now()` | Record creation timestamp |
| `updated_at` | `timestamptz`| Default: `now()` | Last modification timestamp |

---

### 2. `event_formats`
Supported formats for each event (e.g., Mixed Doubles, Men's Singles).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Format identifier |
| `event_id` | `uuid` | Foreign Key (events.id) ON DELETE CASCADE | Associated event |
| `format_name`| `text` | NOT NULL | E.g. "Mixed Doubles" |
| `created_at` | `timestamptz`| Default: `now()` | - |

- **Unique Constraint**: `UNIQUE(event_id, format_name)` (applied in v2.0 cleanup)

---

### 3. `event_payment_config`
UPI and WhatsApp details for receiving offline payments per event.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Identifier |
| `event_id` | `uuid` | Foreign Key (events.id) ON DELETE CASCADE, Unique | Associated event |
| `upi_id` | `text` | NOT NULL | Merchant UPI ID for registration fee |
| `account_holder_name`| `text` | NOT NULL | Account holder name |
| `mobile_number`| `text` | NOT NULL | Phone linked to UPI |
| `whatsapp_number`| `text` | NOT NULL | Verification WhatsApp phone number |
| `created_at` | `timestamptz`| Default: `now()` | - |
| `updated_at` | `timestamptz`| Default: `now()` | - |

---

### 4. `event_admins`
Access control table for event-specific managers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Admin identifier |
| `event_id` | `uuid` | Foreign Key (events.id) ON DELETE CASCADE, NOT NULL | Associated event scope |
| `name` | `text` | NOT NULL | Admin full name |
| `email` | `text` | NOT NULL | Admin email address |
| `access_token`| `text` | Unique | Uniquely hashed authorization token |
| `created_by` | `uuid` | - | ID of creator admin |
| `created_at` | `timestamptz`| Default: `now()` | - |
| `updated_at` | `timestamptz`| Default: `now()` | - |

---

### 5. `registrations`
Stores submissions from players registering for events.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Registration ID |
| `event_id` | `uuid` | Foreign Key (events.id) ON DELETE CASCADE | Associated event |
| `registration_id`| `text` | Unique, NOT NULL | Human-friendly ID (e.g. RV-5243-XX) |
| `full_name` | `text` | NOT NULL | Player 1 full name |
| `phone_number`| `text` | NOT NULL | Player 1 phone number |
| `email` | `text` | NOT NULL | Player 1 email address |
| `city` | `text` | NOT NULL | Player 1 city |
| `gender` | `text` | NOT NULL | Player 1 gender |
| `format` | `text` | NOT NULL | Chosen format (e.g. Mixed Doubles) |
| `partner_name`| `text` | - | Player 2 name (Doubles category only) |
| `partner_phone`| `text` | - | Player 2 phone (Doubles category only) |
| `status` | `text` | Check: `Pending, Approved, Rejected` | Registration approval status |
| `notes` | `text` | - | Additional admin notes / remarks |
| `approved_by`| `uuid` | Foreign Key (event_admins.id) | Approving admin |
| `approved_at`| `timestamptz`| - | Timestamp of approval/rejection |
| `created_at` | `timestamptz`| Default: `now()` | Registration submission timestamp |
| `updated_at` | `timestamptz`| Default: `now()` | Last modification timestamp |

- **Unique Constraint**: `UNIQUE(event_id, email, format)` (prevents double registrations for the same category)

---

### 9. `partner_enquiries`
Stores B2B partnership enquiries submitted by organizations, sports academies, brands, and organizers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` | Unique enquiry identifier |
| `name` | `text` | NOT NULL | Contact person's full name |
| `organization` | `text` | - | Name of company/academy |
| `email` | `text` | NOT NULL | Contact email address |
| `phone` | `text` | NOT NULL | Contact WhatsApp/Phone number |
| `organization_type` | `text` | NOT NULL | E.g. "Sports Brand", "Academy", etc. |
| `services_interested` | `text[]` | NOT NULL | Array of services they are interested in |
| `message` | `text` | - | Optional enquiry details/message |
| `created_at` | `timestamptz`| Default: `now()` | Enquiry timestamp |


---

### 10. `contact_submissions`
Stores direct contact messages submitted by visitors.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` | Unique submission identifier |
| `name` | `text` | NOT NULL | Sender's full name |
| `organization` | `text` | - | Optional organization/company name |
| `email` | `text` | NOT NULL | Sender's email address |
| `phone` | `text` | - | Optional phone number |
| `message` | `text` | NOT NULL | Submission message body |
| `created_at` | `timestamptz`| Default: `now()` | Submission timestamp |



---

### 6. `event_email_settings`
Custom mail server/sender profiles per event.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Identifier |
| `event_id` | `uuid` | Foreign Key (events.id) ON DELETE CASCADE, Unique | Associated event |
| `sender_name`| `text` | Default: "RallyVerse" | Display name in client mailbox |
| `reply_to_email`| `text` | - | Reply-to address |
| `support_email`| `text` | - | Support contact address |
| `created_at` | `timestamptz`| Default: `now()` | - |

---

### 7. `email_templates`
Event-specific email templates.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Identifier |
| `event_id` | `uuid` | Foreign Key (events.id) ON DELETE CASCADE | Associated event |
| `template_type`| `text` | Check: `approval, rejection, reminder, results, broadcast` | Template category |
| `subject` | `text` | NOT NULL | Subject header |
| `content` | `text` | NOT NULL | HTML template body with variables |
| `created_by` | `uuid` | Foreign Key (event_admins.id) | Author |
| `created_at` | `timestamptz`| Default: `now()` | - |

- **Unique Constraint**: `UNIQUE(event_id, template_type)` (applied in v2.0 cleanup)

---

### 8. `email_logs`
Logs of all sent system emails for delivery audits.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Identifier |
| `event_id` | `uuid` | Foreign Key (events.id) ON DELETE CASCADE | - |
| `template_id`| `uuid` | Foreign Key (email_templates.id) ON DELETE SET NULL | Reference template |
| `recipient_email`| `text` | NOT NULL | Destination address |
| `subject` | `text` | NOT NULL | Sent subject |
| `sent_by` | `uuid` | Foreign Key (event_admins.id) | Initiator admin |
| `status` | `text` | Check: `sent, failed` | Delivery result |
| `provider_message_id`| `text` | - | Message ID returned by Resend gateway |
| `created_at` | `timestamptz`| Default: `now()` | - |
