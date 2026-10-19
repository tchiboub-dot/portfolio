import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getPageBySlug, getPublicPortfolioContent } from '@/lib/db/cms'
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = params
  const page = await getPageBySlug(slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || `Page ${page.title} du portfolio`,
  }
}

export default async function CustomPage({ params }) {
  const { slug } = params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  let content = null
  try {
    content = await getPublicPortfolioContent()
  } catch (err) {
    console.error('Error fetching layout data:', err)
  }

  const theme = content?.theme || {}

  // Format date
  const updatedDate = page.updatedAt ? new Date(page.updatedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : null

  return (
    <main className="min-h-screen text-text transition-colors duration-300" style={{ backgroundColor: 'var(--bg, #030712)' }}>
      {/* Dynamic Theme CSS Variables Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${theme.primaryColor || '#38bdf8'};
              --primary-hover: ${theme.primaryColor || '#38bdf8'};
              --accent: ${theme.accentColor || '#22d3ee'};
              --bg: ${theme.bgColor || '#030712'};
              --surface: ${theme.cardBg || '#0b1329'};
              --surface2: ${theme.cardBg || '#0b1329'};
              --surface-2: ${theme.cardBg || '#0b1329'};
              --radius: ${theme.borderRadius || '16px'};
              --font-family: ${theme.fontFamily || 'Inter, sans-serif'};
            }
            body {
              background-color: var(--bg);
              color: var(--text);
              font-family: var(--font-family);
            }
            ${theme.customCss || ''}
          `,
        }}
      />

      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 min-h-[75vh]">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-8 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Retour à l&apos;accueil
          </Link>

          {/* Page Card */}
          <article className="p-6 sm:p-10 rounded-2xl bg-surface/70 border border-white/10 shadow-xl backdrop-blur-md">
            <header className="mb-8 border-b border-white/10 pb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight mb-4">
                {page.title}
              </h1>
              {updatedDate && (
                <div className="flex items-center gap-2 text-xs text-muted">
                  <FaCalendarAlt />
                  <span>Dernière mise à jour le {updatedDate}</span>
                </div>
              )}
            </header>

            {/* Content area */}
            <div className="prose prose-invert max-w-none text-muted leading-relaxed whitespace-pre-wrap font-sans text-base sm:text-lg">
              {page.contentMarkdown || 'Aucun contenu pour le moment.'}
            </div>
          </article>
        </div>
      </section>

      <Footer initialData={content?.profile} />
    </main>
  )
}
