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
    success: 'bg-success/15 text-success border border-success/35',
    warning: 'bg-warning/15 text-warning border border-warning/35',
    danger: 'bg-danger/15 text-danger border border-danger/35',
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
