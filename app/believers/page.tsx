import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import { believers } from '@/data/believers'
import { WHATSAPP } from '@/lib/config'

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
      <style>{`
        .believers-whatsapp-cta:hover {
          border-color: var(--accent-primary) !important;
          color: var(--accent-primary) !important;
        }
      `}</style>
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
                <div className="relative mb-3">
                  <div
                    className="relative h-32 w-32 overflow-hidden rounded-full"
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
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-3 py-1"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--btn-primary-text)',
                    }}
                  >
                    <span className="font-body text-[9px] font-bold uppercase tracking-wider">
                      Early Supporter
                    </span>
                  </div>
                </div>

                <h2 className="font-display text-[20px] uppercase leading-tight mt-2 mb-1" style={{ color: 'var(--text-primary)' }}>
                  {person.name}
                </h2>
                <p className="font-body text-[13px] font-medium tracking-wide mb-1" style={{ color: 'var(--accent-primary)' }}>
                  {person.headline}
                </p>
                <p className="font-body text-[11px] leading-relaxed mb-5" style={{ color: 'var(--text-faint)' }}>
                  {person.context}
                </p>

                <div
                  className="w-full rounded-lg px-5 py-4 mb-5"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--accent-primary) 8%, transparent)',
                    borderLeft: '3px solid var(--accent-primary)',
                  }}
                >
                  <p
                    className="font-body text-sm leading-relaxed italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {person.quote}
                  </p>
                </div>

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

        <AnimatedSection delay={0.2}>
          <div
            className="mt-24 text-center rounded-xl px-8 py-16"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[44px]" style={{ color: 'var(--text-primary)' }}>
              Believe in the Vision?
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              If RallyVerse resonates with you and you&apos;d like to support the journey, we&apos;d love to hear from you.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 active:scale-95"
                style={{
                  background: 'var(--rallyverse-gradient)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                Connect With Us
                <ArrowRight size={16} />
              </Link>
              <a
                href={WHATSAPP.businessLink}
                target="_blank"
                rel="noopener noreferrer"
                className="believers-whatsapp-cta inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 active:scale-95"
                style={{
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                Message on WhatsApp
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
