'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeProjectTitle, setActiveProjectTitle] = useState('Parfume Store')
  const [touchStartX, setTouchStartX] = useState(null)
  const [panelHighlighted, setPanelHighlighted] = useState(false)
  const [pressedProjectTitle, setPressedProjectTitle] = useState(null)
  const detailsRef = useRef(null)

  const filters = ['All', 'Web Apps', 'Tools']

  const projectsData = [
    {
      title: 'Parfume Store',
      category: 'Web Apps',
      summary: 'Premium full-stack e-commerce experience with modern UI, multilingual flows, and polished performance.',
      detailedDescription:
        'Parfume Store is a luxury-oriented e-commerce experience built to combine elegant branding with conversion-focused product discovery and checkout flow quality.',
      businessValue:
        'Helps boutique retail brands present premium products with a modern buying journey and stronger digital trust perception.',
      implementationNotes:
        'Implemented with a modular component system, clean visual hierarchy, and responsive UX patterns optimized for modern storefront experiences.',
      features: [
        'Premium dark/light product browsing experience',
        'Multilingual storefront navigation and content flow',
        'Responsive checkout-friendly interface design',
      ],
      techStack: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
      githubLink: 'https://github.com/tchiboub-dot/parfume',
      liveLink: 'https://parfume-store-eta.vercel.app/en',
      preview: '/projects/parfume-store-preview-real.jpg',
    },
    {
      title: 'Student Management System',
      category: 'Web Apps',
      summary: 'CRUD-focused platform for student operations with practical authentication and clean dashboard UX.',
      detailedDescription:
        'A management interface designed to organize student records, streamline admin tasks, and keep data operations simple, reliable, and fast.',
      businessValue:
        'Reduces manual admin friction for educational workflows and enables clearer data visibility for student operations.',
      implementationNotes:
        'Focused on robust CRUD interactions, reusable UI blocks, and dashboard clarity for practical educational administration use cases.',
      features: [
        'Student records creation, updates, and lookup workflows',
        'Dashboard-style admin interface and clear data sections',
        'Validation and structured form interaction patterns',
      ],
      techStack: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      githubLink: 'https://github.com/tchiboub-dot',
      liveLink: 'https://student-management5.vercel.app/',
      preview: '/projects/student-management-preview.png',
    },
    {
      title: 'Security Headers Verifier',
      category: 'Tools',
      summary: 'Developer utility to validate modern HTTP security headers and improve deployment hardening.',
      detailedDescription:
        'Security Headers Verifier provides practical visibility into HTTP hardening configuration and helps identify missing protection headers quickly.',
      businessValue:
        'Improves deployment security confidence for web products by surfacing misconfigurations and reducing exposure to common risks.',
      implementationNotes:
        'Focused on clear technical diagnostics, practical security context, and deployment-ready recommendations for web engineers.',
      features: [
        'Checks key security headers and policy presence',
        'Highlights missing protections and hardening gaps',
        'Supports safer production deployment reviews',
      ],
      techStack: ['Next.js', 'Node.js', 'Security Headers', 'Vercel'],
      githubLink: 'https://github.com/tchiboub-dot/security-headers',
      liveLink: 'https://security-headers-2owb.vercel.app/',
      preview: '/projects/security-headers-preview.png',
    },
    {
      title: 'Maison Élégance',
      category: 'Web Apps',
      summary: 'Restaurant platform with menu interaction, reservations, and conversion-focused responsive design.',
      detailedDescription:
        'Maison Élégance is a restaurant experience platform blending digital menu storytelling, booking flows, and modern visual presentation for hospitality brands.',
      businessValue:
        'Helps restaurants convert visits into bookings and communicate offers clearly across desktop and mobile touchpoints.',
      implementationNotes:
        'Built with a strong emphasis on visual appetite appeal, clear reservation flow, and responsive interaction consistency.',
      features: [
        'Interactive menu and offer discovery sections',
        'Reservation-ready user flow and contact interactions',
        'Hospitality-focused visual hierarchy and responsive UI',
      ],
      techStack: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
      githubLink: 'https://github.com/tchiboub-dot',
      liveLink: 'https://maisonelegance-one.vercel.app/',
      preview: '/projects/maison-elegance-preview.png',
    },
  ]

  const displayedProjects = useMemo(() => {
    if (activeFilter === 'All') return projectsData
    return projectsData.filter((project) => project.category === activeFilter)
  }, [activeFilter])

  useEffect(() => {
    if (!displayedProjects.some((project) => project.title === activeProjectTitle)) {
      setActiveProjectTitle(displayedProjects[0]?.title || null)
    }
  }, [activeProjectTitle, displayedProjects])

  const totalCount = displayedProjects.length
  const activeIndex = Math.max(
    displayedProjects.findIndex((project) => project.title === activeProjectTitle),
    0
  )
  const activeProject = displayedProjects[activeIndex] || null

  const orderedCards = useMemo(() => {
    return displayedProjects.map((project, index) => {
      let offset = index - activeIndex
      if (offset > totalCount / 2) offset -= totalCount
      if (offset < -totalCount / 2) offset += totalCount
      return { project, index, offset }
    })
  }, [activeIndex, displayedProjects, totalCount])

  const triggerPanelFocus = () => {
    setPanelHighlighted(true)
    window.setTimeout(() => setPanelHighlighted(false), 700)
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setProjectByIndex = (index, options = {}) => {
    const nextProject = displayedProjects[index]
    if (!nextProject) return

    setActiveProjectTitle(nextProject.title)

    if (options.scrollToDetails) {
      window.setTimeout(() => {
        triggerPanelFocus()
      }, 180)
    }
  }

  const prevSlide = () => {
    if (!totalCount) return
    setProjectByIndex((activeIndex - 1 + totalCount) % totalCount)
  }

  const nextSlide = () => {
    if (!totalCount) return
    setProjectByIndex((activeIndex + 1) % totalCount)
  }

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

  const onCardClick = (index, isActive) => {
    if (isActive) {
      setPressedProjectTitle(displayedProjects[index].title)
      window.setTimeout(() => setPressedProjectTitle(null), 260)
      triggerPanelFocus()
      return
    }

    setProjectByIndex(index, { scrollToDetails: true })
  }

  if (!activeProject) return null

  return (
    <section id="projects" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slower" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Projects"
          subtitle="Selected work with clear business value, implementation quality, and production-ready execution"
          align="center"
        />

        <div className="flex flex-wrap justify-center gap-3 mt-12 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-blue-500/25 border-blue-300/60 text-blue-100 shadow-lg shadow-blue-500/20'
                  : 'bg-blue-500/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-300/50'
              }`}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative mt-12">
          <div className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-30">
            <button
              type="button"
              onClick={prevSlide}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25 hover:scale-105 hover:shadow-[0_0_22px_rgba(59,130,246,0.22)] transition-all duration-300"
              aria-label="Previous project"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-30">
            <button
              type="button"
              onClick={nextSlide}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25 hover:scale-105 hover:shadow-[0_0_22px_rgba(59,130,246,0.22)] transition-all duration-300"
              aria-label="Next project"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div
            className="relative h-[500px] sm:h-[520px] md:h-[540px] overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {orderedCards.map(({ project, index, offset }) => {
              const isActive = offset === 0
              const absOffset = Math.abs(offset)
              if (absOffset > 2) return null

              const translateX = offset * 34
              const scale = isActive ? (pressedProjectTitle === project.title ? 1.03 : 1) : absOffset === 1 ? 0.9 : 0.8
              const opacity = isActive ? 1 : absOffset === 1 ? 0.5 : 0.25
              const blur = isActive ? 'blur(0px)' : absOffset === 1 ? 'blur(1.5px)' : 'blur(3px)'
              const zIndex = isActive ? 20 : absOffset === 1 ? 12 : 6

              return (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => onCardClick(index, isActive)}
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[90%] sm:w-[78%] md:w-[66%] lg:w-[54%] xl:w-[48%] max-w-[620px] text-left"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                    opacity,
                    zIndex,
                    filter: blur,
                    transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms ease, filter 520ms ease',
                  }}
                  aria-label={`Select project: ${project.title}`}
                >
                  <div className="relative group h-full">
                    <div className="absolute inset-0 rounded-[24px] border border-blue-400/15 bg-blue-900/10 translate-x-1.5 translate-y-1.5" />
                    <Card
                      className={`relative z-10 overflow-hidden p-0 min-h-[430px] transition-all duration-500 ${
                        isActive
                          ? 'border-cyan-300/45 shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_30px_rgba(34,211,238,0.18)]'
                          : 'border-blue-400/25'
                      }`}
                    >
                      <div className="relative h-56 w-full overflow-hidden bg-blue-950/40">
                        <Image
                          src={project.preview}
                          alt={`${project.title} preview`}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 70vw, 620px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/85 via-[#0b1636]/35 to-transparent" />
                        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/40 bg-blue-500/20 text-blue-100 backdrop-blur-sm">
                          {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                        </span>
                        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/25 text-cyan-100 border border-cyan-400/40">
                          {project.category}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-heading">{project.title}</h3>
                        <p className="text-sm text-text leading-relaxed">{project.summary}</p>

                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/35"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-1 mt-auto flex items-center justify-between gap-3">
                        <div className="text-xs uppercase tracking-[0.24em] text-blue-200/70">
                          Click to inspect project
                        </div>
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-xs font-semibold text-cyan-100">
                          Active Focus
                        </div>
                      </div>
                    </Card>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <Card
          className={`mt-8 border-cyan-300/35 transition-all duration-500 ${
            panelHighlighted
              ? 'shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_34px_rgba(34,211,238,0.18)]'
              : 'shadow-[0_0_0_1px_rgba(34,211,238,0.14),0_0_26px_rgba(34,211,238,0.14)]'
          }`}
          hover={false}
          ref={detailsRef}
        >
          <div className={`transition-all duration-500 ${panelHighlighted ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-100'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="text-2xl font-bold text-heading">{activeProject.title}</h3>
                <p className="text-sm text-blue-200/90 font-medium mt-1">Portfolio Project / {activeProject.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-100 border border-blue-400/40">
                  {activeProject.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-100 border border-blue-400/35">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-6 items-start">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Project Summary</p>
                  <p className="text-sm text-text leading-relaxed">{activeProject.detailedDescription}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Business Value</p>
                  <p className="text-sm text-text/95 leading-relaxed">{activeProject.businessValue}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Implementation Notes</p>
                  <p className="text-sm text-text/95 leading-relaxed">{activeProject.implementationNotes}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Key Features</p>
                  <ul className="space-y-2">
                    {activeProject.features.map((feature) => (
                      <li key={feature} className="text-sm text-text/95 leading-relaxed flex items-start gap-2">
                        <span className="text-cyan-300 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/35"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-blue-400/20 flex flex-col sm:flex-row gap-3">
              <Link
                href={activeProject.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-400/40 text-blue-100 hover:bg-blue-500/20 transition-colors duration-300"
              >
                <FaGithub className="w-4 h-4" />
                Open GitHub
              </Link>
              {activeProject.liveLink && (
                <Link
                  href={activeProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/20 transition-colors duration-300"
                >
                  <FaExternalLinkAlt className="w-3.5 h-3.5" />
                  View Live Demo
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
