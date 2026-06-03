import type { TemplateVariables } from '@/lib/types/supabase'

const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g

/**
 * Renders a template string by replacing {{variable}} placeholders
 * with values from the provided data object.
 */
export function renderTemplate(template: string, data: Partial<TemplateVariables>): string {
  return template.replace(VARIABLE_PATTERN, (match, key: string) => {
    if (key in data) {
      return data[key] ?? match
    }
    return match
  })
}

/**
 * Renders both the subject and content of a template.
 */
export function renderEmailTemplate(
  subject: string,
  content: string,
  data: Partial<TemplateVariables>
): { subject: string; content: string } {
  return {
    subject: renderTemplate(subject, data),
    content: renderTemplate(content, data),
  }
}

/**
 * Returns the list of supported template variables with descriptions.
 */
export function getTemplateVariableDefinitions(): Array<{ key: string; label: string; description: string }> {
  return [
    { key: 'participant_name', label: 'Participant Name', description: 'Full name of the participant' },
    { key: 'event_name', label: 'Event Name', description: 'Name of the event' },
    { key: 'event_date', label: 'Event Date', description: 'Date of the event' },
    { key: 'event_venue', label: 'Event Venue', description: 'Venue of the event' },
    { key: 'format', label: 'Format', description: 'Event format (e.g. Men\'s Doubles)' },
    { key: 'registration_status', label: 'Registration Status', description: 'Current status (Approved/Rejected/Pending)' },
    { key: 'support_email', label: 'Support Email', description: 'Event support email address' },
    { key: 'whatsapp_number', label: 'WhatsApp Number', description: 'Event WhatsApp contact number' },
    { key: 'event_whatsapp', label: 'Event WhatsApp', description: 'Event WhatsApp contact number' },
    { key: 'event_whatsapp_group', label: 'Event WhatsApp Group', description: 'Event WhatsApp group invite link' },
  ]
}
