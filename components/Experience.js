'use client'

import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa'

/**
 * COMPOSANT EXPERIENCE (EXPÉRIENCE PROFESSIONNELLE)
 * Section présentant les expériences professionnelles
 * Pour modifier les informations, changez les valeurs dans le tableau experienceData ci-dessous
 */
export default function Experience() {
  // DONNÉES DE LA SECTION EXPÉRIENCE - MODIFIEZ ICI
  const experienceData = [
    {
      title: 'Développeur Web Junior',
      company: 'Projets personnels & académiques (ESISA)',
      location: 'Fès, Maroc',
      period: '2025/2026 – Présent',
      type: 'Projets personnels',
      responsibilities: [
        'Réalisation de sites et d\'applications web orientées utilisateur (UI claire, responsive)',
        'Implémentation de fonctionnalités : formulaires, validation, navigation, logique front-end, CRUD, authentification basique',
        'Déploiement de démos en ligne et amélioration continue via itérations',
        'Utilisation de technologies modernes : HTML5, CSS3, JavaScript, React, Next.js',
      ],
      current: true,
    },
  ]

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Titre de la section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Expérience
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Liste des expériences */}
        <div className="space-y-8">
          {experienceData.map((exp, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow border-l-4 border-primary"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1">
                  {/* Titre du poste */}
                  <div className="flex items-start mb-2">
                    <FaBriefcase className="text-primary text-2xl mr-3 mt-1" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {exp.title}
                      </h3>
                      {exp.current && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                          Actuellement
                        </span>
                      )}
                      {exp.type && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mt-2 ml-2">
                          {exp.type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Entreprise */}
                  <h4 className="text-xl text-primary font-semibold mb-3">
                    {exp.company}
                  </h4>
                </div>

                {/* Période et lieu */}
                <div className="text-gray-600 md:text-right mt-4 md:mt-0">
                  <div className="flex items-center md:justify-end mb-2">
                    <FaCalendar className="mr-2" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center md:justify-end">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Responsabilités */}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">
                    Responsabilités & réalisations :
                  </h5>
                  <ul className="space-y-2">
                    {exp.responsibilities.map((responsibility, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note informative */}
        <div className="mt-8 text-center text-gray-600">
          <p className="italic">
            Pour ajouter plus d'expériences, modifiez le tableau experienceData dans le fichier Experience.js
          </p>
        </div>
      </div>
    </section>
  )
}
