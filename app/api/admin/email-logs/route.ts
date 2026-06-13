import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getEmailLogsWithFilters } from '@/lib/repositories/email-logs'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function GET(req: NextRequest) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const eventId = req.nextUrl.searchParams.get('eventId') || undefined
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
