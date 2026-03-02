'use client'

import { FaGraduationCap, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'

/**
 * COMPOSANT EDUCATION (FORMATION)
 * Section présentant le parcours éducatif avec timeline
 * Pour modifier les données, changez l'objet educationData ci-dessous
 */
export default function Education() {
  const educationData = [
    {
      degree: 'Cycle Ingénieur en Informatique',
      institution: 'ESISA Fes',
      location: 'Fès, Maroc',
      period: '2025/2026 – Présent',
      description: 'Formation en informatique couvrant l\'algorithmique, la programmation, les systèmes, la logique et les bases du développement logiciel.',
      highlights: [
        'Algorithmique et structures de données',
        'Programmation orientée objet',
        'Systèmes d\'exploitation et réseaux',
        'Développement d\'applications web',
      ],
      current: true,
    },
  ]

  return (
    <section id="education" className="section py-24 md:py-32 bg-background dark:bg-dark-background">
      <div className="container-custom">
        {/* Titre principal */}
        <SectionTitle 
          title="Formation"
          subtitle="Mon parcours éducatif et les domaines maîtrisés"
          align="center"
        />

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {educationData.map((edu, index) => (
              <div key={index} className="relative">
                {/* Indicateur de timeline */}
                <div className="absolute -left-4 md:-left-12 top-6 w-8 h-8 bg-primary dark:bg-accent rounded-full border-4 border-background dark:border-dark-background shadow-soft" />

                {/* Ligne verticale */}
                {index < educationData.length - 1 && (
                  <div className="absolute -left-0 md:-left-8 top-14 w-1 h-24 bg-gradient-to-b from-primary to-transparent" />
                )}

                {/* Contenu */}
                <Card className="ml-0 md:ml-12 hover:false">
                  {/* En-tête */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 pb-4 border-b border-border dark:border-dark-border">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <FaGraduationCap className="w-5 h-5 text-primary dark:text-accent flex-shrink-0" />
                        <h3 className="text-xl md:text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                          {edu.degree}
                        </h3>
                      </div>
                      <p className="text-lg font-semibold text-primary dark:text-accent mb-1">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-dark-text-secondary flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="w-4 h-4 flex-shrink-0" />
                        {edu.location}
                      </p>
                    </div>

                    {/* Badge statut */}
                    {edu.current && (
                      <Badge variant="accent" className="flex-shrink-0">
                        En cours
                      </Badge>
                    )}
                  </div>

                  {/* Période */}
                  <div className="flex items-center gap-2 text-text-secondary dark:text-dark-text-secondary mb-4">
                    <FaCalendar className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{edu.period}</span>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary dark:text-dark-text-secondary mb-6 leading-relaxed">
                    {edu.description}
                  </p>

                  {/* Domaines d'études */}
                  <div>
                    <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-3">
                      Domaines d'étude :
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {edu.highlights.map((highlight, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-3 rounded-lg bg-primary-soft dark:bg-dark-primary-soft"
                        >
                          <span className="text-primary dark:text-accent font-bold mt-0.5">✓</span>
                          <span className="text-sm text-text-primary dark:text-dark-text-primary">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
