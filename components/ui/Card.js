'use client'

/**
 * COMPOSANT CARD
 * Carte réutilisable avec ombre et bordure légère
 */
export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        bg-surface dark:bg-dark-surface
        border border-border dark:border-dark-border
        rounded-card
        shadow-soft
        p-6
        transition-all duration-normal
        ${hover ? 'hover:shadow-medium hover:scale-105' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
