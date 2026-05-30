'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

type ParticlesProps = {
  className?: string
  quantity?: number
  color?: string
  ease?: number
  refresh?: boolean
  size?: number
}

export default function Particles({
  className = '',
  quantity = 80,
  color = '#FF5E00',
  ease = 80,
  size = 0.6,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const parent = canvas?.parentElement
    if (!canvas || !context || !parent) return

    let frame = 0
    let particles: Particle[] = []
    const motionScale = Math.max(ease, 1) / 80

    const createParticles = () => {
      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      particles = Array.from({ length: quantity }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.18 * motionScale,
        vy: (Math.random() - 0.5) * 0.18 * motionScale,
        size: size + Math.random() * size * 1.8,
        alpha: 0.18 + Math.random() * 0.36,
      }))
    }

    const render = () => {
      const rect = parent.getBoundingClientRect()
      context.clearRect(0, 0, rect.width, rect.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -4) particle.x = rect.width + 4
        if (particle.x > rect.width + 4) particle.x = -4
        if (particle.y < -4) particle.y = rect.height + 4
        if (particle.y > rect.height + 4) particle.y = -4

        context.globalAlpha = particle.alpha
        context.fillStyle = color
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      })

      context.globalAlpha = 1
      frame = requestAnimationFrame(render)
    }

    createParticles()
    render()
    window.addEventListener('resize', createParticles)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', createParticles)
    }
  }, [color, ease, quantity, size])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
