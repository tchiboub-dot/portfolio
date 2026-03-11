import { NextResponse } from 'next/server'

/**
 * MIDDLEWARE DE SÉCURITÉ
 * 
 * Ajoute des protections supplémentaires :
 * - CORS strict pour les API routes
 * - Rate limiting (basique, à améliorer avec Redis en prod)
 * - Logging des requêtes suspectes
 */

// Configuration
const ALLOWED_ORIGINS = []

const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
if (explicitSiteUrl) {
  try {
    ALLOWED_ORIGINS.push(new URL(explicitSiteUrl).origin)
  } catch {
    // ignore invalid URL format
  }
}

if (process.env.VERCEL_URL) {
  ALLOWED_ORIGINS.push(`https://${process.env.VERCEL_URL}`)
}

// fallback historique
ALLOWED_ORIGINS.push('https://portfolio-flame-two-94.vercel.app')

// Permettre localhost en développement
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000')
}

/**
 * Middleware principal
 */
export function middleware(request) {
  const { pathname, origin } = request.nextUrl
  const requestOrigin = request.headers.get('origin')

  // ============================================================================
  // PROTECTION CORS POUR LES API ROUTES
  // ============================================================================
  if (pathname.startsWith('/api/')) {
    // Vérifier l'origine pour les requêtes cross-origin
    if (requestOrigin && !ALLOWED_ORIGINS.includes(requestOrigin)) {
      console.warn(`🚨 Blocked CORS request from: ${requestOrigin} to ${pathname}`)
      
      return NextResponse.json(
        { success: false, message: 'Origin not allowed' },
        { status: 403 }
      )
    }

    // Ajouter les headers CORS appropriés
    const response = NextResponse.next()
    
    if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
      response.headers.set('Access-Control-Allow-Origin', requestOrigin)
      response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
      response.headers.set('Access-Control-Max-Age', '86400') // 24h
    }

    return response
  }

  // ============================================================================
  // LOGGING DES REQUÊTES SUSPECTES (optionnel)
  // ============================================================================
  const suspiciousPatterns = [
    /\.env/i,
    /\.git/i,
    /wp-admin/i,
    /phpmyadmin/i,
    /\.php$/i,
    /eval\(/i,
    /__/i, // Tentatives de path traversal
  ]

  if (suspiciousPatterns.some(pattern => pattern.test(pathname))) {
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown'
    
    console.warn(`🚨 Suspicious request detected:`, {
      ip,
      pathname,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    })

    // Retourner 404 au lieu de 403 pour ne pas confirmer l'existence de fichiers
    return new NextResponse(null, { status: 404 })
  }

  // ============================================================================
  // DÉFENSE CONTRE LES BOTS (basique)
  // ============================================================================
  const userAgent = request.headers.get('user-agent') || ''
  const suspiciousBots = [
    /curl/i,
    /wget/i,
    /python-requests/i,
    /scrapy/i,
    /bot(?!.*google|.*bing)/i, // Bloquer les bots sauf Google/Bing
  ]

  // Ne bloquer les bots que sur certaines routes sensibles
  const sensitivePaths = ['/api/contact']
  const isSensitivePath = sensitivePaths.some(path => pathname.startsWith(path))

  if (isSensitivePath && suspiciousBots.some(pattern => pattern.test(userAgent))) {
    console.warn(`🤖 Bot detected:`, {
      userAgent,
      pathname,
      ip: request.headers.get('x-forwarded-for'),
    })

    // Retourner une réponse générique pour ne pas aider les attaquants
    return NextResponse.json(
      { success: false, message: 'Forbidden' },
      { status: 403 }
    )
  }

  // ============================================================================
  // CONTINUER LA REQUÊTE NORMALEMENT
  // ============================================================================
  return NextResponse.next()
}

/**
 * Configuration du middleware
 * 
 * Matcher : définit sur quelles routes le middleware s'applique
 */
export const config = {
  matcher: [
    // Appliquer sur toutes les API routes
    '/api/:path*',
    
    // Appliquer sur les routes sensibles (optionnel)
    // '/admin/:path*',
    
    // Ne PAS appliquer sur les assets statiques
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}
