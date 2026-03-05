'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

/**
 * STACKED CARD GROUP COMPONENT
 * Reusable component for displaying items as a stacked card carousel
 * Features:
 * - Stack appearance with offset cards
 * - Arrow navigation + pagination dots
 * - Click to expand with modal overlay
 * - Smooth transform/opacity animations (200-400ms)
 * - Mobile swipe support
 * - Keyboard navigation
 * - Accessibility compliant
 */
export default function StackedCardGroup({
  items = [],
  renderCard,
  renderDetails,
  cardCount = 3,
  stackOffset = 24,
  stackScale = 0.98,
  onNavigate,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartX = useRef(null)
  const containerRef = useRef(null)
  const prevIndexRef = useRef(0)

  const totalItems = items.length
  const visibleCards = Math.min(cardCount, totalItems)

  // Handle navigation with animation
  const navigate = (direction) => {
    if (isAnimating || totalItems === 0) return

    setIsAnimating(true)
    prevIndexRef.current = activeIndex

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
    prevIndexRef.current = activeIndex
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
      if (diff > 0) navigate(1)
      else navigate(-1)
    }
    touchStartX.current = null
  }

  const getCardStyle = (index) => {
    const position = (index - activeIndex + totalItems) % totalItems
    
    if (position === 0) {
      // Active card (front)
      return {
        zIndex: 30,
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        pointerEvents: 'auto',
      }
    } else if (position < visibleCards) {
      // Cards behind (visible edges)
      const offset = position * stackOffset
      const scale = 1 - position * (1 - stackScale)
      return {
        zIndex: 30 - position,
        opacity: 0.7,
        transform: `translateY(${offset}px) scale(${scale})`,
        pointerEvents: 'none',
      }
    } else {
      // Hidden cards
      return {
        zIndex: 0,
        opacity: 0,
        transform: `translateY(${visibleCards * stackOffset}px) scale(${stackScale})`,
        pointerEvents: 'none',
      }
    }
  }

  return (
    <>
      {/* Stack Container */}
      <div
        ref={containerRef}
        className="relative mx-auto max-w-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Stack Wrapper */}
        <div className="relative h-96 md:h-[480px] perspective">
          {items.map((item, index) => {
            const style = getCardStyle(index)
            const isActive = index === activeIndex
            return (
              <div
                key={index}
                className={`absolute inset-x-0 top-0 w-full transition-all ease-out duration-300 cursor-${
                  isActive ? 'pointer' : 'default'
                }`}
                style={style}
                onClick={() => isActive && setIsDetailsOpen(true)}
              >
                {renderCard(item, isActive)}
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-0 md:px-[-16px] pointer-events-none">
          <button
            onClick={() => navigate(-1)}
            disabled={isAnimating || totalItems === 0}
            className="pointer-events-auto flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 backdrop-blur-sm hover:border-blue-400/60 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950/50"
            aria-label="Previous item"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={() => navigate(1)}
            disabled={isAnimating || totalItems === 0}
            className="pointer-events-auto flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 backdrop-blur-sm hover:border-blue-400/60 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950/50"
            aria-label="Next item"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Pagination Dots */}
      {totalItems > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              disabled={isAnimating}
              className={`transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950/50 ${
                index === activeIndex
                  ? 'w-2.5 h-2.5 bg-blue-400'
                  : 'w-2 h-2 bg-blue-400/40 hover:bg-blue-400/60'
              }`}
              aria-label={`Go to item ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Details Modal Overlay */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), rgba(7, 11, 20, 0.92)',
          }}
          onClick={() => setIsDetailsOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsDetailsOpen(false)}
            className="absolute top-4 right-4 z-60 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-100 transition-all duration-300 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Close details"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Details Content */}
          <div
            className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900/30 backdrop-blur-xl border border-blue-400/25 shadow-2xl shadow-black/50 p-6 md:p-8 animate-scaleIn"
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
      `}</style>
    </>
  )
}
