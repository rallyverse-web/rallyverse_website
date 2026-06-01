import { google } from 'googleapis'

export function getGoogleAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  })
}

export function getSheetsClient() {
  const auth = getGoogleAuth()
  return google.sheets({ version: 'v4', auth })
}

export function getDriveClient() {
  const auth = getGoogleAuth()
  return google.drive({ version: 'v3', auth })
}

export async function getSheetId(sheets: ReturnType<typeof getSheetsClient>, spreadsheetId: string, sheetTabName: string) {
  const sheetMeta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties',
  })
  const sheet = sheetMeta.data.sheets?.find(
    (s) => s.properties?.title === sheetTabName
  )
  if (sheet?.properties?.sheetId === undefined || sheet?.properties?.sheetId === null) {
    throw new Error(`Sheet "${sheetTabName}" not found`)
  }
  return sheet.properties.sheetId
}
