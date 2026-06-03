import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Event, EventFormat, EventWithFormats, EventFormData, AdminEventMetrics } from '@/lib/types/supabase'

// ─── Public (read) ─────────────────────────────────────────────

export async function getAllPublishedEvents(): Promise<EventWithFormats[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, formats:event_formats(*)')
    .eq('status', 'published')
    .order('event_date', { ascending: true })
  if (error) throw error
  return (data ?? []).map(attachFormats)
}

export async function getEventBySlug(slug: string): Promise<EventWithFormats | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, formats:event_formats(*)')
    .eq('slug', slug)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? attachFormats(data) : null
}

export async function getFirstPublishedEvent(): Promise<EventWithFormats | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, formats:event_formats(*)')
    .eq('status', 'published')
    .order('event_date', { ascending: true })
    .limit(1)
  if (error) throw error
  return data && data.length > 0 ? attachFormats(data[0]) : null
}

// ─── Admin (CRUD) ──────────────────────────────────────────────

export async function getAllEvents(): Promise<EventWithFormats[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, formats:event_formats(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(attachFormats)
}

export async function createEvent(formData: EventFormData): Promise<EventWithFormats> {
  const supabase = await getSupabaseServerClient()

  const { formats, ...eventData } = formData

  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      name: eventData.name,
      slug: eventData.slug,
      description: eventData.description || null,
      category: eventData.category || 'badminton',
      venue: eventData.venue || null,
      event_date: eventData.event_date || null,
      date_label: eventData.date_label || null,
      time_label: eventData.time_label || null,
      is_date_confirmed: eventData.is_date_confirmed ?? true,
      registration_fee: eventData.registration_fee || null,
      payment_info: eventData.payment_info || null,
      capacity: eventData.capacity || null,
      rally_points: eventData.rally_points || 0,
      poster_url: eventData.poster_url || null,
      image_url: eventData.image_url || null,
      status: eventData.status || 'draft',
    })
    .select()
    .single()

  if (eventError) throw eventError

  // Insert formats
  if (formats && formats.length > 0) {
    const formatRows = formats.map((name) => ({
      event_id: event.id,
      format_name: name,
    }))
    const { error: fmtError } = await supabase
      .from('event_formats')
      .insert(formatRows)
    if (fmtError) throw fmtError
  }

  return getEventBySlug(event.slug) as Promise<EventWithFormats>
}

export async function updateEvent(id: string, formData: Partial<EventFormData>): Promise<EventWithFormats> {
  const supabase = await getSupabaseServerClient()

  const { formats, ...eventData } = formData

  const updatePayload: Record<string, unknown> = {}
  if (eventData.name !== undefined) updatePayload.name = eventData.name
  if (eventData.slug !== undefined) updatePayload.slug = eventData.slug
  if (eventData.description !== undefined) updatePayload.description = eventData.description
  if (eventData.category !== undefined) updatePayload.category = eventData.category || 'badminton'
  if (eventData.venue !== undefined) updatePayload.venue = eventData.venue
  if (eventData.event_date !== undefined) updatePayload.event_date = eventData.event_date
  if (eventData.date_label !== undefined) updatePayload.date_label = eventData.date_label
  if (eventData.time_label !== undefined) updatePayload.time_label = eventData.time_label
  if (eventData.is_date_confirmed !== undefined) updatePayload.is_date_confirmed = eventData.is_date_confirmed
  if (eventData.registration_fee !== undefined) updatePayload.registration_fee = eventData.registration_fee
  if (eventData.payment_info !== undefined) updatePayload.payment_info = eventData.payment_info
  if (eventData.capacity !== undefined) updatePayload.capacity = eventData.capacity
  if (eventData.rally_points !== undefined) updatePayload.rally_points = eventData.rally_points
  if (eventData.poster_url !== undefined) updatePayload.poster_url = eventData.poster_url
  if (eventData.image_url !== undefined) updatePayload.image_url = eventData.image_url
  if (eventData.status !== undefined) updatePayload.status = eventData.status
  updatePayload.updated_at = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('events')
    .update(updatePayload)
    .eq('id', id)

  if (updateError) throw updateError

  // Update formats if provided
  if (formats !== undefined) {
    // Delete existing formats
    const { error: delError } = await supabase
      .from('event_formats')
      .delete()
      .eq('event_id', id)
    if (delError) throw delError

    // Insert new formats
    if (formats.length > 0) {
      const formatRows = formats.map((name) => ({
        event_id: id,
        format_name: name,
      }))
      const { error: insError } = await supabase
        .from('event_formats')
        .insert(formatRows)
      if (insError) throw insError
    }
  }

  const updated = await getEventBySlug(
    (await supabase.from('events').select('slug').eq('id', id).single()).data?.slug ?? ''
  )
  return updated!
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient()

  // Delete formats first (FK constraint)
  const { error: fmtError } = await supabase
    .from('event_formats')
    .delete()
    .eq('event_id', id)
  if (fmtError) throw fmtError

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function publishEvent(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase
    .from('events')
    .update({ status: 'published', updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function getAdminEventMetrics(): Promise<AdminEventMetrics> {
  const events = await getAllEvents()
  return {
    total: events.length,
    published: events.filter((e) => e.status === 'published').length,
    draft: events.filter((e) => e.status === 'draft').length,
    cancelled: events.filter((e) => e.status === 'cancelled').length,
    completed: events.filter((e) => e.status === 'completed').length,
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function attachFormats(row: Record<string, unknown>): EventWithFormats {
  const { formats, ...event } = row
  return {
    ...(event as unknown as Event),
    formats: (formats as EventFormat[]) ?? [],
  }
}
