'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const certifications = [
    {
      name: 'AI Business Certificate',
      organization: 'HP LIFE / HP Foundation',
      year: '2026',
      preview: '/certificates/cert-ai-business.jpeg',
      description: 'Credential focused on practical AI applications in business workflows and decision-making contexts.',
      verification: 'Credential verified through HP LIFE completion records.',
    },
    {
      name: 'Prompt Engineering Certificate',
      organization: 'Simplilearn SkillUp',
      year: '2026',
      preview: '/certificates/cert-prompt-engineering.jpeg',
      description: 'Certification on designing effective prompts, prompt patterns, and reliable AI-assisted output workflows.',
      verification: 'Credential ID: 9808496',
    },
    {
      name: 'Cybersecurity Fundamentals',
      organization: 'HP LIFE / HP Foundation',
      year: '2026',
      preview: '/certificates/cert-cybersecurity.jpeg',
      description: 'Covers modern cybersecurity principles, risk awareness, and secure digital best practices.',
      verification: 'Credential verified through HP LIFE completion records.',
    },
    {
      name: 'C Programming Certificate',
      organization: 'Simplilearn SkillUp',
      year: '2026',
      preview: '/certificates/cert-c-programming.png',
      description: 'Fundamental-to-advanced C programming concepts including control flow, memory, and structured design.',
      verification: 'Credential ID: 9698550',
    },
    {
      name: 'Agile Project Management',
      organization: 'HP LIFE / HP Foundation',
      year: '2026',
      preview: '/certificates/cert-agile.jpeg',
      description: 'Training in agile project delivery, iterative planning, collaboration, and product execution discipline.',
      verification: 'Credential verified through HP LIFE completion records.',
    },
  ]

  const totalCount = certifications.length

  const openModal = (cert) => {
    setSelectedCert(cert)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedCert(null), 220)
  }

  useEffect(() => {
    if (!isModalOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isModalOpen])

  return (
    <section id="certifications" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 -left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slower" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Certifications"
          subtitle="Verified learning credentials that reinforce technical reliability and continuous growth"
          align="center"
        />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
          {certifications.map((cert, index) => (
            <div key={cert.name} className="relative group h-full">
              <div className="absolute inset-0 rounded-[24px] border border-blue-400/15 bg-blue-900/10 translate-x-1.5 translate-y-1.5 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
              <Card className="relative z-10 overflow-hidden p-0 h-full min-h-[430px] card-interactive transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01]">
                <button
                  type="button"
                  onClick={() => openModal(cert)}
                  className="w-full h-full text-left"
                  aria-label={`Open certificate: ${cert.name}`}
                >
                  <div className="relative h-56 w-full bg-blue-950/40 overflow-hidden">
                    <Image
                      src={cert.preview}
                      alt={`${cert.name} preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/70 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/40 bg-blue-500/20 text-blue-100 backdrop-blur-sm">
                      {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="text-base font-bold text-heading leading-snug min-h-[48px]">{cert.name}</h3>
                    <p className="text-sm text-blue-200/90 font-medium">{cert.organization}</p>
                    <div className="pt-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-100 border border-blue-400/40">
                        {cert.year}
                      </span>
                    </div>
                  </div>
                </button>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {selectedCert && (
        <div
          className={`fixed inset-0 z-[80] p-4 md:p-8 flex items-center justify-center transition-all duration-300 ${
            isModalOpen ? 'bg-slate-950/75 opacity-100' : 'bg-slate-950/0 opacity-0'
          }`}
          onClick={closeModal}
        >
          <div
            className={`w-full max-w-5xl rounded-[24px] border border-blue-400/30 bg-gradient-to-br from-blue-950/55 to-slate-900/55 backdrop-blur-xl shadow-[0_0_0_1px_rgba(59,130,246,0.18),0_0_30px_rgba(59,130,246,0.25)] overflow-hidden transition-all duration-300 ${
              isModalOpen ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-blue-400/20">
              <p className="text-sm text-blue-200/90 font-medium">Certificate Preview</p>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-blue-400/35 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 transition-all duration-300"
                aria-label="Close certificate preview"
              >
                ✕
              </button>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0">
              <div className="relative min-h-[280px] md:min-h-[420px] bg-blue-950/40">
                <Image
                  src={selectedCert.preview}
                  alt={`${selectedCert.name} full certificate`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain"
                />
              </div>

              <div className="p-5 md:p-7 space-y-4">
                <h3 className="text-2xl font-bold text-heading leading-tight">{selectedCert.name}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-blue-200/90"><span className="font-semibold text-blue-100">Issuer:</span> {selectedCert.organization}</p>
                  <p className="text-sm text-blue-200/90"><span className="font-semibold text-blue-100">Year:</span> {selectedCert.year}</p>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-semibold text-blue-100 mb-2">Credential Summary</p>
                  <p className="text-sm text-text leading-relaxed">{selectedCert.description}</p>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-semibold text-blue-100 mb-2">Verification</p>
                  <p className="text-sm text-cyan-100/90">{selectedCert.verification}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
