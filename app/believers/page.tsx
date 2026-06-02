import type { Metadata } from 'next'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import { believers } from '@/data/believers'

export const metadata: Metadata = {
  title: 'Believers — RallyVerse | The People Who Believe in Our Vision',
  description:
    'Meet the people who believe in the RallyVerse vision and support our mission of building communities through badminton and shared experiences.',
  openGraph: {
    title: 'Believers — RallyVerse | The People Who Believe in Our Vision',
    description:
      'Meet the people who believe in the RallyVerse vision and support our mission of building communities through badminton and shared experiences.',
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
    title: 'Believers — RallyVerse | The People Who Believe in Our Vision',
    description:
      'Meet the people who believe in the RallyVerse vision and support our mission of building communities through badminton and shared experiences.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/believers',
  },
}

export default function BelieversPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
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

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {believers.map((person, i) => (
            <AnimatedSection key={person.name} delay={i * 0.1}>
              <div
                className="flex flex-col items-center text-center rounded-xl p-8 transition-all duration-200 h-full"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <div
                  className="relative mb-6 h-32 w-32 overflow-hidden rounded-full"
                  style={{ border: '2px solid var(--border-subtle)' }}
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <h2 className="font-display text-[20px] uppercase leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  {person.name}
                </h2>
                <p className="font-body text-[13px] font-medium tracking-wide mb-4" style={{ color: 'var(--accent-primary)' }}>
                  {person.headline}
                </p>
                <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  {person.description}
                </p>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 rounded-md px-5 py-3 font-body text-sm font-semibold transition-all duration-200"
                  style={{
                    background: 'var(--rallyverse-gradient)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  View LinkedIn
                  <ExternalLink size={14} />
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {believers.length === 0 && (
          <AnimatedSection delay={0.2}>
            <div className="mt-20 text-center py-20 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <p className="font-body text-base" style={{ color: 'var(--text-faint)' }}>
                More profiles coming soon.
              </p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
