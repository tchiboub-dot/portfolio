import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'

let clientInstance = null

export function getDatabaseClient() {
  if (clientInstance) {
    return clientInstance
  }

  const databaseUrl = (process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || '').trim()
  const databaseAuthToken = (process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || '').trim()

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
