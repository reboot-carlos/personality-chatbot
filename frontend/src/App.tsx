import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage, PersonalityConfig } from './types'
import { PERSONALITIES } from './personalities'

// ── Constants ─────────────────────────────────────────────────────────────────

const PERSONALITY_LIST = PERSONALITIES.filter(p => p.category === 'personality')
const ROLE_LIST = PERSONALITIES.filter(p => p.category === 'role')
const UI_FONT = 'Inter, system-ui, -apple-system, sans-serif'

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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
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
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 self-end"
        style={{
          background: isUser ? theme.userBubble : theme.aiBubble,
          border: `1px solid ${isUser ? theme.primary + '55' : theme.border}`,
        }}
      >
        {isUser ? '🧑' : personality.avatar}
      </div>

      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
        style={{
          background: isUser ? theme.userBubble : theme.aiBubble,
          border: `1px solid ${isUser ? theme.primary + '38' : theme.border}`,
          color: theme.text,
          boxShadow: isUser ? `0 0 22px ${theme.glowColor}22` : 'none',
        }}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ fontFamily: theme.fontFamily }}>
            {message.content}
          </p>
        ) : (
          <div className="text-sm leading-relaxed break-words" style={{ fontFamily: theme.fontFamily }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-bold" style={{ color: theme.primary }}>{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                h1: ({ children }) => <h1 className="text-base font-bold mb-1.5" style={{ color: theme.primary }}>{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5" style={{ color: theme.primary }}>{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-1" style={{ color: theme.primary }}>{children}</h3>,
                code: ({ className, children, ...props }: any) => {
                  const isBlock = !!className
                  return isBlock ? (
                    <pre className="rounded-lg p-3 my-2 text-xs overflow-x-auto" style={{ background: `${theme.primary}18` }}>
                      <code className={className} style={{ color: theme.text }}>{children}</code>
                    </pre>
                  ) : (
                    <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: `${theme.primary}22`, color: theme.primary }}>{children}</code>
                  )
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 pl-3 my-2 italic opacity-80" style={{ borderColor: theme.primary }}>{children}</blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: theme.primary }}>{children}</a>
                ),
                hr: () => <hr className="my-2" style={{ borderColor: theme.border }} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && isLast && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.75, repeat: Infinity }}
                style={{ color: theme.primary }}
              >
                ▊
              </motion.span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function PersonalityCard({
  p,
  isSelected,
  onSelect,
  sidebarTheme,
}: {
  p: PersonalityConfig
  isSelected: boolean
  onSelect: () => void
  sidebarTheme: PersonalityConfig['theme']
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.015, x: 2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3"
      style={{
        background: isSelected ? `${p.theme.primary}18` : 'transparent',
        border: `1px solid ${isSelected ? p.theme.primary + '55' : 'transparent'}`,
        boxShadow: isSelected ? `0 0 14px ${p.theme.glowColor}22` : 'none',
        transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
      }}
    >
      <span className="text-2xl flex-shrink-0 leading-none">{p.avatar}</span>
      <div className="min-w-0">
        <p
          className="text-sm font-semibold truncate leading-tight"
          style={{
            color: isSelected ? p.theme.primary : sidebarTheme.text,
            fontFamily: p.theme.fontFamily,
          }}
        >
          {p.name}
        </p>
        <p
          className="text-xs truncate mt-0.5 leading-tight"
          style={{ color: sidebarTheme.text, opacity: 0.65, fontFamily: UI_FONT }}
        >
          {p.tagline}
        </p>
      </div>
    </motion.button>
  )
}

function MobileCard({
  p,
  isSelected,
  onClick,
  sidebarTheme,
}: {
  p: PersonalityConfig
  isSelected: boolean
  onClick: () => void
  sidebarTheme: PersonalityConfig['theme']
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="text-left p-3 rounded-xl"
      style={{
        background: isSelected ? `${p.theme.primary}20` : sidebarTheme.surface,
        border: `1px solid ${isSelected ? p.theme.primary + '60' : sidebarTheme.border}`,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <div className="text-2xl mb-1.5 leading-none">{p.avatar}</div>
      <p
        className="text-xs font-semibold truncate leading-tight"
        style={{ color: isSelected ? p.theme.primary : sidebarTheme.text, fontFamily: p.theme.fontFamily }}
      >
        {p.name}
      </p>
      <p
        className="text-xs truncate leading-tight mt-0.5"
        style={{ color: sidebarTheme.text, opacity: 0.65, fontFamily: UI_FONT }}
      >
        {p.tagline}
      </p>
    </motion.button>
  )
}

// ── Segmented Tab Control ─────────────────────────────────────────────────────

function SegmentedTabs({
  tab,
  setTab,
  hasRole,
  theme,
}: {
  tab: 'personality' | 'role'
  setTab: (t: 'personality' | 'role') => void
  hasRole: boolean
  theme: PersonalityConfig['theme']
}) {
  return (
    <div
      className="px-3 py-2 flex-shrink-0"
      style={{ borderBottom: `1px solid ${theme.border}` }}
    >
      <div
        className="flex rounded-lg p-0.5"
        style={{ background: `${theme.primary}0a`, border: `1px solid ${theme.border}` }}
      >
        {(['personality', 'role'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative flex-1 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: tab === t ? `${theme.primary}25` : 'transparent',
              color: tab === t ? theme.primary : theme.text,
              opacity: tab === t ? 1 : 0.65,
              fontFamily: UI_FONT,
              transition: 'background 0.15s, color 0.15s, opacity 0.15s',
            }}
          >
            {t === 'personality' ? 'Personnalités' : 'Rôles'}
            {t === 'role' && hasRole && (
              <span
                className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: theme.primary }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [personality, setPersonality] = useState<PersonalityConfig>(PERSONALITY_LIST[0])
  const [activeRole, setActiveRole] = useState<PersonalityConfig | null>(null)
  const [sidebarTab, setSidebarTab] = useState<'personality' | 'role'>('personality')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [showMobileSelector, setShowMobileSelector] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMessages([{ id: genId(), role: 'assistant', content: PERSONALITY_LIST[0].welcomeMessage }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const selectPersonality = useCallback((p: PersonalityConfig) => {
    setPersonality(p)
    setMessages(prev => {
      const welcome = prev.length > 0 && activeRole ? activeRole.welcomeMessage : p.welcomeMessage
      return [{ id: genId(), role: 'assistant', content: welcome }]
    })
    setShowMobileSelector(false)
    setIsStreaming(false)
    setIsThinking(false)
  }, [activeRole])

  const selectRole = useCallback((r: PersonalityConfig) => {
    setActiveRole(prev => {
      const next = prev?.id === r.id ? null : r
      setMessages([{
        id: genId(),
        role: 'assistant',
        content: next ? r.welcomeMessage : personality.welcomeMessage,
      }])
      return next
    })
    setShowMobileSelector(false)
    setIsStreaming(false)
    setIsThinking(false)
  }, [personality])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
  }

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return

    const userContent = input.trim()
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

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
          ...(activeRole ? { role: activeRole.id } : {}),
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
                setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: `⚠ ${parsed.error}` }])
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
  }, [input, isStreaming, messages, personality, activeRole])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () =>
    setMessages([{
      id: genId(),
      role: 'assistant',
      content: activeRole ? activeRole.welcomeMessage : personality.welcomeMessage,
    }])

  const { theme } = personality

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: UI_FONT, color: theme.text }}
    >
      {/* ── Animated Background ── */}
      <AnimatePresence mode="sync">
        <AnimatedBackground key={personality.id} personality={personality} />
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0"
        style={{ background: theme.sidebarBg, borderRight: `1px solid ${theme.border}` }}
      >
        {/* Brand + active combo */}
        <div className="px-4 pt-5 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: theme.textMuted, fontFamily: UI_FONT, letterSpacing: '0.12em' }}
          >
            Persona
          </p>

          <AnimatePresence mode="wait" initial={false}>
            {activeRole ? (
              <motion.div
                key="combo"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
                style={{ background: `${theme.primary}12`, border: `1px solid ${theme.primary}25` }}
              >
                <span className="text-base leading-none flex-shrink-0">{activeRole.avatar}</span>
                <span className="text-xs leading-none" style={{ color: theme.textMuted }}>+</span>
                <span className="text-base leading-none flex-shrink-0">{personality.avatar}</span>
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: theme.primary, fontFamily: UI_FONT }}
                  >
                    {activeRole.name}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: theme.textMuted, fontFamily: UI_FONT }}
                  >
                    {personality.name}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="count"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-xs"
                style={{ color: theme.textMuted, fontFamily: UI_FONT }}
              >
                {PERSONALITY_LIST.length} styles · {ROLE_LIST.length} rôles
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Segmented tabs */}
        <SegmentedTabs
          tab={sidebarTab}
          setTab={setSidebarTab}
          hasRole={!!activeRole}
          theme={theme}
        />

        {/* Tab content with slide animation */}
        <div
          className="flex-1 overflow-y-auto p-2.5 custom-scroll"
          style={{ '--scroll-color': theme.primary } as React.CSSProperties}
        >
          <AnimatePresence mode="wait" initial={false}>
            {sidebarTab === 'personality' ? (
              <motion.div
                key="personalities"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="space-y-0.5"
              >
                {PERSONALITY_LIST.map(p => (
                  <PersonalityCard
                    key={p.id}
                    p={p}
                    isSelected={p.id === personality.id}
                    onSelect={() => selectPersonality(p)}
                    sidebarTheme={theme}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="roles"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="space-y-0.5"
              >
                <p
                  className="text-xs px-1 pt-1 pb-2.5 leading-relaxed"
                  style={{ color: theme.textMuted, fontFamily: UI_FONT }}
                >
                  Sélectionne un rôle agent — il se combine avec le style actif. Clique à nouveau pour le désactiver.
                </p>
                {ROLE_LIST.map(r => (
                  <PersonalityCard
                    key={r.id}
                    p={r}
                    isSelected={r.id === activeRole?.id}
                    onSelect={() => selectRole(r)}
                    sidebarTheme={theme}
                  />
                ))}

                <AnimatePresence>
                  {activeRole && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="mt-2 p-2.5 rounded-xl"
                      style={{ background: `${theme.primary}0a`, border: `1px solid ${theme.border}` }}
                    >
                      <p
                        className="text-xs mb-2"
                        style={{ color: theme.textMuted, fontFamily: UI_FONT }}
                      >
                        Style actif
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl leading-none">{personality.avatar}</span>
                        <p
                          className="text-xs font-medium"
                          style={{ color: theme.primary, fontFamily: UI_FONT }}
                        >
                          {personality.name}
                        </p>
                      </div>
                      <button
                        onClick={() => setSidebarTab('personality')}
                        className="text-xs w-full text-center py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
                        style={{
                          color: theme.primary,
                          background: `${theme.primary}16`,
                          fontFamily: UI_FONT,
                        }}
                      >
                        Changer de style
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <header
          className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
          style={{ background: theme.surface, borderColor: theme.border }}
        >
          {/* Mobile tap target */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden leading-none flex items-center gap-1"
            onClick={() => setShowMobileSelector(true)}
            aria-label="Change character"
          >
            {activeRole ? (
              <>
                <span className="text-xl">{activeRole.avatar}</span>
                <span className="text-xs opacity-50">+</span>
                <span className="text-xl">{personality.avatar}</span>
              </>
            ) : (
              <span className="text-2xl">{personality.avatar}</span>
            )}
          </motion.button>

          {/* Desktop avatar */}
          <div className="hidden lg:flex items-center gap-1.5 leading-none flex-shrink-0">
            {activeRole ? (
              <>
                <span className="text-xl">{activeRole.avatar}</span>
                <span className="text-xs opacity-40">+</span>
                <span className="text-xl">{personality.avatar}</span>
              </>
            ) : (
              <span className="text-2xl">{personality.avatar}</span>
            )}
          </div>

          {/* Name + tagline — animated on switch */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeRole?.id ?? 'none'}-${personality.id}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <h2
                  className="text-sm font-semibold truncate leading-tight"
                  style={{ color: theme.primary, fontFamily: UI_FONT }}
                >
                  {activeRole ? activeRole.name : personality.name}
                </h2>
                <p
                  className="text-xs truncate leading-tight mt-0.5"
                  style={{ color: theme.textMuted, fontFamily: UI_FONT }}
                >
                  {activeRole
                    ? `${activeRole.tagline} · ${personality.name}`
                    : personality.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={clearChat}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{
              border: `1px solid ${theme.border}`,
              color: theme.textMuted,
              background: 'transparent',
              fontFamily: UI_FONT,
            }}
          >
            Clear
          </button>

          <button
            className="lg:hidden text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{
              background: `${theme.primary}1a`,
              border: `1px solid ${theme.primary}44`,
              color: theme.primary,
              fontFamily: UI_FONT,
            }}
            onClick={() => setShowMobileSelector(true)}
          >
            {activeRole ? 'Agent ·' : 'Choisir'}
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

          <AnimatePresence>
            {isThinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-3 mb-4"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: theme.aiBubble, border: `1px solid ${theme.border}` }}
                >
                  {activeRole ? activeRole.avatar : personality.avatar}
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

        {/* Input */}
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
              placeholder={`Message ${activeRole ? activeRole.name : personality.name}…`}
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none"
              style={{
                background: theme.input,
                border: `1px solid ${theme.inputBorder}`,
                color: theme.text,
                fontFamily: theme.fontFamily,
                caretColor: theme.primary,
                minHeight: '48px',
                maxHeight: '128px',
                opacity: isStreaming ? 0.65 : 1,
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="flex-shrink-0 rounded-xl px-5 font-semibold text-sm"
              style={{
                background: theme.buttonGradient,
                color: theme.buttonText,
                opacity: isStreaming || !input.trim() ? 0.38 : 1,
                minHeight: '48px',
                boxShadow: `0 0 20px ${theme.glowColor}30`,
                cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
                fontFamily: UI_FONT,
                transition: 'opacity 0.2s',
              }}
            >
              {isStreaming ? '…' : 'Envoyer'}
            </motion.button>
          </div>
          <p
            className="text-center text-xs mt-2 opacity-30"
            style={{ color: theme.textMuted, fontFamily: UI_FONT }}
          >
            Entrée pour envoyer · Maj+Entrée pour un saut de ligne
          </p>
        </div>
      </div>

      {/* ── Mobile Selector ── */}
      <AnimatePresence>
        {showMobileSelector && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/55 lg:hidden"
              onClick={() => setShowMobileSelector(false)}
            />

            <motion.div
              key="drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl lg:hidden"
              style={{
                background: theme.sidebarBg,
                border: `1px solid ${theme.border}`,
                borderBottom: 'none',
                maxHeight: '78vh',
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-8 h-1 rounded-full" style={{ background: theme.border }} />
              </div>

              {/* Header */}
              <div
                className="flex items-center justify-between px-4 pb-2"
              >
                <p
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: theme.textMuted, fontFamily: UI_FONT }}
                >
                  {sidebarTab === 'personality' ? 'Style d\'écriture' : 'Rôle agent'}
                </p>
                <button
                  onClick={() => setShowMobileSelector(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-sm"
                  style={{ color: theme.textMuted, background: theme.surface, fontFamily: UI_FONT }}
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <SegmentedTabs
                tab={sidebarTab}
                setTab={setSidebarTab}
                hasRole={!!activeRole}
                theme={theme}
              />

              {/* Content */}
              <div
                className="overflow-y-auto custom-scroll"
                style={{
                  maxHeight: 'calc(78vh - 116px)',
                  '--scroll-color': theme.primary,
                } as React.CSSProperties}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {sidebarTab === 'personality' ? (
                    <motion.div
                      key="mob-personalities"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="p-3 grid grid-cols-2 gap-2"
                    >
                      {PERSONALITY_LIST.map(p => (
                        <MobileCard
                          key={p.id}
                          p={p}
                          isSelected={p.id === personality.id}
                          onClick={() => selectPersonality(p)}
                          sidebarTheme={theme}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mob-roles"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="p-3"
                    >
                      <p
                        className="text-xs mb-3 leading-relaxed"
                        style={{ color: theme.textMuted, fontFamily: UI_FONT }}
                      >
                        Le rôle définit le but de l'agent. Clique à nouveau pour le désactiver.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {ROLE_LIST.map(r => (
                          <MobileCard
                            key={r.id}
                            p={r}
                            isSelected={r.id === activeRole?.id}
                            onClick={() => selectRole(r)}
                            sidebarTheme={theme}
                          />
                        ))}
                      </div>
                      <AnimatePresence>
                        {activeRole && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="mt-3 p-2.5 rounded-xl flex items-center gap-3"
                            style={{ background: `${theme.primary}0a`, border: `1px solid ${theme.border}` }}
                          >
                            <span className="text-xl leading-none">{personality.avatar}</span>
                            <div className="min-w-0">
                              <p
                                className="text-xs"
                                style={{ color: theme.textMuted, fontFamily: UI_FONT }}
                              >
                                Style actif
                              </p>
                              <p
                                className="text-xs font-medium truncate"
                                style={{ color: theme.primary, fontFamily: UI_FONT }}
                              >
                                {personality.name}
                              </p>
                            </div>
                            <button
                              onClick={() => setSidebarTab('personality')}
                              className="ml-auto text-xs py-1 px-2.5 rounded-lg flex-shrink-0"
                              style={{
                                color: theme.primary,
                                background: `${theme.primary}18`,
                                fontFamily: UI_FONT,
                              }}
                            >
                              Changer
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
