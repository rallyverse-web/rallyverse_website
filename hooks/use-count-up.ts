'use client'

import { useEffect, useState } from 'react'

export function useCountUp(target: number, duration = 1500, start = true) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    let frame: number
    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, start])

  return value
}
