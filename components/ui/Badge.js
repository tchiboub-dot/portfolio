'use client'

/*
 * BADGE / CHIP COMPONENT
 * Modern badge with proper contrast + dark theme cohesion
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-primary-soft text-primary border border-primary',
    accent: 'bg-accent-soft text-accent border border-accent',
    secondary: 'bg-surface-2 text-text border border-border',
    success: 'bg-green-900 text-green-100 border border-green-700',
    warning: 'bg-yellow-900 text-yellow-100 border border-yellow-700',
    danger: 'bg-red-900 text-red-100 border border-red-700',
  }

  return (
    <span
      className={`
        inline-block px-3 py-1.5
        rounded-full text-xs font-semibold
        transition-colors duration-fast
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
