'use client'

import Link from 'next/link'

/**
 * COMPOSANT BUTTON
 * Bouton réutilisable avec variants (primary, secondary, soft)
 * Supporte les liens internes et externes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  ...props
}) {
  const baseStyles =
    'font-medium transition-all duration-fast border rounded-button focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark border-transparent focus:ring-primary shadow-soft hover:shadow-medium',
    secondary:
      'bg-surface text-primary border-primary hover:bg-primary-soft border focus:ring-primary',
    soft: 'bg-primary-soft text-primary hover:bg-primary hover:text-white border-transparent focus:ring-primary',
    danger:
      'bg-danger text-white hover:bg-red-700 border-transparent focus:ring-danger',
    outline:
      'bg-transparent text-text-primary border-border hover:border-primary hover:text-primary',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2',
  }

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${className}
    flex items-center justify-center
  `

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
      {...props}
    >
      {children}
    </button>
  )
}

