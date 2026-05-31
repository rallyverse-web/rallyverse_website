import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'

async function authorize(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

const COLUMN_LABELS = [
  'registrationId', 'registrationDate', 'category', 'teamName',
  'player1Name', 'player1Phone', 'player1Email', 'player1SkillLevel',
  'player2Name', 'player2Phone', 'player2Email', 'player2SkillLevel',
  'city', 'collegeOrOrg', 'entryFee', 'utrNumber', 'paymentPhone',
  'remarks', 'paymentStatus', 'verificationStatus',
  'confirmationSent', 'paymentScreenshotReceived', 'confirmationDate',
  'additionalNotes',
]

export async function GET(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sheets = getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTabName}!A:X`,
    })

    const rows = response.data.values || []
    const dataRows = rows.slice(1)

    const registrations = dataRows.map((row, i) => {
      const obj: Record<string, string> = { rowIndex: String(i) }
      COLUMN_LABELS.forEach((label, ci) => {
        obj[label] = row[ci] || ''
      })
      return obj
    })

    const totalRegistrations = registrations.length
    const pendingPayments = registrations.filter((r) => r.paymentStatus === 'Pending').length
    const verifiedRegistrations = registrations.filter((r) => r.verificationStatus === 'Verified').length
    const rejectedRegistrations = registrations.filter((r) => r.verificationStatus === 'Rejected').length
    const pendingVerification = registrations.filter((r) => r.verificationStatus === 'Pending').length
    const confirmationsSent = registrations.filter((r) => r.confirmationSent === 'Yes').length
    const confirmationsPending = verifiedRegistrations - confirmationsSent

    console.log(`[admin/registrations] Fetched ${totalRegistrations} rows`)

    return NextResponse.json({
      registrations,
      metrics: {
        totalRegistrations,
        pendingPayments,
        verifiedRegistrations,
        rejectedRegistrations,
        pendingVerification,
        confirmationsSent,
        confirmationsPending,
      },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[admin/registrations] Error:', msg)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}
