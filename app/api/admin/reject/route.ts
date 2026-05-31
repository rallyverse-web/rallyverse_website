import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'

async function authorize(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { rowIndex } = await req.json()
    if (typeof rowIndex !== 'number') {
      return NextResponse.json({ error: 'rowIndex must be a number' }, { status: 400 })
    }

    const sheetRow = rowIndex + 2
    const sheets = getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'

    console.log(`[admin/reject] Row ${sheetRow} (data index ${rowIndex}) → setting verification=Rejected`)

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTabName}!R${sheetRow}:T${sheetRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['Rejected by Admin', 'Rejected']],
      },
    })

    console.log(`[admin/reject] Row ${sheetRow} rejected successfully`)

    return NextResponse.json({ success: true, message: 'Registration rejected' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[admin/reject] Error:', msg)
    return NextResponse.json({ error: 'Failed to reject registration' }, { status: 500 })
  }
}
