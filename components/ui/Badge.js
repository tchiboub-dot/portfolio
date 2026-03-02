'use client'

/**
 * COMPOSANT BADGE/CHIP
 * Petit badge pour taguer des compétences, catégories, etc.
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-primary-soft text-primary dark:bg-primary-dark dark:text-blue-200',
    accent: 'bg-accent-soft text-accent dark:bg-accent dark:text-white',
    secondary: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
  }

  return (
    <span
      className={`
        inline-block
        px-3 py-1.5
        rounded-full
        text-xs font-medium
        transition-colors duration-fast
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
