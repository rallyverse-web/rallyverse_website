import { NextRequest, NextResponse } from 'next/server'
import { duplicateTemplate, getTemplateById } from '@/lib/repositories/email-templates'
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

    const duplicated = await duplicateTemplate(templateId)
    return NextResponse.json({ success: true, template: duplicated })
  } catch (error) {
    console.error('Failed to duplicate template:', error)
    return NextResponse.json({ error: 'Failed to duplicate template' }, { status: 500 })
  }
}
