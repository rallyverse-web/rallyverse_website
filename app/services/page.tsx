import type { Metadata } from 'next'
import ServicesClient from './ServicesClient'

export const metadata: Metadata = {
  title: 'Services — RallyVerse | Sports Growth Solutions',
  description: 'Discover sports growth solutions powered by RallyVerse. Community building, event management, sports marketing, and tournament infrastructure.',
  openGraph: {
    title: 'Services — RallyVerse | Sports Growth Solutions',
    description: 'Discover sports growth solutions powered by RallyVerse. Community building, event management, sports marketing, and tournament infrastructure.',
    url: 'https://rallyverse.social/services',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services — RallyVerse | Sports Growth Solutions',
    description: 'Discover sports growth solutions powered by RallyVerse. Community building, event management, sports marketing, and tournament infrastructure.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/services',
  },
}

export default function ServicesPage() {
  return <ServicesClient />
}
