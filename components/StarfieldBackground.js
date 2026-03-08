'use client'

import { useEffect, useRef } from 'react'

const LAYERS = [
  {
    id: 'far',
    density: 0.00006,
    minSize: 0.55,
    maxSize: 1.35,
    speedMin: 0.55,
    speedMax: 1.15,
    driftRadius: 10,
    twinkleMin: 0.24,
    twinkleMax: 0.56,
    pulseMin: 0.03,
    pulseMax: 0.08,
    glowChance: 0.08,
    renewableChance: 0.07,
    renewalMin: 28,
    renewalMax: 54,
    colorKey: 'far',
  },
  {
    id: 'mid',
    density: 0.000032,
    minSize: 1.1,
    maxSize: 2.1,
    speedMin: 0.9,
    speedMax: 1.9,
    driftRadius: 16,
    twinkleMin: 0.3,
    twinkleMax: 0.7,
    pulseMin: 0.05,
    pulseMax: 0.12,
    glowChance: 0.18,
    renewableChance: 0.11,
    renewalMin: 24,
    renewalMax: 46,
    colorKey: 'mid',
  },
  {
    id: 'accent',
    density: 0.000011,
    minSize: 1.9,
    maxSize: 3.4,
    speedMin: 1.05,
    speedMax: 2.2,
    driftRadius: 20,
    twinkleMin: 0.34,
    twinkleMax: 0.75,
    pulseMin: 0.07,
    pulseMax: 0.15,
    glowChance: 0.42,
    renewableChance: 0.08,
    renewalMin: 30,
    renewalMax: 58,
    colorKey: 'accent',
  },
]

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function parseRgba(colorValue, fallback) {
  if (!colorValue) return fallback
  const values = colorValue
    .replace(/\s+/g, '')
    .match(/rgba?\((\d+),(\d+),(\d+)(?:,(\d*\.?\d+))?\)/i)

  if (!values) return fallback

  return {
    r: Number(values[1]),
    g: Number(values[2]),
    b: Number(values[3]),
    a: values[4] !== undefined ? Number(values[4]) : 1,
  }
}

function rgbaToString(rgb, alphaMultiplier = 1) {
  const alpha = Math.max(0, Math.min(1, rgb.a * alphaMultiplier))
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(4)})`
}

function nextRenewalDelay(layer) {
  return randomBetween(layer.renewalMin, layer.renewalMax)
}

function createStar(width, height, layer) {
  const direction = randomBetween(-0.35, 0.35)
  const phase = randomBetween(0, Math.PI * 2)

  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    size: randomBetween(layer.minSize, layer.maxSize),
    speedY: randomBetween(layer.speedMin, layer.speedMax),
    speedX: randomBetween(-0.22, 0.22),
    direction,
    driftRadius: randomBetween(layer.driftRadius * 0.5, layer.driftRadius),
    twinkleAmp: randomBetween(layer.twinkleMin, layer.twinkleMax),
    twinkleSpeed: randomBetween(0.55, 1.35),
    pulseAmp: randomBetween(layer.pulseMin, layer.pulseMax),
    pulseSpeed: randomBetween(0.25, 0.8),
    baseAlpha: randomBetween(0.32, 0.92),
    phase,
    isGlow: Math.random() < layer.glowChance,
    accentBlend: Math.random(),
    isRenewable: Math.random() < layer.renewableChance,
    renewalDelay: nextRenewalDelay(layer),
    renewalState: 'idle',
    renewalProgress: 0,
    fadeDuration: randomBetween(2.2, 4),
    fadeInDuration: randomBetween(1.8, 3.2),
  }
}

function createLayerStars(width, height, layer) {
  const area = width * height
  const target = Math.max(16, Math.floor(area * layer.density))
  return Array.from({ length: target }, () => createStar(width, height, layer))
}

function buildThemePalette() {
  const styles = getComputedStyle(document.documentElement)

  const far = parseRgba(styles.getPropertyValue('--star-color-far').trim(), { r: 200, g: 216, b: 242, a: 0.85 })
  const mid = parseRgba(styles.getPropertyValue('--star-color-medium').trim(), { r: 223, g: 236, b: 255, a: 0.94 })
  const accent = parseRgba(styles.getPropertyValue('--star-color-bright').trim(), { r: 255, g: 232, b: 188, a: 0.96 })
  const cool = parseRgba(styles.getPropertyValue('--star-color-cool').trim(), { r: 166, g: 202, b: 255, a: 0.88 })
  const silver = parseRgba(styles.getPropertyValue('--star-color-silver').trim(), { r: 236, g: 243, b: 255, a: 0.92 })

  return {
    far,
    mid,
    accent,
    cool,
    silver,
  }
}

export default function StarfieldBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return undefined

    let width = 0
    let height = 0
    let dpr = 1
    let rafId = 0
    let lastTime = 0
    let starsByLayer = []
    let palette = buildThemePalette()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      starsByLayer = LAYERS.map((layer) => ({
        layer,
        stars: createLayerStars(width, height, layer),
      }))
    }

    const respawnStar = (star, layer) => {
      const fromTop = Math.random() < 0.7
      star.x = randomBetween(0, width)
      star.y = fromTop ? randomBetween(-height * 0.15, height * 0.1) : randomBetween(0, height)
      star.size = randomBetween(layer.minSize, layer.maxSize)
      star.speedY = randomBetween(layer.speedMin, layer.speedMax)
      star.speedX = randomBetween(-0.22, 0.22)
      star.driftRadius = randomBetween(layer.driftRadius * 0.5, layer.driftRadius)
      star.twinkleAmp = randomBetween(layer.twinkleMin, layer.twinkleMax)
      star.twinkleSpeed = randomBetween(0.55, 1.35)
      star.pulseAmp = randomBetween(layer.pulseMin, layer.pulseMax)
      star.pulseSpeed = randomBetween(0.25, 0.8)
      star.baseAlpha = randomBetween(0.32, 0.92)
      star.phase = randomBetween(0, Math.PI * 2)
      star.direction = randomBetween(-0.35, 0.35)
      star.isGlow = Math.random() < layer.glowChance
      star.accentBlend = Math.random()
      star.fadeDuration = randomBetween(2.2, 4)
      star.fadeInDuration = randomBetween(1.8, 3.2)
    }

    const updateStar = (star, layer, elapsed, deltaFactor, deltaSeconds) => {
      const drift = Math.sin(elapsed * 0.00024 + star.phase) * star.driftRadius
      const driftX = Math.cos(elapsed * 0.00019 + star.phase * 1.1) * (star.driftRadius * 0.46)

      star.x += (star.speedX + star.direction * 0.09) * deltaFactor + driftX * 0.0012
      star.y -= star.speedY * deltaFactor * 0.28
      star.y += drift * 0.0016

      if (star.x < -40) star.x = width + 40
      if (star.x > width + 40) star.x = -40
      if (star.y < -50) {
        star.y = height + randomBetween(6, 48)
        star.x = randomBetween(0, width)
      }

      if (!star.isRenewable) return

      star.renewalDelay -= deltaSeconds
      if (star.renewalState === 'idle' && star.renewalDelay <= 0) {
        star.renewalState = 'fadeOut'
        star.renewalProgress = 0
      }

      if (star.renewalState === 'fadeOut') {
        star.renewalProgress += deltaSeconds / star.fadeDuration
        if (star.renewalProgress >= 1) {
          star.renewalState = 'fadeIn'
          star.renewalProgress = 0
          respawnStar(star, layer)
        }
      } else if (star.renewalState === 'fadeIn') {
        star.renewalProgress += deltaSeconds / star.fadeInDuration
        if (star.renewalProgress >= 1) {
          star.renewalState = 'idle'
          star.renewalProgress = 0
          star.renewalDelay = nextRenewalDelay(layer)
        }
      }
    }

    const alphaForStar = (star, elapsed) => {
      const twinkle = Math.sin(elapsed * 0.0011 * star.twinkleSpeed + star.phase) * star.twinkleAmp
      const pulse = Math.sin(elapsed * 0.00055 * star.pulseSpeed + star.phase * 0.7) * star.pulseAmp
      let alpha = star.baseAlpha * (0.74 + twinkle * 0.24 + pulse * 0.35)

      if (star.renewalState === 'fadeOut') {
        alpha *= Math.max(0, 1 - star.renewalProgress)
      } else if (star.renewalState === 'fadeIn') {
        alpha *= Math.min(1, star.renewalProgress)
      }

      return Math.max(0.03, Math.min(1, alpha))
    }

    const drawStar = (star, layer, elapsed) => {
      const alpha = alphaForStar(star, elapsed)
      const layerColor = layer.colorKey === 'far' ? palette.far : layer.colorKey === 'mid' ? palette.mid : palette.accent
      const mixedColor = layer.colorKey === 'accent' && star.accentBlend < 0.24 ? palette.silver : layerColor

      if (star.isGlow) {
        const glowRadius = star.size * (layer.id === 'accent' ? 8 : 5.2)
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowRadius)
        gradient.addColorStop(0, rgbaToString(palette.cool, alpha * 0.18))
        gradient.addColorStop(0.45, rgbaToString(mixedColor, alpha * 0.1))
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = rgbaToString(mixedColor, alpha)
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    }

    const render = (timestamp) => {
      if (!lastTime) lastTime = timestamp
      const deltaMs = Math.min(40, timestamp - lastTime)
      lastTime = timestamp
      const deltaFactor = deltaMs / 16.6667
      const deltaSeconds = deltaMs / 1000

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < starsByLayer.length; i += 1) {
        const item = starsByLayer[i]
        for (let j = 0; j < item.stars.length; j += 1) {
          const star = item.stars[j]
          updateStar(star, item.layer, timestamp, deltaFactor, deltaSeconds)
          drawStar(star, item.layer, timestamp)
        }
      }

      rafId = window.requestAnimationFrame(render)
    }

    const themeObserver = new MutationObserver(() => {
      palette = buildThemePalette()
    })

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onColorSchemeChange = () => {
      palette = buildThemePalette()
    }

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onColorSchemeChange)
    } else {
      media.addListener(onColorSchemeChange)
    }

    resize()
    rafId = window.requestAnimationFrame(render)

    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', onColorSchemeChange)
      } else {
        media.removeListener(onColorSchemeChange)
      }
      themeObserver.disconnect()
    }
  }, [])

  return (
    <div className="starfield-canvas" aria-hidden="true">
      <canvas ref={canvasRef} className="starfield-canvas__layer" />
      <div className="starfield-canvas__atmosphere" />
    </div>
  )
}
