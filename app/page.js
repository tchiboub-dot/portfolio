/**
 * PAGE PRINCIPALE DU PORTFOLIO
 * Cette page assemble tous les composants du portfolio
 * 
 * GUIDE DE PERSONNALISATION :
 * 1. Pour modifier les informations personnelles, éditez les fichiers des composants dans /components
 * 2. Pour ajouter/supprimer des sections, commentez/décommentez les imports et composants ci-dessous
 * 3. Pour changer l'ordre des sections, réorganisez les composants dans le JSX
 * 
 * STRUCTURE DU PORTFOLIO :
 * - Header : Navigation sticky
 * - Hero : Section d'accueil avec présentation
 * - About : Présentation détaillée
 * - Education : Parcours académique
 * - Experience : Expérience professionnelle
 * - Projects : Projets réalisés
 * - Certifications : Certifications obtenues
 * - Skills : Compétences techniques
 * - Contact : Formulaire et informations de contact
 * - Footer : Pied de page avec liens
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

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Section Hero / Accueil */}
      <Hero />

      {/* Section À propos */}
      <About />

      {/* Section Éducation */}
      <Education />

      {/* Section Expérience */}
      <Experience />

      {/* Section Projets */}
      <Projects />

      {/* Section En cours / WIP */}
      <Announcements />

      {/* Section Certifications */}
      <Certifications />

      {/* Section Compétences */}
      <Skills />

      {/* Section Technologies */}
      <Technologies />

      {/* Section Statistiques */}
      <Stats />

      {/* Section GitHub */}
      <GithubActivity />

      {/* Section Contact */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  )
}
