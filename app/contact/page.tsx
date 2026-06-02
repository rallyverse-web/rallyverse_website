import type { Metadata } from 'next'
import { Mail, MapPin, Headset, Phone } from 'lucide-react'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import AnimatedSection from '@/components/AnimatedSection'
import SocialIcons from '@/components/SocialIcons'
import { SITE, CONTACT, ADDRESS, ADDRESS_FULL, SOCIAL, WHATSAPP, EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contact — RallyVerse | Get in Touch — Bengaluru Sports Community',
  description: 'Reach out to RallyVerse via email, phone, WhatsApp, or social media. Bengaluru, Karnataka, India.',
  openGraph: {
    title: 'Contact — RallyVerse | Get in Touch — Bengaluru Sports Community',
    description: 'Reach out to RallyVerse via email, phone, WhatsApp, or social media. Bengaluru, Karnataka, India.',
    url: 'https://rallyverse.social/contact',
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
    title: 'Contact — RallyVerse | Get in Touch — Bengaluru Sports Community',
    description: 'Reach out to RallyVerse via email, phone, WhatsApp, or social media. Bengaluru, Karnataka, India.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/contact',
  },
}

const mapsQuery = encodeURIComponent(`${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.state}, ${ADDRESS.country}`)
const MAPS_HREF = `https://www.google.com/maps/search/${mapsQuery}`

const contactMethods = [
  {
    icon: Mail,
    label: 'General Inquiries',
    value: CONTACT.email,
    href: SOCIAL.email,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT.phone,
    href: CONTACT.telUrl,
  },
  {
    icon: Headset,
    label: 'Event Support',
    value: EMAIL.supportEmail,
    href: `mailto:${EMAIL.supportEmail}`,
  },
  {
    icon: WhatsAppIcon,
    label: 'WhatsApp Support',
    value: CONTACT.whatsapp,
    href: WHATSAPP.businessLink,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: ADDRESS_FULL,
    href: MAPS_HREF,
  },
]

export default function ContactPage() {
  const domain = SITE.domain
  const contactUrl = `${domain}/contact`

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${domain}#organization`,
            "url": domain,
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": CONTACT.phone,
              "contactType": "customer service",
              "availableLanguage": ["English", "Hindi", "Kannada"],
              "areaServed": "IN",
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": contactUrl,
            },
          })
        }}
      />
      <div className="mx-auto max-w-[1100px] px-6">
        {/* ── Header ───────────────────────────────────────── */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              CONTACT
            </span>
          </div>

          <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
            GET IN TOUCH
          </h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Have a question, idea, or just want to say hello? We would love to hear from you.
          </p>
        </AnimatedSection>

        {/* ── Response Time Pledge ──────────────────────────── */}
        <AnimatedSection delay={0.05}>
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-4 rounded-xl px-6 py-4 text-center text-sm"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <span style={{ color: 'var(--accent-primary)' }}>⚡</span>
            <span className="font-body" style={{ color: 'var(--text-muted)' }}>
              We typically respond within <strong style={{ color: 'var(--text-primary)' }}>a few hours</strong> during business hours.
            </span>
          </div>
        </AnimatedSection>

        {/* ── Contact Methods ─────────────────────────────────── */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {contactMethods.map((method, i) => {
            const Icon = method.icon
            return (
              <AnimatedSection key={method.label} delay={i * 0.1}>
                {method.href ? (
                  <a
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex flex-col items-center text-center p-8 rounded-xl transition-all duration-200 group"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                  >
                    <Icon size={32} className="mb-4 transition-colors duration-200 group-hover:glow-accent-filter" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="font-display text-[18px] uppercase mb-2" style={{ color: 'var(--text-primary)' }}>
                      {method.label}
                    </h3>
                    <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                      {method.value}
                    </p>
                  </a>
                ) : (
                  <div className="flex flex-col items-center text-center p-8 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <Icon size={32} className="mb-4" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="font-display text-[18px] uppercase mb-2" style={{ color: 'var(--text-primary)' }}>
                      {method.label}
                    </h3>
                    <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                      {method.value}
                    </p>
                  </div>
                )}
              </AnimatedSection>
            )
          })}
        </div>

        {/* ── Social Links ──────────────────────────────────── */}
        <AnimatedSection>
          <div className="mt-20 text-center py-14 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                FOLLOW US
              </span>
              <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
            </div>
            <h2 className="font-display text-[24px] uppercase sm:text-[32px] mb-8" style={{ color: 'var(--text-primary)' }}>
              Stay Connected
            </h2>
            <SocialIcons />
          </div>
        </AnimatedSection>

        {/* ── Trust & Privacy ──────────────────────────────── */}
        <AnimatedSection>
          <div className="mt-12 text-center">
            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-faint)' }}>
              RallyVerse is based in {ADDRESS.area}, {ADDRESS.city}, {ADDRESS.state}, India.
              <br />
              Your information stays private and will only be used to respond to your inquiry.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
