import React, { useRef, useEffect, Suspense, Component, ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { PERSONALITIES } from './personalities'

const PERSONALITY_LIST = PERSONALITIES.filter(p => p.category === 'personality')
const ROLE_LIST = PERSONALITIES.filter(p => p.category === 'role')

// ── WebGL error boundary ──────────────────────────────────────────────────────

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

// ── Central morphing orb ──────────────────────────────────────────────────────

function CentralOrb() {
  const shellRef = useRef<THREE.Mesh>(null!)
  const aura1Ref = useRef<THREE.Mesh>(null!)
  const aura2Ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    shellRef.current.rotation.y = t * 0.09
    shellRef.current.rotation.z = t * 0.04
    const pulse = 1 + Math.sin(t * 0.45) * 0.025
    aura1Ref.current.scale.setScalar(pulse * 1.55)
    aura2Ref.current.scale.setScalar(pulse * 1.28)
  })

  return (
    <group>
      {/* Outer soft aura */}
      <mesh ref={aura1Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#4820b0" transparent opacity={0.055} side={THREE.BackSide} />
      </mesh>
      {/* Inner aura */}
      <mesh ref={aura2Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#7040e0" transparent opacity={0.085} side={THREE.BackSide} />
      </mesh>
      {/* Main distort orb */}
      <mesh>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial
          color="#6030d0"
          emissive="#2a0880"
          emissiveIntensity={0.55}
          distort={0.32}
          speed={1.8}
          roughness={0.12}
          metalness={0.08}
        />
      </mesh>
      {/* Spinning wireframe shell */}
      <mesh ref={shellRef} scale={1.03}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#c080ff" transparent opacity={0.05} wireframe />
      </mesh>
    </group>
  )
}

// ── Slow orbital ring ─────────────────────────────────────────────────────────

function OrbitalRing({
  radius = 2.1, color = '#7040ff', tiltX = 0.5, tiltZ = 0, phaseOffset = 0, speed = 0.1,
}: {
  radius?: number; color?: string; tiltX?: number; tiltZ?: number; phaseOffset?: number; speed?: number
}) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    ref.current.rotation.y = phaseOffset + clock.elapsedTime * speed
  })
  return (
    <group ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <mesh>
        <torusGeometry args={[radius, 0.013, 8, 160]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} transparent opacity={0.45} />
      </mesh>
    </group>
  )
}

// ── Floating wireframe fragment ───────────────────────────────────────────────

function Fragment({
  position, color, kind, size, speed,
}: {
  position: [number, number, number]
  color: string
  kind: 'ico' | 'oct' | 'torus'
  size: number
  speed: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    ref.current.rotation.x = t * 0.5
    ref.current.rotation.y = t * 0.7
  })
  return (
    <Float speed={speed * 0.8} rotationIntensity={1.2} floatIntensity={2.5}>
      <mesh ref={ref} position={position}>
        {kind === 'ico' && <icosahedronGeometry args={[size, 0]} />}
        {kind === 'oct' && <octahedronGeometry args={[size]} />}
        {kind === 'torus' && <torusGeometry args={[size, size * 0.38, 6, 14]} />}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.75}
          transparent
          opacity={0.88}
          wireframe
        />
      </mesh>
    </Float>
  )
}

// ── Mouse parallax camera ─────────────────────────────────────────────────────

function ParallaxCamera() {
  const { camera } = useThree()
  const raw = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      raw.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      raw.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    smooth.current.x += (raw.current.x - smooth.current.x) * 0.035
    smooth.current.y += (raw.current.y - smooth.current.y) * 0.035
    camera.position.x = smooth.current.x * 0.65
    camera.position.y = smooth.current.y * 0.3
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ── Three.js scene ────────────────────────────────────────────────────────────

const FRAGMENTS: Array<{
  position: [number, number, number]; color: string; kind: 'ico' | 'oct' | 'torus'; size: number; speed: number
}> = [
  { position: [-3.3, 1.3, -0.8], color: '#ff60b0', kind: 'ico',   size: 0.20, speed: 1.10 },
  { position: [ 3.1,-1.1, -0.4], color: '#60d8ff', kind: 'oct',   size: 0.17, speed: 0.90 },
  { position: [-2.3,-2.3,  0.6], color: '#ffcc00', kind: 'ico',   size: 0.15, speed: 1.40 },
  { position: [ 3.4, 2.1, -1.4], color: '#ff5050', kind: 'torus', size: 0.20, speed: 1.05 },
  { position: [-3.9, 0.1, -2.0], color: '#44ff88', kind: 'oct',   size: 0.22, speed: 0.80 },
  { position: [ 1.3, 3.3, -1.2], color: '#b060ff', kind: 'ico',   size: 0.13, speed: 1.55 },
  { position: [-1.4,-3.1,  0.2], color: '#ff8040', kind: 'torus', size: 0.17, speed: 1.25 },
  { position: [ 4.4,-0.4, -2.8], color: '#40ffcc', kind: 'oct',   size: 0.19, speed: 0.72 },
]

function Scene() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[4,  4,  4]} color="#9070ff" intensity={3.5} />
      <pointLight position={[-4,-3,  3]} color="#ff60b0" intensity={2.5} />
      <pointLight position={[0, -4, -1]} color="#60c8ff" intensity={1.8} />
      <pointLight position={[2,  3, -5]} color="#ffffff" intensity={0.6} />

      <Stars radius={90} depth={60} count={4500} factor={3} saturation={0.4} fade speed={0.7} />

      <CentralOrb />

      <OrbitalRing radius={2.05} color="#7840ff" tiltX={0.48}  tiltZ={0.06}  phaseOffset={0}             speed={0.10} />
      <OrbitalRing radius={2.45} color="#ff4090" tiltX={-0.62} tiltZ={0.28}  phaseOffset={Math.PI / 2.8} speed={0.08} />
      <OrbitalRing radius={1.72} color="#40b8ff" tiltX={1.15}  tiltZ={-0.15} phaseOffset={Math.PI}       speed={0.13} />

      {FRAGMENTS.map((f, i) => <Fragment key={i} {...f} />)}

      <ParallaxCamera />
    </>
  )
}

// ── Landing page UI ───────────────────────────────────────────────────────────

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#020209' }}>

      {/* ── WebGL canvas ── */}
      <div className="absolute inset-0">
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 54 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 20%, rgba(2,2,9,0.5) 65%, rgba(2,2,9,0.88) 100%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(2,2,9,0.98) 0%, transparent 100%)' }}
      />
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(2,2,9,0.6) 0%, transparent 100%)' }}
      />

      {/* ── UI overlay ── */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-between px-8 pt-7 flex-shrink-0"
        >
          <p
            className="text-xs tracking-[0.38em] uppercase font-medium select-none"
            style={{ color: 'rgba(190,170,255,0.45)', fontFamily: 'Inter, system-ui' }}
          >
            Persona
          </p>
          <div className="flex items-center gap-2.5">
            {PERSONALITY_LIST.slice(0, 6).map((p, i) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 0.65, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.15 }}
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
              className="text-xs ml-0.5"
              style={{ color: 'rgba(160,140,220,0.3)', fontFamily: 'Inter, system-ui' }}
            >
              +{PERSONALITY_LIST.length - 6}
            </motion.span>
          </div>
        </motion.header>

        {/* Hero content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.42em' }}
            transition={{ duration: 1.1, delay: 0.65 }}
            className="text-xs font-semibold uppercase mb-7"
            style={{ color: 'rgba(160,120,255,0.55)', fontFamily: 'Inter, system-ui' }}
          >
            Chatbot IA génératif
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold leading-[0.98] tracking-tighter text-white select-none"
            style={{
              fontSize: 'clamp(3.4rem, 9vw, 7.5rem)',
              textShadow: '0 0 100px rgba(110,70,255,0.22), 0 0 200px rgba(255,80,160,0.08)',
              fontFamily: 'Inter, system-ui',
            }}
          >
            Choisis ton
            <br />
            <span
              style={{
                background: 'linear-gradient(128deg, #a060ff 0%, #ff60b0 52%, #60d8ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 32px rgba(160,96,255,0.35))',
              }}
            >
              Persona.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.05 }}
            className="mt-7 text-base leading-relaxed max-w-xs"
            style={{ color: 'rgba(200,190,235,0.38)', fontFamily: 'Inter, system-ui' }}
          >
            {PERSONALITY_LIST.length} styles · {ROLE_LIST.length} rôles agents
            <br />
            Une IA qui parle comme toi — ou comme personne d'autre.
          </motion.p>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 28, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 56px rgba(120,80,255,0.38), 0 0 110px rgba(120,80,255,0.12)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={onEnter}
            className="mt-11 px-11 py-4 rounded-2xl text-sm font-semibold text-white transition-shadow cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(100,60,210,0.38) 0%, rgba(210,60,140,0.22) 100%)',
              border: '1px solid rgba(140,100,255,0.32)',
              backdropFilter: 'blur(18px)',
              fontFamily: 'Inter, system-ui',
              boxShadow: '0 0 32px rgba(100,60,200,0.18), inset 0 1px 0 rgba(255,255,255,0.09)',
              letterSpacing: '0.03em',
            }}
          >
            Entrer dans le chat&nbsp;&nbsp;→
          </motion.button>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            transition={{ duration: 2.8, delay: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-10 flex flex-col items-center gap-1"
          >
            <div
              className="w-px h-9"
              style={{ background: 'linear-gradient(to bottom, rgba(160,120,255,0.5), transparent)' }}
            />
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: 'rgba(160,120,255,0.4)' }}
            />
          </motion.div>
        </div>

        {/* Bottom personality strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.55 }}
          className="pb-7 px-5 flex items-center justify-center gap-2 flex-wrap max-w-3xl mx-auto flex-shrink-0"
        >
          {PERSONALITY_LIST.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.07, opacity: 1 }}
              transition={{ delay: 1.65 + i * 0.045, duration: 0.38 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-default"
              style={{
                background: `${p.theme.primary}0d`,
                border: `1px solid ${p.theme.primary}25`,
                opacity: 0.75,
              }}
            >
              <span className="text-sm leading-none">{p.avatar}</span>
              <span
                className="text-xs font-medium"
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
