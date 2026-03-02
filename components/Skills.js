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

/**
 * COMPOSANT SKILLS (COMPÉTENCES)
 * Section présentant les compétences techniques
 * Pour modifier les informations, changez les valeurs dans l'objet skillsData ci-dessous
 */
export default function Skills() {
  // DONNÉES DES COMPÉTENCES - MODIFIEZ ICI
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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className={`text-2xl mr-3 ${skill.color}`}>{skill.icon}</span>
          <span className="font-semibold text-gray-800">{skill.name}</span>
        </div>
        <span className="text-sm font-semibold text-gray-600">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-1000"
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
    </div>
  )

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Titre de la section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compétences
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Technologies et outils que je maîtrise
          </p>
        </div>

        {/* Grille de compétences */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Front-end */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary">
              Front-end Development
            </h3>
            {skillsData.frontend.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>

          {/* Back-end & Logique */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary">
              Back-end & Logique
            </h3>
            {skillsData.backend.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>

          {/* Outils & Workflow */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary">
              Outils & Workflow
            </h3>
            {skillsData.tools.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>

          {/* Autres compétences */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary">
              Autres compétences
            </h3>
            {skillsData.other.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>
        </div>

        {/* Note d'apprentissage */}
        <div className="mt-12 text-center bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6">
          <p className="text-lg font-semibold mb-2">
            🚀 Toujours en apprentissage !
          </p>
          <p className="text-sm">
            Je continue à développer mes compétences et à explorer de nouvelles technologies
          </p>
        </div>
      </div>
    </section>
  )
}
