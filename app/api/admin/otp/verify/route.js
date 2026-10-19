import { NextResponse } from 'next/server'
import {
  verifyOtpChallenge,
  createSessionToken,
  getAdminCookieOptions,
} from '@/lib/auth/admin'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Requête invalide' },
      { status: 400 }
    )
  }

  const { challengeId, otp } = body || {}

  if (!challengeId || !otp) {
    return NextResponse.json(
      { success: false, message: 'Code de vérification requis' },
      { status: 400 }
    )
  }

  // Vérification sécurisée du code OTP
  const result = verifyOtpChallenge(challengeId, otp)

  if (!result.valid) {
    return NextResponse.json(
      {
        success: false,
        expired: result.expired || false,
        message: result.message || 'Code de vérification invalide',
      },
      { status: 401 }
    )
  }

  // Code vérifié : création de la session sécurisée
  const token = createSessionToken(result.email)
  const cookieOptions = getAdminCookieOptions()

  const response = NextResponse.json(
    {
      success: true,
      message: 'Authentification 2FA réussie',
      role: 'admin',
    },
    { status: 200 }
  )

  response.cookies.set({
    name: cookieOptions.name,
    value: token,
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: cookieOptions.maxAge,
  })

  return response
}
