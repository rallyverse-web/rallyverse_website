'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { Users, Target, Flame } from 'lucide-react'

const personas = [
  {
    icon: Users,
    title: 'The Competitor',
    desc: "You train when no one's watching. You play to win, not just to play. The Verse gives you the stage you deserve.",
  },
  {
    icon: Target,
    title: 'The Explorer',
    desc: "You'd rather move than sit still. A new trail, a new route, a new challenge — you're always looking for the next one.",
  },
  {
    icon: Flame,
    title: 'The Community Builder',
    desc: 'You show up, you hype others, you make it better for everyone. The Verse needs you most.',
  },
]

export default function WhoThisIsFor() {
  const router = useRouter()

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
              WHO BELONGS HERE
            </span>
          </div>

          <h2 className="mt-5 font-display text-[48px] leading-none uppercase text-primary md:text-[64px]">
            IF YOU&apos;VE EVER FELT THE PULL
            <br />
            &mdash; YOU BELONG.
          </h2>

          <p className="mt-6 max-w-[640px] font-body text-[17px] leading-[1.85] text-muted">
            The Verse is not just for athletes. It is for anyone who believes movement, competition, and shared experiences are worth building a life around.
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          className="mt-12 text-center"
        >
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="font-body text-sm font-semibold text-orange transition-all duration-200 hover:text-cyan hover:underline"
          >
            Find Your Place in the Verse &rarr;
          </button>
        </motion.div>
      </div>
    </section>
  )
}
