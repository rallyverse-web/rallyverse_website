import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Registration, RegistrationFormData, RegistrationStatus, ApprovalAction, RegistrationAuditLog } from '@/lib/types/supabase'
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

async function writeRegistrationAuditLog(params: {
  registration: Registration
  action: string
  changedBy: string | null
  previousData: Record<string, unknown> | null
  nextData: Record<string, unknown> | null
  notes?: string | null
}): Promise<RegistrationAuditLog | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('registration_audit_logs')
    .insert({
      registration_id: params.registration.id,
      event_id: params.registration.event_id,
      action: params.action,
      changed_by: params.changedBy,
      previous_data: params.previousData,
      next_data: params.nextData,
      notes: params.notes || null,
    })
    .select()
    .single()
  if (error) {
    console.error('Failed to write registration audit log:', error)
    return null
  }
  return data as RegistrationAuditLog
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
  const existing = await getRegistrationById(id)
  if (!existing) {
    throw new Error('Registration not found')
  }

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

  await writeRegistrationAuditLog({
    registration: data,
    action: `status_${action.status.toLowerCase()}`,
    changedBy: approvedBy,
    previousData: existing as unknown as Record<string, unknown>,
    nextData: data as unknown as Record<string, unknown>,
    notes: action.notes || null,
  })
  return data
}

export async function updateRegistrationDetails(
  id: string,
  updates: Partial<Pick<Registration, 'full_name' | 'email' | 'phone_number' | 'format' | 'partner_name' | 'partner_phone'>>,
  changedBy: string | null
): Promise<Registration> {
  const supabase = await getSupabaseServerClient()
  const existing = await getRegistrationById(id)
  if (!existing) {
    throw new Error('Registration not found')
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.full_name !== undefined) updateData.full_name = updates.full_name
  if (updates.email !== undefined) updateData.email = updates.email
  if (updates.phone_number !== undefined) updateData.phone_number = updates.phone_number
  if (updates.format !== undefined) updateData.format = updates.format
  if (updates.partner_name !== undefined) updateData.partner_name = updates.partner_name
  if (updates.partner_phone !== undefined) updateData.partner_phone = updates.partner_phone

  const { data, error } = await supabase
    .from('registrations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await writeRegistrationAuditLog({
    registration: data,
    action: 'profile_update',
    changedBy,
    previousData: existing as unknown as Record<string, unknown>,
    nextData: data as unknown as Record<string, unknown>,
    notes: 'Registration details updated by organizer',
  })

  return data
}

export async function deleteRegistration(id: string, changedBy: string | null = null): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const existing = await getRegistrationById(id)
  if (!existing) {
    throw new Error('Registration not found')
  }

  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('id', id)
  if (error) throw error

  await writeRegistrationAuditLog({
    registration: existing,
    action: 'deleted',
    changedBy,
    previousData: existing as unknown as Record<string, unknown>,
    nextData: null,
    notes: 'Registration deleted by organizer',
  })
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
