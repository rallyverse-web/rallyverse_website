import { NextRequest, NextResponse } from 'next/server'
import { getEventAdminById } from '@/lib/repositories/event-admins'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; adminId: string }> }
) {
  if (!authorize(req)) {
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
