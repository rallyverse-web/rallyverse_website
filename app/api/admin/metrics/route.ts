import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'

async function authorize(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sheets = getSheetsClient()
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetTabName}!A:X`,
    })

    const rows = response.data.values || []
    const dataRows = rows.slice(1)

    const totalRegistrations = dataRows.length
    const pendingPayments = dataRows.filter((r) => (r[18] || '') === 'Pending').length
    const verifiedRegistrations = dataRows.filter((r) => (r[19] || '') === 'Verified').length
    const confirmationsSent = dataRows.filter((r) => (r[20] || '') === 'Yes').length

    return NextResponse.json({
      totalRegistrations,
      pendingPayments,
      verifiedRegistrations,
      confirmationsSent,
    })
  } catch (error) {
    console.error('Metrics error:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
