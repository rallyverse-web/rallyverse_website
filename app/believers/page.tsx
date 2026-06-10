import type { Metadata } from 'next'
import AnimatedSection from '@/components/AnimatedSection'
import { believers } from '@/data/believers'
import BelieversTabs from '@/components/BelieversTabs'

export const metadata: Metadata = {
  title: 'Believers — RallyVerse | Early Supporters & Community Builders',
  description:
    'Meet the early supporters and believers helping RallyVerse build a stronger badminton community through meaningful experiences and shared connections.',
  openGraph: {
    title: 'Believers — RallyVerse | Early Supporters & Community Builders',
    description:
      'Meet the early supporters and believers helping RallyVerse build a stronger badminton community through meaningful experiences and shared connections.',
    url: 'https://rallyverse.social/believers',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'RallyVerse — Rally Beyond Routine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Believers — RallyVerse | Early Supporters & Community Builders',
    description:
      'Meet the early supporters and believers helping RallyVerse build a stronger badminton community through meaningful experiences and shared connections.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/believers',
  },
}

function personStructuredData() {
  return believers.map((person) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.headline,
    image: `https://rallyverse.social${person.image}`,
    sameAs: [person.linkedin],
  }))
}

export default function BelieversPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData()),
        }}
      />

      <div className="mx-auto max-w-[1100px] px-6">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              BELIEVERS
            </span>
          </div>
          <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
            Believers
          </h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            The people who believe in the RallyVerse vision and help turn it into reality.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="mt-12 max-w-2xl font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <p className="mb-4">
              RallyVerse is built on community, movement, and shared experiences.
            </p>
            <p className="mb-4">
              Along the way, we&apos;ve been fortunate to receive support, encouragement, and guidance
              from people who believe in what we&apos;re building.
            </p>
            <p>
              This page recognizes those individuals and their contribution to the journey.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10">
          <BelieversTabs initialBelievers={believers} />
        </div>

      </div>
    </div>
  )
}
