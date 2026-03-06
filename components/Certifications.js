'use client'

import Image from 'next/image'
import { useState } from 'react'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import StackedCardGroup from './StackedCardGroup'

/**
 * CERTIFICATIONS COMPONENT
 * Features:
 * - Stacked card carousel with smooth animations
 * - Click to view full certificate with zoom
 * - Arrow navigation + pagination dots
 * - Keyboard and swipe support
 * - Galaxy glass theme maintained
 */
export default function Certifications() {
  const certificationsData = [
    {
      id: 1,
      title: 'C Programming',
      organization: 'Simplilearn SkillUp',
      date: '10 Janvier 2026',
      certificateId: '9698550',
      image: '/certificates/cert-c-programming.png',
      description: 'Certification en programmation C, couvrant les concepts fondamentaux et avancés du langage.',
    },
    {
      id: 2,
      title: 'AI Business',
      organization: 'HP LIFE / HP Foundation',
      date: '3 Février 2026',
      certificateId: 'HPF-AI-2026',
      image: '/certificates/cert-prompt-engineering.jpeg',
      description: 'Formation aux applications pratiques de l\'IA dans les contextes commerciaux.',
    },
    {
      id: 3,
      title: 'Prompt Engineering',
      organization: 'Simplilearn SkillUp',
      date: '5 Février 2026',
      certificateId: '9808496',
      image: '/certificates/cert-cybersecurity.jpeg',
      description: 'Maîtrise des techniques de génération de prompts efficaces pour les modèles IA.',
    },
    {
      id: 4,
      title: 'Cybersecurity',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-CS-2026',
      image: '/certificates/cert-ai-business.jpeg',
      description: 'Certification en sécurité informatique couvrant les meilleures pratiques et menaces actuelles.',
    },
    {
      id: 5,
      title: 'Agile Project',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-APM-2026',
      image: '/certificates/cert-agile.jpeg',
      description: 'Formation à la gestion de projets agiles et aux méthodologies de développement modernes.',
    },
  ]

  const renderCard = (cert, isActive) => (
    <Card
      className={`h-full overflow-hidden p-0 card-interactive group flex flex-col transition-shadow duration-300 ${
        isActive ? 'shadow-2xl shadow-blue-500/30' : ''
      }`}
      hover={isActive}
      style={{ willChange: 'transform' }}
    >
      {/* Certificate Image */}
      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-blue-950/40 to-slate-900/40">
        <Image
          src={cert.image}
          alt={cert.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Verified badge */}
        <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-green-400/50 shadow-lg flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Vérifié
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-6">
        {/* Title */}
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-300">
          {cert.title}
        </h3>

        {/* Organization */}
        <p className="text-sm text-blue-200/80 mb-3 flex-grow">
          {cert.organization}
        </p>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-blue-300/70 pt-3 border-t border-blue-400/20">
          <div className="flex items-center justify-between">
            <span>{cert.date}</span>
            <span className="font-mono text-blue-300/60">ID: {cert.certificateId}</span>
          </div>
        </div>
      </div>
    </Card>
  )

  const renderDetails = (cert, index, nav) => (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Title and Info */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
          {cert.title}
        </h2>
        <p className="text-blue-200/80 text-lg mb-3">{cert.organization}</p>
        <div className="flex flex-wrap gap-3">
          <div className="bg-blue-500/20 backdrop-blur-sm text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-400/30">
            {cert.date}
          </div>
          <div className="bg-blue-500/20 backdrop-blur-sm text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-400/30 font-mono">
            ID: {cert.certificateId}
          </div>
          <div className="bg-green-500/20 backdrop-blur-sm text-green-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-400/30 flex items-center gap-1.5">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Vérifié
          </div>
        </div>
      </div>

      {/* Certificate Image - Full View */}
      <div className="relative bg-gradient-to-br from-blue-950/40 to-slate-900/40 rounded-xl overflow-hidden border border-blue-400/20 p-4">
        <div className="relative w-full aspect-[4/3] flex items-center justify-center">
          <Image
            src={cert.image}
            alt={cert.title}
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">À propos</h3>
        <p className="text-text/90 leading-relaxed text-base">
          {cert.description}
        </p>
      </div>

      {/* Download Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-400/20">
        <a
          href={cert.image}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-colors duration-300 text-sm font-medium text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Voir en plein écran
        </a>
        <a
          href={cert.image}
          download={`${cert.title}-${cert.certificateId}`}
          className="flex-1 px-4 py-2 rounded-lg bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/40 text-blue-100 transition-colors duration-300 text-sm font-medium text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Télécharger
        </a>
      </div>

      {/* Navigation */}
      {nav.totalItems > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-blue-400/20">
          <button
            onClick={nav.onPrev}
            className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-colors duration-300 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Certificat précédent"
          >
            ← Précédent
          </button>
          <span className="text-xs text-blue-300/70 font-medium">
            {index + 1} / {nav.totalItems}
          </span>
          <button
            onClick={nav.onNext}
            className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-colors duration-300 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Certificat suivant"
          >
            Suivant →
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )

  return (
    <section id="certifications" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 -left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slower" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Certifications"
          subtitle="Certifications professionnelles et formations complétées"
          align="center"
        />

        {/* Stacked Card Group - Right-Offset Stack */}
        <div className="mt-16">
          <StackedCardGroup
            items={certificationsData}
            renderCard={renderCard}
            renderDetails={renderDetails}
            cardCount={5}
            rightOffset={20}
            downOffset={12}
            onNavigate={(index) => {
              // Optional: analytics tracking
            }}
          />
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-section-reveal">
          <div className="text-center p-6 rounded-xl bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
              {certificationsData.length}
            </div>
            <p className="text-sm text-blue-200/80">Certifications</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <p className="text-sm text-blue-200/80">Vérifiées</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
              2026
            </div>
            <p className="text-sm text-blue-200/80">Année en cours</p>
          </div>
        </div>
      </div>
    </section>
  )
}
