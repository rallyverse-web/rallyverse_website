import type { Metadata } from 'next'
import { MapPin, Calendar, Swords, Mountain, Timer, Bike, ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Events — RallyVerse | Upcoming Tournaments & Adventures',
  description: 'Discover upcoming RallyVerse events. Badminton tournaments, treks, marathons, and cycling events in Bengaluru. Rally Series 01 is here.',
}

const futureEvents = [
  { icon: Swords, name: 'The Court', desc: 'Badminton — Season 01', status: 'Registrations Open', color: 'var(--pill-active-text)' as string, bg: 'var(--pill-active-bg)' as string },
  { icon: Mountain, name: 'The Trail', desc: 'Trekking', status: 'Coming Soon', color: 'var(--pill-inactive-text)' as string, bg: 'var(--pill-inactive-bg)' as string },
  { icon: Timer, name: 'The Road', desc: 'Marathons & Runs', status: 'Coming Soon', color: 'var(--pill-inactive-text)' as string, bg: 'var(--pill-inactive-bg)' as string },
  { icon: Bike, name: 'The Ride', desc: 'Cycling Events', status: 'Coming Soon', color: 'var(--pill-inactive-text)' as string, bg: 'var(--pill-inactive-bg)' as string },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
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

        {/* ── Featured: Rally Series 01 ───────────────────────── */}
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
                FIRST CHAPTER · BENGALURU 2026
              </p>

              <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[56px]" style={{ color: 'var(--text-primary)' }}>
                RALLY SERIES 01
              </h2>
              <p className="font-display text-[18px] uppercase sm:text-[22px] mt-1" style={{ color: 'var(--accent-primary)' }}>
                Bengaluru Badminton Tournament
              </p>

              <div className="mt-6 space-y-4 font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                <p>
                  This is where it starts. Not just a tournament — the first chapter of something that will outlast any single scoreline or bracket result.
                </p>
                <p>
                  Rally Series 01 is built for Bengaluru&apos;s most passionate players. Men&apos;s Singles. Women&apos;s Singles. Doubles. Mixed. From Beginner to Advanced, there is a court for you.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <MapPin size={16} style={{ color: 'var(--icon-color)' }} />
                  <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Bengaluru, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: 'var(--icon-color)' }} />
                  <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Date TBA</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-bold transition-all duration-200 active:scale-95"
                  style={{
                    background: 'var(--rallyverse-gradient)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  Register Now
                  <ArrowRight size={16} />
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="aspect-[3/4] w-full rounded-xl flex flex-col items-center justify-center gap-6" style={{
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
              }}>
                <div className="font-display text-[80px] leading-none tracking-wide" style={{ color: 'var(--text-faint)' }}>
                  RV
                </div>
                <div className="text-center">
                  <p className="font-display text-[18px] tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    RALLY SERIES 01
                  </p>
                  <p className="mt-1 font-body text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    BENGALURU &middot; 2026
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* ── Future Events ────────────────────────────────── */}
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
                More Adventures Ahead
              </h2>
              <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                The Verse is just getting started. Here is what is on the horizon.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {futureEvents.map((ev, i) => {
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
              Be part of the first chapter. Register for Rally Series 01 today.
            </p>
            <a
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-bold transition-all duration-200 active:scale-95"
              style={{
                background: 'var(--rallyverse-gradient)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Register Now
              <ArrowRight size={16} />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
