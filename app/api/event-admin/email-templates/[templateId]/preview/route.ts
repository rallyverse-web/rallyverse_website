import { NextRequest, NextResponse } from 'next/server'
import { getTemplateById } from '@/lib/repositories/email-templates'
import { renderEmailTemplate } from '@/lib/template-renderer'
import { getAdminFromRequest } from '@/lib/event-admin-auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ templateId: string }> }) {
  try {
    const { templateId } = await params
    const template = await getTemplateById(templateId)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== template.event_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const result = renderEmailTemplate(template.subject, template.content, body.variables || {})

    return NextResponse.json({ success: true, subject: result.subject, content: result.content })
  } catch (error) {
    console.error('Failed to preview template:', error)
    return NextResponse.json({ error: 'Failed to preview template' }, { status: 500 })
  }
}
