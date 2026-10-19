'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  FaLock,
  FaShieldAlt,
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
  FaServer,
  FaCheckCircle,
  FaArrowLeft,
  FaEnvelope,
  FaRedo,
  FaKey,
} from 'react-icons/fa'
import CmsManager from '@/components/admin/CmsManager'

export default function AdminPage() {
  const [step, setStep] = useState('login') // 'login' | 'otp' | 'dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])

  const [challengeId, setChallengeId] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [countdown, setCountdown] = useState(60)

  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState(null)
  const [adminData, setAdminData] = useState(null)

  const emailInputRef = useRef(null)
  const otpInputRefs = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('/api/admin/session')
        if (res.ok) {
          setStep('dashboard')
          fetchDashboardData()
        } else {
          setStep('login')
          setTimeout(() => emailInputRef.current?.focus(), 150)
        }
      } catch {
        setStep('login')
      } finally {
        setCheckingSession(false)
      }
    }

    verifySession()
  }, [])

  useEffect(() => {
    if (step === 'otp') {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setCountdown((prev) => (prev <= 1 ? 0 : prev - 1))
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [step])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      if (res.ok) {
        const data = await res.json()
        setAdminData(data.data)
      }
    } catch (err) {
      console.error('Erreur dashboard:', err)
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Veuillez renseigner votre email et mot de passe')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (res.ok && data.requireOtp) {
        setChallengeId(data.challengeId)
        setMaskedEmail(data.emailMasked)
        setCountdown(data.expiresInSeconds || 60)
        setOtpDigits(['', '', '', '', '', ''])
        setStep('otp')
        setTimeout(() => otpInputRefs.current[0]?.focus(), 200)
      } else {
        setError(data.message || 'Identifiants invalides')
      }
    } catch {
      setError('Erreur lors de la tentative de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...otpDigits]
    newDigits[index] = value.slice(-1)
    setOtpDigits(newDigits)

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }

    const fullCode = newDigits.join('')
    if (fullCode.length === 6) {
      verifyOtpCode(fullCode)
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length > 0) {
      const newDigits = [...otpDigits]
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i]
      }
      setOtpDigits(newDigits)
      if (pasted.length === 6) {
        verifyOtpCode(pasted)
      } else {
        otpInputRefs.current[Math.min(pasted.length, 5)]?.focus()
      }
    }
  }

  const verifyOtpCode = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('')
    if (code.length !== 6) {
      setError('Veuillez entrer les 6 chiffres du code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, otp: code }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStep('dashboard')
        fetchDashboardData()
      } else {
        setError(data.message || 'Code incorrect ou expiré')
        if (data.expired) setCountdown(0)
      }
    } catch {
      setError('Erreur lors de la validation du code')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/otp/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setCountdown(data.expiresInSeconds || 60)
        setOtpDigits(['', '', '', '', '', ''])
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
      } else {
        setError(data.message || 'Impossible de régénérer le code')
      }
    } catch {
      setError('Erreur lors de la demande de renouvellement')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setStep('login')
      setPassword('')
      setOtpDigits(['', '', '', '', '', ''])
      setAdminData(null)
    } catch {
      // Ignorer
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span>Vérification de la session...</span>
        </div>
      </div>
    )
  }

  const circleCircumference = 2 * Math.PI * 18
  const strokeDashoffset = circleCircumference - (countdown / 60) * circleCircumference

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className={`w-full ${step === 'dashboard' ? 'max-w-3xl' : 'max-w-md'} bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative transition-all`}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors mb-6"
        >
          <FaArrowLeft /> Retour au site public
        </Link>

        {step === 'login' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <FaShieldAlt className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Administration</h1>
                <p className="text-xs text-slate-400">Accès restreint en 2 étapes</p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-page-email" className="block text-xs font-medium text-slate-300 mb-2">
                  Adresse Gmail / Email Administrateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    ref={emailInputRef}
                    id="admin-page-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="taha.adnane.chiboub@gmail.com"
                    autoComplete="username"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-page-pass" className="block text-xs font-medium text-slate-300 mb-2">
                  Mot de passe d&apos;administration
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-page-pass"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe secret"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-3 bg-slate-800/80 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Vérification...</span>
                ) : (
                  <>
                    <FaKey className="w-4 h-4" />
                    <span>Continuer vers la vérification OTP</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div>
            <button
              onClick={() => {
                setStep('login')
                setError(null)
              }}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 mb-4 transition-colors"
            >
              <FaArrowLeft /> Retour aux identifiants
            </button>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <FaKey className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Vérification en 2 étapes</h2>
                  <p className="text-xs text-slate-400">Code de sécurité OTP</p>
                </div>
              </div>

              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-11 h-11 transform -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="3"
                    className={countdown > 15 ? 'text-cyan-400 transition-all duration-1000' : 'text-amber-400 transition-all duration-1000'}
                    fill="transparent"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[11px] font-mono font-bold text-slate-200">
                  {countdown}s
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
              Un code à 6 chiffres a été envoyé à{' '}
              <strong className="text-cyan-300 font-mono">{maskedEmail}</strong>.
            </p>

            <div className="flex justify-between gap-2 mb-6" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={loading}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-2xl font-bold font-mono bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 rounded-xl text-white outline-none transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-4 animate-shake">
                {error}
              </div>
            )}

            <button
              onClick={() => verifyOtpCode()}
              disabled={loading || otpDigits.join('').length !== 6}
              className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 text-sm disabled:opacity-40 flex items-center justify-center gap-2 mb-3"
            >
              {loading ? <span>Vérification...</span> : <span>Valider le code de sécurité</span>}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <FaRedo className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Régénérer un nouveau code OTP</span>
              </button>
            </div>
          </div>
        )}

        {step === 'dashboard' && (
          <div className="space-y-6">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FaCheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="font-medium">Session Administrateur active</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-colors"
              >
                <FaSignOutAlt className="w-3 h-3" />
                <span>Déconnexion</span>
              </button>
            </div>

            {/* Content Management System (Projets, Profil, Export) */}
            <CmsManager />

            {adminData ? (
              <div className="space-y-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-xs">
                <div className="flex items-center gap-2 font-semibold text-blue-300 pb-2 border-b border-slate-700">
                  <FaServer /> Paramètres & Surveillance
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Heure serveur :</span>
                  <span className="font-mono text-slate-200">
                    {new Date(adminData.serverTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Environnement :</span>
                  <span className="font-mono text-slate-200">{adminData.environment}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Email Resend :</span>
                  <span className={adminData.emailConfigured ? 'text-emerald-400' : 'text-amber-400'}>
                    {adminData.emailConfigured ? 'Opérationnel' : 'Non configuré'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Mode authentification :</span>
                  <span className="font-mono text-cyan-300">{adminData.adminAuthMode}</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
