'use client'

import { FaGraduationCap, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'

/**
 * COMPOSANT EDUCATION (FORMATION)
 * Section présentant le parcours éducatif
 * Pour modifier les informations, changez les valeurs dans le tableau educationData ci-dessous
 */
export default function Education() {
  // DONNÉES DE LA SECTION ÉDUCATION - MODIFIEZ ICI
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
    <section id="education" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Titre de la section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Formation
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Liste des formations */}
        <div className="space-y-8">
          {educationData.map((edu, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1">
                  {/* Diplôme */}
                  <div className="flex items-start mb-2">
                    <FaGraduationCap className="text-primary text-2xl mr-3 mt-1" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {edu.degree}
                      </h3>
                      {edu.current && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                          En cours
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Institution */}
                  <h4 className="text-xl text-primary font-semibold mb-3">
                    {edu.institution}
                  </h4>
                </div>

                {/* Période et lieu */}
                <div className="text-gray-600 md:text-right mt-4 md:mt-0">
                  <div className="flex items-center md:justify-end mb-2">
                    <FaCalendar className="mr-2" />
                    <span>{edu.period}</span>
                  </div>
                  <div className="flex items-center md:justify-end">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{edu.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {edu.description}
              </p>

              {/* Points clés */}
              {edu.highlights && edu.highlights.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">Points clés :</h5>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {edu.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <span className="text-primary mr-2">✓</span>
                        {highlight}
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
            Pour ajouter plus de formations, modifiez le tableau educationData dans le fichier Education.js
          </p>
        </div>
      </div>
    </section>
  )
}
