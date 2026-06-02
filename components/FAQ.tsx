'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import { faqs } from '@/lib/faqs'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-28"
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-6 md:grid-cols-[1fr_1.5fr] md:gap-20">
        {/* Left column — heading */}
        <AnimatedSection>
          <div className="flex items-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--section-label-color)' }}>
              QUESTIONS
            </span>
          </div>

          <h2 className="mt-5 font-display text-[32px] leading-none uppercase sm:text-[48px] md:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            THINGS YOU PROBABLY WANT TO KNOW.
          </h2>
        </AnimatedSection>

        {/* Right column — accordion */}
        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px' }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
                delay: i * 0.07,
              }}
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors duration-200"
                style={{ color: 'var(--text-primary)' }}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                <span className="font-body text-[15px] font-medium">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>

              <motion.div
                id={`faq-answer-${i}`}
                role="region"
                initial={false}
                animate={{
                  height: openIndex === i ? 'auto' : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="pb-6 font-body text-[15px] leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
