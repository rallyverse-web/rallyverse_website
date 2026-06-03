import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { EventEmailSettings, EventEmailSettingsFormData } from '@/lib/types/supabase'

export async function getEmailSettings(eventId: string): Promise<EventEmailSettings | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_email_settings')
    .select('*')
    .eq('event_id', eventId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function upsertEmailSettings(
  eventId: string,
  formData: EventEmailSettingsFormData
): Promise<EventEmailSettings> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_email_settings')
    .upsert({
      event_id: eventId,
      sender_name: formData.sender_name,
      reply_to_email: formData.reply_to_email,
      support_email: formData.support_email,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}
