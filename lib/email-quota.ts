import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function getEmailQuota(eventId: string): Promise<{
  effective_limit: number
  emails_sent: number
  remaining: number
}> {
  const supabase = await getSupabaseServerClient()
  const { data: event } = await supabase
    .from('events')
    .select('email_limit, emails_sent, additional_email_credits')
    .eq('id', eventId)
    .single()

  if (!event) throw new Error('Event not found')

  const emailLimit = event.email_limit ?? 50
  const emailsSent = event.emails_sent ?? 0
  const additionalCredits = event.additional_email_credits ?? 0
  const effectiveLimit = emailLimit + additionalCredits
  const remaining = Math.max(0, effectiveLimit - emailsSent)

  return { effective_limit: effectiveLimit, emails_sent: emailsSent, remaining }
}

export async function checkEmailQuota(eventId: string, count: number = 1): Promise<{ allowed: boolean; remaining: number; message?: string }> {
  const { remaining, effective_limit } = await getEmailQuota(eventId)
  if (remaining < count) {
    return {
      allowed: false,
      remaining,
      message: `Email quota exceeded. ${remaining} remaining, ${count} required. Add more email credits or upgrade your package.`,
    }
  }
  return { allowed: true, remaining }
}

export async function incrementEmailsSent(eventId: string, count: number = 1): Promise<void> {
  const supabase = await getSupabaseServerClient()
  // Read current value, increment, write back
  const { data: event } = await supabase
    .from('events')
    .select('emails_sent')
    .eq('id', eventId)
    .single()
  const current = event?.emails_sent ?? 0
  const { error } = await supabase
    .from('events')
    .update({ emails_sent: current + count })
    .eq('id', eventId)
  if (error) {
    console.error('Failed to increment emails_sent:', error)
  }
}
