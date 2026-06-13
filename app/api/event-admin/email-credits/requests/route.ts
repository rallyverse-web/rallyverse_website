import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { getCreditRequestsByEvent } from '@/lib/repositories/email-credit-requests'

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const requests = await getCreditRequestsByEvent(admin.event_id!)
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Email credit requests error:', error)
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  }
}
