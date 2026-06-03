import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Registration, EmailLog } from '@/lib/types/supabase'

export interface PlatformOverview {
  total_events: number
  total_registrations: number
  approved_registrations: number
  pending_registrations: number
  rejected_registrations: number
  emails_sent: number
  emails_failed: number
  whatsapp_contact_clicks: number
  whatsapp_group_clicks: number
}

export interface EventAnalytics {
  event_id: string
  event_name: string
  event_slug: string
  event_date: string | null
  views: number
  registration_page_views: number
  registrations: number
  approved: number
  pending: number
  rejected: number
  conversion_rate: number
  approval_rate: number
  whatsapp_contact_clicks: number
  whatsapp_group_clicks: number
  emails_sent: number
  emails_failed: number
}

export interface TrendPoint {
  date: string
  count: number
}

export interface TrendData {
  registrations_over_time: TrendPoint[]
  approvals_over_time: TrendPoint[]
  emails_over_time: TrendPoint[]
  views_over_time: TrendPoint[]
}

export async function getPlatformOverview(): Promise<PlatformOverview> {
  const supabase = await getSupabaseServerClient()

  const [eventsRes, registrationsRes, emailLogsRes, waContactRes, waGroupRes] = await Promise.all([
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('registrations').select('status'),
    supabase.from('email_logs').select('status'),
    supabase.from('whatsapp_clicks').select('id', { count: 'exact', head: true }).eq('click_type', 'contact'),
    supabase.from('whatsapp_clicks').select('id', { count: 'exact', head: true }).eq('click_type', 'group'),
  ])

  const registrations = (registrationsRes.data ?? []) as Pick<Registration, 'status'>[]
  const emailLogs = (emailLogsRes.data ?? []) as Pick<EmailLog, 'status'>[]

  return {
    total_events: eventsRes.count ?? 0,
    total_registrations: registrations.length,
    approved_registrations: registrations.filter(r => r.status === 'Approved').length,
    pending_registrations: registrations.filter(r => r.status === 'Pending').length,
    rejected_registrations: registrations.filter(r => r.status === 'Rejected').length,
    emails_sent: emailLogs.filter(l => l.status === 'sent').length,
    emails_failed: emailLogs.filter(l => l.status === 'failed').length,
    whatsapp_contact_clicks: waContactRes.count ?? 0,
    whatsapp_group_clicks: waGroupRes.count ?? 0,
  }
}

export async function getAllEventAnalytics(): Promise<EventAnalytics[]> {
  const supabase = await getSupabaseServerClient()

  const { data: events } = await supabase.from('events').select('id, name, slug, event_date, status').eq('status', 'published').order('created_at', { ascending: false })
  if (!events) return []

  const eventIds = events.map(e => e.id)

  const [registrationsRes, pageViewsRes, waClicksRes, emailLogsRes] = await Promise.all([
    supabase.from('registrations').select('event_id, status').in('event_id', eventIds),
    supabase.from('page_views').select('event_id, page_type').in('event_id', eventIds),
    supabase.from('whatsapp_clicks').select('event_id, click_type').in('event_id', eventIds),
    supabase.from('email_logs').select('event_id, status').in('event_id', eventIds),
  ])

  const regs = (registrationsRes.data ?? []) as { event_id: string; status: string }[]
  const views = (pageViewsRes.data ?? []) as { event_id: string; page_type: string }[]
  const wa = (waClicksRes.data ?? []) as { event_id: string; click_type: string }[]
  const emails = (emailLogsRes.data ?? []) as { event_id: string; status: string }[]

  return events.map(event => {
    const eventRegs = regs.filter(r => r.event_id === event.id)
    const eventViews = views.filter(v => v.event_id === event.id)
    const eventWa = wa.filter(w => w.event_id === event.id)
    const eventEmails = emails.filter(e => e.event_id === event.id)

    const totalRegs = eventRegs.length
    const approved = eventRegs.filter(r => r.status === 'Approved').length
    const pending = eventRegs.filter(r => r.status === 'Pending').length
    const rejected = eventRegs.filter(r => r.status === 'Rejected').length

    const eventDetailViews = eventViews.filter(v => v.page_type === 'event_detail').length
    const regPageViews = eventViews.filter(v => v.page_type === 'registration').length

    return {
      event_id: event.id,
      event_name: event.name,
      event_slug: event.slug,
      event_date: event.event_date,
      views: eventDetailViews,
      registration_page_views: regPageViews,
      registrations: totalRegs,
      approved,
      pending,
      rejected,
      conversion_rate: eventDetailViews > 0 ? Math.round((totalRegs / eventDetailViews) * 100) : 0,
      approval_rate: totalRegs > 0 ? Math.round((approved / totalRegs) * 100) : 0,
      whatsapp_contact_clicks: eventWa.filter(w => w.click_type === 'contact').length,
      whatsapp_group_clicks: eventWa.filter(w => w.click_type === 'group').length,
      emails_sent: eventEmails.filter(e => e.status === 'sent').length,
      emails_failed: eventEmails.filter(e => e.status === 'failed').length,
    }
  })
}

export async function getEventAnalytics(eventId: string): Promise<EventAnalytics | null> {
  const supabase = await getSupabaseServerClient()

  const { data: event } = await supabase.from('events').select('id, name, slug, event_date').eq('id', eventId).single()
  if (!event) return null

  const [regsRes, viewsRes, waRes, emailsRes] = await Promise.all([
    supabase.from('registrations').select('status').eq('event_id', eventId),
    supabase.from('page_views').select('page_type').eq('event_id', eventId),
    supabase.from('whatsapp_clicks').select('click_type').eq('event_id', eventId),
    supabase.from('email_logs').select('status').eq('event_id', eventId),
  ])

  const regs = (regsRes.data ?? []) as { status: string }[]
  const pageViews = (viewsRes.data ?? []) as { page_type: string }[]
  const wa = (waRes.data ?? []) as { click_type: string }[]
  const emails = (emailsRes.data ?? []) as { status: string }[]

  const totalRegs = regs.length
  const approved = regs.filter(r => r.status === 'Approved').length
  const pending = regs.filter(r => r.status === 'Pending').length
  const rejected = regs.filter(r => r.status === 'Rejected').length
  const eventDetailViews = pageViews.filter(v => v.page_type === 'event_detail').length
  const regPageViews = pageViews.filter(v => v.page_type === 'registration').length

  return {
    event_id: event.id,
    event_name: event.name,
    event_slug: event.slug,
    event_date: event.event_date,
    views: eventDetailViews,
    registration_page_views: regPageViews,
    registrations: totalRegs,
    approved,
    pending,
    rejected,
    conversion_rate: eventDetailViews > 0 ? Math.round((totalRegs / eventDetailViews) * 100) : 0,
    approval_rate: totalRegs > 0 ? Math.round((approved / totalRegs) * 100) : 0,
    whatsapp_contact_clicks: wa.filter(w => w.click_type === 'contact').length,
    whatsapp_group_clicks: wa.filter(w => w.click_type === 'group').length,
    emails_sent: emails.filter(e => e.status === 'sent').length,
    emails_failed: emails.filter(e => e.status === 'failed').length,
  }
}

export async function getTrendData(eventId?: string): Promise<TrendData> {
  const supabase = await getSupabaseServerClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const baseReg = supabase.from('registrations').select('status, created_at').gte('created_at', thirtyDaysAgo.toISOString())
  const baseEmail = supabase.from('email_logs').select('status, created_at').gte('created_at', thirtyDaysAgo.toISOString())
  const baseViews = supabase.from('page_views').select('page_type, viewed_at').gte('viewed_at', thirtyDaysAgo.toISOString())

  if (eventId) {
    baseReg.eq('event_id', eventId)
    baseEmail.eq('event_id', eventId)
    baseViews.eq('event_id', eventId)
  }

  const [regsRes, emailsRes, viewsRes] = await Promise.all([
    baseReg,
    baseEmail,
    baseViews,
  ])

  const regs = (regsRes.data ?? []) as { status: string; created_at: string }[]
  const emails = (emailsRes.data ?? []) as { status: string; created_at: string }[]
  const views = (viewsRes.data ?? []) as { page_type: string; viewed_at: string }[]

  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }

  const bucketByDate = <T extends { created_at?: string; viewed_at?: string }>(items: T[], dateField: 'created_at' | 'viewed_at'): TrendPoint[] => {
    const map = new Map<string, number>()
    for (const day of days) map.set(day, 0)
    for (const item of items) {
      const key = (item[dateField] ?? '').slice(0, 10)
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1)
    }
    return days.map(date => ({ date, count: map.get(date) ?? 0 }))
  }

  return {
    registrations_over_time: bucketByDate(regs, 'created_at'),
    approvals_over_time: bucketByDate(regs.filter(r => r.status === 'Approved'), 'created_at'),
    emails_over_time: bucketByDate(emails, 'created_at'),
    views_over_time: bucketByDate(views, 'viewed_at'),
  }
}
