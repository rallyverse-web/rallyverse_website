'use client'

import { motion } from 'motion/react'
import { Swords, MessageSquare, Heart, TrendingUp, Sparkles, Share2, Gift, Network, ArrowRight, ArrowDown, Users } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import TrackPageView from '@/components/TrackPageView'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import Flywheel from '@/components/Flywheel'
import { WHATSAPP } from '@/lib/config'
import { trackEvent } from '@/lib/analytics'

const pillars = [
  {
    icon: Swords,
    title: 'Play',
    desc: 'Participate in tournaments, local leagues, and premium sporting experiences organized by our partners.',
  },
  {
    icon: MessageSquare,
    title: 'Connect',
    desc: 'Meet like-minded sports enthusiasts, coordinate matches, and find partners who share your level.',
  },
  {
    icon: Heart,
    title: 'Volunteer',
    desc: 'Contribute to community-led sports initiatives, operations, check-ins, and event marshalling.',
  },
  {
    icon: TrendingUp,
    title: 'Grow',
    desc: 'Learn, compete, build sports leadership skills, and become part of a larger structural movement.',
  },
]

const benefits = [
  { icon: Sparkles, title: 'Early Event Access', desc: 'Secure slots for popular tournaments and matches before public listings open.' },
  { icon: Share2, title: 'Community Updates', desc: 'Get instant notifications on schedules, results, local matches, and news.' },
  { icon: Gift, title: 'Exclusive Experiences', desc: 'Enjoy members-only custom gear, match highlights, and sponsored venue discounts.' },
  { icon: Heart, title: 'Volunteer Opportunities', desc: 'Contribute on-ground and learn the operations of running large sports programs.' },
  { icon: Network, title: 'Sports Ecosystem Connections', desc: 'Direct access to coaches, academies, brands, and venue owners in Bengaluru.' },
  { icon: Users, title: 'Active Networking', desc: 'Connect directly with sports-minded corporate peers, athletes, and builders.' },
]

const stories = [
  {
    name: 'Nirmal M. Jain',
    role: 'Early Supporter',
    quote: 'RallyVerse brings people together through sport in a way that goes beyond just scoring points. It is about human connection and mutual growth.',
    context: 'Active member since Season 01',
  },
  {
    name: 'Rohan Sharma',
    role: 'Tournament Coordinator',
    quote: 'The technology and organization they bring to the table makes running events a breeze, but the real magic is the community that shows up.',
    context: 'Volunteer partner since 2026',
  },
]

export default function CommunityClient() {
  const scrollToWhatsApp = () => {
    const el = document.getElementById('whatsapp-community')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TrackPageView pageType="community" />

      <div className="mx-auto max-w-[1100px] px-6">
        {/* ── Hero ─────────────────────────────────────────── */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              JOIN THE MOVEMENT
            </span>
          </div>

          <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
            Where Sports
            <br />
            Enthusiasts Rally
          </h1>

          <p className="mt-6 max-w-2xl font-body text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Join a growing network of players, organizers, volunteers, and sports enthusiasts building stronger communities through sports.
          </p>

          <button
            onClick={scrollToWhatsApp}
            className="mt-8 group relative overflow-hidden rounded-md px-10 py-4 font-body text-base font-semibold transition-all duration-200 active:scale-95 inline-flex items-center gap-2"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            <span className="relative z-10">Join the Community</span>
            <ArrowRight size={16} />
          </button>
        </AnimatedSection>

        {/* ── Pillars ──────────────────────────────────────── */}
        <section className="mt-24">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Our Community Pillars
              </h2>
              <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Four ways we build the ecosystem and move together.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <AnimatedSection key={pillar.title} delay={i * 0.1}>
                  <div
                    className="group rounded-xl p-8 transition-all duration-300 h-full flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <Icon
                        size={32}
                        className="mb-6 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: 'var(--accent-primary)' }}
                      />
                      <h3 className="font-display text-[22px] uppercase leading-tight font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {pillar.title}
                      </h3>
                      <p className="mt-4 font-body text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── Benefits ─────────────────────────────────────── */}
        <section className="mt-28">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Why Join RallyVerse?
              </h2>
              <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Get closer access to active sports programs, organizers, and event infrastructure.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <AnimatedSection key={benefit.title} delay={i * 0.08}>
                  <div
                    className="flex gap-4 p-6 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Icon size={24} className="shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    <div>
                      <h3 className="font-display text-[18px] uppercase font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {benefit.title}
                      </h3>
                      <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── WhatsApp CTA Section ─────────────────────────── */}
        <section id="whatsapp-community" className="mt-28 scroll-mt-24">
          <AnimatedSection>
            <div
              className="rounded-xl p-8 sm:p-12 text-center transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h2 className="font-display text-[32px] uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
                Connect Instantly
              </h2>
              <p className="max-w-xl mx-auto font-body text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                Grow your network. Engage directly with other sports enthusiasts, volunteer organizers, and players in real time via our active WhatsApp channels.
              </p>
              
              <motion.a
                href={WHATSAPP.communityLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('community_join_click')}
                className="inline-flex items-center gap-3 rounded-lg px-10 py-5 font-body text-base font-bold transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <WhatsAppIcon size={20} />
                Join WhatsApp Community
                <ArrowRight size={16} />
              </motion.a>
              
              <p className="mt-4 font-body text-xs" style={{ color: 'var(--text-faint)' }}>
                Available to all active sports players, tournament organizers, and supporters.
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* ── Community Stories Section ────────────────────── */}
        <section className="mt-28">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Community Stories
              </h2>
              <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Read about the human connections, competitive growth, and shared moments within the Verse.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {stories.map((story, i) => (
              <AnimatedSection key={story.name} delay={i * 0.1}>
                <div
                  className="rounded-xl p-8 flex flex-col justify-between h-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderLeft: '3px solid var(--accent-primary)',
                  }}
                >
                  <p className="font-body text-[15px] italic leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  
                  <div>
                    <h3 className="font-display text-[18px] uppercase font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {story.name}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-body text-xs" style={{ color: 'var(--accent-primary)' }}>{story.role}</span>
                      <span className="font-body text-[11px]" style={{ color: 'var(--text-faint)' }}>{story.context}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </div>

      {/* ── Flywheel loop section ── */}
      <div className="mt-28">
        <Flywheel />
      </div>
    </div>
  )
}
