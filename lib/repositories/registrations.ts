import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { PaymentStatus, Registration, RegistrationFormData, RegistrationStatus, ApprovalAction, RegistrationAuditLog } from '@/lib/types/supabase'
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

  const hasPaymentInfo = !!(formData.payment_upi_id || formData.transaction_name)
  const insertData: Record<string, unknown> = {
    event_id: formData.event_id,
    registration_id: registrationId,
    full_name: formData.full_name,
    phone_number: formData.phone_number,
    email: formData.email,
    city: formData.city,
    gender: formData.gender,
    format: formData.format,
    time_slot: formData.time_slot || null,
    partner_name: formData.partner_name || null,
    partner_phone: formData.partner_phone || null,
    status: 'Pending' as RegistrationStatus,
    payment_status: hasPaymentInfo ? ('pending_verification' as PaymentStatus) : null,
    payment_upi_id: formData.payment_upi_id || null,
    transaction_name: formData.transaction_name || null,
    transaction_reference: formData.transaction_reference || null,
    payment_screenshot_url: formData.payment_screenshot_url || null,
  }

  const { data, error } = await supabase
    .from('registrations')
    .insert(insertData)
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
  updates: Partial<Pick<Registration, 'full_name' | 'email' | 'phone_number' | 'format' | 'time_slot' | 'partner_name' | 'partner_phone'>>,
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
  if (updates.time_slot !== undefined) updateData.time_slot = updates.time_slot
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
    pending: registrations.filter((r) => r.status === 'Pending' || r.status === 'Pending Verification').length,
    approved: registrations.filter((r) => r.status === 'Approved').length,
    rejected: registrations.filter((r) => r.status === 'Rejected').length,
  }
}

export async function getPaymentMetrics(eventId: string): Promise<{
  pending_verification: number
  verified: number
  rejected: number
  total: number
}> {
  const registrations = await getRegistrationsByEventId(eventId)
  return {
    pending_verification: registrations.filter((r) => r.payment_status === 'pending_verification').length,
    verified: registrations.filter((r) => r.payment_status === 'verified').length,
    rejected: registrations.filter((r) => r.payment_status === 'rejected').length,
    total: registrations.filter((r) => r.payment_status !== null).length,
  }
}

export async function verifyPayment(id: string, adminId: string): Promise<Registration> {
  const supabase = await getSupabaseServerClient()
  const existing = await getRegistrationById(id)
  if (!existing) throw new Error('Registration not found')
  if (existing.payment_status !== 'pending_verification') {
    throw new Error('Payment is not pending verification')
  }

  const updateData: Record<string, unknown> = {
    payment_status: 'verified',
    payment_verified_by: adminId,
    payment_verified_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    action: 'payment_verified',
    changedBy: adminId,
    previousData: existing as unknown as Record<string, unknown>,
    nextData: data as unknown as Record<string, unknown>,
    notes: null,
  })

  return data
}

export async function checkInRegistration(id: string, adminId: string): Promise<Registration> {
  const supabase = await getSupabaseServerClient()
  const existing = await getRegistrationById(id)
  if (!existing) throw new Error('Registration not found')
  if (existing.checked_in) throw new Error('Already checked in')
  if (existing.status !== 'Approved') throw new Error('Only approved registrations can be checked in')

  const updateData: Record<string, unknown> = {
    checked_in: true,
    checked_in_at: new Date().toISOString(),
    checked_in_by: adminId,
    updated_at: new Date().toISOString(),
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
    action: 'checked_in',
    changedBy: adminId,
    previousData: existing as unknown as Record<string, unknown>,
    nextData: data as unknown as Record<string, unknown>,
    notes: null,
  })

  return data
}

export async function undoCheckInRegistration(id: string, adminId: string): Promise<Registration> {
  const supabase = await getSupabaseServerClient()
  const existing = await getRegistrationById(id)
  if (!existing) throw new Error('Registration not found')
  if (!existing.checked_in) throw new Error('Not checked in')

  const updateData: Record<string, unknown> = {
    checked_in: false,
    checked_in_at: null,
    checked_in_by: null,
    updated_at: new Date().toISOString(),
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
    action: 'checked_in_undone',
    changedBy: adminId,
    previousData: existing as unknown as Record<string, unknown>,
    nextData: data as unknown as Record<string, unknown>,
    notes: null,
  })

  return data
}

export async function getAttendanceMetrics(eventId: string): Promise<{
  total_approved: number
  checked_in: number
  not_checked_in: number
  attendance_rate: number
}> {
  const registrations = await getRegistrationsByEventId(eventId)
  const approved = registrations.filter((r) => r.status === 'Approved')
  const checkedIn = approved.filter((r) => r.checked_in)
  return {
    total_approved: approved.length,
    checked_in: checkedIn.length,
    not_checked_in: approved.length - checkedIn.length,
    attendance_rate: approved.length > 0 ? checkedIn.length / approved.length : 0,
  }
}

export async function rejectPayment(id: string, adminId: string, reason?: string | null): Promise<Registration> {
  const supabase = await getSupabaseServerClient()
  const existing = await getRegistrationById(id)
  if (!existing) throw new Error('Registration not found')
  if (existing.payment_status !== 'pending_verification') {
    throw new Error('Payment is not pending verification')
  }

  const updateData: Record<string, unknown> = {
    payment_status: 'rejected',
    payment_rejected_by: adminId,
    payment_rejected_at: new Date().toISOString(),
    payment_rejection_reason: reason || null,
    updated_at: new Date().toISOString(),
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
    action: 'payment_rejected',
    changedBy: adminId,
    previousData: existing as unknown as Record<string, unknown>,
    nextData: data as unknown as Record<string, unknown>,
    notes: reason || null,
  })

  return data
}
