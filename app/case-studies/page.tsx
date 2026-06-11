import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import TrackPageView from '@/components/TrackPageView'

export const metadata: Metadata = {
  title: 'Case Studies — RallyVerse | Proven Sports Growth Campaigns',
  description: 'Explore our sports growth case studies. See how we scaled registrations and community participation for real tournaments in Bengaluru.',
  openGraph: {
    title: 'Case Studies — RallyVerse | Proven Sports Growth Campaigns',
    description: 'Explore our sports growth case studies. See how we scaled registrations and community participation for real tournaments in Bengaluru.',
    url: 'https://rallyverse.social/case-studies',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'RallyVerse — Rallying Communities Through Sports' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies — RallyVerse | Proven Sports Growth Campaigns',
    description: 'Explore our sports growth case studies. See how we scaled registrations and community participation for real tournaments in Bengaluru.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/case-studies',
  },
}

export const caseStudiesData = [
  {
    slug: 'rally-series',
    icon: Trophy,
    title: 'Rally Series 01',
    subtitle: 'Registrations, payment verification, and community engagement.',
    category: 'Tournament Registration',
    results: '150+ players registered, 100% payment verification accuracy',
    active: true,
  },
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TrackPageView pageType="case_studies" />

      <div className="mx-auto max-w-[1100px] px-6">
        {/* ── Header ───────────────────────────────────────── */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              PROOF OF WORK
            </span>
          </div>

          <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
            Results Powered
            <br />
            by Community
          </h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            See how RallyVerse helps sports communities, events, and organizations grow.
          </p>
        </AnimatedSection>

        {/* ── Grid ─────────────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudiesData.map((study, i) => {
            const Icon = study.icon
            return (
              <AnimatedSection key={study.slug} delay={i * 0.1}>
                <div
                  className="rounded-xl p-8 transition-all duration-300 h-full flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <span className="font-body text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                      {study.category}
                    </span>
                    
                    <Icon size={32} className="my-6" style={{ color: 'var(--accent-primary)' }} />
                    
                    <h2 className="font-display text-[24px] uppercase mb-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {study.title}
                    </h2>
                    <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                      {study.subtitle}
                    </p>
                  </div>

                  <div>
                    <p className="font-body text-xs font-semibold uppercase mb-4" style={{ color: 'var(--text-faint)' }}>
                      {study.results}
                    </p>

                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="group inline-flex items-center gap-2 font-body text-sm font-semibold transition-colors duration-200"
                      style={{ color: 'var(--link-color)' }}
                    >
                      Read Case Study
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </div>
  )
}
