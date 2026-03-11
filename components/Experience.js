'use client'

import { FaBriefcase, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'

/**
 * COMPOSANT EXPERIENCE (EXPÉRIENCE PROFESSIONNELLE)
 * Section présentant les expériences professionnelles avec design moderne
 * Pour modifier les données, changez l'objet experienceData ci-dessous
 */
export default function Experience() {
  const experienceData = [
    {
      title: 'Full-Stack Developer (Junior)',
      company: 'Personal & Academic Projects (ESISA)',
      location: 'Fès, Maroc',
      period: '2025/2026 – Présent',
      type: 'Hands-on Product Building',
      achievements: [
        'Developed responsive web applications using React, Next.js, and Node.js patterns.',
        'Improved UI consistency by building reusable component blocks for faster iteration.',
        'Optimized API and form flows to reduce friction and improve user task completion.',
        'Shipped and maintained demo deployments with iterative UX and performance enhancements.',
      ],
      current: true,
    },
  ]

  return (
    <section id="experience" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        {/* Titre principal */}
        <SectionTitle 
          title="Expérience"
          subtitle="Impact-oriented contributions and practical engineering experience"
          align="center"
        />

        {/* Liste des expériences */}
        <div className="max-w-4xl mx-auto space-y-6">
          {experienceData.map((exp, index) => (
            <Card key={index} hover={false}>
              {/* En-tête */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 pb-4 border-b border-border ">
                <div className="flex-1 mb-4 md:mb-0">
                  {/* Role */}
                  <div className="flex items-start gap-3 mb-3">
                    <FaBriefcase className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-heading mb-2">
                        {exp.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {exp.current && (
                          <Badge variant="success">Actuellement</Badge>
                        )}
                        {exp.type && (
                          <Badge variant="default">{exp.type}</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Company */}
                  <p className="text-lg font-semibold text-primary mb-2">
                    {exp.company}
                  </p>
                </div>

                {/* Période et lieu */}
                <div className="flex flex-col gap-2 md:text-right md:items-end">
                  <div className="flex items-center gap-2 text-text">
                    <FaCalendar className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <FaMapMarkerAlt className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <p className="text-sm font-semibold text-heading mb-3">
                  Key achievements:
                </p>
                <ul className="space-y-2">
                  {exp.achievements.map((resp, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      <span className="text-text leading-relaxed">
                        {resp}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
