'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  const [uiLocale, setUiLocale] = useState('fr')
  const containerRef = useRef(null)

  const labels = {
    fr: {
      featuredProject: 'Projet vedette',
      live: 'Live',
      openLivePreview: 'Ouvrir la preview live',
      features: 'Fonctionnalités',
      more: 'de plus',
      aboutProject: 'À propos du projet',
      technologiesUsed: 'Technologies utilisées',
      fullFeatures: 'Fonctionnalités complètes',
      tags: 'Tags',
      liveDemo: 'Voir la démo en direct',
      code: 'Code source',
    },
    en: {
      featuredProject: 'Featured Project',
      live: 'Live',
      openLivePreview: 'Open Live Preview',
      features: 'Features',
      more: 'more',
      aboutProject: 'About the project',
      technologiesUsed: 'Technologies used',
      fullFeatures: 'Complete features',
      tags: 'Tags',
      liveDemo: 'View live demo',
      code: 'Source code',
    },
  }

  const t = labels[uiLocale] || labels.fr

  const localizeProjectText = (project, key) => {
    if (uiLocale === 'en' && project[`${key}En`]) return project[`${key}En`]
    if (uiLocale === 'fr' && project[`${key}Fr`]) return project[`${key}Fr`]
    return project[key]
  }

  const projectsData = [
    {
      id: 0,
      title: 'Parfume Store',
      descriptionFr: 'Une plateforme e-commerce parfum full-stack premium avec design dark/light de luxe, support multilingue, fond étoilé animé, catalogue produits élégant et expérience shopping moderne.',
      descriptionEn: 'A premium full-stack perfume e-commerce platform with a luxury dark/light design, multilingual support, animated star background, product catalog, elegant UI, and a modern shopping experience.',
      fullDescriptionFr: 'Parfume Store est une plateforme e-commerce full-stack orientée luxe, conçue pour une expérience shopping moderne, rapide et immersive. Le projet combine une interface premium dark/light, un support multilingue, des animations fluides, un catalogue produits soigné et une architecture moderne déployée sur Vercel.',
      fullDescriptionEn: 'Parfume Store is a luxury-oriented full-stack e-commerce platform designed for a modern, fast, and immersive shopping experience. The project combines a premium dark/light interface, multilingual support, smooth animations, a curated product catalog, and a modern architecture deployed on Vercel.',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Full-stack architecture', 'Vercel deployment'],
      demoLink: 'https://parfume-store-eta.vercel.app/en',
      githubLink: 'https://github.com/tchiboub-dot/parfume',
      status: 'Live',
      type: 'Featured Full-stack',
      featured: true,
      live: true,
      tags: ['E-commerce', 'Multilingual', 'Premium UI', 'Animation'],
      features: [
        'Luxury dark/light visual system',
        'Multilingual shopping experience',
        'Premium animated interactions',
        'Full product catalog flow',
        'Responsive and polished UX',
        'Production deployment on Vercel',
      ],
      image: '🌌',
      thumbnail: '/projects/parfume-store-preview-real.jpg',
    },
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

  // Locale detection for FR/EN project texts
  useEffect(() => {
    const htmlLang = (document.documentElement.lang || '').toLowerCase()
    const path = window.location.pathname.toLowerCase()
    const browserLang = (window.navigator.language || '').toLowerCase()

    const isEnglish = htmlLang.startsWith('en') || path.startsWith('/en') || browserLang.startsWith('en')
    setUiLocale(isEnglish ? 'en' : 'fr')
  }, [])

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
      className={`h-full overflow-hidden p-0 card-interactive group flex flex-col transition-all duration-300 ${
        isActive ? 'shadow-2xl shadow-blue-500/30' : ''
      } ${
        project.featured
          ? 'ring-1 ring-cyan-300/50 border-cyan-300/45 shadow-[0_0_0_1px_rgba(34,211,238,0.3),0_0_24px_rgba(56,189,248,0.24)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.45),0_0_32px_rgba(56,189,248,0.34)]'
          : ''
      }`}
      hover={isActive}
      style={{ willChange: 'transform' }}
    >
      {/* Project Image/Icon */}
      <div
        className={`h-48 flex items-center justify-center text-6xl relative overflow-hidden transition-all duration-300 group-hover:shadow-lg ${
          project.featured
            ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950'
            : 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500'
        }`}
      >
        {project.featured && (
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-300/0 via-cyan-200/85 to-cyan-300/0 z-20" />
        )}
        {project.thumbnail ? (
          <>
            <Image
              src={project.thumbnail}
              alt={`${project.title} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center opacity-95 group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-[#0b1636]/35 to-transparent" />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
              {project.featured && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-100 border border-cyan-300/40 backdrop-blur-md">
                  {t.featuredProject}
                </span>
              )}
              {project.live && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-100 border border-emerald-300/40 backdrop-blur-md">
                  {t.live}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {project.image}
            </div>
          </>
        )}

        {project.demoLink && (
          <Link
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 z-20 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-blue-500/30 hover:bg-blue-500/45 text-blue-100 border border-blue-300/40 backdrop-blur-md transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {t.openLivePreview}
          </Link>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-4 sm:p-6">
        {/* Title - Single line with ellipsis */}
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-300 line-clamp-1">
          {project.title}
        </h3>

        {/* Status & Type Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.featured && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-100 border border-cyan-300/40 backdrop-blur-sm whitespace-nowrap">
              {t.featuredProject}
            </span>
          )}
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

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-1 rounded-full bg-slate-700/35 text-slate-100 border border-slate-300/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description - 2-3 lines with ellipsis */}
        <p className="text-text text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-grow group-hover:text-text transition-colors duration-300 line-clamp-3 opacity-90">
          {localizeProjectText(project, 'description')}
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
            {t.features}:
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
                +{project.features.length - 3} {t.more}...
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
                {t.liveDemo}
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
              {t.code}
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
              {project.featured && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-100 border border-cyan-300/40 backdrop-blur-sm">
                  {t.featuredProject}
                </span>
              )}
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
              {project.live && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-100 border border-emerald-400/35 backdrop-blur-sm">
                  {t.live}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {project.tags?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider">{t.tags}</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="bg-slate-700/30 text-slate-100 border border-slate-300/20 backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Full Description */}
      <div>
        <h3 className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">{t.aboutProject}</h3>
        <p className="text-text/90 leading-relaxed text-base">
          {localizeProjectText(project, 'fullDescription')}
        </p>
      </div>

      {/* All Technologies */}
      <div>
        <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider">{t.technologiesUsed}</h3>
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
        <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider">{t.fullFeatures}</h3>
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
              {t.liveDemo}
            </Button>
          </Link>
        )}
        <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <FaGithub className="w-4 h-4" />
            {t.code}
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
