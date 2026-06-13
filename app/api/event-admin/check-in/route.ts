import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { checkInRegistration, undoCheckInRegistration, getRegistrationById } from '@/lib/repositories/registrations'

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { registration_id, action } = await req.json()
    if (!registration_id) {
      return NextResponse.json({ error: 'registration_id is required' }, { status: 400 })
    }
    if (!action || !['check_in', 'undo'].includes(action)) {
      return NextResponse.json({ error: 'action must be "check_in" or "undo"' }, { status: 400 })
    }

    const registration = await getRegistrationById(registration_id)
    if (!registration) return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    if (registration.event_id !== admin.event_id) {
      return NextResponse.json({ error: 'Unauthorized: cannot access this registration' }, { status: 403 })
    }

    let updated
    if (action === 'check_in') {
      updated = await checkInRegistration(registration_id, admin.id)
    } else {
      updated = await undoCheckInRegistration(registration_id, admin.id)
    }

    return NextResponse.json({ success: true, registration: updated })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Check-in error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
