import { NextRequest, NextResponse } from 'next/server'
import { rejectCreditRequest } from '@/lib/repositories/email-credit-requests'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getEmailSettings } from '@/lib/repositories/email-settings'
import { sendEmail } from '@/lib/resend-service'
import { createEmailLog } from '@/lib/repositories/email-logs'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const notes = body.admin_notes || null

    const request = await rejectCreditRequest(id, 'system', notes)

    // Send notification email to event admin
    try {
      const supabase = await getSupabaseServerClient()

      const { data: admin } = await supabase
        .from('event_admins')
        .select('email, name, event_id')
        .eq('id', request.event_admin_id)
        .single()

      const { data: event } = await supabase
        .from('events')
        .select('name')
        .eq('id', request.event_id)
        .single()

      if (admin?.email) {
        const settings = await getEmailSettings(request.event_id)
        const senderName = settings?.sender_name || 'RallyVerse'
        const replyTo = settings?.reply_to_email || undefined

        const notesHtml = notes ? `<p>Admin notes: ${notes}</p>` : ''

        await sendEmail({
          from: `${senderName} <registrations@rallyverse.social>`,
          to: admin.email,
          subject: 'Email Credit Request Rejected',
          html: `<p>Hi ${admin.name || 'Organizer'},</p>
<p>Your request for <strong>+${request.email_credits} email credits</strong> for event <strong>${event?.name || request.event_id}</strong> has been rejected.</p>
${notesHtml}
<p>If you have any questions, please contact support.</p>
<p>Thank you,<br/>RallyVerse Team</p>`,
          replyTo,
        })

        await createEmailLog({
          event_id: request.event_id,
          template_id: null,
          recipient_email: admin.email,
          subject: 'Email Credit Request Rejected',
          sent_by: 'system',
          status: 'sent',
          provider_message_id: '',
        })
      }
    } catch (emailErr) {
      console.error('Failed to send rejection email:', emailErr)
    }

    return NextResponse.json({ success: true, request })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Reject credit request error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
