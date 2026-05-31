'use client'

import { type ReactNode } from 'react'

type GradientTextProps = {
  children: ReactNode
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
  className?: string
}

export default function GradientText({
  children,
  colors = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--accent-primary)'],
  animationSpeed = 6,
  showBorder = false,
  className = '',
}: GradientTextProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${showBorder ? 'rounded border px-1' : ''} ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '220% 100%',
        animation: `gradient-text ${animationSpeed}s linear infinite`,
        WebkitBackgroundClip: 'text',
        ...(showBorder ? { borderColor: 'var(--border-subtle)' } : {}),
      }}
    >
      {children}
    </span>
  )
}
