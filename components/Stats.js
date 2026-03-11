'use client'

import { useEffect, useRef, useState } from 'react'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

function AnimatedCount({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [start, setStart] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStart(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!start) return
    let frame
    let startTime
    const duration = 1200

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [start, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Stats() {
  const stats = [
    { value: 5, suffix: '', label: 'Projects Built' },
    { value: 5, suffix: '', label: 'Certifications Earned' },
    { value: 1, suffix: '', label: 'Year Coding Experience' },
  ]

  return (
    <section id="stats" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle
          title="Stats"
          subtitle="A quick snapshot of progress, consistency, and hands-on engineering output"
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center card-interactive">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-3">
                <AnimatedCount target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-blue-100/90 font-medium">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
