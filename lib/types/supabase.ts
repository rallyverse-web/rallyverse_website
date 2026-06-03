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
  whatsapp_number: string | null
  whatsapp_group_link: string | null
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
  created_by: string | null
  created_at: string
  updated_at: string | null
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
  whatsapp_number: string
  whatsapp_group_link: string
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

// ══════════════════════════════════════════════════════════════
// PHASE 2: Registration, Payment & Event Admin
// ══════════════════════════════════════════════════════════════

// ── Registration Status ──
export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected'

// ── Registration ──
export interface Registration {
  id: string
  event_id: string
  registration_id: string
  full_name: string
  phone_number: string
  email: string
  city: string
  gender: string
  format: string
  partner_name: string | null
  partner_phone: string | null
  status: RegistrationStatus
  notes: string | null
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string | null
}

// ── Registration form data ──
export interface RegistrationFormData {
  event_id: string
  full_name: string
  phone_number: string
  email: string
  city: string
  gender: string
  format: string
  partner_name: string
  partner_phone: string
}

// ── Event Payment Config ──
export interface EventPaymentConfig {
  id: string
  event_id: string
  upi_id: string
  account_holder_name: string
  mobile_number: string
  whatsapp_number: string
  created_at: string
  updated_at: string | null
}

// ── Event Payment Config form ──
export interface EventPaymentConfigFormData {
  upi_id: string
  account_holder_name: string
  mobile_number: string
  whatsapp_number: string
}

// ── Event Admin (enhanced) ──
export interface EventAdminWithToken extends EventAdmin {
  access_token: string | null
  created_by: string | null
}

// ── Event Admin form ──
export interface EventAdminFormData {
  name: string
  email: string
}

// ── Admin approval action ──
export interface ApprovalAction {
  registration_id?: string
  status: 'Approved' | 'Rejected'
  notes?: string
}

// ── Event with payment config ──
export interface EventWithPaymentConfig extends EventWithFormats {
  payment_config: EventPaymentConfig | null
}

// ══════════════════════════════════════════════════════════════
// PHASE 3A: Communication Infrastructure
// ══════════════════════════════════════════════════════════════

// ── Email Template Types ──
export type EmailTemplateType = 'approval' | 'rejection' | 'reminder' | 'results' | 'broadcast'

// ── Event Email Settings ──
export interface EventEmailSettings {
  id: string
  event_id: string
  sender_name: string
  reply_to_email: string
  support_email: string
  created_at: string
  updated_at: string | null
}

// ── Event Email Settings form ──
export interface EventEmailSettingsFormData {
  sender_name: string
  reply_to_email: string
  support_email: string
}

// ── Email Template ──
export interface EmailTemplate {
  id: string
  event_id: string
  template_type: EmailTemplateType
  subject: string
  content: string
  created_by: string | null
  created_at: string
  updated_at: string | null
}

// ── Email Template form ──
export interface EmailTemplateFormData {
  template_type: EmailTemplateType
  subject: string
  content: string
}

// ── Email Log ──
export interface EmailLog {
  id: string
  event_id: string
  template_id: string | null
  recipient_email: string
  subject: string
  sent_by: string | null
  status: 'sent' | 'failed'
  provider_message_id: string
  created_at: string
}

// ── Template Variables ──
export interface TemplateVariables {
  participant_name: string
  event_name: string
  event_date: string
  event_venue: string
  format: string
  registration_status: string
  support_email: string
  whatsapp_number: string
  event_whatsapp: string
  event_whatsapp_group: string
  [key: string]: string
}
