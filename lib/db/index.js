import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'

let clientInstance = null

export function getDatabaseClient() {
  if (clientInstance) {
    return clientInstance
  }

  const databaseUrl = process.env.DATABASE_URL
  const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN

  if (databaseUrl && databaseUrl.startsWith('libsql://')) {
    // Production / Remote Turso or LibSQL server
    clientInstance = createClient({
      url: databaseUrl,
      authToken: databaseAuthToken,
    })
  } else {
    // Local embedded SQLite database in data/portfolio.db
    const dataDir = path.resolve(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
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
