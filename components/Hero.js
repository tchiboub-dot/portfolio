'use client'

import Image from 'next/image'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import Button from './ui/Button'

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
    <section id="home" className="min-h-screen flex items-center justify-center bg-bg pt-24">
      <div className="container-custom text-center">
        <div className="animate-fade-in-up">
          {/* Photo de profil avec contour bleu pro */}
          <div className="mb-8 flex justify-center">
            <div
              className="relative w-48 h-48 md:w-56 md:h-56"
              style={{
                background: `linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(34,211,238,0.1) 100%)`,
                borderRadius: '50%',
                padding: '3px',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  border: '2px solid rgba(59,130,246,0.45)',
                  borderRadius: '50%',
                  boxShadow: `
                    0 0 0 6px rgba(59,130,246,0.08),
                    0 15px 40px rgba(0,0,0,0.25),
                    inset 0 0 0 1px rgba(59,130,246,0.2)
                  `,
                }}
              />
              <Image
                src={heroData.photo}
                alt={heroData.name}
                width={224}
                height={224}
                className="w-full h-full rounded-full object-cover relative z-10"
                priority
              />
            </div>
          </div>

          {/* Nom */}
          <h1 className="text-h1-mobile md:text-h1 font-bold text-heading mb-4 leading-tight">
            {heroData.name}
          </h1>

          {/* Titre principal */}
          <h2 className="text-xl md:text-2xl text-primary font-semibold mb-3">
            {heroData.title}
          </h2>

          {/* Sous-titre */}
          <p className="text-lg md:text-xl text-muted mb-6">
            {heroData.subtitle}
          </p>

          {/* Description */}
          <p className="text-body text-text max-w-3xl mx-auto mb-8">
            {heroData.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-9">
            <Button href="#projects" size="lg">
              Voir mes projets
            </Button>
            <Button href="#contact" variant="outline" size="lg">
              Me contacter
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 justify-center">
            <a
              href={heroData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-muted hover:text-primary transition-colors duration-normal"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={heroData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-muted hover:text-primary transition-colors duration-normal"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${heroData.email}`}
              className="text-3xl text-muted hover:text-primary transition-colors duration-normal"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
