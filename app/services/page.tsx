import type { Metadata } from 'next'
import ServicesClient from './ServicesClient'

export const metadata: Metadata = {
  title: 'Services — RallyVerse | Sports Growth Solutions',
  description: 'Discover sports growth solutions powered by RallyVerse. Registration infrastructure, community visibility, analytics, and sports marketing.',
  openGraph: {
    title: 'Services — RallyVerse | Sports Growth Solutions',
    description: 'Discover sports growth solutions powered by RallyVerse. Registration infrastructure, community visibility, analytics, and sports marketing.',
    url: 'https://rallyverse.social/services',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services — RallyVerse | Sports Growth Solutions',
    description: 'Discover sports growth solutions powered by RallyVerse. Registration infrastructure, community visibility, analytics, and sports marketing.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/services',
  },
}

export default function ServicesPage() {
  return <ServicesClient />
}
