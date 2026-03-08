'use client'

import { useEffect, useMemo, useRef } from 'react'

const STAR_COUNT = 104
const RENEWABLE_RATIO = 0.68

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function pickDepth() {
  const value = Math.random()

  if (value < 0.6) return 'far'
  if (value < 0.9) return 'medium'
  return 'bright'
}

function getStarProfile(depth) {
  if (depth === 'far') {
    return {
      size: randomBetween(0.7, 1.5),
      driftX: randomBetween(-26, 26),
      driftY: randomBetween(-62, -24),
      driftDuration: randomBetween(14, 22),
      twinkleDuration: randomBetween(4.8, 9.5),
      pulseDuration: randomBetween(8, 14),
      opacity: randomBetween(0.35, 0.7),
      glow: randomBetween(0.25, 0.45),
      isRenewable: Math.random() < 0.22,
      renewalMin: 18,
      renewalMax: 34,
      fadeDuration: randomBetween(2.2, 3.4),
    }
  }

  if (depth === 'medium') {
    return {
      size: randomBetween(1.2, 2.2),
      driftX: randomBetween(-34, 34),
      driftY: randomBetween(-70, -28),
      driftDuration: randomBetween(11, 18),
      twinkleDuration: randomBetween(3.8, 7.4),
      pulseDuration: randomBetween(6.5, 11),
      opacity: randomBetween(0.45, 0.82),
      glow: randomBetween(0.35, 0.6),
      isRenewable: Math.random() < 0.32,
      renewalMin: 16,
      renewalMax: 28,
      fadeDuration: randomBetween(2, 3),
    }
  }

  return {
    size: randomBetween(2.2, 3.8),
    driftX: randomBetween(-20, 20),
    driftY: randomBetween(-48, -18),
    driftDuration: randomBetween(9, 15),
    twinkleDuration: randomBetween(2.8, 6),
    pulseDuration: randomBetween(5.5, 9),
    opacity: randomBetween(0.58, 0.95),
    glow: randomBetween(0.55, 0.88),
    isRenewable: Math.random() < 0.12,
    renewalMin: 20,
    renewalMax: 36,
    fadeDuration: randomBetween(2.4, 3.8),
  }
}

function createStar(id) {
  const depth = pickDepth()
  const profile = getStarProfile(depth)
  const canRenew = profile.isRenewable && Math.random() < RENEWABLE_RATIO

  return {
    id,
    depth,
    size: profile.size,
    x: randomBetween(0, 100),
    y: randomBetween(0, 100),
    driftX: profile.driftX,
    driftY: profile.driftY,
    driftDuration: profile.driftDuration,
    driftDelay: -randomBetween(0, profile.driftDuration),
    twinkleDuration: profile.twinkleDuration,
    twinkleDelay: -randomBetween(0, profile.twinkleDuration),
    pulseDuration: profile.pulseDuration,
    pulseDelay: -randomBetween(0, profile.pulseDuration),
    opacity: profile.opacity,
    glow: profile.glow,
    renewable: canRenew,
    renewalMin: profile.renewalMin,
    renewalMax: profile.renewalMax,
    fadeDuration: profile.fadeDuration,
  }
}

function rerollStar(star) {
  const profile = getStarProfile(star.depth)

  return {
    size: profile.size,
    x: randomBetween(0, 100),
    y: randomBetween(0, 100),
    driftX: profile.driftX,
    driftY: profile.driftY,
    driftDuration: profile.driftDuration,
    twinkleDuration: profile.twinkleDuration,
    pulseDuration: profile.pulseDuration,
    opacity: profile.opacity,
    glow: profile.glow,
    fadeDuration: profile.fadeDuration,
  }
}

export default function StarfieldBackground() {
  const starRefs = useRef([])

  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, index) => createStar(index))
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const timers = []

    const scheduleRenewal = (star, index) => {
      if (!star.renewable) return

      const waitSeconds = randomBetween(star.renewalMin, star.renewalMax)
      const timerId = window.setTimeout(() => {
        const element = starRefs.current[index]
        if (!element) return

        const dot = element.querySelector('.starfield__dot')
        element.classList.add('is-renewing')

        const fadeMs = Number(element.dataset.fadeMs || 2500)
        const swapMs = Math.max(450, Math.floor(fadeMs * randomBetween(0.62, 0.8)))

        const swapId = window.setTimeout(() => {
          const next = rerollStar(star)

          element.style.setProperty('--star-x', `${next.x.toFixed(2)}%`)
          element.style.setProperty('--star-y', `${next.y.toFixed(2)}%`)
          element.style.setProperty('--star-size', `${next.size.toFixed(2)}px`)
          element.style.setProperty('--star-drift-x', `${next.driftX.toFixed(2)}px`)
          element.style.setProperty('--star-drift-y', `${next.driftY.toFixed(2)}px`)
          element.style.setProperty('--star-drift-duration', `${next.driftDuration.toFixed(2)}s`)
          element.style.setProperty('--star-opacity', next.opacity.toFixed(3))
          element.style.setProperty('--star-glow', next.glow.toFixed(3))
          element.style.setProperty('--star-fade-duration', `${next.fadeDuration.toFixed(2)}s`)

          if (dot) {
            dot.style.setProperty('--star-twinkle-duration', `${next.twinkleDuration.toFixed(2)}s`)
            dot.style.setProperty('--star-pulse-duration', `${next.pulseDuration.toFixed(2)}s`)
            dot.style.setProperty('--star-twinkle-delay', `${(-Math.random() * next.twinkleDuration).toFixed(2)}s`)
            dot.style.setProperty('--star-pulse-delay', `${(-Math.random() * next.pulseDuration).toFixed(2)}s`)
          }

          element.classList.remove('is-renewing')
          element.classList.add('is-reappearing')

          const settleId = window.setTimeout(() => {
            element.classList.remove('is-reappearing')
            scheduleRenewal(star, index)
          }, Math.max(900, Math.floor(fadeMs * 0.9)))

          timers.push(settleId)
        }, swapMs)

        timers.push(swapId)
      }, waitSeconds * 1000)

      timers.push(timerId)
    }

    stars.forEach((star, index) => {
      if (star.renewable) {
        scheduleRenewal(star, index)
      }
    })

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [stars])

  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield__atmosphere" />
      <div className="starfield__stars">
        {stars.map((star, index) => (
          <div
            key={star.id}
            ref={(el) => {
              starRefs.current[index] = el
            }}
            className={`starfield__star starfield__star--${star.depth}${star.renewable ? ' starfield__star--renewable' : ''}`}
            data-fade-ms={Math.round(star.fadeDuration * 1000)}
            style={{
              '--star-x': `${star.x.toFixed(2)}%`,
              '--star-y': `${star.y.toFixed(2)}%`,
              '--star-size': `${star.size.toFixed(2)}px`,
              '--star-opacity': star.opacity.toFixed(3),
              '--star-glow': star.glow.toFixed(3),
              '--star-drift-x': `${star.driftX.toFixed(2)}px`,
              '--star-drift-y': `${star.driftY.toFixed(2)}px`,
              '--star-drift-duration': `${star.driftDuration.toFixed(2)}s`,
              '--star-drift-delay': `${star.driftDelay.toFixed(2)}s`,
              '--star-twinkle-duration': `${star.twinkleDuration.toFixed(2)}s`,
              '--star-twinkle-delay': `${star.twinkleDelay.toFixed(2)}s`,
              '--star-pulse-duration': `${star.pulseDuration.toFixed(2)}s`,
              '--star-pulse-delay': `${star.pulseDelay.toFixed(2)}s`,
              '--star-fade-duration': `${star.fadeDuration.toFixed(2)}s`,
            }}
          >
            <span className="starfield__drift">
              <span className="starfield__dot" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
