import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility para combinar classes Tailwind de forma inteligente
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formatar valores em reais brasileiro
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formatar números grandes de forma compacta
 */
export function formatCompactNumber(value) {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

/**
 * Formatar tempo relativo (ex: "há 2 minutos")
 */
export function formatRelativeTime(date) {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now - target) / 1000)

  if (diffInSeconds < 60) {
    return 'agora mesmo'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes}min`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `há ${diffInHours}h`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `há ${diffInDays}d`
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(target)
}

/**
 * Alias para formatRelativeTime (usado nas páginas)
 */
export const formatTime = formatRelativeTime

/**
 * Formatar data completa
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * Formatar porcentagem
 */
export function formatPercentage(value) {
  return `${value.toFixed(1)}%`
}

/**
 * Get rarity level from price (usado no BoxCard)
 */
export function getRarityLevel(preco) {
  if (preco >= 100) return 'lendario'
  if (preco >= 50) return 'epico' 
  if (preco >= 25) return 'raro'
  return 'comum'
}

/**
 * Enhanced sound system with fallback
 */
export function playSound(src, volume = 1) {
  try {
    // Check if audio context is available
    if (typeof window !== 'undefined' && 'Audio' in window) {
      const audio = new Audio(src)
      audio.volume = Math.max(0, Math.min(1, volume))
      
      // Add error handling
      audio.onerror = () => {
        console.log(`🔊 Audio file not found: ${src}`)
      }
      
      // Play with user interaction check
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play was prevented, which is expected on some browsers
          console.log(`🔊 Audio autoplay prevented: ${src}`)
        })
      }
      
      return audio
    }
  } catch (error) {
    console.log(`🔊 Error playing sound ${src}:`, error.message)
  }
  
  // Fallback: console log for demo
  console.log(`🔊 Playing sound: ${src} at volume ${volume}`)
  return null
}

/**
 * Play rarity-specific sound with enhanced feedback
 */
export function playRaritySound(raridade, volume = 0.5) {
  const soundMap = {
    comum: '/sounds/reveal-comum.mp3',
    raro: '/sounds/reveal-raro.mp3',
    epico: '/sounds/reveal-epico.mp3',
    lendario: '/sounds/reveal-lendario.mp3',
    mitico: '/sounds/reveal-mitico.mp3'
  }
  
  const soundFile = soundMap[raridade] || soundMap.comum
  return playSound(soundFile, volume)
}

/**
 * Formatar probabilidade para exibição (ex: "1 em 1000")
 */
export function formatProbability(probability) {
  if (probability >= 0.01) {
    return `${(probability * 100).toFixed(1)}%`
  }
  
  const ratio = Math.round(1 / probability)
  return `1 em ${ratio.toLocaleString('pt-BR')}`
}

/**
 * Obter informações da raridade
 */
export function getRaridadeInfo(raridade) {
  const raridades = {
    comum: {
      label: 'Comum',
      color: '#10B981',
      emoji: '🔹',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/30',
    },
    raro: {
      label: 'Raro',
      color: '#8B5CF6',
      emoji: '💎',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
    },
    epico: {
      label: 'Épico',
      color: '#2563EB',
      emoji: '⭐',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
    },
    lendario: {
      label: 'Lendário',
      color: '#F59E0B',
      emoji: '👑',
      bgColor: 'bg-gold-primary/20',
      textColor: 'text-gold-primary',
      borderColor: 'border-gold-primary/30',
    },
  }

  return raridades[raridade] || raridades.comum
}

/**
 * Obter informações do tipo de item
 */
export function getTipoInfo(tipo) {
  const tipos = {
    fisico: {
      label: 'Produto Físico',
      icon: '📦',
      description: 'Entregue em sua casa',
      entregaImediata: false,
    },
    digital: {
      label: 'Produto Digital',
      icon: '💻',
      description: 'Código enviado por email',
      entregaImediata: true,
    },
    credito: {
      label: 'Crédito',
      icon: '💰',
      description: 'Adicionado à sua conta',
      entregaImediata: true,
    },
  }

  return tipos[tipo] || tipos.fisico
}

/**
 * Validar CPF
 */
export function validateCPF(cpf) {
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length !== 11) return false
  if (/^(\d)\1+$/.test(cleaned)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(10))) return false

  return true
}

/**
 * Formatar CPF
 */
export function formatCPF(cpf) {
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Validar telefone brasileiro
 */
export function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * Formatar telefone
 */
export function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 */
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Gerar ID único
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Copiar texto para clipboard
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }
  
  // Fallback para browsers antigos
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    console.error('Erro no fallback de cópia:', err)
    return false
  }
}

/**
 * Detectar se está rodando em PWA
 */
export function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true
}

/**
 * Detectar se é mobile
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detectar se é iOS
 */
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * Enhanced haptic feedback system - Brazilian mobile-first
 */
export function triggerHaptic(type = 'light') {
  // Native haptic API (newer browsers)
  if (navigator.vibrate) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      error: [50, 100, 50],
      notification: [20, 20, 20],
      impact: [15],
      selection: [5],
      tick: [3],
      double: [10, 10, 10]
    }
    
    const pattern = patterns[type] || patterns.light
    navigator.vibrate(pattern)
  }
  
  // Fallback for legacy systems
  if (window.triggerHaptic) {
    window.triggerHaptic(type)
  }
  
  // Console feedback for development
  console.log(`🎮 Haptic: ${type}`)
}

/**
 * Brazilian mobile-optimized toast system
 */
export function showToast(message, options = {}) {
  const {
    type = 'info',
    duration = 3000,
    position = 'bottom',
    haptic = true,
    emoji = null
  } = options
  
  // Trigger haptic based on toast type
  if (haptic) {
    const hapticMap = {
      success: 'success',
      error: 'error',
      warning: 'medium',
      info: 'light'
    }
    triggerHaptic(hapticMap[type])
  }
  
  // Create toast element
  const toast = document.createElement('div')
  toast.className = getToastClasses(type, position)
  
  const icon = emoji || getTypeEmoji(type)
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-lg">${icon}</span>
      <span class="font-medium text-white">${message}</span>
    </div>
  `
  
  // Add to DOM
  document.body.appendChild(toast)
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = position === 'top' ? 'translateY(0)' : 'translateY(0)'
    toast.style.opacity = '1'
  })
  
  // Auto remove
  setTimeout(() => {
    toast.style.transform = position === 'top' ? 'translateY(-100%)' : 'translateY(100%)'
    toast.style.opacity = '0'
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }, duration)
  
  return toast
}

function getToastClasses(type, position) {
  const baseClasses = `
    fixed left-4 right-4 z-50 p-4 rounded-xl backdrop-blur-md border
    transform transition-all duration-300 ease-out opacity-0
    shadow-lg max-w-sm mx-auto
  `
  
  const positionClasses = {
    top: 'top-20',
    bottom: 'bottom-20'
  }
  
  const typeClasses = {
    success: 'bg-green-500/20 border-green-400/30 text-green-300',
    error: 'bg-red-500/20 border-red-400/30 text-red-300',
    warning: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300',
    info: 'bg-blue-500/20 border-blue-400/30 text-blue-300'
  }
  
  return `${baseClasses} ${positionClasses[position]} ${typeClasses[type]}`
}

function getTypeEmoji(type) {
  const emojis = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return emojis[type] || '💬'
}

/**
 * Quick feedback functions for common Brazilian UX patterns
 */
export const feedback = {
  success: (message, emoji = '🎉') => showToast(message, { type: 'success', emoji }),
  error: (message, emoji = '😬') => showToast(message, { type: 'error', emoji }),
  loading: (message, emoji = '⏳') => showToast(message, { type: 'info', emoji, duration: 2000 }),
  pix: (message) => showToast(message, { type: 'success', emoji: '💳' }),
  win: (message) => {
    triggerHaptic('success')
    return showToast(message, { type: 'success', emoji: '🏆', duration: 4000 })
  },
  purchase: (message) => {
    triggerHaptic('medium')
    return showToast(message, { type: 'success', emoji: '🛒' })
  }
}

/**
 * Scroll suave para elemento
 */
export function scrollToElement(elementId, offset = 0) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

/**
 * Verificar se element está visível
 */
export function isElementVisible(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Lazy load de imagem
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = reject
    img.src = src
  })
}

/**
 * Formatar tempo restante
 */
export function formatTimeRemaining(seconds) {
  if (seconds <= 0) return '00:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Calcular porcentagem de progresso
 */
export function calculateProgress(current, total) {
  if (total === 0) return 0
  return Math.min(100, Math.max(0, (current / total) * 100))
}

/**
 * Safe JSON parse
 */
export function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str)
  } catch {
    return defaultValue
  }
}

/**
 * Local storage utilities
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  clear() {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}

/**
 * URL utilities
 */
export function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

export function setUrlParam(param, value) {
  const url = new URL(window.location)
  url.searchParams.set(param, value)
  window.history.pushState({}, '', url)
}

/**
 * Animation utilities - LuxDrop inspired
 */
export function animateValue(start, end, duration, callback) {
  const startTime = performance.now()
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = start + (end - start) * easeOut
    
    callback(current)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

/**
 * Smooth card reveal animation (LuxDrop style)
 */
export function animateCardReveal(element, delay = 0) {
  if (!element) return
  
  element.style.opacity = '0'
  element.style.transform = 'translateY(30px) scale(0.95)'
  
  setTimeout(() => {
    element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    element.style.opacity = '1'
    element.style.transform = 'translateY(0) scale(1)'
  }, delay)
}

/**
 * Stagger animation for grids
 */
export function staggerReveal(selector, delayBetween = 100) {
  const elements = document.querySelectorAll(selector)
  elements.forEach((el, index) => {
    animateCardReveal(el, index * delayBetween)
  })
}

/**
 * Scroll-triggered animations
 */
export function observeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el)
  })
}