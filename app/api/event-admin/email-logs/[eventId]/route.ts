import { NextRequest, NextResponse } from 'next/server'
import { getEmailLogsWithFilters } from '@/lib/repositories/email-logs'
import { getAdminFromRequest } from '@/lib/event-admin-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templateType = req.nextUrl.searchParams.get('templateType') || undefined
    const status = req.nextUrl.searchParams.get('status') || undefined
    const dateFrom = req.nextUrl.searchParams.get('dateFrom') || undefined
    const dateTo = req.nextUrl.searchParams.get('dateTo') || undefined

    const logs = await getEmailLogsWithFilters({
      eventId,
      templateType,
      status,
      dateFrom,
      dateTo,
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Failed to fetch email logs:', error)
    return NextResponse.json({ error: 'Failed to fetch email logs' }, { status: 500 })
  }
}
