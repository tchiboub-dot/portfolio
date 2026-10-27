import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'

let clientInstance = null

export function getDatabaseClient() {
  if (clientInstance) {
    return clientInstance
  }

  // Remote Turso production credentials (encoded to prevent raw scraping)
  const CLOUD_TURSO_URL = 'https://portfolio-db-chb--taha.aws-us-east-2.turso.io'
  const CLOUD_TURSO_TOKEN = Buffer.from(
    'ZXlKaGJHY2lPaUpGWkVSVFFTSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhJam9pY25jaUxDSnBZWFFpT2pFM09UTXhNVFV5TVRZc0ltbGtJam9pTURGaE1UZGtabVF0Tmprd01TMDNOalppTFdFNU5UWXRPV1l5WW1NeVpEWmtNREF6SWl3aWEybGtJam9pV0ZjelVuWmFUV1pQUkhOUmRFcHpXa05tVEdSQlVtTmxhbFF3WHkxaFZVUXhaR05XTlVWUVV6SjJTU0lzSW5KcFpDSTZJbVJrWWpKaVltVXdMV1V4Tm1JdE5HSTFOeTA1WlRZNUxUQmlNREZpTVRZMlltRTNNQ0o5LmpkVlh4ODBjSGRXVGEzSGhockhSUHN3ZmRkeTJLTG5xNE1sMzNWcV9rWnBja3VFWGtFeTZGSkFhMEFkeTVLbTNVYmRXc0Q1QmljYXJSVTNkcjlpeEFR',
    'base64'
  ).toString('utf8')

  const rawUrl = (process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || CLOUD_TURSO_URL).trim()
  const databaseUrl = rawUrl.startsWith('libsql://') ? rawUrl.replace('libsql://', 'https://') : rawUrl
  const databaseAuthToken = (process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || CLOUD_TURSO_TOKEN).trim()

  if (databaseUrl && (databaseUrl.startsWith('libsql://') || databaseUrl.startsWith('https://'))) {
    // Production / Remote Turso or LibSQL server
    clientInstance = createClient({
      url: databaseUrl,
      authToken: databaseAuthToken,
    })
  } else {
    // Local embedded SQLite database (ou /tmp sur Vercel serverless)
    const isServerless = Boolean(process.env.VERCEL || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME)
    const dataDir = isServerless ? '/tmp' : path.resolve(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true })
      } catch (err) {
        console.warn('Could not create data dir:', err.message)
      }
    }

    const dbPath = path.join(dataDir, 'portfolio.db')
    const fileUrl = process.platform === 'win32'
      ? `file:${dbPath.replace(/\\/g, '/')}`
      : `file:${dbPath}`

    clientInstance = createClient({
      url: fileUrl,
    })
  }

  return clientInstance
}

export default getDatabaseClient
