'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'Web Apps', 'AI', 'Tools']

  const projectsData = [
    {
      title: 'Parfume Store',
      category: 'Web Apps',
      description: 'Premium full-stack e-commerce experience with modern UI, multilingual flows, and polished performance.',
      techStack: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
      githubLink: 'https://github.com/tchiboub-dot/parfume',
      liveLink: 'https://parfume-store-eta.vercel.app/en',
      preview: '/projects/parfume-store-preview-real.jpg',
    },
    {
      title: 'Student Management System',
      category: 'Web Apps',
      description: 'CRUD-focused platform for student operations with practical authentication and clean dashboard UX.',
      techStack: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      githubLink: 'https://github.com/tchiboub-dot',
      liveLink: 'https://student-management5.vercel.app/',
      preview: '/projects/parfume-store-preview.svg',
    },
    {
      title: 'AI Workflow Assistant',
      category: 'AI',
      description: 'Interface for AI-assisted productivity routines, prompt operations, and smart task generation.',
      techStack: ['Next.js', 'OpenAI API', 'Tailwind', 'Vercel'],
      githubLink: 'https://github.com/tchiboub-dot',
      liveLink: 'https://github.com/tchiboub-dot',
      preview: '/projects/parfume-store-preview.svg',
    },
    {
      title: 'Security Headers Verifier',
      category: 'Tools',
      description: 'Developer utility to validate modern HTTP security headers and improve deployment hardening.',
      techStack: ['Next.js', 'Node.js', 'Security Headers', 'Vercel'],
      githubLink: 'https://github.com/tchiboub-dot/security-headers',
      liveLink: 'https://security-headers-2owb.vercel.app/',
      preview: '/projects/parfume-store-preview.svg',
    },
    {
      title: 'Maison Élégance',
      category: 'Web Apps',
      description: 'Restaurant platform with menu interaction, reservations, and conversion-focused responsive design.',
      techStack: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
      githubLink: 'https://github.com/tchiboub-dot',
      liveLink: 'https://maisonelegance-one.vercel.app/',
      preview: '/projects/parfume-store-preview.svg',
    },
  ]

  const displayedProjects = useMemo(() => {
    if (activeFilter === 'All') return projectsData
    return projectsData.filter((project) => project.category === activeFilter)
  }, [activeFilter])

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
          {displayedProjects.map((project) => (
            <Card key={project.title} className="overflow-hidden p-0 card-interactive">
              <div className="relative h-48 w-full">
                <Image
                  src={project.preview}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-[#0b1636]/30 to-transparent" />
                <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/25 text-cyan-100 border border-cyan-400/40">
                  {project.category}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <h3 className="text-xl font-bold text-heading">{project.title}</h3>
                <p className="text-sm text-text leading-relaxed">{project.description}</p>

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

                <div className="flex gap-3 pt-2 mt-auto">
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-400/40 text-blue-100 hover:bg-blue-500/20 transition-colors duration-300"
                  >
                    <FaGithub className="w-4 h-4" />
                    GitHub
                  </Link>
                  <Link
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/20 transition-colors duration-300"
                  >
                    <FaExternalLinkAlt className="w-3.5 h-3.5" />
                    Live Demo
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
