'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bot, Sparkles } from 'lucide-react'
import { getNavigationAck, parseNavigationIntent } from '@/lib/assistant/navigation'

const AssistantPanel = dynamic(() => import('@/components/assistant/AssistantPanel'), {
  ssr: false,
})

let messageId = 0

function getDefaultLocale() {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

function createMessage(role, content) {
  messageId += 1
  return { id: `${role}-${messageId}`, role, content }
}

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [locale, setLocale] = useState('en')
  const [messages, setMessages] = useState(() => [
    createMessage('assistant', 'Hello! I can explain this portfolio and guide you to any section.'),
  ])

  const router = useRouter()
  const pathname = usePathname()
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const isFr = useMemo(() => locale === 'fr', [locale])

  useEffect(() => {
    setLocale(getDefaultLocale())
  }, [])

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0]?.role !== 'assistant') return prev

      const greeting = locale === 'fr'
        ? 'Bonjour ! Je peux expliquer ce portfolio et te guider vers chaque section.'
        : 'Hello! I can explain this portfolio and guide you to any section.'

      return [{ ...prev[0], content: greeting }]
    })
  }, [locale])

  const getCurrentSection = useCallback(() => {
    const known = ['home', 'about', 'education', 'experience', 'projects', 'skills', 'certificates', 'contact']
    for (const id of known) {
      const element = document.getElementById(id)
      if (!element) continue
      const rect = element.getBoundingClientRect()
      if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.2) {
        return id
      }
    }
    return ''
  }, [])

  const scrollAndHighlight = useCallback((anchorCandidates) => {
    if (!Array.isArray(anchorCandidates) || anchorCandidates.length === 0) return false

    let target = null
    for (const candidate of anchorCandidates) {
      const element = document.getElementById(candidate)
      if (element) {
        target = element
        break
      }
    }

    if (!target) return false

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    target.classList.add('section-assistant-highlight')
    window.setTimeout(() => target.classList.remove('section-assistant-highlight'), 1700)
    return true
  }, [])

  const navigateToSection = useCallback(
    async (anchorCandidates) => {
      const existingTarget = scrollAndHighlight(anchorCandidates)
      if (existingTarget) return

      const mainAnchor = anchorCandidates[0]
      if (pathname !== '/') {
        router.push(`/#${mainAnchor}`)
      }

      let attempts = 0
      const intervalId = window.setInterval(() => {
        attempts += 1
        const ok = scrollAndHighlight(anchorCandidates)
        if (ok || attempts > 40) {
          window.clearInterval(intervalId)
        }
      }, 90)
    },
    [pathname, router, scrollAndHighlight]
  )

  const sendToAssistantApi = useCallback(
    async (messageText) => {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          locale,
          context: {
            currentSection: getCurrentSection(),
            pageUrl: window.location.pathname + window.location.hash,
          },
        }),
      })

      const data = await response.json()
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Request failed')
      }

      return data.reply
    },
    [getCurrentSection, locale]
  )

  const onSend = useCallback(
    async (rawInput) => {
      const value = rawInput.trim()
      if (!value) return

      setInput('')
      setMessages((prev) => [...prev, createMessage('user', value)])

      const navIntent = parseNavigationIntent(value)
      if (navIntent) {
        await navigateToSection(navIntent.anchorCandidates)
        setMessages((prev) => [...prev, createMessage('assistant', getNavigationAck(navIntent.section, locale))])
        return
      }

      try {
        const reply = await sendToAssistantApi(value)
        setMessages((prev) => [...prev, createMessage('assistant', reply)])
      } catch {
        const fallback = isFr
          ? "Je n'arrive pas a repondre pour le moment. Tu peux reessayer ou me contacter directement."
          : "I can't reply right now. Please try again or contact me directly."

        setMessages((prev) => [...prev, createMessage('assistant', fallback)])
      }
    },
    [isFr, locale, navigateToSection, sendToAssistantApi]
  )

  const onQuickAction = useCallback(
    (command) => {
      onSend(command)
    },
    [onSend]
  )

  return (
    <div className="tac-assistant-root" aria-live="off">
      {isOpen && (
        <AssistantPanel
          isOpen={isOpen}
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={onSend}
          onClose={() => setIsOpen(false)}
          onQuickAction={onQuickAction}
          locale={locale}
          panelRef={panelRef}
          inputRef={inputRef}
          listRef={listRef}
        />
      )}

      <button
        type="button"
        className="tac-assistant-launcher"
        aria-label={isFr ? 'Ouvrir assistant IA' : 'Open AI assistant'}
        aria-expanded={isOpen}
        aria-controls="tac-assistant-panel"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="tac-assistant-launcher__halo" aria-hidden="true" />
        <span className="tac-assistant-launcher__surface">
          {isOpen ? <Sparkles size={20} /> : <Bot size={20} />}
        </span>
      </button>
    </div>
  )
}
