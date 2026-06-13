import type { Metadata } from 'next'
import PartnersClient from './PartnersClient'

export const metadata: Metadata = {
  title: 'Sports Marketing Partner for Tournament Organizers, Academies & Clubs | RallyVerse',
  description: 'Become a sports marketing partner with RallyVerse. We help badminton tournament organisers, sports clubs, and academies with registration infrastructure, event promotion, and participant growth.',
  openGraph: {
    title: 'Sports Marketing Partner for Tournament Organizers, Academies & Clubs | RallyVerse',
    description: 'Become a sports marketing partner with RallyVerse. We help badminton tournament organisers, sports clubs, and academies with registration infrastructure, event promotion, and participant growth.',
    url: 'https://rallyverse.social/partners',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Marketing Partner for Tournament Organizers, Academies & Clubs | RallyVerse',
    description: 'Become a sports marketing partner with RallyVerse. We help badminton tournament organisers, sports clubs, and academies with registration infrastructure, event promotion, and participant growth.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/partners',
  },
}

export default function PartnersPage() {
  return <PartnersClient />
}
