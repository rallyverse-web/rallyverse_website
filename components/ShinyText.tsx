'use client'

type ShinyTextProps = {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
  shineColor?: string
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = '',
  color = 'currentColor',
  shineColor = 'rgba(255,255,255,0.6)',
}: ShinyTextProps) {
  if (disabled) {
    return <span className={className}>{text}</span>
  }

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        color,
        backgroundImage: `linear-gradient(110deg, ${color} 0%, ${color} 38%, ${shineColor} 50%, ${color} 62%, ${color} 100%)`,
        backgroundSize: '220% 100%',
        animation: `shiny-text ${speed}s linear infinite`,
        WebkitBackgroundClip: 'text',
      }}
    >
      {text}
    </span>
  )
}
