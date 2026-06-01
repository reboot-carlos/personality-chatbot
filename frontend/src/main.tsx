import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import App from './App'
import LandingPage from './LandingPage'

function Root() {
  const [phase, setPhase] = useState<'landing' | 'chat'>('landing')

  return (
    <AnimatePresence mode="wait">
      {phase === 'landing' ? (
        <motion.div
          key="landing"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 1, 1] }}
          style={{ position: 'fixed', inset: 0 }}
        >
          <LandingPage onEnter={() => setPhase('chat')} />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'fixed', inset: 0 }}
        >
          <App />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
