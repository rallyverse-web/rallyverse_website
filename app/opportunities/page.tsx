import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Briefcase } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Careers & Opportunities — RallyVerse',
  description: 'Join the team building India&apos;s leading community-driven sports growth engine. Explore career opportunities, internship roles, and partner openings.',
}

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex flex-col justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <AnimatedSection>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)', border: '1px solid var(--accent-primary)' }}>
            <Briefcase size={32} style={{ color: 'var(--accent-primary)' }} />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              CAREERS
            </span>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>

          <h1 className="font-display text-[40px] leading-none uppercase sm:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            GROW WITH US
          </h1>
          
          <p className="mt-6 font-body text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            RallyVerse is expanding. We are always looking for passionate sports coordinators, event managers, software engineers, and community leads to join our mission of rallying communities through sports. Whether you want to work full-time, consult, or volunteer at events, there is a place for you.
          </p>

          <p className="mt-4 font-body text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-faint)' }}>
            We list job descriptions and project contract listings directly on this page. If you are passionate about sports and technology, reach out to us with your experience.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/partners"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{
                background: 'var(--rallyverse-gradient)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Get In Touch
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold transition-all duration-200 border"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              About RallyVerse
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
