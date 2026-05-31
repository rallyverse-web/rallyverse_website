'use client'

import { useEffect, useRef, useState } from 'react'

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
  minAlpha?: number
  maxAlpha?: number
}

export default function Particles({
  className = '',
  quantity = 80,
  color = '#FF5E00',
  ease = 80,
  size = 0.6,
  minAlpha,
  maxAlpha,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const parent = canvas?.parentElement
    if (!canvas || !context || !parent) return

    let animId = 0
    let particles: Particle[] = []
    let w = 0
    let h = 0
    const motionScale = Math.max(ease, 1) / 80

    if (reduceMotion) return

    const initCanvas = () => {
      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const createParticles = () => {
      const aMin = minAlpha ?? 0.18
      const aMax = maxAlpha ?? aMin + 0.36
      particles = Array.from({ length: quantity }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18 * motionScale,
        vy: (Math.random() - 0.5) * 0.18 * motionScale,
        size: size + Math.random() * size * 1.8,
        alpha: aMin + Math.random() * (aMax - aMin),
      }))
    }

    const render = () => {
      context.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < -4) p.x = w + 4
        else if (p.x > w + 4) p.x = -4
        if (p.y < -4) p.y = h + 4
        else if (p.y > h + 4) p.y = -4

        context.globalAlpha = p.alpha
        context.fillStyle = color
        context.beginPath()
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        context.fill()
      }

      context.globalAlpha = 1
      animId = requestAnimationFrame(render)
    }

    const start = () => {
      animId = requestAnimationFrame(render)
    }

    const stop = () => {
      cancelAnimationFrame(animId)
      animId = 0
    }

    initCanvas()
    createParticles()
    start()

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) stop()
        else if (!document.hidden) start()
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const oldW = w
        const oldH = h
        initCanvas()
        if (w !== oldW || h !== oldH) {
          createParticles()
        }
        resizeTimer = null
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [color, ease, quantity, size, reduceMotion])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
