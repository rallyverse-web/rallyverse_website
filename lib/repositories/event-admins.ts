import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { EventAdmin, EventAdminFormData, EventAdminStatus } from '@/lib/types/supabase'
import { v4 as uuidv4 } from 'uuid'

const eventAdminSelect = 'id, event_id, name, email, created_by, created_at, updated_at, status, last_login_at'
const eventAdminSelectWithEvent = 'id, event_id, name, email, created_by, created_at, updated_at, status, last_login_at, events(name, slug)'

export async function getEventAdmins(eventId: string): Promise<EventAdmin[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_admins')
    .select(eventAdminSelect)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as EventAdmin[]
}

export async function getEventAdminByEmail(email: string): Promise<EventAdmin | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_admins')
    .select(eventAdminSelect)
    .eq('email', email)
    .maybeSingle()
  if (error) throw error
  return data as EventAdmin | null
}

export async function createEventAdmin(eventId: string, formData: EventAdminFormData, authUserId?: string): Promise<EventAdmin> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_admins')
    .insert({
      event_id: eventId,
      name: formData.name,
      email: formData.email,
      auth_user_id: authUserId ?? null,
      access_token: uuidv4(),
      status: 'pending',
    })
    .select(eventAdminSelect)
    .single()
  if (error) throw error
  return data as EventAdmin
}

export async function getEventAdminById(adminId: string): Promise<(EventAdmin & { access_token: string; event_id: string }) | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_admins')
    .select('*')
    .eq('id', adminId)
    .maybeSingle()
  if (error) throw error
  return data as (EventAdmin & { access_token: string; event_id: string }) | null
}

export async function updateEventAdminStatus(adminId: string, status: EventAdminStatus): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase
    .from('event_admins')
    .update({ status })
    .eq('id', adminId)
  if (error) throw error
}

export async function updateLastLoginAt(adminId: string): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase
    .from('event_admins')
    .update({ last_login_at: new Date().toISOString(), status: 'active' })
    .eq('id', adminId)
  if (error) throw error
}

export async function isEventAdminDisabled(adminId: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('event_admins')
    .select('status')
    .eq('id', adminId)
    .maybeSingle()
  return data?.status === 'disabled'
}

export async function regenerateEventAdminToken(adminId: string): Promise<string> {
  const supabase = await getSupabaseServerClient()
  const token = uuidv4()
  const { error } = await supabase
    .from('event_admins')
    .update({ access_token: token })
    .eq('id', adminId)
  if (error) throw error
  return token
}

export async function removeEventAdmin(adminId: string): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase
    .from('event_admins')
    .delete()
    .eq('id', adminId)
  if (error) throw error
}

export async function getEventAdminByToken(token: string): Promise<(EventAdmin & { event_id: string }) | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_admins')
    .select(eventAdminSelect)
    .eq('access_token', token)
    .maybeSingle()
  if (error) throw error
  return data as (EventAdmin & { event_id: string }) | null
}

export async function getAllEventAdminsForFounder(): Promise<EventAdmin[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_admins')
    .select(eventAdminSelectWithEvent)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as EventAdmin[]
}
