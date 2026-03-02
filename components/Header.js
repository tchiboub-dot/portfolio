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
    const theme = savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : (prefersDark ? 'dark' : 'light')
    setIsDark(theme === 'dark')
  }, [])

  const toggleTheme = () => {
    const nextIsDark = !isDark
    setIsDark(nextIsDark)

    const nextTheme = nextIsDark ? 'dark' : 'light'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('theme', nextTheme)
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
                className="text-text hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions: Theme Toggle + Menu Mobile */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button - Desktop */}
          <button
            onClick={toggleTheme}
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-button border border-border bg-surface text-text hover:text-primary hover:border-primary transition-all"
            aria-label="Toggle theme"
            title={isDark ? 'Mode clair' : 'Mode sombre'}
          >
            {isDark ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-xl text-text hover:text-primary transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-surface border-t border-border shadow-medium">
          <div className="container-custom py-4 space-y-4">
            {/* Theme Toggle - Mobile */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">Thème</span>
              <button
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-border bg-surface-2 text-text hover:text-primary transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <FaMoon className="w-4 h-4" /> : <FaSun className="w-4 h-4" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            <ul className="flex flex-col space-y-3 border-t border-border pt-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-text hover:text-primary transition-colors font-medium"
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
