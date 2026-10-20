import { getPublicPortfolioContent } from '@/lib/db/cms'
import { defaultContent } from './defaultContent'

export async function getPortfolioContent() {
  try {
    const data = await getPublicPortfolioContent()
    return data || defaultContent
  } catch {
    return defaultContent
  }
}

export async function savePortfolioContent(content) {
  return { success: true }
}

export function toPublicContent(content) {
  return content
}
