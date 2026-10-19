import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'

// ============================================================================
// CONFIGURATION DE SÉCURITÉ ADMIN & 2FA / OTP
// ============================================================================

const SESSION_COOKIE_NAME = 'tac_admin_session'
const SESSION_DURATION_SECONDS = 8 * 60 * 60 // 8 heures
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const OTP_EXPIRATION_SECONDS = 300 // 5 minutes de validité pour un confort d'utilisation optimal
const MAX_OTP_ATTEMPTS = 5

// Mémoire persistante sur globalThis pour survivre aux rechargements Next.js Dev
if (!globalThis.__tac_loginAttempts) {
  globalThis.__tac_loginAttempts = new Map()
}
if (!globalThis.__tac_otpChallenges) {
  globalThis.__tac_otpChallenges = new Map()
}

const loginAttemptsStore = globalThis.__tac_loginAttempts
const otpChallengesStore = globalThis.__tac_otpChallenges

/**
 * Nettoyage automatique des challenges OTP expirés
 */
setInterval(() => {
  const now = Date.now()
  for (const [id, challenge] of otpChallengesStore.entries()) {
    if (now > challenge.expiresAt + 60000) {
      otpChallengesStore.delete(id)
    }
  }
}, 30000)

/**
 * Récupère le secret de signature des sessions.
 */
let memoryFallbackSecret = null
function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET
  if (secret && secret.length >= 16) {
    return secret
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️ ADMIN_SESSION_SECRET non défini en production. Définir ADMIN_SESSION_SECRET.'
    )
  }

  if (!memoryFallbackSecret) {
    memoryFallbackSecret = crypto.randomBytes(32).toString('hex')
  }
  return memoryFallbackSecret
}

/**
 * Récupère la liste des emails autorisés pour l'administration.
 */
export function getConfiguredAdminEmails() {
  let emailSetting = (process.env.ADMIN_EMAIL || '').trim()

  if (process.env.NODE_ENV !== 'production') {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local')
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8')
        const lines = content.split(/\r?\n/)
        for (const rawLine of lines) {
          const line = rawLine.trim()
          if (line.startsWith('ADMIN_EMAIL=')) {
            emailSetting = line.slice('ADMIN_EMAIL='.length).trim().replace(/^["']|["']$/g, '')
          }
        }
      }
    } catch {
      // Ignorer les erreurs de lecture
    }
  }

  const emails = emailSetting
    ? emailSetting.split(',').map((e) => e.trim().toLowerCase())
    : []

  // Fallbacks basés sur le profil du portfolio
  const defaultEmails = [
    'taha.adnane.chiboub@gmail.com',
    't.chiboub@esisa.ac.ma',
    (process.env.CONTACT_TO_EMAIL || '').trim().toLowerCase(),
  ].filter(Boolean)

  return Array.from(new Set([...emails, ...defaultEmails]))
}

/**
 * Récupère le mot de passe ou hash configuré côté serveur.
 */
function getConfiguredAdminSecret() {
  let hash = (process.env.ADMIN_PASSWORD_HASH || '').trim()
  let password = (process.env.ADMIN_PASSWORD || '').trim()

  if (process.env.NODE_ENV !== 'production') {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local')
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8')
        const lines = content.split(/\r?\n/)
        for (const rawLine of lines) {
          const line = rawLine.trim()
          if (line.startsWith('ADMIN_PASSWORD_HASH=')) {
            hash = line.slice('ADMIN_PASSWORD_HASH='.length).trim().replace(/^["']|["']$/g, '')
          } else if (line.startsWith('ADMIN_PASSWORD=')) {
            password = line.slice('ADMIN_PASSWORD='.length).trim().replace(/^["']|["']$/g, '')
          }
        }
      }
    } catch {
      // Ignorer
    }
  }

  return {
    hash: hash || null,
    password: password || null,
  }
}

/**
 * Vérifie l'email de l'administrateur.
 */
export function verifyAdminEmail(submittedEmail) {
  if (!submittedEmail || typeof submittedEmail !== 'string') return false
  const clean = submittedEmail.trim().toLowerCase()
  const allowed = getConfiguredAdminEmails()
  return allowed.includes(clean)
}

/**
 * Vérifie le mot de passe soumis.
 */
export async function verifyAdminPassword(submittedPassword) {
  if (!submittedPassword || typeof submittedPassword !== 'string') return false

  const { hash, password } = getConfiguredAdminSecret()

  if (!hash && !password) {
    console.error('❌ ERREUR SÉCURITÉ: Aucun mot de passe admin configuré.')
    return false
  }

  const targetHash = hash || (password && /^\$2[abxy]\$/.test(password) ? password : null)
  if (targetHash) {
    try {
      return await bcrypt.compare(submittedPassword, targetHash)
    } catch (err) {
      console.error('Erreur vérification bcrypt:', err.message)
      return false
    }
  }

  try {
    const submittedDigest = crypto.createHash('sha256').update(submittedPassword).digest()
    const expectedDigest = crypto.createHash('sha256').update(password).digest()
    return crypto.timingSafeEqual(submittedDigest, expectedDigest)
  } catch {
    return false
  }
}

/**
 * Envoie un email contenant le code OTP via Resend.
 */
async function sendOtpEmail(toEmail, code, expiresIn) {
  const apiKey = (process.env.RESEND_API_KEY || process.env.RESEND_KEY || '').trim()
  const fromEmail = (process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev').trim()

  console.log(`\n======================================================`)
  console.log(`🔐 CODE DE SÉCURITÉ OTP : [ ${code} ]`)
  console.log(`Destinataire : ${toEmail}`)
  console.log(`Valide pour  : ${expiresIn} secondes (régénérable)`)
  console.log(`======================================================\n`)

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY non configurée. Le code OTP est affiché ci-dessus en console.')
    return { sent: false, note: 'Clé Resend absente - affiché en console' }
  }

  try {
    const resend = new Resend(apiKey)
    // En mode de test Resend (sans domaine personnalisé vérifié), Resend autorise uniquement l'envoi vers l'adresse du compte (t.chiboub@esisa.ac.ma)
    let recipient = toEmail
    const accountEmail = 't.chiboub@esisa.ac.ma'

    const sendEmailPayload = async (targetEmail, sender) => {
      return await resend.emails.send({
        from: sender,
        to: targetEmail,
        subject: `🔐 Code de sécurité Portfolio : ${code}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; color: #f8fafc; padding: 32px; overflow: hidden;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(96, 165, 250, 0.4); line-height: 48px; font-size: 24px;">
                🛡️
              </div>
              <h2 style="margin: 12px 0 4px; font-size: 20px; color: #ffffff;">Connexion Administrateur</h2>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">Portfolio de Chiboub Taha Adnane</p>
            </div>
            
            <div style="background: rgba(30, 41, 59, 0.7); border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #334155; margin-bottom: 24px;">
              <p style="margin: 0 0 12px; font-size: 13px; color: #cbd5e1;">Voici votre code de vérification à usage unique :</p>
              <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace; background: #020617; padding: 16px; border-radius: 8px; border: 1px solid #0284c7;">
                ${code}
              </div>
              <p style="margin: 12px 0 0; font-size: 12px; color: #94a3b8;">
                ⏱️ Ce code expire dans <strong>${expiresIn} secondes</strong> et se renouvelle automatiquement.
              </p>
            </div>

            <p style="font-size: 11px; color: #64748b; line-height: 1.5; text-align: center; margin: 0;">
              Si vous n'êtes pas à l'origine de cette demande de connexion, ignorez cet email. Votre compte est sécurisé.
            </p>
          </div>
        `,
      })
    }

    let result = await sendEmailPayload(recipient, 'onboarding@resend.dev')

    // Si Resend bloque car en mode test (seul t.chiboub@esisa.ac.ma est autorisé)
    if (result.error && recipient !== accountEmail) {
      console.warn(`ℹ️ Resend est en mode test. Envoi du code vers l'email de votre compte Resend : ${accountEmail}`)
      result = await sendEmailPayload(accountEmail, 'onboarding@resend.dev')
    }

    return { sent: !result.error, data: result.data, error: result.error?.message }
  } catch (err) {
    console.error('Erreur envoi Resend OTP:', err.message)
    return { sent: false, error: err.message }
  }
}

/**
 * Crée un challenge OTP pour l'email validé.
 */
export async function createOtpChallenge(email) {
  // Générer un code 6 chiffres sécurisé
  const code = crypto.randomInt(100000, 999999).toString()
  const challengeId = crypto.randomUUID()
  const now = Date.now()
  const expiresAt = now + OTP_EXPIRATION_SECONDS * 1000

  otpChallengesStore.set(challengeId, {
    email,
    code,
    expiresAt,
    attempts: 0,
    createdAt: now,
  })

  // Envoi de l'email OTP
  await sendOtpEmail(email, code, OTP_EXPIRATION_SECONDS)

  // Masquer l'email pour le retour UI : t***@gmail.com
  const parts = email.split('@')
  const user = parts[0]
  const domain = parts[1] || ''
  const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`
  const emailMasked = `${maskedUser}@${domain}`

  const isDev = process.env.NODE_ENV !== 'production'

  return {
    challengeId,
    emailMasked,
    expiresInSeconds: OTP_EXPIRATION_SECONDS,
    debugCode: isDev ? code : undefined,
  }
}

/**
 * Régénère un nouveau code OTP pour un challenge existant.
 */
export async function resendOtpChallenge(challengeId) {
  const challenge = otpChallengesStore.get(challengeId)
  if (!challenge) {
    return { success: false, message: 'Session expirée. Veuillez vous reconnecter.' }
  }

  const code = crypto.randomInt(100000, 999999).toString()
  const now = Date.now()
  challenge.code = code
  challenge.expiresAt = now + OTP_EXPIRATION_SECONDS * 1000
  challenge.attempts = 0

  otpChallengesStore.set(challengeId, challenge)

  await sendOtpEmail(challenge.email, code, OTP_EXPIRATION_SECONDS)

  const isDev = process.env.NODE_ENV !== 'production'

  return {
    success: true,
    expiresInSeconds: OTP_EXPIRATION_SECONDS,
    debugCode: isDev ? code : undefined,
  }
}

/**
 * Vérifie le code OTP soumis.
 */
export function verifyOtpChallenge(challengeId, submittedCode) {
  if (!challengeId || !submittedCode) {
    return { valid: false, message: 'Code manquant' }
  }

  const challenge = otpChallengesStore.get(challengeId)
  if (!challenge) {
    return { valid: false, message: 'Session de vérification expirée. Veuillez recommencer.' }
  }

  const now = Date.now()
  if (now > challenge.expiresAt) {
    return {
      valid: false,
      expired: true,
      message: 'Ce code a expiré. Cliquez sur "Régénérer" pour en recevoir un nouveau.',
    }
  }

  challenge.attempts += 1
  if (challenge.attempts > MAX_OTP_ATTEMPTS) {
    otpChallengesStore.delete(challengeId)
    return { valid: false, message: 'Trop de tentatives erronées. Veuillez vous reconnecter.' }
  }

  // Comparaison timing-safe du code 6 chiffres
  const cleanSubmitted = submittedCode.toString().trim()
  const cleanTarget = challenge.code.toString().trim()

  let matches = false
  if (cleanSubmitted.length === cleanTarget.length) {
    matches = crypto.timingSafeEqual(Buffer.from(cleanSubmitted), Buffer.from(cleanTarget))
  }

  if (!matches) {
    return { valid: false, message: 'Code de vérification incorrect' }
  }

  // Succès : détruire le challenge pour empêcher tout rejeu
  otpChallengesStore.delete(challengeId)
  return { valid: true, email: challenge.email }
}

/**
 * Protection contre les attaques par force brute sur le login.
 */
export function checkLoginRateLimit(ip) {
  const now = Date.now()
  const record = loginAttemptsStore.get(ip)

  if (record) {
    if (record.lockedUntil && now < record.lockedUntil) {
      const waitMinutes = Math.ceil((record.lockedUntil - now) / 60000)
      return {
        allowed: false,
        retryAfterMinutes: waitMinutes,
      }
    }

    if (now - record.firstAttemptAt > LOCKOUT_WINDOW_MS) {
      loginAttemptsStore.delete(ip)
    }
  }

  return { allowed: true }
}

export function recordFailedLogin(ip) {
  const now = Date.now()
  const record = loginAttemptsStore.get(ip) || {
    attempts: 0,
    firstAttemptAt: now,
    lockedUntil: null,
  }

  record.attempts += 1
  if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_WINDOW_MS
    console.warn(`🚨 Trop d'échecs de connexion admin depuis l'IP ${ip}. Verrouillage pour 15 min.`)
  }

  loginAttemptsStore.set(ip, record)
  return record
}

export function resetLoginAttempts(ip) {
  loginAttemptsStore.delete(ip)
}

/**
 * Gestion des sessions avec tokens HMAC-SHA256
 */
export function createSessionToken(userEmail = 'admin') {
  const secret = getSessionSecret()
  const payload = {
    role: 'admin',
    email: userEmail,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    jti: crypto.randomBytes(16).toString('hex'),
  }

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url')

  return `${payloadB64}.${signature}`
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return { valid: false }

  const parts = token.split('.')
  if (parts.length !== 2) return { valid: false }

  const [payloadB64, signature] = parts
  const secret = getSessionSecret()

  const expectedSignature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url')

  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return { valid: false }
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
    const now = Math.floor(Date.now() / 1000)

    if (!payload.exp || now > payload.exp) return { valid: false, expired: true }
    if (payload.role !== 'admin') return { valid: false }

    return { valid: true, payload }
  } catch {
    return { valid: false }
  }
}

export function getAdminCookieOptions(maxAgeSeconds = SESSION_DURATION_SECONDS) {
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  }
}

export function verifyAdminSession(request) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)
  if (!cookie || !cookie.value) return { authenticated: false }

  const result = verifySessionToken(cookie.value)
  if (!result.valid) return { authenticated: false, expired: result.expired }

  return { authenticated: true, session: result.payload }
}

export { SESSION_COOKIE_NAME }
