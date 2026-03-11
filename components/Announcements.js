'use client'

import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Announcements() {
  const items = [
    {
      title: 'AI SaaS Dashboard',
      description: 'A platform for building AI-powered productivity tools with modular workflows and smart automation.',
      status: 'In Development',
    },
    {
      title: 'Cloud Device Lab',
      description: 'A cloud sandbox for testing Android and Windows environments directly from the browser.',
      status: 'Prototype',
    },
    {
      title: 'Advanced Portfolio System',
      description: 'Next-generation portfolio architecture with AI features and more interactive recruiter journeys.',
      status: 'Coming Soon',
    },
  ]

  const statusStyles = {
    'In Development': 'bg-amber-500/20 text-amber-100 border-amber-400/40',
    Prototype: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/40',
    'Coming Soon': 'bg-blue-500/20 text-blue-100 border-blue-400/40',
  }

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
            <Card key={item.title} className="card-interactive border-cyan-400/35 shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_0_30px_rgba(34,211,238,0.12)]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold text-heading">{item.title}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-text leading-relaxed text-sm">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
