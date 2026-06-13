'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { Users, Trophy, Cpu, HeartHandshake } from 'lucide-react'

const differentiators = [
  {
    icon: Users,
    title: 'We Own an Active Sports Community',
    desc: "We don't just consult on community. We own and operate one. We know what it takes to engage players daily.",
  },
  {
    icon: Trophy,
    title: 'We Build Event Infrastructure',
    desc: "From registration flows and payment verification to attendance tracking and communication tools, we build the systems that keep tournaments, leagues, and sports events moving.",
  },
  {
    icon: Cpu,
    title: 'We Built Our Own Infrastructure',
    desc: "We designed and built our own registration, payment verification, attendance tracking, email communication, and participant management system from the ground up.",
  },
  {
    icon: HeartHandshake,
    title: 'We Understand Sports Ecosystems',
    desc: "We speak the language of sports brands, venue owners, academies, and recreational players alike. We connect them seamlessly.",
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
              WHY RALLYVERSE
            </span>
          </div>

          <h2 className="mt-5 font-display text-[32px] leading-[1.1] uppercase sm:text-[44px] md:text-[56px]" style={{ color: 'var(--text-primary)' }}>
            The Difference Between a
            <br />
            Marketing Agency and a Sports Partner
          </h2>

          <p className="mt-6 max-w-[680px] font-body text-[16px] leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
            We don&apos;t just consult on community. We own and operate one. RallyVerse bridges digital outreach with registration infrastructure, communication, and community growth.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((diff, i) => {
            const Icon = diff.icon
            return (
              <motion.div
                key={diff.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: i * 0.1,
                }}
                className="group rounded-xl p-8 transition-all duration-300 flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderLeft: '3px solid var(--accent-primary)',
                }}
              >
                <div>
                  <Icon
                    size={28}
                    className="mb-5 transition-colors duration-300"
                    style={{ color: 'var(--accent-primary)' }}
                  />
                  <h3 className="font-display text-[22px] uppercase leading-tight font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {diff.title}
                  </h3>
                  <p className="mt-3 font-body text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {diff.desc}
                  </p>
                </div>
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
            onClick={() => router.push('/partners')}
            className="font-body text-base font-semibold transition-all duration-200 hover:underline"
            style={{ color: 'var(--link-color)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--link-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--link-color)'}
          >
            Become a Partner &rarr;
          </button>
        </motion.div>
      </div>
    </section>
  )
}
