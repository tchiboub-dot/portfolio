import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

/**
 * METADATA DE L'APPLICATION
 * Modifiez ces informations pour personnaliser les métadonnées SEO
 */
export const metadata = {
  title: 'Chiboub Taha Adnane | Développeur Web Portfolio',
  description: 'Portfolio professionnel de Chiboub Taha Adnane - Étudiant en Informatique ESISA Fes, Développeur Web junior spécialisé en HTML, CSS, JavaScript, React et Next.js',
  keywords: 'développeur web, portfolio, Taha Chiboub, ESISA, développement web, HTML, CSS, JavaScript, React, Next.js',
  authors: [{ name: 'Chiboub Taha Adnane' }],
  creator: 'Chiboub Taha Adnane',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Portfolio Taha Chiboub',
    title: 'Chiboub Taha Adnane | Développeur Web Portfolio',
    description: 'Portfolio professionnel de Chiboub Taha Adnane - Développeur Web junior',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
