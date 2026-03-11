'use client'

import { FaReact, FaNodeJs, FaDocker, FaPython, FaGitAlt, FaAws } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Technologies() {
  const technologies = [
    { name: 'React', icon: FaReact, color: 'text-cyan-400' },
    { name: 'Node.js', icon: FaNodeJs, color: 'text-green-400' },
    { name: 'Docker', icon: FaDocker, color: 'text-blue-400' },
    { name: 'Python', icon: FaPython, color: 'text-yellow-400' },
    { name: 'Git', icon: FaGitAlt, color: 'text-orange-400' },
    { name: 'AWS', icon: FaAws, color: 'text-amber-200' },
  ]

  return (
    <section id="technologies" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle
          title="Technologies"
          subtitle="Core technologies I use to design, build, deploy, and scale modern products"
          align="center"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-12">
          {technologies.map((tech) => {
            const Icon = tech.icon
            return (
              <Card key={tech.name} className="text-center p-6 card-interactive hover:-translate-y-1">
                <Icon className={`mx-auto text-4xl mb-3 ${tech.color} transition-transform duration-300 hover:scale-110`} />
                <p className="text-sm font-semibold text-blue-100">{tech.name}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
