'use client'

import { FaHeart, FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from 'react-icons/fa'

/**
 * COMPOSANT FOOTER
 * Pied de page avec liens et informations
 * Pour modifier les informations, changez les valeurs dans l'objet footerData ci-dessous
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
    <footer className="bg-surface  border-t border-border  py-12">
      <div className="container-custom">
        {/* Contenu principal du footer */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Colonne 1 - À propos */}
          <div>
            <h3 className="text-2xl font-bold text-heading mb-4">{footerData.name}</h3>
            <p className="text-text mb-4">
              Étudiant en Informatique à ESISA Fes, passionné par le développement web et les nouvelles technologies.
            </p>
            <p className="text-text">
              Ouvert aux opportunités de stage et missions freelance.
            </p>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h4 className="text-xl font-semibold text-heading mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-text hover:text-primary dark:hover:text-accent transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#about" className="text-text hover:text-primary dark:hover:text-accent transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#projects" className="text-text hover:text-primary dark:hover:text-accent transition-colors">
                  Projets
                </a>
              </li>
              <li>
                <a href="#skills" className="text-text hover:text-primary dark:hover:text-accent transition-colors">
                  Compétences
                </a>
              </li>
              <li>
                <a href="#contact" className="text-text hover:text-primary dark:hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Contact et réseaux sociaux */}
          <div>
            <h4 className="text-xl font-semibold text-heading mb-4">Contact</h4>
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${footerData.email}`}
                className="flex items-center text-text hover:text-primary dark:hover:text-accent transition-colors"
              >
                <FaEnvelope className="mr-3" />
                {footerData.email}
              </a>
            </div>

            <h4 className="text-xl font-semibold text-heading mb-4">Suivez-moi</h4>
            <div className="flex gap-4">
              <a
                href={footerData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-text hover:text-primary dark:hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href={footerData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-text hover:text-primary dark:hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href={`mailto:${footerData.email}`}
                className="text-2xl text-text hover:text-primary dark:hover:text-accent transition-colors"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-border  pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <p className="text-text text-center md:text-left mb-4 md:mb-0">
              © {currentYear} T.A.C — Taha Adnane CHIBOUB. Tous droits réservés.
            </p>

            {/* Made with */}
            <p className="text-text flex items-center">
              Fait avec <FaHeart className="text-red-500 mx-2" /> et Next.js
            </p>
          </div>
        </div>

        {/* Bouton retour en haut */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-medium hover:bg-primary-dark transition-all duration-normal hover:scale-110 z-40"
          aria-label="Retour en haut"
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  )
}
