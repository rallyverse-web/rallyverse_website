import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { EventPaymentConfig, EventPaymentConfigFormData } from '@/lib/types/supabase'

export async function getPaymentConfig(eventId: string): Promise<EventPaymentConfig | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_payment_config')
    .select('*')
    .eq('event_id', eventId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function upsertPaymentConfig(
  eventId: string,
  formData: EventPaymentConfigFormData
): Promise<EventPaymentConfig> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_payment_config')
    .upsert({
      event_id: eventId,
      upi_id: formData.upi_id,
      account_holder_name: formData.account_holder_name,
      mobile_number: formData.mobile_number,
      whatsapp_number: formData.whatsapp_number,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePaymentConfig(eventId: string): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase
    .from('event_payment_config')
    .delete()
    .eq('event_id', eventId)
  if (error) throw error
}
