'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import StackedCardGroup from './StackedCardGroup'

/**
 * ELITE PROJECTS COMPONENT
 * Features:
 * - Stacked card carousel with smooth animations
 * - Click to expand for full details
 * - Arrow navigation + pagination dots
 * - Keyboard and swipe support
 * - Galaxy glass theme maintained
 */
export default function Projects() {
  const [visibleCards, setVisibleCards] = useState(new Set())
  const containerRef = useRef(null)

  const projectsData = [
    {
      id: 1,
      title: 'Maison Élégance',
      description: 'Application web complète pour un restaurant avec menu interactif, système de panier, gestion des réservations, avis clients, galerie photos, FAQ et formulaire de contact. Interface moderne et responsive.',
      fullDescription: 'Restaurant web application complète avec toutes les fonctionnalités nécessaires pour gérer un établissement culinaire. Inclut un système de panier persistant, gestion des réservations en temps réel, système d\'avis clients, galerie photos, FAQ interactive et formulaire de contact intégré.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive', 'Vercel'],
      demoLink: 'https://maisonelegance-one.vercel.app/',
      githubLink: 'https://github.com/tchiboub-dot',
      status: 'Live',
      type: 'Web App',
      features: [
        'Menu interactif avec catégories',
        'Système de panier persistant',
        'Réservation en ligne intégrée',
        'Avis clients et notations',
        'Galerie photos optimisée',
        'FAQ avec recherche',
        'Formulaire de contact',
        'Design responsive mobile-first',
      ],
      image: '🍽️',
    },
    {
      id: 2,
      title: 'Student Management System',
      description: 'Application web de gestion des étudiants avec fonctionnalités CRUD complètes, authentification basique et interface utilisateur responsive. Démonstration de compétences en développement full-stack.',
      fullDescription: 'Système de gestion des étudiants avec authentification sécurisée, opérations CRUD complètes, gestion des données en temps réel et interface utilisateur moderne. Built with React pour une expérience utilisateur fluide et réactive.',
      technologies: ['React', 'JavaScript', 'CRUD', 'Authentication', 'RESTful API', 'Vercel'],
      demoLink: 'https://student-management5.vercel.app/',
      githubLink: 'https://github.com/tchiboub-dot',
      status: 'Live',
      type: 'Web App',
      features: [
        'Authentification utilisateur sécurisée',
        'CRUD complet des étudiants',
        'Recherche et filtrage avancés',
        'Gestion temps réel',
        'Interface responsive',
        'Validation des données',
        'Export de données',
        'Dashboard analytique',
      ],
      image: '📚',
    },
    {
      id: 3,
      title: 'Site Web pour Gym',
      description: 'Site vitrine professionnel pour une salle de sport avec sections marketing, présentation des offres et services, galerie photos, et formulaire de contact. Design moderne et attrayant.',
      fullDescription: 'Site vitrine professionnel pour salle de sport avec design moderne, présentation complète des services et offres, galerie photos haute résolution, témoignages de clients et formulaire de contact optimisé pour les conversions.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX', 'GitHub Pages'],
      demoLink: null,
      githubLink: 'https://github.com/tchiboub-dot',
      status: 'GitHub',
      type: 'UI/UX',
      features: [
        'Design professionnel et moderne',
        'Marketing optimisé pour conversions',
        'Présentation offres tarifaires',
        'Galerie photos haute résolution',
        'Témoignages de clients',
        'Section tarification dynamique',
        'Formulaire de contact optimisé',
        'SEO optimisé',
      ],
      image: '💪',
    },
    {
      id: 4,
      title: 'Security Headers',
      description: 'Tool that demonstrates implementing strong HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and verifying them for better web security.',
      fullDescription: 'Comprehensive security headers implementation tool built with Next.js. Demonstrates best practices for configuring HTTP security headers to protect against common web vulnerabilities. Includes header verification, real-time testing, and detailed security recommendations. Implemented following Vercel and OWASP security standards.',
      technologies: ['Next.js', 'Vercel', 'Security Headers', 'HTTP'],
      demoLink: 'https://security-headers-2owb.vercel.app/',
      githubLink: 'https://github.com/tchiboub-dot/security-headers',
      status: 'Live',
      type: 'Web App',
      features: [
        'HTTP Security Headers configuration',
        'CSP (Content Security Policy)',
        'HSTS (Strict-Transport-Security)',
        'X-Frame-Options & X-Content-Type-Options',
        'Referrer-Policy & Permissions-Policy',
        'Real-time header verification',
        'Security recommendations & guidance',
        'Configured via Vercel/Next.js best practices',
      ],
      image: '🔒',
    },
  ]

  // Intersection Observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, entry.target.dataset.index]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  const renderCard = (project, isActive) => (
    <Card
      className={`h-full overflow-hidden p-0 card-interactive group flex flex-col transition-shadow duration-300 ${
        isActive ? 'shadow-2xl shadow-blue-500/30' : ''
      }`}
      hover={isActive}
      style={{ willChange: 'transform' }}
    >
      {/* Project Image/Icon */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 h-48 flex items-center justify-center text-6xl relative overflow-hidden transition-all duration-300 group-hover:shadow-lg">
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        }} />
        <div className="relative z-10 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          {project.image}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-4 sm:p-6">
        {/* Title - Single line with ellipsis */}
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-300 line-clamp-1">
          {project.title}
        </h3>

        {/* Status & Type Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm whitespace-nowrap ${
              project.status === 'Live' 
                ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                : 'bg-blue-500/30 text-blue-200 border border-blue-400/40'
            }`}
          >
            {project.status}
          </span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-cyan-500/25 text-cyan-100 border border-cyan-400/35 backdrop-blur-sm whitespace-nowrap">
            {project.type}
          </span>
          {project.technologies.length > 0 && (
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-500/25 text-blue-100 border border-blue-400/35 backdrop-blur-sm whitespace-nowrap">
              {project.technologies[0]}
            </span>
          )}
        </div>

        {/* Description - 2-3 lines with ellipsis */}
        <p className="text-text text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-grow group-hover:text-text transition-colors duration-300 line-clamp-3 opacity-90">
          {project.description}
        </p>

        {/* Technologies - compact for card view */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          {project.technologies.slice(0, 2).map((tech, idx) => (
            <Badge key={idx} variant="default" className="text-xs bg-blue-500/30 text-blue-100 border border-blue-400/40 hover:border-blue-400/60 transition-colors backdrop-blur-sm">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 2 && (
            <Badge variant="secondary" className="text-xs bg-slate-500/30 text-slate-200 border border-slate-400/30">
              +{project.technologies.length - 2}
            </Badge>
          )}
        </div>

        {/* Key Features - scrollable if too many */}
        <div className="bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-lg p-2 sm:p-2.5 mb-2 sm:mb-3 border border-blue-400/20 group-hover:border-blue-400/40 transition-colors duration-300 max-h-[120px] sm:max-h-[140px] overflow-y-auto">
          <p className="text-[9px] sm:text-[10px] font-semibold text-blue-300 mb-1 sticky top-0 bg-gradient-to-br from-blue-500/15 to-cyan-500/10">
            Fonctionnalités :
          </p>
          <ul className="text-[9px] sm:text-[10px] text-text space-y-0.5">
            {project.features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-center gap-1.5 break-words">
                <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0 mt-0.5" />
                <span className="opacity-90">{feature}</span>
              </li>
            ))}
            {project.features.length > 3 && (
              <li className="text-blue-400 font-medium text-[9px]">
                +{project.features.length - 3} more...
              </li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {project.demoLink ? (
            <Link href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="primary" size="sm" className="w-full shadow-md shadow-blue-500/20 text-xs sm:text-sm min-h-[44px]">
                <FaExternalLinkAlt className="w-3 h-3" />
                Live Demo
              </Button>
            </Link>
          ) : (
            <div className="flex-1">
              <Button variant="outline" size="sm" className="w-full opacity-50 cursor-not-allowed text-xs sm:text-sm min-h-[44px]" disabled>
                Demo
              </Button>
            </div>
          )}
          <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm min-h-[44px]">
              <FaGithub className="w-3 h-3" />
              Code
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )

  const renderDetails = (project, index, nav) => (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Title and Close */}
      <div>
        <div className="flex items-start gap-3 mb-4">
          <div className="text-5xl filter drop-shadow-lg">{project.image}</div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
              {project.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${
                  project.status === 'Live' 
                    ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                    : 'bg-blue-500/30 text-blue-200 border border-blue-400/40'
                }`}
              >
                {project.status}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/25 text-cyan-100 border border-cyan-400/35 backdrop-blur-sm">
                {project.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div>
        <h3 className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">À propos du projet</h3>
        <p className="text-text/90 leading-relaxed text-base">
          {project.fullDescription}
        </p>
      </div>

      {/* All Technologies */}
      <div>
        <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider">Technologies utilisées</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <Badge key={idx} variant="default" className="bg-blue-500/30 text-blue-100 border border-blue-400/40 backdrop-blur-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* All Features */}
      <div>
        <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider">Fonctionnalités complètes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {project.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
              <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
              <span className="text-text/90 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-400/20">
        {project.demoLink && (
          <Link href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="primary" size="sm" className="w-full shadow-md shadow-blue-500/20">
              <FaExternalLinkAlt className="w-4 h-4" />
              Voir la démo en direct
            </Button>
          </Link>
        )}
        <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <FaGithub className="w-4 h-4" />
            Code source
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      {nav.totalItems > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-blue-400/20">
          <button
            onClick={nav.onPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Projet précédent"
          >
            ← Précédent
          </button>
          <span className="text-xs text-blue-300/70 font-medium">
            {index + 1} / {nav.totalItems}
          </span>
          <button
            onClick={nav.onNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Projet suivant"
          >
            Suivant →
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )

  return (
    <section id="projects" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slower" />
      </div>

      <div 
        ref={containerRef}
        className="container-custom relative z-10 animate-section-reveal"
      >
        <SectionTitle 
          title="Mes Projets"
          subtitle="Découvrez mes projets récents et réalisations"
          align="center"
        />

        {/* Stacked Card Group - Right-Offset Stack */}
        <div className="mt-16" ref={containerRef}>
          <StackedCardGroup
            items={projectsData}
            renderCard={renderCard}
            renderDetails={renderDetails}
            cardCount={4}
            rightOffset={20}
            downOffset={12}
            onNavigate={(index) => {
              // Optional: analytics tracking
            }}
          />
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center animate-section-reveal">
          <p className="text-text/80 mb-6 text-lg font-medium">
            Intéressé par ma façon de travailler ?
          </p>
          <Button href="#contact" size="lg">
            Parlons de votre projet
          </Button>
          <p className="text-sm text-blue-300/70 mt-3 font-medium">
            ⏱️ Réponse sous 24-48h
          </p>
        </div>
      </div>
    </section>
  )
}
