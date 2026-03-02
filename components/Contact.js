'use client'

import { useState } from 'react'
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaCheckCircle } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Button from './ui/Button'

/**
 * COMPOSANT CONTACT
 * Section de contact avec formulaire et informations
 * Pour modifier les informations, changez les valeurs dans l'objet contactData ci-dessous
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactData = {
    email: 'taha.adnane.chiboub@gmail.com',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    github: 'https://github.com/tchiboub-dot',
    availability: 'Ouvert aux opportunités de stage et missions freelance',
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Construction de l'email avec les données du formulaire
    const mailtoLink = `mailto:${contactData.email}?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`
    
    // Ouvrir le client email
    window.location.href = mailtoLink
    
    // Afficher le message de confirmation
    setIsSubmitted(true)
    
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitted(false)
    }, 3000)
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
                className="flex items-center p-4 bg-primary-soft  rounded-card border border-border  hover:border-primary transition-all group"
              >
                <FaEnvelope className="text-3xl text-primary text-primary mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-heading">Email</p>
                  <p className="text-primary text-primary">{contactData.email}</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-primary-soft  rounded-card border border-border  hover:border-primary transition-all group"
              >
                <FaLinkedin className="text-3xl text-primary text-primary mr-4 group-hover:scale-110 transition-transform" />
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
                className="flex items-center p-4 bg-primary-soft  rounded-card border border-border  hover:border-primary transition-all group"
              >
                <FaGithub className="text-3xl text-primary text-primary mr-4 group-hover:scale-110 transition-transform" />
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

            {isSubmitted ? (
              <Card hover={false} className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 text-center">
                <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  Message envoyé !
                </h4>
                <p className="text-green-700">
                  Votre client email va s'ouvrir pour finaliser l'envoi.
                </p>
              </Card>
            ) : (
              <Card hover={false}>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full px-4 py-3"
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
                    className="w-full px-4 py-3"
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
                    className="w-full px-4 py-3"
                    placeholder="Sujet de votre message"
                  />
                </div>

                {/* Message */}
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
                    className="w-full px-4 py-3 resize-none"
                    placeholder="Votre message..."
                  ></textarea>
                </div>

                {/* Bouton d'envoi */}
                <Button type="submit" className="w-full">
                  <FaPaperPlane className="mr-2" />
                  Envoyer le message
                </Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
