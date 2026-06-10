import type { Metadata } from 'next'
import { MapPin, Calendar, Clock, Swords, Mountain, Timer, Bike, ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import EventPoster from '@/components/EventPoster'
import TrackPageView from '@/components/TrackPageView'
import { SITE, ADDRESS } from '@/lib/config'
import { getAllPublishedEvents } from '@/lib/repositories/events'
import type { EventWithFormats } from '@/lib/types/supabase'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Events — RallyVerse | Sports Growth Partner',
  description: 'Discover upcoming sports events powered by RallyVerse. Badminton tournaments, runs, and cycling events in Bengaluru.',
  openGraph: {
    title: 'Events — RallyVerse | Sports Growth Partner',
    description: 'Discover upcoming sports events powered by RallyVerse. Badminton tournaments, runs, and cycling events in Bengaluru.',
    url: 'https://rallyverse.social/events',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events — RallyVerse | Sports Growth Partner',
    description: 'Discover upcoming sports events powered by RallyVerse. Badminton tournaments, runs, and cycling events in Bengaluru.',
    images: ['/og'],
  },
  alternates: { canonical: '/events' },
}

const categoryIcons: Record<string, typeof Swords> = {
  badminton: Swords,
  trek: Mountain,
  marathon: Timer,
  cycling: Bike,
}

const categoryLabels: Record<string, string> = {
  badminton: 'The Court',
  trek: 'The Trail',
  marathon: 'The Road',
  cycling: 'The Ride',
}

const futureConcepts = [
  { icon: Swords, name: 'The Court', desc: 'Badminton Leagues', status: 'Registrations Open', color: 'var(--pill-active-text)' as string, bg: 'var(--pill-active-bg)' as string },
  { icon: Timer, name: 'The Road', desc: 'Marathons & Runs', status: 'Coming Soon', color: 'var(--pill-inactive-text)' as string, bg: 'var(--pill-inactive-bg)' as string },
  { icon: Bike, name: 'The Ride', desc: 'Cycling Events', status: 'Coming Soon', color: 'var(--pill-inactive-text)' as string, bg: 'var(--pill-inactive-bg)' as string },
]

function EventCard({ event }: { event: EventWithFormats }) {
  const Icon = categoryIcons[event.category ?? ''] || Swords
  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <div
        className="rounded-xl p-6 transition-all duration-300 h-full flex flex-col"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Icon size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 className="font-display text-[18px] uppercase" style={{ color: 'var(--text-primary)' }}>
            {event.name}
          </h3>
        </div>

        <div className="mt-auto space-y-2 font-body text-sm" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <MapPin size={14} style={{ color: 'var(--icon-color)' }} />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} style={{ color: 'var(--icon-color)' }} />
            <span>{event.date_label || (event.event_date ? new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '')}</span>
          </div>
          {event.rally_points && event.rally_points > 0 && (
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{event.rally_points}</span>
              <span>Rally Points</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default async function EventsPage() {
  const publishedEvents = await getAllPublishedEvents()
  const featuredEvent = publishedEvents.length > 0 ? publishedEvents[0] : null

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TrackPageView pageType="event_listing" />
      <div className="mx-auto max-w-[1100px] px-6">

        {/* ── Header ───────────────────────────────────────── */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              EVENTS
            </span>
          </div>

          <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
            UPCOMING EVENTS
          </h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Every journey begins with a single step. Here is what we have lined up for the RallyVerse community.
          </p>
        </AnimatedSection>

        {/* ── Featured Event ────────────────────────── */}
        {featuredEvent && (
          <div className="mt-16">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                  FEATURED EVENT
                </span>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
              <AnimatedSection>
                <p className="font-body text-[11px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                  {featuredEvent.category?.toUpperCase() || 'UPCOMING'} · {ADDRESS.city} {new Date(featuredEvent.event_date ?? '').getFullYear() || ''}
                </p>

                <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[56px]" style={{ color: 'var(--text-primary)' }}>
                  {featuredEvent.name}
                </h2>
                {featuredEvent.category && (
                  <p className="font-display text-[18px] uppercase sm:text-[22px] mt-1" style={{ color: 'var(--accent-primary)' }}>
                    {categoryLabels[featuredEvent.category] || featuredEvent.category}
                  </p>
                )}

                <div className="mt-6 space-y-4 font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <p>
                    This is where it starts. Not just an event — the first chapter of something that will outlast any single scoreline or bracket result.
                  </p>
                  {featuredEvent.formats && featuredEvent.formats.length > 0 && (
                    <p>
                      {featuredEvent.name} features {featuredEvent.formats.map(f => f.format_name).join(' and ')} categories for Beginner to Advanced players.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: 'var(--icon-color)' }} />
                    <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: 'var(--icon-color)' }} />
                    <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{featuredEvent.date_label || (featuredEvent.event_date ? new Date(featuredEvent.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '')}</span>
                  </div>
                  {featuredEvent.time_label && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} style={{ color: 'var(--icon-color)' }} />
                      <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{featuredEvent.time_label}</span>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  <a
                    href={`/events/${featuredEvent.slug}`}
                    className="inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-bold transition-all duration-200 active:scale-95"
                    style={{
                      background: 'var(--rallyverse-gradient)',
                      color: 'var(--btn-primary-text)',
                    }}
                  >
                    View Event
                    <ArrowRight size={16} />
                  </a>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <EventPoster event={featuredEvent} variant="card" priority />
              </AnimatedSection>
            </div>
          </div>
        )}

        {/* ── All Published Events ─────────────────────────── */}
        {publishedEvents.length > 0 && (
          <div className="mt-16">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                  ALL EVENTS
                </span>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {publishedEvents.map((ev) => (
                <AnimatedSection key={ev.id}>
                  <EventCard event={ev} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* ── Future Concepts ────────────────────────────────── */}
        <div className="mt-24">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  COMING TO THE VERSE
                </span>
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                More Sports Concepts Ahead
              </h2>
              <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                The Verse is just getting started. Here is what is on the horizon.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {futureConcepts.map((ev, i) => {
              const Icon = ev.icon
              return (
                <AnimatedSection key={ev.name} delay={i * 0.1}>
                  <div className="group rounded-xl p-8 text-center transition-all duration-300 h-full flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Icon size={32} className="mb-4" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="font-display text-[22px] uppercase mb-2" style={{ color: 'var(--text-primary)' }}>
                      {ev.name}
                    </h3>
                    <p className="font-body text-[13px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                      {ev.desc}
                    </p>
                    <span className="inline-block rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: ev.bg,
                        color: ev.color,
                      }}
                    >
                      {ev.status}
                    </span>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────── */}
        <AnimatedSection>
          <div className="mt-20 text-center py-14 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <h2 className="font-display text-[28px] uppercase sm:text-[36px]" style={{ color: 'var(--text-primary)' }}>
              Ready to Make Your Move?
            </h2>
            <p className="mt-4 font-body text-base" style={{ color: 'var(--text-muted)' }}>
              {featuredEvent ? `Be part of the first chapter. Join ${featuredEvent.name} today.` : 'Join the RallyVerse community today.'}
            </p>
            <a
              href={featuredEvent ? `/events/${featuredEvent.slug}` : '/'}
              className="mt-8 inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-bold transition-all duration-200 active:scale-95"
              style={{
                background: 'var(--rallyverse-gradient)',
                color: 'var(--btn-primary-text)',
              }}
            >
              {featuredEvent ? 'View Event' : 'Register Now'}
              <ArrowRight size={16} />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
