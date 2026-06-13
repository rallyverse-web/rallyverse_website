import { NextRequest, NextResponse } from 'next/server'
import { getEventAdminById, updateEventAdminStatus } from '@/lib/repositories/event-admins'
import { requireAdmin } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; adminId: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { eventId, adminId } = await params
    const ea = await getEventAdminById(adminId)
    if (!ea) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    if (ea.event_id !== eventId) return NextResponse.json({ error: 'Admin does not belong to this event' }, { status: 403 })

    await updateEventAdminStatus(adminId, 'disabled')
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}