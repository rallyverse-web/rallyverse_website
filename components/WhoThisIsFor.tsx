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
    desc: "You'd rather move than sit still. A new trail, a new route, a new challenge. You're always looking for the next one.",
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
    <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
              WHO BELONGS HERE
            </span>
          </div>

          <h2 className="mt-5 font-display text-[32px] leading-none uppercase sm:text-[48px] md:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            IF YOU&apos;VE EVER FELT THE PULL
            <br />
            &mdash; YOU BELONG.
          </h2>

          <p className="mt-6 max-w-[640px] font-body text-[17px] leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
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
                className="group rounded-xl p-8 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderLeft: '3px solid var(--accent-primary)',
                }}
              >
                <Icon
                  size={28}
                  className="mb-5 transition-colors duration-300"
                  style={{ color: 'var(--accent-primary)' }}
                />
                <h3 className="font-display text-[24px] uppercase" style={{ color: 'var(--text-primary)' }}>
                  {persona.title}
                </h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
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
            className="font-body text-base font-semibold transition-all duration-200 hover:underline"
            style={{ color: 'var(--link-color)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--link-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--link-color)'}
          >
            Register Now &rarr;
          </button>
        </motion.div>
      </div>
    </section>
  )
}
