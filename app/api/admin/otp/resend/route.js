import { NextResponse } from 'next/server'
import { resendOtpChallenge } from '@/lib/auth/admin'

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

  const { challengeId } = body || {}

  if (!challengeId) {
    return NextResponse.json(
      { success: false, message: 'Identifiant de session manquant' },
      { status: 400 }
    )
  }

  const result = await resendOtpChallenge(challengeId)

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message || 'Impossible de régénérer le code' },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      success: true,
      expiresInSeconds: result.expiresInSeconds,
      message: 'Un nouveau code de vérification a été généré et envoyé.',
    },
    { status: 200 }
  )
}
