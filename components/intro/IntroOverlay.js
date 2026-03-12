'use client'

import React, { Component } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

const RubiksCubeIntro = dynamic(() => import('@/components/intro/RubiksCubeIntro'), {
  ssr: false,
})

const INTRO_SEEN_KEY = 'INTRO_SEEN'
const FADE_OUT_MS = 420

class IntroErrorBoundary extends Component {
  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
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

function shouldShowIntroNow() {
  const params = new URLSearchParams(window.location.search)
  const force = params.get('intro')

  if (force === '0') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!supportsWebGL()) return false
  if (force === '1') return true

  return sessionStorage.getItem(INTRO_SEEN_KEY) !== '1'
}

export default function IntroOverlay() {
  const [mode, setMode] = useState('checking')

  const visible = useMemo(() => mode === 'visible' || mode === 'leaving', [mode])

  useEffect(() => {
    const shouldShow = shouldShowIntroNow()
    setMode(shouldShow ? 'visible' : 'hidden')
    if (!shouldShow) {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    }
  }, [])

  useEffect(() => {
    if (!visible) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouch = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouch
    }
  }, [visible])

  const finishIntro = useCallback(() => {
    if (mode !== 'visible') return

    setMode('leaving')
    window.setTimeout(() => {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
      setMode('hidden')
    }, FADE_OUT_MS)
  }, [mode])

  const skipWithFailure = useCallback(() => {
    sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    setMode('hidden')
  }, [])

  useEffect(() => {
    if (!visible) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        finishIntro()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finishIntro, visible])

  if (!visible) return null

  return (
    <div className={`intro-overlay ${mode === 'leaving' ? 'is-leaving' : ''}`} role="dialog" aria-label="Portfolio intro animation">
      <button type="button" className="intro-overlay__skip" onClick={finishIntro} aria-label="Skip intro">
        Skip
      </button>
      <div className="intro-overlay__scene">
        <IntroErrorBoundary onError={skipWithFailure}>
          <RubiksCubeIntro onComplete={finishIntro} onError={skipWithFailure} />
        </IntroErrorBoundary>
      </div>
    </div>
  )
}
