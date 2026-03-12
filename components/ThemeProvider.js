'use client'

import { useEffect } from 'react'

/**
 * ThemeProvider Component
 * Gère la détection, application et sauvegarde du thème
 * 
 * IMPORTANT: Le script "early theme" dans layout.js applique .dark avant React
 * Ce composant synchronise l'état React avec le DOM et localStorage
 */
export function ThemeProvider({ children }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : (prefersDark ? 'dark' : 'light')

    document.documentElement.dataset.theme = theme

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isSmallViewport = window.matchMedia('(max-width: 768px)').matches
    const deviceMemory = navigator.deviceMemory || 4
    const hardwareConcurrency = navigator.hardwareConcurrency || 4

    let performanceTier = 'high'
    if (prefersReducedMotion || deviceMemory <= 4 || hardwareConcurrency <= 4) {
      performanceTier = 'low'
    } else if (isSmallViewport || deviceMemory <= 6 || hardwareConcurrency <= 6) {
      performanceTier = 'balanced'
    }

    document.documentElement.dataset.performance = performanceTier

    localStorage.setItem('theme', theme)
  }, [])

  return <>{children}</>
}
