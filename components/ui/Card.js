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
        bg-gradient-to-br from-slate-900/55 via-slate-900/45 to-cyan-950/20
        backdrop-filter backdrop-blur-xl
        border border-cyan-200/12
        shadow-[0_14px_34px_rgba(2,8,22,0.42)]
        p-7 md:p-8 
        transition-all ease-out duration-300
        ${hover ? 'hover:border-cyan-200/24 hover:shadow-[0_16px_38px_rgba(2,8,22,0.46),0_0_0_1px_rgba(120,210,235,0.14)]' : ''}
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
