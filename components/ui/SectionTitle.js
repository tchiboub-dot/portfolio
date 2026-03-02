'use client'

/**
 * COMPOSANT SECTION TITLE
 * Titre standardisé pour toutes les sections
 */
export default function SectionTitle({
  title,
  subtitle = '',
  align = 'left',
  className = '',
}) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={`mb-12 md:mb-16 ${alignClasses[align]} ${className}`}>
      <h2 className="text-h2 md:text-h1-mobile font-bold text-text-primary dark:text-dark-text-primary mb-3">
        {title}
      </h2>

      {subtitle && (
        <p className="text-text-secondary dark:text-dark-text-secondary text-lg max-w-2xl">
          {subtitle}
        </p>
      )}

      {/* Underline accent */}
      <div className="flex gap-2 mt-4 justify-start md:justify-center">
        <div className="h-1 w-12 bg-primary dark:bg-accent rounded-full" />
      </div>
    </div>
  )
}
