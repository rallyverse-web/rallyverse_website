'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import { CURRENT_EVENT, CONTACT, WHATSAPP, ADDRESS } from '@/lib/config'

const faqs = [
  {
    question: 'What is RallyVerse?',
    answer:
      'RallyVerse is a badminton community that brings players together through games, tournaments, and shared experiences. We believe sport is more than competition. It\u2019s about connection, growth, and creating memorable experiences on and off the court.',
  },
  {
    question: 'When and where is Rally Series 01 happening?',
    answer:
      `Rally Series 01 will take place on ${CURRENT_EVENT.date} from ${CURRENT_EVENT.time} at ${CURRENT_EVENT.venue}, Bengaluru.`,
  },
  {
    question: 'What categories are available?',
    answer:
      `For Rally Series 01, registrations are open for ${CURRENT_EVENT.categories.join(' and ')}. Only these categories are available for the first event.`,
  },
  {
    question: 'What is the registration fee?',
    answer:
      `The registration fee is \u20B9${CURRENT_EVENT.registrationFee} per team. This includes participation in the tournament and event operations.`,
  },
  {
    question: 'How do I register?',
    answer:
      'Complete the registration form. Pay \u20B9799 using the QR code provided. Enter your payment details. Submit the form. Send your payment screenshot on WhatsApp for verification. Once verified, you\u2019ll receive a confirmation email.',
  },
  {
    question: 'Why do I need to send a payment screenshot?',
    answer:
      'Payment screenshots help us verify registrations quickly and accurately. After registering, send your screenshot to the official RallyVerse WhatsApp Business account.',
  },
  {
    question: 'Will both players receive confirmation emails?',
    answer:
      'Yes. For doubles registrations, confirmation emails are sent to both players using the email addresses provided during registration.',
  },
  {
    question: 'How will I receive tournament updates?',
    answer:
      'All updates will be shared through the official RallyVerse WhatsApp Community. This includes match schedules, event announcements, important updates, and future RallyVerse events.',
  },
  {
    question: 'Do I need to join the WhatsApp Community?',
    answer:
      'Yes, we strongly recommend joining. The WhatsApp Community is the primary channel for tournament communication and announcements.',
  },
  {
    question: 'What skill levels can participate?',
    answer:
      'Players of all skill levels are welcome. Whether you\u2019re a recreational player or a competitive player, RallyVerse is designed to create a great experience for everyone.',
  },
  {
    question: 'Can I edit my registration after submitting it?',
    answer:
      'If you need to make changes to your registration, contact the RallyVerse team on WhatsApp and we\u2019ll assist you.',
  },
  {
    question: 'How can I contact RallyVerse?',
    answer:
      `Email: ${CONTACT.email}  |  WhatsApp: ${WHATSAPP.businessNumber}  |  Location: ${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.state}`,
  },
]

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

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 font-body text-[15px] leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
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
