'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import SectionTitle from './ui/SectionTitle'

export default function Certifications() {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const touchStartX = useRef(null)

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
      image: '/certificates/cert-prompt-engineering.jpeg',
    },
    {
      title: 'Prompt Engineering',
      organization: 'Simplilearn SkillUp',
      date: '5 Février 2026',
      certificateId: '9808496',
      image: '/certificates/cert-cybersecurity.jpeg',
    },
    {
      title: 'Cybersecurity',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-CS-2026',
      image: '/certificates/cert-ai-business.jpeg',
    },
    {
      title: 'Agile Project',
      organization: 'HP LIFE / HP Foundation',
      date: 'Février 2026',
      certificateId: 'HPF-APM-2026',
      image: '/certificates/cert-agile.jpeg',
    },
  ]

  const openViewer = (index) => {
    setCurrentIndex(index)
    setViewerOpen(true)
    setIsZoomed(false)
  }

  const closeViewer = () => {
    setViewerOpen(false)
    setIsZoomed(false)
  }

  const nextCertificate = () => {
    setCurrentIndex((prev) => (prev + 1) % certificationsData.length)
    setIsZoomed(false)
  }

  const prevCertificate = () => {
    setCurrentIndex((prev) => (prev - 1 + certificationsData.length) % certificationsData.length)
    setIsZoomed(false)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!viewerOpen) return

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevCertificate()
      else if (e.key === 'ArrowRight') nextCertificate()
      else if (e.key === 'Escape') closeViewer()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [viewerOpen, currentIndex])

  // Touch swipe for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextCertificate()
      else prevCertificate()
    }
    touchStartX.current = null
  }

  return (
    <section id="certifications" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      <div className="container-custom">
        <SectionTitle 
          title="Certifications"
          subtitle="Certifications professionnelles et formations complétées"
          align="center"
        />

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
          {certificationsData.map((cert, index) => (
            <div
              key={index}
              onClick={() => openViewer(index)}
              className="glass-card group cursor-pointer rounded-xl overflow-hidden transition-all duration-300"
            >
              {/* Certificate Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-950/40 to-slate-900/40">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-cover"
                />
                {/* Verified badge */}
                <div className="absolute top-3 right-3 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-400/50 shadow-lg flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Vérifié
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-blue-100 mb-2 group-hover:text-cyan-300 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm text-blue-200/80 mb-1">{cert.organization}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-400/20">
                  <span className="text-xs text-blue-300/70">{cert.date}</span>
                  <span className="text-xs text-blue-300/70 font-mono">ID: {cert.certificateId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Viewer */}
        {viewerOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            style={{ background: 'rgba(0, 0, 0, 0.92)' }}
            onClick={closeViewer}
          >
            {/* Close Button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 z-60 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 backdrop-blur-sm"
              aria-label="Close viewer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => { e.stopPropagation(); prevCertificate(); }}
              className="absolute left-4 z-60 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous certificate"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); nextCertificate(); }}
              className="absolute right-4 z-60 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 backdrop-blur-sm"
              aria-label="Next certificate"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Certificate Display */}
            <div 
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Image Container */}
              <div 
                className={`relative w-full flex-1 flex items-center justify-center cursor-zoom-${isZoomed ? 'out' : 'in'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <div className={`relative transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}>
                  <Image
                    src={certificationsData[currentIndex].image}
                    alt={certificationsData[currentIndex].title}
                    width={1200}
                    height={900}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Certificate Info */}
              <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-md border border-blue-400/20">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-100 mb-2">
                      {certificationsData[currentIndex].title}
                    </h3>
                    <p className="text-blue-200/80 mb-1">
                      {certificationsData[currentIndex].organization}
                    </p>
                    <p className="text-sm text-blue-300/70">
                      {certificationsData[currentIndex].date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 backdrop-blur-sm text-blue-100 text-sm font-semibold px-4 py-2 rounded-lg border border-blue-400/30">
                      ID: {certificationsData[currentIndex].certificateId}
                    </div>
                    <div className="bg-green-500/20 backdrop-blur-sm text-green-100 text-sm font-semibold px-4 py-2 rounded-lg border border-green-400/30 flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Vérifié
                    </div>
                  </div>
                </div>
                
                {/* Counter */}
                <div className="mt-4 text-center text-blue-300/60 text-sm">
                  {currentIndex + 1} / {certificationsData.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
