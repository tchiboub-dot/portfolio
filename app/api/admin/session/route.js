import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'

export async function GET(request) {
  const auth = verifyAdminSession(request)

  if (!auth.authenticated) {
    return NextResponse.json(
      {
        authenticated: false,
        message: auth.expired ? 'Session expirée' : 'Non authentifié',
      },
      { status: 401 }
    )
  }

  return NextResponse.json(
    {
      authenticated: true,
      role: auth.session.role,
      expiresAt: auth.session.exp,
    },
    { status: 200 }
  )
}
