import React, { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PERSONALITIES } from './personalities'

const PERSONALITY_LIST = PERSONALITIES.filter(p => p.category === 'personality')
const ROLE_LIST = PERSONALITIES.filter(p => p.category === 'role')

// ── SVG Doodle Icons ──────────────────────────────────────────────────────────

function DoodleRobot({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="11" y="20" width="42" height="32" rx="6" />
      <circle cx="23" cy="33" r="5" />
      <circle cx="41" cy="33" r="5" />
      <circle cx="23" cy="33" r="2" fill={color} />
      <circle cx="41" cy="33" r="2" fill={color} />
      <path d="M21 43 h6 M37 43 h6" />
      <path d="M32 20 v-9" />
      <circle cx="32" cy="8" r="3.5" />
      <path d="M11 34 L5 38 M53 34 L59 38" />
    </svg>
  )
}

function DoodleWolf({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 48 Q10 24 32 20 Q54 24 54 48" />
      <path d="M10 34 L5 12 L20 27" />
      <path d="M54 34 L59 12 L44 27" />
      <circle cx="22" cy="35" r="3.5" />
      <circle cx="42" cy="35" r="3.5" />
      <ellipse cx="32" cy="43" rx="5" ry="3" />
      <path d="M27 43 Q32 49 37 43" />
      <path d="M22 35 l-2-2 M42 35 l2-2" />
    </svg>
  )
}

function DoodleCrown({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 48 L8 28 L20 40 L32 16 L44 40 L56 28 L56 48 Z" />
      <path d="M8 48 h48" />
      <circle cx="8" cy="28" r="3" fill={color} />
      <circle cx="32" cy="16" r="3" fill={color} />
      <circle cx="56" cy="28" r="3" fill={color} />
      <path d="M18 48 v-6 M32 48 v-6 M46 48 v-6" />
    </svg>
  )
}

function DoodleBrain({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 54 Q14 54 10 42 Q6 32 14 26 Q12 14 22 14 Q26 8 32 10 Q38 8 42 14 Q52 14 50 26 Q58 32 54 42 Q50 54 32 54 Z" />
      <path d="M32 10 v44" strokeDasharray="3 4" />
      <path d="M18 22 Q22 26 18 30 Q22 34 18 38" />
      <path d="M46 22 Q42 26 46 30 Q42 34 46 38" />
      <path d="M22 46 Q27 42 32 44 Q37 42 42 46" />
    </svg>
  )
}

function DoodleHeadphones({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 38 Q12 16 32 14 Q52 16 52 38" />
      <rect x="6" y="34" width="12" height="18" rx="5" />
      <rect x="46" y="34" width="12" height="18" rx="5" />
      <path d="M32 50 Q32 58 28 58 h-4" />
      <circle cx="12" cy="42" r="3" fill={color} />
      <circle cx="52" cy="42" r="3" fill={color} />
    </svg>
  )
}

function DoodleMushroom({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 36 Q8 34 8 24 Q8 10 32 10 Q56 10 56 24 Q56 34 44 36 Z" />
      <path d="M22 36 Q22 52 24 56 h16 Q42 52 42 36" />
      <circle cx="22" cy="24" r="5" fill={color} />
      <circle cx="40" cy="18" r="4" fill={color} />
      <circle cx="42" cy="29" r="3.5" fill={color} />
      <path d="M26 46 Q32 44 38 46" />
    </svg>
  )
}

function DoodleAnchor({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="14" r="6" />
      <path d="M32 20 v34" />
      <path d="M16 28 h32" />
      <path d="M16 54 Q12 46 16 42 Q20 38 24 42" />
      <path d="M48 54 Q52 46 48 42 Q44 38 40 42" />
      <path d="M16 54 h32" />
    </svg>
  )
}

function DoodleLeaf({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 56 Q10 40 12 20 Q20 8 32 8 Q44 8 52 20 Q54 40 32 56 Z" />
      <path d="M32 56 Q32 36 32 8" />
      <path d="M32 44 Q22 38 18 30" />
      <path d="M32 34 Q42 28 46 20" />
      <path d="M32 52 Q28 56 24 58" />
    </svg>
  )
}

function DoodleCrystalBall({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="28" r="20" />
      <path d="M22 54 h20" />
      <path d="M26 44 Q28 48 32 50 Q36 48 38 44" />
      <path d="M32 18 l3 6 l6 1 l-4 5 l1 6 l-6-3 l-6 3 l1-6 l-4-5 l6-1 z" />
      <path d="M18 22 Q14 16 18 12" />
      <path d="M46 22 Q50 16 46 12" />
    </svg>
  )
}

function DoodleBook({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 56 L8 46 L8 12 L32 22 Z" />
      <path d="M32 56 L56 46 L56 12 L32 22 Z" />
      <path d="M32 22 v34" />
      <path d="M14 24 Q20 26 26 24" />
      <path d="M14 32 Q20 34 26 32" />
      <path d="M14 40 Q20 42 26 40" />
      <path d="M38 24 Q44 26 50 24" />
      <path d="M38 32 Q44 34 50 32" />
      <path d="M38 40 Q44 42 50 40" />
    </svg>
  )
}

function DoodleCompass({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="24" />
      <path d="M32 12 L36 26 L32 24 L28 26 Z" fill={color} />
      <path d="M32 52 L28 38 L32 40 L36 38 Z" />
      <path d="M32 8 v8 M32 48 v8 M8 32 h8 M48 32 h8" />
      <circle cx="32" cy="32" r="3" fill={color} />
    </svg>
  )
}

function DoodleFlexArm({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 52 Q10 44 18 40 Q22 38 24 32 Q26 24 32 20 Q42 16 48 22 Q56 30 48 38 Q44 42 38 42 Q32 44 28 50 Q24 56 18 56 Q10 56 10 52 Z" />
      <path d="M26 32 Q30 28 36 30" />
      <path d="M42 24 Q50 22 52 28" />
    </svg>
  )
}

// ── Pure decorative elements ──────────────────────────────────────────────────

function DoodleStar({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4 l4 11 h12 l-10 7 4 11 -10-7 -10 7 4-11 -10-7 h12 z" />
    </svg>
  )
}

function DoodleSpiral({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 20 Q20 14 26 14 Q32 14 32 20 Q32 28 22 28 Q12 28 12 18 Q12 8 24 8 Q36 8 36 20" />
    </svg>
  )
}

function DoodleLightning({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4 L8 26 h10 L12 44 L28 18 h-10 Z" />
    </svg>
  )
}

function DoodleHeart({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 36" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 32 Q4 22 4 12 Q4 4 12 4 Q16 4 20 10 Q24 4 28 4 Q36 4 36 12 Q36 22 20 32 Z" />
    </svg>
  )
}

function DoodleCloud({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 36" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M10 30 Q4 30 4 22 Q4 14 12 14 Q12 8 20 8 Q26 6 30 12 Q34 8 40 10 Q48 10 48 18 Q54 18 54 24 Q54 30 46 30 Z" />
    </svg>
  )
}

// ── Floating doodle item ──────────────────────────────────────────────────────

interface FloatProps {
  children: React.ReactNode
  x: string
  y: string
  rotate?: number
  delay?: number
  amplitude?: number
  duration?: number
}

function FloatingDoodle({ children, x, y, rotate = 0, delay = 0, amplitude = 12, duration = 5 }: FloatProps) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y }}
      animate={{
        y: [0, -amplitude, 0, amplitude * 0.6, 0],
        rotate: [rotate, rotate + 4, rotate, rotate - 3, rotate],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Landing page ──────────────────────────────────────────────────────────────

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: '#fdfcf8',
        backgroundImage: 'radial-gradient(circle, rgba(80,60,160,0.12) 1.2px, transparent 1.2px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* Floating doodle icons */}
      <FloatingDoodle x="4%" y="8%" rotate={-18} delay={0} amplitude={14} duration={5.2}>
        <DoodleRobot color="#5a4a30" size={72} />
      </FloatingDoodle>

      <FloatingDoodle x="80%" y="6%" rotate={12} delay={0.7} amplitude={10} duration={4.8}>
        <DoodleWolf color="#4040a0" size={66} />
      </FloatingDoodle>

      <FloatingDoodle x="88%" y="38%" rotate={8} delay={1.1} amplitude={16} duration={6.0}>
        <DoodleCrown color="#9a6e00" size={60} />
      </FloatingDoodle>

      <FloatingDoodle x="82%" y="68%" rotate={-10} delay={0.3} amplitude={12} duration={5.5}>
        <DoodleBrain color="#aa00aa" size={68} />
      </FloatingDoodle>

      <FloatingDoodle x="1%" y="55%" rotate={-6} delay={1.4} amplitude={14} duration={4.6}>
        <DoodleHeadphones color="#5c30b8" size={70} />
      </FloatingDoodle>

      <FloatingDoodle x="5%" y="78%" rotate={14} delay={0.5} amplitude={10} duration={5.8}>
        <DoodleMushroom color="#cc1a10" size={64} />
      </FloatingDoodle>

      <FloatingDoodle x="72%" y="82%" rotate={-12} delay={1.8} amplitude={13} duration={5.1}>
        <DoodleAnchor color="#b81e0e" size={58} />
      </FloatingDoodle>

      <FloatingDoodle x="14%" y="82%" rotate={6} delay={0.9} amplitude={11} duration={6.2}>
        <DoodleLeaf color="#2a8010" size={62} />
      </FloatingDoodle>

      <FloatingDoodle x="90%" y="15%" rotate={20} delay={2.0} amplitude={9} duration={4.4}>
        <DoodleCrystalBall color="#aa1400" size={54} />
      </FloatingDoodle>

      <FloatingDoodle x="0%" y="28%" rotate={-8} delay={1.6} amplitude={15} duration={5.4}>
        <DoodleBook color="#1a55cc" size={64} />
      </FloatingDoodle>

      <FloatingDoodle x="74%" y="28%" rotate={15} delay={0.4} amplitude={11} duration={5.0}>
        <DoodleCompass color="#0068aa" size={58} />
      </FloatingDoodle>

      <FloatingDoodle x="20%" y="6%" rotate={-20} delay={1.2} amplitude={13} duration={4.9}>
        <DoodleFlexArm color="#9a6e00" size={64} />
      </FloatingDoodle>

      {/* Decorative scattered elements */}
      <FloatingDoodle x="38%" y="5%" rotate={10} delay={0.6} amplitude={8} duration={3.8}>
        <DoodleStar color="#c0186e" size={30} />
      </FloatingDoodle>

      <FloatingDoodle x="60%" y="88%" rotate={-15} delay={1.0} amplitude={7} duration={4.2}>
        <DoodleStar color="#5c30b8" size={24} />
      </FloatingDoodle>

      <FloatingDoodle x="55%" y="10%" rotate={5} delay={2.2} amplitude={9} duration={4.6}>
        <DoodleSpiral color="#2a8010" size={34} />
      </FloatingDoodle>

      <FloatingDoodle x="48%" y="82%" rotate={-8} delay={1.5} amplitude={8} duration={3.6}>
        <DoodleLightning color="#9a6e00" size={26} />
      </FloatingDoodle>

      <FloatingDoodle x="32%" y="88%" rotate={12} delay={0.8} amplitude={7} duration={5.6}>
        <DoodleHeart color="#c0186e" size={28} />
      </FloatingDoodle>

      <FloatingDoodle x="62%" y="4%" rotate={-5} delay={1.9} amplitude={6} duration={4.0}>
        <DoodleCloud color="#0068aa" size={40} />
      </FloatingDoodle>

      <FloatingDoodle x="3%" y="44%" rotate={18} delay={2.4} amplitude={10} duration={5.3}>
        <DoodleStar color="#aa1400" size={22} />
      </FloatingDoodle>

      {/* Center vignette to keep text area clean */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(253,252,248,0.92) 40%, transparent 100%)',
        }}
      />

      {/* ── UI layer ── */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center justify-between px-8 pt-7 flex-shrink-0"
        >
          <p
            className="text-xs tracking-[0.38em] uppercase font-bold select-none"
            style={{ color: 'rgba(80,50,160,0.7)', fontFamily: 'Inter, system-ui' }}
          >
            Persona
          </p>
          <div className="flex items-center gap-2.5">
            {PERSONALITY_LIST.slice(0, 6).map((p, i) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 0.9, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ delay: 0.5 + i * 0.07, type: 'spring', stiffness: 380, damping: 18 }}
                className="text-xl cursor-default leading-none"
                title={p.name}
              >
                {p.avatar}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-xs ml-0.5 font-medium"
              style={{ color: 'rgba(80,50,160,0.55)', fontFamily: 'Inter, system-ui' }}
            >
              +{PERSONALITY_LIST.length - 6}
            </motion.span>
          </div>
        </motion.header>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.42em' }}
            transition={{ duration: 1.1, delay: 0.65 }}
            className="text-xs font-bold uppercase mb-6"
            style={{ color: 'rgba(70,40,150,0.75)', fontFamily: 'Inter, system-ui' }}
          >
            Chatbot IA génératif
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold leading-[0.98] tracking-tighter select-none"
            style={{
              fontSize: 'clamp(3.4rem, 9vw, 7.5rem)',
              color: '#1a0840',
              fontFamily: 'Inter, system-ui',
            }}
          >
            Choisis ton
            <br />
            {/* Doodle underline via SVG */}
            <span className="relative inline-block">
              <span
                style={{
                  background: 'linear-gradient(128deg, #a060ff 0%, #ff60b0 52%, #60d8ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Persona.
              </span>
              {/* Hand-drawn underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                fill="none"
                stroke="#a060ff"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="M4 8 Q40 4 80 8 Q130 13 180 7 Q230 2 296 8" opacity="0.5" />
                <path d="M8 11 Q60 8 120 11 Q190 14 292 10" opacity="0.3" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.05 }}
            className="mt-8 text-base leading-relaxed max-w-xs"
            style={{ color: 'rgba(40,20,100,0.65)', fontFamily: 'Inter, system-ui' }}
          >
            {PERSONALITY_LIST.length} styles · {ROLE_LIST.length} rôles agents
            <br />
            Une IA qui parle comme toi — ou comme personne d'autre.
          </motion.p>

          {/* CTA button — doodle double-border style */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 relative"
          >
            {/* Offset shadow border (doodle feel) */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                transform: 'translate(4px, 4px)',
                background: '#1a0840',
                borderRadius: '16px',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.04, x: -1, y: -1 }}
              whileTap={{ scale: 0.97, x: 2, y: 2 }}
              onClick={onEnter}
              className="relative px-11 py-4 rounded-2xl text-sm font-bold cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #6820c0 0%, #c0186e 100%)',
                color: '#ffffff',
                fontFamily: 'Inter, system-ui',
                letterSpacing: '0.04em',
                border: '2px solid #1a0840',
              }}
            >
              Entrer dans le chat →
            </motion.button>
          </motion.div>

          {/* Bouncing arrow cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2.5, delay: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-8"
          >
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="rgba(104,32,192,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4 v18" />
              <path d="M5 16 L12 24 L19 16" />
            </svg>
          </motion.div>
        </div>

        {/* Bottom personality strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.55 }}
          className="pb-6 px-5 flex items-center justify-center gap-2 flex-wrap max-w-3xl mx-auto flex-shrink-0"
        >
          {PERSONALITY_LIST.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ delay: 1.65 + i * 0.045, duration: 0.35 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-default"
              style={{
                background: `${p.theme.primary}15`,
                border: `1.5px solid ${p.theme.primary}40`,
              }}
            >
              <span className="text-sm leading-none">{p.avatar}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: p.theme.primary, fontFamily: 'Inter, system-ui' }}
              >
                {p.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
