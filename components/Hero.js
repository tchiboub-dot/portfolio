'use client'

import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import Button from './ui/Button'
import Avatar from './ui/Avatar'

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
    <section id="home" className="min-h-screen flex items-center justify-center bg-bg pt-24 relative overflow-hidden">
      {/* Animated Radial Glow Behind Hero */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-3xl animate-ambient-breath pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-cyan-400/5 to-transparent rounded-full blur-2xl animate-parallax-slower pointer-events-none" />
      
      {/* Soft Particle Lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-particle-1" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl animate-particle-2" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-blue-400/8 rounded-full blur-3xl animate-particle-3" />
      </div>

      <div className="container-custom text-center relative z-10">
        <div className="animate-fade-in-up">
          {/* Avatar with Enhanced Glow (NO FLOATING) */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Extended Glow Halo */}
              <div className="absolute inset-0 w-full h-full animate-hero-glow rounded-full" aria-hidden="true" />
              {/* Avatar - STATIC, NO FLOATING */}
              <div>
                <Avatar src={heroData.photo} alt={heroData.name} size="lg" priority={true} />
              </div>
            </div>
          </div>

          {/* Animated Name with Neon Glow */}
          <h1 className="text-h1-mobile md:text-h1 font-bold text-heading mb-4 leading-tight animate-name-glow">
            {heroData.name}
          </h1>

          {/* Title with Premium Styling */}
          <h2 className="text-xl md:text-2xl bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-semibold mb-3">
            {heroData.title}
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-blue-100 mb-4 font-medium">
            {heroData.subtitle}
          </p>

          {/* Value Proposition */}
          <p className="text-md md:text-lg text-cyan-300/90 mb-6 font-semibold tracking-wide">
            Transformer vos idées en solutions web performantes et sécurisées.
          </p>

          {/* Description */}
          <p className="text-body text-text max-w-3xl mx-auto mb-8 leading-relaxed">
            {heroData.description}
          </p>

          {/* Elite CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button href="#projects" size="lg" className="group relative overflow-hidden shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow duration-300">
              <span className="relative z-10">Voir mes projets</span>
            </Button>
            <Button href="#contact" variant="outline" size="lg" className="group hover:border-cyan-400/60 transition-all duration-300">
              Me contacter
            </Button>
          </div>

          {/* Premium Social Links */}
          <div className="flex gap-8 justify-center items-center">
            <a
              href={heroData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-blue-200 hover:text-cyan-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={heroData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-blue-200 hover:text-cyan-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${heroData.email}`}
              className="text-3xl text-blue-200 hover:text-cyan-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes hero-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.3), 
                        0 0 80px rgba(59, 130, 246, 0.15);
          }
          50% {
            box-shadow: 0 0 60px rgba(59, 130, 246, 0.5),
                        0 0 120px rgba(59, 130, 246, 0.25);
          }
        }
        @keyframes name-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.4),
                         0 0 20px rgba(34, 211, 238, 0.2);
          }
          50% {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.6),
                         0 0 40px rgba(34, 211, 238, 0.3),
                         0 0 60px rgba(59, 130, 246, 0.2);
          }
        }
      `}</style>
    </section>
  )
}
