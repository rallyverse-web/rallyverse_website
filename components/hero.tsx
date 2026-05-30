'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import BlurText from './BlurText'
import DecryptedText from '@/components/DecryptedText'
import Magnet from '@/components/Magnet'
import RotatingText from '@/components/RotatingText'

const Particles = dynamic(() => import('@/components/Particles'), { ssr: false })

export default function Hero() {
  const router = useRouter()
  const [particleQuantity, setParticleQuantity] = useState(80)
  const [isMobile, setIsMobile] = useState(false)
  const [phase1Done, setPhase1Done] = useState(false)
  const [phase2Done, setPhase2Done] = useState(false)
  const [visibleTaglines, setVisibleTaglines] = useState(0)

  useEffect(() => {
    const updateViewportState = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setParticleQuantity(mobile ? 40 : 80)
    }

    updateViewportState()
    window.addEventListener('resize', updateViewportState)
    return () => window.removeEventListener('resize', updateViewportState)
  }, [])

  useEffect(() => {
    const phase1Timer = window.setTimeout(() => setPhase1Done(true), 1500)
    const phase2Timer = window.setTimeout(() => setPhase2Done(true), 3900)

    return () => {
      window.clearTimeout(phase1Timer)
      window.clearTimeout(phase2Timer)
    }
  }, [])

  useEffect(() => {
    if (!phase1Done) return

    const timers = [0, 700, 1500].map((delay, index) =>
      window.setTimeout(() => setVisibleTaglines(index + 1), delay)
    )

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [phase1Done])

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-carbon px-4 text-center"
    >
      <Particles
        className="absolute inset-0 z-0 h-full w-full"
        quantity={particleQuantity}
        color="#FF5E00"
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

        <motion.div
          className="mt-5 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase1Done ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          {['PLAY.', 'COMPETE.', 'RALLY.'].slice(0, visibleTaglines).map((word) => (
            <motion.div
              key={word}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase1Done ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <DecryptedText
                text={word}
                animateOn="view"
                revealDirection="start"
                speed={80}
                sequential={true}
                className={`font-display text-[48px] md:text-[72px] lg:text-[96px] leading-none ${
                  word === 'RALLY.' ? 'rally-gradient-text' : 'text-white'
                }`}
                encryptedClassName="font-display text-[48px] md:text-[72px] lg:text-[96px] leading-none text-white/30"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={phase2Done ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[#909090] text-base md:text-lg font-body">
              RallyVerse is for
            </p>
            <RotatingText
              texts={[
                'Recreational Players',
                'Serious Amateurs',
                'Weekend Warriors',
                'Badminton Lovers',
                'Anyone Ready to Compete',
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
              Bengaluru &middot; Badminton &middot; 2026
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-9"
          initial={{ opacity: 0, y: 12 }}
          animate={phase2Done ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
        >
          <Magnet padding={50} disabled={isMobile}>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="rounded-md bg-brand-gradient px-8 py-3 font-body text-sm font-bold text-carbon transition-all duration-200 hover:glow-orange active:scale-95"
            >
              Register Your Interest
            </button>
          </Magnet>
        </motion.div>
      </div>
    </section>
  )
}
