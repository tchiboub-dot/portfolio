'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [content, setContent] = useState(null)
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('Loading...')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content', { cache: 'no-store' }).then(async (response) => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setContent(data.content)
      setDraft(JSON.stringify(data.content, null, 2))
      setStatus('Ready')
    }).catch(() => setStatus('Unable to load content.'))
  }, [])

  const save = async () => {
    let parsed
    try { parsed = JSON.parse(draft) } catch { setStatus('Invalid JSON.'); return }
    setBusy(true)
    setStatus('Saving...')
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: parsed }) })
      if (!response.ok) throw new Error()
      setContent(parsed)
      setStatus('Changes saved.')
      window.dispatchEvent(new CustomEvent('portfolio:content-updated'))
    } catch { setStatus('Unable to save changes. Please try again.') } finally { setBusy(false) }
  }

  const logout = async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.replace('/') }

  return <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8"><div className="mx-auto max-w-7xl"><header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Private CMS</p><h1 className="text-3xl font-bold">Portfolio content</h1></div><button onClick={logout} className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-cyan-400">Log out</button></header><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.45fr)]"><section className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Content document</h2><button disabled={busy || !content} onClick={save} className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50">{busy ? 'Saving...' : 'Save changes'}</button></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck="false" className="min-h-[70vh] w-full rounded-lg border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-cyan-50 outline-none focus:border-cyan-400" /></section><aside className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="mb-3 font-semibold">Status</h2><p className="text-sm text-slate-300">{status}</p><p className="mt-6 text-sm leading-6 text-slate-400">Changes are stored in PostgreSQL and are available to the public content API after saving.</p></aside></div></div></main>
}
