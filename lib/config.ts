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
}

// ─── Contact ──────────────────────────────────────────────────────
export const CONTACT = {
  email: 'hello@rallyverse.app',
  supportEmail: EMAIL.supportEmail,
  whatsapp: '+91 98765 43210',
  whatsappUrl: 'https://wa.me/919876543210',
}

// ─── Address (temporary — replace once permanent space is secured) ─
export const ADDRESS = {
  line1: 'Whitefield',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  isTemporary: true,
}

export const ADDRESS_FULL = `${ADDRESS.line1}, ${ADDRESS.city}, ${ADDRESS.state}, ${ADDRESS.country}`

// ─── Social ───────────────────────────────────────────────────────
export const SOCIAL = {
  instagram: 'https://instagram.com/rallyverse',
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
