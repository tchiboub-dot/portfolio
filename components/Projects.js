'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import * as anime from 'animejs'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

/**
 * ELITE PROJECTS COMPONENT
 * Features:
 * - 3D tilt effect on hover
 * - Subtle glow intensity increase
 * - Micro elevation shadows
 * - Scroll reveal animations
 * - Animated layout transitions with anime.js createLayout
 */
export default function Projects() {
  const [visibleCards, setVisibleCards] = useState(new Set())
  const [layoutMode, setLayoutMode] = useState('grid-3')
  const cardRefs = useRef([])
  const containerRef = useRef(null)
  const layoutRef = useRef(null)
  const controlsRef = useRef(null)

  const projectsData = [
    {
      title: 'Maison Élégance',
      description: 'Application web complète pour un restaurant avec menu interactif, système de panier, gestion des réservations, avis clients, galerie photos, FAQ et formulaire de contact. Interface moderne et responsive.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
      demoLink: 'https://maisonelegance-one.vercel.app/',
      githubLink: 'https://github.com/tchiboub-dot',
      status: 'Live',
      type: 'Web App',
      features: [
        'Menu interactif',
        'Système de panier',
        'Réservation en ligne',
        'Avis clients',
      ],
      image: '🍽️',
    },
    {
      title: 'Student Management System',
      description: 'Application web de gestion des étudiants avec fonctionnalités CRUD complètes, authentification basique et interface utilisateur responsive. Démonstration de compétences en développement full-stack.',
      technologies: ['React', 'JavaScript', 'CRUD', 'Authentication'],
      demoLink: 'https://student-management5.vercel.app/',
      githubLink: 'https://github.com/tchiboub-dot',
      status: 'Live',
      type: 'Web App',
      features: [
        'CRUD complet',
        'Authentification',
        'Gestion temps réel',
        'Interface responsive',
      ],
      image: '📚',
    },
    {
      title: 'Site Web pour Gym',
      description: 'Site vitrine professionnel pour une salle de sport avec sections marketing, présentation des offres et services, galerie photos, et formulaire de contact. Design moderne et attrayant.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX'],
      githubLink: 'https://github.com/tchiboub-dot',
      status: 'GitHub',
      type: 'UI/UX',
      features: [
        'Design professionnel',
        'Marketing optimisé',
        'Présentation offres',
        'Galerie photos',
      ],
      image: '💪',
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

    cardRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => cardRefs.current.forEach(ref => {
      if (ref) observer.unobserve(ref)
    })
  }, [])

  // Initialize anime.js createLayout
  useEffect(() => {
    if (!containerRef.current) return

    // Initialize createLayout with anime.js
    layoutRef.current = anime.createLayout('.projects-layout-container', {
      leaveTo: { 
        transform: 'scale(0.95)', 
        opacity: 0, 
        delay: anime.stagger(50) 
      },
    })

    // Add click handlers to control buttons
    const buttons = controlsRef.current?.querySelectorAll('button') || []
    const handleModeChange = (e) => {
      const mode = e.target.dataset.mode
      if (!mode) return

      setLayoutMode(mode)

      if (layoutRef.current) {
        layoutRef.current.update(({ root }) => {
          root.classList.remove('grid-2', 'grid-3', 'flex-row', 'flex-col', 'none')
          root.classList.add(mode)
        })
      }
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', handleModeChange)
    })

    return () => {
      buttons.forEach(btn => {
        btn.removeEventListener('click', handleModeChange)
      })
      if (layoutRef.current) {
        layoutRef.current.remove()
      }
    }
  }, [])

  return (
    <section id="projects" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slower" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Mes Projets"
          subtitle="Découvrez quelques-uns de mes projets récents et réalisations"
          align="center"
        />

        {/* Layout Control Buttons - Glass Styled */}
        <div 
          ref={controlsRef}
          className="projects-controls flex flex-wrap justify-center gap-2 mb-10 animate-section-reveal"
        >
          <button
            data-mode="grid-3"
            onClick={(e) => {
              const mode = e.currentTarget.dataset.mode
              setLayoutMode(mode)
              if (layoutRef.current) {
                layoutRef.current.update(({ root }) => {
                  root.classList.remove('grid-2', 'grid-3', 'flex-row', 'flex-col', 'none')
                  root.classList.add(mode)
                })
              }
            }}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              layoutMode === 'grid-3'
                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50 shadow-lg shadow-blue-500/20'
                : 'bg-blue-500/10 text-blue-300 border border-blue-400/25 hover:bg-blue-500/15 hover:border-blue-400/40'
            }`}
          >
            Grille 3
          </button>
          <button
            data-mode="grid-2"
            onClick={(e) => {
              const mode = e.currentTarget.dataset.mode
              setLayoutMode(mode)
              if (layoutRef.current) {
                layoutRef.current.update(({ root }) => {
                  root.classList.remove('grid-2', 'grid-3', 'flex-row', 'flex-col', 'none')
                  root.classList.add(mode)
                })
              }
            }}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              layoutMode === 'grid-2'
                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50 shadow-lg shadow-blue-500/20'
                : 'bg-blue-500/10 text-blue-300 border border-blue-400/25 hover:bg-blue-500/15 hover:border-blue-400/40'
            }`}
          >
            Grille 2
          </button>
          <button
            data-mode="flex-col"
            onClick={(e) => {
              const mode = e.currentTarget.dataset.mode
              setLayoutMode(mode)
              if (layoutRef.current) {
                layoutRef.current.update(({ root }) => {
                  root.classList.remove('grid-2', 'grid-3', 'flex-row', 'flex-col', 'none')
                  root.classList.add(mode)
                })
              }
            }}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              layoutMode === 'flex-col'
                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50 shadow-lg shadow-blue-500/20'
                : 'bg-blue-500/10 text-blue-300 border border-blue-400/25 hover:bg-blue-500/15 hover:border-blue-400/40'
            }`}
          >
            Liste
          </button>
          <button
            data-mode="flex-row"
            onClick={(e) => {
              const mode = e.currentTarget.dataset.mode
              setLayoutMode(mode)
              if (layoutRef.current) {
                layoutRef.current.update(({ root }) => {
                  root.classList.remove('grid-2', 'grid-3', 'flex-row', 'flex-col', 'none')
                  root.classList.add(mode)
                })
              }
            }}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              layoutMode === 'flex-row'
                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50 shadow-lg shadow-blue-500/20'
                : 'bg-blue-500/10 text-blue-300 border border-blue-400/25 hover:bg-blue-500/15 hover:border-blue-400/40'
            }`}
          >
            Horizontal
          </button>
        </div>

        {/* Projects Container - Animated Layout */}
        <div 
          ref={containerRef}
          className={`projects-layout-container ${layoutMode}`}
        >
          {projectsData.map((project, index) => (
            <div
              key={index}
              ref={el => cardRefs.current[index] = el}
              data-index={index}
              className={`project-card transform transition-all duration-700 ease-out ${
                visibleCards.has(String(index)) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <Card className="flex flex-col h-full overflow-hidden p-0 card-interactive group">
                {/* Project Image/Icon */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 h-40 flex items-center justify-center text-6xl relative overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                  }} />
                  <div className="relative z-10 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {project.image}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-grow p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300">
                    {project.title}
                  </h3>

                  {/* Status & Type Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                        project.status === 'Live' 
                          ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                          : 'bg-blue-500/30 text-blue-200 border border-blue-400/40'
                      }`}
                    >
                      {project.status}
                    </span>
                    {/* Type Badge */}
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full bg-cyan-500/25 text-cyan-100 border border-cyan-400/35 backdrop-blur-sm"
                    >
                      {project.type}
                    </span>
                    {/* Main Tech */}
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-500/25 text-blue-100 border border-blue-400/35 backdrop-blur-sm"
                    >
                      {project.technologies[0]}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-text text-sm leading-relaxed mb-4 flex-grow group-hover:text-text transition-colors duration-300">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <Badge key={idx} variant="default" className="text-xs bg-blue-500/30 text-blue-100 border border-blue-400/40 hover:border-blue-400/60 transition-colors backdrop-blur-sm">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-slate-500/30 text-slate-200 border border-slate-400/30">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Key Features */}
                  <div className="bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-lg p-3 mb-4 border border-blue-400/20 group-hover:border-blue-400/40 transition-colors duration-300">
                    <p className="text-xs font-semibold text-blue-300 mb-2">
                      Fonctionnalités clés :
                    </p>
                    <ul className="text-xs text-text space-y-1">
                      {project.features.slice(0, 2).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {project.features.length > 2 && (
                        <li className="text-blue-400 font-medium">
                          +{project.features.length - 2} fonctionnalités...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    {project.demoLink ? (
                      <Link
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full shadow-md shadow-blue-500/20"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                          Live Demo
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full opacity-50 cursor-not-allowed"
                          disabled
                        >
                          Demo bientôt
                        </Button>
                      </div>
                    )}
                    <Link
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <FaGithub className="w-3 h-3" />
                        Code
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
        {/* End Projects Container */}

        {/* CTA Section */}
        <div className="mt-16 text-center animate-section-reveal">
          <p className="text-text/80 mb-6 text-lg font-medium">
            Intéressé par ma façon de travailler ?
          </p>
          <Button href="#contact" size="lg">
            Parlons de votre projet
          </Button>
        </div>
      </div>
    </section>
  )
}
