import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Clock, ArrowRight, Users, Trophy, IndianRupee, BadgeCheck, MessageCircle, ExternalLink } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import EventPoster from '@/components/EventPoster'
import TrackPageView from '@/components/TrackPageView'
import { WhatsAppContactLink, WhatsAppGroupLink } from '@/components/WhatsAppLink'
import { SITE, ADDRESS, ADDRESS_FULL } from '@/lib/config'
import { getEventBySlug } from '@/lib/repositories/events'
import { getEventPosterPath, PLACEHOLDER_POSTER } from '@/lib/assets'
import type { EventWithFormats } from '@/lib/types/supabase'

export const revalidate = 60

// No generateStaticParams — page uses ISR via revalidate export

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return {}
  return {
    title: `${event.name} | RallyVerse`,
    description: event.description ?? undefined,
    openGraph: {
      title: `${event.name} | RallyVerse`,
      description: event.description ?? undefined,
      url: `${SITE.domain}/events/${event.slug}`,
      siteName: 'RallyVerse',
      locale: 'en_IN',
      type: 'website',
      images: [{ url: getEventPosterPath(event.slug), width: 1200, height: 630, alt: event.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.name} | RallyVerse`,
      description: event.description ?? undefined,
      images: [getEventPosterPath(event.slug)],
    },
    alternates: { canonical: `/events/${event.slug}` },
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
}

function CategoryDescription({ format }: { format: string }) {
  const descs: Record<string, string> = {
    "Mixed Doubles": 'Teams of one male and one female player competing together. A dynamic format that demands coordination, strategy, and seamless teamwork across the court.',
    "Men's Doubles": 'Teams of two male players bringing power, speed, and tactical play. High-intensity rallies and fast-paced action define this classic badminton format.',
    "Women's Doubles": 'Teams of two female players showcasing agility, precision, and strategic court coverage. Fast-paced rallies and intelligent shot placement define this exciting format.',
    "Men's Singles": 'One-on-one showdown testing individual skill, stamina, and mental toughness. Every point is a battle of wits and athleticism.',
    "Women's Singles": 'A solo contest of precision, speed, and endurance. Pure badminton skill on display from the first serve to the final point.',
  }
  return descs[format] || `Competitive ${format.toLowerCase()} format. All skill levels welcome.`
}

function EventDetailContent({ event }: { event: EventWithFormats }) {
  const eventUrl = `${SITE.domain}/events/${event.slug}`
  const feeDisplay = event.registration_fee ? `₹${event.registration_fee}` : 'Free'

  return (
    <>
      <TrackPageView pageType="event_detail" eventId={event.id} slug={event.slug} />
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
                { "@type": "ListItem", "position": 3, "name": event.name, "item": eventUrl },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              "@id": `${eventUrl}#event`,
              "url": `${SITE.domain}/events/${event.slug}/register`,
              "name": event.name,
              "description": event.description,
              "image": { "@type": "ImageObject", "url": `${SITE.domain}/og`, "width": 1200, "height": 630 },
              "startDate": event.event_date ?? undefined,
              "endDate": event.event_date ?? undefined,
              "eventStatus": event.is_date_confirmed ? "https://schema.org/EventScheduled" : "https://schema.org/EventMovedOnline",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": event.venue,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": `${event.venue}, ${ADDRESS.city}`,
                  "addressLocality": ADDRESS.city,
                  "addressRegion": ADDRESS.state,
                  "postalCode": ADDRESS.postalCode,
                  "addressCountry": "IN",
                },
              },
              "offers": {
                "@type": "Offer",
                "price": String(event.registration_fee ?? 0),
                "priceCurrency": "INR",
                "url": `${SITE.domain}/events/${event.slug}/register`,
                "availability": "https://schema.org/LimitedAvailability",
              },
              "organizer": {
                "@type": "SportsOrganization",
                "@id": `${SITE.domain}#sportsorganization`,
                "name": SITE.name,
                "url": SITE.domain,
              },
              "sport": event.category ?? "Badminton",
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
                  {event.category ? `${event.category.toUpperCase()} · ${ADDRESS.city} ${new Date(event.event_date ?? '').getFullYear() || ''}` : 'UPCOMING EVENT'}
                </p>

                <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[72px]" style={{ color: 'var(--text-primary)' }}>
                  {event.name}
                </h1>

                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: 'var(--icon-color)' }} />
                    <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: 'var(--icon-color)' }} />
                    <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{event.date_label || formatDate(event.event_date)}</span>
                  </div>
                  {event.time_label && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} style={{ color: 'var(--icon-color)' }} />
                      <span className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{event.time_label}</span>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  <Link
                    href={`/events/${event.slug}/register`}
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
                <EventPoster event={event} variant="card" priority />
              </div>
            </div>
          </AnimatedSection>

          {/* ── Event Overview ────────────────────────────── */}
          {event.description && (
            <AnimatedSection>
              <div className="mt-20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
                    OVERVIEW
                  </span>
                </div>

                <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                  THE EXPERIENCE.
                </h2>

                <div className="mt-6 max-w-3xl space-y-5 font-body text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                  {event.description.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* ── Venue ──────────────────────────────────────── */}
          {event.venue && (
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
                      This event will be hosted at {event.venue} in {ADDRESS.city}, {ADDRESS.state}. The venue is easily accessible from all parts of the city.
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
                        <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{event.venue}</p>
                        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{ADDRESS_FULL}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                      <div>
                        <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{event.date_label || formatDate(event.event_date)}</p>
                        {event.time_label && <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{event.time_label}</p>}
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
        )}

          {/* ── WhatsApp ──────────────────────────────────── */}
          {event.whatsapp_number && (
            <AnimatedSection>
              <div className="mt-20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
                    CONTACT
                  </span>
                </div>

                <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                  STAY CONNECTED.
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-5 font-body text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                    <p>
                      Have questions or need assistance? Reach out to the event organizer directly on WhatsApp.
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
                      <MessageCircle size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                      <div>
                        <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Event WhatsApp</p>
                        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{event.whatsapp_number}</p>
                        <WhatsAppContactLink eventId={event.id} href={`https://wa.me/${event.whatsapp_number.replace(/[^0-9]/g, '')}`}>
                          <ExternalLink size={14} /> Chat on WhatsApp
                        </WhatsAppContactLink>
                      </div>
                    </div>

                    {event.whatsapp_group_link && (
                      <div className="flex items-start gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <MessageCircle size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>WhatsApp Group</p>
                          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Join the event group for live updates and coordination.</p>
                          <WhatsAppGroupLink eventId={event.id} href={event.whatsapp_group_link}>
                            <ExternalLink size={14} /> Join Group
                          </WhatsAppGroupLink>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* ── Formats / Categories ──────────────────────────── */}
          {event.formats && event.formats.length > 0 && (
            <AnimatedSection>
              <div className="mt-20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
                    FORMATS
                  </span>
                </div>

                <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                  CHOOSE YOUR FORMAT.
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {event.formats.map((fmt) => (
                    <div
                      key={fmt.id}
                      className="rounded-xl p-6 transition-all duration-300"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Trophy size={20} style={{ color: 'var(--accent-primary)' }} />
                        <h3 className="font-display text-[22px] uppercase" style={{ color: 'var(--text-primary)' }}>
                          {fmt.format_name}
                        </h3>
                      </div>
                      <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        <CategoryDescription format={fmt.format_name} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

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
                    Registration is open now. Spots are deliberately limited to ensure every participant enjoys a well-organized experience.
                  </p>
                  <p>
                    The registration fee is <strong>{feeDisplay}</strong>. Payment is accepted via UPI (QR code available on the registration page).
                  </p>
                  <p>
                    After submitting the registration form and completing payment, players are required to send the payment screenshot to the official RallyVerse WhatsApp account for verification.
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
                        {feeDisplay}
                      </p>
                      <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                        {event.formats?.some(f => f.format_name.includes('Doubles')) ? 'per team (2 players)' : 'per player'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      'Fill the registration form with your details',
                      `Pay ${feeDisplay} via UPI using the QR code`,
                      'Send payment screenshot on WhatsApp for verification',
                      'Receive confirmation email',
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <BadgeCheck size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{step}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/events/${event.slug}/register`}
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

          {/* ── CTA ────────────────────────────────────────── */}
          <AnimatedSection>
            <div
              className="mt-20 text-center py-14 rounded-xl"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <h2 className="font-display text-[28px] uppercase sm:text-[36px]" style={{ color: 'var(--text-primary)' }}>
                READY TO RALLY?
              </h2>
              <p className="mt-4 font-body text-base" style={{ color: 'var(--text-muted)' }}>
                Join the RallyVerse. Register now or explore more events.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href={`/events/${event.slug}/register`}
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

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()
  return <EventDetailContent event={event} />
}
