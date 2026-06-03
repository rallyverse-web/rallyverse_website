import { NextRequest, NextResponse } from 'next/server'
import { getRegistrationsByEventId, getRegistrationsMetrics } from '@/lib/repositories/registrations'
import { getAdminFromRequest } from '@/lib/event-admin-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const registrations = await getRegistrationsByEventId(eventId)
    const metrics = await getRegistrationsMetrics(eventId)
    return NextResponse.json({ registrations, metrics })
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}
