import { prisma } from '@/lib/db'
import { defaultContent } from './defaultContent'

export async function getPortfolioContent() {
  const document = await prisma.portfolioDocument.findUnique({ where: { id: 'portfolio' } })
  if (document) return document.content

  const created = await prisma.portfolioDocument.create({
    data: { id: 'portfolio', content: defaultContent },
  })
  return created.content
}

export async function savePortfolioContent(content) {
  return prisma.portfolioDocument.upsert({
    where: { id: 'portfolio' },
    create: { id: 'portfolio', content },
    update: { content, version: { increment: 1 } },
  })
}

export function toPublicContent(content) {
  return content
}
