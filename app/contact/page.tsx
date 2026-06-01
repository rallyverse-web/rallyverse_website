import type { Metadata } from 'next'
import { Mail, MessageCircle, MapPin } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import SocialIcons from '@/components/SocialIcons'

export const metadata: Metadata = {
  title: 'Contact — RallyVerse | Get in Touch',
  description: 'Reach out to RallyVerse via email, WhatsApp, or social media. Bengaluru, Karnataka, India.',
}

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@rallyverse.in',
    href: 'mailto:hello@rallyverse.in',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+91-XXXXX-XXXXX',
    href: 'https://wa.me/91XXXXXXXXXX',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bengaluru, Karnataka, India',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
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

        {/* ── Contact Methods ─────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
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

        {/* ── Note ──────────────────────────────────────────── */}
        <AnimatedSection>
          <div className="mt-12 text-center">
            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-faint)' }}>
              RallyVerse is based in Bengaluru, Karnataka, India.
              <br />
              For event-related inquiries, please reach out via email or WhatsApp.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
