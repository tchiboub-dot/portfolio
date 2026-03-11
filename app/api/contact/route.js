import { Resend } from 'resend'
import { NextResponse } from 'next/server'

// ============================================================================
// CONFIGURATION DE SÉCURITÉ
// ============================================================================

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5 // Max 5 messages par minute par IP
const COOLDOWN_PERIOD = 20 * 1000 // 20 secondes entre chaque message
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 150
const MAX_SUBJECT_LENGTH = 200
const MAX_MESSAGE_LENGTH = 2000
const MAX_BODY_SIZE = 10 * 1024 // 10KB max

function resolveResendApiKey() {
  return (
    process.env.RESEND_API_KEY ||
    process.env.RESEND_KEY ||
    ''
  ).trim()
}

// Store en mémoire pour le rate limiting (à remplacer par Redis en prod)
const requestStore = new Map()
const cooldownStore = new Map()

// ============================================================================
// VALIDATION VARIABLES D'ENVIRONNEMENT
// ============================================================================

function validateEnvironment() {
  const errors = []
  const resolvedToEmail = process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL
  const resolvedFromEmail = process.env.CONTACT_FROM_EMAIL
  const resolvedApiKey = resolveResendApiKey()

  if (!resolvedApiKey) {
    errors.push('RESEND_API_KEY/RESEND_KEY est manquante')
  }

  if (!resolvedToEmail) {
    errors.push('CONTACT_TO_EMAIL/CONTACT_EMAIL est manquante')
  }

  if (!resolvedFromEmail) {
    errors.push('CONTACT_FROM_EMAIL est manquante (doit être un sender validé dans Resend)')
  }

  return errors
}

// Vérifier au démarrage (une seule fois)
const envErrors = validateEnvironment()
if (envErrors.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('❌ Erreurs de configuration Resend:', envErrors)
}

// ============================================================================
// UTILITAIRES DE SÉCURITÉ
// ============================================================================

/**
 * Validation stricte d'email (RFC 5322 simplifié)
 */
function isValidEmail(email) {
  // Requires local@domain.tld — TLD (2+ letters) is mandatory, rejects bare domains like user@gemail
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/
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
    .replace(/on\w+=/gi, '') // Retire les event handlers
    .slice(0, MAX_MESSAGE_LENGTH)
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
 * Détecte le spam basique
 */
function containsSpam(text) {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|prize)\b/i,
    /\b(click here|buy now|act now)\b/i,
    /(http[s]?:\/\/){3,}/i,
    /(.)\1{10,}/,
  ]
  return spamPatterns.some(pattern => pattern.test(text))
}

/**
 * Rate limiting par IP
 */
function checkRateLimit(ip) {
  const now = Date.now()
  const userRequests = requestStore.get(ip) || []
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

/**
 * Envoyer email via Resend (SDK)
 */
async function sendEmailViaResend({ fromEmail, toEmail, replyTo, subject, html }) {
  const apiKey = resolveResendApiKey()

  if (!apiKey) {
    throw new Error('RESEND_API_KEY (or RESEND_KEY) is not configured')
  }

  const resend = new Resend(apiKey)

  const result = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    reply_to: replyTo,
    subject,
    html,
  })

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`)
  }

  return result
}


// ============================================================================
// HANDLER API ROUTE
// ============================================================================

export async function POST(request) {
  try {
    // 1. Vérifier la taille du corps
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { ok: false, error: 'Requête trop volumineuse' },
        { status: 413 }
      )
    }

    // 2. Récupérer l'IP du client
    const clientIP = getClientIP(request)

    // 3. Vérifier rate limit
    const rateLimitCheck = checkRateLimit(clientIP)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { 
          ok: false, 
          error: `Trop de requêtes. Attendez ${rateLimitCheck.retryAfter}s avant de réessayer.`
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitCheck.retryAfter.toString(),
          }
        }
      )
    }

    // 4. Vérifier cooldown
    const cooldownCheck = checkCooldown(clientIP)
    if (!cooldownCheck.allowed) {
      return NextResponse.json(
        { 
          ok: false, 
          error: `Veuillez patienter ${cooldownCheck.retryAfter}s avant d'envoyer un autre message.`
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
        { ok: false, error: 'Format JSON invalide' },
        { status: 400 }
      )
    }

    const { name, email, subject, message, website } = body

    // 6. Vérifier honeypot anti-bot
    if (website) {
      // Bot détecté - retourner succès pour ne pas trahir la présence du honeypot
      return NextResponse.json({ ok: true })
    }

    // 7. Validation des champs requis
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Le nom est requis' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: 'L\'email est requis' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Le message est requis' },
        { status: 400 }
      )
    }

    // 8. Validation des longueurs
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { ok: false, error: `Le nom est trop long (max ${MAX_NAME_LENGTH} caractères)` },
        { status: 400 }
      )
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { ok: false, error: `L'email est trop long (max ${MAX_EMAIL_LENGTH} caractères)` },
        { status: 400 }
      )
    }

    if (subject && subject.length > MAX_SUBJECT_LENGTH) {
      return NextResponse.json(
        { ok: false, error: `Le sujet est trop long (max ${MAX_SUBJECT_LENGTH} caractères)` },
        { status: 400 }
      )
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { ok: false, error: `Le message est trop long (max ${MAX_MESSAGE_LENGTH} caractères)` },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { ok: false, error: 'Le message doit contenir au moins 10 caractères' },
        { status: 400 }
      )
    }

    // 9. Validation email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: 'Format email invalide' },
        { status: 400 }
      )
    }

    // 10. Sanitize inputs
    const safeName = sanitizeInput(name)
    const safeEmail = sanitizeInput(email)
    const safeSubject = sanitizeInput(subject || 'Message depuis Portfolio')
    const safeMessage = sanitizeInput(message)

    // 11. Détection spam
    if (containsSpam(safeName) || containsSpam(safeSubject) || containsSpam(safeMessage)) {
      // Retourner succès sans envoyer (ne pas aider les spammers)
      return NextResponse.json({ ok: true })
    }

    // 12. Valider les variables d'environnement (critiques)
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL
    const fromEmail = process.env.CONTACT_FROM_EMAIL

    if (!toEmail) {
      console.error('❌ CONTACT_TO_EMAIL/CONTACT_EMAIL not configured')
      return NextResponse.json(
        {
          ok: false,
          error: 'Configuration serveur: destinataire email manquant. Admin: définir CONTACT_TO_EMAIL (ou CONTACT_EMAIL).'
        },
        { status: 500 }
      )
    }

    if (!fromEmail) {
      console.error('❌ CONTACT_FROM_EMAIL not configured')
      return NextResponse.json(
        {
          ok: false,
          error: 'Configuration serveur: adresse "from" manquante. Admin: définir CONTACT_FROM_EMAIL.'
        },
        { status: 500 }
      )
    }

    if (!resolveResendApiKey()) {
      console.error('❌ RESEND_API_KEY/RESEND_KEY not configured')
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Configuration serveur: clé Resend manquante. Admin: définir RESEND_API_KEY (ou RESEND_KEY).'
        },
        { status: 500 }
      )
    }

    // 13. Envoyer email
    const emailSubject = `Portfolio - ${safeSubject}`
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin: 15px 0; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .field:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #667eea; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
          .value { color: #333; word-break: break-word; }
          .footer { font-size: 12px; color: #999; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Nouveau message du portfolio</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nom</div>
              <div class="value">${escapeHtml(safeName)}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${escapeHtml(safeEmail)}">${escapeHtml(safeEmail)}</a></div>
            </div>
            <div class="field">
              <div class="label">Sujet</div>
              <div class="value">${escapeHtml(safeSubject)}</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="value">${escapeHtml(safeMessage).replace(/\n/g, '<br>')}</div>
            </div>
            <div class="footer">
              <p><strong>Répondre:</strong> Cliquez sur "Répondre" pour envoyer un email à ${escapeHtml(safeEmail)}</p>
              <p style="margin: 10px 0 0 0;">IP: ${escapeHtml(clientIP)} | Timestamp: ${new Date().toISOString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    try {
      await sendEmailViaResend({
        fromEmail,
        toEmail,
        replyTo: safeEmail,
        subject: emailSubject,
        html: htmlBody,
      })

      // ✅ Succès
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Email envoyé de ${safeEmail} à ${toEmail}`)
      }

      return NextResponse.json({ ok: true })

    } catch (emailError) {
      // Erreur lors de l'envoi d'email
      const errorMsg = emailError.message || 'Unknown error'
      console.error('❌ Email sending error:', errorMsg)

      // Messages spécifiques pour aider au debugging
      let userError = 'Impossible d\'envoyer l\'email. Réessayez plus tard.'

      if (errorMsg.includes('verified')) {
        userError = 'Erreur config: l\'adresse "from" n\'est pas validée. Admin: vérifier Resend.'
      } else if (errorMsg.includes('unauthorized') || errorMsg.includes('invalid_api_key')) {
        userError = 'Erreur config: clé API invalide. Admin: vérifier RESEND_API_KEY.'
      } else if (errorMsg.includes('invalid_from_address')) {
        userError = 'Erreur config: adresse "from" invalide. Admin: vérifier CONTACT_FROM_EMAIL.'
      }

      return NextResponse.json(
        { ok: false, error: userError },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Unexpected error in /api/contact:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Erreur serveur inattendue. Veuillez réessayer.'
      },
      { status: 500 }
    )
  }
}

// Bloquer les autres méthodes HTTP
export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Méthode GET non autorisée. Utilisez POST.' },
    { status: 405 }
  )
}
