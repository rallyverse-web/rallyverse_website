'use client'

import { type ReactNode, useRef, useState } from 'react'

type MagnetProps = {
  children: ReactNode
  padding?: number
  disabled?: boolean
}

export default function Magnet({ children, padding = 50, disabled = false }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('translate3d(0, 0, 0)')

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = event.clientX - (rect.left + rect.width / 2)
    const y = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(x, y)
    const influence = Math.max(0, 1 - distance / (Math.max(rect.width, rect.height) / 2 + padding))

    setTransform(`translate3d(${x * 0.22 * influence}px, ${y * 0.22 * influence}px, 0)`)
  }

  const reset = () => setTransform('translate3d(0, 0, 0)')

  return (
    <div
      ref={ref}
      className="inline-flex"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ padding, margin: -padding }}
    >
      <div className="inline-flex transition-transform duration-200 ease-out" style={{ transform }}>
        {children}
      </div>
    </div>
  )
}
