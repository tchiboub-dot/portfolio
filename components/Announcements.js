'use client'

import { useEffect, useState } from 'react'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Announcements() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const items = [
    {
      title: 'AI SaaS Dashboard',
      category: 'AI Product',
      description: 'A platform for building AI-powered productivity tools with modular workflows and smart automation.',
      status: 'In Development',
      goals: [
        'Design AI-first productivity modules for teams and creators',
        'Unify task orchestration, smart suggestions, and workflow automation',
        'Deliver a scalable SaaS foundation with clean UX and role-based access',
      ],
      technologies: ['Next.js', 'React', 'Tailwind', 'API Integrations', 'Vercel'],
      progress: 'Core architecture and dashboard foundations are in active development.',
      roadmap: [
        'Prompt templates and AI workspace presets',
        'Team collaboration and project boards',
        'Analytics insights for productivity trends',
      ],
      verification: 'Current stage: internal prototype and interaction validation.',
    },
    {
      title: 'Cloud Device Lab',
      category: 'Cloud Sandbox',
      description: 'A cloud sandbox platform for testing Android and Windows virtual environments directly in the browser.',
      status: 'Prototype',
      goals: [
        'Launch Android and Windows virtual sessions on demand',
        'Provide secure browser-based testing and validation flows',
        'Support modern cloud SaaS workflows with controlled access',
      ],
      technologies: ['React / Vite', 'Modern UI Components', 'Vercel', 'API-based Backend Integration', 'Admin Analytics'],
      progress: 'Prototype phase focused on session launch flow, UI architecture, and admin visibility.',
      roadmap: [
        'Advanced interactive launch sessions',
        'Real-time monitoring dashboards',
        'Expanded virtual environment configurations',
      ],
      verification: 'Current stage: prototype with architecture and interaction validation in progress.',
    },
    {
      title: 'Advanced Portfolio System',
      category: 'Portfolio Platform',
      description: 'Next-generation portfolio architecture with AI features and more interactive recruiter journeys.',
      status: 'Coming Soon',
      goals: [
        'Deliver personalized recruiter paths and dynamic storytelling blocks',
        'Integrate AI-enhanced portfolio insights and content recommendations',
        'Create modular architecture for continuous portfolio evolution',
      ],
      technologies: ['Next.js', 'React', 'Tailwind', 'AI APIs', 'Analytics'],
      progress: 'Concept and planning stage with interaction models currently being refined.',
      roadmap: [
        'Interactive career timeline modules',
        'AI-assisted project summaries',
        'Advanced recruiter-oriented filtering experiences',
      ],
      verification: 'Current stage: roadmap and UX architecture definition.',
    },
  ]

  const statusStyles = {
    'In Development': 'bg-amber-500/20 text-amber-100 border-amber-400/40',
    Prototype: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/40',
    'Coming Soon': 'bg-blue-500/20 text-blue-100 border-blue-400/40',
  }

  const openDetails = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeDetails = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 220)
  }

  useEffect(() => {
    if (!isModalOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeDetails()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isModalOpen])

  return (
    <section id="announcements" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-parallax-slow" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="🚀 Announcements / Currently Building"
          subtitle="What I am actively building before public release"
          align="center"
        />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
          {items.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => openDetails(item)}
              className="text-left"
            >
              <Card className="card-interactive border-cyan-400/35 shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_0_30px_rgba(34,211,238,0.12)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_0_34px_rgba(34,211,238,0.18)]">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/30 bg-blue-500/15 text-blue-100">
                    {item.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-heading mb-3">{item.title}</h3>
                <p className="text-text leading-relaxed text-sm">{item.description}</p>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div
          className={`fixed inset-0 z-[80] p-4 md:p-8 flex items-center justify-center transition-all duration-300 ${
            isModalOpen ? 'bg-slate-950/75 opacity-100' : 'bg-slate-950/0 opacity-0'
          }`}
          onClick={closeDetails}
        >
          <div
            className={`w-full max-w-4xl rounded-[24px] border border-cyan-400/30 bg-gradient-to-br from-blue-950/55 to-slate-900/55 backdrop-blur-xl shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_34px_rgba(34,211,238,0.2)] overflow-hidden transition-all duration-300 ${
              isModalOpen ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-blue-400/20">
              <p className="text-sm text-blue-200/90 font-medium">Currently Building — Project Details</p>
              <button
                type="button"
                onClick={closeDetails}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-blue-400/35 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 transition-all duration-300"
                aria-label="Close project details"
              >
                ✕
              </button>
            </div>

            <div className="p-5 md:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl md:text-3xl font-bold text-heading">{selectedProject.title}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[selectedProject.status]}`}>
                  {selectedProject.status}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/30 bg-blue-500/15 text-blue-100">
                  {selectedProject.category}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-100 mb-2">Detailed Description</p>
                <p className="text-sm text-text leading-relaxed">{selectedProject.description}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-100 mb-2">Goals / Purpose</p>
                <ul className="space-y-2">
                  {selectedProject.goals.map((goal) => (
                    <li key={goal} className="text-sm text-text/95 leading-relaxed flex items-start gap-2">
                      <span className="text-cyan-300 mt-0.5">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-100 mb-2">Technologies Involved</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/35"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-blue-400/20 bg-blue-500/10">
                  <p className="text-sm font-semibold text-blue-100 mb-2">Current Progress / Stage</p>
                  <p className="text-sm text-text/95 leading-relaxed">{selectedProject.progress}</p>
                </div>
                <div className="p-4 rounded-xl border border-blue-400/20 bg-blue-500/10">
                  <p className="text-sm font-semibold text-blue-100 mb-2">Verification / Note</p>
                  <p className="text-sm text-text/95 leading-relaxed">{selectedProject.verification}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-100 mb-2">Future Features / Roadmap</p>
                <ul className="space-y-2">
                  {selectedProject.roadmap.map((item) => (
                    <li key={item} className="text-sm text-text/95 leading-relaxed flex items-start gap-2">
                      <span className="text-cyan-300 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
