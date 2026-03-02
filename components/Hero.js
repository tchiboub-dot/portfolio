'use client'

import Image from 'next/image'
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown } from 'react-icons/fa'
import Button from './ui/Button'

/**
 * COMPOSANT HERO (SECTION D'ACCUEIL)
 * Section principale de la page d'accueil
 * Pour modifier les informations, changez les valeurs dans l'objet heroData ci-dessous
 */
export default function Hero() {
  const heroData = {
    name: 'Chiboub Taha Adnane',
    title: 'Étudiant en Informatique (1ère année) — ESISA Fes',
    subtitle: 'Développeur Web Junior | Passionné par la Cybersécurité & l\'IA',
    description: 'Je crée des applications web modernes, responsives et centrées sur l\'expérience utilisateur. Ouvert aux opportunités de stage et missions freelance.',
    email: 'taha.adnane.chiboub@gmail.com',
    github: 'https://github.com/tchiboub-dot',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    photo: '/photo-profil.jpg',
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background pt-24"
    >
      <div className="container-custom text-center">
        <div className="animate-fade-in-up">
          {/* Photo de profil */}
          <div className="mb-8">
            <Image
              src={heroData.photo}
              alt={heroData.name}
              width={200}
              height={200}
              className="w-44 h-44 md:w-48 md:h-48 rounded-full mx-auto object-cover shadow-medium border-4 border-primary dark:border-accent"
            />
          </div>

          {/* Nom */}
          <h1 className="text-h1-mobile md:text-h1 font-bold text-text-primary dark:text-dark-text-primary mb-4 leading-tight">
            {heroData.name}
          </h1>

          {/* Titre principal */}
          <h2 className="text-xl md:text-2xl text-primary dark:text-accent font-semibold mb-3">
            {heroData.title}
          </h2>

          {/* Sous-titre */}
          <p className="text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary mb-6">
            {heroData.subtitle}
          </p>

          {/* Description */}
          <p className="text-body text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto mb-8">
            {heroData.description}
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-9">
            <Button href="#projects" size="lg">
              Voir mes projets
            </Button>
            <Button href="#contact" variant="outline" size="lg">
              Me contacter
            </Button>
          </div>

          {/* Liens sociaux */}
          <div className="flex gap-6 justify-center mb-12">
            <a
              href={heroData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={heroData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${heroData.email}`}
              className="text-3xl text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-accent transition-colors"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>

          {/* Flèche de défilement */}
          <a
            href="#about"
            className="inline-block text-primary dark:text-accent animate-bounce text-4xl"
            aria-label="Scroll down"
          >
            <FaArrowDown />
          </a>
        </div>
      </div>
    </section>
  )
}
