import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Presentation } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Sponsorships & Brand Activations — RallyVerse',
  description: 'Reach active, high-intent sports communities through tailored sponsorships, event activations, and digital engagement channels with RallyVerse.',
}

export default function SponsorsPage() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex flex-col justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <AnimatedSection>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)', border: '1px solid var(--accent-primary)' }}>
            <Presentation size={32} style={{ color: 'var(--accent-primary)' }} />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              SPONSORSHIPS
            </span>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>

          <h1 className="font-display text-[40px] leading-none uppercase sm:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            SPONSOR & ACTIVATE
          </h1>
          
          <p className="mt-6 font-body text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Get your brand directly in front of thousands of active, engaged sports participants. We offer direct-to-community activations, tournament naming rights, academy marketing campaigns, and high-visibility corporate sports sponsorships that deliver real, measurable engagement rather than static impressions.
          </p>

          <p className="mt-4 font-body text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-faint)' }}>
            We work with consumer brands, wellness companies, and local businesses. Contact our partnerships team to receive our sponsorship deck and customized activation options.
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
              Get Sponsorship Deck
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold transition-all duration-200 border"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              Explore Services
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
