import { Resend } from 'resend'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('Missing RESEND_API_KEY environment variable')
  }
  return new Resend(key)
}

export interface SendEmailParams {
  from: string
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(params: SendEmailParams) {
  try {
    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo,
    })

    if (error) {
      return { success: false as const, error: error.message, messageId: '' }
    }

    return { success: true as const, messageId: data?.id ?? '' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error sending email'
    return { success: false as const, error: message, messageId: '' }
  }
}
