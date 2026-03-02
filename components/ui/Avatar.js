'use client'

import Image from 'next/image'

/**
 * COMPONENTE AVATAR CON GLOW RING PREMIUM
 * 
 * Uso:
 * <Avatar src="/photo-profil.jpg" alt="Name" size="lg" />
 * 
 * Props:
 * - src: URL de la imagen
 * - alt: Texto alternativo
 * - size: 'sm' (112px), 'md' (144px), 'lg' (180px) - default: 'lg'
 * - priority: boolean - pre-carga de imagen (default: true)
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
    <div className={`avatar-glow ${config.desktop} md:${config.desktop} ${config.mobile}`}>
      <Image
        src={src}
        alt={alt}
        width={config.pixels}
        height={config.pixels}
        priority={priority}
        quality={90}
        decoding="async"
      />
      {/* Subtle inner border */}
      <div className="avatar-border" aria-hidden="true" />
    </div>
  )
}
