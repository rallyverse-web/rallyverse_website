'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import AnimatedSection from '@/components/AnimatedSection'
import { WHATSAPP } from '@/lib/config'

export default function CommunityProof() {
  const isCommunity = WHATSAPP.hasCommunityChat

  return (
    <section id="community" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-4xl px-6">
        <AnimatedSection>
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              COMMUNITY
            </span>
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center font-display text-[32px] leading-none uppercase sm:text-[44px] md:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            More Than Events.
            <br />
            A Sports Community.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-center font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {isCommunity
              ? 'Our WhatsApp community connects active participants, local organizers, and sports enthusiasts.'
              : 'Connect with us directly and be part of the RallyVerse journey from day one.'}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-center font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
            {isCommunity
              ? 'Discover upcoming recurring events, find game partners, and stay active in a community designed for people who show up and play hard.'
              : 'The community chat is launching soon. Until then, message us on WhatsApp for registration details, partnerships, or recurring matches.'}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mt-10 text-center">
            <motion.a
              href={WHATSAPP.communityLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-lg px-10 py-5 font-body text-base font-bold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: '#25D366',
                color: '#FFFFFF',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <WhatsAppIcon size={20} />
              {isCommunity ? 'Join the RallyVerse Community' : 'Message on WhatsApp'}
              <ArrowRight size={16} />
            </motion.a>
            <p className="mt-4 font-body text-xs" style={{ color: 'var(--text-faint)' }}>
              {isCommunity
                ? 'Be part of the conversations shaping what comes next.'
                : 'We typically respond within a few hours.'}
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
