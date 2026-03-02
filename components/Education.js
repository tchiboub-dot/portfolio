'use client'

import { FaGraduationCap, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'

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
    <section id="education" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle 
          title="Formation"
          subtitle="Mon parcours éducatif et les domaines maîtrisés"
          align="center"
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {educationData.map((edu, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-4 md:-left-12 top-6 w-8 h-8 bg-primary rounded-full border-4 border-bg shadow-medium" />
              {i < educationData.length - 1 && (
                <div className="absolute -left-0 md:-left-8 top-14 w-1 h-24 bg-gradient-to-b from-primary to-transparent" />
              )}

              <Card className="ml-0 md:ml-12">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <FaGraduationCap className="w-5 h-5 text-primary" />
                      <h3 className="text-xl md:text-2xl font-bold text-heading">{edu.degree}</h3>
                    </div>
                    <p className="text-lg font-semibold text-primary mb-1">{edu.institution}</p>
                    <p className="text-sm text-text flex items-center gap-2">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      {edu.location}
                    </p>
                  </div>
                  {edu.current && <Badge variant="accent">En cours</Badge>}
                </div>

                <div className="flex items-center gap-2 text-text mb-4">
                  <FaCalendar className="w-4 h-4" />
                  <span className="font-medium">{edu.period}</span>
                </div>

                <p className="text-text mb-6 leading-relaxed">{edu.description}</p>

                <div>
                  <p className="text-sm font-semibold text-heading mb-3">Domaines d'étude :</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {edu.highlights.map((h, j) => (
                      <div key={j} className="flex items-start gap-2 p-3 rounded-lg bg-primary-soft">
                        <span className="text-primary font-bold">✓</span>
                        <span className="text-sm text-text">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
