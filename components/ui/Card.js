'use client'

/*
 * MODERN CARD COMPONENT
 * Dark theme cohesive styling with proper contrast
 * Uses CSS variables for surface colors
 */
export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        bg-surface border border-border
        rounded-card shadow-medium
        p-6 transition-all duration-normal
        ${hover ? 'hover:shadow-default hover:scale-105' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
