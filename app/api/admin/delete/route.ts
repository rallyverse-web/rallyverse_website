import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient, getSheetId } from '@/lib/google'

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

    const sheets = getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'
    const sheetId = await getSheetId(sheets, spreadsheetId, sheetTabName)

    const deleteRowIndex = rowIndex + 1

    console.log(`[admin/delete] Deleting row ${deleteRowIndex + 1} (data index ${rowIndex}), sheetId=${sheetId}`)

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: deleteRowIndex,
                endIndex: deleteRowIndex + 1,
              },
            },
          },
        ],
      },
    })

    console.log(`[admin/delete] Row ${deleteRowIndex + 1} deleted successfully`)
    return NextResponse.json({ success: true, message: 'Registration deleted' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[admin/delete] Error:', msg)
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 })
  }
}
