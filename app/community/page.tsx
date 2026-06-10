import type { Metadata } from 'next'
import CommunityClient from './CommunityClient'

export const metadata: Metadata = {
  title: 'Community — RallyVerse | Rallying Communities Through Sports',
  description: 'Join the RallyVerse sports community. Connect with corporate peers, players, organizers, and volunteers in Bengaluru.',
  openGraph: {
    title: 'Community — RallyVerse | Rallying Communities Through Sports',
    description: 'Join the RallyVerse sports community. Connect with corporate peers, players, organizers, and volunteers in Bengaluru.',
    url: 'https://rallyverse.social/community',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community — RallyVerse | Rallying Communities Through Sports',
    description: 'Join the RallyVerse sports community. Connect with corporate peers, players, organizers, and volunteers in Bengaluru.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/community',
  },
}

export default function CommunityPage() {
  return <CommunityClient />
}
