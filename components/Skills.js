'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  FaHtml5, 
  FaCss3Alt, 
  FaJs, 
  FaReact, 
  FaGitAlt, 
  FaGithub,
  FaShieldAlt,
  FaRobot,
  FaCode
} from 'react-icons/fa'
import { SiNextdotjs, SiTailwindcss } from 'react-icons/si'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Skills() {
  const [visibleCards, setVisibleCards] = useState(new Set())
  const cardRefs = useRef([])

  const skillsData = {
    frontend: [
      { name: 'HTML5', icon: <FaHtml5 />, level: 90, color: 'text-orange-500' },
      { name: 'CSS3', icon: <FaCss3Alt />, level: 85, color: 'text-blue-500' },
      { name: 'JavaScript', icon: <FaJs />, level: 80, color: 'text-yellow-400' },
      { name: 'React', icon: <FaReact />, level: 75, color: 'text-cyan-400' },
      { name: 'Next.js', icon: <SiNextdotjs />, level: 70, color: 'text-white' },
      { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 80, color: 'text-cyan-400' },
    ],
    backend: [
      { name: 'C Programming', icon: <FaCode />, level: 70, color: 'text-blue-400' },
      { name: 'Algorithms', icon: <FaCode />, level: 75, color: 'text-purple-400' },
      { name: 'CRUD Operations', icon: <FaCode />, level: 75, color: 'text-green-400' },
      { name: 'Authentication', icon: <FaShieldAlt />, level: 65, color: 'text-red-400' },
    ],
    tools: [
      { name: 'Git', icon: <FaGitAlt />, level: 80, color: 'text-orange-500' },
      { name: 'GitHub', icon: <FaGithub />, level: 85, color: 'text-gray-300' },
      { name: 'Responsive Design', icon: <FaCode />, level: 90, color: 'text-blue-400' },
      { name: 'UI/UX Basics', icon: <FaCode />, level: 75, color: 'text-pink-400' },
    ],
    other: [
      { name: 'Cybersecurity Awareness', icon: <FaShieldAlt />, level: 70, color: 'text-red-400' },
      { name: 'AI / Prompt Engineering', icon: <FaRobot />, level: 75, color: 'text-purple-400' },
      { name: 'Agile Project Management', icon: <FaCode />, level: 65, color: 'text-green-400' },
    ],
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, entry.target.dataset.index]))
          }
        })
      },
      { threshold: 0.15, rootMargin: '50px' }
    )

    cardRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => cardRefs.current.forEach(ref => {
      if (ref) observer.unobserve(ref)
    })
  }, [])

  const SkillBar = ({ skill, index }) => (
    <div className="mb-4 group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xl ${skill.color} group-hover:scale-125 transition-transform duration-300`}>
            {skill.icon}
          </span>
          <span className="font-medium text-blue-300 group-hover:text-cyan-300 transition-colors duration-300">
            {skill.name}
          </span>
        </div>
        <span className="text-xs font-bold text-cyan-400 bg-blue-500/20 px-2 py-1 rounded border border-cyan-400/30 group-hover:border-cyan-400/60 group-hover:bg-blue-500/30 transition-all duration-300">
          {skill.level}%
        </span>
      </div>
      <div className="relative w-full bg-blue-950/40 rounded-full h-2.5 overflow-hidden border border-blue-400/20 group-hover:border-blue-400/50 transition-all duration-300">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 group-hover:shadow-lg group-hover:shadow-cyan-400/40"
          style={{ width: `${skill.level}%` }}
        />
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'shimmer 2s infinite',
        }} />
      </div>
    </div>
  )

  const categories = [
    { key: 'frontend', label: 'Front-end', icon: '🎨', color: 'text-blue-400' },
    { key: 'backend', label: 'Back-end', icon: '⚙️', color: 'text-cyan-400' },
    { key: 'tools', label: 'Outils', icon: '🛠️', color: 'text-blue-400' },
    { key: 'other', label: 'Autres', icon: '🎯', color: 'text-cyan-400' },
  ]
  
  return (
    <section id="skills" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slow" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Compétences"
          subtitle="Technologies et outils que je maîtrise"
          align="center"
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((category, categoryIndex) => (
            <div
              key={category.key}
              ref={el => cardRefs.current[categoryIndex] = el}
              data-index={categoryIndex}
              className={`transform transition-all duration-700 ease-out ${
                visibleCards.has(String(categoryIndex))
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <Card hover={true} className="card-interactive">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-4xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </span>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent ${category.color}`}>
                    {category.label}
                  </h3>
                </div>
                <div className="space-y-1">
                  {skillsData[category.key].map((skill, idx) => (
                    <SkillBar key={idx} skill={skill} index={idx} />
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  )
}
