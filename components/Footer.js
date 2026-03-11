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
    <footer className="bg-gradient-to-b from-blue-950/30 to-slate-950/50 border-t border-blue-400/20 py-12 backdrop-blur-sm">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-7 md:gap-8 mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Taha Adnane Chiboub
            </h3>
            <p className="text-blue-100/90 leading-relaxed">
              Available for internships and collaborations.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-blue-300 mb-3">Links</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/tchiboub-dot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-400/35 text-blue-100 hover:bg-blue-500/20 transition-colors duration-300"
              >
                <FaGithub className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-400/35 text-blue-100 hover:bg-blue-500/20 transition-colors duration-300"
              >
                <FaLinkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href="mailto:taha.adnane.chiboub@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-400/35 text-blue-100 hover:bg-blue-500/20 transition-colors duration-300"
              >
                <FaEnvelope className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-400/20 pt-6">
          <p className="text-blue-100/90 text-sm text-center md:text-left">
            © 2026 Taha Adnane Chiboub. All rights reserved.
          </p>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-b from-blue-500/85 to-blue-600/85 text-white p-3.5 rounded-full border border-blue-300/25 shadow-lg shadow-blue-500/25 backdrop-blur-sm transition-all duration-300 z-40 ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  )
}
