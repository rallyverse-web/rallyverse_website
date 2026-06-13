import type { Metadata } from 'next'
import ServicesClient from './ServicesClient'

export const metadata: Metadata = {
  title: 'Sports Marketing & Event Registration Services for Tournament Organizers | RallyVerse',
  description: 'Sports event marketing, registration management, payment verification, attendance check-in, and communication tools for badminton tournaments and sports events. Professional event infrastructure from RallyVerse.',
  openGraph: {
    title: 'Sports Marketing & Event Registration Services for Tournament Organizers | RallyVerse',
    description: 'Sports event marketing, registration management, payment verification, attendance check-in, and communication tools for badminton tournaments and sports events. Professional event infrastructure from RallyVerse.',
    url: 'https://rallyverse.social/services',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Marketing & Event Registration Services for Tournament Organizers | RallyVerse',
    description: 'Sports event marketing, registration management, payment verification, attendance check-in, and communication tools for badminton tournaments and sports events.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/services',
  },
}

export default function ServicesPage() {
  return <ServicesClient />
}
