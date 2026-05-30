'use client'

import { motion } from 'motion/react'
import { Users, Target, Flame } from 'lucide-react'

const personas = [
  {
    icon: Users,
    title: 'Recreational Players',
    desc: 'Show up, play hard, have fun. No ego required.',
  },
  {
    icon: Target,
    title: 'Serious Amateurs',
    desc: "You train. You want real competition. We'll give you that.",
  },
  {
    icon: Flame,
    title: 'Weekend Warriors',
    desc: 'Busy during the week. But weekends are yours. We get it.',
  },
]

export default function WhoThisIsFor() {
  return (
    <section className="bg-[#0d0d0d] py-20 md:py-28">
      <div className="mx-auto max-w-[1100px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-orange" />
            <span className="font-body text-[11px] uppercase tracking-widest text-orange">
              WHO THIS IS FOR
            </span>
          </div>

          <h2 className="mt-5 font-display text-[48px] leading-none uppercase text-primary md:text-[64px]">
            YOU&apos;VE PLAYED YOUR WHOLE LIFE.
            <br />
            NOW COMPETE.
          </h2>

          <p className="mt-6 max-w-[640px] font-body text-[17px] leading-[1.85] text-muted">
            You play three times a week but haven&apos;t competed in years.
            You&apos;re good enough but don&apos;t know where to go.
            You&apos;ve tried local tournaments and been let down. RallyVerse is
            for you.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {personas.map((persona, i) => {
            const Icon = persona.icon
            return (
              <motion.div
                key={persona.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: i * 0.1,
                }}
                className="group rounded-xl border-l-[3px] border-orange bg-[#161616] p-8 transition-all duration-300 hover:bg-[#1a1a1a]"
              >
                <Icon
                  size={28}
                  className="mb-5 text-orange transition-colors duration-300 group-hover:text-cyan"
                />
                <h3 className="font-display text-[24px] uppercase text-primary">
                  {persona.title}
                </h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-muted">
                  {persona.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
