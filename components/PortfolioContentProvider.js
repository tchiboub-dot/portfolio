'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const PortfolioContentContext = createContext(null)

export function usePortfolioContent() {
  return useContext(PortfolioContentContext)
}

export default function PortfolioContentProvider({ children }) {
  const [content, setContent] = useState(null)

  useEffect(() => {
    const load = () => fetch('/api/content', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).then((data) => { if (data?.content) setContent(data.content) }).catch(() => {})
    const refresh = () => load()
    load()
    window.addEventListener('portfolio:content-updated', refresh)
    return () => window.removeEventListener('portfolio:content-updated', refresh)
  }, [])

  return <PortfolioContentContext.Provider value={content}>{children}</PortfolioContentContext.Provider>
}
