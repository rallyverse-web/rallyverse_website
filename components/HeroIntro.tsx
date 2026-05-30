'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'

export default function HeroIntro() {
  const router = useRouter()

  return (
    <section className="bg-carbon px-4 py-20 text-center md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-8 font-body text-[11px] uppercase tracking-widest text-muted"
        >
          BANGALORE &middot; BADMINTON &middot; 2026
        </motion.p>

        <div className="flex flex-col items-center gap-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="font-display text-[56px] uppercase leading-none text-primary md:text-[84px] lg:text-[104px]"
          >
            PLAY.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="font-display text-[56px] uppercase leading-none text-primary md:text-[84px] lg:text-[104px]"
          >
            COMPETE.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="font-display text-[56px] uppercase leading-none text-brand-gradient md:text-[84px] lg:text-[104px]"
          >
            RALLY.
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          className="mx-auto mt-10 max-w-[520px] px-2 font-body text-sm leading-relaxed text-muted md:text-base"
        >
          Bangalore&apos;s newest badminton tournament series. Competitive brackets. Real courts. A community that shows up and plays hard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
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
      </div>
    </section>
  )
}
