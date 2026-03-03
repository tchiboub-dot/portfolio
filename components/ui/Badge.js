'use client'

/*
 * ELITE BADGE / CHIP COMPONENT
 * Premium badges with neon glow effects
 * Dark theme optimized with strong contrast
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-blue-500/20 text-blue-300 border border-blue-400/40 hover:border-blue-400/70 hover:bg-blue-500/30 shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all',
    accent: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:border-cyan-400/70 hover:bg-cyan-500/30 shadow-sm hover:shadow-md hover:shadow-cyan-500/20 transition-all',
    secondary: 'bg-blue-900/30 text-blue-200 border border-blue-400/25 hover:border-blue-400/50 hover:bg-blue-900/50 transition-all',
    success: 'bg-green-500/20 text-green-300 border border-green-400/40 hover:border-green-400/70 shadow-sm hover:shadow-md hover:shadow-green-500/20 transition-all',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 hover:border-yellow-400/70 shadow-sm hover:shadow-md hover:shadow-yellow-500/20 transition-all',
    danger: 'bg-red-500/20 text-red-300 border border-red-400/40 hover:border-red-400/70 shadow-sm hover:shadow-md hover:shadow-red-500/20 transition-all',
  }

  return (
    <span
      className={`
        inline-block px-3 py-1.5
        rounded-full text-xs font-semibold
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
