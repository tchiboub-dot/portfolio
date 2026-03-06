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
  FaCode,
  FaLaptopCode,
  FaServer,
  FaTools,
  FaCompass
} from 'react-icons/fa'
import { SiNextdotjs, SiTailwindcss } from 'react-icons/si'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Skills() {
  const [visibleCards, setVisibleCards] = useState(new Set())
  const cardRefs = useRef([])

  const skillsData = {
    frontend: [
      { name: 'HTML5', icon: <FaHtml5 />, level: 'Avancé', levelValue: 90, color: 'text-orange-500' },
      { name: 'CSS3', icon: <FaCss3Alt />, level: 'Avancé', levelValue: 85, color: 'text-blue-500' },
      { name: 'JavaScript', icon: <FaJs />, level: 'Avancé', levelValue: 80, color: 'text-yellow-400' },
      { name: 'React', icon: <FaReact />, level: 'Intermédiaire', levelValue: 75, color: 'text-cyan-400' },
      { name: 'Next.js', icon: <SiNextdotjs />, level: 'Intermédiaire', levelValue: 70, color: 'text-white' },
      { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 'Avancé', levelValue: 80, color: 'text-cyan-400' },
    ],
    backend: [
      { name: 'C Programming', icon: <FaCode />, level: 'Intermédiaire', levelValue: 70, color: 'text-blue-400' },
      { name: 'Algorithms', icon: <FaCode />, level: 'Intermédiaire', levelValue: 75, color: 'text-purple-400' },
      { name: 'CRUD Operations', icon: <FaCode />, level: 'Intermédiaire', levelValue: 75, color: 'text-green-400' },
      { name: 'Authentication', icon: <FaShieldAlt />, level: 'Débutant', levelValue: 65, color: 'text-red-400' },
    ],
    tools: [
      { name: 'Git', icon: <FaGitAlt />, level: 'Avancé', levelValue: 80, color: 'text-orange-500' },
      { name: 'GitHub', icon: <FaGithub />, level: 'Avancé', levelValue: 85, color: 'text-gray-300' },
      { name: 'Responsive Design', icon: <FaCode />, level: 'Avancé', levelValue: 90, color: 'text-blue-400' },
      { name: 'UI/UX Basics', icon: <FaCode />, level: 'Intermédiaire', levelValue: 75, color: 'text-pink-400' },
    ],
    other: [
      { name: 'Cybersecurity Awareness', icon: <FaShieldAlt />, level: 'Intermédiaire', levelValue: 70, color: 'text-red-400' },
      { name: 'AI / Prompt Engineering', icon: <FaRobot />, level: 'Intermédiaire', levelValue: 75, color: 'text-purple-400' },
      { name: 'Agile Project Management', icon: <FaCode />, level: 'Débutant', levelValue: 65, color: 'text-green-400' },
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

  const SkillBar = ({ skill, index }) => {
    // Level badge colors based on proficiency
    const levelColors = {
      'Avancé': 'bg-emerald-400/12 text-emerald-200 border-emerald-300/25',
      'Intermédiaire': 'bg-cyan-400/12 text-cyan-200 border-cyan-300/25',
      'Débutant': 'bg-amber-400/12 text-amber-200 border-amber-300/25',
    }
    
    return (
      <div className="mb-4 group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xl ${skill.color} group-hover:scale-110 transition-transform duration-300`}>
              {skill.icon}
            </span>
            <span className="font-medium text-slate-100 group-hover:text-cyan-200 transition-colors duration-300">
              {skill.name}
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${levelColors[skill.level]} transition-colors duration-300`}>
            {skill.level}
          </span>
        </div>
        <div className="relative w-full bg-slate-900/40 rounded-full h-2.5 overflow-hidden border border-cyan-200/10 transition-colors duration-300">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-cyan-500/90 via-teal-400/90 to-blue-400/85"
            style={{ width: `${skill.levelValue}%` }}
          />
          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            animation: 'shimmer 2s infinite',
          }} />
        </div>
      </div>
    )
  }

  const categories = [
    { key: 'frontend', label: 'Front-end', icon: FaLaptopCode, color: 'text-cyan-300' },
    { key: 'backend', label: 'Back-end', icon: FaServer, color: 'text-cyan-300' },
    { key: 'tools', label: 'Outils', icon: FaTools, color: 'text-cyan-300' },
    { key: 'other', label: 'Autres', icon: FaCompass, color: 'text-cyan-300' },
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
                  <span className="text-3xl text-cyan-300/90 group-hover:text-cyan-200 transition-colors duration-300">
                    <category.icon />
                  </span>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r from-cyan-200 to-teal-300 bg-clip-text text-transparent ${category.color}`}>
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
