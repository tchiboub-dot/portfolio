import { NextResponse } from 'next/server'
import { authenticateAdmin, setAdminSession } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (!email || !password || email.length > 254 || password.length > 256) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 })
    }

    const result = await authenticateAdmin(email, password, ip)
    if (!result.ok) {
      const headers = result.retryAfter ? { 'Retry-After': String(result.retryAfter) } : undefined
      return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401, headers })
    }

    setAdminSession(result.token)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Unable to sign in.' }, { status: 400 })
  }
}
