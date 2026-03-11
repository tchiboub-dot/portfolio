'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Certifications() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)

  const certifications = [
    {
      name: 'AI Business Certificate',
      organization: 'HP LIFE / HP Foundation',
      year: '2026',
      preview: '/certificates/cert-ai-business.jpeg',
      description:
        'Credential focused on practical AI applications in business workflows and decision-making contexts.',
      verification: 'Credential verified through HP LIFE completion records.',
      skills: ['AI Business Use Cases', 'Decision Workflows', 'Digital Strategy'],
    },
    {
      name: 'Prompt Engineering Certificate',
      organization: 'Simplilearn SkillUp',
      year: '2026',
      preview: '/certificates/cert-prompt-engineering.jpeg',
      description:
        'Certification on designing effective prompts, prompt patterns, and reliable AI-assisted output workflows.',
      verification: 'Credential ID: 9808496',
      skills: ['Prompt Design', 'Context Structuring', 'Output Quality Control'],
    },
    {
      name: 'Cybersecurity Fundamentals',
      organization: 'HP LIFE / HP Foundation',
      year: '2026',
      preview: '/certificates/cert-cybersecurity.jpeg',
      description:
        'Covers modern cybersecurity principles, risk awareness, and secure digital best practices.',
      verification: 'Credential verified through HP LIFE completion records.',
      skills: ['Security Basics', 'Threat Awareness', 'Secure Practices'],
    },
    {
      name: 'C Programming Certificate',
      organization: 'Simplilearn SkillUp',
      year: '2026',
      preview: '/certificates/cert-c-programming.png',
      description:
        'Fundamental-to-advanced C programming concepts including control flow, memory, and structured design.',
      verification: 'Credential ID: 9698550',
      skills: ['C Language', 'Memory Concepts', 'Structured Programming'],
    },
    {
      name: 'Agile Project Management',
      organization: 'HP LIFE / HP Foundation',
      year: '2026',
      preview: '/certificates/cert-agile.jpeg',
      description:
        'Training in agile project delivery, iterative planning, collaboration, and product execution discipline.',
      verification: 'Credential verified through HP LIFE completion records.',
      skills: ['Agile Delivery', 'Collaboration', 'Iteration Planning'],
    },
  ]

  const totalCount = certifications.length
  const activeCert = certifications[activeIndex]

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalCount) % totalCount)
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalCount)
  }

  const orderedCards = useMemo(() => {
    return certifications.map((cert, index) => {
      let offset = index - activeIndex
      if (offset > totalCount / 2) offset -= totalCount
      if (offset < -totalCount / 2) offset += totalCount
      return { cert, index, offset }
    })
  }, [activeIndex, certifications, totalCount])

  const onTouchStart = (event) => {
    setTouchStartX(event.touches[0]?.clientX || null)
  }

  const onTouchEnd = (event) => {
    if (touchStartX === null) return
    const endX = event.changedTouches[0]?.clientX
    if (typeof endX !== 'number') return

    const delta = touchStartX - endX
    if (Math.abs(delta) > 50) {
      if (delta > 0) nextSlide()
      else prevSlide()
    }

    setTouchStartX(null)
  }

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

        <div className="relative mt-12">
          <div className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-30">
            <button
              type="button"
              onClick={prevSlide}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25 hover:scale-105 transition-all duration-300"
              aria-label="Previous certificate"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-30">
            <button
              type="button"
              onClick={nextSlide}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25 hover:scale-105 transition-all duration-300"
              aria-label="Next certificate"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div
            className="relative h-[440px] md:h-[500px] overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {orderedCards.map(({ cert, index, offset }) => {
              const isActive = offset === 0
              const absOffset = Math.abs(offset)
              if (absOffset > 2) return null

              const translateX = offset * 34
              const scale = isActive ? 1 : absOffset === 1 ? 0.88 : 0.78
              const opacity = isActive ? 1 : absOffset === 1 ? 0.68 : 0.42
              const zIndex = isActive ? 20 : absOffset === 1 ? 12 : 6

              return (
                <button
                  key={cert.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[86%] sm:w-[72%] md:w-[62%] lg:w-[50%] max-w-[580px]"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: 'transform 340ms ease, opacity 340ms ease',
                  }}
                  aria-label={`Select certificate: ${cert.name}`}
                >
                  <div className="relative group h-full">
                    <div className="absolute inset-0 rounded-[24px] border border-blue-400/15 bg-blue-900/10 translate-x-1.5 translate-y-1.5" />
                    <Card
                      className={`relative z-10 overflow-hidden p-0 min-h-[390px] transition-all duration-300 ${
                        isActive
                          ? 'border-cyan-300/45 shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_30px_rgba(34,211,238,0.18)]'
                          : 'border-blue-400/25'
                      }`}
                    >
                      <div className="relative h-56 w-full bg-blue-950/40 overflow-hidden">
                        <Image
                          src={cert.preview}
                          alt={`${cert.name} preview`}
                          fill
                          sizes="(max-width: 1024px) 92vw, 560px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/70 via-transparent to-transparent" />
                        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/40 bg-blue-500/20 text-blue-100 backdrop-blur-sm">
                          {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="p-5 space-y-3 text-left">
                        <h3 className="text-lg font-bold text-heading leading-snug min-h-[52px]">{cert.name}</h3>
                        <p className="text-sm text-blue-200/90 font-medium">{cert.organization}</p>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-100 border border-blue-400/40">
                          {cert.year}
                        </span>
                      </div>
                    </Card>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <Card className="mt-8 border-cyan-300/35 shadow-[0_0_0_1px_rgba(34,211,238,0.14),0_0_26px_rgba(34,211,238,0.14)]" hover={false}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-heading">{activeCert.name}</h3>
              <p className="text-sm text-blue-200/90 font-medium mt-1">{activeCert.organization}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-100 border border-blue-400/40">
                {activeCert.year}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-100 border border-blue-400/35">
                {String(activeIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm font-semibold text-blue-100 mb-2">Credential Summary</p>
              <p className="text-sm text-text leading-relaxed">{activeCert.description}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-100 mb-2">Verification</p>
              <p className="text-sm text-cyan-100/90 leading-relaxed">{activeCert.verification}</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-blue-100 mb-2">Skills Gained</p>
            <div className="flex flex-wrap gap-2">
              {activeCert.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/35"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-blue-400/20">
            <Link
              href={activeCert.preview}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/20 transition-colors duration-300"
            >
              <FaExternalLinkAlt className="w-3.5 h-3.5" />
              Open Certificate Image
            </Link>
          </div>
        </Card>
      </div>
    </section>
  )
}
