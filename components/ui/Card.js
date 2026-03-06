'use client'

/**
 * ELITE CARD COMPONENT - PREMIUM GLASSMORPHISM
 * - Enhanced blur and backdrop effects
 * - Neon-blue glow ring on hover ONLY
 * - Layered depth shadows
 * - Cinematic smooth transitions
 * - NO movement, NO scaling
 */
export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        relative rounded-[24px] 
        bg-gradient-to-br from-blue-950/40 to-slate-900/30
        backdrop-filter backdrop-blur-xl
        border border-blue-400/25
        shadow-xl shadow-black/40
        p-7 md:p-8 
        transition-all ease-out duration-300
        ${hover ? 'hover:border-blue-400 hover:shadow-[0_0_0_1px_rgba(59,130,246,1),0_0_14px_rgba(59,130,246,0.6),0_0_28px_rgba(59,130,246,0.28)]' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
