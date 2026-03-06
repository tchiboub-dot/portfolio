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
      bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950
      border-cyan-200/25 shadow-[0_10px_26px_rgba(6,182,212,0.22)]
      hover:border-cyan-100/40 hover:from-cyan-400 hover:to-teal-400
      hover:-translate-y-[1px] hover:shadow-[0_14px_30px_rgba(6,182,212,0.28)]
      focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400/20
    `,
    secondary: `
      bg-cyan-500/10 text-cyan-100 border-cyan-200/25
      hover:bg-cyan-500/16 hover:border-cyan-100/35 hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(6,182,212,0.16)]
      focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400/20
    `,
    soft: `
      bg-slate-800/55 text-slate-100 border-cyan-200/16
      hover:bg-slate-800/75 hover:border-cyan-200/28 hover:shadow-[0_10px_22px_rgba(8,145,178,0.14)]
      focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400/20
    `,
    danger: `
      bg-rose-600 text-white hover:opacity-95 border-rose-400/50
      shadow-[0_10px_24px_rgba(225,29,72,0.22)] hover:shadow-[0_14px_28px_rgba(225,29,72,0.28)]
      focus-visible:outline-2 focus-visible:outline-rose-300 focus-visible:ring-2 focus-visible:ring-rose-400/20
    `,
    outline: `
      bg-transparent text-cyan-100 border-cyan-200/30
      hover:border-cyan-100/50 hover:bg-cyan-500/10 hover:text-cyan-50
      hover:shadow-[0_10px_20px_rgba(8,145,178,0.14)]
      focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400/20
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

