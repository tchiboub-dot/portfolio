'use client'

import Image from 'next/image'
import { FaCertificate, FaEye } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { useState } from 'react'

export default function Certifications() {
  const [selectedImage, setSelectedImage] = useState(null)

  const certificationsData = [
    {
      title: 'C Programming Basics',
      organization: 'Simplilearn SkillUp',
      date: '10 Janvier 2026',
      certificateId: '9698550',
      image: '/certificates/cert-c-programming.png',
    },
    {
      title: 'Prompt Engineering Applications',
      organization: 'Simplilearn SkillUp',
      date: '5 Février 2026',
      certificateId: '9808496',
      image: '/certificates/cert-prompt-engineering.jpeg',
    },
    {
      title: 'AI for Business Professionals',
      organization: 'HP LIFE / HP Foundation',
      date: '3 Février 2026',
      certificateId: 'HPF-AI-2026',
      image: '/certificates/cert-ai-business.jpeg',
    },
    {
      title: 'Cybersecurity Essentials',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-CS-2026',
      image: '/certificates/cert-cybersecurity.jpeg',
    },
    {
      title: 'Agile Project Management',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-APM-2026',
      image: '/certificates/cert-agile.jpeg',
    },
  ]

  return (
    <section id="certifications" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle 
          title="Certifications"
          subtitle="Certifications professionnelles et formations complétées"
          align="center"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificationsData.map((cert, index) => (
            <Card key={index} className="flex flex-col h-full overflow-hidden">
              {/* Thumbnail image */}
              <div 
                className="relative w-full h-48 cursor-pointer group overflow-hidden rounded-lg mb-4"
                onClick={() => setSelectedImage(cert.image)}
              >
                <Image
                  src={cert.image}
                  alt={cert.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  quality={85}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-white font-medium">
                    <FaEye className="w-4 h-4" />
                    Voir
                  </div>
                </div>
              </div>

              {/* Certification info */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-heading mb-1 line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-sm text-primary font-medium mb-3">
                  {cert.organization}
                </p>

                {/* Date and ID */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <div>
                      <p className="text-xs text-muted">Date d'obtention</p>
                      <p className="text-sm font-medium text-heading">
                        {cert.date}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary-soft p-3 rounded-lg">
                    <p className="text-xs text-muted mb-1">ID Certification</p>
                    <p className="text-sm font-mono font-medium text-heading break-all">
                      {cert.certificateId}
                    </p>
                  </div>
                </div>

                {/* Verified badge */}
                <Badge variant="success" className="justify-center w-full mt-3">
                  <FaCertificate className="w-3 h-3 mr-1" />
                  Vérifiée
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal para ver certificado completo */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-auto">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-primary transition-colors"
            >
              ✕ Fermer
            </button>
            <Image
              src={selectedImage}
              alt="Certificat agrandit"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg shadow-lg"
              quality={95}
              priority
            />
          </div>
        </div>
      )}
    </section>
  )
}
