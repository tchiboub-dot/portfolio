import { NextResponse } from 'next/server'
import { getPortfolioContent } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const content = await getPortfolioContent()
    return NextResponse.json({ ok: true, content }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ ok: false, error: 'Content is temporarily unavailable.' }, { status: 503 })
  }
}
