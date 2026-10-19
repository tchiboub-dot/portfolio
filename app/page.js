/**
 * PAGE PRINCIPALE DU PORTFOLIO — DYNAMIQUE & CMS-BACKED
 * 
 * - Injecte dynamiquement les variables CSS du Design Studio (Theme)
 * - Ordonne et filtre les sections selon la configuration de la base de données
 * - Supporte le mode dégradé en cas d'indisponibilité temporaire de la BDD
 */

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Education from '@/components/Education'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Announcements from '@/components/Announcements'
import Certifications from '@/components/Certifications'
import Skills from '@/components/Skills'
import Technologies from '@/components/Technologies'
import Stats from '@/components/Stats'
import GithubActivity from '@/components/GithubActivity'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { getPublicPortfolioContent } from '@/lib/db/cms'

export const dynamic = 'force-dynamic'

const SECTION_MAP = {
  hero: (c) => <Hero key="hero" initialData={c?.profile} theme={c?.theme} />,
  about: (c) => <About key="about" initialData={c?.profile} />,
  projects: (c) => <Projects key="projects" initialProjects={c?.projects} />,
  skills: (c) => <Skills key="skills" initialCategories={c?.skillsCategories} />,
  experience: (c) => <Experience key="experience" initialExperience={c?.experience} />,
  education: (c) => <Education key="education" initialEducation={c?.education} />,
  certifications: (c) => <Certifications key="certifications" initialCertifications={c?.certifications} />,
  announcements: (c) => <Announcements key="announcements" initialAnnouncements={c?.announcements} />,
  technologies: (c) => (
    <div key="technologies" className="space-y-12">
      <Technologies initialTechnologies={c?.technologies} />
      <GithubActivity />
    </div>
  ),
  stats: (c) => <Stats key="stats" initialStats={c?.stats} />,
  contact: (c) => <Contact key="contact" initialData={c?.profile} />,
}

export default async function Home() {
  let content = null
  try {
    content = await getPublicPortfolioContent()
  } catch (err) {
    console.error('Error fetching public portfolio content:', err)
  }

  const theme = content?.theme || {
    primaryColor: '#38bdf8',
    secondaryColor: '#818cf8',
    accentColor: '#22d3ee',
    bgColor: '#030712',
    cardBg: '#0b1329',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '16px',
    heroHeadline: 'Architecting Next-Gen Software & Intelligent Cloud Systems',
    heroSubheadline: 'Engineering clean architectures, high-performance backends, and reactive web experiences with relentless attention to detail.',
    customCss: '',
  }

  // Construction dynamique des sections selon la base de données
  let renderedSections = []
  if (content?.sections && content.sections.length > 0) {
    const sortedSections = [...content.sections].sort((a, b) => a.sortOrder - b.sortOrder)
    renderedSections = sortedSections
      .filter((sec) => sec.isVisible)
      .map((sec) => {
        const renderFn = SECTION_MAP[sec.name]
        return renderFn ? renderFn(content) : null
      })
      .filter(Boolean)
  } else {
    // Ordre standard par défaut si pas encore initialisé
    renderedSections = [
      <Hero key="hero" initialData={content?.profile} theme={theme} />,
      <About key="about" initialData={content?.profile} />,
      <Education key="education" initialEducation={content?.education} />,
      <Experience key="experience" initialExperience={content?.experience} />,
      <Projects key="projects" initialProjects={content?.projects} />,
      <Announcements key="announcements" initialAnnouncements={content?.announcements} />,
      <Certifications key="certifications" initialCertifications={content?.certifications} />,
      <Skills key="skills" initialCategories={content?.skillsCategories} />,
      <div key="tech-wrapper" className="space-y-12">
        <Technologies initialTechnologies={content?.technologies} />
        <GithubActivity />
      </div>,
      <Stats key="stats" initialStats={content?.stats} />,
      <Contact key="contact" initialData={content?.profile} />,
    ]
  }

  return (
    <main className="min-h-screen text-text transition-colors duration-300" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Dynamic Theme CSS Variables Injection from Database */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${theme.primaryColor || '#38bdf8'};
              --primary-hover: ${theme.primaryColor || '#38bdf8'};
              --accent: ${theme.accentColor || '#22d3ee'};
              --bg: ${theme.bgColor || '#030712'};
              --surface: ${theme.cardBg || '#0b1329'};
              --surface2: ${theme.cardBg || '#0b1329'};
              --surface-2: ${theme.cardBg || '#0b1329'};
              --radius: ${theme.borderRadius || '16px'};
              --radius-sm: ${theme.borderRadius || '16px'};
              --font-family: ${theme.fontFamily || 'Inter, sans-serif'};
            }
            body {
              background-color: var(--bg);
              color: var(--text);
              font-family: var(--font-family);
            }
            ${theme.customCss || ''}
          `,
        }}
      />

      {/* Navigation sticky avec déclencheur discret 5 clics */}
      <Header />

      {/* Dynamic Database-Driven Ordered Sections */}
      {renderedSections}

      {/* Footer */}
      <Footer initialData={content?.profile} />
    </main>
  )
}
