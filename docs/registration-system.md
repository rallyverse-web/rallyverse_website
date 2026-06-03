# Registration Engine Documentation

RallyVerse v2.0 transitions the platform entirely to a robust database-backed registration subsystem on Supabase. This document outlines the validations, validations checking, and schema constraints.

---

## 🔒 Form Validations & Constraints

Client-side registration is handled by `EventRegistrationClient.tsx` using native form hooks. It applies the following validators:
- **Phone Numbers**: Matches `phoneRegex` (between 10 and 15 digits).
- **Emails**: Verifies valid RFC email structure.
- **Double Categories**: Dynamically tracks if the selected category format contains the word "Doubles" or "Double".
  - When true, fields for **Partner Name** and **Partner Phone** become mandatory and undergo validation.

---

## 🛡️ Database Integrity & Double Booking Checks

To prevent booking collisions, the database applies the constraint `registrations_event_email_format_unique`:
```sql
ALTER TABLE registrations
ADD CONSTRAINT registrations_event_email_format_unique UNIQUE (event_id, email, format);
```

### How the system prevents double bookings:
1. **Uniqueness Check**: If a player attempts to register with the same email address for the same event category format, PostgreSQL throws a unique constraint violation error.
2. **Conflict Resolution**: The API route catching this exception (`app/api/events/[slug]/register/route.ts`) catches the duplicate key database code and returns a user-friendly error response: `"You are already registered for this category."`
3. **Draft and Published Scopes**: Registration checks only proceed if the event is published. If an event reaches its defined limit (`capacity`), the registration API blocks requests, returning a `"Registration full"` response.
