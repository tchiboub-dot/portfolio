'use client'

import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Skills() {
  const categories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'HTML', level: 92 },
        { name: 'CSS', level: 88 },
        { name: 'JavaScript', level: 84 },
        { name: 'React', level: 80 },
        { name: 'Next.js', level: 78 },
      ],
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js', level: 76 },
        { name: 'Express', level: 72 },
        { name: 'Python', level: 74 },
        { name: 'MongoDB', level: 70 },
        { name: 'PostgreSQL', level: 66 },
      ],
    },
    {
      title: 'Tools',
      skills: [
        { name: 'Git', level: 86 },
        { name: 'Docker', level: 64 },
        { name: 'Vercel', level: 82 },
        { name: 'Figma', level: 69 },
      ],
    },
    {
      title: 'AI / Cloud',
      skills: [
        { name: 'OpenAI API', level: 72 },
        { name: 'Cloud Deployment', level: 74 },
        { name: 'WebRTC', level: 60 },
      ],
    },
  ]

  return (
    <section id="skills" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slow" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Skills / Competences"
          subtitle="Organized capabilities across frontend, backend, tools, and AI-cloud technologies"
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {categories.map((category) => (
            <Card key={category.title} className="card-interactive">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-5">
                {category.title}
              </h3>

              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-blue-100 font-medium">{skill.name}</span>
                      <span className="text-cyan-300 font-semibold">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-blue-950/40 border border-blue-400/25 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
