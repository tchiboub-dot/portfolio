'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAccess() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('portfolio:admin-login', show)
    return () => window.removeEventListener('portfolio:admin-login', show)
  }, [])

  if (!open) return null

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Invalid credentials.')
      router.push('/admin')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setBusy(false)
    }
  }

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="admin-login-title"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-blue-400/30 bg-slate-950 p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="admin-login-title" className="text-2xl font-bold text-white">Private access</h2><p className="mt-1 text-sm text-slate-400">Sign in to manage portfolio content.</p></div><button type="button" onClick={() => setOpen(false)} className="text-2xl text-slate-400 hover:text-white" aria-label="Close">×</button></div><label className="mb-4 block text-sm text-slate-300">Email<input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400" /></label><label className="mb-4 block text-sm text-slate-300">Password<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-400" /></label>{error && <p className="mb-4 text-sm text-red-300" role="alert">{error}</p>}<button disabled={busy} className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy ? 'Signing in...' : 'Sign in'}</button></form></div>
}
