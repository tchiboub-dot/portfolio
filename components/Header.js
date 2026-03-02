'use client'

import { useState, useEffect } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

/**
 * COMPOSANT HEADER/NAVIGATION
 * Navigation responsive avec menu mobile
 * Pour modifier les liens de navigation, modifiez le tableau navLinks ci-dessous
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Liste des liens de navigation - MODIFIEZ ICI pour ajouter/supprimer des liens
  const navLinks = [
    { name: 'Accueil', href: '#home' },
    { name: 'À propos', href: '#about' },
    { name: 'Éducation', href: '#education' },
    { name: 'Expérience', href: '#experience' },
    { name: 'Projets', href: '#projects' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ]

  // Gestion du scroll pour le style du header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <nav className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo / Nom */}
        <a
          href="#home"
          className="text-2xl font-bold text-primary hover:text-secondary transition-colors"
        >
          Taha Chiboub
        </a>

        {/* Navigation Desktop */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Bouton Menu Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-gray-700 hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col space-y-4 p-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
