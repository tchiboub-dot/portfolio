'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Bot, Send, X } from 'lucide-react'

const QUICK_ACTIONS = [
  { label: 'Projects', command: 'go to projects' },
  { label: 'Skills', command: 'go to skills' },
  { label: 'Certificates', command: 'go to certificates' },
  { label: 'Contact', command: 'go to contact' },
  { label: 'About', command: 'go to about' },
]

export default function AssistantPanel({
  isOpen,
  messages,
  input,
  setInput,
  onSend,
  onClose,
  onQuickAction,
  locale,
  panelRef,
  inputRef,
  listRef,
}) {
  const isFr = useMemo(() => (locale || '').toLowerCase().startsWith('fr'), [locale])
  const title = 'T.A.C Assistant'

  useEffect(() => {
    if (!isOpen || !panelRef.current) return

    const panel = panelRef.current
    const focusable = panel.querySelectorAll(
      'button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || focusable.length === 0) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener('keydown', handleKeyDown)
    return () => panel.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, panelRef])

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
  }, [isOpen, inputRef])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, listRef])

  const submit = (event) => {
    event.preventDefault()
    onSend(input)
  }

  return (
    <div
      id="tac-assistant-panel"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="tac-assistant-panel"
    >
      <div className="tac-assistant-panel__header">
        <div className="tac-assistant-title-wrap">
          <p className="tac-assistant-title">{title}</p>
          <p className="tac-assistant-status">
            <span className="tac-assistant-status-dot" aria-hidden="true" />
            {isFr ? 'En ligne' : 'Online'}
          </p>
        </div>
        <button
          type="button"
          className="tac-assistant-close"
          onClick={onClose}
          aria-label={isFr ? 'Fermer le chat' : 'Close chat'}
        >
          <X size={18} />
        </button>
      </div>

      <div className="tac-assistant-messages" ref={listRef} aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`tac-assistant-message ${message.role === 'user' ? 'is-user' : 'is-assistant'}`}
          >
            {message.role === 'assistant' && (
              <span className="tac-assistant-avatar" aria-hidden="true">
                <Bot size={14} />
              </span>
            )}
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <div className="tac-assistant-chips" aria-label={isFr ? 'Actions rapides' : 'Quick actions'}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className="tac-assistant-chip"
            onClick={() => onQuickAction(action.command)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <form className="tac-assistant-form" onSubmit={submit}>
        <label htmlFor="tac-assistant-input" className="sr-only">
          {isFr ? 'Message pour assistant' : 'Assistant message'}
        </label>
        <input
          id="tac-assistant-input"
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            isFr
              ? "Demande mes projets, skills... ou tape: 'go to projects'"
              : "Ask about my projects, skills... or type: 'go to projects'"
          }
          maxLength={600}
        />
        <button type="submit" aria-label={isFr ? 'Envoyer' : 'Send'}>
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
