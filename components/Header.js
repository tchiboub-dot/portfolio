'use client'

import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa'

/**
 * COMPOSANT HEADER/NAVIGATION
 * Navigation responsive avec menu mobile
 * Pour modifier les liens de navigation, modifiez le tableau navLinks ci-dessous
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark

    document.documentElement.classList.toggle('dark', shouldUseDark)
    setIsDark(shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const nextIsDark = !isDark
    setIsDark(nextIsDark)
    document.documentElement.classList.toggle('dark', nextIsDark)
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-md border-b border-border py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-custom flex justify-between items-center">
        {/* Logo / Nom */}
        <a
          href="#home"
          className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
        >
          T.A.C
        </a>

        {/* Navigation Desktop */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="text-text hover:text-primary dark:hover:text-accent transition-colors font-medium"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-button border border-border  text-text hover:text-primary dark:hover:text-accent hover:border-primary transition-all"
            aria-label="Basculer le thème"
            title="Basculer le thème"
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-xl text-text hover:text-primary dark:hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-surface  border-t border-border  shadow-medium">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text">Navigation</span>
              <button
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-border  text-text"
                aria-label="Basculer le thème"
              >
                {isDark ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            <ul className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-text hover:text-primary dark:hover:text-accent transition-colors font-medium"
                >
                  {link.name}
                </a>
              </li>
            ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
