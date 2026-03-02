'use client'

import Link from 'next/link'

/* 
 * MODERN BUTTON COMPONENT - PREMIUM SAAS
 * Variants: primary, secondary, soft, danger, outline
 * Full accessibility & smooth transitions
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
    font-semibold transition-all ease-out
    border rounded-[16px] 
    focus-visible:outline-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    inline-flex items-center justify-center gap-2
    active:scale-95 active:duration-75
    min-h-[44px]
  `

  const variants = {
    primary: `
      bg-primary text-white hover:bg-primary-hover 
      border-primary shadow-sm hover:shadow-md hover:brightness-105
      focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary-soft
    `,
    secondary: `
      bg-surface text-primary border-border-light
      hover:bg-primary-soft hover:border-primary/50
      focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary-soft
    `,
    soft: `
      bg-primary-soft text-primary border-transparent
      hover:bg-primary/20 hover:border-primary/40
      focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary
    `,
    danger: `
      bg-danger text-white hover:bg-red-700 
      border-danger shadow-sm hover:shadow-md
      focus-visible:outline-2 focus-visible:outline-danger focus-visible:ring-2 focus-visible:ring-danger/20
    `,
    outline: `
      bg-transparent text-text border-border-light
      hover:border-primary hover:bg-primary-soft hover:text-primary hover:shadow-sm
      focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary-soft
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
        {children}
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
      {children}
    </button>
  )
}

