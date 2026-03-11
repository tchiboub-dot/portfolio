'use client'

import Image from 'next/image'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function Certifications() {
  const certifications = [
    {
      name: 'IBM — AI Engineering Certificate',
      organization: 'IBM',
      year: '2025',
      preview: '/certificates/cert-ai-business.jpeg',
    },
    {
      name: 'Prompt Engineering Certificate',
      organization: 'Simplilearn SkillUp',
      year: '2026',
      preview: '/certificates/cert-prompt-engineering.jpeg',
    },
    {
      name: 'Cybersecurity Fundamentals',
      organization: 'HP LIFE / HP Foundation',
      year: '2026',
      preview: '/certificates/cert-cybersecurity.jpeg',
    },
    {
      name: 'C Programming Certificate',
      organization: 'Simplilearn SkillUp',
      year: '2026',
      preview: '/certificates/cert-c-programming.png',
    },
    {
      name: 'Agile Project Management',
      organization: 'HP LIFE / HP Foundation',
      year: '2026',
      preview: '/certificates/cert-agile.jpeg',
    },
  ]

  return (
    <section id="certifications" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 -left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slower" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Certifications"
          subtitle="Verified learning credentials that reinforce technical reliability and continuous growth"
          align="center"
        />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
          {certifications.map((cert) => (
            <Card key={cert.name} className="overflow-hidden p-0 card-interactive">
              <div className="relative h-52 w-full bg-blue-950/40">
                <Image
                  src={cert.preview}
                  alt={`${cert.name} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/70 via-transparent to-transparent" />
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-heading leading-snug">{cert.name}</h3>
                <p className="text-sm text-blue-200/90 font-medium">{cert.organization}</p>
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-100 border border-blue-400/40">
                  {cert.year}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
