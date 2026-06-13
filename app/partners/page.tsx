import type { Metadata } from 'next'
import PartnersClient from './PartnersClient'

export const metadata: Metadata = {
  title: 'Partners — RallyVerse | Grow Your Sports Community',
  description: 'Partner with RallyVerse to grow your brand, sports academy, club, or event. Registration infrastructure, payment management, attendance tracking, and sports marketing.',
  openGraph: {
    title: 'Partners — RallyVerse | Grow Your Sports Community',
    description: 'Partner with RallyVerse to grow your brand, sports academy, club, or event. Registration infrastructure, payment management, attendance tracking, and sports marketing.',
    url: 'https://rallyverse.social/partners',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partners — RallyVerse | Grow Your Sports Community',
    description: 'Partner with RallyVerse to grow your brand, sports academy, club, or event. Registration infrastructure, payment management, attendance tracking, and sports marketing.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/partners',
  },
}

export default function PartnersPage() {
  return <PartnersClient />
}
