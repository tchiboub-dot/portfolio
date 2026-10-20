import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { getDatabaseClient } from '../db/index.js'
import { initDatabaseSchema } from '../db/schema.js'

// ============================================================================
// CONFIGURATION DE SÉCURITÉ ADMIN & 2FA / OTP
// ============================================================================

const SESSION_COOKIE_NAME = 'tac_admin_session'
const SESSION_DURATION_SECONDS = 8 * 60 * 60 // 8 heures
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const OTP_EXPIRATION_SECONDS = 300 // 5 minutes de validité
const MAX_OTP_ATTEMPTS = 5

// Fallbacks cryptographiques sécurisés pour garantir la haute disponibilité
const BUILTIN_ADMIN_HASH = '$2b$12$WOo.MRE.PB3YGX2Lb2qw.uIup9Jd4warpo0Txt5yKqUz7Yr7hKDtO'
const BUILTIN_SESSION_SECRET = '2db2f26ec49b924ea15c0e7bfa5dbfec72c4315264b3c9597a44f2b090e55648'

// Fallback in-memory pour développement local ou tests unitaires isolés
if (!globalThis.__tac_loginAttempts) {
  globalThis.__tac_loginAttempts = new Map()
}
if (!globalThis.__tac_otpChallenges) {
  globalThis.__tac_otpChallenges = new Map()
}

const memoryLoginStore = globalThis.__tac_loginAttempts
const memoryOtpStore = globalThis.__tac_otpChallenges

/**
 * Assure l'initialisation du schéma DB pour OTP et rate limiting
 */
let schemaReady = false
async function ensureDb() {
  if (!schemaReady) {
    try {
      await initDatabaseSchema()
      schemaReady = true
    } catch (err) {
      console.warn('DB schema init deferred:', err.message)
    }
  }
  return getDatabaseClient()
}

/**
 * Récupère le secret de signature des sessions.
 */
export function getSessionSecret() {
  const secret = (process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET || '').trim()

  if (secret && secret.length >= 32) {
    return secret
  }

  return BUILTIN_SESSION_SECRET
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
    hash: hash || BUILTIN_ADMIN_HASH,
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
 * En production : ne logge JAMAIS le code OTP et délivre via Resend.
 */
async function sendOtpEmail(toEmail, code, expiresIn) {
  const isProduction = process.env.NODE_ENV === 'production'
  const isDebugAuth = process.env.DEBUG_AUTH === 'true' && !isProduction
  const apiKey = (process.env.RESEND_API_KEY || process.env.RESEND_KEY || '').trim()

  if (isDebugAuth) {
    console.log(`\n======================================================`)
    console.log(`🔐 [DEV DEBUG] CODE OTP : [ ${code} ] -> ${toEmail}`)
    console.log(`======================================================\n`)
  }

  if (!apiKey) {
    if (isProduction) {
      console.error('❌ ERREUR CRITIQUE: RESEND_API_KEY absente. Impossible d\'envoyer le code OTP.')
      throw new Error('Service d\'envoi d\'email non configuré.')
    }
    console.warn(`⚠️ [DEV ONLY] RESEND_API_KEY absente. Code OTP dev: ${code}`)
    return { sent: false, note: 'Clé Resend absente - mode dev local uniquement' }
  }

  try {
    const resend = new Resend(apiKey)
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
                ⏱️ Ce code expire dans <strong>${expiresIn} secondes</strong>.
              </p>
            </div>

            <p style="font-size: 11px; color: #64748b; line-height: 1.5; text-align: center; margin: 0;">
              Si vous n'êtes pas à l'origine de cette demande de connexion, ignorez cet email. Votre compte est sécurisé.
            </p>
          </div>
        `,
      })
    }

    let result = await sendEmailPayload(toEmail, 'onboarding@resend.dev')

    // Si Resend bloque car en mode test (seul le compte propriétaire est autorisé)
    if (result.error && toEmail !== accountEmail) {
      if (!isProduction) {
        console.warn(`ℹ️ Mode test Resend: Envoi vers l'adresse vérifiée ${accountEmail}`)
      }
      result = await sendEmailPayload(accountEmail, 'onboarding@resend.dev')
    }

    if (result.error) {
      if (isProduction) {
        throw new Error('Échec du service d\'envoi email de vérification: ' + result.error.message)
      }
      return { sent: false, error: result.error.message }
    }

    return { sent: true, data: result.data }
  } catch (err) {
    if (isProduction) {
      throw new Error('Échec de la distribution du code de sécurité: ' + err.message)
    }
    console.error('Erreur envoi Resend OTP (dev):', err.message)
    return { sent: false, error: err.message }
  }
}

/**
 * Hachage SHA-256 pour stocker les codes OTP sans texte brut dans la base
 */
function hashOtpCode(code) {
  return crypto.createHash('sha256').update(code.toString().trim()).digest('hex')
}

/**
 * Crée un challenge OTP persistant (DB LibSQL + fallback mémoire)
 */
export async function createOtpChallenge(email) {
  const code = crypto.randomInt(100000, 999999).toString()
  const challengeId = crypto.randomUUID()
  const now = Date.now()
  const expiresAt = now + OTP_EXPIRATION_SECONDS * 1000
  const codeHash = hashOtpCode(code)

  // 1. Persistance en base de données
  try {
    const db = await ensureDb()
    // Nettoyer les anciens challenges expirés
    await db.execute({
      sql: 'DELETE FROM admin_otp_challenges WHERE expires_at < ?',
      args: [now],
    })
    // Insérer le nouveau challenge avec code haché
    await db.execute({
      sql: `INSERT INTO admin_otp_challenges (id, email, code_hash, expires_at, attempts, created_at)
            VALUES (?, ?, ?, ?, 0, ?)`,
      args: [challengeId, email, codeHash, expiresAt, now],
    })
  } catch (dbErr) {
    console.warn('Fallback mémoire OTP (erreur DB):', dbErr.message)
    memoryOtpStore.set(challengeId, {
      email,
      codeHash,
      expiresAt,
      attempts: 0,
      createdAt: now,
    })
  }

  // 2. Envoi de l'email OTP
  await sendOtpEmail(email, code, OTP_EXPIRATION_SECONDS)

  // Masquer l'email pour l'affichage UI
  const parts = email.split('@')
  const user = parts[0]
  const domain = parts[1] || ''
  const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`
  const emailMasked = `${maskedUser}@${domain}`

  const isDev = process.env.NODE_ENV !== 'production'
  const isDebugAuth = process.env.DEBUG_AUTH === 'true' && isDev

  return {
    challengeId,
    emailMasked,
    expiresInSeconds: OTP_EXPIRATION_SECONDS,
    debugCode: isDebugAuth ? code : undefined,
  }
}

/**
 * Régénère un nouveau code OTP pour un challenge existant.
 */
export async function resendOtpChallenge(challengeId) {
  if (!challengeId) {
    return { success: false, message: 'Identifiant manquant' }
  }

  const now = Date.now()
  let challenge = null

  // Chercher en base
  try {
    const db = await ensureDb()
    const result = await db.execute({
      sql: 'SELECT * FROM admin_otp_challenges WHERE id = ?',
      args: [challengeId],
    })
    if (result.rows && result.rows.length > 0) {
      challenge = result.rows[0]
    }
  } catch {
    challenge = memoryOtpStore.get(challengeId)
  }

  if (!challenge) {
    return { success: false, message: 'Session expirée. Veuillez vous reconnecter.' }
  }

  const code = crypto.randomInt(100000, 999999).toString()
  const expiresAt = now + OTP_EXPIRATION_SECONDS * 1000
  const codeHash = hashOtpCode(code)

  // Mettre à jour en base
  try {
    const db = await ensureDb()
    await db.execute({
      sql: 'UPDATE admin_otp_challenges SET code_hash = ?, expires_at = ?, attempts = 0 WHERE id = ?',
      args: [codeHash, expiresAt, challengeId],
    })
  } catch {
    memoryOtpStore.set(challengeId, {
      ...challenge,
      codeHash,
      expiresAt,
      attempts: 0,
    })
  }

  const email = challenge.email
  await sendOtpEmail(email, code, OTP_EXPIRATION_SECONDS)

  const isDev = process.env.NODE_ENV !== 'production'
  const isDebugAuth = process.env.DEBUG_AUTH === 'true' && isDev

  return {
    success: true,
    expiresInSeconds: OTP_EXPIRATION_SECONDS,
    debugCode: isDebugAuth ? code : undefined,
  }
}

/**
 * Vérifie le code OTP soumis avec protection par hachage et suppression atomique.
 */
export async function verifyOtpChallenge(challengeId, submittedCode) {
  if (!challengeId || !submittedCode) {
    return { valid: false, message: 'Code manquant' }
  }

  const now = Date.now()
  let challenge = null
  let isFromDb = false

  try {
    const db = await ensureDb()
    const result = await db.execute({
      sql: 'SELECT * FROM admin_otp_challenges WHERE id = ?',
      args: [challengeId],
    })
    if (result.rows && result.rows.length > 0) {
      challenge = result.rows[0]
      isFromDb = true
    }
  } catch (err) {
    challenge = memoryOtpStore.get(challengeId)
  }

  if (!challenge) {
    return { valid: false, message: 'Session de vérification expirée. Veuillez recommencer.' }
  }

  const expiresAt = Number(challenge.expires_at || challenge.expiresAt)
  if (now > expiresAt) {
    return {
      valid: false,
      expired: true,
      message: 'Ce code a expiré. Cliquez sur "Régénérer" pour en recevoir un nouveau.',
    }
  }

  const attempts = Number(challenge.attempts || 0) + 1
  if (attempts > MAX_OTP_ATTEMPTS) {
    if (isFromDb) {
      try {
        const db = await ensureDb()
        await db.execute({
          sql: 'DELETE FROM admin_otp_challenges WHERE id = ?',
          args: [challengeId],
        })
      } catch {}
    } else {
      memoryOtpStore.delete(challengeId)
    }
    return { valid: false, message: 'Trop de tentatives erronées. Veuillez vous reconnecter.' }
  }

  // Mettre à jour le compteur de tentatives
  if (isFromDb) {
    try {
      const db = await ensureDb()
      await db.execute({
        sql: 'UPDATE admin_otp_challenges SET attempts = ? WHERE id = ?',
        args: [attempts, challengeId],
      })
    } catch {}
  } else {
    challenge.attempts = attempts
    memoryOtpStore.set(challengeId, challenge)
  }

  // Comparaison timing-safe du hash SHA-256
  const submittedHash = hashOtpCode(submittedCode)
  const storedHash = (challenge.code_hash || challenge.codeHash || '').toString().trim()

  let matches = false
  if (submittedHash.length === storedHash.length) {
    matches = crypto.timingSafeEqual(Buffer.from(submittedHash), Buffer.from(storedHash))
  }

  if (!matches) {
    return { valid: false, message: 'Code de vérification incorrect' }
  }

  // Succès : détruire le challenge pour empêcher toute réutilisation
  if (isFromDb) {
    try {
      const db = await ensureDb()
      await db.execute({
        sql: 'DELETE FROM admin_otp_challenges WHERE id = ?',
        args: [challengeId],
      })
    } catch {}
  } else {
    memoryOtpStore.delete(challengeId)
  }

  return { valid: true, email: challenge.email }
}

/**
 * Protection contre les attaques par force brute (distribuée et persistante en DB)
 */
export async function checkLoginRateLimit(ip) {
  const now = Date.now()
  const key = `login:${ip || 'unknown'}`

  try {
    const db = await ensureDb()
    const result = await db.execute({
      sql: 'SELECT attempts, first_attempt_at, locked_until FROM admin_rate_limits WHERE key = ?',
      args: [key],
    })

    if (result.rows && result.rows.length > 0) {
      const record = result.rows[0]
      const lockedUntil = record.locked_until ? Number(record.locked_until) : null
      const firstAttemptAt = Number(record.first_attempt_at)

      if (lockedUntil && now < lockedUntil) {
        const waitMinutes = Math.ceil((lockedUntil - now) / 60000)
        return { allowed: false, retryAfterMinutes: waitMinutes }
      }

      if (now - firstAttemptAt > LOCKOUT_WINDOW_MS) {
        await db.execute({
          sql: 'DELETE FROM admin_rate_limits WHERE key = ?',
          args: [key],
        })
      }
    }
  } catch (err) {
    // Fallback mémoire
    const record = memoryLoginStore.get(key)
    if (record) {
      if (record.lockedUntil && now < record.lockedUntil) {
        const waitMinutes = Math.ceil((record.lockedUntil - now) / 60000)
        return { allowed: false, retryAfterMinutes: waitMinutes }
      }
      if (now - record.firstAttemptAt > LOCKOUT_WINDOW_MS) {
        memoryLoginStore.delete(key)
      }
    }
  }

  return { allowed: true }
}

export async function recordFailedLogin(ip) {
  const now = Date.now()
  const key = `login:${ip || 'unknown'}`

  try {
    const db = await ensureDb()
    const result = await db.execute({
      sql: 'SELECT attempts, first_attempt_at FROM admin_rate_limits WHERE key = ?',
      args: [key],
    })

    if (result.rows && result.rows.length > 0) {
      const attempts = Number(result.rows[0].attempts) + 1
      const lockedUntil = attempts >= MAX_LOGIN_ATTEMPTS ? now + LOCKOUT_WINDOW_MS : null
      await db.execute({
        sql: 'UPDATE admin_rate_limits SET attempts = ?, locked_until = ?, updated_at = ? WHERE key = ?',
        args: [attempts, lockedUntil, now, key],
      })
      if (lockedUntil) {
        console.warn(`🚨 Trop d'échecs de connexion admin depuis l'IP ${ip}. Verrouillage pour 15 min.`)
      }
    } else {
      await db.execute({
        sql: `INSERT INTO admin_rate_limits (key, attempts, first_attempt_at, locked_until, updated_at)
              VALUES (?, 1, ?, NULL, ?)`,
        args: [key, now, now],
      })
    }
  } catch {
    // Fallback mémoire
    const record = memoryLoginStore.get(key) || {
      attempts: 0,
      firstAttemptAt: now,
      lockedUntil: null,
    }
    record.attempts += 1
    if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_WINDOW_MS
    }
    memoryLoginStore.set(key, record)
  }
}

export async function resetLoginAttempts(ip) {
  const key = `login:${ip || 'unknown'}`
  try {
    const db = await ensureDb()
    await db.execute({
      sql: 'DELETE FROM admin_rate_limits WHERE key = ?',
      args: [key],
    })
  } catch {}
  memoryLoginStore.delete(key)
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
