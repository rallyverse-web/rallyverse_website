import { NextRequest, NextResponse } from 'next/server'
import { getPlatformOverview, getAllEventAnalytics, getTrendData } from '@/lib/repositories/analytics'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function GET(req: NextRequest) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [overview, eventAnalytics, trends] = await Promise.all([
      getPlatformOverview(),
      getAllEventAnalytics(),
      getTrendData(),
    ])

    return NextResponse.json({ overview, events: eventAnalytics, trends })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
