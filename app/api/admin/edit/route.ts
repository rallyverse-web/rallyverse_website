import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'

async function authorize(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

const COLUMNS = 'ABCDEFGHIJKLMNOPQRSTUVWX'

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { rowIndex, updates } = await req.json()
    if (typeof rowIndex !== 'number') {
      return NextResponse.json({ error: 'rowIndex must be a number' }, { status: 400 })
    }
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'updates must be an object { colIndex: value }' }, { status: 400 })
    }

    const sheets = getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'
    const sheetRow = rowIndex + 2

    const keys = Object.keys(updates)
    console.log(`[admin/edit] Row ${sheetRow} → updating columns:`, keys.join(', '), JSON.stringify(updates))

    for (const colIndexStr of keys) {
      const colIndex = parseInt(colIndexStr, 10)
      const value = updates[colIndexStr]
      const colLetter = COLUMNS[colIndex]
      if (!colLetter) {
        console.warn(`[admin/edit] Invalid column index: ${colIndex}`)
        continue
      }

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTabName}!${colLetter}${sheetRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[value]],
        },
      })
    }

    console.log(`[admin/edit] Row ${sheetRow} updated successfully`)
    return NextResponse.json({ success: true, message: 'Registration updated' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[admin/edit] Error:', msg)
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
  }
}
