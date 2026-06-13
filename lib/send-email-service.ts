import { getTemplates } from '@/lib/repositories/email-templates'
import { getEmailSettings } from '@/lib/repositories/email-settings'
import { renderEmailTemplate } from '@/lib/template-renderer'
import { sendEmail } from '@/lib/resend-service'
import { createEmailLog } from '@/lib/repositories/email-logs'
import { checkEmailQuota, incrementEmailsSent } from '@/lib/email-quota'
import type { EmailTemplate, EventEmailSettings, EventWithFormats, Registration, EmailTemplateType } from '@/lib/types/supabase'

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
    payment_status: registration.payment_status || '',
    payment_upi_id: registration.payment_upi_id || '',
    transaction_name: registration.transaction_name || '',
    transaction_reference: registration.transaction_reference || '',
    payment_screenshot_url: registration.payment_screenshot_url || '',
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
<strong>Payment Status:</strong> {{payment_status}}<br />
<strong>Format:</strong> {{format}}</p>
<p>We will review your registration and share the next update shortly.</p>
<p>If you need help, contact <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>
<p>Regards,<br />RallyVerse</p>`,
}

const PAYMENT_VERIFIED_DEFAULT = {
  subject: 'Payment Verified — {{event_name}}',
  content: `<p>Hi {{participant_name}},</p>
<p>Your payment for <strong>{{event_name}}</strong> has been successfully verified.</p>
<p><strong>Registration ID:</strong> {{registration_id}}<br />
<strong>Payment Status:</strong> Verified</p>
<p>Your registration is currently under review. We will notify you once it has been approved.</p>
<p>If you need help, contact <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>
<p>Regards,<br />RallyVerse</p>`,
}

const PAYMENT_REJECTED_DEFAULT = {
  subject: 'Payment Verification Failed — {{event_name}}',
  content: `<p>Hi {{participant_name}},</p>
<p>We were unable to verify your payment for <strong>{{event_name}}</strong>.</p>
<p><strong>Registration ID:</strong> {{registration_id}}</p>
<p>Please contact the organizer or submit updated payment information.</p>
<p>If you need help, contact <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>
<p>Regards,<br />RallyVerse</p>`,
}

export async function sendPaymentVerifiedEmail(
  eventId: string,
  registration: Registration,
  event: EventWithFormats,
  sentBy: string | null = null
) {
  const settings = await getEmailSettings(eventId)
  const templates = await getTemplates(eventId)
  const template = templates.find(t => t.template_type === 'payment_verified')
  const variables = buildVariables(registration, event, settings)

  // Check quota
  const quota = await checkEmailQuota(eventId, 1)
  if (!quota.allowed) {
    try { await createEmailLog({ event_id: eventId, template_id: template?.id || null, recipient_email: registration.email, subject: 'Payment Verified — (blocked)', sent_by: sentBy, status: 'failed', provider_message_id: '' }) } catch {}
    return { registrationId: registration.registration_id, recipientEmail: registration.email, success: false, error: quota.message }
  }

  let subject = ''
  let sendSuccess = false
  let messageId = ''
  let sendError: string | undefined

  try {
    const rendered = renderEmailTemplate(
      template?.subject || PAYMENT_VERIFIED_DEFAULT.subject,
      template?.content || PAYMENT_VERIFIED_DEFAULT.content,
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
  } catch (logErr) {
    console.error('Failed to log payment verified email:', logErr)
  }

  // Track usage on success
  if (sendSuccess) {
    await incrementEmailsSent(eventId, 1).catch(e => console.error('Failed to increment quota:', e))
  }

  return {
    registrationId: registration.registration_id,
    recipientEmail: registration.email,
    success: sendSuccess,
    error: sendError,
    messageId: sendSuccess ? messageId : undefined,
  }
}

export async function sendPaymentRejectedEmail(
  eventId: string,
  registration: Registration,
  event: EventWithFormats,
  sentBy: string | null = null,
  reason?: string
) {
  const settings = await getEmailSettings(eventId)
  const templates = await getTemplates(eventId)
  const template = templates.find(t => t.template_type === 'payment_rejected')
  const variables = buildVariables(registration, event, settings, {
    rejection_reason: reason || '',
  })

  // Check quota
  const quota = await checkEmailQuota(eventId, 1)
  if (!quota.allowed) {
    try { await createEmailLog({ event_id: eventId, template_id: template?.id || null, recipient_email: registration.email, subject: 'Payment Rejected — (blocked)', sent_by: sentBy, status: 'failed', provider_message_id: '' }) } catch {}
    return { registrationId: registration.registration_id, recipientEmail: registration.email, success: false, error: quota.message }
  }

  let subject = ''
  let sendSuccess = false
  let messageId = ''
  let sendError: string | undefined

  try {
    const rendered = renderEmailTemplate(
      template?.subject || PAYMENT_REJECTED_DEFAULT.subject,
      template?.content || PAYMENT_REJECTED_DEFAULT.content,
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
  } catch (logErr) {
    console.error('Failed to log payment rejected email:', logErr)
  }

  // Track usage on success
  if (sendSuccess) {
    await incrementEmailsSent(eventId, 1).catch(e => console.error('Failed to increment quota:', e))
  }

  return {
    registrationId: registration.registration_id,
    recipientEmail: registration.email,
    success: sendSuccess,
    error: sendError,
    messageId: sendSuccess ? messageId : undefined,
  }
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

  // Check quota
  const quota = await checkEmailQuota(eventId, 1)
  if (!quota.allowed) {
    try { await createEmailLog({ event_id: eventId, template_id: template.id, recipient_email: registration.email, subject: template.subject + ' (blocked)', sent_by: sentBy, status: 'failed', provider_message_id: '' }) } catch {}
    return { registrationId: registration.registration_id, recipientEmail: registration.email, success: false, error: quota.message }
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
  } catch (logErr) {
    console.error('Failed to log email send result:', logErr)
  }

  // Track usage on success
  if (sendSuccess) {
    await incrementEmailsSent(eventId, 1).catch(e => console.error('Failed to increment quota:', e))
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

  // Check quota (non-blocking — registration proceeds regardless)
  const quota = await checkEmailQuota(eventId, 1)
  if (!quota.allowed) {
    console.error('Registration received email blocked:', quota.message)
    try { await createEmailLog({ event_id: eventId, template_id: template?.id || null, recipient_email: registration.email, subject: 'Registration Received — (blocked)', sent_by: sentBy, status: 'failed', provider_message_id: '' }) } catch {}
    return { registrationId: registration.registration_id, recipientEmail: registration.email, success: false, error: quota.message }
  }

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
  } catch (logErr) {
    console.error('Failed to log registration received email:', logErr)
  }

  // Track usage on success
  if (sendSuccess) {
    await incrementEmailsSent(eventId, 1).catch(e => console.error('Failed to increment quota:', e))
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

  // Check quota for total recipients upfront
  const quota = await checkEmailQuota(eventId, recipients.length)
  if (!quota.allowed) {
    return { total: recipients.length, sent: 0, failed: recipients.length, results: recipients.map(r => ({
      registrationId: r.registration.registration_id,
      recipientEmail: r.registration.email,
      success: false,
      error: quota.message,
    })) }
  }

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
