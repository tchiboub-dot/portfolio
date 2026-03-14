'use client'

import { useState, useEffect, useRef } from 'react'
import {
  FaBars, FaTimes, FaMoon, FaSun,
  FaHome, FaUser, FaGraduationCap, FaBriefcase,
  FaCode, FaHammer, FaStar, FaMicrochip,
  FaChartBar, FaGithub, FaEnvelope,
} from 'react-icons/fa'

/**
 * ELITE HEADER/NAVIGATION COMPONENT
 * Premium navigation with smooth scroll effects
 * Enhanced glassmorphism and neon styling
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const hiddenRef = useRef(false)

  const navLinks = [
    { name: 'Home',       href: '#home',          Icon: FaHome },
    { name: 'About',      href: '#about',         Icon: FaUser },
    { name: 'Education',  href: '#education',     Icon: FaGraduationCap },
    { name: 'Experience', href: '#experience',    Icon: FaBriefcase },
    { name: 'Projects',   href: '#projects',      Icon: FaCode },
    { name: 'WIP',        href: '#announcements', Icon: FaHammer },
    { name: 'Skills',     href: '#skills',        Icon: FaStar },
    { name: 'Tech',       href: '#technologies',  Icon: FaMicrochip },
    { name: 'Stats',      href: '#stats',         Icon: FaChartBar },
    { name: 'GitHub',     href: '#github',        Icon: FaGithub },
    { name: 'Contact',    href: '#contact',       Icon: FaEnvelope },
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : (prefersDark ? 'dark' : 'light')
    setIsDark(theme === 'dark')
  }, [])

  useEffect(() => {
    const getScrollY = () => (
      window.scrollY
      || document.documentElement.scrollTop
      || document.body.scrollTop
      || 0
    )

    let lastScrollY = getScrollY()
    let rafId = null
    let downScrollAccum = 0
    let upScrollAccum = 0

    const TOP_THRESHOLD = 10
    const HIDE_THRESHOLD = 22
    const SHOW_THRESHOLD = 10
    const NOISE_THRESHOLD = 1.5

    const applyHiddenState = (nextHidden) => {
      if (hiddenRef.current === nextHidden) return
      hiddenRef.current = nextHidden
      setIsHeaderHidden(nextHidden)
    }

    const handleScroll = () => {
      if (rafId !== null) return

      rafId = window.requestAnimationFrame(() => {
        const currentScrollY = getScrollY()
        const delta = currentScrollY - lastScrollY

        if (currentScrollY <= TOP_THRESHOLD) {
          downScrollAccum = 0
          upScrollAccum = 0
          applyHiddenState(false)
        } else if (isOpen) {
          downScrollAccum = 0
          upScrollAccum = 0
          applyHiddenState(false)
        } else if (Math.abs(delta) <= NOISE_THRESHOLD) {
          // ignore tiny wheel/touchpad jitter
        } else if (delta > 0) {
          downScrollAccum += delta
          upScrollAccum = 0

          if (downScrollAccum >= HIDE_THRESHOLD) {
            downScrollAccum = 0
            applyHiddenState(true)
          }
        } else {
          upScrollAccum += Math.abs(delta)
          downScrollAccum = 0

          if (upScrollAccum >= SHOW_THRESHOLD) {
            upScrollAccum = 0
            applyHiddenState(false)
          }
        }

        lastScrollY = currentScrollY
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      hiddenRef.current = false
      setIsHeaderHidden(false)
    }
  }, [isOpen])

  const toggleTheme = () => {
    const nextIsDark = !isDark
    setIsDark(nextIsDark)
    const nextTheme = nextIsDark ? 'dark' : 'light'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('theme', nextTheme)
  }

  return (
    <header className={`site-header ${isHeaderHidden ? 'site-header--hidden' : 'site-header--visible'} z-50 pointer-events-none`}>
      <nav className="navbar-pill container-custom flex justify-between items-center pointer-events-auto">
        {/* Logo */}
        <a
          href="#home"
          className="navbar-logo hover:opacity-90 transition-opacity duration-300 shrink-0"
          aria-label="T.A.C logo"
          title="T.A.C"
        >
          <div
            className="relative inline-flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid',
              borderColor: isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(59, 130, 246, 0.3)',
              boxShadow: isDark
                ? '0 0 12px rgba(96, 165, 250, 0.15), inset 0 0 12px rgba(96, 165, 250, 0.1)'
                : '0 0 8px rgba(59, 130, 246, 0.1), inset 0 0 8px rgba(59, 130, 246, 0.05)',
              backgroundColor: isDark
                ? 'rgba(13, 27, 42, 0.4)'
                : 'rgba(248, 250, 252, 0.4)',
            }}
          >
            <img
              src="/logo.png"
              alt="T.A.C logo"
              className="transition-opacity duration-300"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              loading="eager"
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ name, href, Icon }) => (
            <li key={name}>
              <a
                href={href}
                className="navbar-link font-medium text-sm uppercase tracking-wide relative group inline-flex items-center gap-1.5"
                style={{
                  color: isDark ? '#EAF0FF' : '#0B1220',
                  transition: 'color 240ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? '#8FD3FF' : '#1E40AF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? '#EAF0FF' : '#0B1220';
                }}
              >
                <Icon className="w-3 h-3 opacity-70 shrink-0" aria-hidden="true" />
                {name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Actions: Theme Toggle + Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 inline-flex items-center justify-center rounded-lg border transition-all duration-300 hover:drop-shadow-lg"
            style={{
              borderColor: isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
              color: isDark ? 'rgb(143, 211, 255)' : 'rgb(37, 99, 235)',
            }}
            aria-label="Toggle theme"
            title={isDark ? 'Mode clair' : 'Mode sombre'}
          >
            {isDark ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-400/30 text-xl transition-colors duration-300"
            style={{
              color: isDark ? 'rgb(143, 211, 255)' : 'rgb(37, 99, 235)',
            }}
            aria-label="Menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden navbar-mobile-panel pointer-events-auto">
          <div className="container-custom py-5 space-y-4">
            {/* Theme Toggle - Mobile */}
            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)' }}>
              <span className="text-sm font-medium" style={{ color: isDark ? 'rgb(143, 211, 255)' : 'rgb(37, 99, 235)' }}>Thème</span>
              <button
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)',
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
                  color: isDark ? 'rgb(143, 211, 255)' : 'rgb(37, 99, 235)',
                }}
                aria-label="Toggle theme"
              >
                {isDark ? <FaMoon className="w-4 h-4" /> : <FaSun className="w-4 h-4" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            <ul className="flex flex-col space-y-2">
              {navLinks.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2 py-2.5 font-medium text-sm uppercase tracking-wide"
                    style={{
                      color: isDark ? '#EAF0FF' : '#0B1220',
                      transition: 'color 240ms ease',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-70 shrink-0" aria-hidden="true" />
                    {name}
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
