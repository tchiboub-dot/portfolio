'use client'

import { FaHeart, FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from 'react-icons/fa'

/**
 * ELITE FOOTER COMPONENT
 * Premium footer with enhanced styling and animations
 */
export default function Footer() {
  const footerData = {
    name: 'T.A.C',
    email: 'taha.adnane.chiboub@gmail.com',
    github: 'https://github.com/tchiboub-dot',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
  }

  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-b from-blue-950/30 to-slate-950/50 border-t border-blue-400/20 py-12 backdrop-blur-sm">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8 animate-section-reveal">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              {footerData.name}
            </h3>
            <p className="text-blue-100 mb-3">
              Étudiant en Informatique à ESISA Fes, passionné par le développement web et les nouvelles technologies.
            </p>
            <p className="text-blue-100">
              Ouvert aux opportunités de stage et missions freelance.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-blue-300 mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              {['Accueil', 'À propos', 'Projets', 'Compétences', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '')}`}
                    className="text-blue-100 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact & Social */}
          <div>
            <h4 className="text-lg font-bold text-blue-300 mb-4">Contact</h4>
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${footerData.email}`}
                className="flex items-center text-blue-100 hover:text-cyan-300 transition-colors duration-300 text-sm group"
              >
                <FaEnvelope className="mr-3 group-hover:scale-110 transition-transform" />
                {footerData.email}
              </a>
            </div>

            <h4 className="text-lg font-bold text-blue-300 mb-4">Réseaux</h4>
            <div className="flex gap-4">
              {[
                { icon: FaGithub, link: footerData.github, label: 'GitHub' },
                { icon: FaLinkedin, link: footerData.linkedin, label: 'LinkedIn' },
                { icon: FaEnvelope, link: `mailto:${footerData.email}`, label: 'Email' },
              ].map(({ icon: Icon, link, label }) => (
                <a
                  key={label}
                  href={link}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="text-blue-200 hover:text-cyan-300 transition-all duration-300 hover:scale-125 hover:drop-shadow-lg"
                  aria-label={label}
                >
                  <Icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-blue-400/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-blue-200 text-center md:text-left text-sm font-medium">
              © {currentYear} T.A.C — Taha Adnane CHIBOUB. Tous droits réservés.
            </p>

            {/* Made with */}
            <p className="text-blue-200 flex items-center text-sm font-medium">
              Fait avec <FaHeart className="text-red-400 mx-2 animate-pulse" /> et Next.js
            </p>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-b from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 hover:from-blue-400 hover:to-blue-500 z-40 drop-shadow-lg"
          aria-label="Retour en haut"
        >
          <FaArrowUp className="animate-bounce" />
        </button>
      </div>
    </footer>
  )
}
