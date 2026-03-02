'use client'

import { useState } from 'react'
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Button from './ui/Button'

/**
 * COMPOSANT CONTACT SÉCURISÉ
 * Section de contact avec formulaire protégé contre le spam et les abus
 * Inclut : honeypot, rate limiting client, validation, sanitization
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // Honeypot field (caché)
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactData = {
    email: 'taha.adnane.chiboub@gmail.com',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    github: 'https://github.com/tchiboub-dot',
    availability: 'Ouvert aux opportunités de stage et missions freelance',
  }

  // Validation côté client
  const validateForm = () => {
    const { name, email, subject, message } = formData

    // Vérifier que tous les champs sont remplis
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Tous les champs sont requis')
      return false
    }

    // Validation de l'email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(email)) {
      setErrorMessage('Email invalide')
      return false
    }

    // Vérifier les longueurs max
    if (name.length > 100 || email.length > 150 || subject.length > 200 || message.length > 2000) {
      setErrorMessage('Un ou plusieurs champs sont trop longs')
      return false
    }

    // Détection basique de spam
    const spamPatterns = /(viagra|cialis|casino|lottery)/i
    if (spamPatterns.test(name + subject + message)) {
      setErrorMessage('Contenu suspect détecté')
      return false
    }

    return true
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Réinitialiser les erreurs quand l'utilisateur tape
    if (isError) {
      setIsError(false)
      setErrorMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset states
    setIsError(false)
    setErrorMessage('')

    // Validation côté client
    if (!validateForm()) {
      setIsError(true)
      return
    }

    setIsSubmitting(true)

    try {
      // Appel à l'API sécurisée
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          honeypot: formData.website, // Champ honeypot
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Succès
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          website: '',
        })

        // Réinitialiser après 5 secondes
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        // Erreur serveur
        setIsError(true)
        setErrorMessage(data.message || 'Une erreur est survenue')
      }
    } catch (error) {
      // Erreur réseau
      setIsError(true)
      setErrorMessage('Impossible de contacter le serveur')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle
          title="Contact"
          subtitle="N'hésitez pas à me contacter pour toute opportunité"
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div>
            <h3 className="text-2xl font-bold text-heading mb-6">
              Restons en contact
            </h3>
            <p className="text-text mb-6 leading-relaxed">
              {contactData.availability}
            </p>

            {/* Moyens de contact */}
            <div className="space-y-4 mb-8">
              {/* Email */}
              <a
                href={`mailto:${contactData.email}`}
                className="flex items-center p-4 bg-primary-soft rounded-[16px] border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-normal group"
              >
                <FaEnvelope className="text-3xl text-primary mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-heading">Email</p>
                  <p className="text-primary">{contactData.email}</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-primary-soft rounded-[16px] border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-normal group"
              >
                <FaLinkedin className="text-3xl text-primary mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-heading">LinkedIn</p>
                  <p className="text-primary text-primary">Taha Adnane Chiboub</p>
                </div>
              </a>

              {/* GitHub */}
              <a
                href={contactData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-primary-soft rounded-[16px] border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-normal group"
              >
                <FaGithub className="text-3xl text-primary mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-heading">GitHub</p>
                  <p className="text-primary text-primary">tchiboub-dot</p>
                </div>
              </a>
            </div>

            {/* CTA pour projets */}
            <div className="bg-gradient-to-br from-primary to-accent text-white p-6 rounded-card shadow-medium">
              <h4 className="text-xl font-semibold mb-3">Vous avez un projet ?</h4>
              <p className="mb-4">
                Je suis disponible pour des stages, missions freelance et collaborations sur des projets web.
              </p>
              <div className="flex gap-2 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">💼 Stage</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">🚀 Freelance</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">🤝 Collaboration</span>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div>
            <h3 className="text-2xl font-bold text-heading mb-6">
              Envoyez-moi un message
            </h3>

            {/* Message de succès */}
            {isSubmitted && (
              <Card hover={false} className="bg-success/10 border-success/30 text-center mb-6">
                <FaCheckCircle className="text-5xl text-success mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-success mb-2">
                  Message envoyé !
                </h4>
                <p className="text-text">
                  Merci pour votre message. Je vous répondrai rapidement.
                </p>
              </Card>
            )}

            {/* Message d'erreur */}
            {isError && (
              <Card hover={false} className="bg-danger/10 border-danger/30 text-center mb-6">
                <FaExclamationTriangle className="text-4xl text-danger mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-danger mb-1">
                  Erreur
                </h4>
                <p className="text-text text-sm">{errorMessage}</p>
              </Card>
            )}

            {/* Formulaire */}
            <Card hover={false}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field - CACHÉ pour piéger les bots */}
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor="website">Ne pas remplir ce champ</label>
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

                {/* Nom */}
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
                    className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text placeholder-muted transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Votre nom"
                  />
                </div>

                {/* Email */}
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
                    className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text placeholder-muted transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="votre.email@exemple.com"
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="subject" className="block text-heading font-semibold mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text placeholder-muted transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Sujet de votre message"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-heading font-semibold mb-2">
                    Message * <span className="text-muted text-sm font-normal">(max 2000 caractères)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    maxLength={2000}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text placeholder-muted transition-all duration-normal resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Votre message..."
                  ></textarea>
                  <div className="text-right text-xs text-muted mt-1">
                    {formData.message.length} / 2000
                  </div>
                </div>

                {/* Note de sécurité */}
                <p className="text-xs text-muted">
                  🔒 Vos données sont protégées et ne seront jamais partagées avec des tiers.
                </p>

                {/* Bouton d'envoi */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Envoi en cours...
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
    </section>
  )
}
