import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter'

const MAX_SIZE = 10 * 1024 * 1024

const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  'image/png': [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])],
  'image/jpeg': [new Uint8Array([255, 216, 255])],
  'image/webp': [new Uint8Array([82, 73, 70, 70])],
}

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp']

function validateMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType]
  if (!signatures) return false
  return signatures.some(sig => {
    if (buffer.length < sig.length) return false
    return sig.every((byte, i) => buffer[i] === byte)
  })
}

function sanitizeFilename(original: string): string {
  const ext = original.split('.').pop()?.toLowerCase() || ''
  const cleanExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : 'png'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}.${cleanExt}`
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(getRateLimitKey(req), 10, 3_600_000)) {
    return NextResponse.json({ error: 'Too many uploads. Try again later.' }, { status: 429 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 10 MB.' }, { status: 400 })
    }

    const allowedMimes = Object.keys(MAGIC_BYTES)
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PNG, JPG, JPEG, and WEBP are supported.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: 'File content does not match the declared image type.' }, { status: 400 })
    }

    const safeName = sanitizeFilename(file.name)
    const storagePath = `screenshots/${safeName}`

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )

    const { data, error } = await supabase.storage
      .from('event-assets')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('event-assets')
      .getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    })
  } catch {
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
