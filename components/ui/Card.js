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
        glass-card
        rounded-[22px] shadow-sm
        p-7 md:p-8 transition-all ease-out duration-normal
        ${hover ? 'hover:border-white/5 hover:shadow-md hover:-translate-y-[2px]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
