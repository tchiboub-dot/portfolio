'use client'

import { FaCertificate } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'

export default function Certifications() {
  const certificationsData = [
    {
      title: 'C Programming Basics',
      organization: 'Simplilearn SkillUp',
      date: '10 Janvier 2026',
      certificateId: '9698550',
      logo: '💻',
    },
    {
      title: 'Prompt Engineering Applications',
      organization: 'Simplilearn SkillUp',
      date: '5 Février 2026',
      certificateId: '9808496',
      logo: '🤖',
    },
    {
      title: 'AI for Business Professionals',
      organization: 'HP LIFE / HP Foundation',
      date: '3 Février 2026',
      certificateId: 'HPF-AI-2026',
      logo: '🎓',
    },
    {
      title: 'Cybersecurity Essentials',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-CS-2026',
      logo: '🔐',
    },
    {
      title: 'Agile Project Management',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-APM-2026',
      logo: '📊',
    },
  ]

  return (
    <section id="certifications" className="section py-24 md:py-32 bg-background dark:bg-dark-background">
      <div className="container-custom">
        <SectionTitle 
          title="Certifications"
          subtitle="Certifications professionnelles et formations complétées"
          align="center"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificationsData.map((cert, index) => (
            <Card key={index} hover={false} className="flex flex-col">
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border dark:border-dark-border">
                <div className="text-4xl">{cert.logo}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-primary dark:text-accent font-medium">
                    {cert.organization}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary opacity-70">
                      Date d'obtention
                    </p>
                    <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                      {cert.date}
                    </p>
                  </div>
                </div>
                <div className="bg-primary-soft dark:bg-dark-primary-soft p-3 rounded-lg">
                  <p className="text-xs text-text-secondary dark:text-dark-text-secondary opacity-70 mb-1">
                    ID Certification
                  </p>
                  <p className="text-sm font-mono font-medium text-text-primary dark:text-dark-text-primary">
                    {cert.certificateId}
                  </p>
                </div>
                <Badge variant="success" className="justify-center w-full">
                  <FaCertificate className="w-3 h-3 mr-1" />
                  Vérifiée
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
