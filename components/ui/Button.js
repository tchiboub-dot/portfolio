'use client'

import Link from 'next/link'

/* 
 * ELITE BUTTON COMPONENT - PREMIUM NEON EFFECTS
 * Variants: primary, secondary, soft, danger, outline
 * Premium glow on hover, smooth 3D press effect
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  disabled = false,
  ...props
}) {
  const baseStyles = `
    font-semibold transition-all ease-out duration-[260ms]
    border rounded-[16px] 
    focus-visible:outline-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    inline-flex items-center justify-center gap-2
    active:scale-[0.97] active:duration-100
    min-h-[44px]
    relative
  `

  const variants = {
    primary: `
      bg-gradient-to-b from-blue-500 to-blue-600 text-white
      border-blue-400/30 shadow-lg hover:shadow-2xl
      hover:border-blue-400/60 hover:from-blue-400 hover:to-blue-500
      hover:brightness-110 hover:drop-shadow-lg
      focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20
    `,
    secondary: `
      bg-blue-500/10 text-blue-300 border-blue-400/30
      hover:bg-blue-500/20 hover:border-blue-400/60 hover:shadow-lg
      focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20
    `,
    soft: `
      bg-blue-500/15 text-blue-200 border-blue-400/20
      hover:bg-blue-500/25 hover:border-blue-400/50 hover:shadow-md
      focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20
    `,
    danger: `
      bg-red-600 text-white hover:opacity-90 border-red-500
      shadow-lg hover:shadow-2xl hover:drop-shadow-lg
      focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:ring-2 focus-visible:ring-red-500/20
    `,
    outline: `
      bg-transparent text-blue-300 border-blue-400/40
      hover:border-blue-400/80 hover:bg-blue-500/10 hover:text-blue-200 
      hover:shadow-lg hover:drop-shadow-md
      focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20
    `,
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14',
  }

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${className}
  `.replace(/\s+/g, ' ').trim()

  const style = {
    transitionDuration: 'var(--duration-normal)',
  }

  if (href) {
    return (
      <Link href={href} className={buttonClasses} style={style}>
        <span className="relative z-10">{children}</span>
      </Link>
    )
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      style={style}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}

