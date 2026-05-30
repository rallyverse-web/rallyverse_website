'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

const faqs = [
  {
    question: 'Do I need to be a competitive player to join?',
    answer:
      'Not at all. We have brackets for Beginner, Intermediate, and Advanced levels. If you can hold a racket and want to compete, there\u2019s a spot for you.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'Entry fees will be announced with the first event. No payment is required to register your interest now.',
  },
  {
    question: 'Where will the tournaments be held?',
    answer:
      'Venues across Bengaluru \u2014 we\u2019re finalising court partnerships now. Registered players will be the first to know location details.',
  },
  {
    question: 'How will I know when the first event is confirmed?',
    answer:
      'We\u2019ll reach out directly on WhatsApp. That\u2019s why we ask for your number \u2014 no spam, just tournament updates.',
  },
  {
    question: "Can I play doubles if I don\u2019t have a partner?",
    answer:
      'Yes. Tell us in the registration form that you\u2019re open to being paired, and we\u2019ll match you with someone at your level.',
  },
  {
    question: "What if I register but can\u2019t make it?",
    answer:
      'We understand. Just let us know and we\u2019ll move your spot to the next event in the series.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="border-t border-subtle bg-carbon py-32">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-6 md:grid-cols-[1fr_1.5fr] md:gap-20">
        {/* Left column — heading */}
        <AnimatedSection>
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-orange" />
            <span className="font-body text-[11px] uppercase tracking-widest text-orange">
              QUESTIONS
            </span>
          </div>

          <h2 className="mt-5 font-display text-[48px] leading-none uppercase text-primary md:text-[64px]">
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
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
                delay: i * 0.07,
              }}
              className="border-b border-subtle"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors duration-200 hover:text-orange"
              >
                <span className="font-body text-[15px] font-medium text-primary">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0 text-orange"
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 font-body text-[15px] leading-[1.85] text-muted">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
