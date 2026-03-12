'use client'

import { useEffect, useRef } from 'react'

const LAYERS = [
  {
    id: 'far',
    density: 0.00008,
    minSize: 0.45,
    maxSize: 1.1,
    speedMin: 0.35,
    speedMax: 0.85,
    driftRadius: 8,
    twinkleMin: 0.15,
    twinkleMax: 0.42,
    pulseMin: 0.02,
    pulseMax: 0.06,
    glowChance: 0.05,
    renewableChance: 0.12,
    renewalMin: 18,
    renewalMax: 42,
    colorKey: 'far',
    colorMixChance: 0.25,
    colorMixKey: 'cool',
  },
  {
    id: 'mid',
    density: 0.000042,
    minSize: 1.0,
    maxSize: 1.9,
    speedMin: 0.65,
    speedMax: 1.45,
    driftRadius: 14,
    twinkleMin: 0.22,
    twinkleMax: 0.58,
    pulseMin: 0.04,
    pulseMax: 0.10,
    glowChance: 0.22,
    renewableChance: 0.18,
    renewalMin: 14,
    renewalMax: 36,
    colorKey: 'mid',
    colorMixChance: 0.35,
    colorMixKey: 'silver',
  },
  {
    id: 'accent',
    density: 0.000015,
    minSize: 1.6,
    maxSize: 2.9,
    speedMin: 0.85,
    speedMax: 1.75,
    driftRadius: 18,
    twinkleMin: 0.28,
    twinkleMax: 0.68,
    pulseMin: 0.06,
    pulseMax: 0.13,
    glowChance: 0.52,
    renewableChance: 0.15,
    renewalMin: 16,
    renewalMax: 38,
    colorKey: 'bright',
    colorMixChance: 0.28,
    colorMixKey: 'silver',
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
  const direction = randomBetween(-0.25, 0.25)
  const phase = randomBetween(0, Math.PI * 2)

  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    size: randomBetween(layer.minSize, layer.maxSize),
    speedY: randomBetween(layer.speedMin, layer.speedMax),
    speedX: randomBetween(-0.18, 0.18),
    direction,
    driftRadius: randomBetween(layer.driftRadius * 0.6, layer.driftRadius),
    twinkleAmp: randomBetween(layer.twinkleMin, layer.twinkleMax),
    twinkleSpeed: randomBetween(0.45, 1.15),
    pulseAmp: randomBetween(layer.pulseMin, layer.pulseMax),
    pulseSpeed: randomBetween(0.2, 0.65),
    baseAlpha: randomBetween(0.42, 0.96),
    phase,
    isGlow: Math.random() < layer.glowChance,
    colorMix: Math.random() < layer.colorMixChance,
    isRenewable: Math.random() < layer.renewableChance,
    renewalDelay: nextRenewalDelay(layer),
    renewalState: 'idle',
    renewalProgress: 0,
    fadeDuration: randomBetween(2.5, 5),
    fadeInDuration: randomBetween(2, 4.2),
  }
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
    let frameInterval = 1000 / 60
    let densityScale = 1
    let allowGlow = true
    let isRunning = true
    let resizeRaf = 0

    const getPerformanceConfig = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const performanceTier = document.documentElement.dataset.performance || 'balanced'

      const lowTier = performanceTier === 'low'
      const balancedTier = performanceTier === 'balanced'

      let maxDpr = 2
      let targetFps = 60
      let nextDensityScale = 1
      let nextAllowGlow = true

      if (prefersReducedMotion) {
        maxDpr = 1.25
        targetFps = 24
        nextDensityScale = 0.35
        nextAllowGlow = false
      } else if (isMobile || lowTier) {
        maxDpr = 1.4
        targetFps = 30
        nextDensityScale = 0.48
        nextAllowGlow = false
      } else if (balancedTier) {
        maxDpr = 1.8
        targetFps = 45
        nextDensityScale = 0.72
        nextAllowGlow = true
      }

      return {
        maxDpr,
        targetFps,
        nextDensityScale,
        nextAllowGlow,
      }
    }

    const getTargetStarCount = (layer, widthValue, heightValue) => {
      const area = widthValue * heightValue
      const baseTarget = Math.floor(area * layer.density * densityScale)
      const minimum = layer.id === 'far' ? 12 : layer.id === 'mid' ? 8 : 6
      const cap = densityScale < 0.5 ? (layer.id === 'far' ? 70 : layer.id === 'mid' ? 40 : 20) : (layer.id === 'far' ? 140 : layer.id === 'mid' ? 72 : 36)
      return Math.max(minimum, Math.min(cap, baseTarget))
    }

    const resize = () => {
      const config = getPerformanceConfig()
      dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr)
      frameInterval = 1000 / config.targetFps
      densityScale = config.nextDensityScale
      allowGlow = config.nextAllowGlow

      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      starsByLayer = LAYERS.map((layer) => {
        const target = getTargetStarCount(layer, width, height)
        const stars = Array.from({ length: target }, () => createStar(width, height, layer))
        return {
          layer,
          stars,
        }
      })
    }

    const respawnStar = (star, layer) => {
      star.x = randomBetween(0, width)
      star.y = randomBetween(0, height)
      star.size = randomBetween(layer.minSize, layer.maxSize)
      star.speedY = randomBetween(layer.speedMin, layer.speedMax)
      star.speedX = randomBetween(-0.18, 0.18)
      star.driftRadius = randomBetween(layer.driftRadius * 0.6, layer.driftRadius)
      star.twinkleAmp = randomBetween(layer.twinkleMin, layer.twinkleMax)
      star.twinkleSpeed = randomBetween(0.45, 1.15)
      star.pulseAmp = randomBetween(layer.pulseMin, layer.pulseMax)
      star.pulseSpeed = randomBetween(0.2, 0.65)
      star.baseAlpha = randomBetween(0.42, 0.96)
      star.phase = randomBetween(0, Math.PI * 2)
      star.direction = randomBetween(-0.25, 0.25)
      star.isGlow = Math.random() < layer.glowChance
      star.colorMix = Math.random() < layer.colorMixChance
      star.fadeDuration = randomBetween(2.5, 5)
      star.fadeInDuration = randomBetween(2, 4.2)
    }

    const updateStar = (star, layer, elapsed, deltaFactor, deltaSeconds) => {
      const drift = Math.sin(elapsed * 0.0002 + star.phase) * star.driftRadius
      const driftX = Math.cos(elapsed * 0.00016 + star.phase * 1.15) * (star.driftRadius * 0.5)

      star.x += (star.speedX + star.direction * 0.08) * deltaFactor + driftX * 0.001
      star.y -= star.speedY * deltaFactor * 0.22
      star.y += drift * 0.0014

      if (star.x < -40) star.x = width + 40
      if (star.x > width + 40) star.x = -40
      if (star.y < -50) {
        star.y = height + randomBetween(8, 55)
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
      const twinkle = Math.sin(elapsed * 0.0009 * star.twinkleSpeed + star.phase) * star.twinkleAmp
      const pulse = Math.sin(elapsed * 0.00048 * star.pulseSpeed + star.phase * 0.75) * star.pulseAmp
      let alpha = star.baseAlpha * (0.68 + twinkle * 0.28 + pulse * 0.32)

      if (star.renewalState === 'fadeOut') {
        const easeOut = 1 - Math.pow(star.renewalProgress, 1.8)
        alpha *= Math.max(0, easeOut)
      } else if (star.renewalState === 'fadeIn') {
        const easeIn = Math.pow(star.renewalProgress, 0.65)
        alpha *= Math.min(1, easeIn)
      }

      return Math.max(0.02, Math.min(1, alpha))
    }

    const drawStar = (star, layer, elapsed) => {
      const alpha = alphaForStar(star, elapsed)
      const baseColor = palette[layer.colorKey] || palette.mid
      const mixColor = palette[layer.colorMixKey] || palette.silver
      const finalColor = star.colorMix ? mixColor : baseColor

      if (allowGlow && star.isGlow && layer.id !== 'far') {
        ctx.save()
        ctx.shadowBlur = star.size * (layer.id === 'accent' ? 8 : 5)
        ctx.shadowColor = rgbaToString(finalColor, alpha * (layer.id === 'accent' ? 0.2 : 0.14))
        ctx.fillStyle = rgbaToString(finalColor, alpha * 0.65)
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 1.18, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      ctx.fillStyle = rgbaToString(finalColor, alpha)
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    }

    const render = (timestamp) => {
      if (!isRunning) return
      if (!lastTime) lastTime = timestamp

      const elapsedSinceFrame = timestamp - lastTime
      if (elapsedSinceFrame < frameInterval) {
        rafId = window.requestAnimationFrame(render)
        return
      }

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

    const onVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false
        if (rafId) window.cancelAnimationFrame(rafId)
        rafId = 0
        return
      }

      isRunning = true
      lastTime = 0
      if (!rafId) rafId = window.requestAnimationFrame(render)
    }

    const onResize = () => {
      if (resizeRaf) return
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0
        resize()
      })
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

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.cancelAnimationFrame(rafId)
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('resize', onResize)
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
