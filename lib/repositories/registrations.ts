import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Registration, RegistrationFormData, RegistrationStatus, ApprovalAction } from '@/lib/types/supabase'
import { generateRegistrationId } from '@/lib/utils'

export async function createRegistration(formData: RegistrationFormData): Promise<Registration> {
  const supabase = await getSupabaseServerClient()
  const registrationId = generateRegistrationId()

  const { data: existing } = await supabase
    .from('registrations')
    .select('id')
    .eq('event_id', formData.event_id)
    .eq('email', formData.email)
    .eq('format', formData.format)
    .maybeSingle()

  if (existing) {
    throw new Error('DUPLICATE_REGISTRATION')
  }

  const { data, error } = await supabase
    .from('registrations')
    .insert({
      event_id: formData.event_id,
      registration_id: registrationId,
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      email: formData.email,
      city: formData.city,
      gender: formData.gender,
      format: formData.format,
      partner_name: formData.partner_name || null,
      partner_phone: formData.partner_phone || null,
      status: 'Pending' as RegistrationStatus,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('DUPLICATE_REGISTRATION')
    }
    throw error
  }
  return data
}

export async function getRegistrationsByEventId(eventId: string): Promise<Registration[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getRegistrationById(id: string): Promise<Registration | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getRegistrationByRegistrationId(registrationId: string): Promise<Registration | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('registration_id', registrationId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function updateRegistrationStatus(
  id: string,
  action: ApprovalAction,
  approvedBy: string | null
): Promise<Registration> {
  const supabase = await getSupabaseServerClient()

  const updateData: Record<string, unknown> = {
    status: action.status,
    notes: action.notes || null,
    updated_at: new Date().toISOString(),
  }

  if (action.status === 'Approved' || action.status === 'Rejected') {
    updateData.approved_by = approvedBy
    updateData.approved_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('registrations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getRegistrationsMetrics(eventId: string): Promise<{
  total: number
  pending: number
  approved: number
  rejected: number
}> {
  const registrations = await getRegistrationsByEventId(eventId)
  return {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === 'Pending').length,
    approved: registrations.filter((r) => r.status === 'Approved').length,
    rejected: registrations.filter((r) => r.status === 'Rejected').length,
  }
}
