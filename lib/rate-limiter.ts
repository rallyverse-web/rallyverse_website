const rateMap = new Map<string, { count: number; resetAt: number }>()

const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()

  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [k, v] of rateMap) {
      if (now > v.resetAt) rateMap.delete(k)
    }
    lastCleanup = now
  }

  const entry = rateMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) return false

  entry.count++
  return true
}

export function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return `register:${ip}`
}
