'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function Hero() {
  const router = useRouter()
  const [collisionDone, setCollisionDone] = useState(false)
  const [shockwaveDone, setShockwaveDone] = useState(false)

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center bg-carbon px-6 text-center"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Micro-label — fades in first at 0ms */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0, ease: 'easeOut' }}
          className="mb-6 font-body text-xs uppercase tracking-widest text-muted"
        >
          Bangalore &middot; Badminton &middot; 2026
        </motion.p>

        {/* RALLY + VERSE split reveal — starts at ~200ms */}
        <div className="relative">
          <div className="flex flex-row items-center justify-center gap-0">
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="font-display text-[56px] uppercase leading-none text-primary md:text-[80px] lg:text-[120px]"
            >
              RALLY
            </motion.div>
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              onAnimationComplete={() => setCollisionDone(true)}
              className="font-display text-[56px] uppercase leading-none text-primary md:text-[80px] lg:text-[120px]"
              style={
                collisionDone
                  ? {
                      background: 'linear-gradient(90deg, #FF5C00, #00E5C8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
                  : undefined
              }
            >
              VERSE
            </motion.div>
          </div>

          {/* Shockwave ring — fires at ~800ms (200ms delay + 600ms animation) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {collisionDone && (
                <motion.div
                  className="h-[120px] w-[120px] rounded-full border-2 border-orange/60"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  onAnimationComplete={() => setShockwaveDone(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Significant gap between RALLYVERSE and tagline */}
        <div className="mt-10 md:mt-16 lg:mt-20 flex flex-col items-center gap-0 mb-0">
          {/* PLAY. — fades up at ~1400ms (shockwave done + 600ms pause) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={shockwaveDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            className="font-display text-[36px] uppercase leading-none mb-2 text-primary md:text-[80px] lg:text-[120px]"
          >
            PLAY.
          </motion.div>
          {/* COMPETE. — at ~1600ms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={shockwaveDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
            className="font-display text-[36px] uppercase leading-none mb-2 text-primary md:text-[80px] lg:text-[120px]"
          >
            COMPETE.
          </motion.div>
          {/* RALLY. — at ~1800ms, gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={shockwaveDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
            className="font-display text-[36px] uppercase leading-none text-brand-gradient md:text-[80px] lg:text-[120px]"
          >
            RALLY.
          </motion.div>
        </div>

        {/* Subtext — at ~2200ms */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={shockwaveDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.4, ease: 'easeOut' }}
          className="mt-10 mb-10 max-w-[480px] mx-auto text-center font-body text-base leading-relaxed text-muted"
        >
          Bangalore&apos;s newest badminton tournament series. Competitive brackets. Real courts. A community that shows up and plays hard.
        </motion.p>

        {/* CTA button — at ~2200ms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shockwaveDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.6, ease: 'easeOut' }}
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
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        <div className="mx-auto h-10 w-px bg-subtle" />
        <ChevronDown size={16} className="text-muted" />
      </div>
    </section>
  )
}
