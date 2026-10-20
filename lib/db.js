import { getDatabaseClient } from './db/index.js'

export { getDatabaseClient }
export const db = getDatabaseClient()
export default db
