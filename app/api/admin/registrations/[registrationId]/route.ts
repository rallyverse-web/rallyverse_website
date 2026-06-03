import { NextRequest, NextResponse } from 'next/server'
import { getRegistrationById, deleteRegistration } from '@/lib/repositories/registrations'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { registrationId } = await params

    const registration = await getRegistrationById(registrationId)
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    await deleteRegistration(registrationId)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
