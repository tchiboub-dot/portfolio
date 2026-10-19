import { NextResponse } from 'next/server'
import { getPublicPortfolioContent } from '@/lib/db/cms'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getPublicPortfolioContent()
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    console.error('Error fetching public portfolio content:', err)
    return NextResponse.json(
      { success: false, message: 'Erreur de chargement du contenu' },
      { status: 500 }
    )
  }
}
