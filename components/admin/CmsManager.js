'use client'

import { useState, useEffect } from 'react'
import {
  FaFolderOpen,
  FaUserEdit,
  FaPalette,
  FaLayerGroup,
  FaImages,
  FaFileAlt,
  FaFileExport,
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaCheck,
  FaExternalLinkAlt,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaGlobe,
} from 'react-icons/fa'

export default function CmsManager() {
  const [activeTab, setActiveTab] = useState('projects') // 'projects' | 'profile' | 'design' | 'sections' | 'media' | 'pages' | 'export'
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  // Data states
  const [cmsData, setCmsData] = useState(null)

  // Edit states
  const [editingProject, setEditingProject] = useState(null)
  const [profileForm, setProfileForm] = useState({})
  const [themeForm, setThemeForm] = useState({})
  const [sectionsList, setSectionsList] = useState([])
  const [editingPage, setEditingPage] = useState(null)

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000)
  }

  const fetchCmsData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/cms/data')
      if (res.ok) {
        const json = await res.json()
        const data = json.data
        setCmsData(data)
        if (data?.profile) setProfileForm(data.profile)
        if (data?.theme) setThemeForm(data.theme)
        if (data?.sections) setSectionsList(data.sections)
      } else {
        showFeedback('error', 'Erreur chargement données CMS')
      }
    } catch {
      showFeedback('error', 'Erreur réseau lors de la récupération des données')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCmsData()
  }, [])

  const safeJson = async (res) => {
    try {
      return await res.json()
    } catch {
      return { success: false, message: `Erreur serveur (${res.status}: ${res.statusText || 'Réponse inattendue'})` }
    }
  }

  // ── Project actions ──────────────────────────────────────────────────────────
  const handleSaveProject = async (e) => {
    e.preventDefault()
    if (!editingProject?.title?.trim()) {
      showFeedback('error', 'Le titre du projet est requis')
      return
    }

    setLoading(true)
    try {
      const isNew = !editingProject.id || editingProject.id.startsWith('new-')
      const url = isNew ? '/api/admin/cms/projects' : `/api/admin/cms/projects/${editingProject.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      })

      const result = await safeJson(res)
      if (res.ok && result?.success) {
        showFeedback('success', `Projet ${isNew ? 'créé' : 'mis à jour'} avec succès`)
        setEditingProject(null)
        await fetchCmsData()
      } else {
        showFeedback('error', result?.message || 'Erreur lors de la sauvegarde du projet')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Erreur de connexion serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/cms/projects/${id}`, { method: 'DELETE' })
      const result = await safeJson(res)
      if (res.ok && result?.success) {
        showFeedback('success', 'Projet supprimé')
        await fetchCmsData()
      } else {
        showFeedback('error', result?.message || 'Erreur lors de la suppression')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  // ── Profile actions ──────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/cms/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      const result = await safeJson(res)
      if (res.ok && result?.success) {
        showFeedback('success', 'Profil et biographie enregistrés avec succès !')
        await fetchCmsData()
      } else {
        showFeedback('error', result?.message || 'Erreur sauvegarde profil')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Erreur de communication avec le serveur')
    } finally {
      setLoading(false)
    }
  }

  // ── Design Studio & Theme actions ───────────────────────────────────────────
  const handleSaveTheme = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/cms/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeForm),
      })
      const result = await safeJson(res)
      if (res.ok && result?.success) {
        showFeedback('success', 'Design Studio & Thème publiés avec succès !')
        await fetchCmsData()
      } else {
        showFeedback('error', result?.message || 'Erreur sauvegarde thème')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  // ── Sections Reorder & Toggle Visibility ─────────────────────────────────────
  const moveSection = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= sectionsList.length) return
    const updated = [...sectionsList]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setSectionsList(updated)
  }

  const toggleSectionVisibility = (index) => {
    const updated = [...sectionsList]
    updated[index].isVisible = !updated[index].isVisible
    setSectionsList(updated)
  }

  const handleSaveSections = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/cms/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: sectionsList }),
      })
      const result = await safeJson(res)
      if (res.ok && result?.success) {
        showFeedback('success', 'Organisation et visibilité des sections mises à jour !')
        await fetchCmsData()
      } else {
        showFeedback('error', result?.message || 'Erreur sauvegarde sections')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  // ── Dynamic Pages Actions ────────────────────────────────────────────────────
  const handleSavePage = async (e) => {
    e.preventDefault()
    if (!editingPage?.title || !editingPage?.slug) {
      showFeedback('error', 'Titre et slug requis')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPage),
      })
      const result = await safeJson(res)
      if (res.ok && result?.success) {
        showFeedback('success', 'Page personnalisée enregistrée')
        setEditingPage(null)
        await fetchCmsData()
      } else {
        showFeedback('error', result?.message || 'Erreur sauvegarde page')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePage = async (id) => {
    if (!confirm('Supprimer cette page ?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/cms/pages/${id}`, { method: 'DELETE' })
      const result = await safeJson(res)
      if (res.ok && result?.success) {
        showFeedback('success', 'Page supprimée')
        await fetchCmsData()
      } else {
        showFeedback('error', result?.message || 'Erreur suppression page')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Erreur suppression')
    } finally {
      setLoading(false)
    }
  }


  // ── Media Upload Simulation & URL assignment ─────────────────────────────────
  const handleUploadMediaFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/cms/media/upload', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      if (res.ok && result.success) {
        showFeedback('success', `Image "${file.name}" téléversée dans la médiathèque !`)
        await fetchCmsData()
      } else {
        showFeedback('error', result.message || 'Échec du téléversement')
      }
    } catch {
      showFeedback('error', 'Erreur réseau lors de l\'upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* CMS Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-700/60 overflow-x-auto">
        <button
          type="button"
          onClick={() => { setActiveTab('projects'); setEditingProject(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'projects'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FaFolderOpen className="w-3.5 h-3.5" />
          <span>Projets ({cmsData?.projects?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('profile'); setEditingProject(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'profile'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FaUserEdit className="w-3.5 h-3.5" />
          <span>Profil & Bio</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('design'); setEditingProject(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'design'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FaPalette className="w-3.5 h-3.5 text-purple-400" />
          <span>Design Studio</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('sections'); setEditingProject(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'sections'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FaLayerGroup className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sections ({sectionsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('media'); setEditingProject(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'media'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FaImages className="w-3.5 h-3.5 text-emerald-400" />
          <span>Médiathèque</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('pages'); setEditingProject(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'pages'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FaFileAlt className="w-3.5 h-3.5 text-amber-400" />
          <span>Pages ({cmsData?.pages?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('export'); setEditingProject(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'export'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FaFileExport className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>


      {/* Toast Notification Fixe Flottante pour visibilité garantie */}
      {feedback.message && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md border animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/60 text-emerald-300 shadow-emerald-950/50'
              : 'bg-slate-900/95 border-red-500/60 text-red-300 shadow-red-950/50'
          }`}
        >
          {feedback.type === 'success' ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <FaCheck className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 text-red-400">
              <FaTimes className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="flex-1">{feedback.message}</span>
        </div>
      )}
      {/* Global feedback alert */}
      {feedback.message && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? <FaCheck /> : <FaTimes />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ── DESIGN STUDIO TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'design' && (
        <form onSubmit={handleSaveTheme} className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 max-h-[420px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <FaPalette className="text-purple-400" /> Studio de Design & Identité Visuelle
              </h4>
              <p className="text-[11px] text-slate-400">
                Personnalisez les couleurs maîtresses, les polices, les textes héro et les styles globaux.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow"
            >
              <FaSave className="w-3 h-3" />
              <span>Publier le design</span>
            </button>
          </div>

          {/* Palette de couleurs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Couleur Primaire</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeForm.primaryColor || '#38bdf8'}
                  onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                  className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={themeForm.primaryColor || '#38bdf8'}
                  onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Couleur Secondaire</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeForm.secondaryColor || '#818cf8'}
                  onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                  className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={themeForm.secondaryColor || '#818cf8'}
                  onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Couleur d&apos;Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeForm.accentColor || '#22d3ee'}
                  onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                  className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={themeForm.accentColor || '#22d3ee'}
                  onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Fond Global (Dark)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeForm.bgColor || '#030712'}
                  onChange={(e) => setThemeForm({ ...themeForm, bgColor: e.target.value })}
                  className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={themeForm.bgColor || '#030712'}
                  onChange={(e) => setThemeForm({ ...themeForm, bgColor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Typographie & Formes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Police de Caractères</label>
              <select
                value={themeForm.fontFamily || 'Inter, sans-serif'}
                onChange={(e) => setThemeForm({ ...themeForm, fontFamily: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-purple-400 outline-none"
              >
                <option value="Inter, sans-serif">Inter (Moderne & Technique)</option>
                <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Élégant SaaS)</option>
                <option value="'Space Grotesk', sans-serif">Space Grotesk (Futuriste)</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono (Ingénieur / Dev)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Rayon des Bordures (Cartes & Boutons)</label>
              <select
                value={themeForm.borderRadius || '16px'}
                onChange={(e) => setThemeForm({ ...themeForm, borderRadius: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-purple-400 outline-none"
              >
                <option value="8px">8px (Discret / Sharp)</option>
                <option value="16px">16px (Arrondi Moderne - Recommandé)</option>
                <option value="24px">24px (Très Arrondi / Fluide)</option>
                <option value="9999px">Pilule (Pill Shaped)</option>
              </select>
            </div>
          </div>

          {/* Textes d'Accroche Hero Redessinés */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Grand Titre Héro (Catchphrase)</label>
            <input
              type="text"
              value={themeForm.heroHeadline || ''}
              onChange={(e) => setThemeForm({ ...themeForm, heroHeadline: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-purple-400 outline-none"
              placeholder="Architecting Next-Gen Software & Intelligent Cloud Systems"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Sous-titre Héro (Impact)</label>
            <textarea
              rows={2}
              value={themeForm.heroSubheadline || ''}
              onChange={(e) => setThemeForm({ ...themeForm, heroSubheadline: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-purple-400 outline-none"
              placeholder="Engineering clean architectures, high-performance backends..."
            />
          </div>

          {/* CSS Personnalisé Optionnel */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Styles CSS Personnalisés Avancés (Optionnel)</label>
            <textarea
              rows={2}
              value={themeForm.customCss || ''}
              onChange={(e) => setThemeForm({ ...themeForm, customCss: e.target.value })}
              className="w-full bg-slate-950 font-mono text-[11px] border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:border-purple-400 outline-none"
              placeholder="/* Ex: .hero-skill-icon-item { filter: drop-shadow(0 0 10px rgba(56,189,248,0.5)); } */"
            />
          </div>
        </form>
      )}

      {/* ── SECTIONS MANAGER TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'sections' && (
        <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 max-h-[420px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <FaLayerGroup className="text-indigo-400" /> Gestion & Ordre des Sections
              </h4>
              <p className="text-[11px] text-slate-400">
                Réorganisez vos sections par glissement ou flèches, et masquez/affichez-les à volonté.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveSections}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white flex items-center gap-1.5 shadow"
            >
              <FaSave className="w-3 h-3" />
              <span>Enregistrer l&apos;ordre</span>
            </button>
          </div>

          <div className="space-y-2">
            {sectionsList.map((sec, idx) => (
              <div
                key={sec.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                  sec.isVisible
                    ? 'bg-slate-800/70 border-slate-700/80 text-white'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-semibold truncate">{sec.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">#{sec.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveSection(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded bg-slate-700/60 hover:bg-slate-600 disabled:opacity-30 text-slate-200"
                    title="Monter"
                  >
                    <FaArrowUp className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveSection(idx, 1)}
                    disabled={idx === sectionsList.length - 1}
                    className="p-1.5 rounded bg-slate-700/60 hover:bg-slate-600 disabled:opacity-30 text-slate-200"
                    title="Descendre"
                  >
                    <FaArrowDown className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(idx)}
                    className={`p-1.5 rounded ml-2 ${
                      sec.isVisible
                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                    }`}
                    title={sec.isVisible ? 'Masquer la section' : 'Afficher la section'}
                  >
                    {sec.isVisible ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MEDIA LIBRARY TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'media' && (
        <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 max-h-[420px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <FaImages className="text-emerald-400" /> Médiathèque & Contrôle des Photos
              </h4>
              <p className="text-[11px] text-slate-400">
                Téléversez de nouvelles photos, remplacez les miniatures de projets et gérez vos assets.
              </p>
            </div>
            <label className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 cursor-pointer shadow">
              <FaUpload className="w-3 h-3" />
              <span>Téléverser une image</span>
              <input type="file" accept="image/*" onChange={handleUploadMediaFile} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Photos du portfolio par défaut et uploadées */}
            {[
              { name: 'Photo Profil Actuelle', url: profileForm.photo || '/photo-profil.jpg' },
              { name: 'Parfume Store Preview', url: '/projects/parfume-store-preview-real.jpg' },
              { name: 'Student Management', url: '/projects/student-management-preview.png' },
              { name: 'Security Verifier', url: '/projects/security-headers-verifier-preview.png' },
              { name: 'Maison Élégance', url: '/projects/maison-elegance-preview.png' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-700/70 rounded-xl overflow-hidden group">
                <div className="h-24 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                </div>
                <div className="p-2 text-[10px]">
                  <p className="font-semibold text-slate-200 truncate">{item.name}</p>
                  <p className="text-slate-400 font-mono truncate">{item.url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DYNAMIC PAGES TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'pages' && (
        <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 max-h-[420px] overflow-y-auto pr-1">
          {!editingPage ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <FaFileAlt className="text-amber-400" /> Pages Publiques Personnalisées
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Créez de nouvelles pages autonomes (ex: /mentions-legales, /a-propos-detaille).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingPage({
                      id: `page-${Date.now()}`,
                      slug: 'nouvelle-page',
                      title: 'Nouvelle Page',
                      contentMarkdown: '# Titre\n\nContenu rédigé en markdown...',
                      isPublished: true,
                      seoTitle: '',
                      seoDescription: '',
                    })
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>Créer une page</span>
                </button>
              </div>

              <div className="space-y-2">
                {cmsData?.pages?.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{p.title}</span>
                        <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">/{p.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingPage({ ...p })}
                        className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePage(p.id)}
                        className="p-1.5 rounded text-red-400 hover:bg-red-500/20"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSavePage} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <h4 className="text-xs font-bold text-white">Édition de Page</h4>
                <button type="button" onClick={() => setEditingPage(null)} className="text-slate-400 hover:text-white text-xs">
                  <FaTimes /> Annuler
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Titre de la page</label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Slug URL (/slug)</label>
                  <input
                    type="text"
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Contenu (Markdown)</label>
                <textarea
                  rows={4}
                  value={editingPage.contentMarkdown}
                  onChange={(e) => setEditingPage({ ...editingPage, contentMarkdown: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingPage(null)} className="px-3 py-1 text-xs text-slate-400">
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5">
                  <FaSave /> Enregistrer la page
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ── PROJECTS TAB ────────────────────────────────────────────────────────── */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {!editingProject ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Liste des projets dans la base de données
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingProject({
                      id: `new-${Date.now()}`,
                      title: '',
                      category: 'Web Apps',
                      summary: '',
                      detailedDescription: '',
                      businessValue: '',
                      implementationNotes: '',
                      features: [],
                      techStack: ['React', 'Next.js'],
                      githubLink: '',
                      liveLink: '',
                      preview: '/projects/parfume-store-preview-real.jpg',
                      status: 'Published',
                      isFeatured: true,
                      isPublished: true,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/40 flex items-center gap-1.5 transition-all"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>Nouveau projet</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {cmsData?.projects?.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-slate-600 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate max-w-[200px]">
                          {project.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
                          {project.category}
                        </span>
                        {!project.isPublished && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                            Brouillon
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px] truncate mt-1">
                        {project.summary || 'Aucun résumé'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingProject({ ...project })}
                        className="px-2 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1.5 rounded-md text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        title="Supprimer"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Project Edit Form */
            <form onSubmit={handleSaveProject} className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <h4 className="text-xs font-bold text-white">
                  {editingProject.id.startsWith('new-') ? 'Créer un projet' : `Éditer: ${editingProject.title}`}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  <FaTimes /> Annuler
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Titre</label>
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={editingProject.category || 'Web Apps'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="Web Apps">Web Apps</option>
                    <option value="Tools">Tools</option>
                    <option value="AI / Cloud">AI / Cloud</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Résumé (One-liner)</label>
                <input
                  type="text"
                  value={editingProject.summary || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Description détaillée</label>
                <textarea
                  rows={2}
                  value={editingProject.detailedDescription || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, detailedDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Lien GitHub</label>
                  <input
                    type="url"
                    value={editingProject.githubLink || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubLink: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Lien Live / Démo</label>
                  <input
                    type="url"
                    value={editingProject.liveLink || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveLink: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Image aperçu (URL ou path public)</label>
                <input
                  type="text"
                  value={editingProject.preview || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, preview: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isPublished)}
                    onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Publier sur le site public</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isFeatured)}
                    onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Mettre en avant (Featured)</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white border border-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center gap-1.5 shadow"
                >
                  <FaSave className="w-3 h-3" />
                  <span>{loading ? 'Sauvegarde...' : 'Enregistrer le projet'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ── PROFILE TAB ─────────────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 max-h-[380px] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Nom complet</label>
              <input
                type="text"
                value={profileForm.name || ''}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Titre professionnel</label>
              <input
                type="text"
                value={profileForm.title || ''}
                onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Email public</label>
              <input
                type="email"
                value={profileForm.email || ''}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Disponibilité</label>
              <input
                type="text"
                value={profileForm.availability || ''}
                onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">GitHub URL</label>
              <input
                type="url"
                value={profileForm.github || ''}
                onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={profileForm.linkedin || ''}
                onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">À propos (Introduction)</label>
            <textarea
              rows={2}
              value={profileForm.aboutIntroduction || ''}
              onChange={(e) => setProfileForm({ ...profileForm, aboutIntroduction: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">À propos (Description)</label>
            <textarea
              rows={2}
              value={profileForm.aboutDescription || ''}
              onChange={(e) => setProfileForm({ ...profileForm, aboutDescription: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center gap-1.5 shadow"
            >
              <FaSave className="w-3 h-3" />
              <span>{loading ? 'Sauvegarde...' : 'Enregistrer le profil'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ── EXPORT TAB ──────────────────────────────────────────────────────────── */}
      {activeTab === 'export' && (
        <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 text-xs">
          <div>
            <h4 className="font-semibold text-white mb-1">Sauvegarde & Portabilité des données</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Téléchargez un instantané complet de votre base de données au format JSON structuré. Ce fichier comprend tous les profils, projets, compétences, thèmes, pages, révisions et journaux d&apos;audit.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => window.open('/api/admin/cms/export', '_blank')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/40 flex items-center gap-2 transition-all shadow-sm"
            >
              <FaFileExport className="w-4 h-4" />
              <span>Télécharger l&apos;instantané JSON complet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
