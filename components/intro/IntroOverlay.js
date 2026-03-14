'use client'

import React, { Component } from 'react'
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const RubiksCubeIntro = dynamic(() => import('@/components/intro/RubiksCubeIntro'), {
  ssr: false,
})

// Intro always shows on every page load / refresh.
// It is NEVER suppressed by sessionStorage or localStorage.
// The only way it is skipped is: prefers-reduced-motion, WebGL failure, or user action (Skip / ESC).
const FADE_OUT_MS = 400

class IntroErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function IntroOverlay() {
  // Start as 'visible' so the dark overlay covers the page from the very first
  // server-rendered frame — preventing any flash of portfolio content on load.
  const [mode, setMode] = useState('visible')
  // Skip button appears after ~1 second so it doesn't distract from the intro.
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    // Immediately hide if the user has requested reduced motion or WebGL is unavailable.
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !supportsWebGL()
    ) {
      setMode('hidden')
    }
    // Otherwise keep mode === 'visible' — intro plays on every page load / refresh.
  }, [])

  // Reveal the skip button after 1 s
  useEffect(() => {
    if (mode !== 'visible') return undefined
    const t = window.setTimeout(() => setShowSkip(true), 1000)
    return () => window.clearTimeout(t)
  }, [mode])

  // Lock body scroll while the overlay is active
  useEffect(() => {
    if (mode !== 'visible') return undefined
    const prevOverflow = document.body.style.overflow
    const prevTouch = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.touchAction = prevTouch
    }
  }, [mode])

  const finishIntro = useCallback(() => {
    if (mode !== 'visible') return
    setMode('leaving')
    window.setTimeout(() => setMode('hidden'), FADE_OUT_MS)
  }, [mode])

  const skipWithError = useCallback(() => setMode('hidden'), [])

  // ESC key dismisses the intro
  useEffect(() => {
    if (mode !== 'visible') return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        finishIntro()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finishIntro, mode])

  if (mode === 'hidden') return null

  return (
    <div
      className={`intro-overlay${mode === 'leaving' ? ' is-leaving' : ''}`}
      role="dialog"
      aria-label="Portfolio intro animation"
      aria-modal="true"
    >
      {showSkip && (
        <button
          type="button"
          className="intro-overlay__skip"
          onClick={finishIntro}
          aria-label="Skip intro"
        >
          Skip
        </button>
      )}
      <div className="intro-overlay__scene">
        <IntroErrorBoundary onError={skipWithError}>
          <RubiksCubeIntro onComplete={finishIntro} onError={skipWithError} />
        </IntroErrorBoundary>
      </div>
    </div>
  )
}
