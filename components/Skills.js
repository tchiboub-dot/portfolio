'use client'

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
  const skillsData = {
    frontend: [
      { name: 'HTML5', icon: <FaHtml5 />, level: 90, color: 'text-orange-600' },
      { name: 'CSS3', icon: <FaCss3Alt />, level: 85, color: 'text-blue-600' },
      { name: 'JavaScript', icon: <FaJs />, level: 80, color: 'text-yellow-500' },
      { name: 'React', icon: <FaReact />, level: 75, color: 'text-cyan-500' },
      { name: 'Next.js', icon: <SiNextdotjs />, level: 70, color: 'text-black' },
      { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 80, color: 'text-teal-500' },
    ],
    backend: [
      { name: 'C Programming', icon: <FaCode />, level: 70, color: 'text-blue-700' },
      { name: 'Algorithms', icon: <FaCode />, level: 75, color: 'text-purple-600' },
      { name: 'CRUD Operations', icon: <FaCode />, level: 75, color: 'text-green-600' },
      { name: 'Authentication', icon: <FaShieldAlt />, level: 65, color: 'text-red-600' },
    ],
    tools: [
      { name: 'Git', icon: <FaGitAlt />, level: 80, color: 'text-orange-600' },
      { name: 'GitHub', icon: <FaGithub />, level: 85, color: 'text-gray-800' },
      { name: 'Responsive Design', icon: <FaCode />, level: 90, color: 'text-blue-600' },
      { name: 'UI/UX Basics', icon: <FaCode />, level: 75, color: 'text-pink-600' },
    ],
    other: [
      { name: 'Cybersecurity Awareness', icon: <FaShieldAlt />, level: 70, color: 'text-red-700' },
      { name: 'AI / Prompt Engineering', icon: <FaRobot />, level: 75, color: 'text-purple-600' },
      { name: 'Agile Project Management', icon: <FaCode />, level: 65, color: 'text-green-600' },
    ],
  }

  const SkillBar = ({ skill }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl text-primary">{skill.icon}</span>
          <span className="font-medium text-heading">
            {skill.name}
          </span>
        </div>
        <span className="text-xs font-bold text-primary bg-primary-soft px-2 py-1 rounded">
          {skill.level}%
        </span>
      </div>
      <div className="w-full bg-border rounded-full h-2">
        <div
          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-700"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  )

  const categories = [
    { key: 'frontend', label: 'Front-end', icon: '🎨', color: 'text-primary' },
    { key: 'backend', label: 'Back-end', icon: '⚙️', color: 'text-accent' },
    { key: 'tools', label: 'Outils', icon: '🛠️', color: 'text-primary' },
    { key: 'other', label: 'Autres', icon: '🎯', color: 'text-accent' },
  ]
  
  return (
    <section id="skills" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle 
          title="Compétences"
          subtitle="Technologies et outils que je maîtrise"
          align="center"
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Card key={category.key} hover={false}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h3 className={`text-xl font-bold ${category.color}`}>
                  {category.label}
                </h3>
              </div>
              <div className="space-y-0">
                {skillsData[category.key].map((skill, idx) => (
                  <SkillBar key={idx} skill={skill} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
