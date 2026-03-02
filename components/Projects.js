'use client'

import Link from 'next/link'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

/**
 * COMPOSANT PROJECTS (PROJETS)
 * Section présentant les projets réalisés avec design moderne
 * Pour modifier les données, changez l'objet projectsData ci-dessous
 */
export default function Projects() {
  const projectsData = [
    {
      title: 'Maison Élégance',
      description: 'Application web complète pour un restaurant avec menu interactif, système de panier, gestion des réservations, avis clients, galerie photos, FAQ et formulaire de contact. Interface moderne et responsive.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
      demoLink: 'https://maisonelegance-one.vercel.app/',
      githubLink: 'https://github.com/tchiboub-dot',
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
      features: [
        'Design professionnel',
        'Marketing optimisé',
        'Présentation offres',
        'Galerie photos',
      ],
      image: '💪',
    },
  ]

  return (
    <section id="projects" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        {/* Titre principal */}
        <SectionTitle 
          title="Mes Projets"
          subtitle="Découvrez quelques-uns de mes projets récents et réalisations"
          align="center"
        />

        {/* Grille de projets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projectsData.map((project, index) => (
            <Card key={index} className="flex flex-col h-full overflow-hidden p-0">
              {/* Image/Icône du projet */}
              <div className="bg-gradient-to-br from-primary via-primary-dark to-accent h-40 flex items-center justify-center text-6xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-pattern" />
                <div className="relative z-10">{project.image}</div>
              </div>

              {/* Contenu de la carte */}
              <div className="flex flex-col flex-grow p-6">
                {/* Titre du projet */}
                <h3 className="text-xl font-bold text-heading mb-2">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-text text-sm leading-relaxed mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Technologie principales */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <Badge key={idx} variant="default" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Fonctionnalités principales (mini list) */}
                <div className="bg-primary-soft  rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-heading mb-2">
                    Fonctionnalités clés :
                  </p>
                  <ul className="text-xs text-text space-y-1">
                    {project.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary bg-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {project.features.length > 2 && (
                      <li className="text-primary text-primary font-medium">
                        +{project.features.length - 2} fonctionnalités...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2 mt-auto">
                  {project.demoLink && (
                    <Link
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                        Démo
                      </Button>
                    </Link>
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
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <p className="text-text mb-6 text-lg">
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
