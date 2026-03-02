'use client'

import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown } from 'react-icons/fa'

/**
 * COMPOSANT HERO (SECTION D'ACCUEIL)
 * Section principale de la page d'accueil
 * Pour modifier les informations, changez les valeurs dans l'objet heroData ci-dessous
 */
export default function Hero() {
  // DONNÉES DE LA SECTION HERO - MODIFIEZ ICI
  const heroData = {
    name: 'T.A.C',
    title: 'Étudiant en Informatique (1ère année) — ESISA Fes',
    subtitle: 'Développeur Web Junior | Passionné par la Cybersécurité & l\'IA',
    description: 'Je crée des applications web modernes, responsives et centrées sur l\'expérience utilisateur. Ouvert aux opportunités de stage et missions freelance.',
    email: 'taha.adnane.chiboub@gmail.com',
    github: 'https://github.com/tchiboub-dot',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          {/* Nom */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            {heroData.name}
          </h1>

          {/* Titre principal */}
          <h2 className="text-2xl md:text-3xl text-primary font-semibold mb-3">
            {heroData.title}
          </h2>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            {heroData.subtitle}
          </p>

          {/* Description */}
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            {heroData.description}
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="#projects"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors shadow-lg hover:shadow-xl"
            >
              Voir mes projets
            </a>
            <a
              href="#contact"
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors shadow-lg hover:shadow-xl"
            >
              Me contacter
            </a>
          </div>

          {/* Liens sociaux */}
          <div className="flex gap-6 justify-center mb-12">
            <a
              href={heroData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-700 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={heroData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-700 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${heroData.email}`}
              className="text-3xl text-gray-700 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>

          {/* Flèche de défilement */}
          <a
            href="#about"
            className="inline-block text-primary animate-bounce text-4xl"
            aria-label="Scroll down"
          >
            <FaArrowDown />
          </a>
        </div>
      </div>
    </section>
  )
}
