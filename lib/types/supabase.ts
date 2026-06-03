// ── Event Status ──
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

// ── Event Category ──
export type EventCategory = 'badminton' | 'trek' | 'marathon' | 'cycling'

// ── Event (matches + extends events table) ──
export interface Event {
  id: string
  name: string
  slug: string
  description: string | null
  category: EventCategory | null
  venue: string | null
  event_date: string | null
  date_label: string | null
  time_label: string | null
  is_date_confirmed: boolean | null
  registration_fee: number | null
  payment_info: string | null
  capacity: number | null
  rally_points: number | null
  poster_url: string | null
  image_url: string | null
  status: EventStatus
  created_at: string
  updated_at: string | null
}

// ── Event Format (from event_formats table) ──
export interface EventFormat {
  id: string
  event_id: string | null
  format_name: string
  created_at: string
}

// ── Event Admin (from event_admins table) ──
export interface EventAdmin {
  id: string
  event_id: string | null
  name: string
  email: string
  created_at: string
}

// ── Composite: Event with its formats ──
export interface EventWithFormats extends Event {
  formats: EventFormat[]
}

// ── Form data for creating/editing events ──
export interface EventFormData {
  name: string
  slug: string
  description: string
  category: EventCategory | ''
  venue: string
  event_date: string
  date_label: string
  time_label: string
  is_date_confirmed: boolean
  registration_fee: number
  payment_info: string
  capacity: number
  rally_points: number
  status: EventStatus
  formats: string[]
}

// ── Admin metrics ──
export interface AdminEventMetrics {
  total: number
  published: number
  draft: number
  cancelled: number
  completed: number
}
