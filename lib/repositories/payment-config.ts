import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { EventPaymentConfig, EventPaymentConfigFormData } from '@/lib/types/supabase'

export async function getPaymentConfig(eventId: string): Promise<EventPaymentConfig | null> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('event_payment_config')
      .select('*')
      .eq('event_id', eventId)
      .maybeSingle()
    if (error) throw error
    return data
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Dynamic server usage') || (error as any).digest === 'DYNAMIC_SERVER_USAGE' || error.message.includes('cookies'))) {
      throw error
    }
    console.error(`Error fetching payment config for event ${eventId}:`, error)
  }
  if (eventId === 'fallback-event-id') {
    return {
      id: 'fallback-payment-config-id',
      event_id: 'fallback-event-id',
      upi_id: 'adityag.007@ptaxis',
      account_holder_name: 'Aditya Gupta',
      mobile_number: '8951760369',
      whatsapp_number: '8951760369',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
  return null
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
