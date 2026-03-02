'use client'

/*
 * SECTION TITLE COMPONENT
 * Professional section headers with accent underline
 * Uses CSS variables for consistent styling
 */
export default function SectionTitle({
  title,
  subtitle = '',
  align = 'left',
  className = '',
}) {
  const alignClasses = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end',
  }

  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <h2 className={`text-h2 md:text-h1-mobile font-bold text-heading mb-3 ${
        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
      }`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`text-muted text-lg max-w-2xl ${
          align === 'center' ? 'mx-auto' : ''
        }`}>
          {subtitle}
        </p>
      )}

      {/* Accent underline */}
      <div className={`flex gap-2 mt-4 ${alignClasses[align]}`}>
        <div className="h-1 w-16 bg-primary rounded-full shadow-medium" />
      </div>
    </div>
  )
}
