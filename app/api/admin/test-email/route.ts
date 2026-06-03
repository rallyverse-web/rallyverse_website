import { NextRequest, NextResponse } from 'next/server'
import { getTemplateById } from '@/lib/repositories/email-templates'
import { getEmailSettings } from '@/lib/repositories/email-settings'
import { renderEmailTemplate } from '@/lib/template-renderer'
import { sendEmail } from '@/lib/resend-service'
import { createEmailLog } from '@/lib/repositories/email-logs'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { event_id, template_id, recipient_email, variables } = await req.json()

    if (!event_id || !template_id || !recipient_email) {
      return NextResponse.json({ error: 'event_id, template_id, and recipient_email are required' }, { status: 400 })
    }

    const template = await getTemplateById(template_id)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    if (template.event_id !== event_id) {
      return NextResponse.json({ error: 'Template does not belong to this event' }, { status: 400 })
    }

    const settings = await getEmailSettings(event_id)
    const senderName = settings?.sender_name || 'RallyVerse'
    const replyTo = settings?.reply_to_email || undefined

    const rendered = renderEmailTemplate(template.subject, template.content, variables || {})

    const result = await sendEmail({
      from: `${senderName} <registrations@rallyverse.social>`,
      to: recipient_email,
      subject: rendered.subject,
      html: rendered.content,
      replyTo,
    })

    await createEmailLog({
      event_id,
      template_id,
      recipient_email,
      subject: rendered.subject,
      sent_by: null,
      status: result.success ? 'sent' : 'failed',
      provider_message_id: result.messageId,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Test email sent', messageId: result.messageId })
  } catch (error) {
    console.error('Failed to send test email:', error)
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 })
  }
}
