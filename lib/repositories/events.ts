import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Event, EventFormat, EventWithFormats, EventFormData, AdminEventMetrics, EventWithPaymentConfig, EventPaymentConfig } from '@/lib/types/supabase'
import { seedEventDefaults } from '@/lib/seed-defaults'
import { CURRENT_EVENT } from '@/lib/config'

function getFallbackEvent(): EventWithFormats {
  const eventId = 'fallback-event-id'
  return {
    id: eventId,
    name: CURRENT_EVENT.name,
    slug: CURRENT_EVENT.slug,
    description: CURRENT_EVENT.description,
    category: 'badminton',
    venue: CURRENT_EVENT.venue,
    event_date: CURRENT_EVENT.startISO,
    date_label: CURRENT_EVENT.date,
    time_label: CURRENT_EVENT.time,
    is_date_confirmed: CURRENT_EVENT.isDateConfirmed,
    registration_fee: CURRENT_EVENT.registrationFee,
    payment_info: '',
    capacity: 100,
    rally_points: 10,
    poster_url: null,
    image_url: null,
    whatsapp_number: '',
    whatsapp_group_link: '',
    featured: false,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    formats: CURRENT_EVENT.categories.map((name, i) => ({
      id: `fallback-format-${i}`,
      event_id: eventId,
      format_name: name,
      created_at: new Date().toISOString(),
    })),
  }
}

// ─── Public (read) ─────────────────────────────────────────────

export async function getAllPublishedEvents(): Promise<EventWithFormats[]> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*, formats:event_formats(*)')
      .eq('status', 'published')
      .order('featured', { ascending: false, nullsFirst: false })
      .order('event_date', { ascending: true })
    if (error) throw error
    
    if (data && data.length > 0) {
      return data.map(attachFormats)
    }
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Dynamic server usage') || (error as any).digest === 'DYNAMIC_SERVER_USAGE' || error.message.includes('cookies'))) {
      throw error
    }
    console.error('Error fetching all published events from database:', error)
  }
  return [getFallbackEvent()]
}

export async function getEventBySlug(slug: string): Promise<EventWithFormats | null> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*, formats:event_formats(*)')
      .eq('slug', slug)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    if (data) return attachFormats(data)
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Dynamic server usage') || (error as any).digest === 'DYNAMIC_SERVER_USAGE' || error.message.includes('cookies'))) {
      throw error
    }
    console.error(`Error fetching event by slug ${slug} from database:`, error)
  }
  if (slug === CURRENT_EVENT.slug) {
    return getFallbackEvent()
  }
  return null
}

export async function getFirstPublishedEvent(): Promise<EventWithFormats | null> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*, formats:event_formats(*)')
      .eq('status', 'published')
      .order('event_date', { ascending: true })
      .limit(1)
    if (error) throw error
    if (data && data.length > 0) {
      return attachFormats(data[0])
    }
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Dynamic server usage') || (error as any).digest === 'DYNAMIC_SERVER_USAGE' || error.message.includes('cookies'))) {
      throw error
    }
    console.error('Error fetching first published event from database:', error)
  }
  return getFallbackEvent()
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
      whatsapp_number: eventData.whatsapp_number || null,
      whatsapp_group_link: eventData.whatsapp_group_link || null,
      featured: (eventData as { featured?: boolean }).featured ?? false,
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

  // Seed default email settings and templates
  await seedEventDefaults(event.id)

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
  if (eventData.whatsapp_number !== undefined) updatePayload.whatsapp_number = eventData.whatsapp_number
  if (eventData.whatsapp_group_link !== undefined) updatePayload.whatsapp_group_link = eventData.whatsapp_group_link
  if ((eventData as { featured?: boolean }).featured !== undefined) updatePayload.featured = (eventData as { featured?: boolean }).featured ?? false
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

  const { error: regError } = await supabase
    .from('registrations')
    .delete()
    .eq('event_id', id)
  if (regError) throw regError

  const { error: pcError } = await supabase
    .from('event_payment_config')
    .delete()
    .eq('event_id', id)
  if (pcError) throw pcError

  const { error: admError } = await supabase
    .from('event_admins')
    .delete()
    .eq('event_id', id)
  if (admError) throw admError

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

// ─── Phase 2: Events with payment config ─────────────────────

export async function getEventWithPaymentConfig(slug: string): Promise<EventWithPaymentConfig | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, formats:event_formats(*), payment_config:event_payment_config(*)')
    .eq('slug', slug)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  if (!data) return null
  const rec = data as Record<string, unknown>
  const pcArray = rec.payment_config as Array<Record<string, unknown>> | undefined
  return {
    ...(rec as unknown as Event),
    formats: (rec.formats as EventFormat[]) ?? [],
    payment_config: (pcArray?.[0] as unknown as EventPaymentConfig) || null,
  } as EventWithPaymentConfig
}

export async function getAllPublishedEventsWithPaymentConfig(): Promise<EventWithPaymentConfig[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, formats:event_formats(*), payment_config:event_payment_config(*)')
    .eq('status', 'published')
    .order('event_date', { ascending: true })
  if (error) throw error
  return (data ?? []).map((row) => {
    const rec = row as Record<string, unknown>
    const pcArray = rec.payment_config as Array<Record<string, unknown>> | undefined
    return {
      ...(rec as unknown as Event),
      formats: (rec.formats as EventFormat[]) ?? [],
      payment_config: (pcArray?.[0] as unknown as EventPaymentConfig) || null,
    } as EventWithPaymentConfig
  })
}

export async function getEventById(id: string): Promise<EventWithFormats | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, formats:event_formats(*)')
    .eq('id', id)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? attachFormats(data) : null
}

// ─── Helpers ──────────────────────────────────────────────────

function attachFormats(row: Record<string, unknown>): EventWithFormats {
  const { formats, ...event } = row
  return {
    ...(event as unknown as Event),
    formats: (formats as EventFormat[]) ?? [],
  }
}
