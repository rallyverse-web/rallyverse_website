// ─── Site ─────────────────────────────────────────────────────────
export const SITE = {
  name: 'RallyVerse',
  tagline: 'Rally Beyond Routine',
  domain: 'https://rallyverse.social',
  description:
    'RallyVerse is a community built around badminton, movement, competition, and meaningful experiences.',
}

// ─── Email ────────────────────────────────────────────────────────
export const EMAIL = {
  from: 'RallyVerse <registrations@rallyverse.social>',
  replyTo: 'rallyverseofficial@gmail.com',
  supportEmail: 'rallyverseofficial@gmail.com',
  secondaryFrom: 'RallyVerse <hello@rallyverse.social>',
}

// ─── WhatsApp (single source of truth for all WhatsApp links) ────
export const WHATSAPP = {
  communityLink:
    process.env.NEXT_PUBLIC_COMMUNITY_WHATSAPP_LINK ||
    'https://chat.whatsapp.com/REPLACE_WITH_ACTUAL_LINK',
  businessLink:
    process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP_LINK ||
    'https://wa.me/918951760369',
  businessNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 89517 60369',
}

// ─── Contact ──────────────────────────────────────────────────────
export const CONTACT = {
  phone: WHATSAPP.businessNumber,
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
  country: 'India',
}

export const ADDRESS_FULL = `${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.state}, ${ADDRESS.country}`

// ─── Current Event (single source of truth for Rally Series 01) ──
export const CURRENT_EVENT = {
  name: 'Rally Series 01 — Bengaluru Badminton',
  venue: 'A2V Badminton Academy',
  date: '5 July 2026',
  time: '11:00 AM – 7:00 PM',
  registrationFee: 799,
  categories: ['Mixed Doubles', "Men's Doubles"] as const,
}

// ─── Registration Categories (derived from current event) ────────
export const CATEGORIES = [...CURRENT_EVENT.categories]

// ─── Social ───────────────────────────────────────────────────────
export const SOCIAL = {
  instagram: 'https://www.instagram.com/rallyverseofficial?igsh=eDQ3bm9kODkycml3',
  linkedin: 'https://linkedin.com/company/rallyverse',
  whatsapp: WHATSAPP.businessLink,
  email: `mailto:${CONTACT.email}`,
}

// ─── Quick Links ─────────────────────────────────────────────────
export const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Register', href: '/register' },
  { label: 'Contact', href: '/contact' },
]

// ─── Legal ────────────────────────────────────────────────────────
export const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
]
