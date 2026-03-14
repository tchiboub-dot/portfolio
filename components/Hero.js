'use client'

import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import Button from './ui/Button'
import Avatar from './ui/Avatar'

const SKILL_ICONS = [
  { icon: '⚡', label: 'Développement Web' },
  { icon: '☁️', label: 'Applications Cloud' },
  { icon: '🤖', label: 'Outils IA' },
]

export default function Hero() {
  const heroData = {
    name: 'Chiboub Taha Adnane',
    title: 'Software Engineer Student',
    email: 'taha.adnane.chiboub@gmail.com',
    github: 'https://github.com/tchiboub-dot',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    photo: '/photo-profil.jpg',
    cvPath: '/cv-taha-adnane-chiboub.pdf',
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-bg pt-20 pb-12 sm:pt-24 sm:pb-16 relative overflow-hidden">
      {/* Animated Radial Glow Behind Hero */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-3xl animate-ambient-breath pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-cyan-400/5 to-transparent rounded-full blur-2xl animate-parallax-slower pointer-events-none" />

      {/* Soft Particle Lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-particle-1" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl animate-particle-2" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-blue-400/8 rounded-full blur-3xl animate-particle-3" />
      </div>

      <div className="container-custom text-center relative z-10 px-4 sm:px-6">
        <div className="animate-fade-in-up">
          {/* Avatar — centered, static */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 w-full h-full animate-hero-glow rounded-full" aria-hidden="true" />
              <Avatar src={heroData.photo} alt={heroData.name} size="lg" priority={true} />
            </div>
          </div>

          {/* Animated Name with Neon Glow */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-heading mb-3 sm:mb-4 leading-tight animate-name-glow px-4">
            {heroData.name}
          </h1>

          {/* Title with Premium Styling */}
          <h2 className="text-base sm:text-xl md:text-2xl bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-semibold mb-8 sm:mb-10 px-4">
            {heroData.title}
          </h2>

          {/* Skill Icons */}
          <div className="flex items-end justify-center gap-8 sm:gap-14 mb-8 sm:mb-10 px-4">
            {SKILL_ICONS.map(({ icon, label }) => (
              <div key={label} className="hero-skill-icon-item">
                <span className="hero-skill-icon-emoji" role="img" aria-label={label}>{icon}</span>
                <span className="hero-skill-icon-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Elite CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button href="#projects" size="lg" className="group relative overflow-hidden shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow duration-300 min-h-[48px]">
              <span className="relative z-10">View My Projects</span>
            </Button>
            <a
              href={heroData.cvPath}
              download
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-[16px] border border-blue-400/40 text-blue-300 bg-transparent hover:border-cyan-400/60 hover:bg-blue-500/10 transition-all duration-300 min-h-[48px]"
            >
              Download CV
            </a>
          </div>

          {/* Premium Social Links */}
          <div className="flex gap-6 sm:gap-8 justify-center items-center">
            <a
              href={heroData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl sm:text-3xl text-blue-200 hover:text-cyan-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg p-2"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={heroData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl sm:text-3xl text-blue-200 hover:text-cyan-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg p-2"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${heroData.email}`}
              className="text-2xl sm:text-3xl text-blue-200 hover:text-cyan-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg p-2"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
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
      {/* Animated Radial Glow Behind Hero */}
