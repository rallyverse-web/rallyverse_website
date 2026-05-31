'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Instagram,
  Linkedin,
  Mail,
  ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ThemedLogo from '@/components/ThemedLogo'
import ShinyText from '@/components/ShinyText'
import Magnet from '@/components/Magnet'

// ─── Data ────────────────────────────────────────────────────────

const exploreLinks = [
  { label: 'The Court', href: '#events' },
  { label: 'The Trail', href: '#events' },
  { label: 'The Road', href: '#events' },
  { label: 'The Ride', href: '#events' },
]

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Community', href: '#community' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

interface SocialLink {
  label: string
  href: string
  icon: LucideIcon | 'playo' | 'whatsapp'
}

const socialLinks: SocialLink[] = [
  { label: 'Instagram', href: 'https://instagram.com/rallyverse', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/rallyverse', icon: Linkedin },
  { label: 'Playo', href: '#', icon: 'playo' },
  { label: 'Email', href: 'mailto:hello@rallyverse.in', icon: Mail },
  { label: 'WhatsApp', href: '#', icon: 'whatsapp' },
]

// ─── Inline icons (same stroke style as Lucide) ─────────────────

const iconMap: Record<string, (size?: number) => React.ReactNode> = {
  playo: (size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  ),
  whatsapp: (size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z" />
    </svg>
  ),
}

// ─── Helpers ─────────────────────────────────────────────────────

function scrollTo(href: string) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ─── Component ───────────────────────────────────────────────────

export default function Footer() {
  const router = useRouter()

  return (
    <>
      {/* ── Pre‑footer CTA ──────────────────────────────────────── */}
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
          <Magnet padding={20}>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{
                background: 'var(--gradient-brand)',
                color: 'var(--btn-primary-text)',
              }}
            >
              <ShinyText
                text="Enter the Verse"
                disabled={false}
                speed={3}
                className="text-sm font-semibold"
                shineColor="rgba(255,255,255,0.6)"
              />
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </Magnet>
        </div>
      </section>

      {/* ── Main Footer ─────────────────────────────────────────── */}
      <footer
        className="px-6 py-16 md:py-20"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div className="mx-auto max-w-[1100px]">
          {/* Grid */}
          <div className="grid gap-12 md:grid-cols-4 md:gap-8">
            {/* ── Brand ─────────────────────────────────────────── */}
            <div className="md:col-span-1">
              <Link href="/" className="mb-5 inline-block">
                <ThemedLogo context="footer" />
              </Link>
              <p className="max-w-[240px] text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                A universe where people rally through sports, adventure, and shared experiences.
              </p>
            </div>

            {/* ── Explore ─────────────────────────────────────── */}
            <div>
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
                Explore
              </h3>
              <ul className="flex flex-col gap-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => scrollTo(link.href)}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Navigation ───────────────────────────────────── */}
            <div>
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
                Navigation
              </h3>
              <ul className="flex flex-col gap-2.5">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => scrollTo(link.href)}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Connect ───────────────────────────────────────── */}
            <div>
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
                Connect
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((s) => {
                  const isExternal = s.href.startsWith('http') || s.href.startsWith('mailto')
                  return (
                    <Link
                      key={s.label}
                      href={s.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
                        e.currentTarget.style.color = 'var(--btn-primary-text)'
                        e.currentTarget.style.borderColor = 'var(--accent-primary)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
                        e.currentTarget.style.color = 'var(--text-muted)'
                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                      aria-label={`RallyVerse on ${s.label}`}
                    >
                      {typeof s.icon === 'string'
                        ? iconMap[s.icon]?.()
                        : <s.icon size={18} />}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ──────────────────────────────────────── */}
          <div className="mt-14 mb-0">
            <div className="mb-6 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <div className="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
              <p className="text-[13px]" style={{ color: 'var(--text-faint)' }}>
                &copy; 2026 RallyVerse. All rights reserved.
              </p>
              <p className="text-[13px] font-medium tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Rally Beyond Routine
              </p>
              <p className="text-[13px]" style={{ color: 'var(--text-faint)' }}>
                Bengaluru, Karnataka, India
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
