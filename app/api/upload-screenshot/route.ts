import { Readable } from 'stream'
import { NextRequest, NextResponse } from 'next/server'
import { getDriveClient } from '@/lib/google'

const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
const maxFileSize = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('screenshot') as File | null
    const registrationId = formData.get('registrationId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 })
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP allowed' }, { status: 400 })
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    }

    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      return NextResponse.json({ error: 'Google Drive folder is not configured' }, { status: 500 })
    }

    const drive = getDriveClient()
    const buffer = Buffer.from(await file.arrayBuffer())
    const stream = Readable.from(buffer)
    const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1]
    const fileName = `${registrationId}_payment_${Date.now()}.${extension}`

    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id, webViewLink',
    })

    if (!driveResponse.data.id) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    await drive.permissions.create({
      fileId: driveResponse.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    return NextResponse.json({
      success: true,
      fileId: driveResponse.data.id,
      fileUrl: driveResponse.data.webViewLink,
    })
  } catch (error) {
    console.error('Drive upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
