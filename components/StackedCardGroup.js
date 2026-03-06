'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

/**
 * RIGHT-OFFSET STACKED CARD COMPONENT
 * Professional "stacked deck" where cards shift RIGHT with corner peek
 * Features:
 * - Right-offset positioning (cards shift right, edges visible)
 * - Solid opaque cards (not transparent)
 * - Arrow navigation + pagination dots
 * - Click to expand with solid modal
 * - Smooth transform animations (250-400ms)
 * - Mobile swipe support
 * - Keyboard navigation
 * - Accessibility compliant
 */
export default function StackedCardGroup({
  items = [],
  renderCard,
  renderDetails,
  cardCount = 3,
  rightOffset = 20,
  downOffset = 12,
  onNavigate,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartX = useRef(null)
  const containerRef = useRef(null)

  const totalItems = items.length
  const visibleCards = Math.min(cardCount, totalItems)

  // Handle navigation with animation
  const navigate = (direction) => {
    if (isAnimating || totalItems === 0) return

    setIsAnimating(true)

    let newIndex = activeIndex + direction
    if (newIndex < 0) newIndex = totalItems - 1
    if (newIndex >= totalItems) newIndex = 0

    setActiveIndex(newIndex)
    onNavigate?.(newIndex)

    setTimeout(() => setIsAnimating(false), 400)
  }

  const goToCard = (index) => {
    if (isAnimating || index === activeIndex) return
    setIsAnimating(true)
    setActiveIndex(index)
    onNavigate?.(index)
    setTimeout(() => setIsAnimating(false), 400)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isDetailsOpen) return
      if (e.key === 'ArrowLeft') navigate(-1)
      else if (e.key === 'ArrowRight') navigate(1)
      else if (e.key === 'Escape') setIsDetailsOpen(false)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isDetailsOpen, activeIndex, isAnimating])

  // Touch/swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) navigate(1)  // Swiped left → next
      else navigate(-1)            // Swiped right → prev
    }
    touchStartX.current = null
  }

  const getCardStyle = (index) => {
    const position = (index - activeIndex + totalItems) % totalItems
    
    if (position === 0) {
      // Active card (fully visible, highest z-index, no transform)
      return {
        zIndex: 30 + visibleCards,
        opacity: 1,
        transform: 'translateX(0) translateY(0)',
        pointerEvents: 'auto',
      }
    } else {
      // Hidden cards - positioned off-screen, minimal visual presence
      // They're completely hidden so the active card is never covered
      return {
        zIndex: 0,
        opacity: 0,
        transform: `translateX(150%) translateY(100%)`,
        pointerEvents: 'none',
      }
    }
  }

  return (
    <>
      {/* Stack Container with left/right arrows outside */}
      <div
        ref={containerRef}
        className="relative mx-auto max-w-2xl px-16 md:px-20"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow - Outside Left */}
        <button
          onClick={() => navigate(-1)}
          disabled={isAnimating || totalItems === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 backdrop-blur-sm hover:border-blue-400/60 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label="Previous item"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Stack Wrapper - Right-offset positioning with overflow constraint */}
        <div className="relative h-96 md:h-[480px] overflow-hidden rounded-2xl">
          {items.map((item, index) => {
            const style = getCardStyle(index)
            const isActive = index === activeIndex
            return (
              <div
                key={index}
                className={`absolute left-0 top-0 w-full transition-all ease-out duration-300 cursor-${
                  isActive ? 'pointer' : 'default'
                } ${isActive ? 'active-card' : ''}`}
                style={style}
                onClick={() => isActive && setIsDetailsOpen(true)}
              >
                {renderCard(item, isActive)}
              </div>
            )
          })}
        </div>

        {/* Right Arrow - Outside Right */}
        <button
          onClick={() => navigate(1)}
          disabled={isAnimating || totalItems === 0}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 backdrop-blur-sm hover:border-blue-400/60 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label="Next item"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Pagination Dots + Counter Indicator */}
      {totalItems > 1 && (
        <div className="flex flex-col items-center gap-3 mt-8">
          {/* Professional Counter + Dots in Glass Pill */}
          <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-400/25 hover:border-blue-400/40 transition-colors duration-300">
            {/* Pagination Dots */}
            <div className="flex gap-1.5">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCard(index)}
                  disabled={isAnimating}
                  className={`transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    index === activeIndex
                      ? 'w-2 h-2 bg-blue-400'
                      : 'w-1.5 h-1.5 bg-blue-400/40 hover:bg-blue-400/60'
                  }`}
                  aria-label={`Go to item ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : 'false'}
                />
              ))}
            </div>
            
            {/* Counter Text */}
            <span className="text-xs font-semibold text-blue-300 ml-1">
              {activeIndex + 1} / {totalItems}
            </span>
          </div>
        </div>
      )}

      {/* Details Modal - Solid, not transparent */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), rgba(7, 11, 20, 0.94)',
          }}
          onClick={() => setIsDetailsOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsDetailsOpen(false)}
            className="absolute top-4 right-4 z-60 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/40 text-blue-100 transition-all duration-300 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Close details"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Details Content - Solid glass panel */}
          <div
            className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900/50 backdrop-blur-xl border border-blue-400/30 shadow-2xl shadow-black/60 p-6 md:p-8 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {renderDetails(items[activeIndex], activeIndex, {
              onNext: () => navigate(1),
              onPrev: () => navigate(-1),
              close: () => setIsDetailsOpen(false),
              totalItems,
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        /* Stack Effect Using Pseudo-Elements - No Blur Spillage */
        .active-card::before,
        .active-card::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%);
          border: 1px solid rgba(59, 130, 246, 0.15);
          pointer-events: none;
        }

        .active-card::before {
          z-index: -1;
          transform: translateX(12px) translateY(8px);
        }

        .active-card::after {
          z-index: -2;
          transform: translateX(24px) translateY(16px);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.02) 100%);
          border-color: rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </>
  )
}
