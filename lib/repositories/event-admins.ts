import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { EventAdmin, EventAdminFormData } from '@/lib/types/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function getEventAdmins(eventId: string): Promise<EventAdmin[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_admins')
    .select('id, event_id, name, email, created_by, created_at, updated_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as EventAdmin[]
}

export async function createEventAdmin(eventId: string, formData: EventAdminFormData): Promise<{ admin: EventAdmin; access_token: string }> {
  const supabase = await getSupabaseServerClient()
  const token = uuidv4()
  const { data, error } = await supabase
    .from('event_admins')
    .insert({
      event_id: eventId,
      name: formData.name,
      email: formData.email,
      access_token: token,
    })
    .select('id, event_id, name, email, created_by, created_at, updated_at')
    .single()
  if (error) throw error
  return { admin: data as EventAdmin, access_token: token }
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
    .select('id, event_id, name, email, created_by, created_at, updated_at')
    .eq('access_token', token)
    .maybeSingle()
  if (error) throw error
  return data as (EventAdmin & { event_id: string }) | null
}

export async function getAllEventAdminsForFounder(): Promise<EventAdmin[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('event_admins')
    .select('id, event_id, name, email, created_by, created_at, updated_at, events(name, slug)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as EventAdmin[]
}
