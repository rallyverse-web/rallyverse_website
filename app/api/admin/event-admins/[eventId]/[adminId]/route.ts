import { NextRequest, NextResponse } from 'next/server'
import { getEventAdminById } from '@/lib/repositories/event-admins'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; adminId: string }> }
) {
  if (!await authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { eventId, adminId } = await params
    const admin = await getEventAdminById(adminId)
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }
    if (admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Admin does not belong to this event' }, { status: 403 })
    }
    return NextResponse.json({ admin })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
