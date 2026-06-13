import { NextRequest, NextResponse } from 'next/server'
import { getEventAdminById } from '@/lib/repositories/event-admins'
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
    if (ea.status === 'disabled') return NextResponse.json({ error: 'Cannot resend invitation to a disabled admin' }, { status: 400 })

    const authUserId = (ea as unknown as Record<string, unknown>).auth_user_id as string | undefined
    if (!authUserId) {
      return NextResponse.json({ error: 'No auth user linked to this admin' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const recoverRes = await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY! },
      body: JSON.stringify({ email: ea.email }),
    })

    if (!recoverRes.ok) {
      const errText = await recoverRes.text()
      return NextResponse.json({ error: `Failed to send email: ${errText}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Password reset email sent to ${ea.email}` })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}