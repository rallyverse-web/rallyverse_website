import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminFromRequest } from '@/lib/event-admin-auth'

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ admin: { id: admin.id, name: admin.name, event_id: admin.event_id } })
  } catch (error) {
    console.error('Failed to get admin:', error)
    return NextResponse.json({ error: 'Failed to get admin info' }, { status: 500 })
  }
}
