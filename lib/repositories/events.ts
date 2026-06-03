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

  // TODO: After running migration.sql, re-add: category, capacity, rally_points,
  //       image_url, date_label, time_label, is_date_confirmed, updated_at
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      name: eventData.name,
      slug: eventData.slug,
      description: eventData.description || null,
      venue: eventData.venue || null,
      event_date: eventData.event_date || null,
      registration_fee: eventData.registration_fee || null,
      payment_info: eventData.payment_info || null,
      poster_url: eventData.poster_url || null,
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

  // TODO: After running migration.sql, re-add: category, capacity, rally_points,
  //       image_url, date_label, time_label, is_date_confirmed, updated_at
  const updatePayload: Record<string, unknown> = {}
  if (eventData.name !== undefined) updatePayload.name = eventData.name
  if (eventData.slug !== undefined) updatePayload.slug = eventData.slug
  if (eventData.description !== undefined) updatePayload.description = eventData.description
  if (eventData.venue !== undefined) updatePayload.venue = eventData.venue
  if (eventData.event_date !== undefined) updatePayload.event_date = eventData.event_date
  if (eventData.registration_fee !== undefined) updatePayload.registration_fee = eventData.registration_fee
  if (eventData.payment_info !== undefined) updatePayload.payment_info = eventData.payment_info
  if (eventData.poster_url !== undefined) updatePayload.poster_url = eventData.poster_url
  if (eventData.status !== undefined) updatePayload.status = eventData.status

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
  // TODO: Re-add updated_at after running migration.sql
  const { error } = await supabase
    .from('events')
    .update({ status: 'published' })
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
