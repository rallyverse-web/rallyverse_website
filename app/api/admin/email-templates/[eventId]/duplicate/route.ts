import { NextRequest, NextResponse } from 'next/server'
import { duplicateTemplate, getTemplateById } from '@/lib/repositories/email-templates'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { eventId: templateId } = await params
    const template = await duplicateTemplate(templateId)
    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Failed to duplicate template:', error)
    return NextResponse.json({ error: 'Failed to duplicate template' }, { status: 500 })
  }
}
