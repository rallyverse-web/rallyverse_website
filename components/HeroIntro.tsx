'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import DecryptedText from '@/components/DecryptedText'
import Magnet from '@/components/Magnet'
import RotatingText from '@/components/RotatingText'

export default function HeroIntro() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const [introActive, setIntroActive] = useState(false)
  const [visibleTaglines, setVisibleTaglines] = useState(0)
  const [subtextActive, setSubtextActive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateViewportState = () => setIsMobile(window.innerWidth < 768)

    updateViewportState()
    window.addEventListener('resize', updateViewportState)
    return () => window.removeEventListener('resize', updateViewportState)
  }, [])

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
    <section ref={sectionRef} className="bg-carbon px-4 py-20 text-center md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-8 font-body text-[11px] uppercase tracking-widest text-muted"
        >
          BENGALURU &middot; SPORTS &middot; ADVENTURE &middot; COMMUNITY &middot; 2026
        </motion.p>

        <motion.div
          className="flex min-h-[202px] flex-col items-center gap-0 md:min-h-[302px] lg:min-h-[374px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: introActive ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          {['RALLY.', 'BEYOND.', 'ROUTINE.'].slice(0, visibleTaglines).map((word) => (
            <motion.div
              key={word}
              initial={{ opacity: 0 }}
              animate={{ opacity: introActive ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <DecryptedText
                text={word}
                animateOn="view"
                revealDirection="start"
                speed={80}
                sequential={true}
                className={`font-display text-[56px] uppercase leading-none md:text-[84px] lg:text-[104px] ${
                  word === 'ROUTINE.' ? 'rally-gradient-text' : 'text-white'
                }`}
                encryptedClassName="font-display text-[56px] uppercase leading-none text-white/30 md:text-[84px] lg:text-[104px]"
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
            <p className="text-[#909090] text-base md:text-lg font-body">
              The Verse is for
            </p>
            <RotatingText
              texts={[
                'Competitors',
                'Explorers',
                'Community Builders',
                'Weekend Warriors',
                'People Who Show Up',
              ]}
              mainClassName="font-display text-[28px] md:text-[36px] text-[#FF5E00] leading-none"
              staggerDuration={0.03}
              splitLevelClassName="overflow-hidden"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              rotationInterval={2500}
            />
            <p className="text-[#909090] text-sm md:text-base font-body mt-1">
              Move. Compete. Explore. Connect.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={subtextActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="mt-8"
        >
          <Magnet padding={50} disabled={isMobile}>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="group relative overflow-hidden rounded-md border border-orange bg-transparent px-8 py-3 font-body text-sm font-semibold text-orange transition-all duration-200 hover:glow-orange active:scale-95"
            >
              <span className="relative z-10 transition-colors duration-200 group-hover:text-carbon">
                Enter the Verse
              </span>
              <span className="absolute inset-0 -translate-x-full bg-brand-gradient transition-transform duration-300 group-hover:translate-x-0" />
            </button>
          </Magnet>
        </motion.div>
      </div>
    </section>
  )
}
