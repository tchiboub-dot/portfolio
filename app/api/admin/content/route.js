import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getPortfolioContent, savePortfolioContent } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    requireAdmin()
    const content = await getPortfolioContent()
    return NextResponse.json({ ok: true, content }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : 503
    return NextResponse.json({ ok: false, error: status === 401 ? 'Unauthorized.' : 'Content is temporarily unavailable.' }, { status })
  }
}

export async function PUT(request) {
  try {
    requireAdmin()
    const body = await request.json()
    if (!body || typeof body.content !== 'object' || Array.isArray(body.content)) {
      return NextResponse.json({ ok: false, error: 'Invalid content payload.' }, { status: 400 })
    }
    await savePortfolioContent(body.content)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : 400
    return NextResponse.json({ ok: false, error: status === 401 ? 'Unauthorized.' : 'Unable to save changes.' }, { status })
  }
}
