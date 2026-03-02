'use client'

import { useState } from 'react'
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaCheckCircle } from 'react-icons/fa'

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

  // DONNÉES DE CONTACT - MODIFIEZ ICI
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
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Titre de la section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            N'hésitez pas à me contacter pour toute opportunité
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Restons en contact
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {contactData.availability}
            </p>

            {/* Moyens de contact */}
            <div className="space-y-4 mb-8">
              {/* Email */}
              <a
                href={`mailto:${contactData.email}`}
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <FaEnvelope className="text-3xl text-primary mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <p className="text-primary">{contactData.email}</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <FaLinkedin className="text-3xl text-primary mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-gray-800">LinkedIn</p>
                  <p className="text-primary">Taha Adnane Chiboub</p>
                </div>
              </a>

              {/* GitHub */}
              <a
                href={contactData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <FaGithub className="text-3xl text-primary mr-4 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-gray-800">GitHub</p>
                  <p className="text-primary">tchiboub-dot</p>
                </div>
              </a>
            </div>

            {/* CTA pour projets */}
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-lg">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Envoyez-moi un message
            </h3>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  Message envoyé !
                </h4>
                <p className="text-green-700">
                  Votre client email va s'ouvrir pour finaliser l'envoi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="votre.email@exemple.com"
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="Sujet de votre message"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Votre message..."
                  ></textarea>
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <FaPaperPlane className="mr-2" />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
