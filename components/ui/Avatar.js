'use client'

import Image from 'next/image'

/**
 * AVATAR AVEC HALO LUMINEUX PROFESSIONNEL
 * 
 * Le glow ring est UNIQUEMENT derrière l'image:
 * - Pas d'effet sur la photo (nette, inchangée)
 * - Halo discret et élégant (style SaaS)
 * - Anneau bleu → cyan avec soft blur
 * - Responsive et accessible
 * 
 * Uso:
 * <Avatar src="/photo-profil.jpg" alt="Name" size="lg" />
 */
export default function Avatar({ src, alt = 'Avatar', size = 'lg', priority = true }) {
  // Tamaños responsivos
  const sizes = {
    sm: { desktop: 'w-28 h-28', mobile: 'w-20 h-20', pixels: 112 },
    md: { desktop: 'w-36 h-36', mobile: 'w-28 h-28', pixels: 144 },
    lg: { desktop: 'w-56 h-56', mobile: 'w-32 h-32', pixels: 180 },
  }

  const config = sizes[size] || sizes.lg

  return (
    <div className={`avatar-container ${config.desktop} md:${config.desktop} ${config.mobile}`}>
      {/* GLOW RING - DETRÁS DE LA IMAGEN (z-index bajo) */}
      <div className="avatar-glow-ring" aria-hidden="true" />
      
      {/* IMAGEN - ARRIBA SIN EFECTOS (z-index alto) */}
      <div className="avatar-image-wrapper">
        <Image
          src={src}
          alt={alt}
          width={config.pixels}
          height={config.pixels}
          priority={priority}
          quality={90}
          decoding="async"
          className="avatar-image"
        />
      </div>
    </div>
  )
}
