'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * ELITE SECTION TITLE COMPONENT
 * Premium animated section headers with neon glow underline
 * Cinematic entrance animations
 */
export default function SectionTitle({
  title,
  subtitle = '',
  align = 'left',
  className = '',
}) {
  const [inView, setInView] = useState(false)
  const sectionTitleRef = useRef(null)

  useEffect(() => {
    const node = sectionTitleRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const alignClasses = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end',
  }

  return (
    <div ref={sectionTitleRef} className={`mb-10 md:mb-16 ${className} animate-section-reveal`}>
      <h2 className={`text-2xl sm:text-h2 md:text-h1-mobile font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-3 drop-shadow-lg ${
        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
      }`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`text-blue-200/80 text-sm sm:text-base md:text-lg max-w-2xl font-medium ${
          align === 'center' ? 'mx-auto' : ''
        }`}>
          {subtitle}
        </p>
      )}

      {/* Animated Neon Glow Underline */}
      <div className={`flex gap-2 mt-6 ${alignClasses[align]}`}>
        <div 
          className={`section-title-accent h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-500/40 transition-all duration-300 ${inView ? 'section-title-accent--in' : ''}`} 
          style={{
            transform: inView ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: align === 'center' ? 'center' : align === 'right' ? 'right' : 'left',
          }}
        />
      </div>
    </div>
  )
}
