'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'motion/react'
import BlurText from './BlurText'
import ThemedLogo from '@/components/ThemedLogo'
import { useTheme } from '@/lib/theme'

const Particles = dynamic(() => import('@/components/Particles'), { ssr: false })

export default function Hero() {
  const { isColorTheme } = useTheme()
  const [particleQuantity, setParticleQuantity] = useState(80)

  useEffect(() => {
    const updateViewportState = () => {
      const mobile = window.innerWidth < 768
      setParticleQuantity(mobile ? 40 : 80)
    }

    updateViewportState()
    window.addEventListener('resize', updateViewportState)
    return () => window.removeEventListener('resize', updateViewportState)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] overflow-hidden px-4 text-center no-theme-transition"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Particles
        className="absolute inset-0 z-0 h-full w-full"
        quantity={particleQuantity}
        color={isColorTheme ? '#FF5E00' : '#FFFFFF'}
        ease={80}
        refresh={false}
        size={0.6}
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6"
        >
          <ThemedLogo context="hero" />
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
            className="font-display text-[80px] md:text-[120px] lg:text-[160px] leading-none tracking-tight rallyverse-gradient-text"
          />
        </div>
      </div>
    </section>
  )
}
