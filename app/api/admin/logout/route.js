import { NextResponse } from 'next/server'
import { getAdminCookieOptions } from '@/lib/auth/admin'

export async function POST() {
  const cookieOptions = getAdminCookieOptions(0)

  const response = NextResponse.json(
    {
      success: true,
      message: 'Déconnexion réussie',
    },
    { status: 200 }
  )

  // Invalider immédiatement le cookie côté client
  response.cookies.set({
    name: cookieOptions.name,
    value: '',
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: 0,
    expires: new Date(0),
  })

  return response
}
