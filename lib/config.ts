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

// ─── Contact ──────────────────────────────────────────────────────
export const CONTACT = {
  phone: '+91 89517 60369',
  email: 'rallyverseofficial@gmail.com',
  supportEmail: EMAIL.supportEmail,
  whatsapp: '+91 89517 60369',
  whatsappUrl: 'https://wa.me/918951760369',
}

// ─── Address ─────────────────────────────────────────────────────
export const ADDRESS = {
  area: 'Rajajinagar',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
}

export const ADDRESS_FULL = `${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.state}, ${ADDRESS.country}`

// ─── Registration Categories ──────────────────────────────────────
export const CATEGORIES = [
  'Mixed Doubles',
  "Men's Doubles",
]

// ─── Social ───────────────────────────────────────────────────────
export const SOCIAL = {
  instagram: 'https://www.instagram.com/rallyverseofficial?igsh=eDQ3bm9kODkycml3',
  linkedin: 'https://linkedin.com/company/rallyverse',
  whatsapp: CONTACT.whatsappUrl,
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
