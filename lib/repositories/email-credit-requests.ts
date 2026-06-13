import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { EmailCreditRequest } from '@/lib/types/supabase'

export async function createEmailCreditRequest(params: {
  event_id: string
  event_admin_id: string
  package_type: '50' | '100'
  email_credits: number
  amount: number
  transaction_name: string
  transaction_reference: string
  payment_screenshot_url?: string | null
}): Promise<EmailCreditRequest> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_credit_requests')
    .insert({
      event_id: params.event_id,
      event_admin_id: params.event_admin_id,
      package_type: params.package_type,
      email_credits: params.email_credits,
      amount: params.amount,
      transaction_name: params.transaction_name,
      transaction_reference: params.transaction_reference,
      payment_screenshot_url: params.payment_screenshot_url || null,
      status: 'Pending',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getCreditRequestsByEvent(eventId: string): Promise<EmailCreditRequest[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_credit_requests')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getCreditRequestsByAdmin(adminId: string): Promise<EmailCreditRequest[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_credit_requests')
    .select('*')
    .eq('event_admin_id', adminId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAllCreditRequests(): Promise<(EmailCreditRequest & { event_name?: string; admin_name?: string })[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_credit_requests')
    .select('*, events(name), event_admins(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    ...r,
    event_name: r.events?.name,
    admin_name: r.event_admins?.name,
  }))
}

export async function getCreditRequestById(id: string): Promise<EmailCreditRequest | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_credit_requests')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function approveCreditRequest(
  id: string,
  approvedBy: string
): Promise<EmailCreditRequest> {
  const supabase = await getSupabaseServerClient()

  const req = await getCreditRequestById(id)
  if (!req) throw new Error('Request not found')
  if (req.status !== 'Pending') throw new Error('Request already processed')

  // Credits FIRST, status SECOND:
  // If credit addition fails, request stays Pending and can be retried
  const { data: event } = await supabase
    .from('events')
    .select('additional_email_credits')
    .eq('id', req.event_id)
    .single()
  const current = event?.additional_email_credits ?? 0
  const { error: creditError } = await supabase
    .from('events')
    .update({ additional_email_credits: current + req.email_credits })
    .eq('id', req.event_id)
  if (creditError) throw new Error('Failed to add credits')

  // Atomic status update — only succeeds if still Pending
  const { data, error } = await supabase
    .from('email_credit_requests')
    .update({
      status: 'Approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'Pending')
    .select()
    .single()

  if (error) {
    // Attempt rollback of credits — best-effort
    await supabase.from('events').update({ additional_email_credits: current }).eq('id', req.event_id)
    if (error.code === 'PGRST116') throw new Error('Request already processed')
    throw error
  }

  return data
}

export async function rejectCreditRequest(
  id: string,
  approvedBy: string,
  notes?: string | null
): Promise<EmailCreditRequest> {
  const supabase = await getSupabaseServerClient()

  const req = await getCreditRequestById(id)
  if (!req) throw new Error('Request not found')
  if (req.status !== 'Pending') throw new Error('Request already processed')

  const { data, error } = await supabase
    .from('email_credit_requests')
    .update({
      status: 'Rejected',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      admin_notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'Pending')
    .select()
    .single()
  if (error) {
    if (error.code === 'PGRST116') throw new Error('Request already processed')
    throw error
  }
  return data
}

export async function getSystemConfig() {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('system_config')
    .select('*')
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function updateSystemConfig(params: { upi_id?: string; account_holder_name?: string; qr_code_url?: string | null; payment_instructions?: string | null }) {
  const supabase = await getSupabaseServerClient()
  const existing = await getSystemConfig()
  if (!existing) {
    const { data, error } = await supabase
      .from('system_config')
      .insert({ upi_id: params.upi_id || '', account_holder_name: params.account_holder_name || '', qr_code_url: params.qr_code_url || null, payment_instructions: params.payment_instructions || null })
      .select()
      .single()
    if (error) throw error
    return data
  }
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (params.upi_id !== undefined) updateData.upi_id = params.upi_id
  if (params.account_holder_name !== undefined) updateData.account_holder_name = params.account_holder_name
  if (params.qr_code_url !== undefined) updateData.qr_code_url = params.qr_code_url
  if (params.payment_instructions !== undefined) updateData.payment_instructions = params.payment_instructions
  const { data, error } = await supabase
    .from('system_config')
    .update(updateData)
    .eq('id', existing.id)
    .select()
    .single()
  if (error) throw error
  return data
}
