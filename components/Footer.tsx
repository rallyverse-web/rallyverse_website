'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Instagram, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import ThemedLogo from '@/components/ThemedLogo'
import ShinyText from '@/components/ShinyText'
import { SITE, COMPANY, CONTACT, ADDRESS, SOCIAL, WHATSAPP, QUICK_LINKS, LEGAL_LINKS, SOCIAL_LINKS } from '@/lib/config'

// ─── Social icon mapping (derived from config's SOCIAL_LINKS) ──
const socialIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Instagram,
  LinkedIn: Linkedin,
  WhatsApp: WhatsAppIcon,
  'WhatsApp Community': WhatsAppIcon,
  Email: Mail,
}

// ─── Column data ─────────────────────────────────────────────
const contactItems = [
  { label: 'Phone', value: CONTACT.phone, href: CONTACT.telUrl },
  { label: 'Email', value: CONTACT.email, href: SOCIAL.email },
  { label: 'WhatsApp', value: CONTACT.whatsapp, href: WHATSAPP.businessLink },
]

export default function Footer() {
  return (
    <div id="contact">
      {/* ── Pre‑footer CTA ────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 py-20 md:py-28"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="absolute inset-x-0 top-0 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
        <div className="mx-auto max-w-[640px] text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to Rally Beyond Routine?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-8 max-w-md text-base leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Join a community built around movement, adventure, and meaningful experiences.
          </motion.p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 active:scale-95"
            style={{
              background: 'var(--rallyverse-gradient)',
              color: 'var(--btn-primary-text)',
            }}
          >
            <ShinyText
              text="Secure Your Spot"
              disabled={false}
              speed={3}
              className="text-base font-semibold"
              shineColor="rgba(255,255,255,0.6)"
            />
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Main Footer ───────────────────────────────────────── */}
      <footer
        aria-label="Site footer"
        className="px-6 py-16 md:py-20"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div className="mx-auto max-w-[1100px]">
          {/* Grid — 4 columns on desktop */}
          <div className="grid gap-12 md:grid-cols-4 md:gap-8">

            {/* ── Column 1: Brand + Trust ──────────────────────── */}
            <div className="md:col-span-1">
              <Link href="/" className="mb-5 inline-block">
                <ThemedLogo context="footer" />
              </Link>
              <p className="mb-3 max-w-[260px] text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {SITE.description}
              </p>
              <p className="max-w-[260px] text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {COMPANY.shortDescription}
              </p>
            </div>

            {/* ── Column 2: Quick Links ───────────────────────── */}
            <div>
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
                Quick Links
              </h3>
              <ul className="flex flex-col gap-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 3: Contact ────────────────────────────── */}
            <div>
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
                Contact
              </h3>
              <ul className="flex flex-col gap-3">
                {contactItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      {item.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 4: Location ──────────────────────────── */}
            <div>
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
                Location
              </h3>
              <address className="not-italic text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                <span className="block">{ADDRESS.area}</span>
                <span className="block">{ADDRESS.city}, {ADDRESS.state} {ADDRESS.postalCode}</span>
                <span className="block">{ADDRESS.country}</span>
              </address>
            </div>
          </div>

          {/* ── Social Icons Row ───────────────────────────────── */}
          <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
                Follow Us
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = socialIconMap[s.label]
                  if (!Icon) return null
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.external ? '_blank' : undefined}
                      rel={s.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
                        e.currentTarget.style.color = 'var(--btn-primary-text)'
                        e.currentTarget.style.borderColor = 'var(--accent-primary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
                        e.currentTarget.style.color = 'var(--text-muted)'
                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      }}
                      aria-label={`${SITE.name} on ${s.label}`}
                    >
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ────────────────────────────────────── */}
          <div className="mt-10">
            <div className="mb-6 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-[13px]" style={{ color: 'var(--text-faint)' }}>
                &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
              </p>
              <div className="flex gap-4">
                {LEGAL_LINKS.map((link, i) => (
                  <span key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] transition-colors duration-200"
                      style={{ color: 'var(--text-faint)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)' }}
                    >
                      {link.label}
                    </Link>
                    {i < LEGAL_LINKS.length - 1 && (
                      <span className="mx-4 text-[13px]" style={{ color: 'var(--text-faint)' }}>&middot;</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
