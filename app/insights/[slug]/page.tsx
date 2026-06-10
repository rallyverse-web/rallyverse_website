'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import TrackPageView from '@/components/TrackPageView'

const detailedArticles: Record<string, {
  title: string
  category: string
  date: string
  readTime: string
  author: string
  paragraphs: string[]
}> = {
  'grow-sports-community': {
    title: 'How to Grow a Sports Community',
    category: 'Community Building',
    date: '10 June 2026',
    readTime: '5 min read',
    author: 'RallyVerse Editorial',
    paragraphs: [
      'Growing a sports community is vastly different from building typical digital audiences. Where standard media relies on passive click-through rates, sports communities live and die by active, physical participation.',
      'To build a recurring sports community, organizers must shift from transactional, short-term registration workflows toward owned communication hubs. Rather than collecting player contacts on fragmented spreadsheets during a tournament and losing track post-event, the goal is to guide players directly into permanent member circles.',
      'We recommend routing every event participant into centralized WhatsApp groups or dedicated platform channels immediately on confirmation. Once inside, community building relies on consistency. Host recurring matches (e.g. weekly games, weekend runs) that require low operational overhead, enabling players to interact regularly.',
      'Finally, sports growth compounds when you establish partnerships. By connecting active players with local academies for coaching, and local sports brands for gear sponsorship, the community provides active, tangible value outside of competitive tournament dates.',
    ]
  },
  'event-marketing-strategies': {
    title: 'Event Marketing Strategies for Sports Organizers',
    category: 'Sports Marketing',
    date: '8 June 2026',
    readTime: '4 min read',
    author: 'Marketing Team',
    paragraphs: [
      'For sports organizers, event marketing is often the most challenging variable. Many rely on generic social media blasts or local flyer distributions, which yield low conversion metrics and high manual cost.',
      'Successful sports marketing is community-led and peer-driven. Real conversions are driven by micro-targeting local club groups and setting up direct payment verifications. When players register, they should receive immediate confirmations they can easily share with colleagues, creating a natural referral cycle.',
      'We suggest leveraging local WhatsApp groups and digital promotions. Highlight previous event action shots, player highlights, and testimonials rather than simple schedule listings. The primary marketing asset is proof of capability — showing that your previous events were packed, high-energy, and professionally executed.',
      'RallyVerse provides built-in promotion slots for featured events, ensuring local sports competitors see your tournament listing right when they are active and looking to play.',
    ]
  },
  'successful-tournament-ops': {
    title: 'What Makes a Successful Tournament',
    category: 'Event Management',
    date: '5 June 2026',
    readTime: '6 min read',
    author: 'Operations Team',
    paragraphs: [
      'A successful sporting event is won in the planning. Behind the scenes, the double-edged sword of tournament execution is coordinator overhead — managing draws, checking payments, and seeding divisions.',
      'Modern tournament management requires dedicated software support. Organizers must deploy digital registration systems that automate payment verification, preventing delays where coordinators manually cross-check bank transfers with entries.',
      'On game day, clear communication is critical. Automated email structures notifying players of their check-in times and first-round brackets prevent crowds and delays at the registration desk. If players can view live updates on match draws and schedules, check-in confusion disappears.',
      'RallyVerse\'s organizer technology handles payment configs, double entries, and transactional emails out of the box, letting event directors focus on delivering a premium player experience.',
    ]
  },
  'community-led-sports-growth': {
    title: 'Community-Led Sports Growth',
    category: 'Partnerships',
    date: '1 June 2026',
    readTime: '5 min read',
    author: 'Ecosystem Team',
    paragraphs: [
      'Sports growth is community-led. Traditional marketing agencies focus on digital clicks, but a true sports growth partner aligns the interests of everyone in the ecosystem: players, organizers, academies, and brands.',
      'At RallyVerse, we build our compounding loop on this alignment. High-quality events attract competitors. These competitors join our WhatsApp community hub, transforming one-off players into active members. This active player base becomes the perfect audience for brands seeking marketing activations.',
      'By routing brand sponsorship and advertising revenues directly back into event technology and venue booking, we elevate event quality. Better infrastructure draws more organizers, drawing more athletes, repeating the loop at a larger scale.',
      'Every partnership we form, and every line of code we write, is designed to fuel this flywheel, creating a compounding advantage that traditional consulting agencies cannot duplicate.',
    ]
  }
}

export default function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  const post = detailedArticles[slug] || {
    title: 'Sports Ecosystem Insights',
    category: 'Sports Strategy',
    date: 'June 2026',
    readTime: '3 min read',
    author: 'RallyVerse Team',
    paragraphs: [
      'Building a sports community is an ongoing journey. Insights, operational guides, and sports marketing tips are published regularly to help organizers and brands grow.',
      'Check back soon for detailed ecosystem metrics, strategies, and case studies.',
    ]
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'datePublished': new Date(post.date).toISOString().slice(0, 10),
    'author': {
      '@type': 'Person',
      'name': post.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'RallyVerse',
      'logo': 'https://rallyverse.social/logo_transparent.png'
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://rallyverse.social/insights/${slug}`
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TrackPageView pageType={`insights_post_${slug}`} />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[800px] px-6">
        {/* Back Link */}
        <AnimatedSection>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold mb-8"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={16} />
            Back to Insights
          </Link>
        </AnimatedSection>

        {/* Article Meta */}
        <AnimatedSection delay={0.05}>
          <span className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
            {post.category}
          </span>
          <h1 className="font-display text-[32px] sm:text-[44px] md:text-[56px] uppercase leading-tight mt-4 mb-6" style={{ color: 'var(--text-primary)' }}>
            {post.title}
          </h1>
          
          <div className="flex flex-wrap gap-6 items-center py-6 border-t border-b mb-10 text-sm font-body" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-2">
              <User size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection delay={0.1}>
          <article className="space-y-6 font-body text-base leading-relaxed text-[var(--text-muted)]">
            {post.paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </article>
        </AnimatedSection>
      </div>
    </div>
  )
}
