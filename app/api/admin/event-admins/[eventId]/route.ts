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
    console.log('[ADMIN-CREATE] Step 1 - Params', JSON.stringify({ eventId, email: body.email, name: body.name }))

    // Duplicate check: same email across any event
    const existing = await getEventAdminByEmail(body.email)
    console.log('[ADMIN-CREATE] Step 2 - Duplicate check', existing ? 'EXISTS' : 'OK')
    if (existing) {
      return NextResponse.json({ error: 'This email is already assigned to an event admin account.' }, { status: 409 })
    }

    // Get or create the Supabase Auth user
    const authUserId = await getOrCreateAuthUserId(body.email)
    console.log('[ADMIN-CREATE] Step 3 - Auth user ID:', authUserId ?? 'null (will create without auth link)')

    // Create event admin record
    let admin
    try {
      admin = await createEventAdmin(eventId, { name: body.name, email: body.email }, authUserId ?? undefined)
      console.log('[ADMIN-CREATE] Step 4 - event_admins insert OK, id:', admin.id)
    } catch (insertErr) {
      const msg = insertErr instanceof Error ? insertErr.message : String(insertErr)
      console.error('[ADMIN-CREATE] Step 4 FAILED - event_admins insert threw:', msg, insertErr)
      return NextResponse.json({ error: `event_admins insert failed: ${msg}` }, { status: 500 })
    }

    // Send password reset email so they can set their own password
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    console.log('[ADMIN-CREATE] Step 5 - Calling /auth/v1/recover for', body.email)

    let recoverRes
    try {
      recoverRes = await fetch(`${supabaseUrl}/auth/v1/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey },
        body: JSON.stringify({ email: body.email }),
      })
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
      console.error('[ADMIN-CREATE] Step 5 FETCH THREW:', msg, fetchErr)
      return NextResponse.json({ error: `Recover fetch threw: ${msg}` }, { status: 500 })
    }

    console.log('[ADMIN-CREATE] Step 5 recover status:', recoverRes.status)
    const recoverBody = await recoverRes.text()
    console.log('[ADMIN-CREATE] Step 5 recover body:', recoverBody)

    if (!recoverRes.ok) {
      console.warn(`[ADMIN-CREATE] Step 5 recover NOT OK: ${recoverBody}`)
      // Admin was created successfully — return success with warning
      return NextResponse.json({
        success: true,
        admin,
        warning: 'Admin created but invitation email could not be sent. Use Resend Invitation to retry.',
      })
    }

    console.log('[ADMIN-CREATE] Step 6 - returning success')
    return NextResponse.json({ success: true, admin })
  } catch (error) {
    const msg = error instanceof Error ? `${error.message}\n${error.stack}` : String(error)
    console.error('[ADMIN-CREATE] UNCAUGHT EXCEPTION:', msg)
    return NextResponse.json({ error: `Exception: ${msg}` }, { status: 500 })
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
