'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'

const stats = [
  { value: 500, suffix: '+', label: 'Players pre-registered' },
  { value: 4, suffix: '', label: 'Sport categories' },
  { value: 3, suffix: '', label: 'Skill levels supported' },
  { value: 1, suffix: '', label: 'City. For now.' },
]

function CountUp({ target, suffix, triggered }: { target: number; suffix: string; triggered: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!triggered) return

    let current = 0
    const duration = 1500
    const steps = 40
    const increment = target / steps
    const interval = duration / steps

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [triggered, target])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export default function CommunityStats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section className="border-t border-subtle bg-carbon py-28">
      <div ref={sectionRef} className="mx-auto max-w-[1100px] px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: i * 0.1,
              }}
              className="flex flex-col items-center text-center"
            >
              <span className="font-display text-[72px] leading-none text-orange">
                <CountUp target={stat.value} suffix={stat.suffix} triggered={isInView} />
              </span>
              <p className="mt-3 font-body text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center font-body text-xs text-muted"
        >
          Pre-registration numbers. First tournament date to be announced.
        </motion.p>
      </div>
    </section>
  )
}
