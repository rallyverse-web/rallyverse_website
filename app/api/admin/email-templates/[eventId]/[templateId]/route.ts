import { NextRequest, NextResponse } from 'next/server'
import { updateTemplate, deleteTemplate, getTemplateById } from '@/lib/repositories/email-templates'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ eventId: string; templateId: string }> }) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { templateId } = await params
    const body = await req.json()
    const template = await updateTemplate(templateId, body)
    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Failed to update template:', error)
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ eventId: string; templateId: string }> }) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { templateId } = await params
    await deleteTemplate(templateId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
