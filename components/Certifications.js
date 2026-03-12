'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

const CERTIFICATIONS = [
  {
    id: 'cert-ai-business',
    image: '/certificates/certificate-ai-business.jpg',
    title: 'AI Business Certificate',
    issuer: 'HP LIFE / HP Foundation',
    year: '2026',
    summary:
      'Credential focused on practical AI applications in business workflows and decision-making contexts.',
    verification: 'Credential verified through HP LIFE completion records.',
    skills: ['AI Business Use Cases', 'Decision Workflows', 'Digital Strategy'],
    description:
      'Builds practical understanding of applying AI to business processes, communication, and decision support.',
  },
  {
    id: 'cert-prompt-engineering',
    image: '/certificates/certificate-prompt-engineering.jpg',
    title: 'Prompt Engineering Certificate',
    issuer: 'Simplilearn SkillUp',
    year: '2026',
    summary:
      'Certification on designing effective prompts, prompt patterns, and reliable AI-assisted output workflows.',
    verification: 'Credential ID: 9808496',
    skills: ['Prompt Design', 'Context Structuring', 'Output Quality Control'],
    description:
      'Covers prompt design structure, response quality control, and repeatable prompt strategies for AI tools.',
  },
  {
    id: 'cert-cybersecurity',
    image: '/certificates/certificate-cybersecurity.jpg',
    title: 'Cybersecurity Fundamentals',
    issuer: 'HP LIFE / HP Foundation',
    year: '2026',
    summary:
      'Covers modern cybersecurity principles, risk awareness, and secure digital best practices.',
    verification: 'Credential verified through HP LIFE completion records.',
    skills: ['Security Basics', 'Threat Awareness', 'Secure Practices'],
    description:
      'Validates foundational cybersecurity literacy, including risk awareness and safer digital operational habits.',
  },
  {
    id: 'cert-c-programming',
    image: '/certificates/certificate-c-programming.png',
    title: 'C Programming Certificate',
    issuer: 'Simplilearn SkillUp',
    year: '2026',
    summary:
      'Fundamental-to-advanced C programming concepts including control flow, memory, and structured design.',
    verification: 'Credential ID: 9698550',
    skills: ['C Language', 'Memory Concepts', 'Structured Programming'],
    description:
      'Confirms competence in core C language principles, memory concepts, and structured problem-solving patterns.',
  },
  {
    id: 'cert-agile',
    image: '/certificates/certificate-agile.jpg',
    title: 'Agile Project Management',
    issuer: 'HP LIFE / HP Foundation',
    year: '2026',
    summary:
      'Training in agile project delivery, iterative planning, collaboration, and product execution discipline.',
    verification: 'Credential verified through HP LIFE completion records.',
    skills: ['Agile Delivery', 'Collaboration', 'Iteration Planning'],
    description:
      'Demonstrates practical agile planning and collaboration methods for iterative, delivery-focused execution.',
  },
]

const REQUIRED_FIELDS = ['id', 'image', 'title', 'issuer', 'year', 'summary', 'verification', 'skills']

export default function Certifications() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartXRef = useRef(null)
  const certifications = useMemo(() => {
    return CERTIFICATIONS.filter((item) => {
      const hasAllRequiredFields = REQUIRED_FIELDS.every((field) => {
        if (field === 'skills') return Array.isArray(item.skills) && item.skills.length > 0
        return Boolean(item[field])
      })

      if (!hasAllRequiredFields) {
        console.warn('Invalid certification object skipped:', item)
      }

      return hasAllRequiredFields
    })
  }, [])

  const totalCount = certifications.length
  const normalizedActiveIndex = totalCount ? ((activeIndex % totalCount) + totalCount) % totalCount : 0
  const activeCert = certifications[normalizedActiveIndex]

  const setActiveByIndex = (nextIndex) => {
    if (!totalCount) return
    setActiveIndex(((nextIndex % totalCount) + totalCount) % totalCount)
  }

  const prevSlide = () => {
    setActiveByIndex(normalizedActiveIndex - 1)
  }

  const nextSlide = () => {
    setActiveByIndex(normalizedActiveIndex + 1)
  }

  const orderedCards = useMemo(() => {
    return certifications.map((cert, index) => {
      let offset = index - normalizedActiveIndex
      if (offset > totalCount / 2) offset -= totalCount
      if (offset < -totalCount / 2) offset += totalCount
      return { cert, index, offset }
    })
  }, [normalizedActiveIndex, certifications, totalCount])

  const onTouchStart = (event) => {
    touchStartXRef.current = event.touches[0]?.clientX || null
  }

  const onTouchEnd = (event) => {
    if (touchStartXRef.current === null) return
    const endX = event.changedTouches[0]?.clientX
    if (typeof endX !== 'number') return

    const delta = touchStartXRef.current - endX
    if (Math.abs(delta) > 50) {
      if (delta > 0) nextSlide()
      else prevSlide()
    }

    touchStartXRef.current = null
  }

  if (!activeCert) return null

  return (
    <section id="certificates" data-legacy-id="certifications" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
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
          <div className="absolute left-1 md:-left-6 top-1/2 -translate-y-1/2 z-30">
            <button
              type="button"
              onClick={prevSlide}
              className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25 hover:scale-105 transition-all duration-300"
              aria-label="Previous certificate"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute right-1 md:-right-6 top-1/2 -translate-y-1/2 z-30">
            <button
              type="button"
              onClick={nextSlide}
              className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25 hover:scale-105 transition-all duration-300"
              aria-label="Next certificate"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div
            className="relative h-[500px] sm:h-[460px] md:h-[500px] overflow-hidden"
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
                  key={cert.id}
                  type="button"
                  onClick={() => setActiveByIndex(index)}
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[88%] sm:w-[72%] md:w-[62%] lg:w-[50%] max-w-[580px]"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: 'transform 340ms ease, opacity 340ms ease',
                  }}
                  aria-label={`Select certificate: ${cert.title}`}
                >
                  <div className="relative group h-full">
                    <div className="absolute inset-0 rounded-[24px] border border-blue-400/15 bg-blue-900/10 translate-x-1.5 translate-y-1.5" />
                    <Card
                      className={`relative z-10 overflow-hidden p-0 min-h-[410px] sm:min-h-[390px] transition-all duration-300 ${
                        isActive
                          ? 'border-cyan-300/45 shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_30px_rgba(34,211,238,0.18)]'
                          : 'border-blue-400/25'
                      }`}
                    >
                      <div className="relative h-56 w-full bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_rgba(7,11,20,0.92)_70%)] overflow-hidden">
                        <div className="absolute inset-3 rounded-2xl border border-blue-300/15 bg-slate-950/35" />
                        <img
                          src={cert.image}
                          alt={`${cert.title} preview`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-contain object-center p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/55 via-transparent to-transparent" />
                        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/40 bg-blue-500/20 text-blue-100 backdrop-blur-sm">
                          {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="p-4 sm:p-5 space-y-3 text-left">
                        <h3 className="text-base sm:text-lg font-bold text-heading leading-snug min-h-[48px] sm:min-h-[52px]">{cert.title}</h3>
                        <p className="text-sm text-blue-200/90 font-medium">{cert.issuer}</p>
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
              <h3 className="text-xl sm:text-2xl font-bold text-heading">{activeCert.title}</h3>
              <p className="text-sm text-blue-200/90 font-medium mt-1">{activeCert.issuer}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-100 border border-blue-400/40">
                {activeCert.year}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-100 border border-blue-400/35">
                {String(normalizedActiveIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm font-semibold text-blue-100 mb-2">Credential Summary</p>
              <p className="text-sm text-text leading-relaxed">{activeCert.summary}</p>
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
              href={activeCert.image}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/20 transition-colors duration-300"
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
