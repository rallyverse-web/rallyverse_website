import { NextRequest, NextResponse } from 'next/server'
import { getTemplateById } from '@/lib/repositories/email-templates'
import { renderEmailTemplate } from '@/lib/template-renderer'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { eventId: templateId } = await params
    const template = await getTemplateById(templateId)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const body = await req.json()
    const result = renderEmailTemplate(template.subject, template.content, body.variables || {})

    return NextResponse.json({ success: true, subject: result.subject, content: result.content })
  } catch (error) {
    console.error('Failed to preview template:', error)
    return NextResponse.json({ error: 'Failed to preview template' }, { status: 500 })
  }
}
