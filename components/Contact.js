'use client'

import { useState } from 'react'
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaDownload } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Button from './ui/Button'

// ── Email validation ─────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/

const DOMAIN_TYPOS = {
  'gemail.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gnail.com': 'gmail.com',
  'hotnail.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hootmail.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outook.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outloook.com': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'protonmai.com': 'protonmail.com',
  'protonmal.com': 'protonmail.com',
}

function validateEmail(email) {
  const trimmed = email.trim()
  if (!trimmed) {
    return { valid: false, error: 'Email is required.', suggestion: null }
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid email address. Please enter a valid email such as example@gmail.com.',
      suggestion: null,
    }
  }
  const domain = trimmed.split('@')[1].toLowerCase()
  if (DOMAIN_TYPOS[domain]) {
    const local = trimmed.split('@')[0]
    const corrected = `${local}@${DOMAIN_TYPOS[domain]}`
    return {
      valid: false,
      error: `Email domain looks incorrect. Did you mean ${corrected}?`,
      suggestion: corrected,
    }
  }
  return { valid: true, error: null, suggestion: null }
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', title: '', detail: '' })
  const [emailError, setEmailError] = useState('')

  const contactData = {
    email: 'taha.adnane.chiboub@gmail.com',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    github: 'https://github.com/tchiboub-dot',
    cvPath: '/cv-taha-adnane-chiboub.pdf',
  }

  const quickContacts = [
    { label: 'Email', icon: FaEnvelope, href: `mailto:${contactData.email}` },
    { label: 'LinkedIn', icon: FaLinkedin, href: contactData.linkedin },
    { label: 'GitHub', icon: FaGithub, href: contactData.github },
  ]

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (status.type) setStatus({ type: '', title: '', detail: '' })
    if (name === 'email' && emailError) setEmailError('')
  }

  const onEmailBlur = () => {
    if (!formData.email) return
    const result = validateEmail(formData.email)
    if (!result.valid) setEmailError(result.error)
  }

  const applyEmailSuggestion = (suggestion) => {
    setFormData((prev) => ({ ...prev, email: suggestion }))
    setEmailError('')
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    // Client-side email validation before sending
    const emailResult = validateEmail(formData.email)
    if (!emailResult.valid) {
      setEmailError(emailResult.error)
      setStatus({
        type: 'error',
        title: 'Please fix the email field before sending.',
        detail: emailResult.error,
      })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: '', title: '', detail: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        setStatus({
          type: 'success',
          title: 'Your message has been sent successfully.',
          detail: 'Thank you for reaching out. I will get back to you soon.',
        })
        setFormData({ name: '', email: '', subject: '', message: '', website: '' })
      } else {
        setStatus({
          type: 'error',
          title: 'Failed to send message.',
          detail: data?.error ? `${data.error} Please try again.` : 'Please try again.',
        })
      }
    } catch {
      setStatus({
        type: 'error',
        title: 'Failed to send message.',
        detail: 'Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle
          title="Contact"
          subtitle="Open to internships, collaboration, and product-focused freelance opportunities"
          align="center"
        />

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mt-10">
          <Card>
            <h3 className="text-2xl font-bold text-heading mb-4">Let&apos;s connect</h3>
            <p className="text-text leading-relaxed mb-6">
              Reach out for internships, collaboration opportunities, or to discuss how I can contribute to your next product.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-6">
              {quickContacts.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.label === 'Email' ? '_self' : '_blank'}
                    rel={item.label === 'Email' ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-blue-400/35 text-blue-100 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.12)] hover:bg-blue-500/20 hover:scale-105 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.22),0_0_24px_rgba(59,130,246,0.24)] active:scale-95 transition-all duration-300"
                    aria-label={item.label}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
              <a
                href={contactData.cvPath}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-cyan-400/40 text-cyan-100 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.12)] hover:bg-cyan-500/20 hover:scale-105 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_24px_rgba(34,211,238,0.2)] active:scale-95 transition-all duration-300"
                aria-label="Download CV"
                title="Download CV"
              >
                <FaDownload className="w-6 h-6" />
              </a>
            </div>

            <p className="text-sm text-blue-200/85 mt-5">Response time: usually within 24 hours.</p>
          </Card>

          <Card
            hover={false}
            className={`transition-all duration-300 ${
              status.type === 'success'
                ? 'border-green-400/45 shadow-[0_0_0_1px_rgba(74,222,128,0.26),0_0_26px_rgba(74,222,128,0.22)]'
                : status.type === 'error' || emailError
                ? 'border-red-400/45 shadow-[0_0_0_1px_rgba(248,113,113,0.26),0_0_26px_rgba(248,113,113,0.2)]'
                : ''
            }`}
          >
            <h3 className="text-2xl font-bold text-heading mb-5">Professional contact form</h3>

            {status.type && (
              <div
                role="alert"
                aria-live="polite"
                className={`mb-4 p-3 rounded-xl border text-sm alert-slide-fade ${
                  status.type === 'success'
                    ? 'bg-green-500/15 border-green-400/30 text-green-100'
                    : 'bg-red-500/15 border-red-400/30 text-red-100'
                }`}
              >
                <p className="font-semibold">{status.title}</p>
                {status.detail && <p className="mt-1 opacity-90">{status.detail}</p>}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="hidden">
                <label htmlFor="website">Leave empty</label>
                <input id="website" name="website" value={formData.website} onChange={onChange} />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-blue-100 mb-1.5">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-100 mb-1.5">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={onChange}
                  onBlur={onEmailBlur}
                  required
                  className={`w-full px-4 py-3 bg-surface rounded-[14px] text-text transition-all duration-300 ${
                    emailError
                      ? 'border-2 border-red-400/70 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                      : 'border border-border focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
                {emailError && (
                  <div id="email-error" className="mt-1.5 flex flex-wrap items-center gap-2 alert-slide-fade">
                    <p className="text-xs text-red-300">{emailError}</p>
                    {(() => {
                      const match = emailError.match(/Did you mean (.+[^?])/)
                      const suggestion = match ? match[1] : null
                      return suggestion ? (
                        <button
                          type="button"
                          onClick={() => applyEmailSuggestion(suggestion)}
                          className="text-xs text-cyan-300 underline hover:text-cyan-100 transition-colors"
                        >
                          Use {suggestion}
                        </button>
                      ) : null
                    })()}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-blue-100 mb-1.5">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text"
                  placeholder="Subject of your message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-blue-100 mb-1.5">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={onChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text resize-none"
                  placeholder="Write your message..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <FaPaperPlane className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .alert-slide-fade {
          animation: alertSlideFade 0.32s ease-out;
        }

        @keyframes alertSlideFade {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
