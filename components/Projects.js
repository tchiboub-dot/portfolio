'use client'

import { FaExternalLinkAlt, FaGithub, FaCode } from 'react-icons/fa'

/**
 * COMPOSANT PROJECTS (PROJETS)
 * Section présentant les projets réalisés
 * Pour modifier les informations, changez les valeurs dans le tableau projectsData ci-dessous
 */
export default function Projects() {
  // DONNÉES DE LA SECTION PROJETS - MODIFIEZ ICI
  const projectsData = [
    {
      title: 'Maison Élégance',
      description: 'Application web complète pour un restaurant avec menu interactif, système de panier, gestion des réservations, avis clients, galerie photos, FAQ et formulaire de contact. Interface moderne et responsive.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      demoLink: 'https://maisonelegance-one.vercel.app/',
      githubLink: 'https://github.com/tchiboub-dot',
      features: [
        'Menu interactif avec catégories',
        'Système de panier dynamique',
        'Réservation en ligne',
        'Section avis clients',
        'Galerie photo responsive',
      ],
      image: '🍽️', // Vous pouvez remplacer par une vraie image
    },
    {
      title: 'Student Management System',
      description: 'Application web de gestion des étudiants avec fonctionnalités CRUD complètes, authentification basique et interface utilisateur responsive. Démonstration de compétences en développement full-stack.',
      technologies: ['React', 'JavaScript', 'CSS', 'Authentication'],
      demoLink: 'https://student-management5.vercel.app/',
      githubLink: 'https://github.com/tchiboub-dot',
      features: [
        'CRUD complet (Create, Read, Update, Delete)',
        'Authentification utilisateur',
        'Interface responsive',
        'Gestion des données en temps réel',
      ],
      image: '📚',
    },
    {
      title: 'Site Web pour Gym',
      description: 'Site vitrine professionnel pour une salle de sport avec sections marketing, présentation des offres et services, galerie photos, et formulaire de contact. Design moderne et attrayant.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design'],
      githubLink: 'https://github.com/tchiboub-dot',
      features: [
        'Design moderne et professionnel',
        'Sections marketing optimisées',
        'Présentation des offres',
        'Formulaire de contact',
        'Galerie photos',
      ],
      image: '💪',
    },
  ]

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Titre de la section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mes Projets
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Découvrez quelques-uns de mes projets récents
          </p>
        </div>

        {/* Grille de projets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image/Icône du projet */}
              <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-8xl">
                {project.image}
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                {/* Titre du projet */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Fonctionnalités clés */}
                {project.features && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <FaCode className="mr-2 text-primary" />
                      Fonctionnalités :
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {project.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Liens */}
                <div className="flex gap-3">
                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center justify-center"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      Démo
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <FaGithub className="mr-2" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA GitHub */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Retrouvez tous mes projets sur GitHub
          </p>
          <a
            href="https://github.com/tchiboub-dot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <FaGithub className="mr-2 text-xl" />
            Voir mon profil GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
