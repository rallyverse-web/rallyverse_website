// ── Event Status ──
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

// ── Event Category ──
export type EventCategory = 'badminton' | 'pickleball' | 'football' | 'basketball' | 'running' | 'cycling' | 'other'

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
  payment_enabled: boolean | null
  poster_url: string | null
  image_url: string | null
  whatsapp_number: string | null
  whatsapp_group_link: string | null
  featured: boolean | null
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
  payment_enabled: boolean
  capacity: number
  rally_points: number
  poster_url?: string
  whatsapp_number: string
  whatsapp_group_link: string
  featured: boolean
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
export type RegistrationStatus = 'Pending' | 'Pending Verification' | 'Approved' | 'Rejected'

// ── Payment Status ──
export type PaymentStatus = 'pending_verification' | 'verified' | 'rejected'

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
  payment_status: PaymentStatus | null
  payment_upi_id: string | null
  transaction_name: string | null
  transaction_reference: string | null
  payment_verified_by: string | null
  payment_verified_at: string | null
  payment_rejected_by: string | null
  payment_rejected_at: string | null
  payment_rejection_reason: string | null
}

// ── Registration audit log ──
export interface RegistrationAuditLog {
  id: string
  registration_id: string
  event_id: string
  action: string
  changed_by: string | null
  previous_data: Record<string, unknown> | null
  next_data: Record<string, unknown> | null
  notes: string | null
  created_at: string
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
  payment_upi_id?: string
  transaction_name?: string
  transaction_reference?: string
}

// ── Event Payment Config ──
export interface EventPaymentConfig {
  id: string
  event_id: string
  upi_id: string
  account_holder_name: string
  mobile_number: string
  whatsapp_number: string
  qr_code_url: string | null
  payment_enabled: boolean | null
  transaction_ref_required: boolean | null
  created_at: string
  updated_at: string | null
}

// ── Event Payment Config form ──
export interface EventPaymentConfigFormData {
  upi_id: string
  account_holder_name: string
  mobile_number: string
  whatsapp_number: string
  qr_code_url?: string
  payment_enabled?: boolean
  transaction_ref_required?: boolean
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
export type EmailTemplateType = 'approval' | 'rejection' | 'reminder' | 'results' | 'broadcast' | 'registration_received' | 'payment_verified' | 'payment_rejected'

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
  registration_id: string
  support_email: string
  whatsapp_number: string
  event_whatsapp: string
  event_whatsapp_group: string
  [key: string]: string
}
