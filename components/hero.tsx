'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import BlurText from './BlurText'

export default function Hero() {
  const router = useRouter()
  const [phase1Done, setPhase1Done] = useState(false)
  const [phase2Done, setPhase2Done] = useState(false)

  useEffect(() => {
    const phase2Timer = window.setTimeout(() => setPhase2Done(true), 2000)

    return () => {
      window.clearTimeout(phase2Timer)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => {
      document.body.style.overflow = ''
    }, 100)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative h-screen overflow-hidden bg-carbon px-4 text-center"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6"
        >
          <Image
            src="/logo/logo_transparent.png"
            alt="RallyVerse"
            width={120}
            height={120}
            className="mx-auto h-24 w-24 object-contain md:h-32 md:w-32"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-4 font-body text-[11px] uppercase tracking-widest text-muted"
        >
          BANGALORE &middot; BADMINTON &middot; 2026
        </motion.p>

        <div className="relative">
          <BlurText
            text="RALLYVERSE"
            animateBy="letters"
            direction="top"
            delay={80}
            stepDuration={0.4}
            threshold={0}
            rootMargin="0px"
            onAnimationComplete={() => {
              setTimeout(() => setPhase1Done(true), 300)
            }}
            className="font-display text-[80px] md:text-[120px] lg:text-[160px] leading-none tracking-tight text-white rallyverse-gradient-text"
          />
        </div>

        {phase1Done && (
          <div className="mt-12 flex flex-col items-center gap-0 md:mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="font-display text-[48px] uppercase leading-none text-primary md:text-[72px] lg:text-[96px]"
            >
              PLAY.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="font-display text-[48px] uppercase leading-none text-primary md:text-[72px] lg:text-[96px]"
            >
              COMPETE.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              className="font-display text-[48px] uppercase leading-none text-brand-gradient md:text-[72px] lg:text-[96px]"
            >
              RALLY.
            </motion.div>
          </div>
        )}

        {phase2Done && (
          <>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
              className="mx-auto mt-10 max-w-[520px] px-2 font-body text-sm leading-relaxed text-muted md:text-base"
            >
              Bangalore&apos;s newest badminton tournament series. Competitive brackets. Real courts. A community that shows up and plays hard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
              className="mt-8"
            >
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="group relative overflow-hidden rounded-md border border-orange bg-transparent px-8 py-3 font-body text-sm font-semibold text-orange transition-all duration-200 hover:scale-105 hover:glow-orange active:scale-95"
              >
                <span className="relative z-10 transition-colors duration-200 group-hover:text-carbon">
                  Register Your Interest
                </span>
                <span className="absolute inset-0 -translate-x-full bg-brand-gradient transition-transform duration-300 group-hover:translate-x-0" />
              </button>
            </motion.div>
          </>
        )}
      </div>

      {phase2Done && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
        >
          <div className="mx-auto h-8 w-px bg-subtle" />
          <ChevronDown size={16} className="animate-bounce text-muted" />
        </motion.div>
      )}
    </section>
  )
}
