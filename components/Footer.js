'use client'

import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <footer className="relative bg-gradient-to-b from-blue-950/30 to-slate-950/50 py-12 backdrop-blur-sm">
      {/* Decorative separator line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent shadow-lg shadow-blue-400/30"></div>

      <div className="container-custom">
        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-10">
          {/* Left: Name & Description */}
          <div className="flex flex-col justify-center">
            {/* Name */}
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Taha Adnane Chiboub
            </h3>
            
            {/* Professional subtitle */}
            <p className="text-sm sm:text-base text-cyan-300/85 font-medium mb-4 tracking-wide">
              Software Engineering Student & AI Enthusiast
            </p>
            
            {/* Availability message */}
            <p className="text-blue-100/80 leading-relaxed text-sm sm:text-base max-w-xs">
              Available for internships, collaborations, and exciting projects.
            </p>
          </div>

          {/* Right: Links section */}
          <div className="flex flex-col justify-center md:items-end">
            <h4 className="text-lg font-bold text-blue-300 mb-4">Professional Links</h4>
            
            <div className="flex flex-wrap gap-3 md:justify-end">
              {/* GitHub Button */}
              <a
                href="https://github.com/tchiboub-dot"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blue-400/40 text-blue-100/90 backdrop-blur-sm bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-400/70 transition-all duration-200 hover:scale-[1.05] hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer"
              >
                <FaGithub className="w-4 h-4 group-hover:text-cyan-300 transition-colors duration-200" />
                GitHub
              </a>

              {/* LinkedIn Button */}
              <a
                href="https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blue-400/40 text-blue-100/90 backdrop-blur-sm bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-400/70 transition-all duration-200 hover:scale-[1.05] hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer"
              >
                <FaLinkedin className="w-4 h-4 group-hover:text-cyan-300 transition-colors duration-200" />
                LinkedIn
              </a>

              {/* Email Button */}
              <a
                href="mailto:taha.adnane.chiboub@gmail.com"
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blue-400/40 text-blue-100/90 backdrop-blur-sm bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-400/70 transition-all duration-200 hover:scale-[1.05] hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer"
              >
                <FaEnvelope className="w-4 h-4 group-hover:text-cyan-300 transition-colors duration-200" />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-400/20 pt-6 mt-8">
          {/* Copyright line */}
          <p className="text-blue-100/70 text-xs sm:text-sm text-center md:text-left">
            © 2026 Taha Adnane Chiboub — Crafted with modern web technologies.
          </p>
        </div>
      </div>

      {/* Back to top button - Enhanced */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-b from-blue-500/80 to-blue-600/80 text-white p-3.5 rounded-full border border-blue-300/25 backdrop-blur-sm transition-all duration-300 z-40 hover:from-blue-400/90 hover:to-blue-500/90 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-110 group ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        aria-label="Back to top"
      >
        <FaArrowUp className="group-hover:scale-125 transition-transform duration-300" />
      </button>
    </footer>
  )
}
