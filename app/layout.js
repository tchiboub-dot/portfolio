import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import StarfieldBackground from '@/components/StarfieldBackground'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000'
const normalizedSiteUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`

/**
 * METADATA DE L'APPLICATION
 * Modifiez ces informations pour personnaliser les métadonnées SEO
 */
export const metadata = {
  metadataBase: new URL(normalizedSiteUrl),
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
    <html lang="fr" data-theme="dark" data-performance="balanced" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;var v=(t==='dark'||t==='light')?t:(p?'dark':'light');document.documentElement.dataset.theme=v;}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <StarfieldBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
