import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'portfolio_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8
const attempts = new Map()

function secret() {
  const value = process.env.AUTH_SECRET?.trim()
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters')
  return value
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url')
}

function makeToken(email) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function verifyToken(token) {
  if (!token) return null
  const [payload, signature] = token.split('.')
  const expected = payload ? sign(payload) : ''
  if (!payload || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  return data.exp > Date.now() ? data : null
}

export async function authenticateAdmin(email, password, ip = 'unknown') {
  const now = Date.now()
  const record = attempts.get(ip) || { count: 0, lockedUntil: 0 }
  if (record.lockedUntil > now) return { ok: false, retryAfter: Math.ceil((record.lockedUntil - now) / 1000) }

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim()
  const validPassword = passwordHash ? await bcrypt.compare(password, passwordHash) : false
  const valid = Boolean(configuredEmail && email.trim().toLowerCase() === configuredEmail && validPassword)

  if (!valid) {
    const count = record.count + 1
    attempts.set(ip, count >= 5 ? { count: 0, lockedUntil: now + 15 * 60 * 1000 } : { count, lockedUntil: 0 })
    return { ok: false }
  }

  attempts.delete(ip)
  return { ok: true, token: makeToken(configuredEmail) }
}

export function setAdminSession(token) {
  cookies().set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: SESSION_TTL_SECONDS, path: '/' })
}

export function clearAdminSession() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 0, path: '/' })
}

export function getAdminSession() {
  return verifyToken(cookies().get(COOKIE_NAME)?.value)
}

export function requireAdmin() {
  const session = getAdminSession()
  if (!session) throw new Error('UNAUTHORIZED')
  return session
}
