import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'

export async function GET(request) {
  // Protection serveur : vérification obligatoire de l'authentification et de l'autorisation
  const auth = verifyAdminSession(request)

  if (!auth.authenticated) {
    return NextResponse.json(
      {
        success: false,
        message: 'Accès refusé : session non autorisée',
      },
      { status: 401 }
    )
  }

  // Endpoint protégé : données d'administration
  return NextResponse.json(
    {
      success: true,
      data: {
        serverTime: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        emailConfigured: Boolean(process.env.RESEND_API_KEY || process.env.RESEND_KEY),
        contactRecipient: process.env.CONTACT_TO_EMAIL || 'Non configuré',
        adminAuthMode: process.env.ADMIN_PASSWORD_HASH
          ? 'Bcrypt Hash (Recommandé)'
          : process.env.ADMIN_PASSWORD
          ? 'Plaintext Variable (Local)'
          : 'Non configuré',
      },
    },
    { status: 200 }
  )
}
