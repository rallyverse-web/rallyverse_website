import { NextRequest, NextResponse } from 'next/server'
import { getEventAdmins, createEventAdmin, removeEventAdmin, getEventAdminByEmail } from '@/lib/repositories/event-admins'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { eventId } = await params
    const admins = await getEventAdmins(eventId)
    return NextResponse.json({ admins })
  } catch (error) {
    console.error('Failed to fetch event admins:', error)
    return NextResponse.json({ error: 'Failed to fetch event admins' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { eventId } = await params
    const body = await req.json()

    // Duplicate check: same email across any event
    const existing = await getEventAdminByEmail(body.email)
    if (existing) {
      return NextResponse.json({ error: 'This email is already assigned to an event admin account.' }, { status: 409 })
    }

    // Create Supabase Auth user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const tempPassword = crypto.randomUUID()
    const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey },
      body: JSON.stringify({ email: body.email, password: tempPassword, email_confirm: true }),
    })
    if (!authRes.ok) {
      const err = await authRes.text()
      return NextResponse.json({ error: `Failed to create auth user: ${err}` }, { status: 500 })
    }
    const authUser = await authRes.json()

    // Create event admin record linked to auth user
    const admin = await createEventAdmin(eventId, { name: body.name, email: body.email }, authUser.id)

    // Send password reset email so they can set their own password
    await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': serviceKey },
      body: JSON.stringify({ email: body.email }),
    })

    return NextResponse.json({ success: true, admin })
  } catch (error) {
    console.error('Failed to create event admin:', error)
    return NextResponse.json({ error: 'Failed to create event admin' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const adminId = searchParams.get('adminId')
    if (!adminId) {
      return NextResponse.json({ error: 'adminId is required' }, { status: 400 })
    }
    await removeEventAdmin(adminId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to remove event admin:', error)
    return NextResponse.json({ error: 'Failed to remove event admin' }, { status: 500 })
  }
}
