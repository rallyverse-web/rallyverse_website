import { NextRequest, NextResponse } from 'next/server'
import { getRegistrationById, updateRegistrationStatus } from '@/lib/repositories/registrations'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { getEventById } from '@/lib/repositories/events'
import { sendSingleTemplatedEmail } from '@/lib/send-email-service'
import { getEmailSettings } from '@/lib/repositories/email-settings'

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { registration_id, status, notes, send_email } = await req.json()
    if (!registration_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (status !== 'Approved' && status !== 'Rejected') {
      return NextResponse.json({ error: 'Invalid status. Must be Approved or Rejected' }, { status: 400 })
    }

    const registration = await getRegistrationById(registration_id)
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    if (registration.event_id !== admin.event_id) {
      return NextResponse.json({ error: 'Unauthorized: cannot access this registration' }, { status: 403 })
    }

    const updated = await updateRegistrationStatus(registration_id, { status, notes }, admin.id)

    let emailResult = null

    if (send_email) {
      const templateType = status === 'Approved' ? 'approval' : 'rejection'
      try {
        const event = await getEventById(admin.event_id)
        const settings = await getEmailSettings(admin.event_id)

        if (event) {
          emailResult = await sendSingleTemplatedEmail(
            admin.event_id,
            templateType,
            registration,
            event,
            settings,
            admin.id
          )
        }
      } catch (err) {
        emailResult = {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to send email',
        }
      }
    }

    return NextResponse.json({ success: true, registration: updated, email_sent: emailResult })
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 })
  }
}
