'use client'

import { useEffect, useState } from 'react'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Announcements() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const items = [
    {
      title: 'Cloud Sandbox Platform',
      category: 'Cloud Platform',
      description:
        'A browser-based sandbox platform designed for testing virtual Android and Windows environments with a modern SaaS interface, interactive monitoring, and secure session workflows.',
      status: 'En cours de développement',
      goals: [
        'Provide reliable browser access to Android and Windows virtual sessions',
        'Build secure session orchestration with role-based access and auditing',
        'Deliver clear real-time monitoring for active labs and resource usage',
      ],
      technologies: ['React', 'TypeScript', 'Tailwind', 'Secure Session APIs', 'Cloud Monitoring'],
      progress: 'Prototype and core orchestration workflows are actively being implemented and tested.',
      roadmap: [
        'Extended environment templates for QA and device testing',
        'Live telemetry panel and session health indicators',
        'Tenant-level controls and usage quotas',
      ],
      verification: 'Current stage: internal prototype with progressive UX and infrastructure validation.',
    },
    {
      title: 'Security Headers Verifier Pro',
      category: 'Security Tooling',
      description:
        'An expanded security analysis tool focused on deeper HTTP header diagnostics, guided remediation insights, and production hardening checks for modern web deployments.',
      status: 'In Development',
      goals: [
        'Improve scan depth for CSP, HSTS, and cross-origin policy coverage',
        'Provide clear remediation guidance mapped to detected security gaps',
        'Support repeatable review workflows for deployment readiness',
      ],
      technologies: ['Next.js', 'Node.js', 'Security Analysis Rules', 'Tailwind', 'Vercel'],
      progress: 'Core analysis engine is implemented; reporting UX and advanced policy checks are in progress.',
      roadmap: [
        'Historical scan comparison for regression detection',
        'Policy preset profiles by app type',
        'Exportable technical reports for teams',
      ],
      verification: 'Current stage: in-development with internal validation against real deployment targets.',
    },
    {
      title: 'Parfume Store Evolution',
      category: 'E-Commerce',
      description:
        'The next release of Parfume Store focused on stronger conversion UX, smarter catalog discovery, and improved performance for multilingual shopping journeys.',
      status: 'Coming Soon',
      goals: [
        'Enhance product discovery with richer filtering and navigation flows',
        'Optimize checkout interactions for smoother conversion funnels',
        'Improve responsiveness and perceived speed across key pages',
      ],
      technologies: ['Next.js', 'React', 'Tailwind', 'Performance Optimization', 'Analytics'],
      progress: 'Feature planning and UX refinement are ongoing before the next public update.',
      roadmap: [
        'Improved recommendation and featured-product sections',
        'Checkout clarity enhancements and trust signals',
        'A/B-ready UI variants for conversion experiments',
      ],
      verification: 'Current stage: roadmap-driven iteration with measurable UX and performance targets.',
    },
  ]

  const statusStyles = {
    'In Development': 'bg-amber-500/20 text-amber-100 border-amber-400/40',
    'En cours de développement': 'bg-amber-500/20 text-amber-100 border-amber-400/40',
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

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 mt-10 sm:mt-12">
          {items.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => openDetails(item)}
              className="text-left"
            >
              <Card className="card-interactive border-cyan-400/35 shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_0_30px_rgba(34,211,238,0.12)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_0_34px_rgba(34,211,238,0.18)]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/30 bg-blue-500/15 text-blue-100">
                    {item.category}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-heading mb-3">{item.title}</h3>
                <p className="text-text leading-relaxed text-sm">{item.description}</p>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div
          className={`fixed inset-0 z-[80] p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center overflow-y-auto transition-all duration-300 ${
            isModalOpen ? 'bg-slate-950/80 backdrop-blur-[2px] opacity-100' : 'bg-slate-950/0 opacity-0'
          }`}
          onClick={closeDetails}
        >
          <div
            className={`w-full max-w-5xl my-auto rounded-[24px] border border-cyan-400/30 bg-gradient-to-br from-blue-950/55 to-slate-900/55 backdrop-blur-xl shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_34px_rgba(34,211,238,0.2)] overflow-hidden flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] transition-all duration-300 ${
              isModalOpen ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]'
            }`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Announcement details"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 sm:px-5 md:px-7 py-3.5 sm:py-4 border-b border-blue-400/20 bg-[#091126]/85 backdrop-blur-md">
              <p className="text-xs sm:text-sm text-blue-200/90 font-medium">Currently Building — Project Details</p>
              <button
                type="button"
                onClick={closeDetails}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-blue-400/35 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 transition-all duration-300"
                aria-label="Close project details"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 md:p-7 lg:p-8 space-y-6 sm:space-y-7 overflow-y-auto overscroll-contain">
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-heading leading-tight">{selectedProject.title}</h3>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[selectedProject.status]}`}>
                    {selectedProject.status}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-300/30 bg-blue-500/15 text-blue-100">
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-blue-100 mb-2">Detailed Description</p>
                <p className="text-sm text-text leading-relaxed">{selectedProject.description}</p>
              </div>

              <div className="space-y-3">
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

              <div className="space-y-3">
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

              <div className="grid md:grid-cols-2 gap-4 items-stretch">
                <div className="p-4 md:p-5 rounded-xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.12)] h-full">
                  <p className="text-sm font-semibold text-blue-100 mb-2">Current Progress / Stage</p>
                  <p className="text-sm text-text/95 leading-relaxed">{selectedProject.progress}</p>
                </div>
                <div className="p-4 md:p-5 rounded-xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.12)] h-full">
                  <p className="text-sm font-semibold text-blue-100 mb-2">Verification / Note</p>
                  <p className="text-sm text-text/95 leading-relaxed">{selectedProject.verification}</p>
                </div>
              </div>

              <div className="space-y-3 pb-1">
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
