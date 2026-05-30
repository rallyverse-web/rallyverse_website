'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import BlurText from './BlurText'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] bg-carbon px-4 text-center"
    >
      <div className="flex min-h-[100svh] flex-col items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6"
        >
          <Image
            src="/logo/logo_transparent.png"
            alt="RallyVerse"
            width={220}
            height={220}
            className="mx-auto h-36 w-36 object-contain md:h-48 md:w-48 lg:h-56 lg:w-56"
            priority
          />
        </motion.div>

        <div className="relative">
          <BlurText
            text="RALLYVERSE"
            animateBy="letters"
            direction="top"
            delay={80}
            stepDuration={0.4}
            threshold={0}
            rootMargin="0px"
            className="font-display text-[80px] md:text-[120px] lg:text-[160px] leading-none tracking-tight text-white rallyverse-gradient-text"
          />
        </div>
      </div>
    </section>
  )
}
