'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type Transition } from 'motion/react'

type RotatingTextProps = {
  texts: string[]
  mainClassName?: string
  staggerDuration?: number
  splitLevelClassName?: string
  transition?: Transition
  initial?: Record<string, string | number>
  animate?: Record<string, string | number>
  exit?: Record<string, string | number>
  rotationInterval?: number
}

export default function RotatingText({
  texts,
  mainClassName = '',
  staggerDuration = 0.03,
  splitLevelClassName = '',
  transition,
  initial = { y: '100%' },
  animate = { y: 0 },
  exit = { y: '-100%' },
  rotationInterval = 2500,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0)
  const current = texts[index] ?? ''

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((value) => (value + 1) % texts.length)
    }, rotationInterval)

    return () => window.clearInterval(interval)
  }, [rotationInterval, texts.length])

  return (
    <span className={`inline-flex ${mainClassName}`}>
      <AnimatePresence mode="wait">
        <motion.span key={current} className="inline-flex whitespace-nowrap" aria-label={current}>
          {current.split('').map((letter, letterIndex) => (
            <span key={`${current}-${letterIndex}`} className={splitLevelClassName}>
              <motion.span
                className="inline-block"
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{ ...transition, delay: letterIndex * staggerDuration }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
