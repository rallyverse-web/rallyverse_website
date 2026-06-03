# Multi-Event Subsystem Documentation

RallyVerse v2.0 is built around a dynamic, database-backed multi-event architecture. This allows the platform to organize and run multiple tournaments, treks, or adventures concurrently under separate URLs and sub-admins.

---

## 🎨 Event Configurable Properties

Each event created in the dashboard contains the following custom properties:
1. **Core Metadata**: Name, description, URL slug (must be unique), and category (`badminton, trek, marathon, cycling`).
2. **Dates & Scheduling**:
   - `event_date`: ISO timestamp.
   - `date_label`: Formatted human-readable date.
   - `time_label`: Formatted tournament/event duration.
   - `is_date_confirmed`: Set to false to flag dates as tentative or postponed.
3. **Venues**: Dedicated physical venue location.
4. **Limits**:
   - `capacity`: Maximum registration slots (e.g. 64 teams). Once reached, registration forms automatically close for that event.
   - `rally_points`: Loyalty points rewarded upon participation.
5. **Comms & Details**: Specific WhatsApp groups, contact details, and payment configs.

---

## 🏸 Supported Categories & Formats

Form categories are dynamically constructed based on the formats added to an event via the `event_formats` table:
- **Doubles Categories**: Form triggers validations requiring partner name and partner phone number.
- **Singles Categories**: Restricts forms to a single player's details.

---

## 🚦 Event Lifecycles

Events transition through four main states in the database:
- **`draft`**: Hidden from public event listings. Access is restricted to control panel administrators.
- **`published`**: Available on the public events listing (`/events`) and accepting online registrations.
- **`cancelled`**: Suspends new registrations. Displays a notice to existing registrants.
- **`completed`**: Displays tournament results and closes registrations permanently.
