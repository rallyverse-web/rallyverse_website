// ─── Site ─────────────────────────────────────────────────────────
export const SITE = {
  name: 'RallyVerse',
  tagline: 'Rallying Communities Through Sports',
  domain: 'https://rallyverse.social',
  description:
    'RallyVerse is a sports growth partner that helps sports communities, organizers, academies, and brands grow through community building, event management, outreach, and sports marketing.',
}

// ─── Company Bio (E-E-A-T signals for footer / trust) ───────────
export const COMPANY = {
  shortDescription:
    'RallyVerse is a sports growth partner that helps sports communities, organizers, academies, and brands grow.',
}

// ─── Email ────────────────────────────────────────────────────────
export const EMAIL = {
  from: 'RallyVerse <registrations@rallyverse.social>',
  replyTo: 'rallyverseofficial@gmail.com',
  supportEmail: 'rallyverseofficial@gmail.com',
  secondaryFrom: 'RallyVerse <hello@rallyverse.social>',
}

// ─── WhatsApp (single source of truth for all WhatsApp links) ────
// When a community invite link is set (via NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK),
// the "Join Community" CTAs will point to the group. When absent, they
// gracefully degrade to a direct business chat (wa.me). This prevents
// broken links while the business provides the actual invite URL.
const _communityLink = process.env.NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK
const _businessLink =
  process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK ||
  'https://wa.me/918951760369'
const _businessNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 89517 60369'

export const WHATSAPP = {
  /** Community invite link (WhatsApp Group). Falls back to business chat. */
  communityLink: _communityLink || _businessLink,
  /** Whether a dedicated community chat has been configured by the business. */
  hasCommunityChat: !!_communityLink,
  /** Direct 1:1 chat with the RallyVerse business account. */
  businessLink: _businessLink,
  /** Display-friendly phone number. */
  businessNumber: _businessNumber,
}

// ─── Contact ──────────────────────────────────────────────────────
export const CONTACT = {
  phone: WHATSAPP.businessNumber,
  telUrl: `tel:${WHATSAPP.businessNumber.replace(/[\s+]/g, '')}`,
  email: 'rallyverseofficial@gmail.com',
  supportEmail: EMAIL.supportEmail,
  whatsapp: WHATSAPP.businessNumber,
  whatsappUrl: WHATSAPP.businessLink,
}

// ─── Address ─────────────────────────────────────────────────────
export const ADDRESS = {
  area: 'Rajajinagar',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '560010',
  country: 'India',
}

export const ADDRESS_FULL = `${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.postalCode}, ${ADDRESS.country}`

// ─── Current Event (legacy fallback — Supabase-backed in Phase 1+) ──
// Kept for backward compatibility with registration form, email, and
// FAQ code until Phase 2 migration is complete. New events should be
// created through the admin dashboard (/admin/events) which writes to
// the Supabase `events` table directly.
export const CURRENT_EVENT = {
  name: 'Rally Series 01 — Bengaluru Badminton',
  slug: 'rally-series-01',
  venue: 'A2V Badminton Academy',
  venueSlug: 'a2v-badminton-academy',
  date: '5 July 2026',
  time: '11:00 AM – 7:00 PM',
  startISO: '2026-07-05T11:00:00+05:30',
  endISO: '2026-07-05T19:00:00+05:30',
  registrationFee: 799,
  categories: ['Mixed Doubles', "Men's Doubles"] as const,
  isDateConfirmed: true,
  validFromISO: '2026-06-01T00:00:00+05:30',
  description:
    "Rally Series 01 is a competitive badminton tournament in Bengaluru featuring Mixed Doubles and Men's Doubles categories. Players compete in a professionally organized one-day event designed to bring together badminton enthusiasts.",
}

// ─── Registration Categories (derived from current event) ────────
export const CATEGORIES = [...CURRENT_EVENT.categories]

// ─── Social ───────────────────────────────────────────────────────
// All URLs use canonical formats (no tracking parameters, trailing
// slash consistent, www-prefixed where applicable). LinkedIn uses
// rallyversesm (the "sm" differentiates from an unrelated NYC
// advertising company at linkedin.com/company/rallyverse).
export const SOCIAL = {
  instagram: 'https://www.instagram.com/rallyverse_official/',
  linkedin: 'https://www.linkedin.com/company/rallyversesm/',
  whatsapp: WHATSAPP.businessLink,
  email: `mailto:${CONTACT.email}`,
}

// ─── Social Link Definitions (single source of truth for UI) ────
// Each entry: label (for aria-label/display), href (from SOCIAL or
// WHATSAPP), external (opens in new tab). Add new profiles here.
export const SOCIAL_LINKS = [
  { label: 'Instagram', href: SOCIAL.instagram, external: true },
  { label: 'LinkedIn', href: SOCIAL.linkedin, external: true },
  {
    label: WHATSAPP.hasCommunityChat ? 'WhatsApp Community' : 'WhatsApp',
    href: WHATSAPP.communityLink,
    external: true,
  },
  { label: 'Email', href: SOCIAL.email, external: false },
] as const

// ─── Quick Links ─────────────────────────────────────────────────
export const QUICK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Partners', href: '/partners' },
  { label: 'Community', href: '/community' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Insights', href: '/insights' },
  { label: 'Believers', href: '/believers' },
  { label: 'Events', href: '/events' },
]

// ─── Legal ────────────────────────────────────────────────────────
export const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
]
