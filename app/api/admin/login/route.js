import { NextResponse } from 'next/server'
import {
  verifyAdminEmail,
  verifyAdminPassword,
  createOtpChallenge,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from '@/lib/auth/admin'

function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

export async function POST(request) {
  const ip = getClientIP(request)

  // 1. Anti-bruteforce rate limiting
  const rateLimitStatus = checkLoginRateLimit(ip)
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Trop de tentatives. Veuillez réessayer dans ${rateLimitStatus.retryAfterMinutes} minute(s).`,
      },
      { status: 429 }
    )
  }

  // 2. Extraction du payload (email / gmail + mot de passe)
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Requête invalide' },
      { status: 400 }
    )
  }

  const { email, password } = body || {}

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    recordFailedLogin(ip)
    return NextResponse.json(
      { success: false, message: 'Identifiants invalides' },
      { status: 401 }
    )
  }

  // 3. Vérification de l'email administrateur (Gmail / ESISA)
  const isEmailValid = verifyAdminEmail(email)

  // 4. Vérification du mot de passe administrateur
  const isPasswordValid = await verifyAdminPassword(password)

  if (!isEmailValid || !isPasswordValid) {
    recordFailedLogin(ip)
    // Message d'erreur générique : ne révèle pas si c'est l'email ou le mot de passe
    return NextResponse.json(
      { success: false, message: 'Identifiants invalides' },
      { status: 401 }
    )
  }

  // Identifiants corrects : réinitialiser le compteur d'échecs
  resetLoginAttempts(ip)

  // 5. Générer le code de vérification OTP et envoyer l'email de sécurité
  try {
    const otpData = await createOtpChallenge(email.trim().toLowerCase())

    return NextResponse.json(
      {
        success: true,
        requireOtp: true,
        challengeId: otpData.challengeId,
        emailMasked: otpData.emailMasked,
        expiresInSeconds: otpData.expiresInSeconds,
        debugCode: otpData.debugCode,
        message: `Code de vérification envoyé à ${otpData.emailMasked}`,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Erreur génération OTP:', err)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi du code de vérification' },
      { status: 500 }
    )
  }
}
