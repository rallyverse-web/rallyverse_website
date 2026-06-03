import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { EmailLog } from '@/lib/types/supabase'

export interface EmailLogFilters {
  eventId?: string
  templateType?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

export async function getEmailLogs(eventId?: string): Promise<EmailLog[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from('email_logs')
    .select('*')
    .order('created_at', { ascending: false })
  if (eventId) {
    query = query.eq('event_id', eventId)
  }
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as EmailLog[]
}

export async function getEmailLogsWithFilters(filters: EmailLogFilters): Promise<Record<string, unknown>[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from('email_logs')
    .select('*, email_templates!left(template_type), events!inner(name)')
    .order('created_at', { ascending: false })

  if (filters.eventId) {
    query = query.eq('email_logs.event_id', filters.eventId)
  }
  if (filters.status) {
    query = query.eq('email_logs.status', filters.status)
  }
  if (filters.dateFrom) {
    query = query.gte('email_logs.created_at', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('email_logs.created_at', filters.dateTo)
  }
  if (filters.templateType) {
    query = query.eq('email_templates.template_type', filters.templateType)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createEmailLog(params: {
  event_id: string
  template_id: string | null
  recipient_email: string
  subject: string
  sent_by: string | null
  status: 'sent' | 'failed'
  provider_message_id: string
}): Promise<EmailLog> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_logs')
    .insert({
      event_id: params.event_id,
      template_id: params.template_id,
      recipient_email: params.recipient_email,
      subject: params.subject,
      sent_by: params.sent_by,
      status: params.status,
      provider_message_id: params.provider_message_id,
    })
    .select()
    .single()
  if (error) throw error
  return data as EmailLog
}
