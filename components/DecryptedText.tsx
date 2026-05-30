'use client'

import { useEffect, useRef, useState } from 'react'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

type DecryptedTextProps = {
  text: string
  animateOn?: 'view' | 'load'
  revealDirection?: 'start' | 'end'
  speed?: number
  sequential?: boolean
  className?: string
  encryptedClassName?: string
}

export default function DecryptedText({
  text,
  animateOn = 'load',
  revealDirection = 'start',
  speed = 80,
  sequential = true,
  className = '',
  encryptedClassName = '',
}: DecryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(animateOn === 'load')
  const [display, setDisplay] = useState(text.replace(/\S/g, () => chars[Math.floor(Math.random() * chars.length)]))
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (animateOn !== 'view' || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animateOn])

  useEffect(() => {
    if (!active) return

    let step = 0
    const maxSteps = sequential ? text.length + 8 : 12
    const interval = window.setInterval(() => {
      const next = text
        .split('')
        .map((letter, index) => {
          if (letter === ' ') return ' '
          const revealIndex = revealDirection === 'end' ? text.length - 1 - index : index
          const shouldReveal = sequential ? revealIndex < step : step >= maxSteps
          return shouldReveal ? letter : chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')

      setDisplay(next)
      step += 1

      if (step > maxSteps) {
        window.clearInterval(interval)
        setDisplay(text)
        setSettled(true)
      }
    }, speed)

    return () => window.clearInterval(interval)
  }, [active, revealDirection, sequential, speed, text])

  return (
    <span ref={ref} className={settled ? className : encryptedClassName || className}>
      {display}
    </span>
  )
}
