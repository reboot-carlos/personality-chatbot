import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatMessage, PersonalityConfig } from './types'
import { PERSONALITIES } from './personalities'

// ── Utilities ────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 10)
}

// ── Sub-components ───────────────────────────────────────────────────────────

function AnimatedBackground({ personality }: { personality: PersonalityConfig }) {
  return (
    <motion.div
      key={personality.id}
      className={personality.bgClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    />
  )
}

function TypingDots({ color }: { color: string }) {
  return (
    <div className="flex gap-1.5 items-center px-1 py-0.5">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="block w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function MessageBubble({
  message,
  personality,
  isStreaming,
  isLast,
}: {
  message: ChatMessage
  personality: PersonalityConfig
  isStreaming: boolean
  isLast: boolean
}) {
  const isUser = message.role === 'user'
  const { theme, msgVariants, userMsgVariants } = personality
  const variants = isUser ? userMsgVariants : msgVariants

  return (
    <motion.div
      layout
      variants={variants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 self-end"
        style={{
          background: isUser ? theme.userBubble : theme.aiBubble,
          border: `1px solid ${isUser ? theme.primary + '55' : theme.border}`,
        }}
      >
        {isUser ? '🧑' : personality.avatar}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
        style={{
          background: isUser ? theme.userBubble : theme.aiBubble,
          border: `1px solid ${isUser ? theme.primary + '38' : theme.border}`,
          color: theme.text,
          boxShadow: isUser ? `0 0 22px ${theme.glowColor}22` : 'none',
        }}
      >
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap break-words"
          style={{ fontFamily: theme.fontFamily }}
        >
          {message.content}
          {isStreaming && isLast && !isUser && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.75, repeat: Infinity }}
              style={{ color: theme.primary }}
            >
              ▊
            </motion.span>
          )}
        </p>
      </div>
    </motion.div>
  )
}

function PersonalityCard({
  p,
  isSelected,
  onSelect,
}: {
  p: PersonalityConfig
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors"
      style={{
        background: isSelected ? `${p.theme.primary}1E` : 'transparent',
        border: `1px solid ${isSelected ? p.theme.primary + '66' : 'transparent'}`,
        boxShadow: isSelected ? `0 0 18px ${p.theme.glowColor}28` : 'none',
      }}
    >
      <span className="text-2xl flex-shrink-0 leading-none">{p.avatar}</span>
      <div className="min-w-0">
        <p
          className="text-sm font-semibold truncate leading-tight"
          style={{
            color: isSelected ? p.theme.primary : '#d1d5db',
            fontFamily: p.theme.fontFamily,
          }}
        >
          {p.name}
        </p>
        <p className="text-xs truncate mt-0.5 leading-tight" style={{ color: '#6b7280' }}>
          {p.tagline}
        </p>
      </div>
    </motion.button>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [personality, setPersonality] = useState<PersonalityConfig>(PERSONALITIES[0])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [showMobileSelector, setShowMobileSelector] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Seed welcome message on mount
  useEffect(() => {
    setMessages([{ id: genId(), role: 'assistant', content: PERSONALITIES[0].welcomeMessage }])
  }, [])

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const switchPersonality = useCallback((p: PersonalityConfig) => {
    setPersonality(p)
    setMessages([{ id: genId(), role: 'assistant', content: p.welcomeMessage }])
    setShowMobileSelector(false)
    setIsStreaming(false)
    setIsThinking(false)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
  }

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return

    const userContent = input.trim()
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    const userMsg: ChatMessage = { id: genId(), role: 'user', content: userContent }
    const snapshot = [...messages, userMsg]
    setMessages(snapshot)
    setIsThinking(true)
    setIsStreaming(true)

    const aiId = genId()
    let seenFirst = false
    let buf = ''

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: snapshot.map(m => ({ role: m.role, content: m.content })),
          character: personality.id,
        }),
      })

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') continue

          try {
            const parsed = JSON.parse(raw) as { content?: string; error?: string }

            if (parsed.error) {
              setIsThinking(false)
              if (!seenFirst) {
                setMessages(prev => [
                  ...prev,
                  { id: aiId, role: 'assistant', content: `⚠ ${parsed.error}` },
                ])
                seenFirst = true
              }
              continue
            }

            if (!parsed.content) continue

            if (!seenFirst) {
              seenFirst = true
              setIsThinking(false)
              setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: parsed.content! }])
            } else {
              setMessages(prev =>
                prev.map(m => (m.id === aiId ? { ...m, content: m.content + parsed.content! } : m))
              )
            }
          } catch {
            // skip malformed SSE line
          }
        }
      }
    } catch {
      setIsThinking(false)
      if (!seenFirst) {
        setMessages(prev => [
          ...prev,
          {
            id: aiId,
            role: 'assistant',
            content: '⚠ Connection error — ensure ANTHROPIC_API_KEY is set and the backend is running.',
          },
        ])
      }
    } finally {
      setIsThinking(false)
      setIsStreaming(false)
    }
  }, [input, isStreaming, messages, personality])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () =>
    setMessages([{ id: genId(), role: 'assistant', content: personality.welcomeMessage }])

  const { theme } = personality

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: theme.fontFamily, color: theme.text }}
    >
      {/* ── Animated Background ── */}
      <AnimatePresence mode="wait">
        <AnimatedBackground key={personality.id} personality={personality} />
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-72 flex-shrink-0"
        style={{ background: theme.sidebarBg, borderRight: `1px solid ${theme.border}` }}
      >
        <div className="px-4 py-5 border-b flex-shrink-0" style={{ borderColor: theme.border }}>
          <h1
            className="text-base font-bold tracking-wider"
            style={{ color: theme.primary, fontFamily: theme.fontFamily }}
          >
            ✦ Personality Chat
          </h1>
          <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
            {PERSONALITIES.length} characters
          </p>
        </div>
        <div
          className="flex-1 overflow-y-auto p-3 space-y-1 custom-scroll"
          style={{ '--scroll-color': theme.primary } as React.CSSProperties}
        >
          {PERSONALITIES.map(p => (
            <PersonalityCard
              key={p.id}
              p={p}
              isSelected={p.id === personality.id}
              onSelect={() => switchPersonality(p)}
            />
          ))}
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <header
          className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
          style={{ background: theme.surface, borderColor: theme.border }}
        >
          {/* Mobile: tap avatar to open selector */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-2xl leading-none"
            onClick={() => setShowMobileSelector(true)}
            aria-label="Choose personality"
          >
            {personality.avatar}
          </motion.button>

          <span className="hidden lg:block text-2xl leading-none">{personality.avatar}</span>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold truncate leading-tight" style={{ color: theme.primary }}>
              {personality.name}
            </h2>
            <p className="text-xs truncate leading-tight mt-0.5" style={{ color: theme.textMuted }}>
              {personality.tagline}
            </p>
          </div>

          <button
            onClick={clearChat}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{
              border: `1px solid ${theme.border}`,
              color: theme.textMuted,
              background: 'transparent',
            }}
          >
            Clear
          </button>

          <button
            className="lg:hidden text-xs px-3 py-1.5 rounded-lg font-semibold"
            style={{
              background: `${theme.primary}22`,
              border: `1px solid ${theme.primary}55`,
              color: theme.primary,
            }}
            onClick={() => setShowMobileSelector(true)}
          >
            Switch
          </button>
        </header>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 min-h-0 custom-scroll"
          style={{ '--scroll-color': theme.primary } as React.CSSProperties}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                personality={personality}
                isStreaming={isStreaming}
                isLast={idx === messages.length - 1}
              />
            ))}
          </AnimatePresence>

          {/* Thinking / typing indicator */}
          <AnimatePresence>
            {isThinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: theme.aiBubble, border: `1px solid ${theme.border}` }}
                >
                  {personality.avatar}
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-2.5"
                  style={{ background: theme.aiBubble, border: `1px solid ${theme.border}` }}
                >
                  <TypingDots color={theme.primary} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div
          className="px-4 py-3 border-t flex-shrink-0"
          style={{ background: theme.surface, borderColor: theme.border }}
        >
          <div className="flex gap-2 items-end max-w-4xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${personality.name}…`}
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none transition-shadow"
              style={{
                background: theme.input,
                border: `1px solid ${theme.inputBorder}`,
                color: theme.text,
                fontFamily: theme.fontFamily,
                caretColor: theme.primary,
                minHeight: '48px',
                maxHeight: '128px',
                opacity: isStreaming ? 0.7 : 1,
              }}
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="flex-shrink-0 rounded-xl px-5 font-semibold text-sm transition-opacity"
              style={{
                background: theme.buttonGradient,
                color: theme.buttonText,
                opacity: isStreaming || !input.trim() ? 0.4 : 1,
                minHeight: '48px',
                boxShadow: `0 0 22px ${theme.glowColor}38`,
                cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {isStreaming ? '…' : 'Send'}
            </motion.button>
          </div>
          <p className="text-center text-xs mt-2 opacity-40" style={{ color: theme.textMuted }}>
            Enter to send · Shift+Enter for newline
          </p>
        </div>
      </div>

      {/* ── Mobile Personality Selector (bottom drawer) ── */}
      <AnimatePresence>
        {showMobileSelector && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setShowMobileSelector(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl lg:hidden"
              style={{
                background: theme.sidebarBg,
                border: `1px solid ${theme.border}`,
                borderBottom: 'none',
                maxHeight: '72vh',
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: theme.border }} />
              </div>

              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-4 py-2 border-b"
                style={{ borderColor: theme.border }}
              >
                <h2 className="font-bold text-sm" style={{ color: theme.primary }}>
                  Choose Personality
                </h2>
                <button
                  onClick={() => setShowMobileSelector(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-sm"
                  style={{ color: theme.textMuted, background: theme.surface }}
                >
                  ✕
                </button>
              </div>

              {/* Grid of cards */}
              <div
                className="overflow-y-auto p-3 grid grid-cols-2 gap-2 custom-scroll"
                style={{
                  maxHeight: 'calc(72vh - 80px)',
                  '--scroll-color': theme.primary,
                } as React.CSSProperties}
              >
                {PERSONALITIES.map(p => (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => switchPersonality(p)}
                    className="text-left p-3 rounded-xl"
                    style={{
                      background:
                        p.id === personality.id ? `${p.theme.primary}22` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${
                        p.id === personality.id ? p.theme.primary + '66' : 'rgba(255,255,255,0.08)'
                      }`,
                    }}
                  >
                    <div className="text-2xl mb-1 leading-none">{p.avatar}</div>
                    <p
                      className="text-xs font-semibold truncate leading-tight"
                      style={{
                        color: p.id === personality.id ? p.theme.primary : '#e5e7eb',
                        fontFamily: p.theme.fontFamily,
                      }}
                    >
                      {p.name}
                    </p>
                    <p className="text-xs truncate leading-tight mt-0.5" style={{ color: '#6b7280' }}>
                      {p.tagline}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
