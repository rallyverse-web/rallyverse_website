import { NextRequest, NextResponse } from 'next/server'
import { getTemplates, createTemplate } from '@/lib/repositories/email-templates'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { eventId } = await params
    const templates = await getTemplates(eventId)
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Failed to fetch templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { eventId } = await params
    const body = await req.json()
    const template = await createTemplate(eventId, body)
    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Failed to create template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}
