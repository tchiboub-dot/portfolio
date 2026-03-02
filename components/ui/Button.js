'use client'

import Link from 'next/link'

/* 
 * MODERN BUTTON COMPONENT
 * Variants: primary, secondary, soft, danger, outline
 * Pro styling with proper contrast & accessibility
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
    font-semibold transition-all duration-fast
    border rounded-button focus-visible:outline focus-visible:outline-2 
    focus-visible:outline-offset-2 focus-visible:outline-primary
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    inline-flex items-center justify-center gap-2
  `

  const variants = {
    primary: `
      bg-primary text-white hover:bg-primary-hover 
      border-primary shadow-medium hover:shadow-default
    `,
    secondary: `
      bg-surface text-primary border-primary
      hover:bg-primary-soft transition-colors
    `,
    soft: `
      bg-primary-soft text-primary border-transparent
      hover:bg-primary hover:text-white
    `,
    danger: `
      bg-danger text-white hover:bg-red-700
      border-danger shadow-medium hover:shadow-default
    `,
    outline: `
      bg-transparent text-text border-border
      hover:border-primary hover:text-primary
      hover:bg-primary-soft
    `,
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14',
  }

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${className}
  `.replace(/\s+/g, ' ').trim()

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

