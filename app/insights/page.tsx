import type { Metadata } from 'next'
import InsightsClient from './InsightsClient'

export const metadata: Metadata = {
  title: 'Insights — RallyVerse | Sports Community & Event Marketing Strategy',
  description: 'Read the latest insights and operational guides on growing sports communities, optimizing event registrations, and executing local sports marketing campaigns in Bengaluru.',
  openGraph: {
    title: 'Insights — RallyVerse | Sports Community & Event Marketing Strategy',
    description: 'Read the latest insights and operational guides on growing sports communities, optimizing event registrations, and executing local sports marketing campaigns in Bengaluru.',
    url: 'https://rallyverse.social/insights',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights — RallyVerse | Sports Community & Event Marketing Strategy',
    description: 'Read the latest insights and operational guides on growing sports communities, optimizing event registrations, and executing local sports marketing campaigns in Bengaluru.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/insights',
  },
}

export default function InsightsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <InsightsClient />
    </div>
  )
}
