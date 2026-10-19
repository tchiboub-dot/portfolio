'use client'

import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import Button from './ui/Button'
import Avatar from './ui/Avatar'

const SKILL_ICONS = [
  { icon: '⚡', label: 'Développement Web' },
  { icon: '☁️', label: 'Applications Cloud' },
  { icon: '🤖', label: 'Outils IA' },
]

export default function Hero({ initialData, theme }) {
  const heroData = {
    name: initialData?.name || 'Chiboub Taha Adnane',
    title: initialData?.title || 'Software Engineer Student',
    email: initialData?.email || 'taha.adnane.chiboub@gmail.com',
    github: initialData?.github || 'https://github.com/tchiboub-dot',
    linkedin: initialData?.linkedin || 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    photo: initialData?.photo || '/photo-profil.jpg',
    cvPath: initialData?.cvPath || '/cv-taha-adnane-chiboub.pdf',
    availability: initialData?.availability || 'Available for software engineering & product roles',
  }

  const headline = theme?.heroHeadline || 'Architecting Next-Gen Software & Intelligent Cloud Systems'
  const subheadline = theme?.heroSubheadline || heroData.title

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-bg pt-24 pb-16 sm:pt-28 sm:pb-20 relative overflow-hidden">
      {/* Dynamic ambient glow behind Hero using theme primary color */}
      <div 
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl animate-ambient-breath pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, var(--primary, #38bdf8) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-2xl animate-parallax-slower pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, var(--accent, #22d3ee) 0%, transparent 70%)' }}
      />

      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-particle-1" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-particle-2" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-primary/10 rounded-full blur-3xl animate-particle-3" />
      </div>

      <div className="container-custom text-center relative z-10 px-4 sm:px-6">
        <div className="animate-fade-in-up">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-6 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>{heroData.availability}</span>
          </div>

          {/* Avatar — centered with glowing halo */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative group">
              <div 
                className="absolute -inset-1 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-hero-glow"
                style={{ background: 'linear-gradient(to right, var(--primary, #38bdf8), var(--accent, #22d3ee))' }}
                aria-hidden="true" 
              />
              <div className="relative">
                <Avatar src={heroData.photo} alt={heroData.name} size="lg" priority={true} />
              </div>
            </div>
          </div>

          {/* Developer Name */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-heading mb-4 leading-[1.1] animate-name-glow px-4">
            {heroData.name}
          </h1>

          {/* Dynamic Hero Headline (Managed from CMS) */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent mb-4 max-w-4xl mx-auto px-4 leading-snug">
            {headline}
          </h2>

          {/* Dynamic Hero Subheadline / Bio intro (Managed from CMS) */}
          <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mx-auto mb-8 sm:mb-10 px-4 font-normal leading-relaxed">
            {subheadline}
          </p>

          {/* Skill Pillars */}
          <div className="flex items-end justify-center gap-6 sm:gap-12 mb-8 sm:mb-10 px-4">
            {SKILL_ICONS.map(({ icon, label }) => (
              <div key={label} className="hero-skill-icon-item hover:scale-105 transition-transform duration-200">
                <span className="hero-skill-icon-emoji text-2xl sm:text-3xl" role="img" aria-label={label}>{icon}</span>
                <span className="hero-skill-icon-label text-xs sm:text-sm text-muted">{label}</span>
              </div>
            ))}
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button href="#projects" size="lg" className="group relative overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow duration-300 min-h-[48px]">
              <span className="relative z-10 font-semibold">Explore Projects</span>
            </Button>
            <a
              href={heroData.cvPath}
              download
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base sm:text-lg font-semibold rounded-[var(--radius-sm,16px)] border border-primary/40 text-primary bg-primary/5 hover:border-primary hover:bg-primary/15 transition-all duration-300 min-h-[48px]"
            >
              Download CV
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base sm:text-lg font-semibold rounded-[var(--radius-sm,16px)] border border-white/10 text-heading bg-surface/50 hover:bg-surface hover:border-white/20 transition-all duration-300 min-h-[48px]"
            >
              Contact Me
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 sm:gap-8 justify-center items-center">
            <a
              href={heroData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl sm:text-3xl text-muted hover:text-primary transition-all duration-300 hover:scale-110 p-2"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={heroData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl sm:text-3xl text-muted hover:text-primary transition-all duration-300 hover:scale-110 p-2"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${heroData.email}`}
              className="text-2xl sm:text-3xl text-muted hover:text-primary transition-all duration-300 hover:scale-110 p-2"
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
