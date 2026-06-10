import { getTemplates } from '@/lib/repositories/email-templates'
import { getEmailSettings } from '@/lib/repositories/email-settings'
import { renderEmailTemplate } from '@/lib/template-renderer'
import { sendEmail } from '@/lib/resend-service'
import { createEmailLog } from '@/lib/repositories/email-logs'
import type { Registration, EmailTemplate, EventWithFormats, EventEmailSettings, EmailTemplateType } from '@/lib/types/supabase'

export interface BulkSendRecipient {
  registration: Registration
  event: EventWithFormats
}

export interface SendEmailOptions {
  includeWhatsapp?: boolean
}

export interface SendResult {
  registrationId: string
  recipientEmail: string
  success: boolean
  error?: string
  messageId?: string
}

export interface BulkSendResult {
  total: number
  sent: number
  failed: number
  results: SendResult[]
}

function buildVariables(
  registration: Registration,
  event: EventWithFormats,
  settings: EventEmailSettings | null,
  extra?: Record<string, string>
): Record<string, string> {
  return {
    participant_name: registration.full_name,
    registration_id: registration.registration_id,
    event_name: event.name,
    event_date: event.date_label || (event.event_date ? new Date(event.event_date).toLocaleDateString('en-IN') : ''),
    event_venue: event.venue || '',
    format: registration.format,
    registration_status: registration.status,
    support_email: settings?.support_email || 'support@rallyverse.social',
    whatsapp_number: event.whatsapp_number || '',
    event_whatsapp: event.whatsapp_number || '',
    event_whatsapp_group: event.whatsapp_group_link || '',
    ...extra,
  }
}

const REGISTRATION_RECEIVED_DEFAULT = {
  subject: 'Registration Received — {{event_name}}',
  content: `<p>Hi {{participant_name}},</p>
<p>We have received your registration for <strong>{{event_name}}</strong>.</p>
<p><strong>Registration ID:</strong> {{registration_id}}<br />
<strong>Current Status:</strong> {{registration_status}}<br />
<strong>Format:</strong> {{format}}</p>
<p>We will review your registration and share the next update shortly.</p>
<p>If you need help, contact <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>
<p>Regards,<br />RallyVerse</p>`,
}

export async function sendSingleTemplatedEmail(
  eventId: string,
  templateType: EmailTemplateType,
  registration: Registration,
  event: EventWithFormats,
  settings: EventEmailSettings | null,
  sentBy: string | null,
  options?: SendEmailOptions & { template?: EmailTemplate }
): Promise<SendResult> {
  let template: EmailTemplate
  try {
    if (options?.template) {
      template = options.template
    } else {
      const templates = await getTemplates(eventId)
      const found = templates.find(t => t.template_type === templateType)
      if (!found) throw new Error(`No ${templateType} template found for this event`)
      template = found
    }
  } catch (err) {
    return {
      registrationId: registration.registration_id,
      recipientEmail: registration.email,
      success: false,
      error: err instanceof Error ? err.message : 'Template not found',
    }
  }

  let sendSuccess = false
  let messageId = ''
  let sendError: string | undefined
  let subject = ''

  try {
    const variables = buildVariables(registration, event, settings)

    let content = template.content
    if (options?.includeWhatsapp && event.whatsapp_number) {
      content += `<p><strong>WhatsApp Contact:</strong> ${event.whatsapp_number}</p>`
      if (event.whatsapp_group_link) {
        content += `<p><strong>WhatsApp Group:</strong> <a href="${event.whatsapp_group_link}">${event.whatsapp_group_link}</a></p>`
      }
    }

    const rendered = renderEmailTemplate(template.subject, content, variables)
    subject = rendered.subject

    const senderName = settings?.sender_name || 'RallyVerse'
    const replyTo = settings?.reply_to_email || undefined

    const result = await sendEmail({
      from: `${senderName} <registrations@rallyverse.social>`,
      to: registration.email,
      subject: rendered.subject,
      html: rendered.content,
      replyTo,
    })

    sendSuccess = result.success
    messageId = result.messageId || ''
    sendError = result.error
  } catch (err) {
    sendError = err instanceof Error ? err.message : 'Send failed'
  }

  try {
    await createEmailLog({
      event_id: eventId,
      template_id: template.id,
      recipient_email: registration.email,
      subject,
      sent_by: sentBy,
      status: sendSuccess ? 'sent' : 'failed',
      provider_message_id: messageId,
    })
  } catch {
    // Log creation failure must not mask email send result
  }

  return {
    registrationId: registration.registration_id,
    recipientEmail: registration.email,
    success: sendSuccess,
    error: sendError,
    messageId: sendSuccess ? messageId : undefined,
  }
}

export async function sendRegistrationReceivedEmail(
  eventId: string,
  registration: Registration,
  event: EventWithFormats,
  sentBy: string | null = null
): Promise<SendResult> {
  const settings = await getEmailSettings(eventId)
  const templates = await getTemplates(eventId)
  const template = templates.find(t => t.template_type === 'registration_received')
  const variables = buildVariables(registration, event, settings, {
    registration_status: registration.status,
  })

  let subject = ''
  let sendSuccess = false
  let messageId = ''
  let sendError: string | undefined

  try {
    const rendered = renderEmailTemplate(
      template?.subject || REGISTRATION_RECEIVED_DEFAULT.subject,
      template?.content || REGISTRATION_RECEIVED_DEFAULT.content,
      variables
    )
    subject = rendered.subject

    const senderName = settings?.sender_name || 'RallyVerse'
    const replyTo = settings?.reply_to_email || undefined
    const result = await sendEmail({
      from: `${senderName} <registrations@rallyverse.social>`,
      to: registration.email,
      subject: rendered.subject,
      html: rendered.content,
      replyTo,
    })

    sendSuccess = result.success
    messageId = result.messageId || ''
    sendError = result.error
  } catch (err) {
    sendError = err instanceof Error ? err.message : 'Send failed'
  }

  try {
    await createEmailLog({
      event_id: eventId,
      template_id: template?.id || null,
      recipient_email: registration.email,
      subject,
      sent_by: sentBy,
      status: sendSuccess ? 'sent' : 'failed',
      provider_message_id: messageId,
    })
  } catch {
    // Email logging should never block registration success.
  }

  return {
    registrationId: registration.registration_id,
    recipientEmail: registration.email,
    success: sendSuccess,
    error: sendError,
    messageId: sendSuccess ? messageId : undefined,
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function sendBulkTemplatedEmails(
  eventId: string,
  templateType: EmailTemplateType,
  recipients: BulkSendRecipient[],
  sentBy: string | null,
  options?: SendEmailOptions & { batchSize?: number; batchDelay?: number }
): Promise<BulkSendResult> {
  const batchSize = options?.batchSize ?? 5
  const batchDelay = options?.batchDelay ?? 1000

  const event = recipients.length > 0 ? recipients[0].event : null
  if (!event) return { total: 0, sent: 0, failed: 0, results: [] }

  const settings = await getEmailSettings(eventId)

  const templates = await getTemplates(eventId)
  const template = templates.find(t => t.template_type === templateType)
  if (!template) return { total: 0, sent: 0, failed: 0, results: [] }

  const results: SendResult[] = []
  let sent = 0
  let failed = 0

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize)

    const batchResults = await Promise.allSettled(
      batch.map(r =>
        sendSingleTemplatedEmail(
          eventId,
          templateType,
          r.registration,
          r.event,
          settings,
          sentBy,
          { ...options, template }
        )
      )
    )

    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        results.push(r.value)
        if (r.value.success) sent++
        else failed++
      } else {
        failed++
        results.push({
          registrationId: '',
          recipientEmail: '',
          success: false,
          error: r.reason instanceof Error ? r.reason.message : 'Unknown error',
        })
      }
    }

    if (i + batchSize < recipients.length) {
      await delay(batchDelay)
    }
  }

  return {
    total: recipients.length,
    sent,
    failed,
    results,
  }
}
