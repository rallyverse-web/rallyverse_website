'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, User } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import TrackPageView from '@/components/TrackPageView'

export const blogPostsData = [
  {
    slug: 'grow-sports-community',
    title: 'How to Grow a Sports Community',
    excerpt: 'Building a recurring active player base requires shifting from short-term event transactions to owned, high-touch communication hubs.',
    date: '10 June 2026',
    readTime: '5 min read',
    category: 'Community Building',
    author: 'RallyVerse Editorial',
  },
  {
    slug: 'event-marketing-strategies',
    title: 'Event Marketing Strategies for Sports Organizers',
    excerpt: 'How local sports organizers can optimize check-ins, streamline payment verifications, and run highly effective WhatsApp promotions.',
    date: '8 June 2026',
    readTime: '4 min read',
    category: 'Sports Marketing',
    author: 'Marketing Team',
  },
  {
    slug: 'successful-tournament-ops',
    title: 'What Makes a Successful Tournament',
    excerpt: 'Behind the scenes of bracket management, seedings logic, payment checks, and digital registration setups.',
    date: '5 June 2026',
    readTime: '6 min read',
    category: 'Event Management',
    author: 'Operations Team',
  },
  {
    slug: 'community-led-sports-growth',
    title: 'Community-Led Sports Growth',
    excerpt: 'How aligning partnerships, academies, sports brands, and real event infrastructure creates a sustainable loop.',
    date: '1 June 2026',
    readTime: '5 min read',
    category: 'Partnerships',
    author: 'Ecosystem Team',
  },
]

const categoriesList = [
  'All',
  'Community Building',
  'Event Management',
  'Sports Marketing',
  'Partnerships',
  'Sports Ecosystem',
]

export default function InsightsClient() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPosts = selectedCategory === 'All'
    ? blogPostsData
    : blogPostsData.filter(post => post.category === selectedCategory)

  return (
    <div className="mx-auto max-w-[1100px] px-6">
      <TrackPageView pageType="insights" />

      {/* ── Header ───────────────────────────────────────── */}
      <AnimatedSection>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
          <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            INSIGHTS & STRATEGY
          </span>
        </div>

        <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
          Insights From the
          <br />
          Sports Ecosystem
        </h1>
        <p className="mt-4 max-w-xl font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Ideas, strategies, and lessons from building sports communities and events.
        </p>
      </AnimatedSection>

      {/* ── Categories Filter ─────────────────────────────── */}
      <AnimatedSection delay={0.05}>
        <div className="mt-12 flex flex-wrap gap-3 items-center">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-full font-body text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  color: isSelected ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </AnimatedSection>

      {/* ── Grid ─────────────────────────────────────────── */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {filteredPosts.map((post, i) => (
          <AnimatedSection key={post.slug} delay={i * 0.1}>
            <div
              className="rounded-xl p-8 transition-all duration-300 h-full flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-body text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-4 text-xs font-body" style={{ color: 'var(--text-faint)' }}>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                </div>
                
                <h2 className="font-display text-[26px] uppercase leading-tight mb-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {post.title}
                </h2>
                <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  {post.excerpt}
                </p>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                  <User size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span>{post.author}</span>
                </div>

                <Link
                  href={`/insights/${post.slug}`}
                  className="group inline-flex items-center gap-2 font-body text-sm font-semibold transition-colors duration-200"
                  style={{ color: 'var(--link-color)' }}
                >
                  Read Article
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <AnimatedSection>
          <div className="mt-12 text-center py-16 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <p className="font-body text-sm" style={{ color: 'var(--text-faint)' }}>
              No articles found in this category. More updates coming soon.
            </p>
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}
