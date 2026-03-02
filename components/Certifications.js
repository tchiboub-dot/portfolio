'use client'

import Image from 'next/image'
import { FaCertificate, FaEye, FaTimes } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { useState } from 'react'

export default function Certifications() {
  const [selectedImage, setSelectedImage] = useState(null)

  const certificationsData = [
    {
      title: 'C Programming',
      organization: 'Simplilearn SkillUp',
      date: '10 Janvier 2026',
      certificateId: '9698550',
      image: '/certificates/cert-c-programming.png',
    },
    {
      title: 'AI Business',
      organization: 'HP LIFE / HP Foundation',
      date: '3 Février 2026',
      certificateId: 'HPF-AI-2026',
      image: '/certificates/cert-ai-business.jpeg',
    },
    {
      title: 'Prompt Engineering',
      organization: 'Simplilearn SkillUp',
      date: '5 Février 2026',
      certificateId: '9808496',
      image: '/certificates/cert-prompt-engineering.jpeg',
    },
    {
      title: 'Cybersecurity',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-CS-2026',
      image: '/certificates/cert-cybersecurity.jpeg',
    },
    {
      title: 'Agile Project',
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
        
        {/* Grid uniforme desktop 2 colonnes, mobile 1 colonne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {certificationsData.map((cert, index) => (
            <Card 
              key={index} 
              className="flex flex-col h-full"
            >
              {/* IMAGE ZONE - FIXE 16:9 RATIO, PLUS GRANDE */}
              <div
                className="relative w-full aspect-video bg-white rounded-lg overflow-hidden mb-6 cursor-pointer group border border-border-light shadow-sm hover:shadow-md transition-all duration-normal"
                onClick={() => setSelectedImage(cert.image)}
              >
                {/* Image - object-fit contain */}
                <Image
                  src={cert.image}
                  alt={`Certificat - ${cert.title}`}
                  width={800}
                  height={450}
                  className="w-full h-full object-contain p-3"
                  quality={90}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-white font-medium text-sm shadow-lg">
                      <FaEye className="w-4 h-4" />
                      Voir en grand
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTENU - STRUCTURE FIXE */}
              <div className="flex-1 flex flex-col gap-4">
                {/* TITRE - Zone dédiée, clamp 2 lignes */}
                <div className="min-h-16">
                  <h3 className="text-lg font-bold text-heading leading-tight line-clamp-2">
                    {cert.title}
                  </h3>
                </div>

                {/* ORGANISATION - Secondaire */}
                <div className="pb-2 border-b border-border/30">
                  <p className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                    {cert.organization}
                  </p>
                </div>

                {/* DATE - Compact */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-base">📅</span>
                  <div className="flex-1">
                    <p className="text-xs text-muted">Date d'obtention</p>
                    <p className="text-sm font-medium text-heading">
                      {cert.date}
                    </p>
                  </div>
                </div>

                {/* ID CERTIFICATION - Encadré */}
                <div className="bg-primary-soft border border-primary/20 p-3 rounded-lg">
                  <p className="text-xs text-muted mb-1 font-medium">ID Certification</p>
                  <p className="text-sm font-mono text-heading font-semibold break-all">
                    {cert.certificateId}
                  </p>
                </div>

                {/* BADGE - Sticky en bas */}
                <div className="mt-auto pt-2">
                  <Badge variant="success" className="w-full justify-center">
                    <FaCertificate className="w-3.5 h-3.5 mr-2" />
                    Vérifiée
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* MODAL FULLSCREEN */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh]">
            {/* Bouton Fermer */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors text-xl font-bold z-10 flex items-center gap-2"
              aria-label="Fermer le modal"
            >
              <FaTimes className="w-5 h-5" />
              <span className="text-sm">Fermer</span>
            </button>

            {/* Image Agrandie */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <Image
                src={selectedImage}
                alt="Certificat à plein écran"
                width={1600}
                height={1000}
                className="w-full h-auto"
                quality={95}
                priority
              />
            </div>

            {/* Info supplémentaire */}
            <div className="text-center mt-4 text-white text-sm">
              <p>Cliquez en arrière-plan pour fermer</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
