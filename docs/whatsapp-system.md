# WhatsApp Systems Integration

RallyVerse utilizes WhatsApp for primary user support, payment verification, and community announcements. The system dynamically generates links and gracefully degrades fallbacks based on environment configurations.

---

## 📱 Dynamic Links & Prefilled Messages

When a user submits a registration form, the success screen displays a CTA link pointing to the business account to initiate the verification flow.

### Link Generation Rules
- **Direct Business Link**: Constructed using the format `https://wa.me/{phone_number}?text={encoded_message}`.
- **Prefilled Text**:
  ```text
  Hi RallyVerse, I have submitted my registration for {Event Name} (ID: {Registration ID}). Here is my payment screenshot.
  ```
  This prefilled text ensures the player submits their unique transaction ID, accelerating sub-admin verification.

---

## 🔁 Graceful Community Link Fallback

To build a community, players are prompted to join a WhatsApp group on the success screen and confirmation emails.

```
                  Is NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK configured?
                                   │
                  ┌────────────────┴────────────────┐
                  ▼ Yes                             ▼ No
      [Join WhatsApp Group]               [Fallback: Direct wa.me Chat]
```

1. **Active Configuration**: If `NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK` is defined (e.g. `https://chat.whatsapp.com/...`), links display as **Join WhatsApp Community** and point to the group.
2. **Graceful Degrade**: If no community link is defined, `WHATSAPP.communityLink` defaults to `WHATSAPP.businessLink` (direct chat with the support account). This prevents broken links or dead-ends for the player.
