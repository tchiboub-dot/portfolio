import { NextResponse } from 'next/server'

// ============================================================================
// CONFIGURATION DE SÉCURITÉ
// ============================================================================

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3 // Max 3 messages par minute par IP
const COOLDOWN_PERIOD = 30 * 1000 // 30 secondes entre chaque message
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 150
const MAX_SUBJECT_LENGTH = 200
const MAX_MESSAGE_LENGTH = 2000
const MAX_BODY_SIZE = 10 * 1024 // 10KB max
const RESEND_API_URL = 'https://api.resend.com/emails'

// Store en mémoire pour le rate limiting (à remplacer par Redis en prod)
const requestStore = new Map()
const cooldownStore = new Map()

// ============================================================================
// UTILITAIRES DE SÉCURITÉ
// ============================================================================

/**
 * Validation stricte d'email (RFC 5322 simplifié)
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= MAX_EMAIL_LENGTH
}

/**
 * Sanitize input pour prévenir XSS
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Retire < et >
    .replace(/javascript:/gi, '') // Retire javascript:
    .replace(/on\w+=/gi, '') // Retire les event handlers (onclick=, etc.)
    .slice(0, MAX_MESSAGE_LENGTH) // Limite la longueur
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Détecte le spam basique (patterns communs)
 */
function containsSpam(text) {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|prize)\b/i,
    /\b(click here|buy now|act now)\b/i,
    /(http[s]?:\/\/){3,}/i, // Plus de 3 URLs
    /(.)\1{10,}/, // Caractère répété 10+ fois
  ]
  
  return spamPatterns.some(pattern => pattern.test(text))
}

/**
 * Rate limiting par IP
 */
function checkRateLimit(ip) {
  const now = Date.now()
  const userRequests = requestStore.get(ip) || []
  
  // Nettoyer les anciennes requêtes
  const recentRequests = userRequests.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  )
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfter: Math.ceil((recentRequests[0] + RATE_LIMIT_WINDOW - now) / 1000)
    }
  }
  
  recentRequests.push(now)
  requestStore.set(ip, recentRequests)
  
  return { allowed: true }
}

/**
 * Cooldown entre messages
 */
function checkCooldown(ip) {
  const lastRequest = cooldownStore.get(ip)
  const now = Date.now()
  
  if (lastRequest && now - lastRequest < COOLDOWN_PERIOD) {
    return {
      allowed: false,
      retryAfter: Math.ceil((lastRequest + COOLDOWN_PERIOD - now) / 1000)
    }
  }
  
  cooldownStore.set(ip, now)
  return { allowed: true }
}

/**
 * Récupère l'IP du client (Vercel spécifique)
 */
function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

async function sendWithResend({ fromEmail, toEmail, replyTo, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  })

  if (!response.ok) {
    const resendError = await response.text()
    throw new Error(`Resend request failed (${response.status}): ${resendError}`)
  }
}

// ============================================================================
// HANDLER API ROUTE
// ============================================================================

export async function POST(request) {
  try {
    // 1. Vérifier la taille du corps de la requête
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Requête trop volumineuse' },
        { status: 413 }
      )
    }

    // 2. Récupérer l'IP du client
    const clientIP = getClientIP(request)

    // 3. Vérifier le rate limiting
    const rateLimitCheck = checkRateLimit(clientIP)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Trop de requêtes. Veuillez réessayer plus tard.',
          retryAfter: rateLimitCheck.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitCheck.retryAfter.toString(),
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }

    // 4. Vérifier le cooldown
    const cooldownCheck = checkCooldown(clientIP)
    if (!cooldownCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Veuillez patienter ${cooldownCheck.retryAfter} secondes avant d'envoyer un autre message.`
        },
        { status: 429 }
      )
    }

    // 5. Parser les données
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Données invalides' },
        { status: 400 }
      )
    }

    const { name, email, subject, message, honeypot } = body

    // 6. Vérifier le honeypot (anti-bot)
    if (honeypot) {
      // Bot détecté, on fait semblant que ça a marché
      return NextResponse.json({ success: true, message: 'Message envoyé' })
    }

    // 7. Validation des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // 8. Validation des longueurs
    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      subject.length > MAX_SUBJECT_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { success: false, message: 'Un ou plusieurs champs sont trop longs' },
        { status: 400 }
      )
    }

    // 9. Validation de l'email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Email invalide' },
        { status: 400 }
      )
    }

    // 10. Sanitize les inputs
    const safeName = sanitizeInput(name)
    const safeSubject = sanitizeInput(subject)
    const safeMessage = sanitizeInput(message)

    // 11. Détection de spam
    if (
      containsSpam(safeName) ||
      containsSpam(safeSubject) ||
      containsSpam(safeMessage)
    ) {
      // Ne pas indiquer qu'on a détecté du spam (ne pas aider les spammers)
      return NextResponse.json({ success: true, message: 'Message envoyé' })
    }

    // 12. Envoi réel via Resend (compatible Vercel)
    const toEmail = process.env.CONTACT_TO_EMAIL
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'

    if (!toEmail) {
      throw new Error('CONTACT_TO_EMAIL is not configured')
    }

    const emailSubject = `[Portfolio] ${safeSubject}`
    const safeEmail = sanitizeInput(email)
    const textBody = [
      'Nouveau message depuis le portfolio',
      '',
      `Nom: ${safeName}`,
      `Email: ${safeEmail}`,
      `Sujet: ${safeSubject}`,
      '',
      'Message:',
      safeMessage,
      '',
      `IP: ${clientIP}`,
    ].join('\n')

    const htmlBody = `
      <h2>Nouveau message depuis le portfolio</h2>
      <p><strong>Nom:</strong> ${escapeHtml(safeName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
      <p><strong>Sujet:</strong> ${escapeHtml(safeSubject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(safeMessage).replace(/\n/g, '<br/>')}</p>
      <hr/>
      <p><small>IP: ${escapeHtml(clientIP)}</small></p>
    `

    await sendWithResend({
      fromEmail,
      toEmail,
      replyTo: safeEmail,
      subject: emailSubject,
      text: textBody,
      html: htmlBody,
    })

    // 13. Réponse générique (ne leak pas d'info)
    return NextResponse.json({
      success: true,
      message: 'Message envoyé ✅'
    })

  } catch (error) {
    // Ne jamais exposer les erreurs internes
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur serveur /api/contact:', error)
    }
    
    return NextResponse.json(
      { success: false, message: 'Erreur d\'envoi, réessayez.' },
      { status: 500 }
    )
  }
}

// Bloquer les autres méthodes HTTP
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Méthode non autorisée' },
    { status: 405 }
  )
}
