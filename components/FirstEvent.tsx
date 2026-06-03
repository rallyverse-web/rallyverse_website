'use client'

import { useRouter } from 'next/navigation'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import ShinyText from '@/components/ShinyText'
import EventPoster from '@/components/EventPoster'
import type { EventWithFormats } from '@/lib/types/supabase'

export default function FirstEvent({ event }: { event: EventWithFormats | null }) {
  const router = useRouter()

  if (!event) return null

  return (
    <section id="events" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-6 md:grid-cols-2 md:gap-16 md:items-start">
        <AnimatedSection>
          <p className="mb-5 font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            UPCOMING EVENTS · {event.venue?.split(',').pop()?.trim() || 'BENGALURU'}
          </p>

          <div className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[88px]" style={{ color: 'var(--text-primary)' }}>
            EXPERIENCES
            <br />
            THAT MOVE YOU.
          </div>
          <div className="mt-2 font-display text-[18px] uppercase sm:text-[22px] md:text-[36px]" style={{ color: 'var(--accent-primary)' }}>
            RALLYVERSE
          </div>

          <div className="mt-7 space-y-5 font-body text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
            <p>
              RallyVerse is a universe of experiences — from competitive badminton tournaments to community treks, marathons, and cycling events. The first chapter begins now.
            </p>
            <p>
              {event.name} is currently open for registration
              {event.formats && event.formats.length > 0
                ? ` featuring ${event.formats.map(f => f.format_name).join(' and ')} categories.`
                : '.'}
              {' '}Whether you are a seasoned competitor or a first-time participant, there is a place for you.
            </p>
            <p>
              Spots are deliberately limited because every participant deserves a well-run experience.
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => router.push(`/events/${event.slug}/register`)}
              className="group relative overflow-hidden rounded-md px-10 py-4 font-body text-base font-bold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              <span className="relative z-10">
                <ShinyText
                  text="Register Now"
                  disabled={false}
                  speed={3}
                  className="font-semibold"
                  shineColor="rgba(255,255,255,0.6)"
                />
              </span>
              <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'var(--rallyverse-gradient)' }} />
            </button>

            <button
              type="button"
              onClick={() => router.push('/events')}
              className="inline-flex items-center gap-2 rounded-md px-8 py-4 font-body text-sm font-semibold transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              View All Events
              <ArrowRight size={16} />
            </button>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="group">
            <EventPoster event={event} variant="card" />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={14} style={{ color: 'var(--icon-color)' }} />
                <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} style={{ color: 'var(--icon-color)' }} />
                <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{event.date_label || (event.event_date ? new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '')}</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
