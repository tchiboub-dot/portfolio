'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filters = ['All', 'Web Apps', 'AI', 'Tools']

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
      preview: '/projects/student-management-preview.svg',
    },
    {
      title: 'AI Workflow Assistant',
      category: 'AI',
      summary: 'Interface for AI-assisted productivity routines, prompt operations, and smart task generation.',
      detailedDescription:
        'AI Workflow Assistant is designed to centralize intelligent task guidance, structured prompt usage, and operational productivity in one adaptive workspace.',
      businessValue:
        'Supports teams and creators by reducing repetitive operations and enabling faster idea-to-execution workflows.',
      implementationNotes:
        'Built around modular AI interaction blocks, scalable dashboard composition, and UX clarity for daily productivity actions.',
      features: [
        'AI-guided prompt and task generation patterns',
        'Workflow-oriented productivity dashboard layout',
        'Expandable assistant modules for future integrations',
      ],
      techStack: ['Next.js', 'OpenAI API', 'Tailwind', 'Vercel'],
      githubLink: 'https://github.com/tchiboub-dot',
      liveLink: 'https://github.com/tchiboub-dot',
      preview: '/projects/ai-workflow-preview.svg',
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
      preview: '/projects/security-headers-preview.svg',
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
      preview: '/projects/maison-elegance-preview.svg',
    },
  ]

  const totalCount = projectsData.length

  const displayedProjects = useMemo(() => {
    if (activeFilter === 'All') return projectsData
    return projectsData.filter((project) => project.category === activeFilter)
  }, [activeFilter])

  const openProject = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeProject = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 220)
  }

  useEffect(() => {
    if (!isModalOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeProject()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isModalOpen])

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

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedProjects.map((project) => {
            const absoluteIndex = projectsData.findIndex((item) => item.title === project.title)
            return (
              <div key={project.title} className="relative group h-full">
                <div className="absolute inset-0 rounded-[24px] border border-blue-400/15 bg-blue-900/10 translate-x-1.5 translate-y-1.5 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                <Card className="relative z-10 overflow-hidden p-0 h-full min-h-[440px] card-interactive transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] group-hover:shadow-[0_0_0_1px_rgba(59,130,246,0.28),0_0_34px_rgba(59,130,246,0.2)]">
                  <button type="button" onClick={() => openProject(project)} className="w-full h-full text-left">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={project.preview}
                        alt={`${project.title} preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-[#0b1636]/30 to-transparent" />
                      <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/40 bg-blue-500/20 text-blue-100 backdrop-blur-sm">
                        {String(absoluteIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
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
                  </button>

                  <div className="px-5 pb-5 pt-1 mt-auto">
                    <div className="flex gap-3">
                      <Link
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-400/40 text-blue-100 hover:bg-blue-500/20 transition-colors duration-300"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <FaGithub className="w-4 h-4" />
                        GitHub
                      </Link>
                      {project.liveLink && (
                        <Link
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/20 transition-colors duration-300"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <FaExternalLinkAlt className="w-3.5 h-3.5" />
                          Live Demo
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {selectedProject && (
        <div
          className={`fixed inset-0 z-[80] p-4 md:p-8 flex items-center justify-center transition-all duration-300 ${
            isModalOpen ? 'bg-slate-950/75 opacity-100' : 'bg-slate-950/0 opacity-0'
          }`}
          onClick={closeProject}
        >
          <div
            className={`w-full max-w-5xl rounded-[24px] border border-blue-400/30 bg-gradient-to-br from-blue-950/55 to-slate-900/55 backdrop-blur-xl shadow-[0_0_0_1px_rgba(59,130,246,0.18),0_0_34px_rgba(59,130,246,0.2)] overflow-hidden transition-all duration-300 ${
              isModalOpen ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-blue-400/20">
              <p className="text-sm text-blue-200/90 font-medium">Project Details</p>
              <button
                type="button"
                onClick={closeProject}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-blue-400/35 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 transition-all duration-300"
                aria-label="Close project details"
              >
                ✕
              </button>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0 max-h-[80vh] overflow-y-auto">
              <div className="relative min-h-[280px] md:min-h-[420px] bg-blue-950/40">
                <Image
                  src={selectedProject.preview}
                  alt={`${selectedProject.title} full preview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>

              <div className="p-5 md:p-7 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-heading">{selectedProject.title}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/25 text-cyan-100 border border-cyan-400/40">
                    {selectedProject.category}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Detailed Description</p>
                  <p className="text-sm text-text leading-relaxed">{selectedProject.detailedDescription}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Business Value / Purpose</p>
                  <p className="text-sm text-text/95 leading-relaxed">{selectedProject.businessValue}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Implementation Notes</p>
                  <p className="text-sm text-text/95 leading-relaxed">{selectedProject.implementationNotes}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Key Features</p>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature) => (
                      <li key={feature} className="text-sm text-text/95 leading-relaxed flex items-start gap-2">
                        <span className="text-cyan-300 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-100 mb-2">Technologies Used</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/35"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-400/40 text-blue-100 hover:bg-blue-500/20 transition-colors duration-300"
                  >
                    <FaGithub className="w-4 h-4" />
                    GitHub
                  </Link>
                  {selectedProject.liveLink && (
                    <Link
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/20 transition-colors duration-300"
                    >
                      <FaExternalLinkAlt className="w-3.5 h-3.5" />
                      Live Demo
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
