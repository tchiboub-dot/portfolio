'use client'

import { useState, useEffect, useRef } from 'react'
import {
  FaLock,
  FaTimes,
  FaShieldAlt,
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
  FaServer,
  FaCheckCircle,
  FaEnvelope,
  FaRedo,
  FaArrowLeft,
  FaKey,
} from 'react-icons/fa'
import CmsManager from './CmsManager'

export default function AdminModal({ isOpen, onClose }) {
  // Navigation des étapes : 'login' | 'otp' | 'dashboard'
  const [step, setStep] = useState('login')
  
  // Champs formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  
  // États 2FA
  const [challengeId, setChallengeId] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [debugCode, setDebugCode] = useState('')
  
  // États de chargement & erreurs
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [adminData, setAdminData] = useState(null)
  
  // Références d'inputs
  const emailInputRef = useRef(null)
  const otpInputRefs = useRef([])
  const timerRef = useRef(null)

  // Vérifier si une session active existe déjà à l'ouverture
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    setError(null)

    const checkExistingSession = async () => {
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
      }
    }

    checkExistingSession()
  }, [isOpen])

  // Compte à rebours pour la régénération du code (style Google Authenticator)
  useEffect(() => {
    if (step === 'otp') {
      if (timerRef.current) clearInterval(timerRef.current)

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [step])

  // Récupérer les données du tableau de bord
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

  // Étape 1 : Soumission Email + Mot de passe
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
        if (data.debugCode) {
          setDebugCode(data.debugCode)
        }
        setStep('otp')
        setTimeout(() => otpInputRefs.current[0]?.focus(), 200)
      } else {
        setError(data.message || 'Identifiants invalides')
      }
    } catch {
      setError('Erreur de connexion au serveur d\'authentification')
    } finally {
      setLoading(false)
    }
  }

  // Gestion des 6 cases du code OTP
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newDigits = [...otpDigits]
    newDigits[index] = value.slice(-1)
    setOtpDigits(newDigits)

    // Focus automatique sur la case suivante
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }

    // Si tous les 6 chiffres sont saisis, déclencher la validation automatique
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

  // Étape 2 : Vérification du code OTP
  const verifyOtpCode = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('')
    if (code.length !== 6) {
      setError('Veuillez entrer les 6 chiffres du code de sécurité')
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
        setError(data.message || 'Code de vérification incorrect ou expiré')
        if (data.expired) {
          setCountdown(0)
        }
      }
    } catch {
      setError('Erreur lors de la validation du code')
    } finally {
      setLoading(false)
    }
  }

  // Régénération du code (comme Google Authenticator)
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
        if (data.debugCode) {
          setDebugCode(data.debugCode)
        }
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
      } else {
        setError(data.message || 'Impossible de régénérer le code')
      }
    } catch {
      setError('Erreur lors de la demande de renouvellement du code')
    } finally {
      setLoading(false)
    }
  }

  // Déconnexion
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

  if (!isOpen) return null

  // Calcul du ratio du timer circulaire (style Google Authenticator)
  const circleCircumference = 2 * Math.PI * 18
  const strokeDashoffset = circleCircumference - (countdown / 60) * circleCircumference

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dialog-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={`relative w-full ${step === 'dashboard' ? 'max-w-2xl' : 'max-w-md'} bg-slate-900/95 border border-blue-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 transition-all max-h-[90vh] overflow-y-auto`}>
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 rounded-lg"
          aria-label="Fermer"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* ================================================================ */}
        {/* ÉTAPE 1 : IDENTIFIANTS (GMAIL + MOT DE PASSE) */}
        {/* ================================================================ */}
        {step === 'login' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <FaShieldAlt className="w-5 h-5" />
              </div>
              <div>
                <h2 id="admin-dialog-title" className="text-xl font-bold text-white">
                  Espace Administrateur
                </h2>
                <p className="text-xs text-slate-400">Connexion sécurisée en 2 étapes</p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Champ Gmail / Email */}
              <div>
                <label htmlFor="admin-email" className="block text-xs font-medium text-slate-300 mb-2">
                  Adresse Gmail / Email Administrateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    ref={emailInputRef}
                    id="admin-email"
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

              {/* Champ Mot de passe */}
              <div>
                <label htmlFor="admin-pass" className="block text-xs font-medium text-slate-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-pass"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
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

        {/* ================================================================ */}
        {/* ÉTAPE 2 : VÉRIFICATION OTP 2FA (STYLE GOOGLE AUTHENTICATOR) */}
        {/* ================================================================ */}
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

              {/* Minuteur circulaire style Google Authenticator */}
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

            <p className="text-xs text-slate-300 mb-4 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
              Un code à 6 chiffres a été envoyé à votre adresse{' '}
              <strong className="text-cyan-300 font-mono">{maskedEmail}</strong>. Il expire et se renouvelle régulièrement comme Google Authenticator.
            </p>

            {debugCode && (
              <div className="mb-4 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-between text-xs text-cyan-300">
                <span>Code local (dev) : <strong className="font-mono text-sm text-white tracking-widest">{debugCode}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    const digits = debugCode.split('')
                    setOtpDigits(digits)
                    verifyOtpCode(debugCode)
                  }}
                  className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-white font-medium text-[11px]"
                >
                  Remplir
                </button>
              </div>
            )}

            {/* 6 Cases OTP */}
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

            {/* Bouton Régénérer / Renvoyer le code */}
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

        {/* ================================================================ */}
        {/* ÉTAPE 3 : TABLEAU DE BORD CONNECTÉ & CMS */}
        {/* ================================================================ */}
        {step === 'dashboard' && (
          <div className="space-y-5">
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

            {adminData && (
              <div className="space-y-2 bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-blue-300 pb-1.5 border-b border-slate-700/60">
                  <FaServer className="w-3 h-3" /> Sécurité & Serveur
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div>
                    <span>Environnement: </span>
                    <span className="font-mono text-slate-200">{adminData.environment}</span>
                  </div>
                  <div>
                    <span>Service Resend: </span>
                    <span className={adminData.emailConfigured ? 'text-emerald-400' : 'text-amber-400'}>
                      {adminData.emailConfigured ? 'Actif' : 'Non configuré'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
