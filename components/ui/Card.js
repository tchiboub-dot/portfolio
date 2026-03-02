'use client'

/**
 * PREMIUM CARD COMPONENT
 * - Refined borders with light accent color
 * - Softer shadows with subtle hover elevation
 * - Smooth transitions respecting motion preferences
 * - Maintains design consistency across portfolio
 */
export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        bg-surface border border-border-light
        rounded-lg shadow-sm
        p-6 md:p-8 transition-all ease-out duration-normal
        ${hover ? 'hover:border-primary/40 hover:shadow-md hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
