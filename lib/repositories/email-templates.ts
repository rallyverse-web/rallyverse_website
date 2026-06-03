import { getSupabaseServerClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import type { EmailTemplate, EmailTemplateFormData } from '@/lib/types/supabase'

export async function getTemplates(eventId: string): Promise<EmailTemplate[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as EmailTemplate[]
}

export async function getTemplateById(templateId: string): Promise<EmailTemplate | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('id', templateId)
    .maybeSingle()
  if (error) throw error
  return data as EmailTemplate | null
}

export async function createTemplate(
  eventId: string,
  formData: EmailTemplateFormData,
  createdBy?: string
): Promise<EmailTemplate> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_templates')
    .insert({
      event_id: eventId,
      template_type: formData.template_type,
      subject: formData.subject,
      content: formData.content,
      created_by: createdBy || null,
    })
    .select()
    .single()
  if (error) throw error
  return data as EmailTemplate
}

export async function updateTemplate(
  templateId: string,
  formData: EmailTemplateFormData
): Promise<EmailTemplate> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_templates')
    .update({
      template_type: formData.template_type,
      subject: formData.subject,
      content: formData.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', templateId)
    .select()
    .single()
  if (error) throw error
  return data as EmailTemplate
}

export async function duplicateTemplate(templateId: string): Promise<EmailTemplate> {
  const original = await getTemplateById(templateId)
  if (!original) throw new Error('Template not found')

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('email_templates')
    .insert({
      event_id: original.event_id,
      template_type: original.template_type,
      subject: `Copy of ${original.subject}`,
      content: original.content,
      created_by: original.created_by,
    })
    .select()
    .single()
  if (error) throw error
  return data as EmailTemplate
}

export async function deleteTemplate(templateId: string): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase
    .from('email_templates')
    .delete()
    .eq('id', templateId)
  if (error) throw error
}
