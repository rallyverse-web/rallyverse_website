import { NextRequest, NextResponse } from 'next/server'
import { updateTemplate, deleteTemplate, getTemplateById } from '@/lib/repositories/email-templates'
import { getAdminFromRequest } from '@/lib/event-admin-auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ eventId: string; templateId: string }> }) {
  try {
    const { eventId, templateId } = await params
    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const template = await getTemplateById(templateId)
    if (!template || template.event_id !== eventId) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }
    const body = await req.json()
    const updated = await updateTemplate(templateId, body)
    return NextResponse.json({ success: true, template: updated })
  } catch (error) {
    console.error('Failed to update template:', error)
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ eventId: string; templateId: string }> }) {
  try {
    const { eventId, templateId } = await params
    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const template = await getTemplateById(templateId)
    if (!template || template.event_id !== eventId) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }
    await deleteTemplate(templateId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
