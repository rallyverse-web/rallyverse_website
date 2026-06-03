import { NextRequest, NextResponse } from 'next/server'
import { duplicateTemplate, getTemplateById } from '@/lib/repositories/email-templates'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { eventId: templateId } = await params
    const template = await duplicateTemplate(templateId)
    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Failed to duplicate template:', error)
    return NextResponse.json({ error: 'Failed to duplicate template' }, { status: 500 })
  }
}
