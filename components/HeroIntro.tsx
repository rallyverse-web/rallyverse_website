'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import DecryptedText from '@/components/DecryptedText'
import RotatingText from '@/components/RotatingText'

export default function HeroIntro() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const [introActive, setIntroActive] = useState(false)
  const [visibleTaglines, setVisibleTaglines] = useState(0)
  const [subtextActive, setSubtextActive] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!introActive) return

    const timers = [
      window.setTimeout(() => setVisibleTaglines(1), 0),
      window.setTimeout(() => setVisibleTaglines(2), 700),
      window.setTimeout(() => setVisibleTaglines(3), 1500),
      window.setTimeout(() => setSubtextActive(true), 2600),
    ]

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [introActive])

  return (
    <section ref={sectionRef} className="px-4 py-20 text-center md:py-28" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-8 max-w-[400px] font-body text-[11px] uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Rallying Communities Through Sports
        </motion.p>

        <motion.div
          className="flex min-h-[202px] flex-col items-center gap-0 md:min-h-[302px] lg:min-h-[374px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: introActive ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          {['BUILDING.', 'SPORTS.', 'COMMUNITIES.'].slice(0, visibleTaglines).map((word) => (
            <motion.div
              key={word}
              initial={{ opacity: 0 }}
              animate={{ opacity: introActive ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ color: word === 'COMMUNITIES.' ? undefined : 'var(--text-primary)' }}
            >
              <DecryptedText
                text={word}
                animateOn="view"
                revealDirection="start"
                speed={80}
                sequential={true}
                className={`font-display text-[40px] uppercase leading-none sm:text-[56px] md:text-[84px] lg:text-[104px] ${
                  word === 'COMMUNITIES.' ? 'rally-gradient-text' : ''
                }`}
                encryptedClassName="font-display text-[40px] uppercase leading-none encrypted-glitch sm:text-[56px] md:text-[84px] lg:text-[104px]"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={subtextActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mt-10"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-body text-base md:text-lg" style={{ color: 'var(--text-muted)' }}>
              The Verse is for
            </p>
            <div style={{ color: 'var(--accent-primary)' }}>
              <RotatingText
                texts={[
                  'Competitors',
                  'Sports Organizers',
                  'Academies',
                  'Sports Brands',
                  'Active Communities',
                ]}
                mainClassName="font-display text-[28px] md:text-[36px] leading-none"
                staggerDuration={0.03}
                splitLevelClassName="overflow-hidden"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                rotationInterval={2500}
              />
            </div>
            <p className="font-body text-sm md:text-base mt-4 max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              RallyVerse helps sports organizers, communities, academies, and brands grow through registration infrastructure, payment management, attendance tracking, communication, and community building.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={subtextActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            type="button"
            onClick={() => router.push('/partners')}
            className="group relative overflow-hidden rounded-md px-10 py-4 font-body text-base font-semibold transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              minWidth: '200px'
            }}
          >
            <span className="relative z-10">Partner With Us</span>
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'var(--rallyverse-gradient)' }} />
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('community')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group relative overflow-hidden rounded-md border px-10 py-4 font-body text-base font-semibold transition-all duration-200 active:scale-95"
            style={{
              borderColor: 'var(--btn-outline-border)',
              backgroundColor: 'transparent',
              color: 'var(--btn-outline-text)',
              minWidth: '200px'
            }}
          >
            <span className="relative z-10 transition-colors duration-200">
              Join Community
            </span>
            <span className="absolute inset-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0" style={{ background: 'var(--rallyverse-gradient)' }} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
