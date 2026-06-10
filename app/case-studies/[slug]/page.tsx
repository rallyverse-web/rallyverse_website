'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Trophy, User } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import TrackPageView from '@/components/TrackPageView'

const detailedCaseStudies: Record<string, {
  title: string
  subtitle: string
  category: string
  overview: string
  challenge: string
  solution: string
  results: string[]
  testimonial: { quote: string; author: string; role: string }
}> = {
  'rally-series': {
    title: 'Rally Series 01',
    subtitle: 'Event execution, custom registration engine, and active community launch.',
    category: 'Tournament Operations',
    overview: 'Rally Series 01 was a competitive badminton tournament launched in Bengaluru. The goal was to prove the efficiency of RallyVerse\'s custom registration flow and player communication infrastructure in replacing fragmented coordinator workflows.',
    challenge: 'Local organizers were struggling with manual WhatsApp checks, untracked bank transfers, duplicate registrations, and lack of real-time scheduling coordination with participants.',
    solution: 'RallyVerse deployed custom-built digital registration systems, payment verification portals, automated notification templates, and routed all players into our owned WhatsApp community hub.',
    results: [
      '150+ players successfully registered and verified.',
      '100% payment collection and fee verification accuracy.',
      'Zero manual coordination overhead for bracket setups.',
      'Over 90% participant rate in post-event community discussions.',
    ],
    testimonial: {
      quote: 'RallyVerse simplified our tournament registration flow from a multi-day spreadsheet chore into a seamless automated portal. The check-ins and payments were fully verified.',
      author: 'Coach S. Kumar',
      role: 'Lead Coordinator, Bengaluru Badminton Academy',
    }
  }
}

export default function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { slug } = use(params)
  
  const study = detailedCaseStudies[slug] || {
    title: 'Upcoming Case Study',
    subtitle: 'Scaling sport visibility and registration volumes.',
    category: 'Ecosystem Growth',
    overview: 'This case study outlines RallyVerse\'s upcoming initiative to scale registrations, provide customized dashboards, and launch promotional outreach for local sporting communities.',
    challenge: 'Reaching a targeted audience of active sports competitors and managing check-in check-outs without manual intervention.',
    solution: 'Deploying our community-owned sports channels and integrated marketing platforms.',
    results: [
      'Enhanced local brand visibility.',
      'Increased athlete check-in efficiency.',
      'Compounding member retention loops.',
    ],
    testimonial: {
      quote: 'We look forward to sharing detailed metrics once this campaign completes.',
      author: 'RallyVerse Analytics Team',
      role: 'Operations & Tracking',
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    'name': `${study.title} Case Study`,
    'headline': study.subtitle,
    'description': study.overview,
    'about': {
      '@type': 'SportsEvent',
      'name': 'RallyVerse Sports Management',
    },
    'author': {
      '@type': 'Organization',
      'name': 'RallyVerse',
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TrackPageView pageType={`case_study_${slug}`} />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[800px] px-6">
        {/* Back Link */}
        <AnimatedSection>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold mb-8"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={16} />
            Back to Case Studies
          </Link>
        </AnimatedSection>

        {/* Hero Section */}
        <AnimatedSection delay={0.05}>
          <span className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
            {study.category}
          </span>
          <h1 className="font-display text-[36px] sm:text-[48px] md:text-[64px] uppercase leading-none mt-4 mb-6" style={{ color: 'var(--text-primary)' }}>
            {study.title}
          </h1>
          <p className="font-body text-lg leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
            {study.subtitle}
          </p>
        </AnimatedSection>

        {/* Case Study Details */}
        <div className="space-y-12">
          {/* Overview */}
          <AnimatedSection delay={0.1}>
            <h2 className="font-display text-[24px] uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
              Overview
            </h2>
            <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {study.overview}
            </p>
          </AnimatedSection>

          {/* Challenge */}
          <AnimatedSection delay={0.15}>
            <h2 className="font-display text-[24px] uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
              The Challenge
            </h2>
            <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {study.challenge}
            </p>
          </AnimatedSection>

          {/* Solution */}
          <AnimatedSection delay={0.2}>
            <h2 className="font-display text-[24px] uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
              Our Solution
            </h2>
            <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {study.solution}
            </p>
          </AnimatedSection>

          {/* Results */}
          <AnimatedSection delay={0.25}>
            <h2 className="font-display text-[24px] uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
              Results
            </h2>
            <ul className="space-y-3">
              {study.results.map((result) => (
                <li key={result} className="flex items-start gap-3 text-base font-body">
                  <Check size={18} className="mt-1 shrink-0" style={{ color: 'var(--success-color)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>{result}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Testimonial */}
          <AnimatedSection delay={0.3}>
            <div
              className="rounded-xl p-8 mt-12"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderLeft: '4px solid var(--accent-primary)',
              }}
            >
              <p className="font-body text-base italic leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
                &ldquo;{study.testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                  <User size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {study.testimonial.author}
                  </h4>
                  <p className="font-body text-xs" style={{ color: 'var(--accent-primary)' }}>
                    {study.testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
