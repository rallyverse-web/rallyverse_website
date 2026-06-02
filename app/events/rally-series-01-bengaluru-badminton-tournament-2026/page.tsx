import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Calendar, Clock, ArrowRight, Users, Trophy, IndianRupee, BadgeCheck } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import EventPoster from '@/components/EventPoster'
import FAQ from '@/components/FAQ'
import { SITE, ADDRESS, CURRENT_EVENT } from '@/lib/config'
import { faqs } from '@/lib/faqs'

export const metadata: Metadata = {
  title: 'Rally Series 01 — Bengaluru Badminton Tournament | July 2026 | RallyVerse',
  description:
    'Rally Series 01 is a competitive badminton tournament in Bengaluru on 5 July 2026. Mixed Doubles & Men\'s Doubles categories at A2V Badminton Academy, Rajajinagar. Register now.',
  openGraph: {
    title: 'Rally Series 01 — Bengaluru Badminton Tournament | July 2026 | RallyVerse',
    description:
      'Rally Series 01 is a competitive badminton tournament in Bengaluru on 5 July 2026. Mixed Doubles & Men\'s Doubles categories at A2V Badminton Academy, Rajajinagar. Register now.',
    url: 'https://rallyverse.social/events/rally-series-01-bengaluru-badminton-tournament-2026',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'Rally Series 01 — Bengaluru Badminton Tournament',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rally Series 01 — Bengaluru Badminton Tournament | July 2026 | RallyVerse',
    description:
      'Rally Series 01 is a competitive badminton tournament in Bengaluru on 5 July 2026. Mixed Doubles & Men\'s Doubles categories at A2V Badminton Academy, Rajajinagar. Register now.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/events/rally-series-01-bengaluru-badminton-tournament-2026',
  },
}

const eventUrl = `${SITE.domain}/events/rally-series-01-bengaluru-badminton-tournament-2026`

export default function RallySeries01Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": `${eventUrl}#breadcrumb`,
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE.domain },
                { "@type": "ListItem", "position": 2, "name": "Events", "item": `${SITE.domain}/events` },
                { "@type": "ListItem", "position": 3, "name": CURRENT_EVENT.name, "item": eventUrl },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              "@id": `${eventUrl}#event`,
              "url": `${SITE.domain}/register`,
              "name": CURRENT_EVENT.name,
              "description": CURRENT_EVENT.description,
              "image": {
                "@type": "ImageObject",
                "url": `${SITE.domain}/og`,
                "width": 1200,
                "height": 630,
              },
              "startDate": CURRENT_EVENT.startISO,
              "endDate": CURRENT_EVENT.endISO,
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": CURRENT_EVENT.venue,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": `${CURRENT_EVENT.venue}, ${ADDRESS.area}`,
                  "addressLocality": ADDRESS.city,
                  "addressRegion": ADDRESS.state,
                  "postalCode": ADDRESS.postalCode,
                  "addressCountry": "IN",
                },
              },
              "offers": {
                "@type": "Offer",
                "price": String(CURRENT_EVENT.registrationFee),
                "priceCurrency": "INR",
                "url": `${SITE.domain}/register`,
                "availability": "https://schema.org/LimitedAvailability",
                "validFrom": CURRENT_EVENT.validFromISO,
              },
              "organizer": {
                "@type": "SportsOrganization",
                "@id": `${SITE.domain}#sportsorganization`,
                "name": SITE.name,
                "url": SITE.domain,
              },
              "sport": "Badminton",
            },
          ]),
        }}
      />

      <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="mx-auto max-w-[1100px] px-6">

          {/* ── Hero ──────────────────────────────────────── */}
          <AnimatedSection>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
              <div className="order-2 md:order-1">
                <p className="font-body text-[11px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                  FIRST CHAPTER · BENGALURU 2026
                </p>

                <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[72px]" style={{ color: 'var(--text-primary)' }}>
                  RALLY SERIES 01
                </h1>
                <p className="font-display text-[18px] uppercase sm:text-[22px] mt-2" style={{ color: 'var(--accent-primary)' }}>
                  Bengaluru Badminton Tournament
                </p>

                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: 'var(--icon-color)' }} />
                    <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{CURRENT_EVENT.venue}, {ADDRESS.area}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: 'var(--icon-color)' }} />
                    <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{CURRENT_EVENT.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: 'var(--icon-color)' }} />
                    <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{CURRENT_EVENT.time}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-bold transition-all duration-200 active:scale-95"
                    style={{
                      background: 'var(--rallyverse-gradient)',
                      color: 'var(--btn-primary-text)',
                    }}
                  >
                    Register Now
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 font-body text-sm font-semibold transition-all duration-200"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    All Events
                  </Link>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <EventPoster variant="card" priority />
              </div>
            </div>
          </AnimatedSection>

          {/* ── Event Overview ────────────────────────────── */}
          <AnimatedSection>
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
                  OVERVIEW
                </span>
              </div>

              <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                THE FIRST CHAPTER OF SOMETHING BIGGER.
              </h2>

              <div className="mt-6 max-w-3xl space-y-5 font-body text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                <p>
                  Rally Series 01 marks the beginning of RallyVerse — a Bengaluru-based sports community built for people who believe that sport is more than just competition. This is not merely a badminton tournament. It is the first chapter of a movement that will grow across multiple sports, venues, and communities.
                </p>
                <p>
                  Taking place on {CURRENT_EVENT.date} at {CURRENT_EVENT.venue} in Rajajinagar, Bengaluru, the tournament brings together badminton enthusiasts from across the city for a day of high-energy matches, camaraderie, and unforgettable moments on the court. Whether you are stepping onto the competitive court for the first time or you have been playing for years, Rally Series 01 is designed to give every participant a professionally organised and memorable experience.
                </p>
                <p>
                  The tournament features {CURRENT_EVENT.categories.join(' and ')} categories, allowing players to compete in the format that suits them best. Each match is officiated, scores are tracked, and winners are recognised. Beyond the competition, Rally Series 01 is about building connections — meeting fellow players who share your passion for the sport and becoming part of a community that extends far beyond a single game.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* ── Venue ──────────────────────────────────────── */}
          <AnimatedSection>
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
                  VENUE
                </span>
              </div>

              <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                WHERE THE GAME HAPPENS.
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-5 font-body text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                  <p>
                    Rally Series 01 will be hosted at A2V Badminton Academy, a well-known badminton facility located in Rajajinagar, Bengaluru. The academy features indoor courts with professional-grade flooring and lighting, providing an ideal environment for competitive play regardless of weather conditions.
                  </p>
                  <p>
                    The venue is easily accessible from all parts of Bengaluru, with ample parking and public transport connectivity. Rajajinagar is centrally located, making it convenient for players coming from different parts of the city to participate without hassle.
                  </p>
                </div>

                <div
                  className="rounded-xl p-6 space-y-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    <div>
                      <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{CURRENT_EVENT.venue}</p>
                      <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{ADDRESS.area}, {ADDRESS.city}, {ADDRESS.state} {ADDRESS.postalCode}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    <div>
                      <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{CURRENT_EVENT.date}</p>
                      <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{CURRENT_EVENT.time}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 font-body text-sm font-semibold transition-colors duration-200"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Get Directions
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ── Categories ──────────────────────────────────── */}
          <AnimatedSection>
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
                  CATEGORIES
                </span>
              </div>

              <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                CHOOSE YOUR FORMAT.
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {CURRENT_EVENT.categories.map((category, i) => (
                  <div
                    key={category}
                    className="rounded-xl p-6 transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy size={20} style={{ color: 'var(--accent-primary)' }} />
                      <h3 className="font-display text-[22px] uppercase" style={{ color: 'var(--text-primary)' }}>
                        {category}
                      </h3>
                    </div>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {category === 'Mixed Doubles'
                        ? 'Teams of one male and one female player competing together. A dynamic format that demands coordination, strategy, and seamless teamwork across the court.'
                        : 'Teams of two male players bringing power, speed, and tactical play. High-intensity rallies and fast-paced action define this classic badminton format.'}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                All skill levels are welcome. Players are matched competitively to ensure great games for everyone. Each team plays multiple matches throughout the day.
              </p>
            </div>
          </AnimatedSection>

          {/* ── Registration ─────────────────────────────── */}
          <AnimatedSection>
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
                  REGISTRATION
                </span>
              </div>

              <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                SECURE YOUR SPOT.
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-5 font-body text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                  <p>
                    Registration for Rally Series 01 is open now. Spots are deliberately limited to ensure every participant enjoys a well-organized experience with sufficient court time and attention to detail.
                  </p>
                  <p>
                    The registration fee is <strong>&#x20B9;{CURRENT_EVENT.registrationFee} per team</strong>, which covers tournament participation, match officiating, and event management. Payment is accepted via UPI (QR code available on the registration page).
                  </p>
                  <p>
                    After submitting the registration form and completing payment, players are required to send the payment screenshot to the official RallyVerse WhatsApp account for verification. Once verified, both team members receive a confirmation email with event details and further instructions.
                  </p>
                </div>

                <div
                  className="rounded-xl p-6 space-y-5"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <IndianRupee size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                      <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Registration Fee</p>
                      <p className="font-display text-[32px] leading-none" style={{ color: 'var(--accent-primary)' }}>
                        &#x20B9;{CURRENT_EVENT.registrationFee}
                      </p>
                      <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>per team (2 players)</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      'Fill the registration form with your team details',
                      `Pay \u20B9${CURRENT_EVENT.registrationFee} via UPI using the QR code`,
                      'Send payment screenshot on WhatsApp for verification',
                      'Receive confirmation email for both team members',
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <BadgeCheck size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{step}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/register"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-bold transition-all duration-200 active:scale-95"
                    style={{
                      background: 'var(--rallyverse-gradient)',
                      color: 'var(--btn-primary-text)',
                    }}
                  >
                    Register Now
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ── FAQ ────────────────────────────────────────── */}
          <AnimatedSection>
            <div className="mt-20">
              <FAQ />
            </div>
          </AnimatedSection>

          {/* ── Internal Links / CTA ────────────────────────── */}
          <AnimatedSection>
            <div
              className="mt-20 text-center py-14 rounded-xl"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <h2 className="font-display text-[28px] uppercase sm:text-[36px]" style={{ color: 'var(--text-primary)' }}>
                READY TO RALLY?
              </h2>
              <p className="mt-4 font-body text-base" style={{ color: 'var(--text-muted)' }}>
                Join the first chapter of RallyVerse. Register now or explore more events.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-bold transition-all duration-200 active:scale-95"
                  style={{
                    background: 'var(--rallyverse-gradient)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  Register Now
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-semibold transition-all duration-200"
                  style={{
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  View All Events
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-body text-sm font-semibold transition-all duration-200"
                  style={{
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  About RallyVerse
                </Link>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </>
  )
}
