'use client'

import { useState } from 'react'
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaCheckCircle, FaExclamationTriangle, FaExternalLinkAlt, FaCopy, FaCheck } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Button from './ui/Button'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [selectedBubble, setSelectedBubble] = useState(null)
  const [copiedState, setCopiedState] = useState(null)

  const contactData = {
    email: 'taha.adnane.chiboub@gmail.com',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    github: 'https://github.com/tchiboub-dot',
    availability: 'Ouvert aux opportunites de stage et missions freelance',
  }

  const bubbles = [
    {
      id: 'email',
      icon: FaEnvelope,
      label: 'Email',
      value: 'taha.adnane.chiboub@gmail.com',
      color: 'from-blue-500 to-cyan-500',
      actions: [
        {
          label: 'Copy email',
          icon: FaCopy,
          action: () => {
            navigator.clipboard.writeText(contactData.email)
            setCopiedState('email')
            setTimeout(() => setCopiedState(null), 2000)
          },
        },
        {
          label: 'Open mail',
          icon: FaExternalLinkAlt,
          action: () => {
            window.location.href = `mailto:${contactData.email}`
          },
        },
      ],
    },
    {
      id: 'linkedin',
      icon: FaLinkedin,
      label: 'LinkedIn',
      value: 'Taha Adnane Chiboub',
      color: 'from-blue-400 to-blue-600',
      href: contactData.linkedin,
      actions: [
        {
          label: 'Open profile',
          icon: FaExternalLinkAlt,
          action: () => window.open(contactData.linkedin, '_blank'),
        },
      ],
    },
    {
      id: 'github',
      icon: FaGithub,
      label: 'GitHub',
      value: 'tchiboub-dot',
      color: 'from-slate-400 to-slate-600',
      href: contactData.github,
      actions: [
        {
          label: 'Open profile',
          icon: FaExternalLinkAlt,
          action: () => window.open(contactData.github, '_blank'),
        },
      ],
    },
  ]

  const validateForm = () => {
    const { name, email, message } = formData
    const nextErrors = {
      name: '',
      email: '',
      subject: '',
      message: '',
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName) {
      nextErrors.name = 'Le nom est requis'
    } else if (trimmedName.length > 100) {
      nextErrors.name = 'Le nom est trop long (max 100)'
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email requis'
    } else if (trimmedEmail.length > 150) {
      nextErrors.email = 'Email trop long'
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (!emailRegex.test(trimmedEmail)) {
        nextErrors.email = 'Email invalide'
      }
    }

    if (!trimmedMessage) {
      nextErrors.message = 'Le message est requis'
    } else if (trimmedMessage.length < 10) {
      nextErrors.message = 'Min 10 caracteres'
    } else if (trimmedMessage.length > 2000) {
      nextErrors.message = 'Max 2000 caracteres'
    }

    if (formData.subject && formData.subject.length > 200) {
      nextErrors.subject = 'Sujet trop long (max 200)'
    }

    const spamPatterns = /(viagra|cialis|casino|lottery)/i
    if (spamPatterns.test(trimmedName + (formData.subject || '') + trimmedMessage)) {
      setErrorMessage('Contenu suspecte')
      setFieldErrors(nextErrors)
      return false
    }

    const hasFieldError = Object.values(nextErrors).some(Boolean)
    setFieldErrors(nextErrors)

    if (hasFieldError) {
      return false
    }

    return true
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }

    if (isError) {
      setIsError(false)
      setErrorMessage('')
    }

    if (isSubmitted) {
      setIsSubmitted(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setIsError(false)
    setErrorMessage('')
    setFieldErrors({
      name: '',
      email: '',
      subject: '',
      message: '',
    })

    if (!validateForm()) {
      setIsError(true)
      setErrorMessage('Veuillez corriger les champs')
      return
    }

    setIsSubmitting(true)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          website: formData.website,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (response.ok && data.ok) {
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          website: '',
        })

        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        setIsError(true)
        setErrorMessage(data.error || 'Une erreur est survenue')
        if (process.env.NODE_ENV === 'development') {
          console.error('API error:', data)
        }
      }
    } catch (error) {
      setIsError(true)

      if (error.name === 'AbortError') {
        setErrorMessage('Timeout. Verifiez votre connexion.')
      } else if (error instanceof TypeError) {
        setErrorMessage('Impossible de contacter le serveur.')
      } else {
        setErrorMessage('Une erreur est survenue.')
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('Network error:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle
          title="Contact"
          subtitle="Ne hesitez pas a me contacter pour toute opportunite"
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-heading mb-6">
              Restons en contact
            </h3>
            <p className="text-text mb-8 leading-relaxed">
              {contactData.availability}
            </p>

            {/* Circular Glass Bubbles - Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {bubbles.map((bubble) => {
                const isSelected = selectedBubble === bubble.id
                const Icon = bubble.icon

                return (
                  <div
                    key={bubble.id}
                    className="flex flex-col items-center transition-opacity duration-300"
                  >
                    {/* Bubble Circle */}
                    <button
                      onClick={() => setSelectedBubble(isSelected ? null : bubble.id)}
                      className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-transform duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-950 ${
                        isSelected
                          ? 'scale-110 shadow-2xl shadow-blue-500/40'
                          : 'scale-100 shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                        '--tw-gradient-stops': `var(--tw-gradient-start), var(--tw-gradient-end)`,
                        '--tw-gradient-start': bubble.color.split()[1],
                        '--tw-gradient-end': bubble.color.split()[3],
                        willChange: 'transform',
                      }}
                      aria-label={`Select ${bubble.label}`}
                      aria-pressed={isSelected}
                    >
                      {/* Glass Effect Background */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/20" />
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                        <Icon className={`text-white text-3xl mb-2 transition-transform duration-300 ${
                          isSelected ? 'scale-125' : 'scale-100'
                        }`} />
                        <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                          {bubble.label}
                        </p>
                      </div>
                    </button>

                    {/* Value Text Below */}
                    <p className={`text-xs font-medium text-blue-300 text-center mt-3 transition-opacity duration-300 max-w-32 line-clamp-2 ${
                      isSelected ? 'opacity-100' : 'opacity-70'
                    }`}>
                      {bubble.value}
                    </p>

                    {/* Action Buttons - Appear when selected */}
                    {isSelected && (
                      <div className="flex flex-col gap-2 mt-4 animate-fadeIn w-full">
                        {bubble.actions.map((action, idx) => {
                          const ActionIcon = action.icon
                          return (
                            <button
                              key={idx}
                              onClick={action.action}
                              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-xs font-medium transition-colors duration-300 backdrop-blur-sm"
                              title={action.label}
                            >
                              {copiedState === bubble.id && action.icon === FaCopy ? (
                                <>
                                  <FaCheck className="w-3 h-3" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <ActionIcon className="w-3 h-3" />
                                  <span>{action.label}</span>
                                </>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="bg-gradient-to-br from-primary to-accent text-white p-6 rounded-card shadow-medium">
              <h4 className="text-xl font-semibold mb-3">Vous avez un projet ?</h4>
              <p className="mb-4">
                Je suis disponible pour des stages, missions freelance et collaborations.
              </p>
              <div className="flex gap-2 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">Stage</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Freelance</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Collaboration</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-heading mb-2">
              Envoyez-moi un message
            </h3>
            <p className="text-sm text-muted mb-6">
              ⏱️ Réponse sous 24-48h en moyenne
            </p>

            {isSubmitted && (
              <Card hover={false} className="bg-success/10 border-success/30 text-center mb-6">
                <FaCheckCircle className="text-5xl text-success mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-success mb-2">
                  Message envoye
                </h4>
                <p className="text-text">
                  Merci. Je vous repondrai rapidement.
                </p>
              </Card>
            )}

            {isError && (
              <Card 
                hover={false} 
                className="bg-danger/10 border-danger/30 mb-6"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-2xl text-danger flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h4 className="font-semibold text-danger mb-1">
                      Erreur
                    </h4>
                    <p className="text-text text-sm">{errorMessage}</p>
                  </div>
                </div>
              </Card>
            )}

            <Card hover={false}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor="website">Do not fill</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-heading font-semibold mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-surface border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text placeholder-muted transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.name ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="Votre nom"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  />
                  {fieldErrors.name && (
                    <p id="name-error" className="mt-1 text-xs text-danger">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-heading font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-surface border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text placeholder-muted transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.email ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="votre.email@exemple.com"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="mt-1 text-xs text-danger">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-heading font-semibold mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={200}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-surface border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text placeholder-muted transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.subject ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="Sujet de votre message"
                    aria-invalid={!!fieldErrors.subject}
                    aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                  />
                  {fieldErrors.subject && (
                    <p id="subject-error" className="mt-1 text-xs text-danger">{fieldErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-heading font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    minLength={10}
                    maxLength={2000}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-surface border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text placeholder-muted transition-all duration-normal resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.message ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="Votre message..."
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                  ></textarea>
                  {fieldErrors.message && (
                    <p id="message-error" className="mt-1 text-xs text-danger">{fieldErrors.message}</p>
                  )}
                  <div className="text-right text-xs text-muted mt-1">
                    {formData.message.length} / 2000
                  </div>
                </div>

                <p className="text-xs text-muted">
                  Vos donnees sont protegees et cryptees en transit.
                </p>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2" aria-hidden="true">...</span>
                      Envoi en cours
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
