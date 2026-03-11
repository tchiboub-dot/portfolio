'use client'

import { FaUser, FaLanguage, FaLaptopCode } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Button from './ui/Button'

export default function About() {
  const aboutData = {
    title: 'About Me',
    subtitle: 'Computer science engineering student focused on impactful products, scalable architecture, and polished user experience',
    introduction: 'I am a computer science engineering student passionate about building modern digital products.',
    description: 'I enjoy turning ideas into production-ready web experiences by combining strong frontend execution with practical backend fundamentals.',
    interests: [
      'Full-stack web development',
      'Cloud architecture',
      'User-focused design',
      'AI-powered applications',
    ],
    languages: ['Arabe (Natif)', 'Français (Courant)', 'Anglais (Intermédiaire)'],
    availability: 'Available for internships, freelance work, and collaborative product building.',
  }

  return (
    <section id="about" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle 
          title={aboutData.title}
          subtitle={aboutData.subtitle}
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <Card>
              <div className="flex items-start gap-4">
                <FaUser className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-heading mb-3">Who I am</h3>
                  <p className="text-text leading-relaxed mb-3">{aboutData.introduction}</p>
                  <p className="text-text leading-relaxed mb-3">{aboutData.description}</p>
                  <p className="text-text leading-relaxed">
                    My approach blends <strong>engineering discipline</strong>, <strong>clean interfaces</strong>, and <strong>business-oriented delivery</strong> to create solutions recruiters and teams can trust.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <FaLanguage className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-heading mb-4">Languages</h3>
                  <div className="space-y-2">
                    {aboutData.languages.map((language, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-text">{language}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="flex items-start gap-4">
                <FaLaptopCode className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-heading mb-4">My interests include</h3>
                  <div className="space-y-2">
                    {aboutData.interests.map((interest, i) => (
                      <div key={i} className="flex items-center gap-2 bg-primary-soft text-text p-3 rounded-lg text-sm">
                        <span className="text-primary font-bold">•</span>
                        <span><strong>{interest}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary to-accent p-8 shadow-default">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-surface rounded-full -mr-20 -mt-20" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-heading mb-2">Open to collaboration</h3>
                <p className="text-text mb-6 leading-relaxed">{aboutData.availability}</p>
                <Button href="#contact">Start a conversation</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
