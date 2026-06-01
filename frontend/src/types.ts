import type { Variants } from 'framer-motion'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface PersonalityTheme {
  gradient: string
  surface: string
  border: string
  primary: string
  secondary: string
  text: string
  textMuted: string
  userBubble: string
  aiBubble: string
  input: string
  inputBorder: string
  buttonGradient: string
  buttonText: string
  fontFamily: string
  glowColor: string
  sidebarBg: string
}

export interface PersonalityConfig {
  id: string
  category: 'personality' | 'role'
  name: string
  avatar: string
  tagline: string
  bgClass: string
  welcomeMessage: string
  theme: PersonalityTheme
  msgVariants: Variants
  userMsgVariants: Variants
}
