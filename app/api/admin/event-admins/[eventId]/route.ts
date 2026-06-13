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

/** Try to create an auth user; if the email already exists, look up its ID. */
async function getOrCreateAuthUserId(email: string): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const tempPassword = crypto.randomUUID()

  const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey },
    body: JSON.stringify({ email, password: tempPassword, email_confirm: true }),
  })

  if (authRes.ok) {
    const user = await authRes.json()
    return user.id
  }

  const errBody = await authRes.text()
  // email_exists — look up the existing auth user
  if (errBody.includes('email_exists')) {
    const lookupRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?filter=${encodeURIComponent(email)}`,
      { headers: { 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey } },
    )
    if (lookupRes.ok) {
      const body = await lookupRes.json()
      // GoTrue can return { users: [...] } or a plain array
      const users = Array.isArray(body) ? body : (body as Record<string, unknown>).users as Array<Record<string, unknown>> ?? []
      const found = users.find((u: Record<string, unknown>) => u.email === email)
      if (found?.id) return found.id as string
    }
  }

  return null
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

    // Get or create the Supabase Auth user
    const authUserId = await getOrCreateAuthUserId(body.email)

    // Create event admin record
    const admin = await createEventAdmin(eventId, { name: body.name, email: body.email }, authUserId ?? undefined)

    // Send password reset email so they can set their own password
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const recoverRes = await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey },
      body: JSON.stringify({ email: body.email }),
    })

    if (!recoverRes.ok) {
      const warnText = await recoverRes.text()
      console.warn(`Password reset email failed for ${body.email}: ${warnText}`)
      return NextResponse.json({
        success: true,
        admin,
        warning: 'Admin created but invitation email could not be sent. Use Resend Invitation to retry.',
      })
    }

    return NextResponse.json({ success: true, admin })
  } catch (error) {
    console.error('Failed to create event admin:', error)
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 })
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
