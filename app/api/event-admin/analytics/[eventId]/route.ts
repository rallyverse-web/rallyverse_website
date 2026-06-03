import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { getEventAnalytics, getTrendData } from '@/lib/repositories/analytics'

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { eventId } = await params
    if (admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized: cannot access this event' }, { status: 403 })
    }

    const [analytics, trends] = await Promise.all([
      getEventAnalytics(eventId),
      getTrendData(eventId),
    ])

    if (!analytics) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ analytics, trends })
  } catch (error) {
    console.error('Event analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
