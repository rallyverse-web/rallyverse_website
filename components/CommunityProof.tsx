'use client'

import { motion } from 'motion/react'
import { MessageCircle, ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

const WHATSAPP_LINK = 'https://wa.me/918951760369'

export default function CommunityProof() {
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
            Join the RallyVerse
            <br />
            Community
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-center font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Meet players, adventurers, and explorers before the next event.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-center font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
            The best experiences begin before game day. Join the community to discover upcoming events, connect with people, and stay part of the journey.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mt-10 text-center">
            <motion.a
              href={WHATSAPP_LINK}
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
              <MessageCircle size={20} />
              Join WhatsApp Community
              <ArrowRight size={16} />
            </motion.a>
            <p className="mt-4 font-body text-xs" style={{ color: 'var(--text-faint)' }}>
              Be part of the conversations shaping what comes next.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
