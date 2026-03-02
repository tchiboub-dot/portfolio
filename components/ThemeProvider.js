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

    localStorage.setItem('theme', theme)
  }, [])

  return <>{children}</>
}
