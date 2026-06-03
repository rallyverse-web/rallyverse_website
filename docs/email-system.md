# Transactional Email System Documentation

RallyVerse v2.0 integrates with **Resend** for reliable transactional email delivery. Outbound mails are fully customized per event campaign using database-stored templates and configurations.

---

## 🛠️ Components of the Email Infrastructure

1. **Email Settings (`event_email_settings` table)**:
   - Configures the custom sender display name (e.g. `Sender Name = Rally Series`) and support channels (`support_email`, `reply_to_email`) for each event campaign.
2. **Email Templates (`email_templates` table)**:
   - Stores rich HTML email bodies per event. Supported categories include:
     - `approval`: Triggered when player registration is approved.
     - `rejection`: Triggered when payment or validation fails.
     - `reminder`: Schedule reminders (e.g. event day guidelines).
     - `results`: Summarize final rankings.
     - `broadcast`: Custom news announcements.
3. **Transaction Logs (`email_logs` table)**:
   - Audits every message request, storing recipient details, sent subjects, timestamps, and provider-returned message IDs (for tracking bounces or delivery failures).

---

## ✍️ Template Variable Rendering

Mails are parsed using `lib/template-renderer.ts`. The renderer replaces variables wrapped in `{variable_name}` delimiters.

### Supported Variables
| Key | Context | Example |
| :--- | :--- | :--- |
| `{participant_name}` | Name of the registered player | `John Doe` |
| `{event_name}` | Associated campaign tournament name | `Rally Series 01` |
| `{event_date}` | Formatted tournament date | `5 July 2026` |
| `{event_venue}` | Physical venue location | `A2V Badminton Academy` |
| `{format}` | Player's chosen category | `Mixed Doubles` |
| `{registration_status}`| Registration approval status | `Approved` |
| `{support_email}` | Dedicated support email address | `registrations@rallyverse.social` |
| `{whatsapp_number}` | Organizer WhatsApp contact number | `+91 89517 60369` |
| `{event_whatsapp_group}`| Tournament chat room link | `https://chat.whatsapp.com/G4...` |

---

## 🔁 Automated Seeding
When a founder creates a new event, default templates are generated automatically inside `lib/seed-defaults.ts`:
- **Default Approval Email**: Contains confirmation details, check-in instructions, and links to the community WhatsApp group.
- **Default Rejection Email**: Informative message outlining issues with payments, prompting players to reply or submit again.
- **Default Broadcast / Reminder Settings**: Standard boilerplate files ready for event administration adjustments.
