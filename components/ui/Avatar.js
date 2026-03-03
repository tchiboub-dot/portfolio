'use client'

import Image from 'next/image'

/**
 * ELITE AVATAR COMPONENT - PREMIUM CINEMATIC GLOW
 * 
 * Features:
 * - STATIC (no floating movement)
 * - Multi-layered glow halo with breathing effect
 * - Clean image layer (no distortion)
 * - Responsive and accessible
 * 
 * Usage:
 * <Avatar src="/photo.jpg" alt="Name" size="lg" />
 */
export default function Avatar({ src, alt = 'Avatar', size = 'lg', priority = true }) {
  const sizes = {
    sm: { desktop: 'w-28 h-28', mobile: 'w-20 h-20', pixels: 112 },
    md: { desktop: 'w-36 h-36', mobile: 'w-28 h-28', pixels: 144 },
    lg: { desktop: 'w-56 h-56', mobile: 'w-32 h-32', pixels: 180 },
  }

  const config = sizes[size] || sizes.lg

  return (
    <div className={`avatar-container ${config.desktop} ${config.mobile}`}>
      {/* OUTER GLOW LAYER - Soft fading halo (animation in globals.css) */}
      <div 
        className="absolute inset-0 rounded-full animate-ambient-breath"
        style={{
          background: 'radial-gradient(circle, rgba(159, 180, 214, 0.3) 0%, rgba(34, 211, 238, 0.1) 50%, transparent 100%)',
          filter: 'blur(20px)',
          transform: 'scale(1.3)',
        }}
        aria-hidden="true"
      />

      {/* GLOW RING - BEHIND IMAGE (z-index low) */}
      <div className="avatar-glow-ring" aria-hidden="true" />
      
      {/* IMAGE WRAPPER - Clean, no effects, NO MOVEMENT */}
      <div className="avatar-image-wrapper">
        <Image
          src={src}
          alt={alt}
          width={config.pixels}
          height={config.pixels}
          priority={priority}
          quality={92}
          decoding="async"
          className="avatar-image"
        />
      </div>
    </div>
  )
}
