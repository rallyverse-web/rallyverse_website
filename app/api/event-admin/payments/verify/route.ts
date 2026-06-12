import { NextRequest, NextResponse } from 'next/server'
import { getRegistrationById, verifyPayment } from '@/lib/repositories/registrations'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { getEventById } from '@/lib/repositories/events'
import { sendPaymentVerifiedEmail } from '@/lib/send-email-service'

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { registration_id, send_email } = await req.json()
    if (!registration_id) {
      return NextResponse.json({ error: 'registration_id is required' }, { status: 400 })
    }

    const registration = await getRegistrationById(registration_id)
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    if (registration.event_id !== admin.event_id) {
      return NextResponse.json({ error: 'Unauthorized: cannot access this registration' }, { status: 403 })
    }
    if (registration.payment_status !== 'pending_verification') {
      return NextResponse.json({ error: 'Payment is not pending verification' }, { status: 400 })
    }

    const updated = await verifyPayment(registration_id, admin.id)

    let emailResult = null
    if (send_email) {
      try {
        const event = await getEventById(admin.event_id)
        if (event) {
          emailResult = await sendPaymentVerifiedEmail(
            admin.event_id,
            registration,
            event,
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
    console.error('Payment verify error:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}