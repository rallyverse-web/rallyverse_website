import { getSupabaseServerClient } from '@/lib/supabase/server'

const DEFAULT_SETTINGS = {
  sender_name: 'RallyVerse',
  reply_to_email: 'support@rallyverse.social',
  support_email: 'support@rallyverse.social',
}

interface TemplateSpec {
  template_type: string
  subject: string
  content: string
}

const DEFAULT_TEMPLATES: TemplateSpec[] = [
  {
    template_type: 'approval',
    subject: 'Registration Approved — {{event_name}}',
    content: `Hi {{participant_name}},

<p>Your registration for <strong>{{event_name}}</strong> has been approved.</p>

<p><strong>Format:</strong> {{format}}<br />
<strong>Venue:</strong> {{event_venue}}<br />
<strong>Date:</strong> {{event_date}}</p>

<p>We look forward to seeing you at the event.</p>

<p><strong>Event WhatsApp:</strong> {{event_whatsapp}}<br />
<strong>WhatsApp Group:</strong> {{event_whatsapp_group}}</p>

<p>Regards,<br />RallyVerse</p>`,
  },
  {
    template_type: 'rejection',
    subject: 'Registration Update — {{event_name}}',
    content: `Hi {{participant_name}},

<p>Unfortunately your registration for <strong>{{event_name}}</strong> could not be approved.</p>

<p>If you believe this is an error, please contact:</p>

<p><a href="mailto:{{support_email}}">{{support_email}}</a></p>

<p>Regards,<br />RallyVerse</p>`,
  },
  {
    template_type: 'reminder',
    subject: 'Reminder — {{event_name}}',
    content: `Hi {{participant_name}},

<p>This is a reminder for your upcoming participation in <strong>{{event_name}}</strong>.</p>

<p><strong>Venue:</strong> {{event_venue}}<br />
<strong>Date:</strong> {{event_date}}</p>

<p>For any queries, contact <strong>{{event_whatsapp}}</strong> or join the group: {{event_whatsapp_group}}</p>

<p>See you there.</p>

<p>Regards,<br />RallyVerse</p>`,
  },
  {
    template_type: 'results',
    subject: 'Results — {{event_name}}',
    content: `Hi {{participant_name}},

<p>Thank you for participating in <strong>{{event_name}}</strong>.</p>

<p>Event results have now been published.</p>

<p>For feedback or queries, reach out to <strong>{{event_whatsapp}}</strong>.</p>

<p>Regards,<br />RallyVerse</p>`,
  },
  {
    template_type: 'broadcast',
    subject: 'Update — {{event_name}}',
    content: `Hi {{participant_name}},

<p>We have an important update regarding <strong>{{event_name}}</strong>.</p>

<p>Regards,<br />RallyVerse</p>`,
  },
]

/**
 * Seeds default email settings and templates for an event.
 * Skips creation if records already exist (idempotent).
 */
export async function seedEventDefaults(eventId: string): Promise<void> {
  const supabase = await getSupabaseServerClient()

  // ── Settings ──
  const { data: existingSettings } = await supabase
    .from('event_email_settings')
    .select('id')
    .eq('event_id', eventId)
    .maybeSingle()

  if (!existingSettings) {
    await supabase.from('event_email_settings').insert({
      event_id: eventId,
      ...DEFAULT_SETTINGS,
    })
  }

  // ── Templates ──
  const { data: existingTemplates } = await supabase
    .from('email_templates')
    .select('template_type')
    .eq('event_id', eventId)

  const existingTypes = new Set((existingTemplates ?? []).map((t: { template_type: string }) => t.template_type))

  const toInsert = DEFAULT_TEMPLATES.filter((t) => !existingTypes.has(t.template_type))

  if (toInsert.length > 0) {
    const rows = toInsert.map((t) => ({
      event_id: eventId,
      template_type: t.template_type,
      subject: t.subject,
      content: t.content,
    }))
    await supabase.from('email_templates').insert(rows)
  }
}

/**
 * Backfills default email settings and templates for all existing events
 * that are missing them. Returns counts of what was created.
 */
export async function backfillAllEvents(): Promise<{ settingsCreated: number; templatesCreated: number; eventsProcessed: number }> {
  const supabase = await getSupabaseServerClient()
  let settingsCreated = 0
  let templatesCreated = 0
  let eventsProcessed = 0

  const { data: events } = await supabase.from('events').select('id')
  if (!events) return { settingsCreated: 0, templatesCreated: 0, eventsProcessed: 0 }

  for (const event of events) {
    await seedEventDefaults(event.id)
    eventsProcessed++
  }

  // Count what was actually created
  const { data: allSettings } = await supabase.from('event_email_settings').select('id')
  const { data: allTemplates } = await supabase.from('email_templates').select('id')

  return {
    settingsCreated: allSettings?.length ?? 0,
    templatesCreated: allTemplates?.length ?? 0,
    eventsProcessed,
  }
}
