'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

type ScrollRevealProps = {
  children: ReactNode
  baseOpacity?: number
  enableBlur?: boolean
  baseBlur?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
}

export default function ScrollReveal({
  children,
  baseOpacity = 0.1,
  enableBlur = true,
  baseBlur,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [visible, setVisible] = useState(false)
  const blur = baseBlur ?? blurStrength
  const text = typeof children === 'string' ? children : ''
  const words = text.split(/(\s+)/)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.2 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <p ref={ref} className={containerClassName}>
      {typeof children === 'string'
        ? words.map((word, index) => {
            if (/^\s+$/.test(word)) return word

            return (
              <motion.span
                key={`${word}-${index}`}
                className={`inline-block ${textClassName}`}
                initial={{ opacity: baseOpacity, filter: enableBlur ? `blur(${blur}px)` : 'blur(0px)' }}
                animate={visible ? { opacity: 1, filter: 'blur(0px)' } : undefined}
                transition={{ duration: 0.55, delay: index * 0.018, ease: 'easeOut' }}
              >
                {word}
              </motion.span>
            )
          })
        : children}
    </p>
  )
}
